import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Mail, BookOpen, HelpCircle, Code, Github, Brain, Rocket } from 'lucide-react';

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
  -webkit-background-fill-color: transparent;
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
    
    try {
      // Send message to Flask backend
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        // Handle error from backend
        alert(`Error: ${result.error || 'Failed to send message'}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SupportContainer>
      <HeroSection>
        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Project Support & Resources
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Documentation and resources for the AI-Powered Verification Framework project
        </HeroSubtitle>
      </HeroSection>

      <MainContent>
        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>Project Documentation</SectionTitle>
          <HelpGrid>
            <HelpCard>
              <HelpIcon>
                <BookOpen size={28} />
              </HelpIcon>
              <HelpTitle>Technical Documentation</HelpTitle>
              <HelpDescription>
                Comprehensive README.md with setup instructions, architecture details, 
                and technical specifications for the verification framework.
              </HelpDescription>
              <HelpButton onClick={() => window.open('https://github.com', '_blank')}>
                View Documentation
              </HelpButton>
            </HelpCard>

            <HelpCard>
              <HelpIcon>
                <Code size={28} />
              </HelpIcon>
              <HelpTitle>Source Code Repository</HelpTitle>
              <HelpDescription>
                Access the complete source code, including React frontend, Flask backend, 
                and all components of the verification framework.
              </HelpDescription>
              <HelpButton onClick={() => window.open('https://github.com', '_blank')}>
                Browse Code
              </HelpButton>
            </HelpCard>

            <HelpCard>
              <HelpIcon>
                <HelpCircle size={28} />
              </HelpIcon>
              <HelpTitle>Project Overview</HelpTitle>
              <HelpDescription>
                Visit the About page to understand the project's scope, Siemens alignment, 
                and the roadmap for LLM-powered automation.
              </HelpDescription>
              <HelpButton onClick={() => window.location.href = '/about'}>
                Learn More
              </HelpButton>
            </HelpCard>
          </HelpGrid>
        </ContentSection>

        <PhaseSection>
          <PhaseTitle>🚀 Project Roadmap & Next Steps</PhaseTitle>
          <PhaseDescription>
            This Phase 1 implementation demonstrates the team's technical capabilities and 
            project management skills. The next phase will integrate LLM-powered automation, 
            aligning with Siemens' vision for AI-based verification frameworks and automated 
            testing solutions in the EDA domain.
          </PhaseDescription>
        </PhaseSection>

        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>Technical Support & Feedback</SectionTitle>
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
                placeholder="Technical question, feedback, or collaboration inquiry"
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
                placeholder="Please describe your technical question, provide feedback on the project, or inquire about collaboration opportunities..."
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
                  Send Message
                </>
              )}
            </SubmitButton>

            {isSubmitted && (
              <SuccessMessage
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Thank you! Your message has been sent successfully.
              </SuccessMessage>
            )}
          </ContactForm>

          <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
            <p>
              <strong>Note:</strong> This contact form is for project-related inquiries, technical support, 
              and collaboration opportunities. For Siemens sponsorship inquiries, please refer to the 
              official registration process.
            </p>
          </div>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>Implementation & Deployment</SectionTitle>
          <div style={{ textAlign: 'center', color: '#666', lineHeight: '1.8' }}>
            <p>
              <strong>1. Setup & Installation:</strong> Follow the detailed instructions in the README.md 
              to install dependencies and start both the Flask backend and React frontend servers.
            </p>
            <p>
              <strong>2. Usage & Validation:</strong> Upload XSD schema files and XML documents, then 
              execute validation processes to demonstrate the framework's capabilities.
            </p>
            <p>
              <strong>3. Results Analysis:</strong> Review validation results and error reporting to 
              understand the system's diagnostic capabilities and user experience.
            </p>
            <p>
              <strong>4. Technical Assessment:</strong> Evaluate the code quality, architecture design, 
              and scalability features that support future AI/ML integration.
            </p>
          </div>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>Project Evaluation Criteria</SectionTitle>
          <div style={{ textAlign: 'center', color: '#666', lineHeight: '1.8' }}>
            <p>
              <strong>Technical Implementation:</strong> Modern web technologies, clean architecture, 
              and scalable design patterns that demonstrate professional development skills.
            </p>
            <p>
              <strong>User Experience:</strong> Intuitive interface, responsive design, and professional 
              appearance that meets enterprise software standards.
            </p>
            <p>
              <strong>Code Quality:</strong> Well-structured components, proper error handling, and 
              maintainable codebase that supports future development phases.
            </p>
            <p>
              <strong>Innovation Potential:</strong> Foundation architecture that clearly supports 
              the next phase of LLM-powered automation and AI integration.
            </p>
          </div>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <SectionTitle>Project Support & Contact</SectionTitle>
          <div style={{ textAlign: 'center', marginBottom: '2rem', color: '#666', lineHeight: '1.8' }}>
            <p>
              <strong>For Technical Support:</strong> Use the contact form below to reach our development team.
            </p>
            <p>
              <strong>For Project Inquiries:</strong> Contact us about collaboration opportunities, 
              technical questions, or feedback on the verification framework.
            </p>
            <p>
              <strong>Response Time:</strong> We typically respond within 24-48 hours during business days.
            </p>
          </div>
        </ContentSection>
      </MainContent>
    </SupportContainer>
  );
};

export default Support;
