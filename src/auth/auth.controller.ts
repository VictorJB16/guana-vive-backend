import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Get,
  Request,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto';
import type {
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  UserResponseDto,
} from './interfaces';
import { JwtAuthGuard } from './guards';
import type { IUserWithoutPassword } from '../users/types';

interface AuthenticatedRequest extends Request {
  user: IUserWithoutPassword;
}

interface MeResponse {
  success: boolean;
  user: UserResponseDto;
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Registro de nuevo usuario
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    try {
      this.logger.log(`Registration attempt for email: ${registerDto.email}`);
      return await this.authService.register(registerDto);
    } catch (error) {
      this.logger.error(`Registration failed for ${registerDto.email}:`, error);
      throw error;
    }
  }

  /**
   * Login de usuario
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    try {
      this.logger.log(`Login attempt for email: ${loginDto.email}`);
      return await this.authService.login(loginDto);
    } catch (error) {
      this.logger.error(`Login failed for ${loginDto.email}:`, error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponse> {
    try {
      this.logger.log('Refresh token request received');
      return await this.authService.refreshTokens(refreshTokenDto);
    } catch (error) {
      this.logger.error('Refresh tokens failed:', error);
      throw error;
    }
  }

  /**
   * Validar token y obtener información del usuario
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req: AuthenticatedRequest): MeResponse {
    try {
      const user = req.user;

      if (!user) {
        throw new InternalServerErrorException(
          'Usuario no encontrado en la request',
        );
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error('Get me endpoint failed:', error);
      throw error;
    }
  }

  /**
   * Logout (invalidar token)
   * Nota: En implementaciones más avanzadas se podría mantener
   * una lista de tokens revocados en Redis o base de datos
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(): LogoutResponse {
    this.logger.log('Logout request received');

    return {
      success: true,
      message: 'Logout exitoso',
    };
  }
}
