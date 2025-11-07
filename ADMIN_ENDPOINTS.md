# 📋 Documentación de Endpoints Backend - GuanaVive

## 🔐 Autenticación

Todos los endpoints admin requieren:
- Header: `Authorization: Bearer <token>`
- Rol de usuario: `admin`

---

## 📊 ENDPOINTS ADMIN - Dashboard y Estadísticas

### 1. **GET /admin/dashboard/stats**
**Descripción:** Obtiene estadísticas generales del dashboard admin

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 25,
    "activeUsers": 20,
    "inactiveUsers": 5,
    "totalPublications": 150,
    "publishedPublications": 100,
    "pendingPublications": 30,
    "rejectedPublications": 10,
    "draftPublications": 10,
    "totalCategories": 8,
    "totalSubscriptions": 40,
    "activeSubscriptions": 35,
    "inactiveSubscriptions": 5,
    "revenue": 1250
  }
}
```

---

### 2. **GET /admin/users/stats**
**Descripción:** Estadísticas detalladas de usuarios

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 25,
    "adminUsers": 2,
    "regularUsers": 23,
    "activeUsers": 20,
    "inactiveUsers": 5,
    "usersCreatedToday": 2,
    "usersCreatedThisWeek": 8,
    "usersCreatedThisMonth": 15
  }
}
```

---

### 3. **GET /admin/publications/stats**
**Descripción:** Estadísticas detalladas de publicaciones

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalPublications": 150,
    "published": 100,
    "pending": 20,
    "rejected": 10,
    "draft": 15,
    "archived": 5,
    "pendingReview": 10,
    "publicationsCreatedToday": 5,
    "publicationsCreatedThisWeek": 20,
    "publicationsCreatedThisMonth": 45
  }
}
```

---

### 4. **GET /admin/categories/stats**
**Descripción:** Estadísticas de categorías con conteo de publicaciones

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "name": "Música",
      "description": "Artistas y grupos musicales",
      "publicationCount": 45,
      "isActive": true,
      "createdAt": "2025-01-15T10:00:00.000Z"
    },
    {
      "id": "uuid-2",
      "name": "Arte",
      "description": "Artistas plásticos y visuales",
      "publicationCount": 30,
      "isActive": true,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### 5. **GET /admin/subscriptions/stats**
**Descripción:** Estadísticas de suscripciones por plan y estado

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalSubscriptions": 40,
    "basicPlan": 15,
    "premiumPlan": 20,
    "plusPlan": 5,
    "activeSubscriptions": 35,
    "inactiveSubscriptions": 3,
    "cancelledSubscriptions": 2
  }
}
```

---

### 6. **GET /admin/activities/recent**
**Descripción:** Actividades recientes del sistema (logs de acciones importantes)

**Query Parameters:**
- `limit` (optional): Número de actividades (default: 10, max: 50)
- `page` (optional): Página actual (default: 1)

**Ejemplo:** `GET /admin/activities/recent?limit=10&page=1`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pub-uuid-1",
      "type": "publication_approved",
      "title": "Festival de Música Tradicional",
      "description": "Publicación \"Festival de Música Tradicional\" fue aprobada",
      "entityId": "uuid-publication",
      "entityType": "publication",
      "createdAt": "2025-11-07T14:30:00.000Z",
      "metadata": {
        "authorName": "Juan Pérez",
        "status": "PUBLISHED"
      }
    },
    {
      "id": "user-uuid-2",
      "type": "user_created",
      "title": "María Gómez",
      "description": "Nuevo usuario registrado: maria@gmail.com",
      "entityId": "uuid-user",
      "entityType": "user",
      "createdAt": "2025-11-07T14:15:00.000Z",
      "metadata": {
        "email": "maria@gmail.com",
        "role": "user"
      }
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Tipos de actividades:**
- `publication_approved` - Publicación aprobada por admin
- `publication_rejected` - Publicación rechazada por admin
- `user_created` - Nuevo usuario registrado
- `subscription_created` - Nueva suscripción creada
- `category_created` - Nueva categoría creada

---

## 👥 ENDPOINTS ADMIN - Gestión de Usuarios

### 7. **PATCH /users/:id/role**
**Descripción:** Cambiar el rol de un usuario (user ↔ admin)

**Body:**
```json
{
  "role": "admin"  // o "user"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Rol de usuario actualizado a admin",
  "data": {
    "id": "uuid-user",
    "email": "user@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "admin",
    "isActive": true,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-11-07T15:00:00.000Z"
  }
}
```

---

### 8. **GET /users**
**Descripción:** Listar todos los usuarios con paginación y filtros

**Query Parameters:**
- `page` (optional): Página (default: 1)
- `limit` (optional): Resultados por página (default: 10, max: 100)
- `search` (optional): Buscar por nombre o email
- `role` (optional): Filtrar por rol (`user` o `admin`)
- `isActive` (optional): Filtrar por estado (`true` o `false`)
- `sortBy` (optional): Campo de ordenamiento (`createdAt`, `email`, `firstName`)
- `order` (optional): Orden (`ASC` o `DESC`)

**Ejemplo:** `GET /users?page=1&limit=10&role=user&isActive=true&search=juan`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "email": "juan@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "role": "user",
      "isActive": true,
      "phone": "8888-8888",
      "avatar": "https://avatar.url",
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

## 📝 ENDPOINTS ADMIN - Gestión de Publicaciones

### 9. **GET /publications/admin/pending**
**Descripción:** Obtener publicaciones pendientes de aprobación (solo admin)

**Query Parameters:**
- `page` (optional): Página (default: 1)
- `limit` (optional): Resultados por página (default: 10)
- `search` (optional): Buscar por título o contenido

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-pub",
      "title": "Festival de Música",
      "content": "Descripción del evento...",
      "status": "PENDING_REVIEW",
      "categoryId": "uuid-category",
      "category": {
        "id": "uuid-category",
        "name": "Música"
      },
      "author": {
        "id": "uuid-author",
        "firstName": "Juan",
        "lastName": "Pérez",
        "email": "juan@example.com"
      },
      "imageUrl": "https://image.url",
      "createdAt": "2025-11-07T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 10. **POST /publications/:id/approve**
**Descripción:** Aprobar o rechazar una publicación (solo admin)

**Body:**
```json
{
  "status": "publicado",  // o "archivado" para rechazar
  "message": "Aprobado - cumple con todos los requisitos"  // opcional
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Publicación aprobada exitosamente",
  "data": {
    "id": "uuid-pub",
    "title": "Festival de Música",
    "status": "PUBLISHED",
    "updatedAt": "2025-11-07T15:00:00.000Z"
  }
}
```

---

### 11. **GET /publications**
**Descripción:** Listar TODAS las publicaciones (sin filtros de autor)

**Query Parameters:**
- `page`, `limit`, `search`, `category`, `status`, `sortBy`, `order`

**Respuesta:** Igual que `/publications/my-publications` pero incluye todas las publicaciones del sistema

---

## 🏷️ ENDPOINTS - Categorías

### 12. **GET /categories**
**Descripción:** Listar todas las categorías

**Query Parameters:**
- `page` (optional): Página (default: 1)
- `limit` (optional): Resultados por página (default: 10)
- `search` (optional): Buscar por nombre

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "name": "Música",
      "description": "Artistas y grupos musicales",
      "isActive": true,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 8,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 13. **POST /categories**
**Descripción:** Crear nueva categoría

**Body:**
```json
{
  "name": "Deportes",
  "description": "Actividades deportivas" // opcional
}
```

### 14. **PATCH /categories/:id**
**Descripción:** Actualizar categoría

### 15. **DELETE /categories/:id**
**Descripción:** Eliminar categoría

---

## 💳 ENDPOINTS - Suscripciones

### 16. **GET /subscriptions**
**Descripción:** Listar todas las suscripciones

**Query Parameters:**
- `page`, `limit`, `search`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "userId": "uuid-user",
      "user": {
        "firstName": "Juan",
        "lastName": "Pérez",
        "email": "juan@example.com"
      },
      "plan": "Premium",
      "status": "Activo",
      "lastAccess": "2025-11-07T14:00:00.000Z",
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 40,
    "page": 1,
    "limit": 10,
    "totalPages": 4
  }
}
```

### 17. **POST /subscriptions**
**Descripción:** Crear nueva suscripción

**Body:**
```json
{
  "userId": "uuid-user",
  "plan": "Premium",  // "Básico", "Premium", "Plus"
  "status": "Activo"  // opcional, default: "Activo"
}
```

### 18. **PATCH /subscriptions/:id**
**Descripción:** Actualizar suscripción

### 19. **PATCH /subscriptions/:id/last-access**
**Descripción:** Actualizar fecha de último acceso

**Body:** No requiere body, actualiza automáticamente a la fecha actual

---

## 📊 Resumen de Endpoints por Módulo

### Admin Dashboard (6 endpoints)
- ✅ GET /admin/dashboard/stats
- ✅ GET /admin/users/stats
- ✅ GET /admin/publications/stats
- ✅ GET /admin/categories/stats
- ✅ GET /admin/subscriptions/stats
- ✅ GET /admin/activities/recent

### Usuarios (13 endpoints)
- ✅ POST /users (crear usuario)
- ✅ GET /users (listar con filtros)
- ✅ GET /users/:id
- ✅ GET /users/email/:email
- ✅ GET /users/profile (usuario autenticado)
- ✅ PATCH /users/:id
- ✅ PATCH /users/profile
- ✅ PATCH /users/:id/change-password
- ✅ PATCH /users/:id/toggle-status
- ✅ PATCH /users/:id/role (NUEVO - admin)
- ✅ POST /users/profile/avatar
- ✅ DELETE /users/:id

### Publicaciones (16 endpoints)
- ✅ POST /publications
- ✅ GET /publications
- ✅ GET /publications/:id
- ✅ GET /publications/my-publications
- ✅ GET /publications/published
- ✅ GET /publications/filter/category/:category
- ✅ GET /publications/filter/status/:status
- ✅ GET /publications/author/:authorId
- ✅ GET /publications/admin/pending (admin)
- ✅ PATCH /publications/:id
- ✅ PATCH /publications/:id/status
- ✅ PATCH /publications/:id/image
- ✅ POST /publications/:id/request-approval
- ✅ POST /publications/:id/approve (admin)
- ✅ DELETE /publications/:id/image
- ✅ DELETE /publications/:id

### Categorías (5 endpoints)
- ✅ POST /categories
- ✅ GET /categories
- ✅ GET /categories/:id
- ✅ PATCH /categories/:id
- ✅ DELETE /categories/:id

### Suscripciones (6 endpoints)
- ✅ POST /subscriptions
- ✅ GET /subscriptions
- ✅ GET /subscriptions/:id
- ✅ PATCH /subscriptions/:id
- ✅ PATCH /subscriptions/:id/last-access
- ✅ DELETE /subscriptions/:id

### Autenticación (5 endpoints)
- ✅ POST /auth/register
- ✅ POST /auth/login
- ✅ POST /auth/refresh
- ✅ POST /auth/logout
- ✅ GET /auth/me

---

## 🔑 Enumeraciones y Tipos

### UserRole
```typescript
enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}
```

### PublicationStatus
```typescript
enum PublicationStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PENDING_REVIEW = 'PENDING_REVIEW',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED'
}
```

### SubscriptionPlan
```typescript
enum SubscriptionPlan {
  BASIC = 'Básico',
  PREMIUM = 'Premium',
  PLUS = 'Plus'
}
```

### SubscriptionStatus
```typescript
enum SubscriptionStatus {
  ACTIVE = 'Activo',
  INACTIVE = 'Inactivo',
  CANCELLED = 'Cancelado'
}
```

---

## 🎯 Mapeo Frontend → Backend

### Vista Admin Dashboard
- **Estadísticas principales** → `GET /admin/dashboard/stats`
- **Actividades recientes** → `GET /admin/activities/recent?limit=5`

### Vista Admin Users
- **Tabla de usuarios** → `GET /users?page=1&limit=10`
- **Cambiar rol** → `PATCH /users/:id/role`
- **Toggle activo/inactivo** → `PATCH /users/:id/toggle-status`

### Vista Admin Publicaciones
- **Tabla de publicaciones** → `GET /publications?page=1&limit=10`
- **Filtrar por estado** → `GET /publications?status=PENDING_REVIEW`
- **Aprobar/Rechazar** → `POST /publications/:id/approve`

### Vista Admin Categorías
- **Tabla de categorías** → `GET /categories?page=1&limit=10`
- **Crear categoría** → `POST /categories`
- **Editar** → `PATCH /categories/:id`
- **Eliminar** → `DELETE /categories/:id`

### Vista Admin Suscripciones
- **Tabla de suscripciones** → `GET /subscriptions?page=1&limit=10`
- **Filtrar por plan** → (filtrar en frontend con los datos obtenidos)
- **Editar suscripción** → `PATCH /subscriptions/:id`

---

## 📌 Notas Importantes

1. **Todos los endpoints admin requieren:**
   - Token JWT válido
   - Rol de usuario `admin`

2. **Paginación estándar:**
   - Todos los endpoints con listas soportan `page` y `limit`
   - Response siempre incluye `meta` con información de paginación

3. **Búsqueda:**
   - El parámetro `search` busca en múltiples campos (nombre, email, título, etc.)
   - Es case-insensitive

4. **CORS configurado para:**
   - `http://localhost:5173` (Vite dev)
   - `http://localhost:3000` (Frontend prod)
   - `http://localhost:4173` (Vite preview)

5. **Base URL:** `http://localhost:3000`

---

## ✅ Estado de Implementación

**COMPLETADO** ✅
- Módulo Admin completo con 6 endpoints
- Gestión de usuarios con cambio de rol
- Todas las estadísticas implementadas
- Actividades recientes funcional
- Todos los módulos existentes (Users, Publications, Categories, Subscriptions)

**Listo para integración con Frontend** 🚀
