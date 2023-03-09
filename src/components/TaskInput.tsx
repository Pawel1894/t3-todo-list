import Image from "next/image";
import React, { useRef, useState } from "react";
import { api } from "~/utils/api";

export default function TaskInput() {
  const [task, setTask] = useState<string | undefined>();
  const taskMutation = api.task.create.useMutation();

  function createTask() {
    if (task) taskMutation.mutate(task);

    setTask("");
  }

  return (
    <div className="flex shadow-lg">
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        type="text"
        className="w-full rounded-l-md py-[0.875rem] px-5 outline-none"
        placeholder="Create a new todo..."
      />
      <button
        className="rounded-r-md bg-white px-5 focus:bg-light-200 active:bg-light-200"
        onClick={createTask}
      >
        <Image
          width={20}
          height={20}
          src="/images/icon-save.svg"
          alt="save task"
        />
      </button>
    </div>
  );
}
