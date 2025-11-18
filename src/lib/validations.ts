import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const createTransactionSchema = z.object({
  amount: z.union([
    z.number().positive('Amount must be a positive number'),
    z.string().transform(val => {
      const num = parseFloat(val);
      if (isNaN(num)) throw new Error('Amount must be a valid number');
      if (num <= 0) throw new Error('Amount must be positive');
      return num;
    })
  ]).pipe(z.number().positive('Amount must be positive')),
  description: z.string().optional(),
  date: z.union([
    z.date(),
    z.string().transform(val => {
      const date = new Date(val);
      if (isNaN(date.getTime())) throw new Error('Invalid date format');
      return date;
    })
  ]).pipe(z.date()),
  type: z.enum(['income', 'expense', 'transfer']).default('expense'),
  categoryId: z.string().optional().nullable(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').min(2, 'Category name must be at least 2 characters').trim(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format. Use hex color like #3B82F6'),
  icon: z.string().optional(),
  type: z.enum(['income', 'expense']).optional().default('expense'),
});

export const createBudgetSchema = z.object({
  amount: z.union([
    z.number().positive('Budget amount must be positive'),
    z.string().transform(val => parseFloat(val))
  ]).pipe(z.number().positive('Budget amount must be positive')),
  categoryId: z.string().min(1, 'Category is required'),
  month: z.union([
    z.number().min(1).max(12),
    z.string().transform(val => parseInt(val, 10))
  ]).pipe(z.number().min(1).max(12)),
  year: z.union([
    z.number().min(2000),
    z.string().transform(val => parseInt(val, 10))
  ]).pipe(z.number().min(2000)),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
