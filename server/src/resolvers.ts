
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    tasks: async (_parent: unknown, args: { status?: string }) => {
      return await prisma.task.findMany({
        where: args.status ? { status: args.status } : undefined,
        orderBy: { createdAt: 'desc' },
      });
    },

    task: async (_parent: unknown, args: { id: string }) => {
      return await prisma.task.findUnique({
        where: { id: args.id },
      });
    },
  },

  Mutation: {
    createTask: async (
      _parent: unknown,
      args: { input: { title: string; description?: string; priority?: string } }
    ) => {
      return await prisma.task.create({
        data: {
          title: args.input.title,
          description: args.input.description,
          priority: args.input.priority || 'MEDIUM',
          status: 'TODO',
        },
      });
    },

    updateTask: async (
      _parent: unknown,
      args: {
        id: string;
        input: {
          title?: string;
          description?: string;
          status?: string;
          priority?: string;
        };
      }
    ) => {
      return await prisma.task.update({
        where: { id: args.id },
        data: args.input,
      });
    },

    deleteTask: async (_parent: unknown, args: { id: string }) => {
      try {
        await prisma.task.delete({
          where: { id: args.id },
        });
        return true;
      } catch {
        return false;
      }
    },
  },
};