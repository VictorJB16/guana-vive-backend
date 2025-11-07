import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../types/user.enum';

export class ChangeUserRoleDto {
  @IsEnum(UserRole, {
    message: 'El rol debe ser "user" o "admin"',
  })
  @IsNotEmpty({ message: 'El rol es requerido' })
  role: UserRole;
}
