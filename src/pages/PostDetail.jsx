// src/pages/PostDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client'; 
import '../App.css'; 

export default function PostDetail() {
    const { id } = useParams(); 
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        client.get(`/posts/${id}`)
            .then(response => {
                setPost(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar post:", err);
                setError("El post solicitado no existe.");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="loading-state post-detail-container">Cargando Post...</div>;
    if (error) return <div className="error-state post-detail-container">{error}</div>;
    if (!post) return <div className="no-data-state post-detail-container">Post no encontrado.</div>;

    // Función para manejar los saltos de línea y el formato (### para h3, etc.)
    const renderContent = () => {
        if (!post.content) return null;
        
        return post.content.split('\n').map((line, index) => {
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith('###')) return <h3 key={index} className="post-h3">{trimmedLine.substring(3).trim()}</h3>;
            if (trimmedLine.startsWith('####')) return <h4 key={index} className="post-h4">{trimmedLine.substring(4).trim()}</h4>;
            
            // Renderizado de bloques de código
            if (trimmedLine.startsWith('```')) {
                let codeBlock = '';
                let j = index + 1;
                while (j < post.content.split('\n').length && !post.content.split('\n')[j].trim().startsWith('```')) {
                    codeBlock += post.content.split('\n')[j] + '\n';
                    j++;
                }
                return <pre key={index}><code className="code-block">{codeBlock}</code></pre>;
            }
            // Excluir líneas vacías si está dentro del bloque de código
            if (trimmedLine === '') return <p key={index} className="empty-line"></p>;
            
            return <p key={index} className="post-paragraph">{trimmedLine}</p>;
        });
    };

    return (
        <div className="post-detail-container">
            <Link to="/posts" className="btn-back">← Volver al listado</Link>
            <h1 className="detail-title">{post.title}</h1>
            <p className="detail-meta">Publicado el {post.date} por {post.author}</p>
            <hr />
            <div className="detail-content">
                {renderContent()}
            </div>
        </div>
    );
}