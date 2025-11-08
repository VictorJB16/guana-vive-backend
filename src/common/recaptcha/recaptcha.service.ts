import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
  score?: number;
  action?: string;
}

@Injectable()
export class RecaptchaService {
  private readonly logger = new Logger(RecaptchaService.name);
  private readonly secretKey: string;
  private readonly verifyUrl =
    'https://www.google.com/recaptcha/api/siteverify';

  constructor(private configService: ConfigService) {
    this.secretKey =
      this.configService.get<string>('RECAPTCHA_SECRET_KEY') || '';

    if (!this.secretKey) {
      this.logger.warn(
        'RECAPTCHA_SECRET_KEY not configured. reCAPTCHA validation will be skipped in development.',
      );
    }
  }

  /**
   * Verifica el token de reCAPTCHA con Google
   * @param token Token recibido del frontend
   * @param remoteIp IP del cliente (opcional)
   * @returns Promise<boolean> true si la verificación es exitosa
   */
  async verifyToken(token: string, remoteIp?: string): Promise<boolean> {
    // En desarrollo, si no hay secret key configurada, permitir el acceso
    if (!this.secretKey) {
      this.logger.warn(
        'reCAPTCHA validation skipped - no secret key configured',
      );
      return true;
    }

    if (!token) {
      throw new BadRequestException('reCAPTCHA token is required');
    }

    try {
      const params = new URLSearchParams({
        secret: this.secretKey,
        response: token,
        ...(remoteIp && { remoteip: remoteIp }),
      });

      const response = await fetch(this.verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        this.logger.error(
          `reCAPTCHA API error: ${response.status} ${response.statusText}`,
        );
        throw new BadRequestException('Failed to verify reCAPTCHA');
      }

      const data: RecaptchaResponse = await response.json();

      if (!data.success) {
        this.logger.warn('reCAPTCHA verification failed', {
          errorCodes: data['error-codes'],
          hostname: data.hostname,
        });

        // Mensajes de error más específicos
        const errorCodes = data['error-codes'] || [];
        if (errorCodes.includes('timeout-or-duplicate')) {
          throw new BadRequestException(
            'reCAPTCHA token has expired or been used already',
          );
        }
        if (errorCodes.includes('invalid-input-response')) {
          throw new BadRequestException('Invalid reCAPTCHA token');
        }

        throw new BadRequestException('reCAPTCHA verification failed');
      }

      this.logger.log('reCAPTCHA verification successful');
      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error('Error verifying reCAPTCHA', error);
      throw new BadRequestException('Failed to verify reCAPTCHA');
    }
  }

  /**
   * Valida que el token de reCAPTCHA sea válido o lanza una excepción
   * @param token Token recibido del frontend
   * @param remoteIp IP del cliente (opcional)
   */
  async validateOrFail(token: string, remoteIp?: string): Promise<void> {
    await this.verifyToken(token, remoteIp);
  }
}
