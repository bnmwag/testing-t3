import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const projectsRouter = createTRPCRouter({
  getAllByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.prisma.project.findMany({
        where: {
          userId: input.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          tasks: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        take: 5,
      })
    ),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.prisma.project.findUnique({
        where: {
          id: input.id,
        },
        include: {
          tasks: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      })
    ),

  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        description: z.string(),
        name: z.string(),
        dueDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          userId: input.userId,
          dueDate: input.dueDate,
        },
      });

      return project;
    }),
});
