import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileService {
  /**
   * Valida si una URL es válida para usar como avatar
   */
  validateAvatarUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);

      // Verificar que sea HTTP o HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return false;
      }

      // Verificar extensiones de imagen comunes
      const imageExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.webp',
        '.svg',
      ];
      const pathname = urlObj.pathname.toLowerCase();
      const hasValidExtension = imageExtensions.some((ext) =>
        pathname.endsWith(ext),
      );

      if (!hasValidExtension) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Genera una URL de avatar por defecto basada en las iniciales del usuario
   */
  generateDefaultAvatar(firstName: string, lastName: string): string {
    const initials =
      `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    // Usar un servicio de avatares por defecto (como Gravatar o UI Avatars)
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=200`;
  }

  /**
   * Procesa y valida una URL de avatar
   */
  processAvatarUrl(
    avatarUrl: string,
    firstName?: string,
    lastName?: string,
  ): string {
    if (!avatarUrl) {
      if (firstName && lastName) {
        return this.generateDefaultAvatar(firstName, lastName);
      }
      return '';
    }

    if (!this.validateAvatarUrl(avatarUrl)) {
      throw new BadRequestException('La URL del avatar no es válida');
    }

    return avatarUrl;
  }
}
