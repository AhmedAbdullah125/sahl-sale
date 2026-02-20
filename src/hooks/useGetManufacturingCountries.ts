import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';

export interface ManufacturingCountry {
    id: number;
    name: string;
}

export const fetchManufacturingCountries = async (): Promise<ManufacturingCountry[]> => {
    const res = await fetch(`${API_BASE_URL}/manufacturing-countries`, {
        headers: { 'accept-language': 'ar' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: { status: boolean; data: ManufacturingCountry[] } = await res.json();
    if (!json.status) throw new Error('فشل تحميل بلدان الصنع');
    return json.data;
};

export function useGetManufacturingCountries() {
    return useQuery<ManufacturingCountry[]>({
        queryKey: ['manufacturing-countries'],
        queryFn: fetchManufacturingCountries,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
