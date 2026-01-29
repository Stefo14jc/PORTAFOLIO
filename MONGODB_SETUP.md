# 🗄️ Configuración de MongoDB Atlas (Base de Datos)

MongoDB Atlas es el servicio en la nube de MongoDB que ofrece un **tier gratuito** perfecto para tu portafolio.

## Paso 1: Crear cuenta

1. Ve a [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Regístrate con tu email o cuenta de Google/GitHub
3. Completa el formulario de registro

## Paso 2: Crear un cluster

1. Haz clic en **"Build a Database"**
2. Selecciona el plan **FREE (M0)** - ¡Es gratis para siempre!
3. Configuración:
   - **Provider:** AWS (recomendado)
   - **Region:** Elige la más cercana (ej: `us-east-1` para Ecuador)
   - **Cluster Name:** `portfolio-cluster` (o el nombre que quieras)
4. Haz clic en **"Create"**

⏳ **Espera 3-5 minutos** mientras se crea el cluster.

## Paso 3: Configurar acceso

### 3.1 Crear usuario de base de datos

1. En la pantalla "Security Quickstart", se te pedirá crear un usuario
2. Configuración:
   - **Username:** `portfolio_user` (o el que prefieras)
   - **Password:** Genera una contraseña segura (cópiala, la necesitarás)
   - **User Privileges:** Selecciona "Read and write to any database"
3. Haz clic en **"Create User"**

⚠️ **IMPORTANTE:** Guarda el usuario y contraseña en un lugar seguro. Los necesitarás para la conexión.

### 3.2 Configurar acceso desde cualquier IP

1. En la sección "Where would you like to connect from?":
   - Selecciona **"My Local Environment"**
   - En **"Add entries to your IP Access List"**:
     - Click en **"Add My Current IP Address"** (esto agrega tu IP actual)
     - Para desarrollo, puedes agregar `0.0.0.0/0` (permitir todas las IPs)
2. Click en **"Finish and Close"**

⚠️ **Nota de seguridad:** 
- `0.0.0.0/0` permite acceso desde cualquier IP (útil para desarrollo y despliegues)
- En producción, considera limitar a IPs específicas de Render/Vercel
- El usuario/contraseña siguen siendo necesarios, así que no es 100% público

## Paso 4: Obtener la Connection String

1. En tu cluster, haz clic en **"Connect"**
2. Selecciona **"Connect your application"**
3. Configuración:
   - **Driver:** Node.js
   - **Version:** 5.5 or later
4. Copia la **Connection String**, se ve así:

```
mongodb+srv://portfolio_user:<password>@portfolio-cluster.abc123.mongodb.net/?retryWrites=true&w=majority
```

5. Reemplaza `<password>` con tu contraseña real:

```
mongodb+srv://portfolio_user:TuPasswordAqui@portfolio-cluster.abc123.mongodb.net/?retryWrites=true&w=majority
```

## Paso 5: Configurar en tu proyecto

### 5.1 Localmente

1. Abre tu archivo `.env` en el backend
2. Pega tu connection string:

```env
MONGODB_URI=mongodb+srv://portfolio_user:TuPasswordAqui@portfolio-cluster.abc123.mongodb.net/portfolio?retryWrites=true&w=majority
```

⚠️ **Nota:** Agregué `/portfolio` antes de `?` para especificar el nombre de la base de datos.

### 5.2 En Render (cuando despliegues)

1. En Render, ve a tu servicio
2. Click en **"Environment"**
3. Agrega la variable:
   - **Key:** `MONGODB_URI`
   - **Value:** Tu connection string completa

## Paso 6: Verificar conexión

En tu terminal, ejecuta:

```bash
npm run dev
```

Deberías ver:

```
✅ MongoDB conectado: portfolio-cluster.abc123.mongodb.net
🚀 Servidor corriendo en puerto 5000
```

¡Si ves esto, tu BD está lista! 🎉

## Paso 7: Ver tus datos (opcional)

Para ver tus datos en la interfaz web de MongoDB:

1. En Atlas, ve a tu cluster
2. Click en **"Browse Collections"**
3. Aquí verás todas tus colecciones: `users`, `profiles`, `blogposts`

## Características del Free Tier

✅ **512 MB de almacenamiento** (suficiente para miles de posts)
✅ **Shared RAM** (compartido, pero funcional)
✅ **Backups automáticos** (de 2 días)
✅ **Sin límite de conexiones**
✅ **Sin tarjeta de crédito requerida**

## Solución de problemas

### Error: "MongoServerError: bad auth"
**Causa:** Usuario o contraseña incorrecta
**Solución:** 
1. Ve a "Database Access" en Atlas
2. Verifica el usuario
3. Resetea la contraseña si es necesario
4. Actualiza tu `.env`

### Error: "MongooseServerSelectionError"
**Causa:** No puedes conectar al cluster
**Solución:**
1. Ve a "Network Access" en Atlas
2. Verifica que tu IP esté en la lista o agrega `0.0.0.0/0`
3. Espera 2-3 minutos para que los cambios surtan efecto

### Error: "Cannot connect to cluster"
**Causa:** Cluster no está activo o connection string mal formado
**Solución:**
1. Verifica que el cluster esté **ACTIVO** (no pausado)
2. Verifica que la connection string esté completa
3. Asegúrate de haber reemplazado `<password>` con tu contraseña real

### El cluster está "pausado"
**Causa:** MongoDB pausa clusters gratis después de 60 días de inactividad
**Solución:**
1. En Atlas, ve a tu cluster
2. Click en **"Resume"**
3. Espera 3-5 minutos

## Recursos adicionales

- [Documentación de MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Connection String Format](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [MongoDB University](https://university.mongodb.com/) - Cursos gratis

## Próximos pasos

Una vez configurada tu BD:

1. ✅ Crea tu primer usuario admin (POST `/api/auth/register`)
2. ✅ Crea tu perfil (POST `/api/profile`)
3. ✅ Agrega tus experiencias, educación y habilidades
4. ✅ Crea tus posts del blog
5. ✅ ¡Listo para desplegar!

---

**¿Problemas?** Abre un issue en GitHub o contacta en [tu-email@ejemplo.com]
