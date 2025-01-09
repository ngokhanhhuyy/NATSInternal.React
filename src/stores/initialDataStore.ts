import { create } from "zustand";
import { useUtilityService } from "@/services/utilityService";

const service = useUtilityService();

export interface IInitialDataStore {
    data: ResponseDtos.InitialData;
    readonly hasData: () => boolean;
    readonly loadDataAsync: () => Promise<void>;
    readonly clearData: () => void;
    readonly getDisplayName: (key: string) => string;
}

export const useInitialDataStore = create<IInitialDataStore>((set, get) => ({
    data: null!,
    hasData: () => !!get().data,
    loadDataAsync: async () => set({ data: await service.getInitialDataAsync() }),
    clearData: () => set({ data: null! }),
    getDisplayName: (key: string) => {
        const displayName = get().data.displayNames;
        return displayName[key as keyof typeof displayName];
    }
}));