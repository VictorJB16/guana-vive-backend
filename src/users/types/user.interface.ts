import { User } from '../entities/user.entity';
import { UserRole, UserSortBy, SortOrder } from './user.enum';

/**
 * Interfaces para el módulo de usuarios
 */

export type IUserWithoutPassword = Omit<
  User,
  'password' | 'hashPassword' | 'validatePassword'
>;

export interface IUserRepository {
  create(userData: Partial<User>): User;
  save(user: User): Promise<User>;
  findOne(options: any): Promise<User | null>;
  find(options?: any): Promise<User[]>;
  remove(user: User): Promise<User>;
}

export interface IUserService {
  create(createUserDto: any): Promise<IUserWithoutPassword>;
  findAll(options?: IFindUsersOptions): Promise<IUserWithoutPassword[]>;
  findOne(id: string): Promise<IUserWithoutPassword>;
  findByEmail(
    email: string,
    includePassword?: boolean,
  ): Promise<User | IUserWithoutPassword>;
  update(id: string, updateUserDto: any): Promise<IUserWithoutPassword>;
  changePassword(id: string, changePasswordDto: any): Promise<void>;
  remove(id: string): Promise<void>;
  toggleStatus(id: string): Promise<IUserWithoutPassword>;
  validateUser(
    email: string,
    password: string,
  ): Promise<IUserWithoutPassword | null>;
}

export interface IFindUsersOptions {
  page?: number;
  limit?: number;
  sortBy?: UserSortBy;
  order?: SortOrder;
  role?: UserRole;
  isActive?: boolean;
  search?: string;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: IPaginationMeta;
}

export interface IUserFilterOptions {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
}

export interface IPasswordValidationResult {
  isValid: boolean;
  errors?: string[];
}

export interface IUserValidationResult {
  isValid: boolean;
  user?: IUserWithoutPassword;
  errors?: string[];
}

export interface IUserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  regularUsers: number;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  dateOfBirth?: Date | string;
  address?: string;
  city?: string;
  country?: string;
}
