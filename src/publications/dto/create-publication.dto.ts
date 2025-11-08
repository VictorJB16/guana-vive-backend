import {
  IsString,
  IsEnum,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { PublicationStatus } from '../types/publication.enum';
import { PUBLICATION_CONSTANTS } from '../types/publication.constants';
import { IsUrlOrLocalhost } from '../../common/validators/is-url-or-localhost.validator';

/**
 * DTO para crear una nueva publicación
 */
export class CreatePublicationDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es requerido' })
  @MinLength(PUBLICATION_CONSTANTS.TITLE.MIN_LENGTH, {
    message: `El título debe tener al menos ${PUBLICATION_CONSTANTS.TITLE.MIN_LENGTH} caracteres`,
  })
  @MaxLength(PUBLICATION_CONSTANTS.TITLE.MAX_LENGTH, {
    message: `El título no puede exceder ${PUBLICATION_CONSTANTS.TITLE.MAX_LENGTH} caracteres`,
  })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'El contenido es requerido' })
  @MinLength(PUBLICATION_CONSTANTS.CONTENT.MIN_LENGTH, {
    message: `El contenido debe tener al menos ${PUBLICATION_CONSTANTS.CONTENT.MIN_LENGTH} caracteres`,
  })
  @MaxLength(PUBLICATION_CONSTANTS.CONTENT.MAX_LENGTH, {
    message: `El contenido no puede exceder ${PUBLICATION_CONSTANTS.CONTENT.MAX_LENGTH} caracteres`,
  })
  content: string;

  @IsUUID('4', { message: 'La categoría debe ser un UUID válido' })
  @IsNotEmpty({ message: 'La categoría es requerida' })
  categoryId: string;

  @IsEnum(PublicationStatus, {
    message:
      'El estado debe ser: borrador, publicado, archivado o pendiente_revision',
  })
  @IsOptional()
  status?: PublicationStatus;

  @IsOptional()
  @IsUrlOrLocalhost({
    message: 'La URL de la imagen no es válida',
  })
  imageUrl?: string;
}
