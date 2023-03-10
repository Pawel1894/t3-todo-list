import { type Task } from "@prisma/client";
import React from "react";
import TaskDisplay from "~/components/Task";

type Props = {
  tasks: Task[] | undefined;
};

export default function TasksCard({ tasks }: Props) {
  return (
    <div className="mt-4 rounded-md bg-white py-4 px-5 shadow-md">
      {tasks ? (
        tasks.map((task) => <TaskDisplay key={task.id} task={task} />)
      ) : (
        <span>Add your first task!</span>
      )}
    </div>
  );
}
