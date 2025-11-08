import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Publication } from '../publications/entities/publication.entity';
import { Category } from '../categories/entities/category.entity';
import {
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
} from '../subscriptions/entities/subscription.entity';
import { UserRole } from '../users/types/user.enum';
import { PublicationStatus } from '../publications/types/publication.enum';
import type {
  DashboardStats,
  UserStats,
  PublicationStats,
  CategoryStats,
  SubscriptionStats,
  RecentActivity,
} from './types';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  /**
   * Obtener estadísticas generales del dashboard
   */
  async getDashboardStats(): Promise<DashboardStats> {
    this.logger.log('Fetching dashboard statistics');

    // Usuarios
    const [totalUsers, activeUsers] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { isActive: true } }),
    ]);
    const inactiveUsers = totalUsers - activeUsers;

    // Publicaciones
    const [
      totalPublications,
      publishedPublications,
      pendingPublications,
      archivedPublications,
      draftPublications,
    ] = await Promise.all([
      this.publicationRepository.count(),
      this.publicationRepository.count({
        where: { status: PublicationStatus.PUBLISHED },
      }),
      this.publicationRepository.count({
        where: { status: PublicationStatus.PENDING_REVIEW },
      }),
      this.publicationRepository.count({
        where: { status: PublicationStatus.ARCHIVED },
      }),
      this.publicationRepository.count({
        where: { status: PublicationStatus.DRAFT },
      }),
    ]);

    // Categorías
    const totalCategories = await this.categoryRepository.count({
      where: { isActive: true },
    });

    // Suscripciones
    const [totalSubscriptions, activeSubscriptions] = await Promise.all([
      this.subscriptionRepository.count(),
      this.subscriptionRepository.count({
        where: { status: SubscriptionStatus.ACTIVE },
      }),
    ]);
    const inactiveSubscriptions = totalSubscriptions - activeSubscriptions;

    // Cálculo de ingresos (simplificado)
    const subscriptions = await this.subscriptionRepository.find({
      where: { status: SubscriptionStatus.ACTIVE },
    });

    const planPrices = {
      [SubscriptionPlan.BASIC]: 10,
      [SubscriptionPlan.PREMIUM]: 25,
      [SubscriptionPlan.PLUS]: 50,
    };

    const revenue = subscriptions.reduce((total, sub) => {
      return total + (planPrices[sub.plan] || 0);
    }, 0);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalPublications,
      publishedPublications,
      pendingPublications,
      archivedPublications,
      draftPublications,
      totalCategories,
      totalSubscriptions,
      activeSubscriptions,
      inactiveSubscriptions,
      revenue,
    };
  }

  /**
   * Obtener estadísticas detalladas de usuarios
   */
  async getUserStats(): Promise<UserStats> {
    this.logger.log('Fetching user statistics');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const [
      totalUsers,
      adminUsers,
      regularUsers,
      activeUsers,
      inactiveUsers,
      usersCreatedToday,
      usersCreatedThisWeek,
      usersCreatedThisMonth,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { role: UserRole.ADMIN } }),
      this.userRepository.count({ where: { role: UserRole.USER } }),
      this.userRepository.count({ where: { isActive: true } }),
      this.userRepository.count({ where: { isActive: false } }),
      this.userRepository.count({
        where: { createdAt: MoreThanOrEqual(today) },
      }),
      this.userRepository.count({
        where: { createdAt: MoreThanOrEqual(weekAgo) },
      }),
      this.userRepository.count({
        where: { createdAt: MoreThanOrEqual(monthAgo) },
      }),
    ]);

    return {
      totalUsers,
      adminUsers,
      regularUsers,
      activeUsers,
      inactiveUsers,
      usersCreatedToday,
      usersCreatedThisWeek,
      usersCreatedThisMonth,
    };
  }

  /**
   * Obtener estadísticas detalladas de publicaciones
   */
  async getPublicationStats(): Promise<PublicationStats> {
    this.logger.log('Fetching publication statistics');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const [
      totalPublications,
      published,
      pendingReview,
      draft,
      archived,
      publicationsCreatedToday,
      publicationsCreatedThisWeek,
      publicationsCreatedThisMonth,
    ] = await Promise.all([
      this.publicationRepository.count(),
      this.publicationRepository.count({
        where: { status: PublicationStatus.PUBLISHED },
      }),
      this.publicationRepository.count({
        where: { status: PublicationStatus.PENDING_REVIEW },
      }),
      this.publicationRepository.count({
        where: { status: PublicationStatus.DRAFT },
      }),
      this.publicationRepository.count({
        where: { status: PublicationStatus.ARCHIVED },
      }),
      this.publicationRepository.count({
        where: { createdAt: MoreThanOrEqual(today) },
      }),
      this.publicationRepository.count({
        where: { createdAt: MoreThanOrEqual(weekAgo) },
      }),
      this.publicationRepository.count({
        where: { createdAt: MoreThanOrEqual(monthAgo) },
      }),
    ]);

    return {
      totalPublications,
      published,
      pendingReview,
      draft,
      archived,
      publicationsCreatedToday,
      publicationsCreatedThisWeek,
      publicationsCreatedThisMonth,
    };
  }

  /**
   * Obtener estadísticas de categorías con conteo de publicaciones
   */
  async getCategoryStats(): Promise<CategoryStats[]> {
    this.logger.log('Fetching category statistics');

    const categories = await this.categoryRepository.find({
      relations: ['publications'],
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      publicationCount: category.publications?.length || 0,
      isActive: category.isActive,
      createdAt: category.createdAt,
    }));
  }

  /**
   * Obtener estadísticas de suscripciones
   */
  async getSubscriptionStats(): Promise<SubscriptionStats> {
    this.logger.log('Fetching subscription statistics');

    const [
      totalSubscriptions,
      basicPlan,
      premiumPlan,
      plusPlan,
      activeSubscriptions,
      inactiveSubscriptions,
      cancelledSubscriptions,
    ] = await Promise.all([
      this.subscriptionRepository.count(),
      this.subscriptionRepository.count({
        where: { plan: SubscriptionPlan.BASIC },
      }),
      this.subscriptionRepository.count({
        where: { plan: SubscriptionPlan.PREMIUM },
      }),
      this.subscriptionRepository.count({
        where: { plan: SubscriptionPlan.PLUS },
      }),
      this.subscriptionRepository.count({
        where: { status: SubscriptionStatus.ACTIVE },
      }),
      this.subscriptionRepository.count({
        where: { status: SubscriptionStatus.INACTIVE },
      }),
      this.subscriptionRepository.count({
        where: { status: SubscriptionStatus.CANCELLED },
      }),
    ]);

    return {
      totalSubscriptions,
      basicPlan,
      premiumPlan,
      plusPlan,
      activeSubscriptions,
      inactiveSubscriptions,
      cancelledSubscriptions,
    };
  }

  /**
   * Obtener actividades recientes del sistema
   */
  async getRecentActivities(
    limit: number = 10,
    page: number = 1,
  ): Promise<{ data: RecentActivity[]; meta: any }> {
    this.logger.log(
      `Fetching recent activities (limit: ${limit}, page: ${page})`,
    );

    const activities: RecentActivity[] = [];
    const skip = (page - 1) * limit;

    // Obtener últimas publicaciones publicadas y archivadas
    const recentPublications = await this.publicationRepository.find({
      where: [
        { status: PublicationStatus.PUBLISHED },
        { status: PublicationStatus.ARCHIVED },
      ],
      order: { updatedAt: 'DESC' },
      take: limit,
      relations: ['author'],
    });

    recentPublications.forEach((pub) => {
      const activityType =
        pub.status === PublicationStatus.PUBLISHED
          ? 'publication_approved'
          : 'publication_rejected';

      activities.push({
        id: `pub-${pub.id}`,
        type: activityType as any,
        title: pub.title,
        description: `Publicación "${pub.title}" fue ${pub.status === PublicationStatus.PUBLISHED ? 'publicada' : 'archivada'}`,
        entityId: pub.id,
        entityType: 'publication',
        createdAt: pub.updatedAt,
        metadata: {
          authorName: pub.author
            ? `${pub.author.firstName} ${pub.author.lastName}`
            : 'Usuario desconocido',
          status: pub.status,
        },
      });
    });

    // Obtener últimos usuarios creados
    const recentUsers = await this.userRepository.find({
      order: { createdAt: 'DESC' },
      take: Math.floor(limit / 2),
    });

    recentUsers.forEach((user) => {
      activities.push({
        id: `user-${user.id}`,
        type: 'user_created',
        title: `${user.firstName} ${user.lastName}`,
        description: `Nuevo usuario registrado: ${user.email}`,
        entityId: user.id,
        entityType: 'user',
        createdAt: user.createdAt,
        metadata: {
          email: user.email,
          role: user.role,
        },
      });
    });

    // Ordenar por fecha
    activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Paginar
    const paginatedActivities = activities.slice(skip, skip + limit);
    const total = activities.length;

    return {
      data: paginatedActivities,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }
}
