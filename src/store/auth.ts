import { useEvents } from "@/store/events";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type AuthState = {
    token: string | null;
    isLoggedIn: boolean;
};

type AuthActions = {
    logIn: (token: string) => void;
    logOut: () => void;
};

const initialState: AuthState = {
    token: null,
    isLoggedIn: false,
};

export const useAuth = create<AuthState & AuthActions>()(
    immer((set) => ({
        ...initialState,
        logIn: (token) =>
            set((state) => {
                state.token = token;
                state.isLoggedIn = true;
            }),
        logOut: () => {
            set((state) => {
                state.token = null;
                state.isLoggedIn = false;
            });
            useEvents.getState().reset();
        },
    })),
);
