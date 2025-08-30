from flask import Flask, request, jsonify, render_template, session, redirect, url_for
import os
import xmlschema
import sys
import json
from datetime import datetime
from functools import wraps

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
        valid_files = request.files.getlist('valid')
        invalid_files = request.files.getlist('invalid')
        
        if not schema_file:
            return jsonify({'error': 'Schema file is required'}), 400
        
        if len(valid_files) == 0 and len(invalid_files) == 0:
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
            
            # Validate valid XML files
            for xml_file in valid_files:
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
                    # If a "valid" file fails validation, add it to invalid results
                    results['invalid'].append({
                        'filename': xml_file.filename,
                        'size': file_size,
                        'error': str(e)
                    })
            
            # Validate invalid XML files (these should fail validation)
            for xml_file in invalid_files:
                try:
                    # Get file size
                    file_content = xml_file.read()
                    file_size = len(file_content)
                    xml_file.seek(0)  # Reset file pointer
                    
                    # Validate XML against schema
                    schema.validate(xml_file)
                    # If an "invalid" file passes validation, add it to valid results
                    results['valid'].append({
                        'filename': xml_file.filename,
                        'size': file_size
                    })
                except Exception as e:
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

if __name__ == '__main__':
    try:
        print("Starting Flask server...")
        app.run(debug=True, host='0.0.0.0', port=5000)
    except Exception as e:
        print(f"Failed to start server: {str(e)}", file=sys.stderr)
        sys.exit(1)