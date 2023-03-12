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

export default function Task({ task, refetchTasks }: Props) {
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
    <Draggable draggableId={task.id} index={task.position}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="!left-auto !top-auto flex items-center gap-x-3 border-b border-light-200 px-5 py-4 dark:border-dark-700"
          onClick={toggleCompleted}
        >
          <button
            className={`relative flex h-5 w-5 items-center justify-center rounded-full  ${
              task.isCompleted
                ? "bg-gradient-to-b from-primary-200 to-primary-300"
                : "border border-light-200 dark:border-dark-600"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
              <path
                className={`fill-none ${
                  task.isCompleted ? "stroke-white" : "stroke-none"
                } `}
                fill="none"
                stroke="#FFF"
                stroke-width="2"
                d="M1 4.304L3.696 7l6-6"
              />
            </svg>
          </button>
          <span
            className={`text-sm ${
              task.isCompleted ? "text-light-300 line-through" : ""
            }`}
          >
            {task.text}
          </span>
          <button className="ml-auto" onClick={onDeleteHandler}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <path
                className="fill-light-400 dark:fill-dark-400"
                fill-rule="evenodd"
                d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
              />
            </svg>
          </button>
        </div>
      )}
    </Draggable>
  );
}
