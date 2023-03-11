import { type Task } from "@prisma/client";
import { type QueryObserverResult } from "@tanstack/react-query";
import React from "react";
import TaskDisplay from "~/components/Task";
import LoadIndicator from "./LoadIndicator";
import TaskSummary from "./TaskSummary";

type Props = {
  tasks: Task[] | undefined;
  refetchTasks: () => Promise<QueryObserverResult<Task[]>>;
  isLoading: boolean;
};

export default function TasksCard({ tasks, refetchTasks, isLoading }: Props) {
  return (
    <div className="mt-4 rounded-md bg-white  shadow-lg">
      {/* TODO: center loading */}
      {isLoading ? (
        <LoadIndicator />
      ) : tasks ? (
        <>
          {tasks.map((task) => (
            <TaskDisplay
              refetchTasks={refetchTasks}
              key={task.id}
              task={task}
            />
          ))}
          <TaskSummary
            count={tasks.filter((task) => !task.isCompleted).length}
            refetchTasks={refetchTasks}
          />
        </>
      ) : (
        <span>Add your first task!</span>
      )}
    </div>
  );
}
