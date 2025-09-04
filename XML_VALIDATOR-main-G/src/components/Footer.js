import React from 'react';
import styled from 'styled-components';
import { Github, Code, Heart, Brain } from 'lucide-react';

const FooterContainer = styled.footer`
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 40px 0 20px;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    color: #667eea;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
  }

  p {
    line-height: 1.6;
    color: #ccc;
    margin-bottom: 0.5rem;
  }

  a {
    color: #ccc;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #667eea;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    transform: translateY(-2px);
  }
`;

const BottomBar = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 2rem;
  padding-top: 2rem;
  text-align: center;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const HeartIcon = styled(Heart)`
  color: #e74c3c;
  animation: heartbeat 1.5s ease-in-out infinite;

  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>AI-Powered Verification Framework</h3>
          <p>Phase 1: XML Schema Validator with React and Flask.</p>
          <p>Foundation for LLM-powered automation in digital design verification.</p>
        </FooterSection>

        <FooterSection>
          <h3>Project Navigation</h3>
          <p><a href="/">Home</a></p>
          <p><a href="/about">About & Roadmap</a></p>
          <p><a href="/support">Support & Resources</a></p>
        </FooterSection>

        <FooterSection>
          <h3>Current Capabilities</h3>
          <p>• XSD Schema Validation</p>
          <p>• Professional UI/UX Design</p>
          <p>• Comprehensive Error Reporting</p>
          <p>• Enterprise-Ready Architecture</p>
        </FooterSection>

        <FooterSection>
          <h3>Next Phase Development</h3>
          <p>LLM-powered automation for verification processes.</p>
          <p>AI-driven test case generation and intelligent debugging.</p>
          <SocialLinks>
            <SocialLink href="https://github.com/Gaserzaghloul/XML_VALIDATOR" target="_blank" rel="noopener noreferrer">
              <Github size={20} />
            </SocialLink>
            <SocialLink href="/about" title="View Technology Stack">
              <Code size={20} />
            </SocialLink>
            <SocialLink href="/about" title="AI Integration Roadmap">
              <Brain size={20} />
            </SocialLink>
          </SocialLinks>
        </FooterSection>
      </FooterContent>

      <BottomBar>
        <span>Phase 1 Implementation for</span>
        <HeartIcon size={16} />
        <span>Siemens Sponsorship Application</span>
      </BottomBar>
    </FooterContainer>
  );
};

export default Footer;
