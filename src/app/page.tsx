import getQueryClient from "@/hooks/getQueryClient";
import { getTodoList } from "@/lib/api/testAPI";
import { HydrationBoundary, dehydrate, useQuery } from "@tanstack/react-query";
import React from "react";
import TodoSection from "./(homepage)/TodoSection";
import HeroSection from "./(homepage)/HeroSection";
import CallToActionSection from "./(homepage)/CallToActionSection";
import FeatureHighlightSection from "./(homepage)/FeatureHighlight";

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
