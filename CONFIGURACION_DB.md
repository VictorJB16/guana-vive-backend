# Configuración de Base de Datos PostgreSQL

## Configuración para DBeaver

Para conectarte a la base de datos PostgreSQL usando DBeaver, sigue estos pasos:

### 1. Instalar PostgreSQL
Si no tienes PostgreSQL instalado, descárgalo desde: https://www.postgresql.org/download/

### 2. Configurar la base de datos
```sql
-- Crear la base de datos
CREATE DATABASE guana_vive_db;

-- Crear usuario (opcional, puedes usar el usuario postgres por defecto)
CREATE USER guana_user WITH ENCRYPTED PASSWORD 'admin';
GRANT ALL PRIVILEGES ON DATABASE guana_vive_db TO guana_user;
```

### 3. Configuración en DBeaver

1. **Abrir DBeaver** y crear una nueva conexión
2. **Seleccionar PostgreSQL** como tipo de base de datos
3. **Configurar los parámetros de conexión:**
   - **Host:** localhost
   - **Puerto:** 5432
   - **Base de datos:** guana_vive_db
   - **Usuario:** postgres (o guana_user si lo creaste)
   - **Contraseña:** admin

### 4. Variables de entorno configuradas

El proyecto ya tiene configuradas las siguientes variables en el archivo `.env`:

```bash
# Variables de Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_NAME=guana_vive_db

# Variables de la Aplicación
APP_PORT=3000
NODE_ENV=development

# Variables de JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_cambiala_en_produccion
JWT_EXPIRES_IN=24h

# Variables de Encriptación
BCRYPT_SALT_ROUNDS=10
```

### 5. Ejecutar la aplicación

Para iniciar la aplicación:

```bash
# Instalar dependencias (si no están instaladas)
pnpm install

# Ejecutar en modo desarrollo
pnpm run start:dev
```

### 6. Dependencias instaladas

El proyecto incluye todas las dependencias necesarias:

- **TypeORM:** ORM para TypeScript y JavaScript
- **PostgreSQL Driver (pg):** Driver para conectar con PostgreSQL
- **class-validator:** Validación de datos con decoradores
- **class-transformer:** Transformación de objetos
- **bcrypt:** Encriptación de contraseñas
- **JWT:** Autenticación con JSON Web Tokens
- **Passport:** Middleware de autenticación
- **dotenv:** Manejo de variables de entorno (incluido en @nestjs/config)

### 7. Estructura del proyecto

```
src/
├── config/           # Configuraciones (database, jwt)
├── entities/         # Entidades de TypeORM
├── dto/             # Data Transfer Objects con validaciones
├── app.module.ts    # Módulo principal con todas las configuraciones
└── main.ts          # Archivo principal con pipes globales
```

### 8. Funcionalidades configuradas

- ✅ Conexión a PostgreSQL con TypeORM
- ✅ Validación global con class-validator
- ✅ Configuración de JWT global
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Variables de entorno centralizadas
- ✅ CORS configurado
- ✅ Entidad de usuario de ejemplo
- ✅ DTOs de ejemplo con validaciones

¡La configuración está lista para usar! 🚀