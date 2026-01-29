// src/components/Layout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom'; 

// Componente simple de navegación
function NavBar() {
    return (
        <nav className="main-nav no-print">
            <Link to="/" className="nav-link">Hoja de Vida (CV)</Link>
            <Link to="/posts" className="nav-link">Blog Técnico</Link>
        </nav>
    );
}

export default function Layout() {
  return (
    <div className="app-main-layout">
      <NavBar />
      <div className="app-content-area">
        {/* Aquí se renderiza Home, PostList o PostDetail */}
        <Outlet /> 
      </div>
    </div>
  );
}