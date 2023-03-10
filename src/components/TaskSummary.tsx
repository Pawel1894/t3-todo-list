import React from "react";
import { api } from "~/utils/api";

type Props = {
  refetchTasks: () => void;
  count: number;
};

export default function TaskSummary({ refetchTasks, count }: Props) {
  const deleteCompleted = api.task.deleteCompleted.useMutation({
    onSuccess: () => {
      refetchTasks();
    },
  });
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className="text-sm text-light-400">{count} items left</span>
      <button
        className="text-sm text-light-400"
        onClick={() => deleteCompleted.mutate()}
      >
        Clear Completed
      </button>
    </div>
  );
}
