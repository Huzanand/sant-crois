
export interface ISettingsState {
    openInDev: boolean,
    virtualKeyboard: boolean;
}

export interface ISettingsActions {
    toggleVirtualKeyboard: () => void,
    setOpenInDev: (newState: boolean) => void,
}


export interface ISettingsSlice extends ISettingsState, ISettingsActions { }