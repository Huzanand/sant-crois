import { get, set, del, keys } from 'idb-keyval';

// Manual: How to manage the lifecycle
// On Upload: Call persistFile(uniqueId, file).

// On Delete: Call persistFile(uniqueId, null) (this triggers the del command).

// On Refresh: Use a useEffect in your main layout or constructor root to loop 
// through your tasks and "re-attach" files from IDB to your Zustand store.

// On Submit: Once the lesson is successfully uploaded to your backend, call 
// clearAllLessonFiles() to free up the user's browser space.

const createKey = (lessonId: string, type: string) => `draft_${lessonId}_${type}`;

export const persistFile = async (lessonId: string, type: string, file: any) => {
    const key = createKey(lessonId, type);
    if (file instanceof File) {
        await set(key, file);
    } else if (file === null) {
        await del(key);
    }
};

export const loadPersistedFile = async (lessonId: string, type: string): Promise<File | null> => {
    const key = createKey(lessonId, type);
    const file = await get(key);
    return file instanceof File ? file : null;
};

export const clearCurrentLessonFiles = async (lessonId: string) => {
    const allKeys = await keys();
    const toDelete = allKeys.filter(key =>
        typeof key === 'string' && key.includes(lessonId)
    );
    await Promise.all(toDelete.map(key => del(key)));
};

export const cleanOrphanedFiles = async (currentDraftId: string) => {
    const allKeys = await keys();

    const orphans = allKeys.filter(key => {
        if (typeof key !== 'string' || !key.startsWith("draft_")) return false;

        const isCurrentDraftFile = key.includes(currentDraftId);

        return !isCurrentDraftFile;
    });

    await Promise.all(orphans.map(key => del(key)));

    if (orphans.length > 0) {
        console.log(`Cleaned up ${orphans.length} orphaned files.`);
    }
};