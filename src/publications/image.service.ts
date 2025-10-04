import { Injectable, Logger, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);

  /**
   * Valida y procesa una URL de imagen
   */
  processImageUrl(imageUrl: string, publicationTitle: string): string | null {
    this.logger.log(`Processing image URL for publication: ${publicationTitle}`);

    if (!imageUrl) {
      return null;
    }

    // Validar que sea una URL válida
    try {
      const url = new URL(imageUrl);
      
      // Verificar que sea HTTP o HTTPS
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new BadRequestException('La URL de la imagen debe usar protocolo HTTP o HTTPS');
      }

      // Verificar que sea una imagen (extensiones comunes)
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const pathname = url.pathname.toLowerCase();
      const hasImageExtension = imageExtensions.some(ext => pathname.endsWith(ext));

      if (!hasImageExtension && !url.hostname.includes('placeholder')) {
        this.logger.warn(`URL may not be an image: ${imageUrl}`);
      }

      return imageUrl;
    } catch (error) {
      this.logger.error(`Invalid image URL: ${imageUrl}`, error);
      throw new BadRequestException('URL de imagen inválida');
    }
  }

  /**
   * Genera una URL de imagen placeholder basada en la categoría
   */
  generatePlaceholderImage(category: string, title: string): string {
    const categoryImages = {
      danza: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop',
      gastronomia: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
      retahilero: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop',
      artista_local: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
      grupo_musica: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    };

    const baseImage = categoryImages[category] || categoryImages.artista_local;
    const encodedTitle = encodeURIComponent(title);
    
    return `${baseImage}&text=${encodedTitle}`;
  }

  /**
   * Valida el tamaño de la imagen (simulación - en producción usarías un servicio real)
   */
  async validateImageSize(imageUrl: string): Promise<boolean> {
    this.logger.log(`Validating image size for: ${imageUrl}`);
    
    try {
      // En una implementación real, harías una petición HEAD para obtener el Content-Length
      // Por ahora, simulamos que todas las imágenes son válidas
      return true;
    } catch (error) {
      this.logger.error(`Error validating image size: ${imageUrl}`, error);
      return false;
    }
  }

  /**
   * Genera una URL de imagen optimizada para diferentes tamaños
   */
  generateOptimizedImageUrl(imageUrl: string, size: 'thumbnail' | 'medium' | 'large' = 'medium'): string | null {
    if (!imageUrl) {
      return null;
    }

    const sizeParams = {
      thumbnail: 'w=300&h=200&fit=crop',
      medium: 'w=800&h=600&fit=crop',
      large: 'w=1200&h=800&fit=crop',
    };

    // Si es una URL de Unsplash, agregar parámetros de optimización
    if (imageUrl.includes('unsplash.com')) {
      const separator = imageUrl.includes('?') ? '&' : '?';
      return `${imageUrl}${separator}${sizeParams[size]}`;
    }

    return imageUrl;
  }
}
