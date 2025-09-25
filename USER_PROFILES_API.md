# API de Perfiles de Usuario

Este documento describe los endpoints para la gestión de perfiles de usuario en el sistema Guana Vive.

## Autenticación

Todos los endpoints de perfil requieren autenticación JWT. Incluye el token en el header:
```
Authorization: Bearer <tu-jwt-token>
```

## Endpoints

### 1. Login con JWT
**POST** `/users/login`

Autentica un usuario y devuelve un token JWT.

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "isActive": true,
    "role": "user",
    "phone": "+1234567890",
    "avatar": "https://ejemplo.com/avatar.jpg",
    "bio": "Descripción personal",
    "dateOfBirth": "1990-01-01",
    "address": "Calle 123",
    "city": "Ciudad",
    "country": "País",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Obtener Perfil
**GET** `/users/profile`

Obtiene el perfil completo del usuario autenticado.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "isActive": true,
    "role": "user",
    "phone": "+1234567890",
    "avatar": "https://ejemplo.com/avatar.jpg",
    "bio": "Descripción personal",
    "dateOfBirth": "1990-01-01",
    "address": "Calle 123",
    "city": "Ciudad",
    "country": "País",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Actualizar Perfil
**PATCH** `/users/profile`

Actualiza los datos del perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "firstName": "Juan Carlos",
  "lastName": "Pérez García",
  "phone": "+1234567890",
  "bio": "Nueva descripción personal",
  "dateOfBirth": "1990-01-01",
  "address": "Nueva Calle 456",
  "city": "Nueva Ciudad",
  "country": "Nuevo País"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan Carlos",
    "lastName": "Pérez García",
    "isActive": true,
    "role": "user",
    "phone": "+1234567890",
    "avatar": "https://ejemplo.com/avatar.jpg",
    "bio": "Nueva descripción personal",
    "dateOfBirth": "1990-01-01",
    "address": "Nueva Calle 456",
    "city": "Nueva Ciudad",
    "country": "Nuevo País",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Actualizar Avatar
**POST** `/users/profile/avatar`

Actualiza la imagen de perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "avatarUrl": "https://ejemplo.com/nueva-imagen.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Avatar actualizado exitosamente",
  "data": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "isActive": true,
    "role": "user",
    "phone": "+1234567890",
    "avatar": "https://ejemplo.com/nueva-imagen.jpg",
    "bio": "Descripción personal",
    "dateOfBirth": "1990-01-01",
    "address": "Calle 123",
    "city": "Ciudad",
    "country": "País",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Validaciones

### Campos de Perfil
- **firstName**: 2-50 caracteres, requerido
- **lastName**: 2-50 caracteres, requerido
- **phone**: Formato de teléfono válido, opcional
- **bio**: Máximo 500 caracteres, opcional
- **dateOfBirth**: Formato YYYY-MM-DD, opcional
- **address**: Máximo 255 caracteres, opcional
- **city**: Máximo 100 caracteres, opcional
- **country**: Máximo 100 caracteres, opcional
- **avatarUrl**: URL válida con extensión de imagen, opcional

### Formatos Aceptados para Avatar
- .jpg, .jpeg, .png, .gif, .webp, .svg
- Debe ser una URL HTTP/HTTPS válida

## Códigos de Error

- **401 Unauthorized**: Token JWT inválido o expirado
- **400 Bad Request**: Datos de entrada inválidos
- **404 Not Found**: Usuario no encontrado

## Ejemplo de Uso

1. **Login:**
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@ejemplo.com", "password": "password123"}'
```

2. **Obtener Perfil:**
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <jwt-token>"
```

3. **Actualizar Perfil:**
```bash
curl -X PATCH http://localhost:3000/users/profile \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"bio": "Nueva biografía", "city": "Nueva Ciudad"}'
```

4. **Actualizar Avatar:**
```bash
curl -X POST http://localhost:3000/users/profile/avatar \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"avatarUrl": "https://ejemplo.com/avatar.jpg"}'
```
