import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; 
import { ThemeProvider } from './context/ThemeContext.jsx'; // <-- Con .jsx
import { BrowserRouter as Router } from 'react-router-dom'; // <-- BrowserRouter AQUÍ

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <Router> {/* Router DEBE estar aquí, fuera de App */}
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
);