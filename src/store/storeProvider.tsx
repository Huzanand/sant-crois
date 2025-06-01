'use client'

import { createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

import {Store } from './store';
import { IStore } from '@/models';

export type storeApi = ReturnType<typeof Store>

export const StoreContext = createContext<storeApi | undefined>(undefined)

export interface storeProviderProps {
    children: React.ReactNode
}

export const StoreProvider = ({children}: storeProviderProps) => {
    const storeRef = useRef<storeApi>();
    if(!storeRef.current) storeRef.current = Store()

    return (
        <StoreContext.Provider value={storeRef.current}>
            {children}
        </StoreContext.Provider>
    )
}

export const useOwnStore = <T,>(
    selector: (store: IStore) => T,
  ): T => { 
    const storeContext = useContext(StoreContext);

    if (!storeContext) throw new Error(`useOwnStore must be used within StoreProvider`)

    return useStore(storeContext, selector)
}

