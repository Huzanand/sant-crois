// STORE INTERFACES

export interface IData {
    metaData: IMetadata;
    lessons: ILesson[];
}

export interface IMetadata {
    totalCount: number;
    page: number;
    size: number;
}

export interface IFilters {
    primaryTopics: string[];
    secondaryTopics: string[];
    tags: string[];
    learningLanguages: string[];
    targetAgeGroups: string[];
}

export type IFiltersNullable = IFilters | null;

export interface ILesson {
    id: string;
    author?: string;
    primaryTopics: string[];
    secondaryTopics?: string[];
    tags?: string[] | null;
    languageLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
    targetAgeGroup?: 'ADULT' | 'KIDS';
    learningLanguage: string;
    views?: number;
    acceptance?: number;
    cover?: string;
    exerciseDescriptions?: ILessonDescriptions;
    rating?: number;
    header?: string;
    tasks: ITaskData[];
    relatedContents: string[],
    creationDateTime: Date
}

export interface ILessonDescriptions {
    [selectedLearningLanguage: string]: string;
}

export interface ITaskData {
    taskId: string;
    taskType: 'MEDIA_TASK' | 'CHOOSE_ANSWER' | 'TRUE_FALSE';
    taskDescriptions: ITaskDescriptions;
    content?: IContent | null;
    questions?: IQuestion[] | null;
}

export interface ITaskDescriptions {
    [selectedLearningLanguage: string]: string;
}

export interface IContent {
    contentType: 'AUDIO' | 'VIDEO' | 'TEXT' | 'CHOOSE_TEMPLATE' | 'FILL_TEMPLATE';
    transcription?: string;
    contentSource: string;
}

export interface IQuestion {
    questionId: string;
    questionText?: string;
    options?: string[] | null;
    questionDescription?: string | null;
}

export interface ICheckAnswers {
    taskId: string,
    questions: {
        questionId: string,
        questionDescription: string,
        rightAnswers: string[],
        result: boolean,
    }[]
}

export interface IState {
    totalCount: number;
    page: number;
    size: number;
    lessons: ILesson[];
    lesson: ILesson | null;
    userAnswers: IAnswer[];
    results: ICheckAnswers[];
    activeTypeOfLesson: "show all" | "video" | "audio" | "reading" | "grammar";
    selectedLanguageLevel: string;
    languageLevelOptions: string[];
    selectedInterfaceLanguage: string;
    interfaceLanguageOptions: string[];
    selectedLearningLanguage: string;
    learningLanguageOptions: string[];
    primaryTopics: string[];
    selectedPrimaryTopics: string[];
    secondaryTopics: string[];
    selectedSecondaryTopics: string[];
    tags: string[];
    selectedTags: string[];
    targetAgeGroups: string[];
    selectedAgeGroup: string[],
    virtualKeyboard: boolean;
    sortingOptions: string[],
    selectedSorting: 'default' | 'author' | 'views' | 'acceptance' | 'rating' | 'language level' | 'age' | 'data',
    relatedContents: (ICard | null)[],
}

export interface IActions {
    fetchLessons: (size: number,
        activeTypeOfLesson: string,
        selectedLanguageLevel: string,
        selectedLearningLanguage: string,
        selectedPrimaryTopics: string[],
        selectedSecondaryTopics: string[],
        selectedTags: string[],
        selectedAgeGroup: string[],
        page: number,
        selectedSorting: string) => void;
    fetchLessonById: (id: string) => void;
    fetchRecomendations: (ids: string[]) => void;
    clearRecomendations: () => void;
    fetchFilters: () => void;
    setUserAnswers: (answer: IAnswer) => void;
    clearUserAnswers: () => void;
    clearResults: () => void;

    sendUserAnswers: (exerciseId: string) => void;

    setSelectedPrimaryTopics: (primaryTopics: string[]) => void;
    setSelectedSecondaryTopics: (secondaryTopics: string[]) => void;
    setSelectedTags: (tags: string[]) => void;
    setSelectedAgeGroup: (ageGroup: string[]) => void;
    setSize: (inc: number) => void;
    resetSize: () => void;
    onSelectChange: (selectedLearningLanguage: string, value: string) => void;
    setActiveTypeOfLesson: (newActiveType: "show all" | "video" | "audio" | "reading" | "grammar") => void;
    setPage: (newPage: number) => void;
    toggleVirtualKeyboard: () => void;
}

export interface IStore extends IState, IActions { }

export interface IAnswer {
    taskId: string;
    questions: IQuestionAnswer[];
}

export interface IQuestionAnswer {
    questionId: string;
    userAnswer: string;
}

// CARD (make omit of ILessons) or rebuild for short request cards

export interface ICard {
    id: string;
    header?: string;
    cover: string;
    primaryTopics: string[];
    author?: string;
    secondaryTopics?: string[];
    learningLanguage: string;
    languageLevel: string;
    acceptance?: number;
    rating?: number;
    views?: number;
    customStyles?: Record<string, unknown>;
    recomendation?: boolean;
    ageGroup?: "ADULT" | "KIDS";
}

// ANSWER CHOOSE TASK

export interface IAnswerChoose {
    questionId: string;
    selectedOption: string | null;
}
