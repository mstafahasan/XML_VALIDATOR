import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';

const UploadContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const UploadSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Dropzone = styled.div`
  border: 2px dashed ${props => props.isDragActive ? '#3498db' : '#ddd'};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  background: ${props => props.isDragActive ? 'rgba(52, 152, 219, 0.05)' : '#fafafa'};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #3498db;
    background: rgba(52, 152, 219, 0.05);
  }
`;

const DropzoneContent = styled.div`
  color: #666;
`;

const DropzoneIcon = styled(Upload)`
  width: 48px;
  height: 48px;
  color: #3498db;
  margin-bottom: 1rem;
`;

const DropzoneText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const DropzoneSubtext = styled.p`
  font-size: 0.9rem;
  color: #999;
`;

const FileList = styled.div`
  margin-top: 1rem;
`;

const FileItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FileIcon = styled(FileText)`
  color: #3498db;
`;

const FileDetails = styled.div`
  .fileName {
    font-weight: 500;
    color: #333;
    margin-bottom: 0.25rem;
  }
  
  .fileSize {
    font-size: 0.85rem;
    color: #666;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #e74c3c;
    background: rgba(231, 76, 60, 0.1);
  }
`;

const ValidationButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem auto 0;
  width: fit-content;

  &:hover:not(:disabled) {
    background: #5a6fd8;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fed7d7;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuccessMessage = styled.div`
  background: #f0fff4;
  color: #2f855a;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #c6f6d5;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FileUpload = ({ onValidationComplete, isValidating, setIsValidating }) => {
  const [schemaFile, setSchemaFile] = useState(null);
  const [xmlFiles, setXmlFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSchemaDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSchemaFile(acceptedFiles[0]);
      setError('');
    }
  }, []);

  const onXmlFilesDrop = useCallback((acceptedFiles) => {
    setXmlFiles(prev => [...prev, ...acceptedFiles]);
    setError('');
  }, []);

  const { getRootProps: getSchemaRootProps, getInputProps: getSchemaInputProps, isDragActive: isSchemaDragActive } = useDropzone({
    onDrop: onSchemaDrop,
    accept: { '.xsd': [], '.xml': [] },
    multiple: false
  });

  const { getRootProps: getXmlRootProps, getInputProps: getXmlInputProps, isDragActive: isXmlDragActive } = useDropzone({
    onDrop: onXmlFilesDrop,
    accept: { '.xml': [] },
    multiple: true
  });

  const removeFile = (file, fileList, setFileList) => {
    setFileList(fileList.filter(f => f !== file));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleValidation = async () => {
    if (!schemaFile) {
      setError('Please upload a schema file first');
      return;
    }

    if (xmlFiles.length === 0) {
      setError('Please upload at least one XML file to validate');
      return;
    }

    setIsValidating(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('schema', schemaFile);
      
      xmlFiles.forEach(file => {
        formData.append('xml_files', file);
      });

      const response = await axios.post('/validate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Validation completed successfully!');
      onValidationComplete(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during validation');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <UploadContainer>
      <UploadSection>
        <SectionTitle>
          <FileText size={20} />
          Schema File (XSD)
        </SectionTitle>
        <Dropzone {...getSchemaRootProps()} isDragActive={isSchemaDragActive}>
          <input {...getSchemaInputProps()} />
          <DropzoneContent>
            <DropzoneIcon />
            <DropzoneText>
              {isSchemaDragActive ? 'Drop the schema file here' : 'Drag & drop your XSD schema file here'}
            </DropzoneText>
            <DropzoneSubtext>or click to browse files</DropzoneSubtext>
          </DropzoneContent>
        </Dropzone>
        {schemaFile && (
          <FileList>
            <FileItem
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <FileInfo>
                <FileIcon size={20} />
                <FileDetails>
                  <div className="fileName">{schemaFile.name}</div>
                  <div className="fileSize">{formatFileSize(schemaFile.size)}</div>
                </FileDetails>
              </FileInfo>
              <RemoveButton onClick={() => setSchemaFile(null)}>
                <X size={16} />
              </RemoveButton>
            </FileItem>
          </FileList>
        )}
      </UploadSection>

      <UploadSection>
        <SectionTitle>
          <FileText size={20} />
          XML Files to Validate
        </SectionTitle>
        <Dropzone {...getXmlRootProps()} isDragActive={isXmlDragActive}>
          <input {...getXmlInputProps()} />
          <DropzoneContent>
            <DropzoneIcon />
            <DropzoneText>
              {isXmlDragActive ? 'Drop XML files here' : 'Drag & drop XML files here for validation'}
            </DropzoneText>
            <DropzoneSubtext>or click to browse files (supports multiple files)</DropzoneSubtext>
          </DropzoneContent>
        </Dropzone>
        {xmlFiles.length > 0 && (
          <FileList>
            <AnimatePresence>
              {xmlFiles.map((file, index) => (
                <FileItem
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <FileInfo>
                    <FileIcon size={20} />
                    <FileDetails>
                      <div className="fileName">{file.name}</div>
                      <div className="fileSize">{formatFileSize(file.size)}</div>
                    </FileDetails>
                  </FileInfo>
                  <RemoveButton onClick={() => removeFile(file, xmlFiles, setXmlFiles)}>
                    <X size={16} />
                  </RemoveButton>
                </FileItem>
              ))}
            </AnimatePresence>
          </FileList>
        )}
      </UploadSection>

      {error && (
        <ErrorMessage>
          <AlertCircle size={20} />
          {error}
        </ErrorMessage>
      )}

      {success && (
        <SuccessMessage>
          <CheckCircle size={20} />
          {success}
        </SuccessMessage>
      )}

      <ValidationButton 
        onClick={handleValidation} 
        disabled={isValidating || (!schemaFile || xmlFiles.length === 0)}
      >
        {isValidating ? (
          <>
            <Loader size={20} className="animate-spin" />
            Validating...
          </>
        ) : (
          <>
            <CheckCircle size={20} />
            Start Validation
          </>
        )}
      </ValidationButton>
    </UploadContainer>
  );
};

export default FileUpload;
