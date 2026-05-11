"use client"

import { StateCreator } from "zustand"
import { ISettingsSlice, ISettingsState } from "@/models/settingsSlice";
import { IStore } from "@/models";

export const settingsSlice: StateCreator<IStore, [], [], ISettingsSlice> = (set) => ({

  virtualKeyboard: false,
  openInDev: false,

  toggleVirtualKeyboard: () =>
    set((state) => ({ virtualKeyboard: !state.virtualKeyboard })),

  setOpenInDev: (newState) => set({ openInDev: newState }),
})
