import { z } from 'zod';
import { Roles } from '@prisma/client';

export const registerSchema = z.object({
  email: z.string().email().min(5).max(255),
  password: z.string().min(4).max(100),
  name: z.string().min(2).max(100),
  phone: z.string().min(7).max(15).optional(),
});

export const loginSchema = registerSchema.pick({ email: true, password: true });

export const updateUserInfo = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  phone: z.string().min(7).max(15).optional(),
});

export const addRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.nativeEnum(Roles),
});

export const removeRoleSchema = addRoleSchema;
