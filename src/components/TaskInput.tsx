import React, { useState } from "react";
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
        className="w-full rounded-l-md py-[0.875rem] px-5 outline-none dark:bg-dark-200 dark:text-white"
        placeholder="Create a new todo..."
      />
      <button
        className="rounded-r-md bg-gradient-to-b from-primary-200 to-primary-300 px-5 dark:bg-dark-100 dark:text-white"
        onClick={createTask}
      >
        <svg
          className="fill-light-100"
          version="1.1"
          id="Capa_1"
          width="20px"
          height="20px"
          viewBox="0 0 407.096 407.096"
        >
          <g>
            <g>
              <path
                d="M402.115,84.008L323.088,4.981C319.899,1.792,315.574,0,311.063,0H17.005C7.613,0,0,7.614,0,17.005v373.086
			c0,9.392,7.613,17.005,17.005,17.005h373.086c9.392,0,17.005-7.613,17.005-17.005V96.032
			C407.096,91.523,405.305,87.197,402.115,84.008z M300.664,163.567H67.129V38.862h233.535V163.567z"
              />
              <path
                d="M214.051,148.16h43.08c3.131,0,5.668-2.538,5.668-5.669V59.584c0-3.13-2.537-5.668-5.668-5.668h-43.08
			c-3.131,0-5.668,2.538-5.668,5.668v82.907C208.383,145.622,210.92,148.16,214.051,148.16z"
              />
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
}
