// User repository - database access layer
import { prisma } from '../utils/prisma';
import type { User } from '@prisma/client';

export class UserRepository {
  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create new user
   */
  async create(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  /**
   * Update user
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}


