import { useSession } from "next-auth/react";
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

export default function Task() {
  const router = useRouter();
  const { data: sessionData, status: sessionStatus } = useSession();
  const [activeFilter, setActiveFilter] = useState<FiltersEnum>(
    FiltersEnum.Enum.All
  );
  const queryClient = useQueryClient();

  const switchPositions = api.task.switchPositions.useMutation({
    onMutate: ({ destPos, sourceId, sourcePos }) => {
      if (!data) return {};

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
        [["task", "getTasks"], { input: "All", type: "query" }],
        data
      );
    },
    onSettled: async () => {
      await refetchTasks();
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

  // TODO: change to ssr?
  const {
    data,
    isLoading,
    refetch: refetchTasks,
  } = api.task.getTasks.useQuery(activeFilter, {
    enabled: sessionData?.user !== undefined,
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
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="mx-auto max-w-xl -translate-y-[5.75rem] px-6 sm:px-0">
        <TaskInput refetchTasks={refetchTasks} />
        <Droppable droppableId={"tasks"}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              id="viewport"
              className="relative mt-4 h-[45vh] overflow-y-auto overflow-x-hidden rounded-t-md bg-white drop-shadow-lg"
            >
              {isLoading ? (
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
                  />
                ))
              ) : (
                <span>Add your first task!</span>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="sticky z-10">
          <TaskSummary
            count={
              data ? data.filter((task) => !task.isCompleted).length : "unknown"
            }
            refetchTasks={refetchTasks}
          />
          <div className="mt-4 flex items-center justify-center gap-x-5 rounded-md bg-white py-4 font-bold text-light-400 shadow-md">
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
          <p className="mt-10 text-center text-light-400">
            Drag and drop to reorder list
          </p>
        </div>
      </div>
    </DragDropContext>
  );
}
