import getQueryClient from "@/hooks/getQueryClient";
import { getTodoList } from "@/lib/api/testAPI";
import { HydrationBoundary, dehydrate, useQuery } from "@tanstack/react-query";
import React from "react";
import TodoSection from "./components/TodoSection";
import HeroSection from "./components/HeroSection";
import CallToActionSection from "./components/CallToActionSection";
import FeatureHighlightSection from "./components/FeatureHighlight";

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["todos"],
    queryFn: getTodoList,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="flex flex-col items-center">
      <HydrationBoundary state={dehydratedState}>
        <HeroSection />
        <CallToActionSection />
        <FeatureHighlightSection />
        {/* <TodoSection /> */}
      </HydrationBoundary>
    </main>
  );
}
