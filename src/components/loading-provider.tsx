'use client';
import React from 'react';
import { Next13ProgressBar } from 'next13-progressbar';

const LoadingProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Next13ProgressBar height="4px" color="#6CB2BC" options={{ showSpinner: true }} showOnShallow />
    </>
  );
};

export default LoadingProviders;