"use client"

import { IConstructorSlice } from "@/models/constructorSlice";
import { IStore } from "@/models";
import { StateCreator } from "zustand";


export const constructorSlice: StateCreator<IStore, [], [], IConstructorSlice> = (set) => ({

    draft: {
        id: crypto.randomUUID(),
        header: '',
        author: '',
        primaryTopics: [],
        secondaryTopics: [],
        tags: [],
        languageLevel: 'A1',
        targetAgeGroup: 'ADULT',
        learningLanguage: 'English',
        coverUrl: null,
        coverFile: null,
        exerciseDescriptions: '',
        tasks: [],
    },

    updateConstructorMetadata: (patch) => set((state) => ({
        draft: { ...state.draft, ...patch }
    })),

    updateConstructorTask: (taskId, taskPatch) => set((state) => ({
        draft: {
            ...state.draft,
            tasks: state.draft.tasks.map((task) =>
                task.taskId === taskId ? { ...task, ...taskPatch } : task
            )
        }
    })),

    addConstructorTask: (newTask) => set((state) => ({
        draft: { ...state.draft, tasks: [...state.draft.tasks, newTask] }
    })),
})