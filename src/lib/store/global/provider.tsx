"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";
import { GlobalStore, createGlobalStore } from "./createStore";

export const GlobalStoreContext = createContext<StoreApi<GlobalStore> | null>(
  null
);

export interface CounterStoreProviderProps {
  children: ReactNode;
}

export const GlobalStoreProvider = ({
  children,
}: CounterStoreProviderProps) => {
  const storeRef = useRef<StoreApi<GlobalStore>>();
  if (!storeRef.current) {
    storeRef.current = createGlobalStore();
  }

  return (
    <GlobalStoreContext.Provider value={storeRef.current}>
      {children}
    </GlobalStoreContext.Provider>
  );
};

export const useGlobalStore = <T,>(selector: (store: GlobalStore) => T): T => {
  const globalStoreContext = useContext(GlobalStoreContext);

  if (!globalStoreContext) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`);
  }

  return useStore(globalStoreContext, selector);
};
