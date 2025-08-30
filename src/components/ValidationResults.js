import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronRight, FileText, Info } from 'lucide-react';

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
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  font-size: 0.875rem;
  line-height: 1.5;
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'VALID':
        return <CheckCircle size={16} />;
      case 'INVALID':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VALID':
        return 'valid';
      case 'INVALID':
        return 'invalid';
      default:
        return 'info';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'VALID':
        return 'Valid';
      case 'INVALID':
        return 'Invalid';
      default:
        return 'Unknown';
    }
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
                {results.schema}
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
                        {file.name}
                      </FileName>
                      <FileStatus className="valid">
                        {getStatusIcon(file.status)}
                        {getStatusText(file.status)}
                      </FileStatus>
                    </FileHeader>
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
                </CardTitle>
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
                    onClick={() => toggleFileExpansion(file.name)}
                  >
                    <FileHeader>
                      <FileName>
                        <FileText size={16} />
                        {file.name}
                      </FileName>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileStatus className="invalid">
                          {getStatusIcon(file.status)}
                          {getStatusText(file.status)}
                        </FileStatus>
                        <ExpandButton>
                          {expandedFiles.has(file.name) ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </ExpandButton>
                      </div>
                    </FileHeader>
                    
                    <AnimatePresence>
                      {expandedFiles.has(file.name) && file.error && (
                        <ErrorDetails
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <strong>Error Details:</strong><br />
                          {file.error}
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
    </ResultsContainer>
  );
};

export default ValidationResults;
