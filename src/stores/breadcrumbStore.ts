import { create } from "zustand";
import type { BreadcrumbItem } from "@/router/HomeRoutesComponent";

export interface IBreadcrumbStore {
    items: BreadcrumbItem[] | null;
    readonly setItems: (items: BreadcrumbItem[]) => void;
}

export const useBreadcrumbStore = create<IBreadcrumbStore>((set) => ({
    items: null,
    setItems: (items: BreadcrumbItem[]) => set({ items })
}));