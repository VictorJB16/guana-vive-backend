import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PublicationCategory, PublicationStatus } from '../types/publication.enum';
import { PUBLICATION_CONSTANTS } from '../types/publication.constants';

@Entity('publications')
@Index(['status'])
@Index(['category'])
@Index(['authorId'])
export class Publication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: PUBLICATION_CONSTANTS.TITLE.MAX_LENGTH,
    comment: 'Título de la publicación',
  })
  title: string;

  @Column({
    type: 'text',
    comment: 'Contenido de la publicación',
  })
  content: string;

  @Column({
    type: 'enum',
    enum: PublicationCategory,
    comment: 'Categoría de la publicación',
  })
  category: PublicationCategory;

  @Column({
    type: 'enum',
    enum: PublicationStatus,
    default: PublicationStatus.DRAFT,
    comment: 'Estado de la publicación',
  })
  status: PublicationStatus;

  @Column({
    type: 'uuid',
    comment: 'ID del autor de la publicación',
  })
  authorId: string;

  @Column({
    length: 500,
    nullable: true,
    comment: 'URL de la imagen principal de la publicación',
  })
  imageUrl?: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @CreateDateColumn({
    comment: 'Fecha de creación de la publicación',
  })
  createdAt: Date;

  @UpdateDateColumn({
    comment: 'Fecha de última actualización de la publicación',
  })
  updatedAt: Date;

  /**
   * Verifica si la publicación está publicada
   */
  isPublished(): boolean {
    return this.status === PublicationStatus.PUBLISHED;
  }

  /**
   * Verifica si la publicación está en borrador
   */
  isDraft(): boolean {
    return this.status === PublicationStatus.DRAFT;
  }

  /**
   * Verifica si el usuario es el autor de la publicación
   */
  isAuthor(userId: string): boolean {
    return this.authorId === userId;
  }
}

