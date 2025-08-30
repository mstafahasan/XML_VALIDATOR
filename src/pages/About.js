import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Code, Shield, Zap, Users, Award, Globe } from 'lucide-react';

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
  -webkit-text-fill-color: transparent;
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

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
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
          About XML Validator Pro
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Empowering developers and enterprises with professional-grade XML schema validation tools
        </HeroSubtitle>
      </HeroSection>

      <MainContent>
        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>Our Mission</SectionTitle>
          <SectionContent>
            <p>
              XML Validator Pro was created with a simple yet powerful mission: to provide developers, 
              data engineers, and enterprises with the most reliable, efficient, and user-friendly XML 
              schema validation solution available.
            </p>
            <p>
              In today's data-driven world, XML remains a critical format for data exchange, configuration 
              files, and API responses. Ensuring the integrity and validity of XML data is paramount for 
              maintaining system reliability and data quality.
            </p>
            <p>
              Our platform combines cutting-edge technology with intuitive design to deliver a validation 
              experience that's both powerful and accessible to users of all skill levels.
            </p>
          </SectionContent>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>Key Features</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <Shield size={28} />
              </FeatureIcon>
              <FeatureTitle>Schema Validation</FeatureTitle>
              <FeatureDescription>
                Validate XML files against XSD schemas with comprehensive error reporting and detailed 
                validation results that help you identify and fix issues quickly.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Zap size={28} />
              </FeatureIcon>
              <FeatureTitle>Batch Processing</FeatureTitle>
              <FeatureDescription>
                Process multiple XML files simultaneously for efficient validation of large datasets 
                and improved productivity in enterprise environments.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Code size={28} />
              </FeatureIcon>
              <FeatureTitle>Professional API</FeatureTitle>
              <FeatureDescription>
                Built with modern web technologies and RESTful APIs, making it easy to integrate 
                with existing development workflows and automation systems.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Users size={28} />
              </FeatureIcon>
              <FeatureTitle>Team Collaboration</FeatureTitle>
              <FeatureDescription>
                Designed for team environments with features that support collaborative development, 
                code review, and shared validation workflows.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Award size={28} />
              </FeatureIcon>
              <FeatureTitle>Enterprise Ready</FeatureTitle>
              <FeatureDescription>
                Built with enterprise-grade security, scalability, and reliability to meet the 
                demands of large organizations and critical business applications.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Globe size={28} />
              </FeatureIcon>
              <FeatureTitle>Global Accessibility</FeatureTitle>
              <FeatureDescription>
                Cloud-based platform accessible from anywhere in the world, with support for 
                multiple languages and regional compliance requirements.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>Why Choose XML Validator Pro?</SectionTitle>
          <SectionContent>
            <p>
              <strong>Reliability:</strong> Our validation engine is built on proven XML parsing 
              technologies and has been tested with millions of files across diverse use cases.
            </p>
            <p>
              <strong>Performance:</strong> Optimized for speed and efficiency, capable of processing 
              large files and batch operations without compromising accuracy.
            </p>
            <p>
              <strong>User Experience:</strong> Intuitive interface designed by UX experts, making 
              complex validation tasks simple and straightforward.
            </p>
            <p>
              <strong>Support:</strong> Comprehensive documentation, tutorials, and dedicated support 
              to help you get the most out of our platform.
            </p>
          </SectionContent>

          <StatsSection>
            <StatCard>
              <StatNumber>99.9%</StatNumber>
              <StatLabel>Uptime</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>10M+</StatNumber>
              <StatLabel>Files Processed</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>50K+</StatNumber>
              <StatLabel>Happy Users</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>24/7</StatNumber>
              <StatLabel>Support</StatLabel>
            </StatCard>
          </StatsSection>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>Technology Stack</SectionTitle>
          <SectionContent>
            <p>
              XML Validator Pro is built using modern, industry-standard technologies:
            </p>
            <ul style={{ marginLeft: '2rem', marginTop: '1rem' }}>
              <li><strong>Frontend:</strong> React.js with styled-components for a modern, responsive UI</li>
              <li><strong>Backend:</strong> Python Flask for robust API endpoints and validation logic</li>
              <li><strong>Validation Engine:</strong> xmlschema library for accurate XSD validation</li>
              <li><strong>Infrastructure:</strong> Cloud-native architecture for scalability and reliability</li>
              <li><strong>Security:</strong> Enterprise-grade security measures and data protection</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              Our technology choices ensure that the platform is not only powerful and reliable 
              but also future-proof and easily maintainable.
            </p>
          </SectionContent>
        </ContentSection>
      </MainContent>
    </AboutContainer>
  );
};

export default About;
