# 🚀 Portfolio Backend API

API RESTful desarrollada con **Express.js** y **MongoDB** para gestionar un portafolio personal full-stack con sistema de blog y administración.

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Endpoints](#-endpoints)
- [Seguridad](#-seguridad)
- [Despliegue](#-despliegue)

---

## 🛠 Tecnologías

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Hashing de contraseñas
- **express-validator** - Validación de datos
- **Helmet** - Seguridad HTTP headers
- **CORS** - Control de acceso entre dominios
- **express-rate-limit** - Limitación de peticiones

### ¿Por qué MongoDB sobre PostgreSQL?

**Justificación técnica:**

1. **Flexibilidad del esquema**: MongoDB permite cambios en la estructura de datos sin migraciones complejas, ideal para un portafolio que puede evolucionar.

2. **Documentos anidados**: El modelo de hoja de vida (experiencia, educación, habilidades) se mapea naturalmente a documentos JSON anidados en lugar de múltiples tablas relacionadas.

3. **Escalabilidad horizontal**: MongoDB escala fácilmente añadiendo más servidores (sharding).

4. **Mejor rendimiento para lectura**: Los posts del blog se leen más frecuentemente que se escriben, y MongoDB excele en operaciones de lectura.

5. **Atlas Free Tier**: MongoDB Atlas ofrece un tier gratuito robusto (512MB), perfecto para un portafolio personal.

**Comparación:**

| Característica | MongoDB | PostgreSQL |
|---------------|---------|------------|
| Modelo de datos | Documentos JSON | Tablas relacionales |
| Esquema | Flexible/Dinámico | Rígido/Estructurado |
| Relaciones complejas | Más difícil | Nativo (JOINS) |
| Escalabilidad | Horizontal | Vertical (principalmente) |
| Curva de aprendizaje | Más suave | Más pronunciada |
| Casos de uso ideales | Datos no estructurados | Datos altamente relacionales |

Para un portafolio personal, MongoDB es más adecuado porque:
- Los datos son mayormente independientes (perfil, posts)
- No hay relaciones complejas que requieran JOINS
- La flexibilidad permite iteraciones rápidas

---

## ✨ Características

### Funcionalidades Principales

✅ **Autenticación JWT**
- Registro e inicio de sesión
- Protección de rutas administrativas
- Tokens con expiración configurable

✅ **Gestión de Perfil/CV**
- CRUD completo de información personal
- Experiencia laboral
- Educación
- Habilidades y competencias

✅ **Blog Técnico**
- Creación y edición de posts
- Sistema de publicación/borrador
- Categorías y etiquetas
- Contador de vistas
- Cálculo automático de tiempo de lectura

✅ **Seguridad**
- Hashing de contraseñas con bcrypt
- Protección contra XSS
- Rate limiting
- Headers de seguridad con Helmet
- CORS configurado
- Validación de entrada en todas las rutas

✅ **Validaciones**
- express-validator en todos los endpoints
- Validación de esquemas con Mongoose
- Manejo centralizado de errores

---

## 📦 Requisitos

- **Node.js** >= 18.x
- **npm** o **yarn**
- **MongoDB Atlas** (cuenta gratuita) o MongoDB local

---

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/portfolio-backend.git
cd portfolio-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
PORT=5000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

## ⚙️ Configuración

### Configurar MongoDB Atlas (GRATIS)

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un nuevo cluster (Free Tier - M0)
3. Crea un usuario de base de datos
4. Whitelist tu IP (o usa 0.0.0.0/0 para desarrollo)
5. Obtén tu connection string
6. Pégalo en `.env` como `MONGODB_URI`

### Generar JWT_SECRET seguro

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🚀 Uso

### Desarrollo

```bash
npm run dev
```

Servidor corriendo en: `http://localhost:5000`

### Producción

```bash
npm start
```

---

## 📡 Endpoints

### Base URL
```
http://localhost:5000/api
```

### Autenticación (`/auth`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Registrar usuario | Público |
| POST | `/auth/login` | Iniciar sesión | Público |
| GET | `/auth/me` | Obtener usuario actual | Privado |

**Ejemplo - Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ejemplo.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "id": "64abc123...",
    "username": "admin",
    "email": "admin@ejemplo.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Perfil (`/profile`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/profile` | Obtener perfil público | Público |
| POST | `/profile` | Crear perfil | Admin |
| PUT | `/profile` | Actualizar perfil | Admin |
| POST | `/profile/experience` | Agregar experiencia | Admin |
| PUT | `/profile/experience/:id` | Actualizar experiencia | Admin |
| DELETE | `/profile/experience/:id` | Eliminar experiencia | Admin |
| POST | `/profile/education` | Agregar educación | Admin |
| PUT | `/profile/education/:id` | Actualizar educación | Admin |
| DELETE | `/profile/education/:id` | Eliminar educación | Admin |
| POST | `/profile/skills` | Agregar habilidad | Admin |
| DELETE | `/profile/skills/:id` | Eliminar habilidad | Admin |

**Ejemplo - Crear perfil:**
```bash
curl -X POST http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "name": "Juan Pérez",
    "title": "Full Stack Developer",
    "bio": "Desarrollador apasionado por crear soluciones innovadoras",
    "email": "juan@ejemplo.com",
    "phone": "+593 99 123 4567",
    "location": "Quito, Ecuador",
    "github": "https://github.com/juanperez",
    "linkedin": "https://linkedin.com/in/juanperez"
  }'
```

### Blog (`/blog`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/blog` | Listar posts publicados | Público |
| GET | `/blog/:slug` | Obtener post por slug | Público |
| POST | `/blog` | Crear nuevo post | Admin |
| PUT | `/blog/:id` | Actualizar post | Admin |
| DELETE | `/blog/:id` | Eliminar post | Admin |
| PATCH | `/blog/:id/publish` | Publicar/despublicar | Admin |
| POST | `/blog/:slug/view` | Incrementar vistas | Público |

**Query params disponibles en GET `/blog`:**
- `category`: Filtrar por categoría
- `tag`: Filtrar por etiqueta
- `search`: Búsqueda de texto completo
- `limit`: Límite de resultados (default: 10)
- `page`: Página actual (default: 1)

**Ejemplo - Crear post:**
```bash
curl -X POST http://localhost:5000/api/blog \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "Introducción a MongoDB para principiantes",
    "summary": "Aprende los conceptos básicos de MongoDB y cómo usarlo en tus proyectos",
    "content": "MongoDB es una base de datos NoSQL...(contenido de 1000+ palabras)...",
    "category": "backend",
    "tags": ["mongodb", "nosql", "database"],
    "published": true
  }'
```

---

## 🔒 Seguridad

### Medidas Implementadas

1. **Hashing de contraseñas**
   - Uso de bcryptjs con salt rounds = 10
   - Contraseñas nunca se almacenan en texto plano

2. **JWT (JSON Web Tokens)**
   - Tokens firmados con secreto fuerte
   - Expiración configurable (7 días por defecto)
   - Validación en cada request protegido

3. **Helmet.js**
   - Protección contra ataques XSS
   - Headers de seguridad HTTP
   - Content Security Policy

4. **CORS**
   - Configurado solo para el dominio del frontend
   - Previene peticiones no autorizadas

5. **Rate Limiting**
   - Máximo 100 peticiones por IP cada 15 minutos
   - Previene ataques de fuerza bruta y DDoS

6. **Validación de entrada**
   - express-validator en todas las rutas
   - Sanitización de datos
   - Prevención de inyección NoSQL

7. **Variables de entorno**
   - Secretos almacenados en `.env`
   - Nunca commiteadas al repositorio
   - `.gitignore` configurado correctamente

8. **Manejo de errores**
   - Errores centralizados
   - No se exponen detalles en producción
   - Logs para debugging

---

## 🌐 Despliegue

### Opción 1: Render (Recomendado - GRATIS)

1. Crea una cuenta en [Render](https://render.com)
2. Conecta tu repositorio de GitHub
3. Crea un nuevo "Web Service"
4. Configuración:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Agrega las variables de entorno:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL` (URL de tu frontend en Vercel)
   - `NODE_ENV=production`
6. Deploy!

### Opción 2: Railway

1. Crea una cuenta en [Railway](https://railway.app)
2. Conecta tu repositorio
3. Configura variables de entorno
4. Deploy automático con cada push

### Base de Datos - MongoDB Atlas

Ya configurada en pasos anteriores. Asegúrate de:
- Whitelist la IP de Render/Railway
- Usar un usuario de BD con permisos apropiados
- Habilitar retryWrites en el connection string

---

## 📚 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Conexión a MongoDB
├── controllers/
│   ├── auth.controller.js   # Lógica de autenticación
│   ├── blog.controller.js   # Lógica del blog
│   └── profile.controller.js # Lógica del perfil
├── middleware/
│   ├── auth.middleware.js   # JWT y protección de rutas
│   └── errorHandler.js      # Manejo de errores
├── models/
│   ├── User.model.js        # Modelo de usuario
│   ├── Profile.model.js     # Modelo de perfil/CV
│   └── BlogPost.model.js    # Modelo de post
├── routes/
│   ├── auth.routes.js       # Rutas de autenticación
│   ├── blog.routes.js       # Rutas del blog
│   └── profile.routes.js    # Rutas del perfil
├── .env.example             # Ejemplo de variables de entorno
├── .gitignore              # Archivos ignorados por git
├── package.json            # Dependencias
├── server.js               # Punto de entrada
└── README.md              # Este archivo
```

---

## 🧪 Testing (Opcional)

Para probar los endpoints, puedes usar:

### Postman
Importa esta colección: [Link a colección]

### Thunder Client (VS Code)
Extensión recomendada para testing de APIs

### cURL (ejemplos arriba)

---

## 📄 Licencia

MIT

---

## 👤 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [tu-perfil](https://linkedin.com/in/tu-perfil)
- Email: tu@email.com

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Notas Adicionales

### Primer Usuario Admin

El primer usuario registrado será automáticamente admin. Después de crear tu usuario admin, deberías modificar la línea en `auth.controller.js`:

```javascript
// Cambiar de:
role: 'admin'

// A:
role: 'user'
```

### Seed Data (Opcional)

Puedes crear un script para poblar la BD con datos de ejemplo:

```javascript
// scripts/seed.js
import Profile from './models/Profile.model.js';

const seedProfile = async () => {
  // Tu código aquí
};
```

---

¿Preguntas? Abre un issue en GitHub!
