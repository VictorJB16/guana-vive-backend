import {
  Controller,
  Get,
  Query,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards';
import { Roles } from '../publications/decorators';
import { RolesGuard } from '../publications/guards';
import { UserRole } from '../users/types/user.enum';
import type {
  AdminDashboardResponse,
  AdminUserStatsResponse,
  AdminPublicationStatsResponse,
  AdminCategoryStatsResponse,
  AdminSubscriptionStatsResponse,
  AdminRecentActivitiesResponse,
} from './types';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}

  /**
   * Obtener estadísticas generales del dashboard
   * GET /admin/dashboard/stats
   */
  @Get('dashboard/stats')
  @HttpCode(HttpStatus.OK)
  async getDashboardStats(): Promise<AdminDashboardResponse> {
    this.logger.log('Admin requesting dashboard statistics');

    const stats = await this.adminService.getDashboardStats();

    return {
      success: true,
      data: stats,
    };
  }

  /**
   * Obtener estadísticas detalladas de usuarios
   * GET /admin/users/stats
   */
  @Get('users/stats')
  @HttpCode(HttpStatus.OK)
  async getUserStats(): Promise<AdminUserStatsResponse> {
    this.logger.log('Admin requesting user statistics');

    const stats = await this.adminService.getUserStats();

    return {
      success: true,
      data: stats,
    };
  }

  /**
   * Obtener estadísticas detalladas de publicaciones
   * GET /admin/publications/stats
   */
  @Get('publications/stats')
  @HttpCode(HttpStatus.OK)
  async getPublicationStats(): Promise<AdminPublicationStatsResponse> {
    this.logger.log('Admin requesting publication statistics');

    const stats = await this.adminService.getPublicationStats();

    return {
      success: true,
      data: stats,
    };
  }

  /**
   * Obtener estadísticas de categorías con conteo de publicaciones
   * GET /admin/categories/stats
   */
  @Get('categories/stats')
  @HttpCode(HttpStatus.OK)
  async getCategoryStats(): Promise<AdminCategoryStatsResponse> {
    this.logger.log('Admin requesting category statistics');

    const stats = await this.adminService.getCategoryStats();

    return {
      success: true,
      data: stats,
    };
  }

  /**
   * Obtener estadísticas de suscripciones
   * GET /admin/subscriptions/stats
   */
  @Get('subscriptions/stats')
  @HttpCode(HttpStatus.OK)
  async getSubscriptionStats(): Promise<AdminSubscriptionStatsResponse> {
    this.logger.log('Admin requesting subscription statistics');

    const stats = await this.adminService.getSubscriptionStats();

    return {
      success: true,
      data: stats,
    };
  }

  /**
   * Obtener actividades recientes del sistema
   * GET /admin/activities/recent
   */
  @Get('activities/recent')
  @HttpCode(HttpStatus.OK)
  async getRecentActivities(
    @Query('limit') limit: string = '10',
    @Query('page') page: string = '1',
  ): Promise<AdminRecentActivitiesResponse> {
    this.logger.log('Admin requesting recent activities');

    const limitNum = parseInt(limit, 10) || 10;
    const pageNum = parseInt(page, 10) || 1;

    const result = await this.adminService.getRecentActivities(
      limitNum,
      pageNum,
    );

    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  }
}
