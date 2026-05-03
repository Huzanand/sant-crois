
import { get, set, del, keys } from 'idb-keyval';

const createKey = (draftId: string, taskId: string, type: string) =>
    `draft_${draftId}_${taskId}_${type}`;

export const persistCover = async (draftId: string, file: Blob | null) => {
    const key = `draft_${draftId}_cover`;
    if (file instanceof Blob) {
        await set(key, file);
    } else if (file === null) {
        await del(key);
    }
};

export const loadPersistedCover = async (draftId: string) => {
    const key = `draft_${draftId}_cover`;
    const data = await get<Blob>(key);

    if (!data) {
        return null;
    }

    return data;
};

export const persistFile = async (draftId: string, taskId: string, type: string, file: Blob | null) => {
    const key = createKey(draftId, taskId, type);
    if (file instanceof Blob) {
        await set(key, file);
    } else if (file === null) {
        await del(key);
    }
};

export const loadPersistedFile = async (draftId: string, taskId: string, type: string) => {
    const key = createKey(draftId, taskId, type);
    const data = await get<Blob>(key);

    if (!data) {
        return null;
    }

    return data;
};

export const cleanOrphanedFiles = async (currentDraftId: string) => {
    const allKeys = await keys();

    const orphans = allKeys.filter(key => {
        if (typeof key !== 'string' || !key.startsWith("draft_")) return false;

        const isCurrentDraftFile = key.includes(currentDraftId);

        return !isCurrentDraftFile;
    });

    await Promise.all(orphans.map(key => del(key)));
};