/**
 * Constantes para el módulo de usuarios
 */

export const USER_CONSTANTS = {
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 20,
    SALT_ROUNDS: 10,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  },
} as const;

export const USER_ERROR_MESSAGES = {
  USER_NOT_FOUND: 'Usuario no encontrado',
  EMAIL_ALREADY_EXISTS: 'El email ya está registrado',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  INVALID_CURRENT_PASSWORD: 'La contraseña actual es incorrecta',
  USER_CREATION_FAILED: 'Error al crear el usuario',
  USER_UPDATE_FAILED: 'Error al actualizar el usuario',
  UNAUTHORIZED: 'No autorizado',
  INVALID_UUID: 'ID de usuario inválido',
} as const;

export const USER_SUCCESS_MESSAGES = {
  USER_CREATED: 'Usuario creado exitosamente',
  USER_UPDATED: 'Usuario actualizado exitosamente',
  USER_DELETED: 'Usuario eliminado exitosamente',
  PASSWORD_CHANGED: 'Contraseña cambiada exitosamente',
  STATUS_TOGGLED: 'Estado del usuario actualizado',
} as const;
