export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalPublications: number;
  publishedPublications: number;
  pendingPublications: number;
  archivedPublications: number;
  draftPublications: number;
  totalCategories: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  inactiveSubscriptions: number;
  revenue: number;
}

export interface UserStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersCreatedToday: number;
  usersCreatedThisWeek: number;
  usersCreatedThisMonth: number;
}

export interface PublicationStats {
  totalPublications: number;
  published: number;
  pendingReview: number;
  draft: number;
  archived: number;
  publicationsCreatedToday: number;
  publicationsCreatedThisWeek: number;
  publicationsCreatedThisMonth: number;
}

export interface CategoryStats {
  id: string;
  name: string;
  description?: string;
  publicationCount: number;
  isActive: boolean;
  createdAt: Date;
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  basicPlan: number;
  premiumPlan: number;
  plusPlan: number;
  activeSubscriptions: number;
  inactiveSubscriptions: number;
  cancelledSubscriptions: number;
}

export interface RecentActivity {
  id: string;
  type:
    | 'publication_approved'
    | 'publication_rejected'
    | 'user_created'
    | 'subscription_created'
    | 'category_created';
  title: string;
  description: string;
  entityId: string;
  entityType: 'publication' | 'user' | 'subscription' | 'category';
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface AdminDashboardResponse {
  success: boolean;
  data: DashboardStats;
}

export interface AdminUserStatsResponse {
  success: boolean;
  data: UserStats;
}

export interface AdminPublicationStatsResponse {
  success: boolean;
  data: PublicationStats;
}

export interface AdminCategoryStatsResponse {
  success: boolean;
  data: CategoryStats[];
}

export interface AdminSubscriptionStatsResponse {
  success: boolean;
  data: SubscriptionStats;
}

export interface AdminRecentActivitiesResponse {
  success: boolean;
  data: RecentActivity[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
