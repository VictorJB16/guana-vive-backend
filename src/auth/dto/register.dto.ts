import { CreateUserDto } from '../../users/dto/create-user.dto';

// El DTO de registro extiende del DTO de crear usuario
// porque utilizará la misma lógica de validación
export class RegisterDto extends CreateUserDto {}
