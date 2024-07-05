import getQueryClient from "@/hooks/getQueryClient";
import { getTodoList } from "@/lib/api/testAPI";
import { HydrationBoundary, dehydrate, useQuery } from "@tanstack/react-query";
import React from "react";

export default async function Home() {
  const queryClient = getQueryClient();
  // await queryClient.prefetchQuery({
  //   queryKey: ["todos"],
  //   queryFn: getTodoList,
  // });
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="flex flex-col items-center">
      <HydrationBoundary state={dehydratedState}>
        <div className="flex flex-col items-center gap-4 p-4">
          <h1 className="text-4xl font-bold">THIS IS DASHBOARD</h1>
        </div>
      </HydrationBoundary>
    </main>
  );
}
