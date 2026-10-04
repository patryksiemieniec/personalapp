import { z } from 'zod';

export const editTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().max(5000).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  dueAt: z.string().optional(),
});

export type EditTaskFormValues = z.infer<typeof editTaskSchema>;
