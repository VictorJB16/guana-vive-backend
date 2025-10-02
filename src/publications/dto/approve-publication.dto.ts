import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PublicationStatus } from '../types/publication.enum';

/**
 * DTO para aprobar o rechazar una publicación
 */
export class ApprovePublicationDto {
  @IsEnum(PublicationStatus, {
    message: 'El estado debe ser: publicado o archivado',
  })
  status: PublicationStatus;

  @IsString()
  @IsOptional()
  @MaxLength(500, {
    message: 'El mensaje no puede exceder 500 caracteres',
  })
  message?: string;
}

