import { create } from "zustand";
import { UserDetailModel } from "@/models/user/userDetailModel";
import { useUserService } from "@/services/userService";

interface ICurrentUserStore {
    user: UserDetailModel | null;
    readonly hasData: boolean;
    readonly loadAsync: () => Promise<UserDetailModel>;
    readonly getAsync: () => Promise<UserDetailModel>;
    readonly clear: () => void;
}

export const useCurrentUserStore = create<ICurrentUserStore>((set, get) => ({
    user: null,
    get hasData() {
        return get().user != null;
    },
    loadAsync: async () => {
        const userService = useUserService();
        const responseDto = await userService.getCallerDetailAsync();
        const model = new UserDetailModel(responseDto);
        set({ user: model });
        return model;
    },
    getAsync: async () => {
        if (get().hasData) {
            return get().user!;
        }

        return await get().loadAsync();
    },
    clear: () => set({ user: null })
}));