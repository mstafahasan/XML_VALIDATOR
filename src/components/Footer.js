import React from 'react';
import styled from 'styled-components';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

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
          <h3>XML Validator Pro</h3>
          <p>Professional XML Schema validation tool for developers and enterprises.</p>
          <p>Validate your XML files against XSD schemas with ease and confidence.</p>
        </FooterSection>

        <FooterSection>
          <h3>Quick Links</h3>
          <p><a href="/">Home</a></p>
          <p><a href="/about">About</a></p>
          <p><a href="/support">Support</a></p>
        </FooterSection>

        <FooterSection>
          <h3>Features</h3>
          <p>• XSD Schema Validation</p>
          <p>• Batch File Processing</p>
          <p>• Detailed Error Reporting</p>
          <p>• Professional UI/UX</p>
        </FooterSection>

        <FooterSection>
          <h3>Connect</h3>
          <p>Get in touch with our team for support and feedback.</p>
          <SocialLinks>
            <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github size={20} />
            </SocialLink>
            <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Linkedin size={20} />
            </SocialLink>
            <SocialLink href="mailto:support@xmlvalidator.com">
              <Mail size={20} />
            </SocialLink>
          </SocialLinks>
        </FooterSection>
      </FooterContent>

      <BottomBar>
        <span>Made with</span>
        <HeartIcon size={16} />
        <span>for the developer community</span>
      </BottomBar>
    </FooterContainer>
  );
};

export default Footer;
