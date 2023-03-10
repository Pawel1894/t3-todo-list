import { type Task } from "@prisma/client";
import React from "react";
import TaskDisplay from "~/components/Task";
import TaskSummary from "./TaskSummary";

type Props = {
  tasks: Task[] | undefined;
  refetchTasks: () => void;
};

export default function TasksCard({ tasks, refetchTasks }: Props) {
  return (
    <div className="mt-4 rounded-md bg-white  shadow-md">
      {tasks ? (
        <>
          {tasks.map((task) => (
            <TaskDisplay
              refetchTasks={refetchTasks}
              key={task.id}
              task={task}
            />
          ))}
          <TaskSummary
            count={tasks.filter((task) => task.isCompleted).length}
            refetchTasks={refetchTasks}
          />
        </>
      ) : (
        <span>Add your first task!</span>
      )}
    </div>
  );
}
