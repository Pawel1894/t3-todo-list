import { type Task } from "@prisma/client";
import { type QueryObserverResult } from "@tanstack/react-query";
import React from "react";
import { api } from "~/utils/api";

type Props = {
  refetchTasks: () => Promise<QueryObserverResult<Task[]>>;
  count: number | string;
};

export default function TaskSummary({ refetchTasks, count }: Props) {
  const deleteCompleted = api.task.deleteCompleted.useMutation({
    onSuccess: async () => {
      await refetchTasks();
    },
  });
  return (
    <div className="flex items-center justify-between rounded-b-md bg-white px-5 py-4 shadow-lg dark:bg-dark-200">
      <span className="text-sm text-light-400 md:text-base">
        {count} items left
      </span>
      <button
        className="text-sm text-light-400 md:text-base"
        onClick={() => deleteCompleted.mutate()}
      >
        Clear Completed
      </button>
    </div>
  );
}
