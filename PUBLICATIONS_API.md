# Publications API Documentation

## Descripción General
API para gestionar publicaciones culturales con diferentes categorías: Danza, Gastronomía, Retahilero, Artista Local y Grupo de Música.

## Categorías Disponibles
- `danza`: Publicaciones relacionadas con danza
- `gastronomia`: Publicaciones sobre gastronomía local
- `retahilero`: Publicaciones de retahileros
- `artista_local`: Publicaciones de artistas locales
- `grupo_musica`: Publicaciones de grupos musicales

## Estados de Publicación
- `borrador`: Publicación en borrador (por defecto)
- `publicado`: Publicación visible públicamente
- `archivado`: Publicación archivada
- `pendiente_revision`: Publicación pendiente de revisión

---

## Endpoints

### 1. Crear Publicación
Crea una nueva publicación. Requiere autenticación.

**Endpoint:** `POST /publications`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Festival de Danza Folklórica",
  "content": "Este sábado se realizará el festival de danza folklórica en la plaza central...",
  "category": "danza",
  "status": "borrador",
  "imageUrl": "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop"
}
```

**Validaciones:**
- `title`: Requerido, 5-200 caracteres
- `content`: Requerido, 10-5000 caracteres
- `category`: Requerido, debe ser una categoría válida
- `status`: Opcional, por defecto "borrador"
- `imageUrl`: Opcional, debe ser una URL válida con protocolo HTTP/HTTPS

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Publicación creada exitosamente",
  "data": {
    "id": "uuid",
    "title": "Festival de Danza Folklórica",
    "content": "Este sábado se realizará el festival de danza folklórica en la plaza central...",
    "category": "danza",
    "status": "borrador",
    "authorId": "uuid",
    "author": {
      "id": "uuid",
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com"
    },
    "createdAt": "2025-10-02T10:30:00Z",
    "updatedAt": "2025-10-02T10:30:00Z"
  }
}
```

---

### 2. Obtener Todas las Publicaciones
Obtiene todas las publicaciones con filtros y paginación. No requiere autenticación.

**Endpoint:** `GET /publications`

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10, max: 100)
- `sortBy`: Campo de ordenamiento (`createdAt`, `updatedAt`, `title`)
- `order`: Orden (`ASC`, `DESC`)
- `category`: Filtrar por categoría
- `status`: Filtrar por estado
- `authorId`: Filtrar por autor (UUID)
- `search`: Búsqueda en título y contenido

**Ejemplo:**
```
GET /publications?page=1&limit=10&category=danza&status=publicado&order=DESC
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Festival de Danza Folklórica",
      "content": "Este sábado se realizará...",
      "category": "danza",
      "status": "publicado",
      "authorId": "uuid",
      "author": {
        "id": "uuid",
        "firstName": "Juan",
        "lastName": "Pérez"
      },
      "createdAt": "2025-10-02T10:30:00Z",
      "updatedAt": "2025-10-02T10:30:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### 3. Obtener Mis Publicaciones
Obtiene las publicaciones del usuario autenticado. Requiere autenticación.

**Endpoint:** `GET /publications/my-publications`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:** Los mismos que "Obtener Todas las Publicaciones"

**Response (200 OK):** Igual estructura que el endpoint anterior

---

### 4. Obtener Publicaciones por Categoría
Obtiene publicaciones filtradas por categoría específica.

**Endpoint:** `GET /publications/category/:category`

**Parámetros de URL:**
- `category`: Categoría a filtrar (danza, gastronomia, retahilero, artista_local, grupo_musica)

**Query Parameters:** page, limit, sortBy, order, status, search

**Ejemplo:**
```
GET /publications/category/danza?page=1&limit=10
```

**Response (200 OK):** Igual estructura que "Obtener Todas las Publicaciones"

---

### 5. Obtener Publicaciones por Autor
Obtiene publicaciones de un autor específico.

**Endpoint:** `GET /publications/author/:authorId`

**Parámetros de URL:**
- `authorId`: UUID del autor

**Query Parameters:** page, limit, sortBy, order, category, status, search

**Ejemplo:**
```
GET /publications/author/uuid-del-autor?category=gastronomia
```

**Response (200 OK):** Igual estructura que "Obtener Todas las Publicaciones"

---

### 6. Obtener Publicación por ID
Obtiene una publicación específica por su ID.

**Endpoint:** `GET /publications/:id`

**Parámetros de URL:**
- `id`: UUID de la publicación

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Festival de Danza Folklórica",
    "content": "Este sábado se realizará...",
    "category": "danza",
    "status": "publicado",
    "authorId": "uuid",
    "author": {
      "id": "uuid",
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com"
    },
    "createdAt": "2025-10-02T10:30:00Z",
    "updatedAt": "2025-10-02T10:30:00Z"
  }
}
```

**Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Publicación no encontrada con ID {id}"
}
```

---

### 7. Actualizar Publicación
Actualiza una publicación existente. Solo el autor puede actualizar su propia publicación.

**Endpoint:** `PATCH /publications/:id`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:** (todos los campos son opcionales)
```json
{
  "title": "Festival de Danza Folklórica 2025",
  "content": "Actualización del contenido...",
  "category": "danza",
  "status": "publicado"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Publicación actualizada exitosamente",
  "data": {
    "id": "uuid",
    "title": "Festival de Danza Folklórica 2025",
    "content": "Actualización del contenido...",
    "category": "danza",
    "status": "publicado",
    "authorId": "uuid",
    "author": {...},
    "createdAt": "2025-10-02T10:30:00Z",
    "updatedAt": "2025-10-02T11:45:00Z"
  }
}
```

**Response (403 Forbidden):**
```json
{
  "statusCode": 403,
  "message": "No tienes permisos para realizar esta acción"
}
```

---

### 8. Cambiar Estado de Publicación
Cambia el estado de una publicación. Solo el autor puede cambiar el estado.

**Endpoint:** `PATCH /publications/:id/status`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "publicado"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Estado de la publicación actualizado",
  "data": {
    "id": "uuid",
    "title": "Festival de Danza Folklórica",
    "status": "publicado",
    ...
  }
}
```

---

### 9. Actualizar Imagen de Publicación
Actualiza solo la imagen de una publicación. Solo el autor puede actualizar la imagen.

**Endpoint:** `PATCH /publications/:id/image`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "imageUrl": "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Imagen de la publicación actualizada exitosamente",
  "data": {
    "id": "uuid",
    "title": "Festival de Danza Folklórica",
    "imageUrl": "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop",
    ...
  }
}
```

---

### 10. Eliminar Imagen de Publicación
Elimina la imagen de una publicación. Solo el autor puede eliminar la imagen.

**Endpoint:** `DELETE /publications/:id/image`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Imagen de la publicación eliminada exitosamente",
  "data": {
    "id": "uuid",
    "title": "Festival de Danza Folklórica",
    "imageUrl": null,
    ...
  }
}
```

---

### 11. Eliminar Publicación
Elimina una publicación. Solo el autor puede eliminar su propia publicación.

**Endpoint:** `DELETE /publications/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Publicación eliminada exitosamente"
}
```

**Response (403 Forbidden):**
```json
{
  "statusCode": 403,
  "message": "No tienes permisos para realizar esta acción"
}
```

**Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Publicación no encontrada con ID {id}"
}
```

---

## Códigos de Error

- **400 Bad Request**: Datos de entrada inválidos
- **401 Unauthorized**: Token no válido o ausente
- **403 Forbidden**: Sin permisos para la acción
- **404 Not Found**: Recurso no encontrado

## Ejemplos de Uso

### Crear publicación de gastronomía con imagen
```bash
curl -X POST http://localhost:3000/publications \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Receta tradicional: Tamales de la abuela",
    "content": "Los tamales son un platillo tradicional...",
    "category": "gastronomia",
    "status": "publicado",
    "imageUrl": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop"
  }'
```

### Obtener publicaciones de música
```bash
curl http://localhost:3000/publications/category/grupo_musica?page=1&limit=5
```

### Actualizar publicación
```bash
curl -X PATCH http://localhost:3000/publications/{id} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nuevo título actualizado",
    "status": "publicado"
  }'
```

### Actualizar imagen de publicación
```bash
curl -X PATCH http://localhost:3000/publications/{id}/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop"
  }'
```

### Eliminar imagen de publicación
```bash
curl -X DELETE http://localhost:3000/publications/{id}/image \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Eliminar publicación
```bash
curl -X DELETE http://localhost:3000/publications/{id} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Notas Importantes

1. **Autenticación**: Los endpoints de creación, actualización y eliminación requieren JWT token válido.
2. **Permisos**: Solo el autor de una publicación puede modificarla o eliminarla.
3. **Paginación**: Por defecto muestra 10 elementos por página, máximo 100.
4. **Búsqueda**: El parámetro `search` busca en los campos `title` y `content`.
5. **Relaciones**: Cada publicación incluye información del autor automáticamente.
6. **Cascada**: Si se elimina un usuario, sus publicaciones también se eliminan.

