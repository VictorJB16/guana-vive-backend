/**
 * Categorías disponibles para las publicaciones
 */
export enum PublicationCategory {
  DANZA = 'danza',
  GASTRONOMIA = 'gastronomia',
  RETAHILERO = 'retahilero',
  ARTISTA_LOCAL = 'artista_local',
  GRUPO_MUSICA = 'grupo_musica',
}

/**
 * Estados disponibles para las publicaciones
 */
export enum PublicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING_REVIEW = 'PENDING_REVIEW',
  DRAFT = 'borrador',
  PUBLISHED = 'publicado',
  ARCHIVED = 'archivado',
}
