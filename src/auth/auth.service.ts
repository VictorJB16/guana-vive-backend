import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto';
import type {
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  JwtPayload,
} from './interfaces';
import type { IUserWithoutPassword } from '../users/types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Registrar un nuevo usuario
   */
  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    this.logger.log(`Registering new user with email: ${registerDto.email}`);

    try {
      // Verificar si el usuario ya existe sin lanzar excepción
      const existingUser = await this.usersService.findByEmailSafe(
        registerDto.email,
        false,
      );

      if (existingUser) {
        throw new ConflictException('El usuario ya existe con este email');
      }

      // Crear el usuario usando UsersService
      const user = await this.usersService.create(registerDto);

      this.logger.log(`User registered successfully: ${user.email}`);

      return {
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error(`Registration failed for ${registerDto.email}:`, error);
      throw error;
    }
  }

  /**
   * Login de usuario
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);

    try {
      // Validar credenciales
      const user = await this.usersService.validateUser(
        loginDto.email,
        loginDto.password,
      );

      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Generar tokens
      const tokens = this.generateTokens(user);

      this.logger.log(`Login successful for user: ${user.email}`);

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error(`Login failed for ${loginDto.email}:`, error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshTokens(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponse> {
    this.logger.log('Attempting to refresh tokens');

    try {
      // Verificar el refresh token
      const payload = this.verifyRefreshToken(refreshTokenDto.refreshToken);

      // Obtener el usuario
      const user = await this.usersService.findOne(payload.sub);

      if (!user.isActive) {
        throw new UnauthorizedException('Usuario inactivo');
      }

      // Generar nuevos tokens
      const tokens = this.generateTokens(user);

      this.logger.log(`Tokens refreshed successfully for user: ${user.email}`);

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    } catch (error) {
      this.logger.error('Error refreshing tokens:', error);
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  /**
   * Validar un access token
   */
  async validateToken(token: string): Promise<IUserWithoutPassword> {
    try {
      const payload = this.verifyAccessToken(token);
      const user = await this.usersService.findOne(payload.sub);

      if (!user.isActive) {
        throw new UnauthorizedException('Usuario inactivo');
      }

      return user;
    } catch (error) {
      this.logger.error('Token validation failed:', error);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  /**
   * Verificar refresh token
   */
  private verifyRefreshToken(token: string): JwtPayload {
    const refreshSecret = this.getRefreshSecret();

    const payload = this.jwtService.verify<JwtPayload>(token, {
      secret: refreshSecret,
    });

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Token inválido');
    }

    return payload;
  }

  /**
   * Verificar access token
   */
  private verifyAccessToken(token: string): JwtPayload {
    const secret = this.getJwtSecret();

    const payload = this.jwtService.verify<JwtPayload>(token, {
      secret,
    });

    if (payload.type && payload.type !== 'access') {
      throw new UnauthorizedException('Token inválido');
    }

    return payload;
  }

  /**
   * Generar access token y refresh token
   */
  private generateTokens(user: IUserWithoutPassword): {
    access_token: string;
    refresh_token: string;
  } {
    const accessPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    };

    const refreshPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'refresh',
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      secret: this.getJwtSecret(),
      expiresIn: this.getJwtExpiresIn(),
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.getRefreshSecret(),
      expiresIn: this.getRefreshExpiresIn(),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /**
   * Obtener JWT secret
   */
  private getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || 'fallback-secret';
  }

  /**
   * Obtener JWT refresh secret
   */
  private getRefreshSecret(): string {
    return (
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'fallback-refresh-secret'
    );
  }

  /**
   * Obtener JWT expiration time
   */
  private getJwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN') || '15m';
  }

  /**
   * Obtener JWT refresh expiration time
   */
  private getRefreshExpiresIn(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
  }
}
