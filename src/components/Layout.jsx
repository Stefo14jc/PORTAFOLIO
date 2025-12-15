import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx'; // <-- Con .jsx

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header className="header">
        <nav className="nav">
          <Link to="/" className="nav-link">Hoja de Vida</Link>
          <Link to="/posts" className="nav-link">Blog Técnico</Link>
        </nav>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          Cambiar a Modo {theme === 'light' ? 'Oscuro 🌙' : 'Claro ☀️'}
        </button>
      </header>
      <div className="container">
        {children}
      </div>
      <footer className="footer">
        <p>© 2025 Portafolio Personal</p>
      </footer>
    </>
  );
};

export default Layout;