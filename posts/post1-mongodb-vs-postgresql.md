# Por qué elegí MongoDB para mi portafolio (vs PostgreSQL)

## Introducción

Cuando comencé a desarrollar mi portafolio full-stack, una de las decisiones más importantes fue elegir el sistema de gestión de bases de datos. Las dos opciones principales eran **MongoDB** (NoSQL) y **PostgreSQL** (SQL). Después de analizar los requisitos de mi proyecto y las características de ambas tecnologías, opté por MongoDB. En este artículo, te explicaré las razones técnicas detrás de esta decisión y cómo puede aplicarse a diferentes contextos.

## Contexto del proyecto

Mi portafolio necesitaba almacenar:
- Información personal y profesional (CV)
- Experiencia laboral y educación
- Habilidades y competencias
- Posts de blog técnico
- Sistema de autenticación

## MongoDB: La opción NoSQL

MongoDB es una base de datos orientada a documentos que almacena datos en formato JSON (BSON técnicamente). En lugar de tablas y filas, usa **colecciones** y **documentos**.

### Características principales

1. **Esquema flexible**: No requiere una estructura rígida
2. **Documentos anidados**: Permite objetos dentro de objetos
3. **Escalabilidad horizontal**: Fácil de distribuir en múltiples servidores
4. **JSON nativo**: Integración natural con JavaScript/Node.js

### Ejemplo de documento en MongoDB

\`\`\`javascript
{
  "_id": "64abc123...",
  "name": "Juan Pérez",
  "title": "Full Stack Developer",
  "experience": [
    {
      "title": "Senior Developer",
      "company": "TechCorp",
      "startDate": "2022-01-15",
      "endDate": null,
      "current": true,
      "description": "Desarrollo de aplicaciones web"
    }
  ],
  "skills": [
    { "name": "React", "level": "avanzado" },
    { "name": "Node.js", "level": "avanzado" }
  ]
}
\`\`\`

## PostgreSQL: La opción SQL

PostgreSQL es un sistema de gestión de bases de datos relacional (RDBMS) que organiza los datos en **tablas** con filas y columnas relacionadas mediante claves foráneas.

### Características principales

1. **ACID compliant**: Garantiza transacciones seguras
2. **Relaciones complejas**: Excelente para datos altamente relacionados
3. **Integridad referencial**: Validaciones a nivel de base de datos
4. **SQL estándar**: Lenguaje de consulta maduro y poderoso

### Ejemplo equivalente en PostgreSQL

\`\`\`sql
-- Tabla users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  title VARCHAR(100)
);

-- Tabla experience
CREATE TABLE experience (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(100),
  company VARCHAR(100),
  start_date DATE,
  end_date DATE,
  current BOOLEAN,
  description TEXT
);

-- Tabla skills
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(50),
  level VARCHAR(20)
);
\`\`\`

## Comparación detallada

### 1. Modelo de datos

**MongoDB:**
- Ideal para datos con estructura variable
- Documentos pueden tener campos diferentes
- Fácil agregar nuevos campos sin migraciones

**PostgreSQL:**
- Ideal para datos con estructura definida
- Todas las filas tienen las mismas columnas
- Cambios de esquema requieren migraciones

**Aplicación en contexto de salud:**
Imagina un sistema de historias clínicas. Con MongoDB, cada paciente podría tener diferentes campos según su condición (alergias, cirugías previas, medicamentos). Con PostgreSQL, necesitarías tablas separadas para cada tipo de información.

### 2. Relaciones

**MongoDB:**
- Embedido: Datos anidados dentro del documento
- Referenciado: Similar a relaciones, pero menos eficiente
- Mejor para relaciones 1:1 y 1:muchos simples

**PostgreSQL:**
- JOINs nativos: Muy eficiente para relaciones complejas
- Muchos a muchos: Tablas intermedias
- Mejor para relaciones complejas y muchos a muchos

**Aplicación en contexto jurídico:**
En un sistema legal, necesitas relacionar casos con abogados, clientes, documentos, fechas de audiencia, etc. PostgreSQL brillaría aquí con sus JOINs para consultas como "todos los casos del abogado X con el cliente Y en el año Z".

### 3. Escalabilidad

**MongoDB:**
- **Sharding horizontal**: Distribuye datos en múltiples servidores automáticamente
- Fácil agregar más servidores para manejar más carga
- Ideal para aplicaciones que crecen rápidamente

**PostgreSQL:**
- **Escalabilidad vertical**: Aumentar recursos del servidor (RAM, CPU)
- Read replicas: Copias de solo lectura
- Sharding más complejo y manual

**Aplicación en contexto de marketing:**
Una plataforma de analytics de marketing que recibe millones de eventos diarios (clics, impresiones, conversiones) se beneficiaría del sharding horizontal de MongoDB para distribuir la carga.

### 4. Rendimiento

**MongoDB:**
- Excelente para **lecturas** frecuentes
- Consultas simples son más rápidas
- No requiere JOINs complejos

**PostgreSQL:**
- Mejor para **escrituras** con integridad garantizada
- Consultas complejas con múltiples JOINs
- Índices avanzados

### 5. Consultas

**MongoDB (usando Mongoose):**
\`\`\`javascript
// Encontrar posts publicados de categoría "backend"
const posts = await BlogPost.find({ 
  published: true, 
  category: 'backend' 
})
  .populate('author')
  .sort({ createdAt: -1 })
  .limit(10);
\`\`\`

**PostgreSQL (usando SQL):**
\`\`\`sql
-- Equivalente en SQL
SELECT p.*, u.username 
FROM posts p
JOIN users u ON p.author_id = u.id
WHERE p.published = true 
  AND p.category = 'backend'
ORDER BY p.created_at DESC
LIMIT 10;
\`\`\`

**Aplicación en contexto de construcción:**
En un sistema de gestión de proyectos de construcción, si necesitas consultar "materiales usados en proyectos del arquitecto X con presupuesto > Y", PostgreSQL sería más eficiente con sus JOINs nativos.

### 6. Transacciones

**MongoDB:**
- Soporta transacciones desde v4.0
- Más lentas que PostgreSQL
- Menos críticas en aplicaciones modernas

**PostgreSQL:**
- Transacciones ACID nativas y robustas
- Esenciales para operaciones bancarias/financieras
- Rollback automático en caso de error

**Aplicación en contexto de ingeniería financiera:**
Un sistema bancario SIEMPRE debería usar PostgreSQL. Si una transferencia de $1000 falla a mitad de camino, PostgreSQL garantiza que el dinero no se pierda ni se duplique (atomicidad).

## ¿Por qué MongoDB para mi portafolio?

### Razón 1: Estructura de datos natural

Mi perfil/CV se mapea perfectamente a un documento JSON:

\`\`\`javascript
{
  name: "...",
  experience: [...],  // Array de objetos
  education: [...],   // Array de objetos
  skills: [...]       // Array de objetos
}
\`\`\`

Con PostgreSQL, necesitaría 4 tablas separadas con relaciones foráneas, haciendo queries más complejas.

### Razón 2: Sin relaciones complejas

Mi portafolio no tiene relaciones complejas entre entidades. Los posts del blog son independientes del perfil. No hay necesidad de JOINs complejos.

### Razón 3: Flexibilidad futura

Si mañana quiero agregar "certificaciones" o "proyectos destacados", simplemente agrego el campo. No necesito:
- Crear nueva tabla
- Definir relaciones
- Ejecutar migraciones
- Actualizar queries existentes

### Razón 4: Ecosistema Node.js

MongoDB + Mongoose se integra perfectamente con Node.js/Express:

\`\`\`javascript
// Modelo en Mongoose es muy intuitivo
const profileSchema = new mongoose.Schema({
  name: String,
  experience: [experienceSchema],
  skills: [skillSchema]
});
\`\`\`

### Razón 5: MongoDB Atlas Free Tier

MongoDB ofrece 512MB gratis en la nube (Atlas), perfecto para un portafolio. Incluye:
- Backups automáticos
- Monitoreo
- Alta disponibilidad
- Sin configuración de servidores

### Razón 6: Mejor rendimiento para mi caso de uso

Mi portafolio tiene **mucho más lecturas que escrituras**:
- Visitantes leen mi CV (100x)
- Visitantes leen posts del blog (100x)
- Yo actualizo el perfil (1x al mes)
- Yo publico posts (1x a la semana)

MongoDB es más rápido para estas lecturas frecuentes.

## ¿Cuándo usar PostgreSQL en su lugar?

PostgreSQL sería mejor si mi portafolio tuviera:

1. **Sistema de comentarios complejo** con hilos, respuestas anidadas, moderación
2. **Sistema de permisos granular** con roles, permisos por recurso
3. **Analytics complejos** con reportes que requieren múltiples JOINs
4. **Transacciones críticas** como un carrito de compras
5. **Datos altamente relacionados** como un CRM completo

## Implementación práctica

### Conexión a MongoDB

\`\`\`javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};
\`\`\`

### Modelo de Perfil

\`\`\`javascript
const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  experience: [{
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    current: Boolean
  }],
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['básico', 'intermedio', 'avanzado']
    }
  }]
});
\`\`\`

### CRUD Básico

\`\`\`javascript
// Crear
const profile = await Profile.create({
  name: "Juan Pérez",
  skills: [{ name: "React", level: "avanzado" }]
});

// Leer
const profile = await Profile.findOne();

// Actualizar
await Profile.updateOne(
  {},
  { $push: { skills: { name: "Vue", level: "intermedio" } } }
);

// Eliminar una skill
await Profile.updateOne(
  {},
  { $pull: { skills: { name: "Vue" } } }
);
\`\`\`

## Lecciones aprendidas

### 1. No todo es blanco o negro

No existe una "mejor" base de datos. Depende del contexto:
- **E-commerce**: PostgreSQL (transacciones, inventario)
- **Red social**: MongoDB (posts, comentarios, likes)
- **Banca**: PostgreSQL (ACID crítico)
- **IoT/Analytics**: MongoDB (millones de eventos)

### 2. Puedes usar ambas

Muchas empresas usan arquitecturas híbridas:
- PostgreSQL para datos transaccionales
- MongoDB para logs y eventos
- Redis para cache

### 3. El ORM/ODM importa

Mongoose (MongoDB) y Sequelize (PostgreSQL) hacen que ambas bases de datos sean fáciles de usar. La diferencia está en los casos de uso, no en la dificultad.

## Conclusiones

Elegí MongoDB para mi portafolio porque:

✅ Estructura de datos natural (documentos anidados)
✅ Sin relaciones complejas que requieran JOINs
✅ Flexibilidad para evolucionar el esquema
✅ Mejor rendimiento para lectura intensiva
✅ Integración perfecta con Node.js
✅ Free tier generoso en MongoDB Atlas
✅ Más simple para este caso de uso específico

Sin embargo, si estuviera construyendo una aplicación empresarial con transacciones críticas, reportes complejos, o datos altamente relacionados, definitivamente usaría PostgreSQL.

## Aplicaciones en diferentes industrias

**Salud:** MongoDB para historias clínicas (campos variables por especialidad), PostgreSQL para sistema de citas (relaciones estrictas entre médicos, pacientes, horarios).

**Legal:** PostgreSQL para gestión de casos (relaciones complejas entre casos, documentos, audiencias, clientes).

**Construcción:** PostgreSQL para gestión de proyectos (presupuestos, materiales, personal, cronogramas interrelacionados).

**Marketing:** MongoDB para eventos de analytics (millones de registros de clics, impresiones), PostgreSQL para campañas y presupuestos.

**Ingeniería:** PostgreSQL para sistemas de manufactura (BOM, inventario, órdenes de trabajo con integridad crítica).

## Recursos adicionales

- [MongoDB University](https://university.mongodb.com/) - Cursos gratis
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [When to Use MongoDB vs PostgreSQL](https://www.mongodb.com/compare/mongodb-postgresql)
- [Mongoose Documentation](https://mongoosejs.com/)

## Reflexión final

La elección de una base de datos es una decisión arquitectónica importante. No te dejes llevar por el hype o las tendencias. Analiza tu caso de uso específico:

- ¿Qué tipo de datos almacenas?
- ¿Cómo se relacionan entre sí?
- ¿Cuál es tu patrón de lectura/escritura?
- ¿Necesitas transacciones ACID estrictas?
- ¿Cuál es tu experiencia previa?

Para mi portafolio, MongoDB fue la elección correcta. Para tu proyecto, la respuesta puede ser diferente. ¡Y eso está perfecto!

---

**¿Tienes preguntas?** Déjame un comentario o contáctame en [LinkedIn](tu-linkedin).

**Próximo artículo:** "Implementación de autenticación JWT en Node.js: Guía completa"
