# Quick Start - Módulo de Publicaciones

## 🚀 Puesta en Marcha

### 1. Ejecutar la migración de base de datos
```bash
npm run migration:run
```

### 2. Iniciar el servidor en modo desarrollo
```bash
npm run start:dev
```

### 3. Verificar que el servidor está corriendo
El servidor debería estar disponible en: `http://localhost:3000`

---

## 📝 Pruebas Rápidas

### Requisito previo: Obtener token JWT
Primero necesitas autenticarte para obtener un token:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tu-email@example.com",
    "password": "tu-password"
  }'
```

Guarda el `accessToken` que recibes en la respuesta.

---

## ✅ Pruebas de Endpoints

### 1. Crear una publicación de Danza con imagen
```bash
curl -X POST http://localhost:3000/publications \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Festival de Danza Folklórica 2025",
    "content": "Este sábado 5 de octubre se realizará el festival anual de danza folklórica en la plaza central de Guana. Habrá presentaciones de grupos locales y regionales.",
    "category": "danza",
    "status": "publicado",
    "imageUrl": "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop"
  }'
```

### 2. Crear una publicación de Gastronomía con imagen
```bash
curl -X POST http://localhost:3000/publications \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Receta Tradicional: Tamales de Maíz",
    "content": "Los tamales son uno de los platillos más tradicionales de nuestra región. En esta publicación compartimos la receta de la abuela...",
    "category": "gastronomia",
    "status": "publicado",
    "imageUrl": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop"
  }'
```

### 3. Crear una publicación de Grupo de Música
```bash
curl -X POST http://localhost:3000/publications \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Los Trovadores de Guana - Nuevo Álbum",
    "content": "El grupo musical Los Trovadores de Guana lanza su nuevo álbum con canciones originales inspiradas en las tradiciones locales.",
    "category": "grupo_musica",
    "status": "publicado"
  }'
```

### 4. Crear una publicación de Artista Local
```bash
curl -X POST http://localhost:3000/publications \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Exposición de Arte: María González",
    "content": "La artista local María González presentará su nueva colección de pinturas inspiradas en los paisajes de Guana.",
    "category": "artista_local",
    "status": "publicado"
  }'
```

### 5. Crear una publicación de Retahilero
```bash
curl -X POST http://localhost:3000/publications \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Don Pedro y sus Retahílas Tradicionales",
    "content": "Don Pedro, el retahilero más conocido de Guana, compartirá sus historias y retahílas en la biblioteca municipal.",
    "category": "retahilero",
    "status": "publicado"
  }'
```

### 6. Obtener todas las publicaciones
```bash
curl http://localhost:3000/publications
```

### 7. Obtener solo publicaciones de danza
```bash
curl http://localhost:3000/publications/category/danza
```

### 8. Obtener mis publicaciones
```bash
curl http://localhost:3000/publications/my-publications \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 9. Buscar publicaciones por texto
```bash
curl "http://localhost:3000/publications?search=festival"
```

### 10. Obtener una publicación específica
```bash
curl http://localhost:3000/publications/{ID_DE_LA_PUBLICACION}
```

### 11. Actualizar una publicación
```bash
curl -X PATCH http://localhost:3000/publications/{ID_DE_LA_PUBLICACION} \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Festival de Danza Folklórica 2025 - ACTUALIZADO",
    "content": "Contenido actualizado..."
  }'
```

### 12. Cambiar estado de una publicación
```bash
curl -X PATCH http://localhost:3000/publications/{ID_DE_LA_PUBLICACION}/status \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "archivado"
  }'
```

### 13. Actualizar imagen de una publicación
```bash
curl -X PATCH http://localhost:3000/publications/{ID_DE_LA_PUBLICACION}/image \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop"
  }'
```

### 14. Eliminar imagen de una publicación
```bash
curl -X DELETE http://localhost:3000/publications/{ID_DE_LA_PUBLICACION}/image \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 15. Eliminar una publicación
```bash
curl -X DELETE http://localhost:3000/publications/{ID_DE_LA_PUBLICACION} \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🎯 Filtros Avanzados

### Filtrar por categoría y estado
```bash
curl "http://localhost:3000/publications?category=danza&status=publicado"
```

### Paginación
```bash
curl "http://localhost:3000/publications?page=1&limit=5"
```

### Ordenamiento
```bash
curl "http://localhost:3000/publications?sortBy=title&order=ASC"
```

### Combinación de filtros
```bash
curl "http://localhost:3000/publications?category=gastronomia&status=publicado&page=1&limit=10&sortBy=createdAt&order=DESC&search=receta"
```

---

## 📊 Categorías y Estados Válidos

### Categorías:
- `danza`
- `gastronomia`
- `retahilero`
- `artista_local`
- `grupo_musica`

### Estados:
- `borrador` (default)
- `publicado`
- `archivado`
- `pendiente_revision`

---

## 🔍 Verificar en la Base de Datos

### Conectarse a PostgreSQL
```bash
docker exec -it guana-vive-postgres psql -U postgres -d guana_vive_db
```

### Ver todas las publicaciones
```sql
SELECT id, title, category, status, "authorId", "createdAt" 
FROM publications 
ORDER BY "createdAt" DESC;
```

### Ver publicaciones por categoría
```sql
SELECT title, category, status 
FROM publications 
WHERE category = 'danza';
```

### Salir de PostgreSQL
```
\q
```

---

## 📚 Documentación Adicional

- **Documentación Completa API**: Ver `PUBLICATIONS_API.md`
- **Detalles de Implementación**: Ver `PUBLICATIONS_IMPLEMENTATION.md`

---

## ⚠️ Notas Importantes

1. Reemplaza `TU_TOKEN_AQUI` con tu token JWT real obtenido del login
2. Reemplaza `{ID_DE_LA_PUBLICACION}` con el ID UUID real de una publicación
3. Solo puedes modificar/eliminar tus propias publicaciones
4. Las publicaciones públicas son visibles sin autenticación
5. La creación requiere autenticación

---

## 🎉 ¡Listo para usar!

El módulo de publicaciones está completamente funcional y listo para ser utilizado en producción.

