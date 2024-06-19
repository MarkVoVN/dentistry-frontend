"use client";

import { Button } from "@/components/ui/button";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { loginUser } from "@/lib/api/userAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

function LoginPage() {
  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  return (
    <div>
      <div className="flex flex-col p-2 border-neutral-400 border-[1px] rounded-lg">
        <h3>Login form</h3>
        <form>
          <input type="text" placeholder="username" />
          <input type="password" placeholder="password" />
          <Button variant={"outline"} type="submit">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
