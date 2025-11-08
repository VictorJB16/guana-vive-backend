import {
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import {
  PublicationCategory,
  PublicationStatus,
} from '../types/publication.enum';
import { PUBLICATION_CONSTANTS } from '../types/publication.constants';
import { IsUrlOrLocalhost } from '../../common/validators/is-url-or-localhost.validator';

/**
 * DTO para actualizar una publicación existente
 */
export class UpdatePublicationDto {
  @IsString()
  @IsOptional()
  @MinLength(PUBLICATION_CONSTANTS.TITLE.MIN_LENGTH, {
    message: `El título debe tener al menos ${PUBLICATION_CONSTANTS.TITLE.MIN_LENGTH} caracteres`,
  })
  @MaxLength(PUBLICATION_CONSTANTS.TITLE.MAX_LENGTH, {
    message: `El título no puede exceder ${PUBLICATION_CONSTANTS.TITLE.MAX_LENGTH} caracteres`,
  })
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(PUBLICATION_CONSTANTS.CONTENT.MIN_LENGTH, {
    message: `El contenido debe tener al menos ${PUBLICATION_CONSTANTS.CONTENT.MIN_LENGTH} caracteres`,
  })
  @MaxLength(PUBLICATION_CONSTANTS.CONTENT.MAX_LENGTH, {
    message: `El contenido no puede exceder ${PUBLICATION_CONSTANTS.CONTENT.MAX_LENGTH} caracteres`,
  })
  content?: string;

  @IsEnum(PublicationCategory, {
    message:
      'La categoría debe ser: danza, gastronomia, retahilero, artista_local o grupo_musica',
  })
  @IsOptional()
  category?: PublicationCategory;

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
