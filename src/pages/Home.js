import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Download, Play } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import ValidationResults from '../components/ValidationResults';

const HomeContainer = styled.div`
  min-height: 100vh;
  padding: 40px 0;
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 4rem;
  color: white;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fff 0%, #e0e7ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const HeroButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &.primary {
    background: #667eea;
    color: white;

    &:hover {
      background: #5a6fd8;
      transform: translateY(-2px);
    }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FeaturesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const ValidationSection = styled(motion.section)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
`;

const Home = () => {
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidationComplete = (results) => {
    setValidationResults(results);
    setIsValidating(false);
  };

  const scrollToValidation = () => {
    document.getElementById('validation-section').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleDownloadSamples = () => {
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = '/download-samples';
    link.download = 'xml_validator_samples.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          XML Schema Validator Pro
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Professional-grade XML validation tool with advanced schema support, 
          batch processing, and detailed error reporting for enterprise applications.
        </HeroSubtitle>
        <HeroButtons
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <HeroButton className="primary" onClick={scrollToValidation}>
            <Play size={20} />
            Start Validating
          </HeroButton>
          <HeroButton className="secondary" onClick={handleDownloadSamples}>
            <Download size={20} />
            Download Samples
          </HeroButton>
        </HeroButtons>
      </HeroSection>

      <MainContent>
        <FeaturesGrid
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <FeatureCard>
            <FeatureIcon>
              <FileText size={28} />
            </FeatureIcon>
            <FeatureTitle>Schema Validation</FeatureTitle>
            <FeatureDescription>
              Validate XML files against XSD schemas with comprehensive error reporting 
              and detailed validation results.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Upload size={28} />
            </FeatureIcon>
            <FeatureTitle>Batch Processing</FeatureTitle>
            <FeatureDescription>
              Upload multiple XML files at once for efficient batch validation 
              against your XSD schema with automatic valid/invalid classification.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <CheckCircle size={28} />
            </FeatureIcon>
            <FeatureTitle>Professional Results</FeatureTitle>
            <FeatureDescription>
              Get detailed validation reports with clear error messages, 
              line numbers, and suggestions for fixes.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>

        <ValidationSection
          id="validation-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>Validate Your XML Files</SectionTitle>
          <FileUpload 
            onValidationComplete={handleValidationComplete}
            isValidating={isValidating}
            setIsValidating={setIsValidating}
          />
          
          {validationResults && (
            <ValidationResults results={validationResults} />
          )}
        </ValidationSection>
      </MainContent>
    </HomeContainer>
  );
};

export default Home;
