/**
 * Tipos de respuesta para el módulo de usuarios
 */

export type UserResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserResponse = {
  success: boolean;
  message: string;
  data: UserResponse;
};

export type UpdateUserResponse = {
  success: boolean;
  message: string;
  data: UserResponse;
};

export type DeleteUserResponse = {
  success: boolean;
  message: string;
};

export type PasswordChangeResponse = {
  success: boolean;
  message: string;
};

export type UserValidationResponse = {
  isValid: boolean;
  user?: UserResponse;
};

export type GetUsersResponse = {
  success: boolean;
  data: UserResponse[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type GetUserResponse = {
  success: boolean;
  data: UserResponse;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: string[];
  statusCode: number;
};

export type UserQueryParams = {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'email' | 'firstName' | 'lastName';
  order?: 'ASC' | 'DESC';
  role?: 'user' | 'admin';
  isActive?: boolean;
  search?: string;
};
