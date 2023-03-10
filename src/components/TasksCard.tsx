import { type Task } from "@prisma/client";
import React from "react";
import TaskDisplay from "~/components/Task";

type Props = {
  tasks: Task[] | undefined;
  refetchTasks: () => void;
};

export default function TasksCard({ tasks, refetchTasks }: Props) {
  return (
    <div className="mt-4 rounded-md bg-white  shadow-md">
      {tasks ? (
        tasks.map((task) => (
          <TaskDisplay refetchTasks={refetchTasks} key={task.id} task={task} />
        ))
      ) : (
        <span>Add your first task!</span>
      )}
    </div>
  );
}
