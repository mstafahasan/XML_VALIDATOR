# XML Schema Validator Pro

A professional-grade XML Schema validation tool built with React and Flask, featuring a modern, responsive UI and powerful validation capabilities.

## 🚀 Features

- **Professional UI/UX**: Modern React-based interface with smooth animations and responsive design
- **Drag & Drop File Upload**: Intuitive file handling with visual feedback
- **Batch Processing**: Validate multiple XML files simultaneously
- **Real-time Validation**: Instant feedback with detailed error reporting
- **Professional Design**: Enterprise-grade styling with glassmorphism effects
- **Mobile Responsive**: Works seamlessly on all devices
- **Modern Tech Stack**: Built with React 18, styled-components, and Framer Motion

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Styled Components** - CSS-in-JS styling solution
- **Framer Motion** - Professional animations and transitions
- **React Router** - Client-side routing
- **React Dropzone** - Drag and drop file handling
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful, consistent icons

### Backend
- **Flask** - Python web framework
- **xmlschema** - XML Schema validation library
- **Python 3.8+** - Modern Python features

## 📁 Project Structure

```
schema/
├── src/                          # React source code
│   ├── components/              # Reusable UI components
│   │   ├── Header.js           # Navigation header
│   │   ├── Footer.js           # Site footer
│   │   ├── FileUpload.js       # File upload component
│   │   └── ValidationResults.js # Results display
│   ├── pages/                  # Page components
│   │   ├── Home.js            # Main validation page
│   │   ├── About.js           # About page
│   │   └── Support.js         # Support page
│   ├── App.js                 # Main app component
│   ├── index.js               # App entry point
│   └── index.css              # Global styles
├── public/                     # Static assets
├── app.py                     # Flask backend
├── package.json               # Node.js dependencies
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.8+
- **Flask** and required Python packages

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd schema
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   pip install flask xmlschema
   ```

4. **Start the development servers**

   **Terminal 1 - Backend (Flask)**
   ```bash
   python app.py
   ```

   **Terminal 2 - Frontend (React)**
   ```bash
   npm start
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🎯 Usage

### Basic Validation

1. **Upload Schema**: Drag and drop your XSD schema file
2. **Upload XML Files**: Add XML files to validate (valid and invalid categories)
3. **Start Validation**: Click "Start Validation" to process files
4. **View Results**: See detailed validation results with error information

### File Types Supported

- **Schema Files**: `.xsd`, `.xml` (XSD schemas)
- **XML Files**: `.xml` files for validation

### Validation Features

- **Schema Loading**: Automatic XSD schema parsing
- **File Validation**: Individual file validation against schema
- **Error Reporting**: Detailed error messages with context
- **Batch Processing**: Multiple file validation
- **Result Categorization**: Separate valid/invalid file lists

## 🎨 Design Features

### Modern UI Elements
- **Glassmorphism**: Translucent, frosted glass effects
- **Gradient Backgrounds**: Beautiful color transitions
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Professional Typography**: Inter font family for readability

### Interactive Components
- **Drag & Drop**: Intuitive file upload experience
- **Hover Effects**: Engaging micro-interactions
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Confirmation of completed actions

## 🔧 Configuration

### Frontend Configuration

The React app is configured to proxy API requests to the Flask backend:

```json
{
  "proxy": "http://localhost:5000"
}
```

### Backend Configuration

Flask server runs on port 5000 with debug mode enabled:

```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured experience with side-by-side layouts
- **Tablet**: Optimized for medium screens
- **Mobile**: Touch-friendly interface with mobile navigation

## 🚀 Deployment

### Production Build

1. **Build the React app**
   ```bash
   npm run build
   ```

2. **Serve the build folder**
   ```bash
   # Copy build contents to your web server
   # Or use a static file server
   npx serve -s build
   ```

### Backend Deployment

The Flask backend can be deployed using:
- **Gunicorn** for production WSGI server
- **Docker** for containerized deployment
- **Cloud platforms** like Heroku, AWS, or Google Cloud

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the About and Support pages
- **Issues**: Report bugs via GitHub Issues
- **Contact**: Use the contact form on the Support page

## 🙏 Acknowledgments

- **React Team** for the amazing frontend framework
- **Flask Team** for the lightweight Python web framework
- **Framer Motion** for smooth animations
- **Styled Components** for CSS-in-JS styling
- **Lucide** for beautiful icons

---

Built with ❤️ for the developer community
