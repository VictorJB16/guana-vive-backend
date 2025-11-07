import { PartialType, OmitType } from '@nestjs/mapped-types';
import {
  IsOptional,
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsBoolean,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../types/user.enum';
import { USER_CONSTANTS } from '../types/user.constants';

// DTO para actualizar usuario (excluye password del CreateUserDto)
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {
  @IsOptional()
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  readonly email?: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(USER_CONSTANTS.NAME.MIN_LENGTH, {
    message: `El nombre debe tener al menos ${USER_CONSTANTS.NAME.MIN_LENGTH} caracteres`,
  })
  @MaxLength(USER_CONSTANTS.NAME.MAX_LENGTH, {
    message: `El nombre no puede tener más de ${USER_CONSTANTS.NAME.MAX_LENGTH} caracteres`,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly firstName?: string;

  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(USER_CONSTANTS.NAME.MIN_LENGTH, {
    message: `El apellido debe tener al menos ${USER_CONSTANTS.NAME.MIN_LENGTH} caracteres`,
  })
  @MaxLength(USER_CONSTANTS.NAME.MAX_LENGTH, {
    message: `El apellido no puede tener más de ${USER_CONSTANTS.NAME.MAX_LENGTH} caracteres`,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly lastName?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser user o admin' })
  readonly role?: UserRole;

  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  readonly isActive?: boolean;
}

// DTO específico para login
export class LoginDto {
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  readonly email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(USER_CONSTANTS.PASSWORD.MIN_LENGTH, {
    message: `La contraseña debe tener al menos ${USER_CONSTANTS.PASSWORD.MIN_LENGTH} caracteres`,
  })
  readonly password: string;
}

// DTO específico para cambio de contraseña
export class ChangePasswordDto {
  @IsString({ message: 'La contraseña actual debe ser una cadena de texto' })
  @MinLength(1, { message: 'La contraseña actual es requerida' })
  readonly currentPassword: string;

  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
  @MinLength(USER_CONSTANTS.PASSWORD.MIN_LENGTH, {
    message: `La nueva contraseña debe tener al menos ${USER_CONSTANTS.PASSWORD.MIN_LENGTH} caracteres`,
  })
  @MaxLength(USER_CONSTANTS.PASSWORD.MAX_LENGTH, {
    message: `La nueva contraseña no puede tener más de ${USER_CONSTANTS.PASSWORD.MAX_LENGTH} caracteres`,
  })
  @Matches(USER_CONSTANTS.VALIDATION.PASSWORD_REGEX, {
    message:
      'La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número',
  })
  readonly newPassword: string;
}

// DTO para validación de usuario
export class ValidateUserDto {
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  readonly email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  readonly password: string;
}
