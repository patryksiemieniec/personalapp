import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title cannot be longer than 200 characters'),
  description: z.string().trim().max(5000, 'Description is too long').optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  dueAt: z.string().optional(),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
