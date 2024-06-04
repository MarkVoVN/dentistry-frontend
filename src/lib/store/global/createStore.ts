import { createStore } from "zustand/vanilla";
import { TodoSlice, createTodoSlice } from "../slices/todoSlice";
import { CounterSlice, createCounterSlice } from "../slices/counterSlice";
import { UserSlice, createUserSlice } from "../slices/userSlice";
import { SearchBoxSlice, createSearchBoxSlice } from "../slices/searchBoxSlice";

export type GlobalStore = CounterSlice & TodoSlice & UserSlice & SearchBoxSlice;

export const createGlobalStore = () => {
  return createStore<GlobalStore>()((...a) => ({
    ...createCounterSlice(...a),
    ...createTodoSlice(...a),
    ...createUserSlice(...a),
    ...createSearchBoxSlice(...a),
  }));
};
