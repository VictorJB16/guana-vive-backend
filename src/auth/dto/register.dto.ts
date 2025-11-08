import { CreateUserDto } from '../../users/dto/create-user.dto';
import { IsOptional, IsString } from 'class-validator';

// El DTO de registro extiende del DTO de crear usuario
// porque utilizará la misma lógica de validación
export class RegisterDto extends CreateUserDto {
  @IsOptional()
  @IsString({ message: 'El token de reCAPTCHA debe ser una cadena de texto' })
  readonly recaptchaToken?: string;
}
