# API de Usuarios - Documentación

## Endpoints Disponibles

### 📝 **Crear Usuario**
```http
POST /users
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "user", // opcional: "user" | "admin"
  "isActive": true // opcional
}
```

### 👥 **Obtener Todos los Usuarios**
```http
GET /users
```

### 👤 **Obtener Usuario por ID**
```http
GET /users/:id
```

### 📧 **Obtener Usuario por Email**
```http
GET /users/email/:email
```

### ✏️ **Actualizar Usuario**
```http
PATCH /users/:id
Content-Type: application/json

{
  "firstName": "Nuevo Nombre",
  "lastName": "Nuevo Apellido",
  "email": "nuevo@email.com",
  "role": "admin",
  "isActive": false
}
```

### 🔒 **Cambiar Contraseña**
```http
PATCH /users/:id/change-password
Content-Type: application/json

{
  "currentPassword": "password_actual",
  "newPassword": "nueva_password123"
}
```

### 🔄 **Activar/Desactivar Usuario**
```http
PATCH /users/:id/toggle-status
```

### 🗑️ **Eliminar Usuario**
```http
DELETE /users/:id
```

### 🔍 **Validar Usuario (Login)**
```http
POST /users/validate
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

## Validaciones Implementadas

### CreateUserDto
- **email**: Debe ser un email válido y único
- **password**: 6-20 caracteres
- **firstName**: 2-50 caracteres
- **lastName**: 2-50 caracteres
- **role**: "user" o "admin" (opcional, default: "user")
- **isActive**: booleano (opcional, default: true)

### UpdateUserDto
- Todos los campos son opcionales
- Mismas validaciones que CreateUserDto
- No se puede actualizar la contraseña aquí

### ChangePasswordDto
- **currentPassword**: contraseña actual del usuario
- **newPassword**: 6-20 caracteres

## Características de Seguridad

### 🔐 **Encriptación de Contraseñas**
- Utiliza bcrypt con salt rounds configurables
- La contraseña se encripta automáticamente antes de guardar
- Método `validatePassword()` para verificar contraseñas

### 🛡️ **Validaciones de Datos**
- class-validator implementado globalmente
- Validación de UUID en parámetros
- Sanitización de datos de entrada
- Respuestas sin contraseñas

### 🔒 **Manejo de Errores**
- **ConflictException**: Email duplicado
- **NotFoundException**: Usuario no encontrado
- **BadRequestException**: Datos inválidos
- **UnauthorizedException**: Credenciales incorrectas

## Respuestas de la API

### Usuario Exitoso (sin contraseña)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@ejemplo.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "isActive": true,
  "role": "user",
  "createdAt": "2025-09-17T10:30:00.000Z",
  "updatedAt": "2025-09-17T10:30:00.000Z"
}
```

### Error de Validación
```json
{
  "statusCode": 400,
  "message": [
    "Debe proporcionar un email válido",
    "La contraseña debe tener al menos 6 caracteres"
  ],
  "error": "Bad Request"
}
```

## Base de Datos

### Tabla: users
- **id**: UUID (Primary Key)
- **email**: VARCHAR (Unique)
- **password**: VARCHAR (Encriptada)
- **firstName**: VARCHAR
- **lastName**: VARCHAR
- **isActive**: BOOLEAN (Default: true)
- **role**: ENUM ('user', 'admin') (Default: 'user')
- **createdAt**: TIMESTAMP
- **updatedAt**: TIMESTAMP

## Pruebas con Postman/Insomnia

1. **Crear Usuario**: POST a `http://localhost:3000/users`
2. **Listar Usuarios**: GET a `http://localhost:3000/users`
3. **Validar Login**: POST a `http://localhost:3000/users/validate`

## Próximos Pasos Recomendados

1. **Implementar Autenticación JWT**: Guards para proteger endpoints
2. **Roles y Permisos**: Decorator para autorización por roles
3. **Paginación**: Implementar en el endpoint findAll
4. **Filtros de Búsqueda**: Por nombre, email, estado, etc.
5. **Soft Delete**: Eliminación lógica en lugar de física
6. **Logs de Auditoría**: Registro de cambios importantes

¡El CRUD de usuarios está completamente funcional! 🚀