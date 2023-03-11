import { type Task } from "@prisma/client";
import { type QueryObserverResult } from "@tanstack/react-query";
import React from "react";
import TaskDisplay from "~/components/Task";
import LoadIndicator from "./LoadIndicator";

type Props = {
  tasks: Task[] | undefined;
  refetchTasks: () => Promise<QueryObserverResult<Task[]>>;
  isLoading: boolean;
};

export default function TasksCard({ tasks, refetchTasks, isLoading }: Props) {
  return (
    <div className="relative mt-4 h-[45vh] overflow-y-auto overflow-x-hidden rounded-t-md bg-white shadow-lg">
      {isLoading ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <LoadIndicator />
        </div>
      ) : tasks ? (
        tasks.map((task) => (
          <TaskDisplay refetchTasks={refetchTasks} key={task.id} task={task} />
        ))
      ) : (
        <span>Add your first task!</span>
      )}
    </div>
  );
}
