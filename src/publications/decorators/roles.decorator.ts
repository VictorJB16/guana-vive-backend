import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/types/user.enum';

export const ROLES_KEY = 'roles';

/**
 * Decorator para especificar qué roles tienen acceso a un endpoint
 * @param roles - Array de roles permitidos
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
