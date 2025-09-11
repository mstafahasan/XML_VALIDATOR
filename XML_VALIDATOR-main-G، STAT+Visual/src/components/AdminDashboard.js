import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Mail, Eye, Clock, User, MessageSquare, 
  LogIn, LogOut, BarChart3, Reply, Trash2,
  Filter, AlertCircle, TrendingUp
} from 'lucide-react';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #3498db 0%, #34495e 100%);
  padding: 2rem;
`;

const LoginContainer = styled(motion.div)`
  max-width: 400px;
  margin: 4rem auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const LoginTitle = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-weight: 500;
  color: #555;
`;

const FormInput = styled.input`
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const LoginButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #5a6fd8;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const MainDashboard = styled(motion.div)`
  max-width: 1400px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  color: #333;
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const LogoutButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #3498db;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 1.1rem;
`;

const DashboardContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const MessagesSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  min-width: 300px;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageCard = styled(motion.div)`
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const MessageInfo = styled.div`
  flex: 1;
`;

const MessageSubject = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const MessageMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
  align-items: center;
  flex-wrap: wrap;
`;

const MessageStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  
  &.new {
    background: #dbeafe;
    color: #1e40af;
  }
  
  &.read {
    background: #d1fae5;
    color: #065f46;
  }
  
  &.replied {
    background: #fef3c7;
    color: #92400e;
  }
  
  &.closed {
    background: #f3f4f6;
    color: #374151;
  }
`;

const MessagePriority = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  
  &.high {
    background: #fee2e2;
    color: #dc2626;
  }
  
  &.normal {
    background: #dbeafe;
    color: #1e40af;
  }
  
  &.low {
    background: #d1fae5;
    color: #065f46;
  }
`;

const MessageActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;

  &:hover {
    background: #f3f4f6;
    color: #333;
  }

  &.reply {
    color: #059669;
  }

  &.delete {
    color: #dc2626;
  }
`;

const MessageContent = styled.div`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const MessageDetails = styled.div`
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 0.9rem;
  color: #666;
  margin-top: 1rem;
`;

const ReplyForm = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
`;

const ReplyTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #0ea5e9;
  border-radius: 6px;
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #0284c7;
  }
`;

const ReplyButton = styled.button`
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #0284c7;
  }
`;

const Sidebar = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: fit-content;
`;

const SidebarTitle = styled.h3`
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuickActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const QuickActionButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #5a6fd8;
    transform: translateY(-2px);
  }
`;

const RecentActivity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ActivityItem = styled.div`
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 0.9rem;
`;

const ActivitySubject = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
`;

const ActivityMeta = styled.div`
  color: #666;
  font-size: 0.8rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const EmptyIcon = styled(Mail)`
  width: 64px;
  height: 64px;
  color: #ccc;
  margin-bottom: 1rem;
`;

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      const response = await fetch('/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsLoggedIn(true);
        fetchMessages();
        fetchStats();
      } else {
        window.alert(`Login failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Login error:', error);
              window.alert('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await fetch('/admin/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setMessages([]);
      setStats({});
      setSelectedMessage(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/admin/messages');
      const result = await response.json();

      if (response.ok && result.success) {
        setMessages(result.messages);
        setStats(result.stats);
      } else {
        setError(result.error || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('/admin/stats');
      const result = await response.json();

      if (response.ok && result.success) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Update message
  const updateMessage = async (messageId, updates) => {
    try {
      const response = await fetch(`/admin/message/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        fetchMessages();
        fetchStats();
      } else {
        window.alert(`Error: ${result.error || 'Failed to update message'}`);
      }
    } catch (error) {
      console.error('Error updating message:', error);
              window.alert('Failed to update message');
    }
  };

  // Reply to message
  const handleReply = async (messageId) => {
    if (!replyText.trim()) {
      window.alert('Please enter a reply message');
      return;
    }

    try {
      const response = await fetch(`/admin/message/${messageId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply: replyText })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setReplyText('');
        setReplyingTo(null);
        fetchMessages();
        fetchStats();
        window.alert('Reply sent successfully!');
      } else {
                  window.alert(`Error: ${result.error || 'Failed to send reply'}`);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
              window.alert('Failed to send reply');
    }
  };

  // Delete message
  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await fetch(`/admin/message/${messageId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok && result.success) {
        fetchMessages();
        fetchStats();
        window.alert('Message deleted successfully!');
      } else {
                  window.alert(`Error: ${result.error || 'Failed to delete message'}`);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
              window.alert('Failed to delete message');
    }
  };

  // Filter and search messages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        fetchMessages();
        fetchStats();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <DashboardContainer>
        <LoginContainer
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <LoginTitle>
            <LogIn size={32} />
            Admin Dashboard Login
          </LoginTitle>
          
          <LoginForm onSubmit={handleLogin}>
            <FormGroup>
              <FormLabel>Username</FormLabel>
              <FormInput
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                required
                placeholder="Enter username"
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Password</FormLabel>
              <FormInput
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                required
                placeholder="Enter password"
              />
            </FormGroup>
            
            <LoginButton type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </LoginButton>
          </LoginForm>
          
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            <p><strong>Default credentials:</strong></p>
            <p>Username: admin</p>
            <p>Password: admin123</p>
          </div>
        </LoginContainer>
      </DashboardContainer>
    );
  }

  if (loading) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '4rem', color: 'white' }}>
          Loading admin dashboard...
        </div>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '4rem', color: 'white' }}>
          Error: {error}
          <br />
          <button onClick={fetchMessages} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Retry
          </button>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <MainDashboard>
        <DashboardHeader>
          <HeaderTitle>
            <MessageSquare size={32} />
            Admin Dashboard
          </HeaderTitle>
          
          <HeaderActions>
            <span style={{ color: 'white', fontWeight: 500 }}>
              Welcome, {loginData.username}!
            </span>
            <LogoutButton onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </LogoutButton>
          </HeaderActions>
        </DashboardHeader>

        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StatNumber>{stats.total || 0}</StatNumber>
            <StatLabel>Total Messages</StatLabel>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatNumber>{stats.new || 0}</StatNumber>
            <StatLabel>New Messages</StatLabel>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatNumber>{stats.replied || 0}</StatNumber>
            <StatLabel>Replied</StatLabel>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <StatNumber>{stats.closed || 0}</StatNumber>
            <StatLabel>Closed</StatLabel>
          </StatCard>
        </StatsGrid>

        <DashboardContent>
          <MessagesSection>
            <SectionHeader>
              <SectionTitle>
                <Mail size={24} />
                Message Management
              </SectionTitle>
              
              <SearchBar>
                <SearchInput
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <FilterSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </FilterSelect>
              </SearchBar>
            </SectionHeader>

            {filteredMessages.length === 0 ? (
              <EmptyState>
                <EmptyIcon />
                <h3>No messages found</h3>
                <p>Try adjusting your search or filters</p>
              </EmptyState>
            ) : (
              <MessageList>
                {filteredMessages.map((message) => (
                  <MessageCard
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MessageHeader>
                      <MessageInfo>
                        <MessageSubject>{message.subject}</MessageSubject>
                        <MessageMeta>
                          <span>
                            <User size={16} />
                            {message.name}
                          </span>
                          <span>
                            <Mail size={16} />
                            {message.email}
                          </span>
                          <span>
                            <Clock size={16} />
                            {formatTimestamp(message.timestamp)}
                          </span>
                          <MessageStatus className={message.status}>
                            {message.status}
                          </MessageStatus>
                          <MessagePriority className={message.priority || 'normal'}>
                            {message.priority || 'normal'}
                          </MessagePriority>
                        </MessageMeta>
                      </MessageInfo>
                      
                      <MessageActions>
                        <ActionButton
                          onClick={() => setSelectedMessage(selectedMessage?.id === message.id ? null : message)}
                          title="View details"
                        >
                          <Eye size={16} />
                        </ActionButton>
                        
                        {message.status !== 'replied' && (
                          <ActionButton
                            className="reply"
                            onClick={() => setReplyingTo(replyingTo === message.id ? null : message.id)}
                            title="Reply to message"
                          >
                            <Reply size={16} />
                          </ActionButton>
                        )}
                        
                        <ActionButton
                          className="delete"
                          onClick={() => handleDelete(message.id)}
                          title="Delete message"
                        >
                          <Trash2 size={16} />
                        </ActionButton>
                      </MessageActions>
                    </MessageHeader>

                    <MessageContent>
                      {message.message.length > 150 
                        ? `${message.message.substring(0, 150)}...`
                        : message.message
                      }
                    </MessageContent>

                    {selectedMessage?.id === message.id && (
                      <MessageDetails>
                        <strong>Full Message:</strong>
                        <br />
                        {message.message}
                        <br /><br />
                        <strong>Message ID:</strong> {message.id}
                        <br />
                        <strong>Status:</strong> {message.status}
                        <br />
                        <strong>Priority:</strong> {message.priority || 'normal'}
                        <br />
                        <strong>Category:</strong> {message.category || 'general'}
                        <br />
                        <strong>Received:</strong> {formatTimestamp(message.timestamp)}
                        {message.admin_notes && (
                          <>
                            <br />
                            <strong>Admin Notes:</strong> {message.admin_notes}
                          </>
                        )}
                        {message.admin_reply && (
                          <>
                            <br />
                            <strong>Admin Reply:</strong> {message.admin_reply}
                            <br />
                            <strong>Replied by:</strong> {message.replied_by}
                            <br />
                            <strong>Replied at:</strong> {formatTimestamp(message.replied_at)}
                          </>
                        )}
                      </MessageDetails>
                    )}

                    {replyingTo === message.id && (
                      <ReplyForm>
                        <ReplyTextarea
                          placeholder="Type your reply here..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <ReplyButton onClick={() => handleReply(message.id)}>
                            Send Reply
                          </ReplyButton>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            style={{
                              background: '#6b7280',
                              color: 'white',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </ReplyForm>
                    )}
                  </MessageCard>
                ))}
              </MessageList>
            )}
          </MessagesSection>

          <Sidebar>
            <SidebarTitle>
              <BarChart3 size={20} />
              Quick Actions
            </SidebarTitle>
            
            <QuickActions>
              <QuickActionButton onClick={() => setStatusFilter('new')}>
                <AlertCircle size={16} />
                View New Messages
              </QuickActionButton>
              
              <QuickActionButton onClick={() => setStatusFilter('all')}>
                <Mail size={16} />
                View All Messages
              </QuickActionButton>
              
              <QuickActionButton onClick={() => setSearchTerm('')}>
                <Filter size={16} />
                Clear Filters
              </QuickActionButton>
            </QuickActions>

            <SidebarTitle>
              <TrendingUp size={20} />
              Recent Activity
            </SidebarTitle>
            
            <RecentActivity>
              {messages.slice(0, 5).map((message) => (
                <ActivityItem key={message.id}>
                  <ActivitySubject>{message.subject}</ActivitySubject>
                  <ActivityMeta>
                    {message.status} • {formatTimestamp(message.timestamp)}
                  </ActivityMeta>
                </ActivityItem>
              ))}
            </RecentActivity>
          </Sidebar>
        </DashboardContent>
      </MainDashboard>
    </DashboardContainer>
  );
};

export default AdminDashboard;
