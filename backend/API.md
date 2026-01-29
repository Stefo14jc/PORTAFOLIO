# 📡 API Documentation

Documentación completa de los endpoints de la API del portafolio.

## Base URL

```
# Desarrollo
http://localhost:5000/api

# Producción
https://tu-backend.onrender.com/api
```

## Autenticación

La mayoría de los endpoints requieren un token JWT en el header:

```
Authorization: Bearer <token>
```

---

## 🔐 Autenticación (`/auth`)

### Registrar usuario

Crea un nuevo usuario administrador.

**Endpoint:** `POST /auth/register`

**Body:**
```json
{
  "username": "admin",
  "email": "admin@ejemplo.com",
  "password": "password123"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": "64abc123def456...",
    "username": "admin",
    "email": "admin@ejemplo.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores posibles:**
- `400`: Usuario o email ya existe
- `400`: Errores de validación

---

### Iniciar sesión

Autentica un usuario existente.

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "email": "admin@ejemplo.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "id": "64abc123def456...",
    "username": "admin",
    "email": "admin@ejemplo.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores posibles:**
- `401`: Credenciales inválidas
- `400`: Errores de validación

---

### Obtener usuario actual

Devuelve información del usuario autenticado.

**Endpoint:** `GET /auth/me`

**Headers:** 
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "64abc123def456...",
    "username": "admin",
    "email": "admin@ejemplo.com",
    "role": "admin"
  }
}
```

**Errores posibles:**
- `401`: No autorizado o token inválido

---

## 👤 Perfil/CV (`/profile`)

### Obtener perfil público

Devuelve toda la información del perfil (pública).

**Endpoint:** `GET /profile`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc...",
    "name": "Juan Pérez",
    "title": "Full Stack Developer",
    "bio": "Desarrollador apasionado por...",
    "email": "juan@ejemplo.com",
    "phone": "+593 99 123 4567",
    "location": "Quito, Ecuador",
    "website": "https://juanperez.dev",
    "github": "https://github.com/juanperez",
    "linkedin": "https://linkedin.com/in/juanperez",
    "twitter": "https://twitter.com/juanperez",
    "experience": [
      {
        "_id": "64def...",
        "title": "Senior Developer",
        "company": "TechCorp",
        "location": "Quito, Ecuador",
        "startDate": "2022-01-15T00:00:00.000Z",
        "endDate": null,
        "current": true,
        "description": "Desarrollo de aplicaciones web con React y Node.js"
      }
    ],
    "education": [
      {
        "_id": "64ghi...",
        "degree": "Ingeniería en Sistemas",
        "institution": "Universidad Central",
        "location": "Quito, Ecuador",
        "startDate": "2018-09-01T00:00:00.000Z",
        "endDate": "2022-07-15T00:00:00.000Z",
        "current": false,
        "description": "Especialización en desarrollo web"
      }
    ],
    "skills": [
      {
        "_id": "64jkl...",
        "name": "React",
        "category": "frontend",
        "level": "avanzado"
      },
      {
        "_id": "64mno...",
        "name": "Node.js",
        "category": "backend",
        "level": "avanzado"
      }
    ],
    "languages": [
      {
        "name": "Español",
        "level": "nativo"
      },
      {
        "name": "Inglés",
        "level": "avanzado"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-29T14:20:00.000Z"
  }
}
```

**Errores posibles:**
- `404`: Perfil no encontrado

---

### Crear perfil

Crea el perfil inicial (solo admin, solo una vez).

**Endpoint:** `POST /profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Juan Pérez",
  "title": "Full Stack Developer",
  "bio": "Desarrollador apasionado por crear soluciones",
  "email": "juan@ejemplo.com",
  "phone": "+593 99 123 4567",
  "location": "Quito, Ecuador",
  "github": "https://github.com/juanperez",
  "linkedin": "https://linkedin.com/in/juanperez"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Perfil creado exitosamente",
  "data": { /* perfil completo */ }
}
```

**Errores posibles:**
- `400`: Ya existe un perfil
- `401`: No autorizado
- `403`: Solo administradores

---

### Actualizar perfil

Actualiza información general del perfil.

**Endpoint:** `PUT /profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:** (todos los campos son opcionales)
```json
{
  "name": "Juan Pérez",
  "title": "Senior Full Stack Developer",
  "bio": "Nueva biografía...",
  "phone": "+593 99 999 9999"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": { /* perfil actualizado */ }
}
```

**Errores posibles:**
- `404`: Perfil no encontrado
- `401`: No autorizado
- `403`: Solo administradores

---

### Agregar experiencia

Añade una nueva experiencia laboral.

**Endpoint:** `POST /profile/experience`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Senior Developer",
  "company": "TechCorp",
  "location": "Quito, Ecuador",
  "startDate": "2022-01-15",
  "endDate": null,
  "current": true,
  "description": "Desarrollo de aplicaciones web"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Experiencia agregada exitosamente",
  "data": { /* perfil con nueva experiencia */ }
}
```

---

### Actualizar experiencia

Modifica una experiencia existente.

**Endpoint:** `PUT /profile/experience/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Lead Developer",
  "description": "Nueva descripción..."
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Experiencia actualizada exitosamente",
  "data": { /* perfil actualizado */ }
}
```

**Errores posibles:**
- `404`: Experiencia no encontrada

---

### Eliminar experiencia

Elimina una experiencia laboral.

**Endpoint:** `DELETE /profile/experience/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Experiencia eliminada exitosamente",
  "data": { /* perfil actualizado */ }
}
```

---

### Gestión de educación

Similar a experiencia:

- **Agregar:** `POST /profile/education`
- **Actualizar:** `PUT /profile/education/:id`
- **Eliminar:** `DELETE /profile/education/:id`

**Body para agregar/actualizar:**
```json
{
  "degree": "Ingeniería en Sistemas",
  "institution": "Universidad Central",
  "location": "Quito, Ecuador",
  "startDate": "2018-09-01",
  "endDate": "2022-07-15",
  "current": false,
  "description": "Especialización en desarrollo web"
}
```

---

### Gestión de habilidades

**Agregar habilidad:** `POST /profile/skills`

**Body:**
```json
{
  "name": "React",
  "category": "frontend",
  "level": "avanzado"
}
```

**Categorías disponibles:**
- `frontend`
- `backend`
- `database`
- `tools`
- `other`

**Niveles disponibles:**
- `básico`
- `intermedio`
- `avanzado`
- `experto`

**Eliminar habilidad:** `DELETE /profile/skills/:id`

---

## 📝 Blog (`/blog`)

### Listar posts

Obtiene todos los posts publicados (o todos si es admin).

**Endpoint:** `GET /blog`

**Query params:**
- `category` (opcional): Filtrar por categoría
- `tag` (opcional): Filtrar por etiqueta
- `search` (opcional): Búsqueda de texto completo
- `limit` (opcional, default: 10): Número de posts por página
- `page` (opcional, default: 1): Página actual

**Ejemplo:**
```
GET /blog?category=backend&limit=5&page=1
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64pqr...",
      "title": "Por qué elegí MongoDB",
      "slug": "por-que-elegi-mongodb",
      "summary": "Comparación técnica entre MongoDB y PostgreSQL",
      "content": "Cuando comencé a desarrollar...",
      "category": "backend",
      "tags": ["mongodb", "postgresql", "databases"],
      "author": {
        "_id": "64abc...",
        "username": "admin",
        "email": "admin@ejemplo.com"
      },
      "coverImage": "https://...",
      "published": true,
      "views": 156,
      "readTime": 8,
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-29T12:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalPosts": 12,
    "limit": 5
  }
}
```

---

### Obtener post por slug

Devuelve un post específico.

**Endpoint:** `GET /blog/:slug`

**Ejemplo:**
```
GET /blog/por-que-elegi-mongodb
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64pqr...",
    "title": "Por qué elegí MongoDB",
    "slug": "por-que-elegi-mongodb",
    "summary": "Comparación técnica...",
    "content": "Contenido completo del post...",
    "category": "backend",
    "tags": ["mongodb", "postgresql"],
    "author": {
      "_id": "64abc...",
      "username": "admin",
      "email": "admin@ejemplo.com"
    },
    "published": true,
    "views": 156,
    "readTime": 8,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-29T12:00:00.000Z"
  }
}
```

**Errores posibles:**
- `404`: Post no encontrado

---

### Crear post

Crea un nuevo post (solo admin).

**Endpoint:** `POST /blog`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Mi nuevo post",
  "summary": "Resumen del post (máximo 300 caracteres)",
  "content": "Contenido completo del post (mínimo 1000 caracteres)...",
  "category": "backend",
  "tags": ["node", "express", "api"],
  "coverImage": "https://...",
  "published": false
}
```

**Notas:**
- `slug` se genera automáticamente del título
- `readTime` se calcula automáticamente
- `author` se asigna automáticamente del usuario autenticado

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Post creado exitosamente",
  "data": { /* post completo */ }
}
```

**Errores posibles:**
- `400`: Errores de validación (título muy largo, contenido muy corto, etc.)
- `401`: No autorizado
- `403`: Solo administradores

---

### Actualizar post

Modifica un post existente (solo admin).

**Endpoint:** `PUT /blog/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:** (todos los campos son opcionales)
```json
{
  "title": "Título actualizado",
  "content": "Contenido actualizado...",
  "tags": ["nueva", "etiqueta"]
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Post actualizado exitosamente",
  "data": { /* post actualizado */ }
}
```

**Errores posibles:**
- `404`: Post no encontrado
- `400`: Errores de validación

---

### Eliminar post

Elimina un post permanentemente (solo admin).

**Endpoint:** `DELETE /blog/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Post eliminado exitosamente"
}
```

**Errores posibles:**
- `404`: Post no encontrado

---

### Publicar/Despublicar post

Cambia el estado de publicación de un post (solo admin).

**Endpoint:** `PATCH /blog/:id/publish`

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Post publicado exitosamente",
  "data": {
    "_id": "64pqr...",
    "published": true,
    // ... resto del post
  }
}
```

---

### Incrementar vistas

Incrementa el contador de vistas de un post.

**Endpoint:** `POST /blog/:slug/view`

**Ejemplo:**
```
POST /blog/por-que-elegi-mongodb/view
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "views": 157
  }
}
```

**Errores posibles:**
- `404`: Post no encontrado

---

## Códigos de estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Error de validación |
| 401 | Unauthorized - No autorizado / token inválido |
| 403 | Forbidden - No tienes permisos |
| 404 | Not Found - Recurso no encontrado |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Error del servidor |

---

## Rate Limits

Para prevenir abuso, la API tiene los siguientes límites:

- **General:** 100 peticiones por IP cada 15 minutos
- **Login:** 5 intentos cada 15 minutos

Headers de rate limit:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706543210
```

---

## Ejemplos de uso

### JavaScript/Fetch

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    return data.data;
  }
  
  throw new Error(data.message);
};

// Crear post (requiere token)
const createPost = async (postData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/blog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(postData)
  });
  
  return await response.json();
};
```

### Axios

```javascript
import axios from 'axios';

// Configurar instancia con token
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Interceptor para agregar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usar
const posts = await api.get('/blog');
const newPost = await api.post('/blog', postData);
```

### cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ejemplo.com","password":"password123"}'

# Obtener posts
curl http://localhost:5000/api/blog

# Crear post (con token)
curl -X POST http://localhost:5000/api/blog \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "Mi post",
    "summary": "Resumen...",
    "content": "Contenido largo...",
    "category": "backend",
    "published": true
  }'
```

---

## Errores comunes y soluciones

### "No autorizado, no hay token"
**Solución:** Incluye el header `Authorization: Bearer <token>` en la petición.

### "Token inválido o expirado"
**Solución:** El token expiró (7 días por defecto). Haz login nuevamente.

### "Demasiadas peticiones"
**Solución:** Espera 15 minutos o contacta al admin.

### "Error de validación"
**Solución:** Revisa que los datos cumplan con los requisitos (longitud mínima/máxima, formato, etc.).

### "El usuario o email ya existe"
**Solución:** Usa otro email o nombre de usuario.

---

## Testing

Para probar la API, puedes usar:

- **Postman**: [Importar colección](#)
- **Thunder Client**: Extensión de VS Code
- **Insomnia**: Cliente REST alternativo

---

## Swagger/OpenAPI (Opcional)

Si implementas Swagger, estará disponible en:

```
http://localhost:5000/api-docs
```

---

## Soporte

¿Encontraste un bug o tienes una sugerencia?

- GitHub Issues: [tu-repo/issues](https://github.com/tu-usuario/tu-repo/issues)
- Email: tu@email.com

---

**Última actualización:** 29 de enero de 2026
