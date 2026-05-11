import { IDraft, IDraftTaskData } from ".";

export interface IConstructorState {
    draft: IDraft,
}

export interface IConstructorActions {
    updateConstructorMetadata: (patch: Partial<IDraft>) => void;
    updateConstructorTask: (taskId: string, taskPatch: Partial<IDraftTaskData>) => void;
    addConstructorTask: (newTask: IDraftTaskData) => void;
}


export interface IConstructorSlice extends IConstructorState, IConstructorActions { }