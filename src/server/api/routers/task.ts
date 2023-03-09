import { createTRPCRouter, protectedProcedure } from "./../trpc";
import { z } from "zod";

export const taskRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  create: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const tasksCount = await ctx.prisma.task.count({
        where: {
          userId: ctx.session.user.id,
        },
      });

      return ctx.prisma.task.create({
        data: {
          text: input,
          userId: ctx.session.user.id,
          position: tasksCount,
        },
      });
    }),
});
