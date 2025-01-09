import { create } from "zustand";

interface IPageLoadProgressBarStore {
    readonly percentage: number;
    readonly phase: "pending" | "waiting" | "finishing" | "hiding"
    readonly start: () => void;
    readonly finish: () => void;
}

const usePageLoadProgressBarStore = create<IPageLoadProgressBarStore>((set, get) => ({
    percentage: 0,
    phase: "pending",
    start(): void {
        const percentage = get().percentage;
        if (percentage === 100) {
            set({ phase: "pending", percentage: 0 });
        }
        set({ phase: "waiting", percentage: 75 });
    },

    finish(): void {
        set({ phase: "finishing", percentage: 100 });
        setTimeout(() => {
            set({ phase: "hiding" });
            setTimeout(() => set({ phase: "pending", percentage: 0 }), 205);
        }, 100);
    }
}));

export { usePageLoadProgressBarStore, type IPageLoadProgressBarStore };