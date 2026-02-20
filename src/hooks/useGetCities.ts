import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';

export interface City {
    id: number;
    name: string;
}

export const fetchCities = async (): Promise<City[]> => {
    const res = await fetch(`${API_BASE_URL}/cities`, {
        headers: { 'accept-language': 'ar' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: { status: boolean; data: City[] } = await res.json();
    if (!json.status) throw new Error('فشل تحميل المحافظات');
    return json.data;
};

export function useGetCities() {
    return useQuery<City[]>({
        queryKey: ['cities'],
        queryFn: fetchCities,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
