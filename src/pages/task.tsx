import superjson from "superjson";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "react-beautiful-dnd";
import FilterBtn from "~/components/FilterBtn";
import LoadIndicator from "~/components/LoadIndicator";
import TaskInput from "~/components/TaskInput";
import TaskSummary from "~/components/TaskSummary";
import { FiltersEnum } from "~/types/enums";
import { api } from "~/utils/api";
import TaskDisplay from "~/components/Task";
import { useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createTRPCContext } from "~/server/api/trpc";
import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { type Task } from "@prisma/client";

export default function Task({ init }: { init: Task[] }) {
  const router = useRouter();
  const { data: sessionData, status: sessionStatus } = useSession();
  const [activeFilter, setActiveFilter] = useState<FiltersEnum>(
    FiltersEnum.Enum.All
  );
  const queryClient = useQueryClient();
  const [mutatingLoader, setMutatingLoader] = useState(false);

  const switchPositions = api.task.switchPositions.useMutation({
    onMutate: async ({ destPos, sourceId, sourcePos }) => {
      if (!data) return {};

      await queryClient.cancelQueries({
        queryKey: [
          ["task", "getTasks"],
          { input: activeFilter, type: "query" },
        ],
      });

      // Snapshot the previous value
      const prevData = queryClient.getQueryData([
        ["task", "getTasks"],
        { input: activeFilter, type: "query" },
      ]);

      if (sourcePos < destPos) {
        data.forEach((task) => {
          if (
            task.position <= destPos &&
            task.position > sourcePos &&
            task.id !== sourceId
          ) {
            task.position--;
          }
        });

        const srcTask = data.splice(sourcePos, 1);
        if (srcTask[0]) {
          srcTask[0].position = destPos;
          data.splice(destPos, 0, srcTask[0]);
        }
      } else {
        data.forEach((task) => {
          if (
            task.position >= destPos &&
            task.position < sourcePos &&
            task.id !== sourceId
          ) {
            task.position++;
          }
        });

        const srcTask = data.splice(sourcePos, 1);
        if (srcTask[0]) {
          srcTask[0].position = destPos;
          data.splice(destPos, 0, srcTask[0]);
        }
      }

      queryClient.setQueryData(
        [["task", "getTasks"], { input: activeFilter, type: "query" }],
        data
      );

      return { prevData };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["todos"], context?.prevData);
    },
  });

  function onDragEnd(e: DropResult) {
    const { destination, source, draggableId } = e;

    if (!destination || !data) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    switchPositions.mutate({
      destPos: destination.index,
      sourceId: draggableId,
      sourcePos: source.index,
    });
  }

  const {
    data,
    isLoading,
    isRefetching,
    refetch: refetchTasks,
  } = api.task.getTasks.useQuery(activeFilter, {
    enabled: sessionData?.user !== undefined,
    refetchOnWindowFocus: false,
    initialData: init,
  });
  if (sessionStatus === "loading") {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <LoadIndicator />
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    void router.push("/");
    return null;
  }

  return (
    <>
      <Head>
        <title>T3 todo list</title>
        <meta name="description" content="Created using t3 stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="mx-auto max-w-xl -translate-y-[5.75rem] px-6 sm:px-0 md:-translate-y-32">
          <TaskInput
            refetchTasks={refetchTasks}
            setMutatingLoader={setMutatingLoader}
          />
          <Droppable droppableId={"tasks"}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                id="viewport"
                className="relative mt-4 h-[45vh] overflow-y-auto overflow-x-hidden rounded-t-md bg-white drop-shadow-lg dark:bg-dark-200 dark:text-white"
              >
                {isLoading || mutatingLoader || isRefetching ? (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <LoadIndicator />
                  </div>
                ) : data ? (
                  data.map((task, index) => (
                    <TaskDisplay
                      refetchTasks={refetchTasks}
                      key={task.id}
                      task={task}
                      index={index}
                      setMutatingLoader={setMutatingLoader}
                      activeFilter={activeFilter}
                    />
                  ))
                ) : (
                  <span>Add your first task!</span>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="relative z-10">
            <TaskSummary
              count={
                data
                  ? data.filter((task) => !task.isCompleted).length
                  : "unknown"
              }
              refetchTasks={refetchTasks}
              setMutatingLoader={setMutatingLoader}
            />
            <div className="left-1/2 mt-4 flex items-center justify-center gap-x-5 rounded-md bg-white py-4 font-bold text-light-400 shadow-md dark:bg-dark-200 md:absolute md:top-1/2 md:m-0 md:-translate-y-1/2 md:-translate-x-1/2 md:bg-transparent md:p-0 md:shadow-none md:dark:bg-transparent">
              <FilterBtn
                key={FiltersEnum.Enum.All}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                label={"All"}
                type={FiltersEnum.Enum.All}
              />
              <FilterBtn
                key={FiltersEnum.Enum.Active}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                label={"Active"}
                type={FiltersEnum.Enum.Active}
              />
              <FilterBtn
                key={FiltersEnum.Enum.Completed}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                label={"Completed"}
                type={FiltersEnum.Enum.Completed}
              />
            </div>
          </div>
          <div className="mt-10 flex items-center justify-between">
            <p className="text-light-400">Drag and drop to reorder list</p>
            <button
              className="text-light-400 underline"
              onClick={() => void signOut()}
            >
              sign out
            </button>
          </div>
        </div>
      </DragDropContext>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  // const session = await getServerSession();
  // session?.user.id;
  // const data = await getAllData(session?.user.id, "Active")
  // return { props: { init: data } };

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createTRPCContext({
      req: req,
      res: res,
    }),
    transformer: superjson,
  });

  const response = await ssg.task.getTasks.fetch("All");

  return { props: { init: response } };
};
