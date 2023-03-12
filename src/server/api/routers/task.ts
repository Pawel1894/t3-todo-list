import { type PrismaClient } from "@prisma/client";
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
      orderBy: {
        position: "asc",
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
    .mutation(async ({ ctx, input }) => {
      // for react-beautiful-dnd
      await decrementPositions(
        ctx.prisma,
        ctx.session.user.id,
        input.pos,
        input.id
      );

      return ctx.prisma.task.delete({
        where: {
          id_position: { id: input.id, position: input.pos },
        },
      });
    }),
  deleteCompleted: protectedProcedure.mutation(async ({ ctx }) => {
    const tasks = await ctx.prisma.task.findMany({
      where: {
        userId: ctx.session.user.id,
        AND: {
          isCompleted: true,
        },
      },
      orderBy: {
        position: "asc",
      },
    });
    // for react-beautiful-dnd
    for await (const task of tasks) {
      await decrementPositions(
        ctx.prisma,
        ctx.session.user.id,
        task.position,
        task.id
      );
    }

    return ctx.prisma.task.deleteMany({
      where: {
        userId: ctx.session.user.id,
        AND: {
          isCompleted: true,
        },
      },
    });
  }),
  switchPositions: protectedProcedure
    .input(
      z.object({
        sourcePos: z.number(),
        sourceId: z.string(),
        destPos: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.sourcePos < input.destPos) {
        await ctx.prisma.task.updateMany({
          where: {
            position: {
              lte: input.destPos,
              gt: input.sourcePos,
            },
            AND: {
              id: {
                not: input.sourceId,
              },
              AND: {
                userId: ctx.session.user.id,
              },
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });
      } else {
        await ctx.prisma.task.updateMany({
          where: {
            position: {
              gte: input.destPos,
              lt: input.sourcePos,
            },
            AND: {
              id: {
                not: input.sourceId,
              },
              AND: {
                userId: ctx.session.user.id,
              },
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        });
      }

      return ctx.prisma.task.update({
        where: {
          id_position: { id: input.sourceId, position: input.sourcePos },
        },
        data: {
          position: input.destPos,
        },
      });
    }),
});

async function decrementPositions(
  prisma: PrismaClient,
  userId: string,
  position: number,
  id: string
) {
  await prisma.task.updateMany({
    where: {
      userId: userId,
      AND: {
        position: {
          gte: position,
        },
        AND: {
          id: {
            not: id,
          },
        },
      },
    },
    data: {
      position: {
        decrement: 1,
      },
    },
  });
}
