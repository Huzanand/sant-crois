export interface IInterceptorsStore {
    loading: boolean;
    error: boolean;
    setLoading: (loading: boolean) => void;
    setError: (error: boolean) => void;
}