interface RegisterState {
    currentStep: number;
    stepDone: number;
    headerTitle: string;
    headerSubtitle: string;
    allHeaderSubtitles: string[];
    pageFields: Record<string, string[]>;
}