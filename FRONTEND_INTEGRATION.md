# 🔌 Integración del Frontend Existente con el Backend

Esta guía te muestra cómo conectar tu frontend React existente con el backend que acabamos de crear.

## 📋 Archivos que necesitas crear/modificar en tu frontend

### 1. Configuración de Axios

Crea: `src/services/api.js`

\`\`\`javascript
import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
\`\`\`

---

### 2. Servicios de API

Crea: `src/services/authService.js`

\`\`\`javascript
import api from './api';

export const authService = {
  // Registrar usuario
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Iniciar sesión
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
\`\`\`

Crea: `src/services/profileService.js`

\`\`\`javascript
import api from './api';

export const profileService = {
  // Obtener perfil público
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data.data;
  },

  // Actualizar perfil (admin)
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data.data;
  },

  // Agregar experiencia
  addExperience: async (experienceData) => {
    const response = await api.post('/profile/experience', experienceData);
    return response.data.data;
  },

  // Actualizar experiencia
  updateExperience: async (id, experienceData) => {
    const response = await api.put(\`/profile/experience/\${id}\`, experienceData);
    return response.data.data;
  },

  // Eliminar experiencia
  deleteExperience: async (id) => {
    const response = await api.delete(\`/profile/experience/\${id}\`);
    return response.data.data;
  },

  // Similar para education y skills
  addEducation: async (educationData) => {
    const response = await api.post('/profile/education', educationData);
    return response.data.data;
  },

  addSkill: async (skillData) => {
    const response = await api.post('/profile/skills', skillData);
    return response.data.data;
  },

  deleteSkill: async (id) => {
    const response = await api.delete(\`/profile/skills/\${id}\`);
    return response.data.data;
  }
};
\`\`\`

Crea: `src/services/blogService.js`

\`\`\`javascript
import api from './api';

export const blogService = {
  // Obtener todos los posts
  getAllPosts: async (params = {}) => {
    const response = await api.get('/blog', { params });
    return response.data;
  },

  // Obtener post por slug
  getPostBySlug: async (slug) => {
    const response = await api.get(\`/blog/\${slug}\`);
    return response.data.data;
  },

  // Crear post (admin)
  createPost: async (postData) => {
    const response = await api.post('/blog', postData);
    return response.data.data;
  },

  // Actualizar post (admin)
  updatePost: async (id, postData) => {
    const response = await api.put(\`/blog/\${id}\`, postData);
    return response.data.data;
  },

  // Eliminar post (admin)
  deletePost: async (id) => {
    await api.delete(\`/blog/\${id}\`);
  },

  // Publicar/despublicar post
  togglePublish: async (id) => {
    const response = await api.patch(\`/blog/\${id}/publish\`);
    return response.data.data;
  },

  // Incrementar vistas
  incrementViews: async (slug) => {
    await api.post(\`/blog/\${slug}/view\`);
  }
};
\`\`\`

---

### 3. Context para autenticación

Crea: `src/context/AuthContext.jsx`

\`\`\`javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario en localStorage
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.data);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
\`\`\`

---

### 4. Hooks personalizados

Crea: `src/hooks/useFetchProfile.js`

\`\`\`javascript
import { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';

export const useFetchProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};
\`\`\`

Crea: `src/hooks/useFetchPosts.js`

\`\`\`javascript
import { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';

export const useFetchPosts = (params = {}) => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogService.getAllPosts(params);
        setPosts(data.data);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [JSON.stringify(params)]);

  return { posts, pagination, loading, error, refetch: () => setLoading(true) };
};
\`\`\`

---

### 5. Modificar tu App.jsx

Envuelve tu app con el AuthProvider:

\`\`\`javascript
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Tus rutas y componentes aquí */}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
\`\`\`

---

### 6. Componente de Login

Crea: `src/pages/Login.jsx`

\`\`\`javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin'); // Redirigir al panel de admin
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Iniciar Sesión
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
\`\`\`

---

### 7. Modificar tu componente Resume.jsx

\`\`\`javascript
import { useFetchProfile } from '../hooks/useFetchProfile';

export default function Resume() {
  const { profile, loading, error } = useFetchProfile();

  if (loading) {
    return <div className="text-center py-20">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="text-center py-20">No se encontró el perfil</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
        <p className="text-xl text-gray-600">{profile.title}</p>
        <p className="text-gray-500 mt-2">{profile.location}</p>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Sobre mí</h2>
          <p className="text-gray-700">{profile.bio}</p>
        </div>
      )}

      {/* Experiencia */}
      {profile.experience?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Experiencia</h2>
          {profile.experience.map((exp) => (
            <div key={exp._id} className="mb-6 border-l-2 border-blue-500 pl-4">
              <h3 className="text-xl font-semibold">{exp.title}</h3>
              <p className="text-gray-600">{exp.company} • {exp.location}</p>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(exp.startDate).toLocaleDateString()} - 
                {exp.current ? ' Presente' : new Date(exp.endDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Educación */}
      {profile.education?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Educación</h2>
          {profile.education.map((edu) => (
            <div key={edu._id} className="mb-6">
              <h3 className="text-xl font-semibold">{edu.degree}</h3>
              <p className="text-gray-600">{edu.institution}</p>
              <p className="text-sm text-gray-500">{edu.location}</p>
            </div>
          ))}
        </div>
      )}

      {/* Habilidades */}
      {profile.skills?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Habilidades</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span 
                key={skill._id}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill.name} ({skill.level})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contacto */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
        <div className="space-y-2">
          <p>📧 {profile.email}</p>
          {profile.phone && <p>📱 {profile.phone}</p>}
          {profile.github && (
            <p>
              🐙 <a href={profile.github} className="text-blue-600 hover:underline">
                GitHub
              </a>
            </p>
          )}
          {profile.linkedin && (
            <p>
              💼 <a href={profile.linkedin} className="text-blue-600 hover:underline">
                LinkedIn
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
\`\`\`

---

### 8. Modificar PostList.jsx

\`\`\`javascript
import { Link } from 'react-router-dom';
import { useFetchPosts } from '../hooks/useFetchPosts';

export default function PostList() {
  const { posts, loading, error } = useFetchPosts();

  if (loading) {
    return <div className="text-center py-20">Cargando posts...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link 
            key={post._id} 
            to={\`/blog/\${post.slug}\`}
            className="border rounded-lg p-6 hover:shadow-lg transition"
          >
            <span className="text-sm text-blue-600 font-semibold uppercase">
              {post.category}
            </span>
            <h2 className="text-2xl font-bold my-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.summary}</p>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>⏱️ {post.readTime} min</span>
              <span>👁️ {post.views}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
\`\`\`

---

### 9. Variables de entorno

Crea: `.env` en la raíz del frontend:

\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

Y para producción (Vercel):
\`\`\`env
VITE_API_URL=https://tu-backend.onrender.com/api
\`\`\`

---

### 10. Instalar dependencias

En tu frontend:

\`\`\`bash
npm install axios
\`\`\`

---

## 🎯 Rutas que debes tener en tu React Router

\`\`\`javascript
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Resume from './pages/Resume';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/blog" element={<PostList />} />
        <Route path="/blog/:slug" element={<PostDetail />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}
\`\`\`

---

## ✅ Checklist de integración

- [ ] Crear servicios de API (authService, profileService, blogService)
- [ ] Crear contexto de autenticación
- [ ] Crear hooks personalizados
- [ ] Modificar componentes existentes para usar datos de la API
- [ ] Crear página de login
- [ ] Crear panel de administración
- [ ] Configurar variables de entorno
- [ ] Probar conexión con backend local
- [ ] Desplegar y probar en producción

---

## 🚀 Próximos pasos

1. **Implementa las páginas faltantes:** AdminDashboard, PostDetail, etc.
2. **Agrega formularios de edición:** Para perfil, experiencia, posts
3. **Mejora el UX:** Loading states, error handling, toast notifications
4. **Optimiza:** React.memo, lazy loading, code splitting

---

¿Necesitas ayuda con algún componente específico? ¡Pregunta!
