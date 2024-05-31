"use client";

import { Button } from "@/components/ui/button";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { getTodoList, postTodo } from "@/lib/api/testAPI";
import { useGlobalStore } from "@/lib/store/global/provider";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RotateCcwIcon } from "lucide-react";

import React, { useEffect } from "react";

function TestPage() {
  const {
    count,
    incrementCount,
    decrementCount,
    setTodoList,
    todoTitleInput,
    setTodoTitleInput,
  } = useGlobalStore((s) => s);

  const queryClient = useQueryClient();

  // Queries
  const { data, isLoading, error, isError, isSuccess } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodoList,
  });

  useEffect(() => {
    if (data) {
      setTodoList(data.data);
    }
  }, [isSuccess, data, setTodoList]);

  useErrorNotification({
    isError: isError,
    title: error?.message,
  });

  // Mutations
  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col p-2 border-neutral-400 border-[1px] rounded-lg">
        <h3>Counter store</h3>
        <p> count: {count} </p>
        <Button variant={"outline"} onClick={incrementCount}>
          Add
        </Button>
      </div>
      {/* <div className="flex flex-col p-2 border-neutral-400 border-[1px] rounded-lg">
        <h3>Login form</h3>
        <form onSubmit={() => {}}>
          <input type="text" placeholder="username" />
          <input type="password" placeholder="password" />
          <Button variant={"outline"} type="submit">
            Login
          </Button>
        </form>
      </div> */}
      <div className="flex flex-col p-2 border-neutral-400 border-[1px] rounded-lg gap-6">
        <div className="flex flex-row gap-4 items-center">
          <h2>Todo list </h2>
          <Button
            variant={"outline"}
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["todos"] })
            }
            className="flex flex-row gap-2 items-center"
          >
            <RotateCcwIcon className="w-4 h-4" /> Refresh
          </Button>
        </div>
        {isLoading && <div>Loading...</div>}
        {!isLoading && (
          <ul>
            {data?.map((todo: { id: number; title: string }) => (
              <li key={todo.id}>{todo.title}</li>
            ))}
          </ul>
        )}
        <div className="flex flex-row">
          <input
            type="text"
            placeholder="Title"
            value={todoTitleInput}
            onChange={(e: any) => setTodoTitleInput(e.target.value)}
            className={cn(
              "border-[1px] border-neutral-400 rounded ",
              status === "pending" && "animate-pulse",
              status === "error" && "border-red-500",
              status === "success" && "border-green-500"
            )}
          />
          <Button
            variant={"outline"}
            onClick={() => {
              mutate({
                id: Date.now(),
                title: todoTitleInput,
              });
            }}
          >
            Add Todo
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TestPage;
