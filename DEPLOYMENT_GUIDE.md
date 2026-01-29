# 🚀 Guía Rápida de Despliegue

Esta guía te llevará de código local a aplicación desplegada en **30 minutos**.

## ✅ Checklist Pre-Despliegue

Antes de desplegar, verifica que tienes:

- [ ] Backend funcionando localmente
- [ ] Frontend funcionando localmente
- [ ] MongoDB Atlas configurado
- [ ] Cuenta de GitHub
- [ ] Cuenta de Vercel
- [ ] Cuenta de Render
- [ ] Variables de entorno configuradas

---

## Paso 1: Preparar el Repositorio

### 1.1 Inicializar Git (si no lo has hecho)

```bash
# En la raíz del proyecto
git init
git add .
git commit -m "Initial commit - Portfolio full-stack"
```

### 1.2 Crear repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Click en "New repository"
3. Nombre: `portfolio-fullstack`
4. Público o privado (tu elección)
5. **NO** inicialices con README (ya tienes uno)

### 1.3 Pushear a GitHub

```bash
git remote add origin https://github.com/TU-USUARIO/portfolio-fullstack.git
git branch -M main
git push -u origin main
```

---

## Paso 2: Desplegar Backend en Render

### 2.1 Crear Web Service

1. Ve a [render.com](https://render.com)
2. Sign in con GitHub
3. Click en "New +" → "Web Service"
4. Conecta tu repositorio `portfolio-fullstack`
5. Click en "Connect"

### 2.2 Configurar el servicio

**Configuración básica:**
```
Name: portfolio-backend
Region: Oregon (o la más cercana)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

**Plan:** Free (¡gratis!)

### 2.3 Variables de entorno

Click en "Advanced" → "Add Environment Variable"

Agrega TODAS estas variables:

```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=tu_secreto_de_64_caracteres_aqui
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://tu-portfolio.vercel.app
NODE_ENV=production
PORT=5000
```

⚠️ **IMPORTANTE:** 
- Usa el `MONGODB_URI` de MongoDB Atlas
- Genera un `JWT_SECRET` nuevo para producción
- `FRONTEND_URL` lo agregarás después (déjalo vacío por ahora)

### 2.4 Crear el servicio

1. Click en "Create Web Service"
2. Espera 3-5 minutos mientras se despliega
3. Verás logs en tiempo real

### 2.5 Obtener la URL del backend

Una vez desplegado, verás algo como:
```
https://portfolio-backend-xxxx.onrender.com
```

**Guarda esta URL**, la necesitarás para el frontend.

### 2.6 Probar el backend

Abre en tu navegador:
```
https://portfolio-backend-xxxx.onrender.com
```

Deberías ver:
```json
{
  "message": "Portfolio API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "profile": "/api/profile",
    "blog": "/api/blog"
  }
}
```

✅ **¡Backend desplegado!**

---

## Paso 3: Desplegar Frontend en Vercel

### 3.1 Importar proyecto

1. Ve a [vercel.com](https://vercel.com)
2. Sign in con GitHub
3. Click en "Add New..." → "Project"
4. Selecciona tu repositorio `portfolio-fullstack`
5. Click en "Import"

### 3.2 Configurar el proyecto

**Framework Preset:** Vite
**Root Directory:** `frontend`
**Build Command:** `npm run build`
**Output Directory:** `dist`

### 3.3 Variables de entorno

Click en "Environment Variables"

Agrega:
```
Name: VITE_API_URL
Value: https://portfolio-backend-xxxx.onrender.com/api
```

⚠️ **Usa la URL de tu backend de Render + `/api`**

### 3.4 Deploy

1. Click en "Deploy"
2. Espera 2-3 minutos
3. Verás el progreso en tiempo real

### 3.5 Obtener la URL del frontend

Una vez desplegado, verás:
```
https://portfolio-fullstack-xxxx.vercel.app
```

### 3.6 Probar el frontend

Abre la URL en tu navegador. Deberías ver tu portafolio funcionando.

✅ **¡Frontend desplegado!**

---

## Paso 4: Actualizar configuración

### 4.1 Actualizar FRONTEND_URL en Render

1. Ve a tu servicio en Render
2. Click en "Environment"
3. Encuentra `FRONTEND_URL`
4. Actualiza con tu URL de Vercel:
   ```
   https://portfolio-fullstack-xxxx.vercel.app
   ```
5. Click en "Save Changes"
6. El servicio se reiniciará automáticamente

### 4.2 Actualizar MongoDB Atlas

1. Ve a MongoDB Atlas
2. Click en "Network Access"
3. Verifica que `0.0.0.0/0` esté en la lista
4. Si no, agrégalo:
   - Click en "Add IP Address"
   - Selecciona "Allow Access from Anywhere"
   - Click en "Confirm"

---

## Paso 5: Crear usuario admin y contenido

### 5.1 Crear usuario admin

```bash
# Reemplaza con tu URL de Render
curl -X POST https://portfolio-backend-xxxx.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "tu@email.com",
    "password": "tuPassword123"
  }'
```

**Guarda el `token` que recibes.**

### 5.2 Crear perfil

```bash
curl -X POST https://portfolio-backend-xxxx.onrender.com/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "name": "Tu Nombre",
    "title": "Full Stack Developer",
    "bio": "Desarrollador full-stack especializado en MERN...",
    "email": "tu@email.com",
    "phone": "+593 99 123 4567",
    "location": "Tu Ciudad, País",
    "github": "https://github.com/tu-usuario",
    "linkedin": "https://linkedin.com/in/tu-perfil"
  }'
```

### 5.3 Agregar experiencia

```bash
curl -X POST https://portfolio-backend-xxxx.onrender.com/api/profile/experience \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "Full Stack Developer",
    "company": "Tu Empresa",
    "location": "Tu Ciudad",
    "startDate": "2023-01-01",
    "endDate": null,
    "current": true,
    "description": "Desarrollo de aplicaciones web con MERN stack"
  }'
```

### 5.4 Crear posts del blog

Usa los contenidos de:
- `posts/post1-mongodb-vs-postgresql.md`
- `posts/post2-seguridad-apis.md`

Puedes hacerlo desde el panel de administración o con cURL:

```bash
curl -X POST https://portfolio-backend-xxxx.onrender.com/api/blog \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "Por qué elegí MongoDB para mi portafolio (vs PostgreSQL)",
    "summary": "Análisis técnico comparando MongoDB y PostgreSQL...",
    "content": "CONTENIDO_COMPLETO_DEL_POST_AQUI",
    "category": "backend",
    "tags": ["mongodb", "postgresql", "databases"],
    "published": true
  }'
```

---

## Paso 6: Verificación final

### 6.1 Checklist de funcionamiento

Visita tu frontend y verifica:

- [ ] La página carga correctamente
- [ ] Puedes ver el perfil/CV
- [ ] Puedes ver los posts del blog
- [ ] Puedes hacer login en el panel de administración
- [ ] Puedes editar el perfil desde el panel admin
- [ ] Puedes crear/editar posts desde el panel admin

### 6.2 Probar desde diferentes dispositivos

- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Móvil (iOS/Android)
- [ ] Tablet

---

## 🎉 ¡Listo!

Tu portafolio está desplegado y funcionando:

- 🌐 **Frontend:** https://tu-portfolio.vercel.app
- 🔌 **Backend:** https://tu-backend.onrender.com
- 🗄️ **Base de datos:** MongoDB Atlas

---

## 🔄 Actualizar después del despliegue

### Frontend (Vercel)

```bash
# Hacer cambios en tu código
git add .
git commit -m "Actualización del frontend"
git push

# Vercel desplegará automáticamente
```

### Backend (Render)

```bash
# Hacer cambios en tu código
git add .
git commit -m "Actualización del backend"
git push

# Render desplegará automáticamente
```

---

## ⚠️ Solución de problemas

### Backend no conecta a MongoDB

**Error:** `MongooseServerSelectionError`

**Solución:**
1. Ve a MongoDB Atlas → Network Access
2. Asegúrate de tener `0.0.0.0/0` en la lista
3. Espera 2-3 minutos
4. Reinicia el servicio en Render

### Frontend no conecta al backend

**Error:** `Network Error` o `CORS Error`

**Solución:**
1. Verifica que `VITE_API_URL` en Vercel esté correcto
2. Verifica que `FRONTEND_URL` en Render esté correcto
3. Redeploy ambos servicios
4. Limpia caché del navegador (Ctrl+Shift+R)

### Render dice "Service Unavailable"

**Causa:** Servicio gratis se duerme después de 15 min de inactividad

**Solución:**
- Espera 30 segundos, se despertará automáticamente
- Primera petición será lenta (cold start)

### No puedo hacer login

**Causa:** Token expiró o credenciales incorrectas

**Solución:**
1. Verifica email/password
2. Si olvidaste la contraseña, crea nuevo usuario
3. Verifica que JWT_SECRET sea el mismo que usaste al crear el usuario

---

## 📊 Monitoreo

### Logs del backend (Render)

1. Ve a tu servicio en Render
2. Click en "Logs"
3. Verás logs en tiempo real

### Analytics del frontend (Vercel)

1. Ve a tu proyecto en Vercel
2. Click en "Analytics"
3. Verás visitas, rendimiento, etc.

---

## 💰 Costos

**Todo es GRATIS:**

- ✅ MongoDB Atlas: Free Tier (512MB)
- ✅ Vercel: Free Tier (ilimitado para proyectos personales)
- ✅ Render: Free Tier (750 horas/mes - suficiente para 1 servicio)

⚠️ **Limitación de Render Free:**
- El servicio se duerme después de 15 min sin actividad
- Tarda ~30 segundos en despertar
- Suficiente para portafolios personales

---

## 🚀 Próximos pasos

1. **Personaliza el diseño** de tu frontend
2. **Agrega más posts** técnicos
3. **Optimiza SEO** (meta tags, sitemap)
4. **Agrega Google Analytics**
5. **Implementa CI/CD** con GitHub Actions
6. **Agrega tests** (Jest, Cypress)
7. **Considera un dominio personalizado** (ej: `tuportfolio.com`)

---

## 📝 URLs finales para tu README

Actualiza tu README.md con estas URLs:

```markdown
## 🌐 Demo

- **Frontend:** https://tu-portfolio.vercel.app
- **Backend API:** https://tu-backend.onrender.com
- **API Docs:** https://tu-backend.onrender.com/api

## 📧 Contacto

- **Email:** tu@email.com
- **LinkedIn:** https://linkedin.com/in/tu-perfil
- **GitHub:** https://github.com/tu-usuario
```

---

¡Felicidades! Tu portafolio está vivo en internet. 🎊

**¿Problemas?** Revisa la sección de solución de problemas o abre un issue en GitHub.
