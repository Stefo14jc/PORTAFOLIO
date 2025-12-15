import React from 'react';
import { useParams } from 'react-router-dom';
import useFetchData from '../hooks/useFetchData.js'; // <-- Con .js

const PostDetail = () => {
  const { id } = useParams();
  
  const { data: post, loading, error } = useFetchData(`/posts/${id}`);

  if (loading) return <p>Cargando post...</p>;
  if (error) return <p style={{color: 'red'}}>Error al cargar el post: {error}</p>;
  if (!post) return <p>Post no encontrado.</p>;

  return (
    <main className="content">
      <article>
        <h1>{post.title}</h1>
        <p className="post-meta">Publicado el: {post.date}</p>
        
        <div className="post-content">
          {/* Muestra el contenido respetando saltos de línea */}
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
};

export default PostDetail;