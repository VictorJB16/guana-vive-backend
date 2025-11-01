import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Publication } from '../../publications/entities/publication.entity';

@Entity('categories')
@Index(['name'], { unique: true })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    length: 100,
    comment: 'Nombre único de la categoría',
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Descripción de la categoría',
  })
  description?: string;

  @Column({
    default: true,
    comment: 'Estado activo/inactivo de la categoría',
  })
  isActive: boolean;

  @OneToMany(() => Publication, (publication) => publication.category)
  publications: Publication[];

  @CreateDateColumn({
    comment: 'Fecha de creación de la categoría',
  })
  createdAt: Date;

  @UpdateDateColumn({
    comment: 'Fecha de última actualización',
  })
  updatedAt: Date;
}
