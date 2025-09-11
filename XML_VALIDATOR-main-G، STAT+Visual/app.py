from flask import Flask, request, jsonify, render_template, session, redirect, url_for, send_file
import os
import xmlschema
import sys
import json
from datetime import datetime
from functools import wraps
import zipfile
import io
from werkzeug.utils import secure_filename

# Check if running in an interactive shell (e.g., IPython/Jupyter)
if hasattr(sys, 'ps1') or 'IPYTHON' in os.environ.get('TERM', ''):
    print("Error: This script should not be run in an interactive shell (e.g., IPython or Jupyter).", file=sys.stderr)
    print("Please run it in a standard terminal with 'python app.py'.", file=sys.stderr)
    sys.exit(1)

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this in production!

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'temp_uploads'
app.config['ALLOWED_EXTENSIONS'] = {'xml', 'xsd'}

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# File paths for data storage
MESSAGES_FILE = 'data/contact_messages.json'
ADMIN_CREDENTIALS_FILE = 'data/admin_credentials.json'
DATA_DIR = 'data'

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']



def validate_file_size(file, max_size_mb=16):
    """Validate file size"""
    file.seek(0, 2)  # Seek to end
    size = file.tell()
    file.seek(0)  # Reset to beginning
    return size <= max_size_mb * 1024 * 1024

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

# Error classification and statistics functions
def classify_error(error_message):
    """Classify error type based on error message"""
    error_message_lower = error_message.lower()
    
    # Syntax errors
    if any(keyword in error_message_lower for keyword in ['syntax', 'parse', 'malformed', 'unclosed', 'unexpected']):
        return 'syntax_error'
    
    # Schema validation errors
    elif any(keyword in error_message_lower for keyword in ['schema', 'validation', 'invalid']):
        return 'schema_validation_error'
    
    # Element errors
    elif any(keyword in error_message_lower for keyword in ['element', 'tag', 'child']):
        return 'element_error'
    
    # Attribute errors
    elif any(keyword in error_message_lower for keyword in ['attribute', 'attr']):
        return 'attribute_error'
    
    # Type errors
    elif any(keyword in error_message_lower for keyword in ['type', 'datatype', 'format']):
        return 'type_error'
    
    # Namespace errors
    elif any(keyword in error_message_lower for keyword in ['namespace', 'ns']):
        return 'namespace_error'
    
    # Required field errors
    elif any(keyword in error_message_lower for keyword in ['required', 'missing', 'mandatory']):
        return 'required_field_error'
    
    # Value errors
    elif any(keyword in error_message_lower for keyword in ['value', 'content', 'data']):
        return 'value_error'
    
    # Structure errors
    elif any(keyword in error_message_lower for keyword in ['structure', 'order', 'sequence']):
        return 'structure_error'
    
    # Default
    else:
        return 'unknown_error'

def verify_english_only(text):
    """Verify that text contains only English characters"""
    import re
    # Check for Arabic Unicode range
    arabic_pattern = re.compile(r'[\u0600-\u06FF]')
    return not bool(arabic_pattern.search(text))

def generate_error_explanation(error_details, error_category):
    """Generate clear and user-friendly explanations for validation errors"""
    explanations = {
        'structure': {
            'severity': 'high',
            'icon': '🏗️',
            'title': 'XML Structure Problem',
            'explanation': '**What went wrong**: An XML element is missing or in the wrong place',
            'user_friendly_explanation': 'The XML file has a structural issue. This usually means a required element is missing, or elements are in the wrong order according to the schema rules.',
            'suggestions': [
                '✅ Make sure all required elements are present',
                '🔍 Check that elements are in the correct order',
                '🔒 Ensure all tags are properly closed',
                '📋 Review the schema to understand the correct structure'
            ],
            'quick_fix': 'Add the missing element or move it to the correct position'
        },
        'data_type': {
            'severity': 'medium',
            'icon': '🔢',
            'title': 'Data Type Mismatch',
            'explanation': '**What went wrong**: The value doesn\'t match the expected data type',
            'user_friendly_explanation': 'The value you provided doesn\'t match what the schema expects. For example, you might have provided text when a number was required, or a date in the wrong format.',
            'suggestions': [
                '📊 Check what data type is expected (text, number, date, etc.)',
                '🎯 Make sure the value format is correct',
                '📏 Review any restrictions on the values',
                '🔍 Use appropriate converters if needed'
            ],
            'quick_fix': 'Change the value to match the expected data type'
        },
        'attribute': {
            'severity': 'high',
            'icon': '🏷️',
            'title': 'Attribute Problem',
            'explanation': '**What went wrong**: A required attribute is missing or has an invalid value',
            'user_friendly_explanation': 'XML attributes are like properties of elements. This error means either a required attribute is missing, or an attribute has an invalid value.',
            'suggestions': [
                '➕ Add all required attributes',
                '✏️ Check that attribute names are correct',
                '💯 Ensure attribute values are valid',
                '📝 Review the schema for required attributes'
            ],
            'quick_fix': 'Add the missing attribute or fix its value'
        },
        'value': {
            'severity': 'medium',
            'icon': '📊',
            'title': 'Value Out of Range',
            'explanation': '**What went wrong**: The value is outside the allowed range or doesn\'t meet constraints',
            'user_friendly_explanation': 'The value you provided doesn\'t meet the rules defined in the schema. This could be a number that\'s too big or too small, or text that\'s too long or too short.',
            'suggestions': [
                '📈 Check the minimum and maximum allowed values',
                '🎯 Ensure the value format is correct',
                '📋 Review any constraints on the values',
                '🔢 Use values within the specified range'
            ],
            'quick_fix': 'Change the value to be within the allowed range'
        },
        'syntax': {
            'severity': 'critical',
            'icon': '🔧',
            'title': 'XML Syntax Error',
            'explanation': '**What went wrong**: The XML file is not properly formatted',
            'user_friendly_explanation': 'This is a fundamental XML formatting issue. The file doesn\'t follow basic XML rules, which prevents it from being processed correctly.',
            'suggestions': [
                '🔒 Make sure all tags are properly closed',
                '🔤 Check character encoding is correct',
                '🚫 Remove any invalid characters',
                '📐 Review basic XML formatting rules'
            ],
            'quick_fix': 'Fix the XML formatting to make it valid'
        },
        'general': {
            'severity': 'medium',
            'icon': '❓',
            'title': 'Validation Error',
            'explanation': '**What went wrong**: The XML doesn\'t match the schema requirements',
            'user_friendly_explanation': 'The XML file doesn\'t conform to the rules defined in the schema. This could be due to various issues that need to be addressed.',
            'suggestions': [
                '🔍 Review the file for obvious issues',
                '📋 Check the schema requirements',
                '✅ Ensure all rules are followed',
                '🆘 Consult documentation for help'
            ],
            'quick_fix': 'Review the file and schema requirements'
        }
    }
    
    # Get base explanation
    category_info = explanations.get(error_category, explanations['general'])
    
    # Add specific suggestions based on error content
    specific_suggestions = []
    error_message = error_details.get('message', '').lower()
    
    if 'negative' in error_message or 'min' in error_message:
        specific_suggestions.append('🔢 Make sure the value is greater than or equal to the minimum required')
    
    if 'max' in error_message or 'exceed' in error_message:
        specific_suggestions.append('📊 Ensure the value is less than or equal to the maximum allowed')
    
    if 'required' in error_message or 'missing' in error_message:
        specific_suggestions.append('➕ Make sure all required elements and attributes are present')
    
    if 'invalid' in error_message and 'unit' in error_message:
        specific_suggestions.append('📏 Check that the unit of measurement is valid')
    
    if 'boolean' in error_message:
        specific_suggestions.append('✅ Use only true or false for boolean values')
    
    if 'enumeration' in error_message or 'choice' in error_message:
        specific_suggestions.append('🎯 Choose a value from the allowed list only')
    
    if 'format' in error_message or 'pattern' in error_message:
        specific_suggestions.append('📝 Make sure the data format is correct')
    
    if 'length' in error_message:
        specific_suggestions.append('📐 Check the length of text or value')
    
    # Combine base suggestions with specific ones
    all_suggestions = category_info['suggestions'] + specific_suggestions
    
    # Verify all text is English-only
    result = {
        'severity': category_info['severity'],
        'icon': category_info['icon'],
        'title': category_info['title'],
        'explanation': category_info['explanation'],
        'user_friendly_explanation': category_info['user_friendly_explanation'],
        'suggestions': all_suggestions[:6],  # Limit to 6 suggestions
        'quick_fix': category_info['quick_fix']
    }
    
    # Ensure all text content is English-only
    for key, value in result.items():
        if isinstance(value, str):
            if not verify_english_only(value):
                # Replace any non-English text with English equivalent
                result[key] = value.replace('خطأ', 'Error').replace('مشكلة', 'Problem')
        elif isinstance(value, list):
            result[key] = [item.replace('خطأ', 'Error').replace('مشكلة', 'Problem') if isinstance(item, str) else item for item in value]
    
    return result

def calculate_error_statistics(invalid_results):
    """Calculate error statistics and percentages"""
    if not invalid_results:
        return {
            'total_errors': 0,
            'error_types': {},
            'error_percentages': {},
            'total_files': 0
        }
    
    error_counts = {}
    total_files = len(invalid_results)
    
    # Count errors by type
    for result in invalid_results:
        error_type = classify_error(result['error']['message'])
        error_counts[error_type] = error_counts.get(error_type, 0) + 1
    
    # Calculate percentages
    error_percentages = {}
    total_errors = sum(error_counts.values())
    
    for error_type, count in error_counts.items():
        percentage = (count / total_errors) * 100 if total_errors > 0 else 0
        error_percentages[error_type] = round(percentage, 2)
    
    return {
        'total_errors': total_errors,
        'error_types': error_counts,
        'error_percentages': error_percentages,
        'total_files': total_files
    }

def get_error_type_display_name(error_type):
    """Get display name for error type"""
    display_names = {
        'syntax_error': 'Syntax Error',
        'schema_validation_error': 'Schema Validation Error',
        'element_error': 'Element Error',
        'attribute_error': 'Attribute Error',
        'type_error': 'Type Error',
        'namespace_error': 'Namespace Error',
        'required_field_error': 'Required Field Error',
        'value_error': 'Value Error',
        'structure_error': 'Structure Error',
        'unknown_error': 'Unknown Error'
    }
    return display_names.get(error_type, error_type)

# Admin authentication decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            return jsonify({'error': 'Admin authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

# ... existing code ...

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
        
        # Validate file types
        if not allowed_file(schema_file.filename):
            return jsonify({'error': 'Invalid schema file type. Only .xsd files are allowed'}), 400
        
        for xml_file in xml_files:
            if not allowed_file(xml_file.filename):
                return jsonify({'error': f'Invalid file type: {xml_file.filename}. Only .xml files are allowed'}), 400
        
        # Validate file sizes
        if not validate_file_size(schema_file):
            return jsonify({'error': 'Schema file is too large. Maximum size is 16MB'}), 400
        
        for xml_file in xml_files:
            if not validate_file_size(xml_file):
                return jsonify({'error': f'File {xml_file.filename} is too large. Maximum size is 16MB'}), 400
        
        # Save schema temporarily
        schema_filename = secure_filename(schema_file.filename)
        schema_path = os.path.join(app.config['UPLOAD_FOLDER'], f'temp_{schema_filename}')
        schema_file.save(schema_path)
        
        # Get file size efficiently
        schema_size = os.path.getsize(schema_path)
        
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
                    # Get file size efficiently
                    xml_file.seek(0, 2)
                    file_size = xml_file.tell()
                    xml_file.seek(0)
                    
                    # Validate XML against schema
                    schema.validate(xml_file)
                    results['valid'].append({
                        'filename': xml_file.filename,
                        'size': file_size
                    })
                except Exception as e:
                    # If validation fails, add it to invalid results
                    error_info = str(e)
                    
                    # Determine error type based on exception class
                    error_type = 'validation_error'
                    error_category = 'general'
                    if 'XMLSchemaChildrenValidationError' in str(type(e)):
                        error_type = 'children_validation_error'
                        error_category = 'structure'
                    elif 'XMLSchemaTypeValidationError' in str(type(e)):
                        error_type = 'type_validation_error'
                        error_category = 'data_type'
                    elif 'XMLSchemaAttributeValidationError' in str(type(e)):
                        error_type = 'attribute_validation_error'
                        error_category = 'attribute'
                    elif 'XMLSchemaValueValidationError' in str(type(e)):
                        error_type = 'value_validation_error'
                        error_category = 'value'
                    elif 'XMLSchemaParseError' in str(type(e)):
                        error_type = 'parse_error'
                        error_category = 'syntax'
                    
                    # Enhanced error parsing with better regex patterns
                    error_details = {
                        'message': error_info,
                        'type': error_type,
                        'category': error_category,
                        'timestamp': datetime.now().isoformat()
                    }
                    
                    # Extract XPath if available
                    xpath = ''
                    if hasattr(e, 'path') and e.path:
                        xpath = str(e.path)
                    elif 'path:' in error_info.lower():
                        try:
                            import re
                            path_match = re.search(r'path:\s*([^\n]+)', error_info, re.IGNORECASE)
                            if path_match:
                                xpath = path_match.group(1).strip()
                        except:
                            pass
                    
                    if xpath:
                        error_details['xpath'] = xpath
                    
                    # Try to extract line number if available
                    if 'line' in error_info.lower():
                        try:
                            import re
                            line_match = re.search(r'line\s+(\d+)', error_info, re.IGNORECASE)
                            if line_match:
                                error_details['line'] = int(line_match.group(1))
                        except:
                            pass
                    
                    # Try to extract column number if available
                    if 'column' in error_info.lower():
                        try:
                            import re
                            col_match = re.search(r'column\s+(\d+)', error_info, re.IGNORECASE)
                            if col_match:
                                error_details['column'] = int(col_match.group(1))
                        except:
                            pass
                    
                    # Enhanced element name extraction
                    element_name = ''
                    if 'element' in error_info.lower():
                        try:
                            import re
                            # Try multiple patterns for element names
                            patterns = [
                                r'element\s+["\']([^"\']+)["\']',
                                r'Element\s+["\']([^"\']+)["\']',
                                r'<([^/>\s]+)',
                                r'Invalid element:?\s*["\']?([^"\':\s]+)["\']?'
                            ]
                            for pattern in patterns:
                                element_match = re.search(pattern, error_info, re.IGNORECASE)
                                if element_match:
                                    element_name = element_match.group(1)
                                    break
                        except:
                            pass
                    
                    if element_name:
                        error_details['element'] = element_name
                    
                    # Enhanced tag name extraction
                    tag_name = ''
                    if 'tag' in error_info.lower():
                        try:
                            import re
                            patterns = [
                                r'tag\s+["\']([^"\']+)["\']',
                                r'Tag\s+["\']([^"\']+)["\']',
                                r'Invalid tag:?\s*["\']?([^"\':\s]+)["\']?'
                            ]
                            for pattern in patterns:
                                tag_match = re.search(pattern, error_info, re.IGNORECASE)
                                if tag_match:
                                    tag_name = tag_match.group(1)
                                    break
                        except:
                            pass
                    
                    if tag_name:
                        error_details['tag'] = tag_name
                    
                    # Enhanced expected values extraction
                    if 'expected' in error_info.lower():
                        try:
                            import re
                            patterns = [
                                r'expected[^:]*:\s*([^.\n]+)',
                                r'Expected[^:]*:\s*([^.\n]+)',
                                r'must be one of:\s*([^.\n]+)',
                                r'valid values are:\s*([^.\n]+)'
                            ]
                            for pattern in patterns:
                                expected_match = re.search(pattern, error_info, re.IGNORECASE)
                                if expected_match:
                                    error_details['expected'] = expected_match.group(1).strip()
                                    break
                        except:
                            pass
                    
                    # Extract actual value if available
                    if 'value' in error_info.lower() or 'actual' in error_info.lower():
                        try:
                            import re
                            patterns = [
                                r'value\s+["\']?([^"\':\s]+)["\']?',
                                r'actual[^:]*:\s*["\']?([^"\':\s]+)["\']?',
                                r'found\s+["\']?([^"\':\s]+)["\']?'
                            ]
                            for pattern in patterns:
                                value_match = re.search(pattern, error_info, re.IGNORECASE)
                                if value_match:
                                    error_details['actual_value'] = value_match.group(1)
                                    break
                        except:
                            pass
                    
                    # Generate English explanations and suggestions based on error type
                    error_details.update(generate_error_explanation(error_details, error_category))
                    
                    # Add structured technical information for developers
                    error_details['technical_info'] = {
                        'error_class': str(type(e).__name__),
                        'validation_rule': error_type,
                        'schema_location': xpath if xpath else 'Not available',
                        'xml_location': f"Line {error_details.get('line', 'N/A')}, Column {error_details.get('column', 'N/A')}" if error_details.get('line') else 'Not available',
                        'element_context': {
                            'element_name': error_details.get('element', 'Unknown'),
                            'parent_element': 'See XPath for full context',
                            'attribute_name': error_details.get('tag', 'N/A')
                        },
                        'validation_context': {
                            'expected_type': error_details.get('expected', 'See schema definition'),
                            'actual_value': error_details.get('actual_value', 'Not provided'),
                            'constraint_violated': 'See error message for details'
                        }
                    }
                    
                    results['invalid'].append({
                        'filename': xml_file.filename,
                        'size': file_size,
                        'error': error_details
                    })
            
        except Exception as e:
            return jsonify({'error': f'Schema error: {str(e)}'}), 400
        finally:
            # Clean up temporary schema file
            if os.path.exists(schema_path):
                os.remove(schema_path)
        
        # Calculate error statistics
        error_stats = calculate_error_statistics(results['invalid'])
        
        # Add statistics to results
        results['statistics'] = error_stats
        
        # Verify all response content is English-only
        def verify_response_english(data):
            if isinstance(data, dict):
                return {k: verify_response_english(v) for k, v in data.items()}
            elif isinstance(data, list):
                return [verify_response_english(item) for item in data]
            elif isinstance(data, str):
                # Apply English-only verification
                result = data
                replacements = {
                    'خطأ': 'Error',
                    'مشكلة': 'Problem',
                    'الحل': 'Solution',
                    'تأكد': 'Make sure',
                    'تحقق': 'Check',
                    'راجع': 'Review',
                    'استخدم': 'Use',
                    'اختر': 'Choose',
                    'أضف': 'Add',
                    'صحح': 'Fix',
                    'غيّر': 'Change'
                }
                for arabic, english in replacements.items():
                    result = result.replace(arabic, english)
                return result
            else:
                return data
        
        # Apply English-only verification to entire response
        results = verify_response_english(results)
        
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
        
        # Basic email validation
        if '@' not in data['email'] or '.' not in data['email']:
            return jsonify({'error': 'Invalid email format'}), 400
        
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
        app.run(debug=True, host='0.0.0.0', port=5001)
    except Exception as e:
        print(f"Failed to start server: {str(e)}", file=sys.stderr)
        sys.exit(1)