import { type Task } from "@prisma/client";
import React from "react";

type Props = {
  task: Task;
};

export default function Task({ task }: Props) {
  return <div>{task.text}</div>;
}
