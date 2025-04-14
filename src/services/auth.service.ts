import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import config from '../config';
import { AuthResponse } from '../types/auth';
import { Roles } from '@prisma/client';

export const AuthService = {
  async register(
    email: string,
    password: string,
    name: string,
    phone?: string
  ): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        roles: [Roles.USER, Roles.INVESTIGATOR, Roles.REQUESTER],
      },
    });

    const token = jwt.sign({ userId: user.id }, config.jwtSecret);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };
  },

  async updateUserInfo(id: string, updateData: { name?: string; email?: string; phone?: string }) {
    const existingUser = await prisma.user.findUnique({ where: { id: id } });
    if (!existingUser) {
      throw new Error('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
        phone: true
      }
    });

    return updatedUser;
  },

  
};