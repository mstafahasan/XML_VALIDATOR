#!/usr/bin/env python3
"""
Demo script to showcase the improved XML validation error handling
"""

import requests
import json
import os
import time

def demo_improved_validation():
    """Demonstrate the improved validation with enhanced error messages"""
    
    print("🚀 XML Validator - Enhanced Error Handling Demo")
    print("=" * 60)
    print()
    
    # Test with invalid XML files
    test_files = [
        ('invalid_xmls/invalid1.xml', 'Complex validation errors with multiple issues'),
        ('invalid_xmls/invalid2.xml', 'Structure and data type errors'),
        ('invalid_xmls/invalid3_multi_errors.xml', 'Multiple validation errors')
    ]
    
    schema_file = 'AE_XSD_schema.xsd'
    
    if not os.path.exists(schema_file):
        print("❌ Schema file not found!")
        return
    
    print("📋 Testing enhanced XML validation error handling...")
    print("✨ Features: Impressive visuals, Arabic explanations, severity levels, quick fixes")
    print()
    
    for xml_file, description in test_files:
        if not os.path.exists(xml_file):
            print(f"⚠️  File {xml_file} not found, skipping...")
            continue
            
        print(f"🔍 Testing: {xml_file}")
        print(f"📝 Description: {description}")
        print("-" * 50)
        
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
                    for i, invalid_file in enumerate(result['invalid'], 1):
                        print(f"\n📄 File {i}: {invalid_file['filename']}")
                        error = invalid_file['error']
                        
                        # Display enhanced error information
                        print(f"🎯 Error Type: {error.get('title', 'Unknown')}")
                        print(f"🏷️  Icon: {error.get('icon', '❌')}")
                        print(f"⚠️  Severity: {error.get('severity', 'Unknown').upper()}")
                        print(f"📂 Category: {error.get('category', 'Unknown')}")
                        
                        if error.get('xpath'):
                            print(f"📍 XPath: {error['xpath']}")
                        
                        if error.get('line'):
                            print(f"📏 Line: {error['line']}")
                        
                        if error.get('column'):
                            print(f"📐 Column: {error['column']}")
                        
                        if error.get('element'):
                            print(f"🏗️  Element: {error['element']}")
                        
                        if error.get('actual_value'):
                            print(f"💯 Actual Value: {error['actual_value']}")
                        
                        if error.get('expected'):
                            print(f"✅ Expected: {error['expected']}")
                        
                        if error.get('arabic_explanation'):
                            print(f"🇸🇦 Arabic Explanation: {error['arabic_explanation']}")
                        
                        if error.get('english_explanation'):
                            print(f"🇺🇸 English Explanation: {error['english_explanation']}")
                        
                        if error.get('quick_fix'):
                            print(f"💡 Quick Fix: {error['quick_fix']}")
                        
                        if error.get('suggestions'):
                            print("🔧 Detailed Suggestions:")
                            for j, suggestion in enumerate(error['suggestions'], 1):
                                print(f"   {j}. {suggestion}")
                        
                        print(f"🔍 Technical Details: {error.get('message', 'No message')}")
                        print()
                else:
                    print("✅ File is valid!")
            else:
                print(f"❌ Error: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"💥 Exception: {str(e)}")
        finally:
            # Close files
            files['schema'].close()
            files['xml_files'].close()
        
        print("\n" + "="*60 + "\n")
        time.sleep(1)  # Pause between tests

def show_improvements():
    """Show the improvements made to error handling"""
    print("🎉 XML Validator Error Handling Improvements")
    print("=" * 50)
    print()
    print("✨ NEW FEATURES:")
    print("   🎯 Error severity levels (Critical, High, Medium, Low)")
    print("   🏷️  Meaningful icons for each error type")
    print("   🇸🇦 Clear Arabic explanations")
    print("   🇺🇸 English explanations for international users")
    print("   💡 Quick fix suggestions")
    print("   🔧 Detailed step-by-step suggestions")
    print("   📍 Precise XPath location")
    print("   🎨 Beautiful visual design with gradients and shadows")
    print("   📱 Responsive and interactive UI")
    print("   🎭 Hover effects and animations")
    print()
    print("🔧 TECHNICAL IMPROVEMENTS:")
    print("   📊 Enhanced error parsing with better regex patterns")
    print("   🏗️  Improved error categorization")
    print("   🎨 Better CSS styling and typography")
    print("   📱 Mobile-friendly responsive design")
    print("   ⚡ Performance optimizations")
    print()

if __name__ == "__main__":
    show_improvements()
    print("🚀 Starting validation demo...")
    print("Make sure the Flask app is running on http://localhost:5000")
    print()
    input("Press Enter to continue...")
    demo_improved_validation()
