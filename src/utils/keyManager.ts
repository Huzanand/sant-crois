import { v4 as uuidv4 } from 'uuid';

const keyStore = new Map<string, string>();

export const getStableKey = (componentId: string, identifier: string): string => {
    const compositeId = `${componentId}|${identifier}`;

    if (!keyStore.has(compositeId)) {
        keyStore.set(compositeId, uuidv4());
    }

    return keyStore.get(compositeId)!;
};