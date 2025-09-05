#!/usr/bin/env python3
"""
Test script to demonstrate the improved XML validation error handling
"""

import requests
import json
import os

def test_validation():
    """Test the improved validation with sample files"""
    
    # Test with invalid XML files
    test_files = [
        'invalid_xmls/invalid1.xml',
        'invalid_xmls/invalid2.xml',
        'invalid_xmls/invalid3_multi_errors.xml'
    ]
    
    schema_file = 'AE_XSD_schema.xsd'
    
    if not os.path.exists(schema_file):
        print("Schema file not found!")
        return
    
    print("Testing improved XML validation error handling...")
    print("=" * 60)
    
    for xml_file in test_files:
        if not os.path.exists(xml_file):
            print(f"File {xml_file} not found, skipping...")
            continue
            
        print(f"\nTesting file: {xml_file}")
        print("-" * 40)
        
        try:
            # Prepare files for upload
            files = {
                'schema': open(schema_file, 'rb'),
                'xml_files': open(xml_file, 'rb')
            }
            
            # Send validation request
            response = requests.post('http://localhost:5000/validate', files=files)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get('invalid'):
                    for invalid_file in result['invalid']:
                        print(f"File: {invalid_file['filename']}")
                        error = invalid_file['error']
                        
                        print(f"  Error Type: {error.get('type', 'Unknown')}")
                        print(f"  Category: {error.get('category', 'Unknown')}")
                        
                        if error.get('xpath'):
                            print(f"  XPath: {error['xpath']}")
                        
                        if error.get('line'):
                            print(f"  Line: {error['line']}")
                        
                        if error.get('column'):
                            print(f"  Column: {error['column']}")
                        
                        if error.get('element'):
                            print(f"  Element: {error['element']}")
                        
                        if error.get('actual_value'):
                            print(f"  Actual Value: {error['actual_value']}")
                        
                        if error.get('expected'):
                            print(f"  Expected: {error['expected']}")
                        
                        if error.get('arabic_explanation'):
                            print(f"  Arabic Explanation: {error['arabic_explanation']}")
                        
                        if error.get('suggestions'):
                            print("  Suggestions:")
                            for suggestion in error['suggestions']:
                                print(f"    • {suggestion}")
                        
                        print(f"  Message: {error.get('message', 'No message')}")
                        print()
                else:
                    print("  File is valid!")
            else:
                print(f"  Error: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"  Exception: {str(e)}")
        finally:
            # Close files
            files['schema'].close()
            files['xml_files'].close()

if __name__ == "__main__":
    test_validation()
