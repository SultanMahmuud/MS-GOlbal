import { envConfig } from './envConfig';

interface FetchOptions extends RequestInit {
    next?: {
        revalidate?: number
    };
}
interface FetchResponse<T> {
    isSuccess: boolean;
    data?: T;
    message?: string;
    loading: boolean;
}

const fetchData = async <T>(url: string, revalidate?: number): Promise<FetchResponse<T>> => {
    let loading = true;
    try {
        const fetchOptions: FetchOptions = {
            next: revalidate ? { revalidate } : undefined
        };
        const baseUrl = `${envConfig.baseApi}/${url}`;
        const response = await fetch(baseUrl, fetchOptions);

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data: T = await response.json();
        loading = false;
        return {
            isSuccess: true,
            data,
            loading
        };
    } catch (error) {
        return {
            isSuccess: false,
            message: (error as Error).message,
            loading
        };
    } finally {
        loading = false;
    }
};

export default fetchData;
