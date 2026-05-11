"use client"

import { StateCreator } from "zustand"
import { IPersistentSettingsSlice } from "@/models/persistentSettingsSlice";
import { IStore } from "@/models";


export const persistentSettingsSlice: StateCreator<IStore, [], [], IPersistentSettingsSlice> = (set) => ({
    selectedInterfaceLanguage: "English",
    interfaceLanguageOptions: ["Ukrainian", "English", "French", "German"],
    selectedLearningLanguage: 'english',
    learningLanguageOptions: [],
    selectedLanguageLevel: 'All',
    languageLevelOptions: ['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'],

    onSelectChange: (selectName, value) => set({ [selectName]: value }),
})

