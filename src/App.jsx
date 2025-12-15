import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import Layout from './components/Layout'; 

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </Layout>
  );
}

export default App;