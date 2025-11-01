import { PublicationStatus } from './publication.enum';

/**
 * Opciones para buscar publicaciones
 */
export interface IFindPublicationsOptions {
  page?: number;
  limit?: number;
  sortBy?: PublicationSortBy;
  order?: SortOrder;
  category?: string;
  status?: PublicationStatus;
  authorId?: string;
  search?: string;
}

/**
 * Respuesta paginada
 */
export interface IPaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Campos por los que se puede ordenar
 */
export enum PublicationSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TITLE = 'title',
}

/**
 * Orden de ordenamiento
 */
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * Parámetros de consulta para buscar publicaciones
 */
export interface PublicationQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: string;
  category?: string;
  status?: string;
  authorId?: string;
  search?: string;
}
