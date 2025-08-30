from flask import Flask, request, jsonify, render_template
import os
import xmlschema
import sys

# Check if running in an interactive shell (e.g., IPython/Jupyter)
if hasattr(sys, 'ps1') or 'IPYTHON' in os.environ.get('TERM', ''):
    print("Error: This script should not be run in an interactive shell (e.g., IPython or Jupyter).", file=sys.stderr)
    print("Please run it in a standard terminal with 'python app.py'.", file=sys.stderr)
    sys.exit(1)

app = Flask(__name__, template_folder='templates', static_folder='static')  # Explicitly set template and static folders

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/support')
def support():
    return render_template('support.html')

@app.route('/validate', methods=['POST'])
def validate():
    try:
        if 'schema' not in request.files or not request.files['schema']:
            return jsonify({'error': 'No schema file uploaded'}), 400
        
        schema_file = request.files['schema']
        try:
            schema = xmlschema.XMLSchema(schema_file)
        except xmlschema.XMLSchemaException as e:
            return jsonify({'error': f'Invalid schema file: {str(e)}'}), 400
        
        results = {'schema': 'Schema loaded successfully from AE_XSD_schema.xsd.xml', 'valid': [], 'invalid': []}
        
        for file in request.files.getlist('valid'):
            is_valid = schema.is_valid(file)
            result = {'name': file.filename, 'status': 'VALID' if is_valid else 'INVALID'}
            if not is_valid:
                try:
                    schema.validate(file)
                except xmlschema.XMLSchemaValidationError as err:
                    result['error'] = str(err)
            results['valid'].append(result)
        
        for file in request.files.getlist('invalid'):
            is_valid = schema.is_valid(file)
            result = {'name': file.filename, 'status': 'VALID' if is_valid else 'INVALID'}
            if not is_valid:
                try:
                    schema.validate(file)
                except xmlschema.XMLSchemaValidationError as err:
                    result['error'] = str(err)
            results['invalid'].append(result)
        
        return jsonify(results)
    
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    print("Starting Flask app...")
    try:
        app.run(debug=True, host='0.0.0.0', port=5000)
    except Exception as e:
        print(f"Failed to start server: {str(e)}", file=sys.stderr)
        sys.exit(1)