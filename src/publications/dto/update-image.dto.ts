import { IsNotEmpty } from 'class-validator';
import { IsUrlOrLocalhost } from '../../common/validators/is-url-or-localhost.validator';

/**
 * DTO para actualizar solo la imagen de una publicación
 */
export class UpdateImageDto {
  @IsNotEmpty({ message: 'La URL de la imagen es requerida' })
  @IsUrlOrLocalhost({
    message: 'La URL de la imagen no es válida',
  })
  imageUrl: string;
}
