import { create } from "zustand";
import { useAuthenticationService } from "@/services/authenticationService";

interface IAuthenticationStates {
    hasInitiallyCheckedAuthentication: boolean;
    isAuthenticated: boolean;
    readonly isAuthenticatedAsync: () => Promise<boolean>;
    readonly clearAuthenticationStatus: () => void;
}

export const useAuthenticationStore = create<IAuthenticationStates>((set, get) => ({
    hasInitiallyCheckedAuthentication: false,
    isAuthenticated: false,
    isAuthenticatedAsync: async (): Promise<boolean> => {
        const { hasInitiallyCheckedAuthentication } = get();

        if (!hasInitiallyCheckedAuthentication) {
            try {
                const authenticationService = useAuthenticationService();
                const isAuthenticated = await authenticationService
                    .checkAuthenticationStatusAsync();

                set({
                    isAuthenticated,
                    hasInitiallyCheckedAuthentication: true,
                });
            } catch {
                set({
                    isAuthenticated: false,
                    hasInitiallyCheckedAuthentication: true,
                });
            }
        }

        return get().isAuthenticated;
    },
    clearAuthenticationStatus: (): void => {
        set({
            hasInitiallyCheckedAuthentication: false,
            isAuthenticated: false,
        });
    },
}));