import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const NotificationContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
`;

const NotificationItem = styled(motion.div)`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  }};
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const IconContainer = styled.div`
  flex-shrink: 0;
  margin-top: 2px;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h4`
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
`;

const Message = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #9ca3af;
  transition: color 0.2s;
  
  &:hover {
    color: #6b7280;
  }
`;

const getIcon = (type) => {
  switch (type) {
    case 'success': return <CheckCircle size={20} color="#10b981" />;
    case 'error': return <AlertCircle size={20} color="#ef4444" />;
    case 'warning': return <AlertCircle size={20} color="#f59e0b" />;
    default: return <Info size={20} color="#3b82f6" />;
  }
};

const Notification = ({ notifications, removeNotification }) => {
  return (
    <NotificationContainer>
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            type={notification.type}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <IconContainer>
              {getIcon(notification.type)}
            </IconContainer>
            
            <Content>
              <Title>{notification.title}</Title>
              <Message>{notification.message}</Message>
            </Content>
            
            <CloseButton onClick={() => removeNotification(notification.id)}>
              <X size={16} />
            </CloseButton>
          </NotificationItem>
        ))}
      </AnimatePresence>
    </NotificationContainer>
  );
};

export default Notification;
