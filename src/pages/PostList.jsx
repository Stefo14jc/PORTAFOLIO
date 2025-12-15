import React from 'react';
import useFetchData from '../hooks/useFetchData.js'; // <-- Con .js
import { Link } from 'react-router-dom';

const PostList = () => {
  const { data: posts, loading, error } = useFetchData('/posts');

  if (loading) return <p>Cargando posts del Blog...</p>;
  if (error) return <p style={{color: 'red'}}>Error al cargar posts: {error}</p>;
  if (!posts || posts.length === 0) return <p>No hay posts disponibles.</p>;

  return (
    <main className="content">
      <h1>📰 Blog Técnico</h1>
      <div className="post-list">
        {posts.map((post) => (
          <article key={post.id} className="post-summary">
            <h2>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h2>
            <p className="post-meta">Publicado el: {post.date}</p>
            <p>{post.content.substring(0, 150)}...</p>
          </article>
        ))}
      </div>
    </main>
  );
};

export default PostList;