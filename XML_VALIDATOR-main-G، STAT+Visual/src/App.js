import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Support from './pages/Support';
import AdminDashboard from './components/AdminDashboard';

// English-only verification utility
const ensureEnglishOnly = (text) => {
  if (typeof text !== 'string') return text;
  
  // Replace common Arabic words with English equivalents
  const replacements = {
    'خطأ': 'Error',
    'مشكلة': 'Problem',
    'الحل': 'Solution',
    'تأكد': 'Make sure',
    'تحقق': 'Check',
    'راجع': 'Review',
    'استخدم': 'Use',
    'اختر': 'Choose',
    'أضف': 'Add',
    'صحح': 'Fix',
    'غيّر': 'Change'
  };
  
  let result = text;
  Object.entries(replacements).forEach(([arabic, english]) => {
    result = result.replace(new RegExp(arabic, 'g'), english);
  });
  
  return result;
};

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
`;

const MainContent = styled.main`
  flex: 1;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/support" element={<Support />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </MainContent>
        <Footer />
      </AppContainer>
    </Router>
  );
}

export default App;
