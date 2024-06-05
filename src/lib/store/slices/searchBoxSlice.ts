import { StateCreator } from "zustand";

export type SearchBoxState = {
  searchInputValue: string | undefined;
};

export type SearchBoxAction = {
  setSearchInputValue: (value: string | undefined) => void;
};

export type SearchBoxSlice = SearchBoxState & SearchBoxAction;

export const createSearchBoxSlice: StateCreator<
  SearchBoxSlice,
  [],
  [],
  SearchBoxSlice
> = (set) => ({
  searchInputValue: undefined,
  setSearchInputValue: (value: string | undefined) =>
    set((state) => ({ searchInputValue: value })),
});
