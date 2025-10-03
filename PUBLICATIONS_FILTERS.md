# Guía de Filtros de Publicaciones

## 📋 Descripción General

El sistema de publicaciones incluye múltiples formas de filtrar y buscar contenido. Esta guía explica todos los filtros disponibles y cómo usarlos.

---

## 🔍 Tipos de Filtros Disponibles

### 1. **Filtros por Query Parameters (Endpoint Principal)**
### 2. **Filtros por Categoría Específica**
### 3. **Filtros por Estado Específico**
### 4. **Filtros Combinados**
### 5. **Búsqueda de Texto**

---

## 📡 Endpoints de Filtrado

### 1. Endpoint Principal con Query Parameters

**Endpoint:** `GET /publications`

**Descripción:** Endpoint más flexible que permite combinar múltiples filtros.

**Query Parameters Disponibles:**

| Parámetro | Tipo | Descripción | Valores Posibles | Ejemplo |
|-----------|------|-------------|------------------|---------|
| `category` | string | Filtrar por categoría | `danza`, `gastronomia`, `retahilero`, `artista_local`, `grupo_musica` | `?category=danza` |
| `status` | string | Filtrar por estado | `borrador`, `publicado`, `archivado`, `pendiente_revision` | `?status=publicado` |
| `authorId` | UUID | Filtrar por autor | UUID válido | `?authorId=uuid-del-autor` |
| `search` | string | Búsqueda en título y contenido | Cualquier texto | `?search=festival` |
| `page` | number | Número de página | Entero positivo (default: 1) | `?page=2` |
| `limit` | number | Elementos por página | 1-100 (default: 10) | `?limit=20` |
| `sortBy` | string | Campo de ordenamiento | `createdAt`, `updatedAt`, `title` | `?sortBy=createdAt` |
| `order` | string | Orden de clasificación | `ASC`, `DESC` (default: DESC) | `?order=ASC` |

**Ejemplo de Uso:**
```bash
# Obtener publicaciones de danza que están publicadas
curl "http://localhost:3000/publications?category=danza&status=publicado"

# Buscar "festival" en publicaciones de danza
curl "http://localhost:3000/publications?category=danza&search=festival"

# Obtener página 2 de publicaciones publicadas
curl "http://localhost:3000/publications?status=publicado&page=2&limit=20"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Festival de Danza 2025",
      "content": "...",
      "category": "danza",
      "status": "publicado",
      "author": {...},
      "createdAt": "2025-10-02T10:30:00Z",
      "updatedAt": "2025-10-02T10:30:00Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

---

### 2. Filtrar por Categoría Específica

**Endpoint:** `GET /publications/filter/category/:category`

**Descripción:** Endpoint dedicado para filtrar por categoría específica.

**Parámetros de URL:**
- `:category`: Categoría a filtrar

**Query Parameters Adicionales:**
- `status`: Filtrar también por estado
- `search`: Búsqueda de texto
- `page`, `limit`, `sortBy`, `order`: Paginación y ordenamiento

**Categorías Válidas:**
- `danza`
- `gastronomia`
- `retahilero`
- `artista_local`
- `grupo_musica`

**Ejemplos:**

```bash
# Todas las publicaciones de danza
curl http://localhost:3000/publications/filter/category/danza

# Publicaciones de gastronomía que están publicadas
curl "http://localhost:3000/publications/filter/category/gastronomia?status=publicado"

# Buscar "tradicional" en publicaciones de retahilero
curl "http://localhost:3000/publications/filter/category/retahilero?search=tradicional"

# Publicaciones de grupos de música, ordenadas por título
curl "http://localhost:3000/publications/filter/category/grupo_musica?sortBy=title&order=ASC"
```

**Response:**
```json
{
  "success": true,
  "message": "Publicaciones de la categoría: danza",
  "data": [...],
  "meta": {
    "total": 8,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 3. Filtrar por Estado Específico

**Endpoint:** `GET /publications/filter/status/:status`

**Descripción:** Endpoint dedicado para filtrar por estado específico.

**Parámetros de URL:**
- `:status`: Estado a filtrar

**Query Parameters Adicionales:**
- `category`: Filtrar también por categoría
- `search`: Búsqueda de texto
- `page`, `limit`, `sortBy`, `order`: Paginación y ordenamiento

**Estados Válidos:**
- `borrador` - Publicaciones en borrador
- `publicado` - Publicaciones aprobadas y visibles
- `archivado` - Publicaciones archivadas o rechazadas
- `pendiente_revision` - Publicaciones esperando aprobación

**Ejemplos:**

```bash
# Todas las publicaciones publicadas
curl http://localhost:3000/publications/filter/status/publicado

# Publicaciones en borrador de categoría danza
curl "http://localhost:3000/publications/filter/status/borrador?category=danza"

# Publicaciones archivadas
curl http://localhost:3000/publications/filter/status/archivado

# Publicaciones pendientes de revisión
curl http://localhost:3000/publications/filter/status/pendiente_revision
```

**Response:**
```json
{
  "success": true,
  "message": "Publicaciones con estado: publicado",
  "data": [...],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

### 4. Obtener Solo Publicaciones Publicadas

**Endpoint:** `GET /publications/published`

**Descripción:** Endpoint helper para obtener rápidamente solo publicaciones publicadas (atajo para `/filter/status/publicado`).

**Query Parameters:**
- `category`: Filtrar por categoría
- `search`: Búsqueda de texto
- `page`, `limit`, `sortBy`, `order`: Paginación y ordenamiento

**Ejemplos:**

```bash
# Todas las publicaciones publicadas
curl http://localhost:3000/publications/published

# Publicaciones publicadas de danza
curl "http://localhost:3000/publications/published?category=danza"

# Buscar "festival" en publicaciones publicadas
curl "http://localhost:3000/publications/published?search=festival"
```

**Response:**
```json
{
  "success": true,
  "message": "Publicaciones publicadas",
  "data": [...],
  "meta": {
    "total": 20,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

---

### 5. Filtrar por Autor

**Endpoint:** `GET /publications/author/:authorId`

**Descripción:** Obtener publicaciones de un autor específico.

**Parámetros de URL:**
- `:authorId`: UUID del autor

**Query Parameters:**
- `category`: Filtrar por categoría
- `status`: Filtrar por estado
- `search`: Búsqueda de texto
- `page`, `limit`, `sortBy`, `order`: Paginación y ordenamiento

**Ejemplo:**
```bash
# Todas las publicaciones de un autor
curl http://localhost:3000/publications/author/uuid-del-autor

# Publicaciones publicadas de un autor en categoría danza
curl "http://localhost:3000/publications/author/uuid-del-autor?status=publicado&category=danza"
```

---

### 6. Mis Publicaciones (Usuario Autenticado)

**Endpoint:** `GET /publications/my-publications`

**Permisos:** Usuario autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `category`: Filtrar por categoría
- `status`: Filtrar por estado
- `search`: Búsqueda de texto
- `page`, `limit`, `sortBy`, `order`: Paginación y ordenamiento

**Ejemplos:**
```bash
# Todas mis publicaciones
curl http://localhost:3000/publications/my-publications \
  -H "Authorization: Bearer TU_TOKEN"

# Mis publicaciones en borrador
curl "http://localhost:3000/publications/my-publications?status=borrador" \
  -H "Authorization: Bearer TU_TOKEN"

# Mis publicaciones de danza
curl "http://localhost:3000/publications/my-publications?category=danza" \
  -H "Authorization: Bearer TU_TOKEN"
```

---

### 7. Publicaciones Pendientes (Solo Admin)

**Endpoint:** `GET /publications/admin/pending`

**Permisos:** Solo administradores

**Headers:**
```
Authorization: Bearer {token_admin}
```

**Query Parameters:**
- `page`, `limit`, `sortBy`, `order`: Paginación y ordenamiento
- `search`: Búsqueda de texto

**Ejemplo:**
```bash
# Todas las publicaciones pendientes
curl http://localhost:3000/publications/admin/pending \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

---

## 🎯 Casos de Uso Comunes

### Caso 1: Buscar Publicaciones de Danza Publicadas
```bash
# Método 1: Query parameters
curl "http://localhost:3000/publications?category=danza&status=publicado"

# Método 2: Endpoint de categoría
curl "http://localhost:3000/publications/filter/category/danza?status=publicado"

# Método 3: Endpoint de publicadas
curl "http://localhost:3000/publications/published?category=danza"
```

### Caso 2: Buscar "Festival" en Todas las Publicaciones Publicadas
```bash
curl "http://localhost:3000/publications/published?search=festival"
```

### Caso 3: Ver Mis Publicaciones en Borrador
```bash
curl "http://localhost:3000/publications/my-publications?status=borrador" \
  -H "Authorization: Bearer TU_TOKEN"
```

### Caso 4: Publicaciones de Gastronomía, Página 2, 20 por Página
```bash
curl "http://localhost:3000/publications/filter/category/gastronomia?page=2&limit=20"
```

### Caso 5: Publicaciones de un Autor Específico que Están Publicadas
```bash
curl "http://localhost:3000/publications/author/uuid-autor?status=publicado"
```

### Caso 6: Buscar "tradicional" en Publicaciones de Retahileros
```bash
curl "http://localhost:3000/publications?category=retahilero&search=tradicional&status=publicado"
```

---

## 📊 Combinaciones de Filtros

Los filtros se pueden combinar de múltiples formas:

### Filtro por Categoría + Estado
```bash
curl "http://localhost:3000/publications?category=danza&status=publicado"
```

### Filtro por Categoría + Búsqueda
```bash
curl "http://localhost:3000/publications?category=gastronomia&search=receta"
```

### Filtro por Estado + Búsqueda
```bash
curl "http://localhost:3000/publications?status=publicado&search=festival"
```

### Filtro Triple: Categoría + Estado + Búsqueda
```bash
curl "http://localhost:3000/publications?category=danza&status=publicado&search=folklórico"
```

### Con Paginación y Ordenamiento
```bash
curl "http://localhost:3000/publications?category=danza&status=publicado&page=1&limit=20&sortBy=createdAt&order=DESC"
```

---

## 🔄 Valores Válidos

### Categorías:
- `danza` - Festivales, clases, eventos de danza
- `gastronomia` - Recetas, restaurantes, comida local
- `retahilero` - Narradores, cuentacuentos tradicionales
- `artista_local` - Pintores, escultores, artistas visuales
- `grupo_musica` - Bandas, grupos musicales locales

### Estados:
- `borrador` - En creación, solo visible para el autor
- `publicado` - Aprobado, visible públicamente
- `archivado` - Archivado o rechazado
- `pendiente_revision` - Esperando aprobación del administrador

### Campos de Ordenamiento (sortBy):
- `createdAt` - Fecha de creación (default)
- `updatedAt` - Fecha de última actualización
- `title` - Título alfabético

### Orden (order):
- `DESC` - Descendente (default)
- `ASC` - Ascendente

---

## 💡 Tips y Mejores Prácticas

### 1. **Usa el Endpoint Correcto:**
- Para listados generales: `GET /publications`
- Para categoría específica: `GET /publications/filter/category/:category`
- Para estado específico: `GET /publications/filter/status/:status`
- Para publicadas: `GET /publications/published`

### 2. **Paginación Eficiente:**
- Usa `limit` apropiado (10-20 para web, 5 para móvil)
- Siempre incluye `page` para navegación
- Revisa `totalPages` en la respuesta para saber cuántas páginas hay

### 3. **Búsqueda de Texto:**
- El parámetro `search` busca en título y contenido
- Es case-insensitive (no distingue mayúsculas/minúsculas)
- Usa palabras clave específicas para mejores resultados

### 4. **Ordenamiento:**
- Por defecto ordena por `createdAt DESC` (más reciente primero)
- Usa `sortBy=title&order=ASC` para orden alfabético
- Usa `sortBy=updatedAt&order=DESC` para ver actualizaciones recientes

### 5. **Filtros Combinados:**
- Combina filtros para resultados más específicos
- Ejemplo: `?category=danza&status=publicado&search=festival&limit=5`

---

## 📈 Ejemplos de Respuesta

### Respuesta Exitosa con Datos:
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Festival de Danza Folklórica 2025",
      "content": "Gran evento de danza tradicional...",
      "category": "danza",
      "status": "publicado",
      "imageUrl": "https://example.com/image.jpg",
      "authorId": "660e8400-e29b-41d4-a716-446655440000",
      "author": {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "firstName": "María",
        "lastName": "González",
        "email": "maria@example.com"
      },
      "createdAt": "2025-10-01T15:30:00Z",
      "updatedAt": "2025-10-02T09:15:00Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

### Respuesta Sin Resultados:
```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

---

## 🚀 Resumen de Endpoints

| Endpoint | Método | Descripción | Auth |
|----------|--------|-------------|------|
| `/publications` | GET | Listado con todos los filtros | No |
| `/publications/filter/category/:category` | GET | Filtrar por categoría | No |
| `/publications/filter/status/:status` | GET | Filtrar por estado | No |
| `/publications/published` | GET | Solo publicadas | No |
| `/publications/my-publications` | GET | Mis publicaciones | Sí |
| `/publications/author/:authorId` | GET | Por autor específico | No |
| `/publications/admin/pending` | GET | Pendientes (admin) | Sí (Admin) |

---

¡Usa estos filtros para encontrar exactamente las publicaciones que necesitas! 🎉

