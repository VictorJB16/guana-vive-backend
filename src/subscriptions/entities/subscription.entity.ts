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

export enum SubscriptionPlan {
  BASIC = 'Básico',
  PREMIUM = 'Premium',
  PLUS = 'Plus',
}

export enum SubscriptionStatus {
  ACTIVE = 'Activo',
  INACTIVE = 'Inactivo',
  CANCELLED = 'Cancelado',
}

@Entity('subscriptions')
@Index(['status'])
@Index(['plan'])
@Index(['userId'])
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    comment: 'ID del usuario suscrito',
  })
  userId: string;

  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.BASIC,
    comment: 'Plan de suscripción',
  })
  plan: SubscriptionPlan;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
    comment: 'Estado de la suscripción',
  })
  status: SubscriptionStatus;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha de último acceso',
  })
  lastAccess?: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn({
    comment: 'Fecha de inicio de la suscripción',
  })
  createdAt: Date;

  @UpdateDateColumn({
    comment: 'Fecha de última actualización',
  })
  updatedAt: Date;

  isActive(): boolean {
    return this.status === SubscriptionStatus.ACTIVE;
  }
}
