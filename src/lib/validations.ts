import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
  date: z.coerce.date(),
  type: z.enum(['income', 'expense', 'transfer']),
  categoryId: z.string().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
  icon: z.string().optional(),
  type: z.enum(['income', 'expense']).optional().default('expense'),
});

export const createBudgetSchema = z.object({
  amount: z.number().positive('Budget amount must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
