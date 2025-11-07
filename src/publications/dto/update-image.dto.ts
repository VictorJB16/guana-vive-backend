import { IsUrl, IsNotEmpty } from 'class-validator';

/**
 * DTO para actualizar solo la imagen de una publicación
 */
export class UpdateImageDto {
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
    },
    {
      message:
        'La URL de la imagen debe ser válida y usar protocolo HTTP o HTTPS',
    },
  )
  @IsNotEmpty({ message: 'La URL de la imagen es requerida' })
  imageUrl: string;
}
