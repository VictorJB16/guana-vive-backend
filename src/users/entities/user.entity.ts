import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../types/user.enum';
import { USER_CONSTANTS } from '../types/user.constants';

@Entity('users')
@Index(['isActive'])
@Index(['role'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    length: 100,
    comment: 'Email único del usuario',
  })
  email: string;

  @Column({
    length: 255,
    comment: 'Contraseña encriptada del usuario',
  })
  password: string;

  @Column({
    length: USER_CONSTANTS.NAME.MAX_LENGTH,
    comment: 'Nombre del usuario',
  })
  firstName: string;

  @Column({
    length: USER_CONSTANTS.NAME.MAX_LENGTH,
    comment: 'Apellido del usuario',
  })
  lastName: string;

  @Column({
    default: true,
    comment: 'Estado activo/inactivo del usuario',
  })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    comment: 'Rol del usuario en el sistema',
  })
  role: UserRole;

  @CreateDateColumn({
    comment: 'Fecha de creación del registro',
  })
  createdAt: Date;

  @UpdateDateColumn({
    comment: 'Fecha de última actualización del registro',
  })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password && !this.isPasswordHashed()) {
      const saltRounds = USER_CONSTANTS.PASSWORD.SALT_ROUNDS;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    if (!plainPassword || !this.password) {
      return false;
    }
    return bcrypt.compare(plainPassword, this.password);
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isUser(): boolean {
    return this.role === UserRole.USER;
  }

  toSafeObject(): Omit<User, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = this;
    return safeUser as Omit<User, 'password'>;
  }

  private isPasswordHashed(): boolean {
    // Verificar si la contraseña ya está hasheada (bcrypt genera hashes de 60 caracteres)
    return this.password?.length === 60 && this.password.startsWith('$2');
  }
}
