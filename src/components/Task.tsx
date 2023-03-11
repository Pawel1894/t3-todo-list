import { type Task } from "@prisma/client";
import { type QueryObserverResult } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { api } from "~/utils/api";

type Props = {
  task: Task;
  refetchTasks: () => Promise<QueryObserverResult<Task[]>>;
  index: number;
};

export default function Task({ task, refetchTasks, index }: Props) {
  const markAsCompleted = api.task.updateCompleted.useMutation({
    onSuccess: async () => {
      await refetchTasks();
    },
  });

  const deleteTask = api.task.delete.useMutation({
    onSuccess: async () => {
      await refetchTasks();
    },
  });

  function toggleCompleted() {
    markAsCompleted.mutate({
      id: task.id,
      pos: task.position,
      value: !task.isCompleted,
    });
  }

  function onDeleteHandler() {
    deleteTask.mutate({
      id: task.id,
      pos: task.position,
    });
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="!static !left-0 !top-0 flex items-center gap-x-3 border-b border-light-200 px-5 py-4"
          onClick={toggleCompleted}
        >
          <button
            className={`relative flex h-5 w-5 items-center justify-center rounded-full  ${
              task.isCompleted
                ? "bg-gradient-to-b from-primary-200 to-primary-300"
                : "border border-light-200"
            }`}
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
          <button className="ml-auto" onClick={onDeleteHandler}>
            <Image
              src={"/images/icon-cross.svg"}
              alt="delete task"
              width={12}
              height={12}
            />
          </button>
        </div>
      )}
    </Draggable>
  );
}
