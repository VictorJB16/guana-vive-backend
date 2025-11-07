import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsDateString,
  Matches,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, {
    message: 'El nombre debe tener al menos 2 caracteres',
  })
  @MaxLength(50, {
    message: 'El nombre no puede tener más de 50 caracteres',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly firstName?: string;

  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(2, {
    message: 'El apellido debe tener al menos 2 caracteres',
  })
  @MaxLength(50, {
    message: 'El apellido no puede tener más de 50 caracteres',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly lastName?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, {
    message: 'El teléfono debe tener un formato válido',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly phone?: string;

  @IsOptional()
  @IsString({ message: 'La biografía debe ser una cadena de texto' })
  @MaxLength(500, {
    message: 'La biografía no puede tener más de 500 caracteres',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly bio?: string;

  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)',
    },
  )
  readonly dateOfBirth?: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MaxLength(255, {
    message: 'La dirección no puede tener más de 255 caracteres',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly address?: string;

  @IsOptional()
  @IsString({ message: 'La ciudad debe ser una cadena de texto' })
  @MaxLength(100, {
    message: 'La ciudad no puede tener más de 100 caracteres',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly city?: string;

  @IsOptional()
  @IsString({ message: 'El país debe ser una cadena de texto' })
  @MaxLength(100, {
    message: 'El país no puede tener más de 100 caracteres',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly country?: string;
}

export class UploadAvatarDto {
  @IsOptional()
  @IsUrl({}, { message: 'El avatar debe ser una URL válida' })
  readonly avatarUrl?: string;
}
