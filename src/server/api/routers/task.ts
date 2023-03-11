import { createTRPCRouter, protectedProcedure } from "./../trpc";
import { z } from "zod";
import { FiltersEnum } from "~/types/enums";

export const taskRouter = createTRPCRouter({
  getTasks: protectedProcedure.input(FiltersEnum).query(({ ctx, input }) => {
    return ctx.prisma.task.findMany({
      where: {
        userId: ctx.session.user.id,
        AND:
          input === "All"
            ? {}
            : {
                isCompleted: input === "Active" ? false : true,
              },
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
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.update({
        where: {
          id_position: { id: input.id, position: input.pos },
        },
        data: {
          isCompleted: input.value,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        pos: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.delete({
        where: {
          id_position: { id: input.id, position: input.pos },
        },
      });
    }),
  deleteCompleted: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.task.deleteMany({
      where: {
        userId: ctx.session.user.id,
        AND: {
          isCompleted: true,
        },
      },
    });
  }),
});
