import { StateCreator } from "zustand";

export type Todo = {
  id: number;
  title: string;
};

export type TodoState = {
  todos: Todo[];
  todoTitleInput: string | undefined;
};

export type TodoAction = {
  setTodoList: (todos: Todo[]) => void;
  setTodoTitleInput: (title: string) => void;
};

export type TodoSlice = TodoState & TodoAction;

export const createTodoSlice: StateCreator<TodoSlice, [], [], TodoSlice> = (
  set
) => ({
  todos: [],
  todoTitleInput: undefined,
  setTodoList: (todos: Todo[]) => set({ todos }),
  setTodoTitleInput: (todoTitleInput: string | undefined) =>
    set({ todoTitleInput }),
});
