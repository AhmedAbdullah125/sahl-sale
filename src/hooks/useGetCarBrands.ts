import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';

export interface CarBrand {
    id: number;
    name: string;
}

export const fetchCarBrands = async (): Promise<CarBrand[]> => {
    const res = await fetch(`${API_BASE_URL}/car-brands`, {
        headers: { 'accept-language': 'ar' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: { status: boolean; data: CarBrand[] } = await res.json();
    if (!json.status) throw new Error('فشل تحميل ماركات السيارات');
    return json.data;
};

export function useGetCarBrands() {
    return useQuery<CarBrand[]>({
        queryKey: ['car-brands'],
        queryFn: fetchCarBrands,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
