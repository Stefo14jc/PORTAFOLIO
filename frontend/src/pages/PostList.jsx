// src/pages/PostList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client'; // Usamos Axios
import '../App.css'; 

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        client.get('/posts')
            .then(response => {
                setPosts(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar posts:", err);
                setError("No se pudieron cargar los posts. ¿Está corriendo json-server?");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading-state">Cargando Posts...</div>;
    if (error) return <div className="error-state posts-container">{error}</div>;

    return (
        <div className="posts-container">
            <h1 className="posts-title">📝 Blog Técnico</h1>
            <div className="posts-grid">
                {posts.map(post => (
                    <div key={post.id} className="post-card-item">
                        <h2 className="post-card-title">{post.title}</h2>
                        <small className="post-card-meta">Publicado: {post.date} | Autor: {post.author}</small>
                        <p className="post-card-body">{post.content.substring(0, 120)}...</p>
                        <Link to={`/posts/${post.id}`} className="post-card-button">Leer Artículo Completo</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}