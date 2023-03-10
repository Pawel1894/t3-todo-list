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
  updateCompleted: protectedProcedure
    .input(
      z.object({
        value: z.boolean(),
        id: z.string(),
        pos: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.task.update({
        where: {
          id_position: { id: input.id, position: input.pos },
        },
        data: {
          isCompleted: input.value,
        },
      });
    }),
});
