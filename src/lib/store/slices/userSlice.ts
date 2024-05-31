import { StateCreator } from "zustand";

export type UserState = {
  id: string;
  username: string;
  email: string;
  token: string;

  inputEmail: string;
  inputPassword: string;
};

export type UserAction = {
  login: (user: { email: string; password: string }) => void;
  logout: () => void;
  setInputEmail: (email: string) => void;
  setInputPassword: (password: string) => void;
};

export type UserSlice = UserState & UserAction;

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set
) => ({
  id: "",
  username: "",
  email: "",
  token: "",
  inputEmail: "",
  inputPassword: "",
  login: (user) => {
    set({ id: "1", username: "test", email: user.email, token: "token" });
  },
  logout: () => set({ id: "", username: "", email: "", token: "" }),
  setInputEmail: (inputEmail) => set({ inputEmail }),
  setInputPassword: (inputPassword) => set({ inputPassword }),
});
