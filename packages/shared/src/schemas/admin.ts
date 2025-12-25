import { z } from 'zod';

export const AdminStatsResponseSchema = z.object({
  totalUsers: z.number(),
  totalApps: z.number(),
  totalDevices: z.number(),
  totalSessions: z.number(),
  totalEvents: z.number(),
});

export const AdminUserSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  appCount: z.number(),
  deviceCount: z.number(),
  createdAt: z.string().datetime(),
});

export const AdminUsersResponseSchema = z.object({
  users: z.array(AdminUserSchema),
});

export type AdminStatsResponse = z.infer<typeof AdminStatsResponseSchema>;
export type AdminUser = z.infer<typeof AdminUserSchema>;
export type AdminUsersResponse = z.infer<typeof AdminUsersResponseSchema>;
