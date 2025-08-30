import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Code, Shield, Zap, FileText, CheckCircle, AlertCircle, Brain, Rocket } from 'lucide-react';

const AboutContainer = styled.div`
  min-height: 100vh;
  padding: 40px 0;
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 4rem;
  color: white;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fff 0%, #e0e7ff 100%);
  -webkit-background-clip: text;
  -webkit-background-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 700px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ContentSection = styled(motion.section)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  margin-bottom: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
`;

const SectionContent = styled.div`
  color: #666;
  line-height: 1.8;
  font-size: 1.1rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #eee;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
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
  margin-bottom: 1.5rem;
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

const PhaseSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  margin: 2rem 0;
  text-align: center;
`;

const PhaseTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const PhaseDescription = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const About = () => {
  return (
    <AboutContainer>
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
          Phase 1: Foundation for AI-Powered Verification Framework
        </HeroSubtitle>
      </HeroSection>

      <MainContent>
        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>Project Overview</SectionTitle>
          <SectionContent>
            <p>
              This XML Schema Validator represents the foundational phase of a comprehensive 
              AI-powered verification framework being developed for graduation project sponsorship 
              from Siemens Digital Industries Software.
            </p>
            <p>
              The project aims to demonstrate advanced capabilities in digital design verification, 
              ML/AI integration, and automated testing frameworks that align with Siemens' 
              industry-leading standards for verification and validation.
            </p>
            <p>
              This phase establishes the core infrastructure and user interface for XML validation, 
              setting the stage for the next phase: LLM-powered automation and intelligent 
              verification processes.
            </p>
          </SectionContent>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>Phase 1: Current Implementation</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <FileText size={28} />
              </FeatureIcon>
              <FeatureTitle>Schema Management</FeatureTitle>
              <FeatureDescription>
                Robust XSD schema upload and parsing system that forms the foundation for 
                automated verification workflows.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Zap size={28} />
              </FeatureIcon>
              <FeatureTitle>Validation Engine</FeatureTitle>
              <FeatureDescription>
                High-performance XML validation against XSD schemas with comprehensive 
                error reporting and result categorization.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <CheckCircle size={28} />
              </FeatureIcon>
              <FeatureTitle>Results Analysis</FeatureTitle>
              <FeatureDescription>
                Detailed validation results with expandable error details, providing 
                insights for automated debugging and optimization.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <AlertCircle size={28} />
              </FeatureIcon>
              <FeatureTitle>Error Intelligence</FeatureTitle>
              <FeatureDescription>
                Structured error reporting system designed to feed into future ML models 
                for automated problem diagnosis and resolution.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Code size={28} />
              </FeatureIcon>
              <FeatureTitle>Modern Architecture</FeatureTitle>
              <FeatureDescription>
                Scalable React/Flask architecture that can easily integrate with AI/ML 
                components and enterprise verification systems.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Shield size={28} />
              </FeatureIcon>
              <FeatureTitle>Enterprise Ready</FeatureTitle>
              <FeatureDescription>
                Professional-grade interface and API design that meets industry standards 
                for verification tool integration.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </ContentSection>

        <PhaseSection>
          <PhaseTitle>🚀 Next Phase: LLM-Powered Automation</PhaseTitle>
          <PhaseDescription>
            Building upon this foundation, the next phase will integrate Large Language Models (LLMs) 
            to automate verification processes, generate intelligent test cases, and provide 
            AI-driven insights for complex verification scenarios. This aligns with Siemens' 
            vision for AI-based verification frameworks and automated testing solutions.
          </PhaseDescription>
        </PhaseSection>

        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>Alignment with Siemens Objectives</SectionTitle>
          <SectionContent>
            <p>
              This project directly addresses Siemens' focus areas for graduation projects:
            </p>
            <ul style={{ marginLeft: '2rem', marginTop: '1rem' }}>
              <li><strong>Digital Design & Verification:</strong> Core XML validation and schema management</li>
              <li><strong>ML/AI in Software Testing:</strong> Foundation for LLM-powered verification automation</li>
              <li><strong>Functional Verification Domain:</strong> Structured validation workflows and error analysis</li>
              <li><strong>EDA Algorithms:</strong> Automated verification processes and result analysis</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              The project demonstrates the team's capability to build enterprise-grade verification tools 
              while preparing for advanced AI integration that will drive productivity and manage complexity 
              in sophisticated verification environments.
            </p>
          </SectionContent>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>Technical Foundation</SectionTitle>
          <SectionContent>
            <p>
              Built using industry-standard technologies that align with Siemens' technical requirements:
            </p>
            <ul style={{ marginLeft: '2rem', marginTop: '1rem' }}>
              <li><strong>Frontend:</strong> React.js with styled-components for professional UI/UX</li>
              <li><strong>Backend:</strong> Python Flask with xmlschema for robust validation</li>
              <li><strong>Architecture:</strong> RESTful API design for enterprise integration</li>
              <li><strong>Validation Engine:</strong> xmlschema library for industry-standard XSD validation</li>
              <li><strong>File Handling:</strong> React Dropzone for enterprise-grade file management</li>
              <li><strong>Responsive Design:</strong> Mobile-first approach for accessibility</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              The modular architecture ensures easy integration with future AI/ML components and 
              enterprise verification frameworks, demonstrating scalability and maintainability.
            </p>
          </SectionContent>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <SectionTitle>Project Impact & Innovation</SectionTitle>
          <SectionContent>
            <p>
              This project represents a significant step toward the future of verification automation:
            </p>
            <ul style={{ marginLeft: '2rem', marginTop: '1rem' }}>
              <li><strong>Innovation:</strong> First phase of AI-powered verification framework</li>
              <li><strong>Industry Alignment:</strong> Addresses Siemens' verification automation needs</li>
              <li><strong>Scalability:</strong> Foundation for enterprise-level verification tools</li>
              <li><strong>Learning Value:</strong> Demonstrates advanced web development and API design</li>
              <li><strong>Future Ready:</strong> Architecture prepared for AI/ML integration</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              By completing this foundation phase, the team demonstrates the technical capability, 
              project management skills, and innovative thinking required for Siemens sponsorship 
              and future industry collaboration.
            </p>
          </SectionContent>
        </ContentSection>
      </MainContent>
    </AboutContainer>
  );
};

export default About;
