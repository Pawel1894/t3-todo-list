import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import LoadIndicator from "~/components/LoadIndicator";
import TaskInput from "~/components/TaskInput";
import { api } from "~/utils/api";

export default function Task() {
  const router = useRouter();
  const { data: sessionData, status: sessionStatus } = useSession();
  const { data, isLoading } = api.task.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <LoadIndicator />
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    void router.push("/");
    return null;
  }

  return (
    <div className="mx-auto max-w-xl -translate-y-[5.75rem] px-6 sm:px-0">
      <TaskInput />
    </div>
  );
}
