import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';

export interface ManufacturingYear {
    value: number;
    label: string;
}

export const fetchManufacturingYears = async (): Promise<ManufacturingYear[]> => {
    const res = await fetch(`${API_BASE_URL}/manufacturing-years`, {
        headers: { 'accept-language': 'ar' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: { status: boolean; data: ManufacturingYear[] } = await res.json();
    if (!json.status) throw new Error('فشل تحميل سنوات الصنع');
    return json.data;
};

export function useGetManufacturingYears() {
    return useQuery<ManufacturingYear[]>({
        queryKey: ['manufacturing-years'],
        queryFn: fetchManufacturingYears,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
