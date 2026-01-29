# Seguridad en APIs: Mejores prácticas para evitar ataques comunes

## Introducción

La seguridad en aplicaciones web es crítica, especialmente cuando construyes APIs que exponen datos y funcionalidades. Un solo error de seguridad puede comprometer toda tu aplicación y los datos de tus usuarios. En este artículo, te mostraré las mejores prácticas de seguridad que implementé en mi portafolio y cómo protegerte contra los ataques más comunes.

Después de estudiar la [OWASP Top 10](https://owasp.org/www-project-top-ten/) y experimentar con diferentes configuraciones, recopilé estas prácticas esenciales que todo desarrollador debería implementar.

## Los 5 ataques más comunes

Antes de ver las soluciones, entendamos contra qué nos protegemos:

1. **Inyección SQL/NoSQL**: Insertar código malicioso en queries
2. **XSS (Cross-Site Scripting)**: Ejecutar JavaScript malicioso
3. **Fuerza bruta**: Intentar múltiples contraseñas
4. **CSRF (Cross-Site Request Forgery)**: Requests no autorizados
5. **Exposición de datos sensibles**: Mostrar información que no debería ser pública

## 1. Autenticación segura con JWT

### ¿Qué es JWT?

JWT (JSON Web Token) es un estándar para transmitir información de forma segura entre partes. Consta de tres partes:

\`\`\`
header.payload.signature
\`\`\`

### Implementación correcta

**❌ MAL - Token sin expiración:**
\`\`\`javascript
const token = jwt.sign({ userId: user.id }, 'secreto');
\`\`\`

**✅ BIEN - Token con expiración y secreto fuerte:**
\`\`\`javascript
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET, // Secreto fuerte guardado en variable de entorno
    { 
      expiresIn: '7d',  // Expira en 7 días
      algorithm: 'HS256' // Algoritmo específico
    }
  );
};
\`\`\`

### Middleware de protección

\`\`\`javascript
export const protect = async (req, res, next) => {
  let token;

  // Extraer token del header Authorization
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Agregar usuario al request
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ 
          message: 'Usuario no encontrado' 
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ 
        message: 'Token inválido o expirado' 
      });
    }
  } else {
    return res.status(401).json({ 
      message: 'No autorizado, no hay token' 
    });
  }
};
\`\`\`

### Uso en rutas

\`\`\`javascript
// Ruta protegida
router.put('/profile', protect, adminOnly, updateProfile);
\`\`\`

**Aplicación en salud:** En un sistema de historias clínicas, solo médicos autorizados deberían acceder a registros de pacientes. JWT verifica la identidad del médico en cada petición.

## 2. Hashing de contraseñas con bcrypt

**¡NUNCA guardes contraseñas en texto plano!**

### Por qué bcrypt es seguro

Bcrypt usa un algoritmo de hashing lento intencionalmente y añade "salt" (datos aleatorios) para prevenir ataques de diccionario y tablas rainbow.

### Implementación en Mongoose

\`\`\`javascript
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: String,
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // No devolver por defecto en queries
  }
});

// Hashear contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear si la contraseña fue modificada
  if (!this.isModified('password')) {
    return next();
  }
  
  // Generar salt (10 rounds es el balance entre seguridad y rendimiento)
  const salt = await bcrypt.genSalt(10);
  
  // Hashear contraseña
  this.password = await bcrypt.hash(this.password, salt);
  
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
\`\`\`

### Uso en login

\`\`\`javascript
export const login = async (req, res) => {
  const { email, password } = req.body;
  
  // Buscar usuario (incluir password)
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return res.status(401).json({ 
      message: 'Credenciales inválidas' 
    });
  }
  
  // Verificar contraseña
  const isValidPassword = await user.comparePassword(password);
  
  if (!isValidPassword) {
    return res.status(401).json({ 
      message: 'Credenciales inválidas' 
    });
  }
  
  // Generar token
  const token = generateToken(user._id);
  
  res.json({ token });
};
\`\`\`

**Aplicación en banca:** Los sistemas bancarios usan hashing de contraseñas porque si la BD es comprometida, los hackers no obtienen contraseñas en texto plano.

## 3. Protección contra inyección NoSQL

### El ataque

\`\`\`javascript
// Usuario malicioso envía:
{
  "email": { "$ne": null },
  "password": { "$ne": null }
}

// Si no validas, este query devuelve CUALQUIER usuario:
User.findOne({ email: req.body.email, password: req.body.password })
\`\`\`

### Solución: Validación con express-validator

\`\`\`javascript
import { body, validationResult } from 'express-validator';

// Validaciones
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(), // Normaliza el email
  body('password')
    .isString()
    .notEmpty()
    .withMessage('Contraseña requerida')
];

// Aplicar en ruta
router.post('/login', loginValidation, async (req, res) => {
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Ahora es seguro usar req.body
  // ...
});
\`\`\`

### Validación de MongoDB IDs

\`\`\`javascript
import mongoose from 'mongoose';

// Validar que el ID sea válido
if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({ 
    message: 'ID inválido' 
  });
}
\`\`\`

**Aplicación en jurisprudencia:** En un sistema legal, un atacante podría intentar acceder a casos confidenciales mediante inyección. La validación previene esto.

## 4. Rate Limiting: Prevenir fuerza bruta

### El problema

Un atacante puede intentar miles de combinaciones de contraseñas por segundo.

### Solución con express-rate-limit

\`\`\`javascript
import rateLimit from 'express-rate-limit';

// Limitar requests generales
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por ventana
  message: 'Demasiadas peticiones, intenta más tarde',
  standardHeaders: true, // Retornar info en headers
  legacyHeaders: false
});

// Limitar más estrictamente el login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Solo 5 intentos de login en 15 min
  skipSuccessfulRequests: true, // No contar logins exitosos
  message: 'Demasiados intentos de login, intenta en 15 minutos'
});

// Aplicar
app.use('/api/', generalLimiter);
app.use('/api/auth/login', loginLimiter);
\`\`\`

### Rate limiting avanzado por usuario

\`\`\`javascript
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

const userBasedLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:' // Prefijo para las keys
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => {
    // Limitar por usuario autenticado o IP
    return req.user?.id || req.ip;
  }
});
\`\`\`

**Aplicación en ingeniería:** Una plataforma de simulaciones científicas puede limitar el número de cálculos por usuario para evitar abuso de recursos computacionales.

## 5. Headers de seguridad con Helmet

Helmet configura múltiples headers HTTP de seguridad automáticamente.

### Instalación y uso básico

\`\`\`javascript
import helmet from 'helmet';

app.use(helmet());
\`\`\`

### ¿Qué hace Helmet?

\`\`\`javascript
// Equivalente manual:
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000, // 1 año
    includeSubDomains: true,
    preload: true
  },
  noSniff: true, // X-Content-Type-Options: nosniff
  xssFilter: true, // X-XSS-Protection: 1; mode=block
  hidePoweredBy: true, // Ocultar X-Powered-By: Express
  frameguard: { action: 'deny' } // X-Frame-Options: DENY
}));
\`\`\`

### Headers específicos importantes

**1. Content Security Policy (CSP)**
Previene XSS limitando fuentes de contenido:

\`\`\`javascript
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://trusted-cdn.com"],
    styleSrc: ["'self'", "'unsafe-inline'"], // Necesario para algunos frameworks
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.ejemplo.com"]
  }
}));
\`\`\`

**2. HSTS (HTTP Strict Transport Security)**
Fuerza conexiones HTTPS:

\`\`\`javascript
app.use(helmet.hsts({
  maxAge: 31536000, // 1 año en segundos
  includeSubDomains: true
}));
\`\`\`

**Aplicación en construcción:** Un sistema de gestión de proyectos de construcción que maneja planos confidenciales debe usar HSTS para garantizar que todas las conexiones sean encriptadas.

## 6. CORS configurado correctamente

CORS controla qué dominios pueden hacer requests a tu API.

### ❌ MAL - CORS abierto a todo

\`\`\`javascript
import cors from 'cors';

app.use(cors()); // ¡PELIGROSO! Permite CUALQUIER dominio
\`\`\`

### ✅ BIEN - CORS restrictivo

\`\`\`javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Permitir cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
\`\`\`

### CORS con múltiples orígenes

\`\`\`javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://mi-portfolio.vercel.app',
  'https://mi-dominio.com'
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (como Postman) en desarrollo
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));
\`\`\`

**Aplicación en marketing:** Una plataforma de analytics debe restringir CORS para que solo sus clientes autorizados puedan enviar eventos.

## 7. Variables de entorno para secretos

**¡NUNCA comittees secretos a Git!**

### Configuración con dotenv

\`\`\`javascript
import dotenv from 'dotenv';

dotenv.config();

// Usar
const dbUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
\`\`\`

### Archivo .env

\`\`\`env
# Base de datos
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# JWT
JWT_SECRET=super_secreto_aleatorio_64_caracteres_minimo
JWT_EXPIRES_IN=7d

# API Keys
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=SG...

# URLs
FRONTEND_URL=https://mi-app.com
```

### Generar JWT_SECRET seguro

\`\`\`bash
# En terminal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
\`\`\`

### .gitignore

\`\`\`gitignore
.env
.env.local
.env.*.local
node_modules/
\`\`\`

### .env.example (SÍ commitear)

\`\`\`env
# Base de datos
MONGODB_URI=tu_mongodb_uri_aqui

# JWT
JWT_SECRET=genera_un_secreto_aleatorio
JWT_EXPIRES_IN=7d

# URLs
FRONTEND_URL=http://localhost:5173
\`\`\`

**Aplicación en salud:** Las APIs de salud deben proteger claves de acceso a sistemas de registros médicos electrónicos (EHR) usando variables de entorno.

## 8. Manejo centralizado de errores

No expongas detalles de errores en producción.

### Middleware de errores

\`\`\`javascript
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      message: 'Error de validación',
      errors
    });
  }

  // Error de duplicado (MongoDB)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: \`El \${field} ya existe\`
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token inválido'
    });
  }

  // Error genérico
  res.status(err.statusCode || 500).json({
    message: err.message || 'Error del servidor',
    // Solo mostrar stack en desarrollo
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Aplicar al final de todas las rutas
app.use(errorHandler);
\`\`\`

## 9. Sanitización de datos

Prevenir XSS sanitizando inputs.

### Con express-validator

\`\`\`javascript
import { body } from 'express-validator';

const sanitizeInput = [
  body('title')
    .trim()
    .escape() // Escapa caracteres HTML
    .isLength({ max: 200 }),
  body('content')
    .trim()
    .stripLow() // Remueve caracteres de control
];
\`\`\`

### Biblioteca especializada: DOMPurify (frontend)

\`\`\`javascript
import DOMPurify from 'isomorphic-dompurify';

// Limpiar HTML antes de renderizar
const cleanHTML = DOMPurify.sanitize(dirtyHTML);
\`\`\`

**Aplicación en legal:** En una plataforma de documentos legales, los usuarios pueden subir contratos en HTML. Debes sanitizar para prevenir que alguien inyecte JavaScript malicioso.

## 10. Logging y monitoreo

Detecta ataques monitoreando logs.

### Con Morgan

\`\`\`javascript
import morgan from 'morgan';

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}
\`\`\`

### Logs personalizados

\`\`\`javascript
// Loggear intentos de login fallidos
const loginAttempts = new Map();

export const login = async (req, res) => {
  const { email } = req.body;
  
  // ...validación...
  
  if (!isValidPassword) {
    // Incrementar contador
    const attempts = loginAttempts.get(email) || 0;
    loginAttempts.set(email, attempts + 1);
    
    console.warn(\`⚠️ Login fallido para \${email}. Intentos: \${attempts + 1}\`);
    
    // Bloquear temporalmente después de 5 intentos
    if (attempts >= 5) {
      console.error(\`🚨 ALERTA: Email \${email} bloqueado por múltiples intentos fallidos\`);
      // Implementar bloqueo temporal...
    }
    
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }
  
  // Login exitoso - limpiar contador
  loginAttempts.delete(email);
};
\`\`\`

**Aplicación en construcción:** En un sistema de gestión de obra, los logs pueden detectar si alguien intenta acceder repetidamente a presupuestos confidenciales.

## Checklist de seguridad completo

Antes de desplegar tu API, verifica:

### Autenticación
- [ ] Contraseñas hasheadas con bcrypt (salt >= 10)
- [ ] JWT con expiración y secreto fuerte
- [ ] Tokens guardados de forma segura en el cliente
- [ ] Rutas protegidas con middleware de autenticación

### Validación
- [ ] express-validator en todas las rutas
- [ ] Validación de tipos de datos
- [ ] Sanitización de inputs
- [ ] Validación de MongoDB IDs

### Rate Limiting
- [ ] Límite general de requests
- [ ] Límite estricto en login
- [ ] Límite en endpoints costosos

### Headers de seguridad
- [ ] Helmet configurado
- [ ] CORS restrictivo (solo dominios autorizados)
- [ ] HSTS habilitado
- [ ] CSP configurado

### Secrets
- [ ] Variables de entorno para todos los secretos
- [ ] .env en .gitignore
- [ ] .env.example commiteado
- [ ] JWT_SECRET >= 64 caracteres aleatorios

### Errores
- [ ] Manejo centralizado
- [ ] No exponer stack traces en producción
- [ ] Mensajes genéricos al usuario
- [ ] Logs detallados para debugging

### Base de datos
- [ ] Usuario de BD con permisos mínimos
- [ ] IP whitelisting
- [ ] Conexión encriptada (TLS/SSL)
- [ ] Backups automáticos

### HTTPS
- [ ] Certificado SSL/TLS
- [ ] Redirección HTTP → HTTPS
- [ ] HSTS habilitado

### Monitoreo
- [ ] Logging configurado
- [ ] Alertas para eventos sospechosos
- [ ] Monitoreo de rendimiento

## Herramientas recomendadas

### Para auditar seguridad

1. **npm audit**: Escanea vulnerabilidades en dependencias
\`\`\`bash
npm audit
npm audit fix
\`\`\`

2. **Snyk**: Monitoreo continuo de vulnerabilidades
\`\`\`bash
npm install -g snyk
snyk test
\`\`\`

3. **OWASP ZAP**: Escáner de vulnerabilidades
[https://www.zaproxy.org/](https://www.zaproxy.org/)

4. **Postman Security Tests**: Pruebas automatizadas

### Para testing de penetración

1. **Burp Suite**: Para pruebas manuales avanzadas
2. **SQLMap**: Para testing de inyecciones SQL
3. **Nikto**: Escáner de servidores web

## Conclusión

La seguridad no es opcional, es fundamental. Implementar estas prácticas desde el inicio te ahorrará dolores de cabeza y protegerá a tus usuarios.

### Resumen de prioridades

**🔴 CRÍTICO** (implementa YA):
1. Hashing de contraseñas
2. Validación de inputs
3. HTTPS
4. Variables de entorno

**🟠 IMPORTANTE** (implementa pronto):
1. JWT con expiración
2. Rate limiting
3. Helmet
4. CORS configurado

**🟢 RECOMENDADO** (mejora continua):
1. Logging robusto
2. Monitoreo
3. Auditorías regulares
4. Pruebas de penetración

### Recursos para seguir aprendiendo

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [JWT.io](https://jwt.io/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

La seguridad es un proceso continuo, no un estado final. Mantente actualizado, audita regularmente y nunca subestimes la creatividad de los atacantes.

---

**¿Implementas otras prácticas de seguridad?** Comparte en los comentarios. ¡La comunidad aprende de todos!

**Próximo artículo:** "Despliegue de aplicaciones Node.js en Render: Guía completa"
