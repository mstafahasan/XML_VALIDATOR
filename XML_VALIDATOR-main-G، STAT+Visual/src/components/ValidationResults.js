import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ChevronDown, ChevronRight, FileText, Info } from 'lucide-react';
import ErrorStatistics from './ErrorStatistics';

// Helper functions for error severity styling
const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return '#dc3545';
    case 'high': return '#fd7e14';
    case 'medium': return '#ffc107';
    case 'low': return '#28a745';
    default: return '#6c757d';
  }
};

const getSeverityBackground = (severity) => {
  switch (severity) {
    case 'critical': return '#f8d7da';
    case 'high': return '#fff3cd';
    case 'medium': return '#fff3cd';
    case 'low': return '#d4edda';
    default: return '#f8f9fa';
  }
};

// Helper function to ensure English-only text
const ensureEnglishOnly = (text) => {
  if (typeof text !== 'string') return text;
  
  // Replace common Arabic words with English equivalents
  const replacements = {
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
    'غيّر': 'Change',
    'راجع': 'Review'
  };
  
  let result = text;
  Object.entries(replacements).forEach(([arabic, english]) => {
    result = result.replace(new RegExp(arabic, 'g'), english);
  });
  
  return result;
};

const ResultsContainer = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
`;

const ResultsHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ResultsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ResultsSubtitle = styled.p`
  color: #666;
  font-size: 1rem;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ResultCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  &.valid {
    background: #10b981;
  }
  
  &.invalid {
    background: #ef4444;
  }
  
  &.info {
    background: #3b82f6;
  }
`;

const FileCount = styled.span`
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const FileList = styled.div`
  margin-top: 1rem;
`;

const FileItem = styled(motion.div)`
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
`;

const FileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FileName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const FileStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  
  &.valid {
    color: #10b981;
  }
  
  &.invalid {
    color: #ef4444;
  }
`;

const FileSize = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
`;

const ErrorDetails = styled(motion.div)`
  margin-top: 1rem;
  padding: 1.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #dc2626;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ErrorHeader = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #fecaca;
  font-size: 1rem;
  color: #991b1b;
`;

const ErrorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ErrorItem = styled.div`
  ${props => props.fullWidth && `
    grid-column: 1 / -1;
  `}
`;

const ErrorLabel = styled.div`
  font-weight: 600;
  color: #991b1b;
  margin-bottom: 0.25rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ErrorValue = styled.div`
  background: white;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #fecaca;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.85rem;
  
  &.line-number {
    color: #dc2626;
    font-weight: 600;
  }
  
  &.column-number {
    color: #ea580c;
    font-weight: 600;
  }
  
  &.element-name {
    color: #059669;
    font-weight: 600;
  }
  
  &.error-message {
    color: #1f2937;
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  &.timestamp {
    color: #6b7280;
    font-size: 0.8rem;
  }
  
  &.xpath {
    color: #7c3aed;
    background: #faf5ff;
    border: 1px solid #d8b4fe;
    font-weight: 500;
  }
  
  &.error-category {
    color: #ea580c;
    background: #fff7ed;
    border: 1px solid #fed7aa;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }
  
  &.actual-value {
    color: #dc2626;
    background: #fef2f2;
    border: 1px solid #fecaca;
    font-weight: 500;
  }
  
  &.explanation {
    color: #2c3e50;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    font-weight: 600;
    line-height: 1.6;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  &.user-friendly-explanation {
    color: #495057;
    background: #e8f4fd;
    border: 1px solid #b3d9ff;
    border-left: 4px solid #2196f3;
    font-weight: 500;
    line-height: 1.5;
  }
  
  &.quick-fix {
    color: #28a745;
    background: #d4edda;
    border: 1px solid #c3e6cb;
    border-right: 4px solid #28a745;
    font-weight: 600;
  }
  
  &.error-title {
    font-weight: 700;
    font-size: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  &.error-type {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    &.children_validation_error {
      color: #dc2626;
    }
    
    &.type_validation_error {
      color: #ea580c;
    }
    
    &.attribute_validation_error {
      color: #d97706;
    }
    
    &.value_validation_error {
      color: #059669;
    }
    
    &.parse_error {
      color: #7c3aed;
    }
    
    &.validation_error {
      color: #dc2626;
    }
  }
  
  &.invalid-tag {
    color: #dc2626;
    font-weight: 600;
  }
  
  &.expected-tags {
    color: #059669;
    font-weight: 600;
  }
  
  &.xml-path {
    color: #1f2937;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.8rem;
    background: #f3f4f6;
    padding: 0.5rem;
    border-radius: 4px;
  }
`;

const SchemaInfo = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const SchemaText = styled.p`
  color: #1e40af;
  font-size: 0.875rem;
  margin: 0;
`;

const ValidationResults = ({ results }) => {
  const [expandedFiles, setExpandedFiles] = useState(new Set());

  const toggleFileExpansion = (fileName) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(fileName)) {
      newExpanded.delete(fileName);
    } else {
      newExpanded.add(fileName);
    }
    setExpandedFiles(newExpanded);
  };

  if (!results) return null;

  return (
    <ResultsContainer>
      <ResultsHeader>
        <ResultsTitle>Validation Results</ResultsTitle>
        <ResultsSubtitle>
          {results.schema && (
            <SchemaInfo>
              <SchemaText>
                <Info size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Schema: {results.schema.filename} ({results.schema.size} bytes)
              </SchemaText>
            </SchemaInfo>
          )}
        </ResultsSubtitle>
      </ResultsHeader>

      <ResultsGrid>
        {results.valid && results.valid.length > 0 && (
          <ResultCard>
            <CardHeader>
              <CardTitle>
                <CardIcon className="valid">
                  <CheckCircle size={20} />
                </CardIcon>
                Valid Files
              </CardTitle>
              <FileCount>{results.valid.length}</FileCount>
            </CardHeader>
            <FileList>
              <AnimatePresence>
                {results.valid.map((file, index) => (
                  <FileItem
                    key={`valid-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FileHeader>
                      <FileName>
                        <FileText size={16} />
                        {file.filename}
                      </FileName>
                      <FileStatus className="valid">
                        <CheckCircle size={16} />
                        Valid
                      </FileStatus>
                    </FileHeader>
                    <FileSize>Size: {file.size} bytes</FileSize>
                  </FileItem>
                ))}
              </AnimatePresence>
            </FileList>
          </ResultCard>
        )}

        {results.invalid && results.invalid.length > 0 && (
          <ResultCard>
            <CardHeader>
              <CardTitle>
                <CardIcon className="invalid">
                  <XCircle size={20} />
                </CardIcon>
                Invalid Files
              </CardTitle>
              <FileCount>{results.invalid.length}</FileCount>
            </CardHeader>
            <FileList>
              <AnimatePresence>
                {results.invalid.map((file, index) => (
                  <FileItem
                    key={`invalid-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => toggleFileExpansion(file.filename)}
                  >
                    <FileHeader>
                      <FileName>
                        <FileText size={16} />
                        {file.filename}
                      </FileName>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileStatus className="invalid">
                          <XCircle size={16} />
                          Invalid
                        </FileStatus>
                        <ExpandButton>
                          {expandedFiles.has(file.filename) ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </ExpandButton>
                      </div>
                    </FileHeader>
                    
                    <FileSize>Size: {file.size} bytes</FileSize>
                    
                    <AnimatePresence>
                      {expandedFiles.has(file.filename) && file.error && (
                        <ErrorDetails
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ErrorHeader>
                            <strong>🔍 Error Analysis</strong>
                          </ErrorHeader>
                          
                          {/* Error Summary Card */}
                          {file.error.title && (
                            <div style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              padding: '20px',
                              borderRadius: '12px',
                              marginBottom: '20px',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                              position: 'relative',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                position: 'absolute',
                                top: '-50%',
                                right: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                                pointerEvents: 'none'
                              }} />
                              <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  marginBottom: '12px'
                                }}>
                                  <div style={{
                                    fontSize: '24px',
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '8px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    {file.error.icon || '❌'}
                                  </div>
                                  <div>
                                    <h4 style={{
                                      margin: 0,
                                      fontSize: '18px',
                                      fontWeight: '700',
                                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                    }}>
                                      {ensureEnglishOnly(file.error.title)}
                                    </h4>
                                    <p style={{
                                      margin: '4px 0 0 0',
                                      fontSize: '14px',
                                      opacity: 0.9
                                    }}>
                                      {file.error.severity?.toUpperCase() || 'ERROR'} • {file.error.category || 'Unknown Category'}
                                    </p>
                                  </div>
                                </div>
                                {file.error.quick_fix && (
                                  <div style={{
                                    background: 'rgba(255,255,255,0.15)',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    textAlign: 'left'
                                  }}>
                                    <strong>💡 Quick Fix:</strong> {ensureEnglishOnly(file.error.quick_fix)}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {typeof file.error === 'object' ? (
                            <ErrorGrid>
                              <ErrorItem>
                                <ErrorLabel>Error Type:</ErrorLabel>
                                <ErrorValue className={`error-type ${file.error.type}`}>
                                  {file.error.type ? file.error.type.replace(/_/g, ' ').toUpperCase() : 'Validation Error'}
                                </ErrorValue>
                              </ErrorItem>
                              
                              {file.error.line && (
                                <ErrorItem>
                                  <ErrorLabel>Line Number:</ErrorLabel>
                                  <ErrorValue className="line-number">{file.error.line}</ErrorValue>
                                </ErrorItem>
                              )}
                              
                              {file.error.column && (
                                <ErrorItem>
                                  <ErrorLabel>Column:</ErrorLabel>
                                  <ErrorValue className="column-number">{file.error.column}</ErrorValue>
                                </ErrorItem>
                              )}
                              
                              {file.error.element && (
                                <ErrorItem>
                                  <ErrorLabel>Element:</ErrorLabel>
                                  <ErrorValue className="element-name">{file.error.element}</ErrorValue>
                                </ErrorItem>
                              )}
                              
                              {file.error.tag && (
                                <ErrorItem>
                                  <ErrorLabel>Invalid Tag:</ErrorLabel>
                                  <ErrorValue className="invalid-tag">{file.error.tag}</ErrorValue>
                                </ErrorItem>
                              )}
                              
                              {file.error.expected && (
                                <ErrorItem>
                                  <ErrorLabel>Expected:</ErrorLabel>
                                  <ErrorValue className="expected-tags">{file.error.expected}</ErrorValue>
                                </ErrorItem>
                              )}
                              
                              {file.error.xpath && (
                                <ErrorItem fullWidth>
                                  <ErrorLabel>XPath:</ErrorLabel>
                                  <ErrorValue className="xpath">{file.error.xpath}</ErrorValue>
                                </ErrorItem>
                              )}
                              
                              {file.error.path && (
                                <ErrorItem fullWidth>
                                  <ErrorLabel>XML Path:</ErrorLabel>
                                  <ErrorValue className="xml-path">{file.error.path}</ErrorValue>
                                </ErrorItem>
                              )}
                              
                              {file.error.category && (
                                <ErrorItem>
                                  <ErrorLabel>Error Category:</ErrorLabel>
                                  <ErrorValue className="error-category">{file.error.category}</ErrorValue>
                                </ErrorItem>
                              )}
                              
                              {file.error.actual_value && (
                                <ErrorItem>
                                  <ErrorLabel>Actual Value:</ErrorLabel>
                                  <ErrorValue className="actual-value">{file.error.actual_value}</ErrorValue>
                                </ErrorItem>
                              )}
                              
                              {file.error.title && (
                                <ErrorItem fullWidth>
                                  <ErrorLabel>Error Type:</ErrorLabel>
                                  <ErrorValue className="error-title" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: getSeverityColor(file.error.severity),
                                    backgroundColor: getSeverityBackground(file.error.severity),
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: `2px solid ${getSeverityColor(file.error.severity)}`,
                                    marginBottom: '8px'
                                  }}>
                                    <span style={{ fontSize: '20px' }}>{file.error.icon}</span>
                                    {file.error.title}
                                    <span style={{ 
                                      fontSize: '12px', 
                                      backgroundColor: getSeverityColor(file.error.severity),
                                      color: 'white',
                                      padding: '2px 8px',
                                      borderRadius: '12px',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px'
                                    }}>
                                      {file.error.severity}
                                    </span>
                                  </ErrorValue>
                                </ErrorItem>
                              )}
                              
                              {file.error.explanation && (
                                <ErrorItem fullWidth>
                                  <ErrorLabel>What Went Wrong:</ErrorLabel>
                                  <ErrorValue className="explanation" style={{ 
                                    fontFamily: 'Segoe UI, Tahoma, Arial, sans-serif',
                                    fontSize: '15px',
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    lineHeight: '1.6',
                                    padding: '16px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                  }}>
                                    {ensureEnglishOnly(file.error.explanation)}
                                  </ErrorValue>
                                </ErrorItem>
                              )}
                              
                              {file.error.user_friendly_explanation && (
                                <ErrorItem fullWidth>
                                  <ErrorLabel>Simple Explanation:</ErrorLabel>
                                  <ErrorValue className="user-friendly-explanation" style={{ 
                                    fontFamily: 'Segoe UI, Tahoma, Arial, sans-serif',
                                    fontSize: '14px',
                                    color: '#495057',
                                    fontWeight: '500',
                                    lineHeight: '1.5',
                                    padding: '12px',
                                    backgroundColor: '#e8f4fd',
                                    borderRadius: '6px',
                                    border: '1px solid #b3d9ff',
                                    borderLeft: '4px solid #2196f3'
                                  }}>
                                    {ensureEnglishOnly(file.error.user_friendly_explanation)}
                                  </ErrorValue>
                                </ErrorItem>
                              )}
                              
                              {file.error.quick_fix && (
                                <ErrorItem fullWidth>
                                  <ErrorLabel>Quick Fix:</ErrorLabel>
                                  <ErrorValue className="quick-fix" style={{
                                    textAlign: 'left',
                                    fontFamily: 'Segoe UI, Tahoma, Arial, sans-serif',
                                    fontSize: '14px',
                                    color: '#28a745',
                                    fontWeight: '600',
                                    padding: '12px 16px',
                                    backgroundColor: '#d4edda',
                                    borderRadius: '6px',
                                    border: '1px solid #c3e6cb',
                                    borderLeft: '4px solid #28a745'
                                  }}>
                                    💡 {ensureEnglishOnly(file.error.quick_fix)}
                                  </ErrorValue>
                                </ErrorItem>
                              )}
                              
                              {file.error.suggestions && file.error.suggestions.length > 0 && (
                                <ErrorItem fullWidth>
                                  <ErrorLabel>Step-by-Step Solutions:</ErrorLabel>
                                  <div style={{ marginTop: '12px' }}>
                                    {file.error.suggestions.map((suggestion, idx) => (
                                      <div key={idx} style={{
                                        textAlign: 'left',
                                        fontFamily: 'Segoe UI, Tahoma, Arial, sans-serif',
                                        fontSize: '14px',
                                        color: '#495057',
                                        marginBottom: '8px',
                                        padding: '10px 14px',
                                        backgroundColor: '#e3f2fd',
                                        borderRadius: '6px',
                                        borderLeft: '4px solid #2196f3',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#bbdefb';
                                        e.target.style.transform = 'translateX(2px)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#e3f2fd';
                                        e.target.style.transform = 'translateX(0)';
                                      }}>
                                        {ensureEnglishOnly(suggestion)}
                                      </div>
                                    ))}
                                  </div>
                                </ErrorItem>
                              )}
                              
                              <ErrorItem fullWidth>
                                <ErrorLabel>Technical Details (For Developers):</ErrorLabel>
                                <div style={{
                                  backgroundColor: '#f8f9fa',
                                  border: '1px solid #dee2e6',
                                  borderRadius: '8px',
                                  padding: '16px',
                                  marginTop: '8px'
                                }}>
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '12px',
                                    paddingBottom: '8px',
                                    borderBottom: '1px solid #e9ecef'
                                  }}>
                                    <span style={{ fontSize: '16px' }}>🔧</span>
                                    <span style={{ 
                                      fontWeight: '600', 
                                      color: '#495057',
                                      fontSize: '14px'
                                    }}>
                                      Raw Error Message
                                    </span>
                                  </div>
                                  
                                  <div style={{
                                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                                    fontSize: '13px',
                                    color: '#2c3e50',
                                    backgroundColor: '#ffffff',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    border: '1px solid #d1d5db',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    lineHeight: '1.5',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    marginBottom: '12px'
                                  }}>
                                    {file.error.message}
                                  </div>
                                  
                                  <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '12px',
                                    marginBottom: '12px'
                                  }}>
                                    {file.error.type && (
                                      <div style={{
                                        backgroundColor: '#e3f2fd',
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        border: '1px solid #bbdefb'
                                      }}>
                                        <div style={{ fontSize: '11px', color: '#1976d2', fontWeight: '600', marginBottom: '2px' }}>
                                          ERROR TYPE
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#1565c0' }}>
                                          {file.error.type.replace(/_/g, ' ').toUpperCase()}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {file.error.category && (
                                      <div style={{
                                        backgroundColor: '#fff3e0',
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        border: '1px solid #ffcc02'
                                      }}>
                                        <div style={{ fontSize: '11px', color: '#f57c00', fontWeight: '600', marginBottom: '2px' }}>
                                          CATEGORY
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#e65100' }}>
                                          {file.error.category.toUpperCase()}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {file.error.severity && (
                                      <div style={{
                                        backgroundColor: getSeverityBackground(file.error.severity),
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        border: `1px solid ${getSeverityColor(file.error.severity)}`
                                      }}>
                                        <div style={{ fontSize: '11px', color: getSeverityColor(file.error.severity), fontWeight: '600', marginBottom: '2px' }}>
                                          SEVERITY
                                        </div>
                                        <div style={{ fontSize: '12px', color: getSeverityColor(file.error.severity) }}>
                                          {file.error.severity.toUpperCase()}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div style={{
                                    backgroundColor: '#f1f3f4',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #e8eaed'
                                  }}>
                                    <div style={{
                                      fontSize: '11px',
                                      color: '#5f6368',
                                      fontWeight: '600',
                                      marginBottom: '4px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}>
                                      💡 <span>Developer Notes</span>
                                    </div>
                                    <div style={{
                                      fontSize: '12px',
                                      color: '#3c4043',
                                      lineHeight: '1.4'
                                    }}>
                                      This is the raw error message from the XML validation engine. 
                                      Use the user-friendly explanations above for better understanding. 
                                      The technical details help identify the exact validation rule that failed.
                                    </div>
                                  </div>
                                  
                                  {file.error.technical_info && (
                                    <div style={{
                                      marginTop: '12px',
                                      padding: '12px',
                                      backgroundColor: '#f8f9fa',
                                      borderRadius: '6px',
                                      border: '1px solid #e9ecef'
                                    }}>
                                      <div style={{
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#495057',
                                        marginBottom: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                      }}>
                                        🔍 <span>Structured Technical Information</span>
                                      </div>
                                      
                                      <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                        gap: '8px'
                                      }}>
                                        <div style={{
                                          backgroundColor: '#ffffff',
                                          padding: '8px',
                                          borderRadius: '4px',
                                          border: '1px solid #dee2e6'
                                        }}>
                                          <div style={{ fontSize: '10px', color: '#6c757d', fontWeight: '600', marginBottom: '2px' }}>
                                            ERROR CLASS
                                          </div>
                                          <div style={{ fontSize: '11px', color: '#495057', fontFamily: 'monospace' }}>
                                            {file.error.technical_info.error_class}
                                          </div>
                                        </div>
                                        
                                        <div style={{
                                          backgroundColor: '#ffffff',
                                          padding: '8px',
                                          borderRadius: '4px',
                                          border: '1px solid #dee2e6'
                                        }}>
                                          <div style={{ fontSize: '10px', color: '#6c757d', fontWeight: '600', marginBottom: '2px' }}>
                                            VALIDATION RULE
                                          </div>
                                          <div style={{ fontSize: '11px', color: '#495057' }}>
                                            {file.error.technical_info.validation_rule.replace(/_/g, ' ').toUpperCase()}
                                          </div>
                                        </div>
                                        
                                        <div style={{
                                          backgroundColor: '#ffffff',
                                          padding: '8px',
                                          borderRadius: '4px',
                                          border: '1px solid #dee2e6'
                                        }}>
                                          <div style={{ fontSize: '10px', color: '#6c757d', fontWeight: '600', marginBottom: '2px' }}>
                                            XML LOCATION
                                          </div>
                                          <div style={{ fontSize: '11px', color: '#495057' }}>
                                            {file.error.technical_info.xml_location}
                                          </div>
                                        </div>
                                        
                                        <div style={{
                                          backgroundColor: '#ffffff',
                                          padding: '8px',
                                          borderRadius: '4px',
                                          border: '1px solid #dee2e6'
                                        }}>
                                          <div style={{ fontSize: '10px', color: '#6c757d', fontWeight: '600', marginBottom: '2px' }}>
                                            ELEMENT NAME
                                          </div>
                                          <div style={{ fontSize: '11px', color: '#495057', fontFamily: 'monospace' }}>
                                            {file.error.technical_info.element_context.element_name}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {file.error.technical_info.validation_context.expected_type !== 'See schema definition' && (
                                        <div style={{
                                          marginTop: '8px',
                                          padding: '8px',
                                          backgroundColor: '#e8f5e8',
                                          borderRadius: '4px',
                                          border: '1px solid #c3e6c3'
                                        }}>
                                          <div style={{ fontSize: '10px', color: '#2e7d32', fontWeight: '600', marginBottom: '2px' }}>
                                            EXPECTED vs ACTUAL
                                          </div>
                                          <div style={{ fontSize: '11px', color: '#1b5e20' }}>
                                            <strong>Expected:</strong> {file.error.technical_info.validation_context.expected_type}<br/>
                                            <strong>Actual:</strong> {file.error.technical_info.validation_context.actual_value}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </ErrorItem>
                              
                              {file.error.timestamp && (
                                <ErrorItem>
                                  <ErrorLabel>Timestamp:</ErrorLabel>
                                  <ErrorValue className="timestamp">{new Date(file.error.timestamp).toLocaleString()}</ErrorValue>
                                </ErrorItem>
                              )}
                            </ErrorGrid>
                          ) : (
                            <div>
                              <strong>Error Message:</strong><br />
                              {file.error}
                            </div>
                          )}
                        </ErrorDetails>
                      )}
                    </AnimatePresence>
                  </FileItem>
                ))}
              </AnimatePresence>
            </FileList>
          </ResultCard>
        )}
      </ResultsGrid>

      {results.valid?.length === 0 && results.invalid?.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
          No files were processed. Please upload some XML files to validate.
        </div>
      )}

      {/* Error Statistics Component */}
      {results.statistics && results.invalid && results.invalid.length > 0 && (
        <ErrorStatistics statistics={results.statistics} />
      )}
    </ResultsContainer>
  );
};

export default ValidationResults;
