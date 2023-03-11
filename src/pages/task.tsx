import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import FilterBtn from "~/components/FilterBtn";
import LoadIndicator from "~/components/LoadIndicator";
import TaskInput from "~/components/TaskInput";
import TaskSummary from "~/components/TaskSummary";
import { FiltersEnum } from "~/types/enums";
import { api } from "~/utils/api";
import TaskDisplay from "~/components/Task";

export default function Task() {
  const router = useRouter();
  const { data: sessionData, status: sessionStatus } = useSession();
  const [activeFilter, setActiveFilter] = useState<FiltersEnum>(
    FiltersEnum.Enum.All
  );

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
    <div className="mx-auto max-w-xl -translate-y-[5.75rem] px-6 sm:px-0">
      <TaskInput refetchTasks={refetchTasks} />
      <Droppable droppableId={"tasks"}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            id="viewport"
            className="relative mt-4 h-[45vh] overflow-y-auto overflow-x-hidden rounded-t-md bg-white shadow-lg"
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
      <div>
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
  );
}
