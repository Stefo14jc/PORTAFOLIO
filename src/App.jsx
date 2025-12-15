// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; 
import Home from './pages/Home'; 
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail'; 
import './App.css';

export default function App() {
    return (
        <Routes>
            {/* La ruta padre usa el Layout para la estructura global */}
            <Route path="/" element={<Layout />}>
                {/* 1. / (Hoja de Vida) */}
                <Route index element={<Home />} /> 
                {/* 2. /posts (Listado de Posts) */}
                <Route path="posts" element={<PostList />} /> 
                {/* 3. /posts/:id (Detalle de cada post) */}
                <Route path="posts/:id" element={<PostDetail />} />
                
                <Route path="*" element={<h1>404: Página No Encontrada</h1>} />
            </Route>
        </Routes>
    );
}