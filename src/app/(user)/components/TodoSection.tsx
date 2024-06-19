"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import getQueryClient from "@/hooks/getQueryClient";
import { getTodoList } from "@/lib/api/testAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RotateCcwIcon, UploadIcon } from "lucide-react";
import React from "react";

export default function TodoSection() {
  const { data, isLoading, error, isError, isSuccess } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodoList,
  });

  const queryClient = useQueryClient();

  return (
    <React.Fragment>
      <div className="flex flex-row gap-4 items-center">
        <h2>Todo list </h2>
        <Button
          variant={"exitButton"}
          onClick={() => queryClient.invalidateQueries({ queryKey: ["todos"] })}
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
    </React.Fragment>
  );
}
