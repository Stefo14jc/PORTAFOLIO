# 🚀 Portafolio Full-Stack - Proyecto Final

Portafolio personal profesional con frontend moderno, backend robusto, autenticación segura y blog técnico.

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Despliegue](#-despliegue)
- [Blog Posts](#-blog-posts)
- [Seguridad](#-seguridad)
- [API Documentation](#-api-documentation)
- [Licencia](#-licencia)

---

## ✨ Características

### Frontend
✅ **React + Vite** - Desarrollo rápido con HMR
✅ **Tailwind CSS** - Estilos modernos y responsive
✅ **React Router** - Navegación client-side
✅ **Axios** - Comunicación con backend
✅ **Custom Hooks** - Lógica reutilizable
✅ **Diseño responsive** - Funciona en móviles, tablets y desktop

### Backend
✅ **Express.js** - Framework web robusto
✅ **MongoDB + Mongoose** - Base de datos NoSQL
✅ **JWT** - Autenticación basada en tokens
✅ **Bcrypt** - Hashing seguro de contraseñas
✅ **Validación** - express-validator en todas las rutas
✅ **Seguridad** - Helmet, CORS, Rate Limiting
✅ **Manejo de errores** - Centralizado y robusto

### Funcionalidades
✅ **Hoja de vida** completa (experiencia, educación, habilidades)
✅ **Blog técnico** con 4+ posts
✅ **Panel de administración** para gestionar contenido
✅ **Sistema de autenticación** seguro
✅ **CRUD completo** para perfil y posts
✅ **Contador de vistas** en posts
✅ **Cálculo automático** de tiempo de lectura

---

## 🛠 Tech Stack

### Frontend
```
React 18.x
Vite 5.x
Tailwind CSS 3.x
React Router 6.x
Axios
```

### Backend
```
Node.js 18+
Express 4.x
MongoDB (Atlas)
Mongoose 8.x
JWT (jsonwebtoken)
Bcrypt
express-validator
Helmet
CORS
express-rate-limit
```

### DevOps
```
Git & GitHub
Vercel (Frontend)
Render (Backend)
MongoDB Atlas (Database)
```

---

## 📁 Estructura del Proyecto

```
portfolio/
│
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas/vistas
│   │   ├── hooks/           # Custom hooks
│   │   ├── context/         # Context API
│   │   ├── services/        # API calls
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # API REST
│   ├── config/              # Configuraciones
│   │   └── database.js
│   ├── controllers/         # Lógica de negocio
│   │   ├── auth.controller.js
│   │   ├── profile.controller.js
│   │   └── blog.controller.js
│   ├── middleware/          # Middlewares
│   │   ├── auth.middleware.js
│   │   └── errorHandler.js
│   ├── models/              # Modelos de datos
│   │   ├── User.model.js
│   │   ├── Profile.model.js
│   │   └── BlogPost.model.js
│   ├── routes/              # Rutas de la API
│   │   ├── auth.routes.js
│   │   ├── profile.routes.js
│   │   └── blog.routes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── server.js
│   ├── README.md
│   └── API.md              # Documentación de la API
│
├── posts/                   # Posts del blog (archivos md)
│   ├── post1-mongodb-vs-postgresql.md
│   └── post2-seguridad-apis.md
│
├── MONGODB_SETUP.md        # Guía de configuración de BD
└── README.md               # Este archivo
```

---

## 🚀 Instalación

### Prerrequisitos

- Node.js >= 18.x
- npm o yarn
- Cuenta de MongoDB Atlas (gratis)
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/portfolio-fullstack.git
cd portfolio-fullstack
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuración

### Backend

1. **Configurar MongoDB Atlas** (ver [MONGODB_SETUP.md](MONGODB_SETUP.md))

2. **Crear archivo `.env`** en `/backend`:

```bash
cd backend
cp .env.example .env
```

3. **Editar `.env`** con tus valores:

```env
PORT=5000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=genera_un_secreto_aleatorio_de_64_caracteres
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Para generar `JWT_SECRET` seguro:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend

1. **Crear archivo `.env`** en `/frontend`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Uso

### Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Servidor en: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App en: `http://localhost:5173`

### Crear primer usuario admin

```bash
# Con cURL
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "tu@email.com",
    "password": "tuPassword123"
  }'

# O usa Postman/Thunder Client
```

### Crear perfil inicial

```bash
# Primero, obtén el token del paso anterior
# Luego:

curl -X POST http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "name": "Tu Nombre",
    "title": "Full Stack Developer",
    "bio": "Desarrollador apasionado...",
    "email": "tu@email.com",
    "location": "Tu Ciudad, País",
    "github": "https://github.com/tu-usuario",
    "linkedin": "https://linkedin.com/in/tu-perfil"
  }'
```

---

## 🌐 Despliegue

### Frontend (Vercel)

1. **Conectar repositorio a Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Import Project"
   - Selecciona tu repositorio de GitHub
   - Root Directory: `frontend`

2. **Configurar variables de entorno:**
   ```
   VITE_API_URL=https://tu-backend.onrender.com/api
   ```

3. **Deploy!**
   - Vercel automáticamente detectará Vite
   - Build command: `npm run build`
   - Output directory: `dist`

### Backend (Render)

1. **Crear Web Service en Render:**
   - Ve a [render.com](https://render.com)
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio
   - Root Directory: `backend`

2. **Configuración:**
   ```
   Name: portfolio-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

3. **Variables de entorno:**
   ```
   MONGODB_URI=tu_mongodb_uri
   JWT_SECRET=tu_jwt_secret
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://tu-frontend.vercel.app
   NODE_ENV=production
   ```

4. **Deploy!**

### Base de Datos (MongoDB Atlas)

Ya configurada (ver [MONGODB_SETUP.md](MONGODB_SETUP.md))

### URLs finales

Actualiza estas URLs en tus `.env`:

```env
# Backend .env
FRONTEND_URL=https://tu-portfolio.vercel.app

# Frontend .env
VITE_API_URL=https://tu-backend.onrender.com/api
```

---

## 📝 Blog Posts

Este proyecto incluye **2 posts técnicos originales**:

### 1. Por qué elegí MongoDB para mi portafolio (vs PostgreSQL)
- Comparación detallada entre MongoDB y PostgreSQL
- Justificación técnica de la elección
- Ejemplos de uso en diferentes industrias
- 1800+ palabras con código de ejemplo

**Archivo:** `posts/post1-mongodb-vs-postgresql.md`

### 2. Seguridad en APIs: Mejores prácticas para evitar ataques comunes
- 10 medidas de seguridad implementadas
- Protección contra inyección, XSS, fuerza bruta
- Ejemplos de código completos
- Checklist de seguridad
- 2000+ palabras

**Archivo:** `posts/post2-seguridad-apis.md`

**Para agregar estos posts a la base de datos:**

Usa el panel de administración o la API directamente (ver [API.md](backend/API.md))

---

## 🔒 Seguridad

Este proyecto implementa las siguientes medidas de seguridad:

### Autenticación
- ✅ Contraseñas hasheadas con bcrypt (10 salt rounds)
- ✅ JWT con expiración (7 días)
- ✅ Tokens en header Authorization
- ✅ Middleware de protección de rutas

### Validación
- ✅ express-validator en TODAS las rutas
- ✅ Sanitización de inputs
- ✅ Validación de MongoDB IDs
- ✅ Prevención de inyección NoSQL

### Headers HTTP
- ✅ Helmet.js configurado
- ✅ CORS restrictivo (solo frontend autorizado)
- ✅ HSTS habilitado
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY

### Rate Limiting
- ✅ 100 requests/15min general
- ✅ 5 intentos login/15min
- ✅ Prevención de fuerza bruta

### Variables de Entorno
- ✅ Secretos en `.env`
- ✅ `.env` en `.gitignore`
- ✅ `.env.example` para referencia

### Manejo de Errores
- ✅ Centralizado
- ✅ No expone detalles en producción
- ✅ Logs para debugging

**Para más detalles:** Lee el post sobre seguridad en `posts/post2-seguridad-apis.md`

---

## 📚 API Documentation

La API está completamente documentada en [backend/API.md](backend/API.md)

### Endpoints principales

**Autenticación:**
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

**Perfil:**
- `GET /api/profile` - Obtener perfil (público)
- `POST /api/profile` - Crear perfil (admin)
- `PUT /api/profile` - Actualizar perfil (admin)
- `POST /api/profile/experience` - Agregar experiencia (admin)
- `PUT /api/profile/experience/:id` - Actualizar experiencia (admin)
- `DELETE /api/profile/experience/:id` - Eliminar experiencia (admin)

**Blog:**
- `GET /api/blog` - Listar posts
- `GET /api/blog/:slug` - Obtener post
- `POST /api/blog` - Crear post (admin)
- `PUT /api/blog/:id` - Actualizar post (admin)
- `DELETE /api/blog/:id` - Eliminar post (admin)

**Ver documentación completa:** [API.md](backend/API.md)

---

## 🧪 Testing

### Probar la API

**Opción 1: Postman**
- Importa la colección (crear archivo de colección)

**Opción 2: Thunder Client (VS Code)**
- Extensión recomendada

**Opción 3: cURL**
```bash
# Ver ejemplos en API.md
```

---

## 🎯 Justificación de Tecnologías

### ¿Por qué MongoDB?

1. **Estructura de datos natural:** Los documentos JSON anidados se mapean perfectamente al modelo del portafolio
2. **Sin relaciones complejas:** No necesito JOINs complejos
3. **Flexibilidad:** Fácil agregar campos nuevos sin migraciones
4. **Rendimiento:** Excelente para lecturas frecuentes (más visitantes que actualizaciones)
5. **MongoDB Atlas Free Tier:** 512MB gratis, backups automáticos, alta disponibilidad

**Ver análisis completo:** `posts/post1-mongodb-vs-postgresql.md`

### ¿Por qué Express.js?

1. **Minimalista y flexible:** Solo incluye lo necesario
2. **Ecosistema maduro:** Miles de paquetes compatibles
3. **Documentación excelente:** Fácil de aprender
4. **Performance:** Rápido y eficiente
5. **Middleware:** Patrón poderoso para autenticación, validación, etc.

---

## 📊 Comparación con Alternativas

### React vs Vue/Svelte/Next.js

**Elegí React porque:**
- ✅ Ecosistema más grande
- ✅ Más oportunidades laborales
- ✅ Hooks son poderosos y flexibles
- ✅ Excelente documentación

**Vue/Svelte serían mejores si:**
- Quiero una curva de aprendizaje más suave
- Necesito mejor rendimiento out-of-the-box

**Next.js sería mejor si:**
- Necesito SSR (Server-Side Rendering)
- Requiero SEO crítico
- Quiero file-based routing

### Express vs FastAPI/NestJS

**Elegí Express porque:**
- ✅ JavaScript en todo el stack
- ✅ Más simple para este proyecto
- ✅ Menos boilerplate

**FastAPI sería mejor si:**
- Necesito tipo estático (TypeScript/Python types)
- Quiero documentación automática (Swagger nativo)

**NestJS sería mejor si:**
- Necesito arquitectura más estructurada
- Proyecto empresarial grande
- Quiero TypeScript nativo

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 👤 Autor

**Tu Nombre**

- 🌐 Portfolio: [https://tu-portfolio.vercel.app](https://tu-portfolio.vercel.app)
- 💼 LinkedIn: [linkedin.com/in/tu-perfil](https://linkedin.com/in/tu-perfil)
- 🐙 GitHub: [@tu-usuario](https://github.com/tu-usuario)
- 📧 Email: tu@email.com

---

## 🙏 Agradecimientos

- [MongoDB](https://www.mongodb.com/) por Atlas Free Tier
- [Vercel](https://vercel.com/) por hosting gratuito
- [Render](https://render.com/) por backend hosting
- [OWASP](https://owasp.org/) por guías de seguridad
- [Tailwind CSS](https://tailwindcss.com/) por los estilos

---

## 📝 Notas Adicionales

### Características adicionales implementadas

Este proyecto va más allá de los requisitos mínimos:

✅ **Documentación completa** (API.md, MONGODB_SETUP.md)
✅ **Posts técnicos originales** (1800+ palabras cada uno)
✅ **Seguridad robusta** (10+ medidas implementadas)
✅ **Validación exhaustiva** en todas las rutas
✅ **Manejo de errores centralizado**
✅ **Rate limiting** para prevenir abuso
✅ **README detallado** con instrucciones paso a paso

### Próximas mejoras (roadmap)

- [ ] OAuth 2.0 (Google/GitHub login)
- [ ] Paginación en frontend
- [ ] Búsqueda avanzada de posts
- [ ] Comentarios en blog posts
- [ ] Dashboard de analytics
- [ ] Tests unitarios (Jest)
- [ ] Tests E2E (Cypress)
- [ ] CI/CD con GitHub Actions
- [ ] Docker y Docker Compose
- [ ] Swagger/OpenAPI integrado

---

**¿Preguntas?** Abre un [issue](https://github.com/tu-usuario/tu-repo/issues) o contacta directamente.

¡Gracias por revisar este proyecto! ⭐
