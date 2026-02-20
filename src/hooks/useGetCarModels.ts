import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';

export interface CarModel {
    id: number;
    name: string;
}

export const fetchCarModels = async (brandId: string | number): Promise<CarModel[]> => {
    const res = await fetch(`${API_BASE_URL}/car-models/${brandId}`, {
        headers: { 'accept-language': 'ar' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: { status: boolean; data: CarModel[] } = await res.json();
    if (!json.status) throw new Error('فشل تحميل موديلات السيارات');
    return json.data;
};

export function useGetCarModels(brandId: string | number | null | undefined) {
    return useQuery<CarModel[]>({
        queryKey: ['car-models', brandId],
        queryFn: () => fetchCarModels(brandId!),
        enabled: brandId != null && brandId !== '',
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
