"use client"

import { IInterceptorsStore } from "@/models/interceptorsStore";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const interceptorsStore = create<IInterceptorsStore>()(
    devtools((set) => ({
        loading: true,
        error: false,
        setLoading: (loading: boolean) => set({ loading }),
        setError: (error: boolean) => set({ error }),
    }))
);