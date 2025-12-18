import { z } from 'zod';

export const WaitlistJoinBodySchema = z.object({
  email: z.string().email().min(5).max(254),
});

export const WaitlistJoinResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const WaitlistCountResponseSchema = z.object({
  count: z.number(),
});

export type WaitlistJoinBody = z.infer<typeof WaitlistJoinBodySchema>;
export type WaitlistJoinResponse = z.infer<typeof WaitlistJoinResponseSchema>;
export type WaitlistCountResponse = z.infer<typeof WaitlistCountResponseSchema>;
