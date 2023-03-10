import React from "react";

type Props = {
  refetchTasks: () => void;
  count: number;
};

export default function TaskSummary({ refetchTasks, count }: Props) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className="text-sm text-light-400">{count} items left</span>
      <button className="text-sm text-light-400">Clear Completed</button>
    </div>
  );
}
