/**
 * Constantes para el módulo de publicaciones
 */
export const PUBLICATION_CONSTANTS = {
  TITLE: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 200,
  },
  CONTENT: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 5000,
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
};

/**
 * Mensajes de error para el módulo de publicaciones
 */
export const PUBLICATION_ERROR_MESSAGES = {
  NOT_FOUND: 'Publicación no encontrada',
  CREATION_FAILED: 'Error al crear la publicación',
  UPDATE_FAILED: 'Error al actualizar la publicación',
  DELETE_FAILED: 'Error al eliminar la publicación',
  INVALID_CATEGORY: 'Categoría inválida',
  INVALID_STATUS: 'Estado inválido',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
};

/**
 * Mensajes de éxito para el módulo de publicaciones
 */
export const PUBLICATION_SUCCESS_MESSAGES = {
  CREATED: 'Publicación creada exitosamente',
  UPDATED: 'Publicación actualizada exitosamente',
  DELETED: 'Publicación eliminada exitosamente',
  STATUS_CHANGED: 'Estado de la publicación actualizado',
};
