import getQueryClient from "@/hooks/getQueryClient";

import { HydrationBoundary, dehydrate, useQuery } from "@tanstack/react-query";
import React from "react";
import HeroSection from "./components/HeroSection";
import CallToActionSection from "./components/CallToActionSection";
import FeatureHighlightSection from "./components/FeatureHighlight";

export default async function Home() {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="flex flex-col items-center">
      <HydrationBoundary state={dehydratedState}>
        <HeroSection />
        <CallToActionSection />
        <FeatureHighlightSection />
      </HydrationBoundary>
    </main>
  );
}
