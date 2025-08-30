from flask import Flask, request, jsonify, render_template, session, redirect, url_for, send_file
import os
import xmlschema
import sys
import json
from datetime import datetime
from functools import wraps
import zipfile
import io

# Check if running in an interactive shell (e.g., IPython/Jupyter)
if hasattr(sys, 'ps1') or 'IPYTHON' in os.environ.get('TERM', ''):
    print("Error: This script should not be run in an interactive shell (e.g., IPython or Jupyter).", file=sys.stderr)
    print("Please run it in a standard terminal with 'python app.py'.", file=sys.stderr)
    sys.exit(1)

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this in production!

# File paths for data storage
MESSAGES_FILE = 'data/contact_messages.json'
ADMIN_CREDENTIALS_FILE = 'data/admin_credentials.json'
DATA_DIR = 'data'

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# Initialize files if they don't exist
def init_data_files():
    if not os.path.exists(MESSAGES_FILE):
        with open(MESSAGES_FILE, 'w') as f:
            json.dump([], f)
    
    if not os.path.exists(ADMIN_CREDENTIALS_FILE):
        default_admin = {
            "username": "admin",
            "password": "admin123",  # Change this in production!
            "email": "admin@project.com"
        }
        with open(ADMIN_CREDENTIALS_FILE, 'w') as f:
            json.dump(default_admin, f)

# Load messages from file
def load_messages():
    try:
        with open(MESSAGES_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

# Save messages to file
def save_messages(messages):
    with open(MESSAGES_FILE, 'w') as f:
        json.dump(messages, f, indent=2, default=str)

# Load admin credentials
def load_admin_credentials():
    try:
        with open(ADMIN_CREDENTIALS_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"username": "admin", "password": "admin123", "email": "admin@project.com"}

# Admin authentication decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            return jsonify({'error': 'Admin authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

# Initialize data files
init_data_files()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('index.html')

@app.route('/support')
def support():
    return render_template('index.html')

@app.route('/validate', methods=['POST'])
def validate_xml():
    try:
        # Get uploaded files
        schema_file = request.files.get('schema')
        xml_files = request.files.getlist('xml_files')
        
        if not schema_file:
            return jsonify({'error': 'Schema file is required'}), 400
        
        if len(xml_files) == 0:
            return jsonify({'error': 'At least one XML file is required'}), 400
        
        # Save schema temporarily
        schema_path = 'temp_schema.xsd'
        schema_file.save(schema_path)
        
        # Get file size by reading content length
        schema_content = schema_file.read()
        schema_size = len(schema_content)
        schema_file.seek(0)  # Reset file pointer
        
        results = {
            'schema': {
                'filename': schema_file.filename,
                'size': schema_size
            },
            'valid': [],
            'invalid': []
        }
        
        try:
            # Load schema
            schema = xmlschema.XMLSchema(schema_path)
            
            # Validate all XML files
            for xml_file in xml_files:
                try:
                    # Get file size
                    file_content = xml_file.read()
                    file_size = len(file_content)
                    xml_file.seek(0)  # Reset file pointer
                    
                    # Validate XML against schema
                    schema.validate(xml_file)
                    results['valid'].append({
                        'filename': xml_file.filename,
                        'size': file_size
                    })
                except Exception as e:
                    # If validation fails, add it to invalid results
                    results['invalid'].append({
                        'filename': xml_file.filename,
                        'size': file_size,
                        'error': str(e)
                    })
            
        except Exception as e:
            return jsonify({'error': f'Schema error: {str(e)}'}), 400
        finally:
            # Clean up temporary schema file
            if os.path.exists(schema_path):
                os.remove(schema_path)
        
        return jsonify(results)
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# Contact form submission
@app.route('/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Load existing messages
        messages = load_messages()
        
        # Create message object
        message = {
            'id': len(messages) + 1,
            'name': data['name'],
            'email': data['email'],
            'subject': data['subject'],
            'message': data['message'],
            'timestamp': datetime.now().isoformat(),
            'status': 'new',
            'category': 'general',
            'priority': 'normal',
            'admin_notes': '',
            'replied_at': None,
            'replied_by': None
        }
        
        # Add message to list
        messages.append(message)
        
        # Save to file
        save_messages(messages)
        
        return jsonify({
            'success': True,
            'message': 'Contact form submitted successfully',
            'message_id': message['id']
        })
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# Admin login
@app.route('/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        
        credentials = load_admin_credentials()
        
        if username == credentials['username'] and password == credentials['password']:
            session['admin_logged_in'] = True
            session['admin_username'] = username
            return jsonify({
                'success': True,
                'message': 'Login successful'
            })
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# Admin logout
@app.route('/admin/logout', methods=['POST'])
def admin_logout():
    session.pop('admin_logged_in', None)
    session.pop('admin_username', None)
    return jsonify({'success': True, 'message': 'Logout successful'})

# Get all messages (admin only)
@app.route('/admin/messages', methods=['GET'])
@admin_required
def get_admin_messages():
    try:
        messages = load_messages()
        
        # Add statistics
        stats = {
            'total': len(messages),
            'new': len([m for m in messages if m['status'] == 'new']),
            'read': len([m for m in messages if m['status'] == 'read']),
            'replied': len([m for m in messages if m['status'] == 'replied']),
            'closed': len([m for m in messages if m['status'] == 'closed'])
        }
        
        return jsonify({
            'success': True,
            'messages': messages,
            'stats': stats
        })
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# Get specific message (admin only)
@app.route('/admin/message/<int:message_id>', methods=['GET'])
@admin_required
def get_admin_message(message_id):
    try:
        messages = load_messages()
        message = next((msg for msg in messages if msg['id'] == message_id), None)
        
        if message:
            return jsonify({
                'success': True,
                'message': message
            })
        else:
            return jsonify({'error': 'Message not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# Update message (admin only)
@app.route('/admin/message/<int:message_id>', methods=['PUT'])
@admin_required
def update_admin_message(message_id):
    try:
        data = request.get_json()
        messages = load_messages()
        
        message = next((msg for msg in messages if msg['id'] == message_id), None)
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        # Update allowed fields
        allowed_fields = ['status', 'category', 'priority', 'admin_notes']
        for field in allowed_fields:
            if field in data:
                message[field] = data[field]
        
        # Update timestamp if status changed
        if 'status' in data:
            message['updated_at'] = datetime.now().isoformat()
        
        # Save updated messages
        save_messages(messages)
        
        return jsonify({
            'success': True,
            'message': 'Message updated successfully',
            'updated_message': message
        })
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# Reply to message (admin only)
@app.route('/admin/message/<int:message_id>/reply', methods=['POST'])
@admin_required
def reply_to_message(message_id):
    try:
        data = request.get_json()
        reply_text = data.get('reply')
        
        if not reply_text:
            return jsonify({'error': 'Reply text is required'}), 400
        
        messages = load_messages()
        message = next((msg for msg in messages if msg['id'] == message_id), None)
        
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        # Update message with reply
        message['status'] = 'replied'
        message['replied_at'] = datetime.now().isoformat()
        message['replied_by'] = session.get('admin_username', 'admin')
        message['admin_reply'] = reply_text
        message['updated_at'] = datetime.now().isoformat()
        
        # Save updated messages
        save_messages(messages)
        
        # In production, send email notification to user here
        
        return jsonify({
            'success': True,
            'message': 'Reply sent successfully',
            'updated_message': message
        })
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# Delete message (admin only)
@app.route('/admin/message/<int:message_id>', methods=['DELETE'])
@admin_required
def delete_message(message_id):
    try:
        messages = load_messages()
        message = next((msg for msg in messages if msg['id'] == message_id), None)
        
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        # Remove message
        messages = [msg for msg in messages if msg['id'] != message_id]
        
        # Save updated messages
        save_messages(messages)
        
        return jsonify({
            'success': True,
            'message': 'Message deleted successfully'
        })
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# Get message statistics (admin only)
@app.route('/admin/stats', methods=['GET'])
@admin_required
def get_message_stats():
    try:
        messages = load_messages()
        
        # Calculate statistics
        stats = {
            'total_messages': len(messages),
            'status_breakdown': {},
            'category_breakdown': {},
            'priority_breakdown': {},
            'recent_activity': []
        }
        
        # Status breakdown
        for message in messages:
            status = message.get('status', 'unknown')
            stats['status_breakdown'][status] = stats['status_breakdown'].get(status, 0) + 1
            
            category = message.get('category', 'general')
            stats['category_breakdown'][category] = stats['category_breakdown'].get(category, 0) + 1
            
            priority = message.get('priority', 'normal')
            stats['priority_breakdown'][priority] = stats['priority_breakdown'].get(priority, 0) + 1
        
        # Recent activity (last 10 messages)
        recent_messages = sorted(messages, key=lambda x: x['timestamp'], reverse=True)[:10]
        stats['recent_activity'] = [
            {
                'id': msg['id'],
                'subject': msg['subject'],
                'status': msg['status'],
                'timestamp': msg['timestamp']
            }
            for msg in recent_messages
        ]
        
        return jsonify({
            'success': True,
            'stats': stats
        })
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# Download sample files
@app.route('/download-samples')
def download_samples():
    try:
        # Create a zip file in memory
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            # Add XSD schema
            if os.path.exists('AE_XSD_schema.xsd'):
                zip_file.write('AE_XSD_schema.xsd', 'AE_XSD_schema.xsd')
            
            # Add valid XML samples
            valid_dir = 'valid_xmls'
            if os.path.exists(valid_dir):
                for filename in os.listdir(valid_dir):
                    if filename.endswith('.xml'):
                        file_path = os.path.join(valid_dir, filename)
                        zip_file.write(file_path, f'valid_samples/{filename}')
            
            # Add invalid XML samples
            invalid_dir = 'invalid_xmls'
            if os.path.exists(invalid_dir):
                for filename in os.listdir(invalid_dir):
                    if filename.endswith('.xml'):
                        file_path = os.path.join(invalid_dir, filename)
                        zip_file.write(file_path, f'invalid_samples/{filename}')
            
            # Add README file
            readme_content = """XML Schema Validator - Sample Files

This zip contains sample files for testing the XML Schema Validator:

1. AE_XSD_schema.xsd - The main XSD schema file
2. valid_samples/ - Contains XML files that should pass validation
3. invalid_samples/ - Contains XML files that should fail validation

To use these samples:
1. Upload the XSD schema file first
2. Upload any XML files you want to validate
3. Click "Start Validation" to see the results

The validator will automatically determine if each XML file is valid or invalid based on the schema.
"""
            zip_file.writestr('README.txt', readme_content)
        
        # Reset buffer position
        zip_buffer.seek(0)
        
        return send_file(
            zip_buffer,
            mimetype='application/zip',
            as_attachment=True,
            download_name='xml_validator_samples.zip'
        )
        
    except Exception as e:
        return jsonify({'error': f'Failed to create sample files: {str(e)}'}), 500

if __name__ == '__main__':
    try:
        print("Starting Flask server...")
        app.run(debug=True, host='0.0.0.0', port=5000)
    except Exception as e:
        print(f"Failed to start server: {str(e)}", file=sys.stderr)
        sys.exit(1)