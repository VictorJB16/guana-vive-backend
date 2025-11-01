import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import {
  SubscriptionPlan,
  SubscriptionStatus,
} from '../entities/subscription.entity';

export class CreateSubscriptionDto {
  @IsUUID()
  userId: string;

  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;
}
