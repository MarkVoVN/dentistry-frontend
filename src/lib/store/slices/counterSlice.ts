import { StateCreator } from "zustand";

export type CounterState = {
  count: number;
};

export type CounterActions = {
  decrementCount: () => void;
  incrementCount: () => void;
};

export type CounterSlice = CounterState & CounterActions;

export const createCounterSlice: StateCreator<
  CounterSlice,
  [],
  [],
  CounterSlice
> = (set) => ({
  count: 0,
  decrementCount: () => set((state) => ({ count: state.count - 1 })),
  incrementCount: () => set((state) => ({ count: state.count + 1 })),
});
