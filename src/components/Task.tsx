import { type Task } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { api } from "~/utils/api";

type Props = {
  task: Task;
  refetchTasks: () => void;
};

export default function Task({ task, refetchTasks }: Props) {
  const taskMutation = api.task.updateCompleted.useMutation({
    onSuccess: () => {
      refetchTasks();
    },
  });

  function toggleCompleted() {
    taskMutation.mutate({
      id: task.id,
      pos: task.position,
      value: !task.isCompleted,
    });
  }

  return (
    <div className="flex items-center gap-x-3 border-b border-light-200 px-5 py-4">
      <button
        className={`relative flex h-5 w-5 items-center justify-center rounded-full  ${
          task.isCompleted
            ? "bg-gradient-to-b from-primary-200 to-primary-300"
            : "border border-light-200"
        }`}
        onClick={toggleCompleted}
      >
        <Image
          src={"/images/icon-check.svg"}
          width={12}
          height={6}
          alt="task is marked as completed"
        />
      </button>
      <span
        className={`text-sm ${
          task.isCompleted ? "text-light-300 line-through" : ""
        }`}
      >
        {task.text}
      </span>
      <button className="ml-auto">
        <Image
          src={"/images/icon-cross.svg"}
          alt="delete task"
          width={12}
          height={12}
        />
      </button>
    </div>
  );
}
