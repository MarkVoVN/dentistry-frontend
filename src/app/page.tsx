import getQueryClient from "@/hooks/getQueryClient";
import { getTodoList } from "@/lib/api/testAPI";
import { HydrationBoundary, dehydrate, useQuery } from "@tanstack/react-query";
import React from "react";
import TodoSection from "./(homepage)/TodoSection";

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["todos"],
    queryFn: getTodoList,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="">
      <h1>This is Landing Page</h1>
      <h3>{process.env.BASE_URL}</h3>
      <HydrationBoundary state={dehydratedState}>
        <TodoSection />
      </HydrationBoundary>
    </main>
  );
}
