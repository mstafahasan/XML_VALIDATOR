import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, BookOpen, HelpCircle, Phone, Clock, MapPin, Send, CheckCircle } from 'lucide-react';

const SupportContainer = styled.div`
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
  max-width: 600px;
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

const HelpGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const HelpCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #eee;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const HelpIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
`;

const HelpTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const HelpDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const HelpButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #5a6fd8;
    transform: translateY(-2px);
  }
`;

const ContactForm = styled.form`
  max-width: 600px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SubmitButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

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

const ContactInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
`;

const ContactIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ContactDetails = styled.div`
  .contactTitle {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.25rem;
  }
  
  .contactText {
    color: #666;
    font-size: 0.9rem;
  }
`;

const SuccessMessage = styled(motion.div)`
  background: #f0fff4;
  color: #2f855a;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #c6f6d5;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  justify-content: center;
`;

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 2000);
  };

  return (
    <SupportContainer>
      <HeroSection>
        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Get Support
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We're here to help you succeed with XML Validator Pro
        </HeroSubtitle>
      </HeroSection>

      <MainContent>
        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>How Can We Help?</SectionTitle>
          <HelpGrid>
            <HelpCard>
              <HelpIcon>
                <BookOpen size={28} />
              </HelpIcon>
              <HelpTitle>Documentation</HelpTitle>
              <HelpDescription>
                Comprehensive guides, tutorials, and API documentation to help you get started 
                and make the most of our platform.
              </HelpDescription>
              <HelpButton>View Docs</HelpButton>
            </HelpCard>

            <HelpCard>
              <HelpIcon>
                <HelpCircle size={28} />
              </HelpIcon>
              <HelpTitle>FAQ</HelpTitle>
              <HelpDescription>
                Quick answers to common questions about XML validation, file formats, 
                and platform usage.
              </HelpDescription>
              <HelpButton>Browse FAQ</HelpButton>
            </HelpCard>

            <HelpCard>
              <HelpIcon>
                <MessageCircle size={28} />
              </HelpIcon>
              <HelpTitle>Community</HelpTitle>
              <HelpDescription>
                Join our community forum to connect with other users, share experiences, 
                and get help from the community.
              </HelpDescription>
              <HelpButton>Join Community</HelpButton>
            </HelpCard>
          </HelpGrid>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>Contact Us</SectionTitle>
          <ContactForm onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="name">Full Name *</FormLabel>
              <FormInput
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="email">Email Address *</FormLabel>
              <FormInput
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="subject">Subject *</FormLabel>
              <FormInput
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="What can we help you with?"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="message">Message *</FormLabel>
              <FormTextarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Please describe your issue or question in detail..."
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid white', borderTop: 'transparent', borderRadius: '50%' }}></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Message
                </>
              )}
            </SubmitButton>

            {isSubmitted && (
              <SuccessMessage
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle size={20} />
                Thank you! Your message has been sent successfully. We'll get back to you soon.
              </SuccessMessage>
            )}
          </ContactForm>

          <ContactInfo>
            <ContactItem>
              <ContactIcon>
                <Mail size={24} />
              </ContactIcon>
              <ContactDetails>
                <div className="contactTitle">Email Support</div>
                <div className="contactText">support@xmlvalidator.com</div>
              </ContactDetails>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <Phone size={24} />
              </ContactIcon>
              <ContactDetails>
                <div className="contactTitle">Phone Support</div>
                <div className="contactText">+1 (555) 123-4567</div>
              </ContactDetails>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <Clock size={24} />
              </ContactIcon>
              <ContactDetails>
                <div className="contactTitle">Support Hours</div>
                <div className="contactText">24/7 Available</div>
              </ContactDetails>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <MapPin size={24} />
              </ContactIcon>
              <ContactDetails>
                <div className="contactTitle">Response Time</div>
                <div className="contactText">Within 2 hours</div>
              </ContactDetails>
            </ContactItem>
          </ContactInfo>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>Support Resources</SectionTitle>
          <div style={{ textAlign: 'center', color: '#666', lineHeight: '1.8' }}>
            <p>
              <strong>Getting Started Guide:</strong> New to XML Validator Pro? Our comprehensive 
              getting started guide will walk you through the basics and help you validate your first XML files.
            </p>
            <p>
              <strong>Video Tutorials:</strong> Watch step-by-step video tutorials covering everything 
              from basic validation to advanced features and API integration.
            </p>
            <p>
              <strong>API Reference:</strong> Detailed API documentation with examples for developers 
              who want to integrate XML validation into their applications.
            </p>
            <p>
              <strong>Best Practices:</strong> Learn industry best practices for XML schema design, 
              validation strategies, and error handling.
            </p>
          </div>
        </ContentSection>
      </MainContent>
    </SupportContainer>
  );
};

export default Support;
