import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsBoolean,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../types/user.enum';
import { USER_CONSTANTS, USER_ERROR_MESSAGES } from '../types/user.constants';

export class CreateUserDto {
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  readonly email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(USER_CONSTANTS.PASSWORD.MIN_LENGTH, {
    message: `La contraseña debe tener al menos ${USER_CONSTANTS.PASSWORD.MIN_LENGTH} caracteres`,
  })
  @MaxLength(USER_CONSTANTS.PASSWORD.MAX_LENGTH, {
    message: `La contraseña no puede tener más de ${USER_CONSTANTS.PASSWORD.MAX_LENGTH} caracteres`,
  })
  @Matches(USER_CONSTANTS.VALIDATION.PASSWORD_REGEX, {
    message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
  })
  readonly password: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(USER_CONSTANTS.NAME.MIN_LENGTH, {
    message: `El nombre debe tener al menos ${USER_CONSTANTS.NAME.MIN_LENGTH} caracteres`,
  })
  @MaxLength(USER_CONSTANTS.NAME.MAX_LENGTH, {
    message: `El nombre no puede tener más de ${USER_CONSTANTS.NAME.MAX_LENGTH} caracteres`,
  })
  @Transform(({ value }) => value?.trim())
  readonly firstName: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(USER_CONSTANTS.NAME.MIN_LENGTH, {
    message: `El apellido debe tener al menos ${USER_CONSTANTS.NAME.MIN_LENGTH} caracteres`,
  })
  @MaxLength(USER_CONSTANTS.NAME.MAX_LENGTH, {
    message: `El apellido no puede tener más de ${USER_CONSTANTS.NAME.MAX_LENGTH} caracteres`,
  })
  @Transform(({ value }) => value?.trim())
  readonly lastName: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser user o admin' })
  readonly role?: UserRole;

  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  readonly isActive?: boolean;
}
