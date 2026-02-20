import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';

export interface SubCategory {
    id: number;
    name: string;
    image: string;
    sub_categories_count: number;
    has_children: boolean;
    ad_form?: 'default' | 'car';
    company_allowed?: boolean;
    supports_auction?: boolean;
    has_city?: boolean;
}

export const fetchSubCategories = async (id: string | number): Promise<SubCategory[]> => {
    const res = await fetch(`${API_BASE_URL}/sub-categories/${id}`, {
        headers: { 'accept-language': 'ar' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: { status: boolean; data: SubCategory[] } = await res.json();
    if (!json.status) throw new Error('فشل تحميل البيانات');
    return json.data;
};

export function useGetSubCategories(id: string | number | null | undefined) {
    return useQuery<SubCategory[]>({
        queryKey: ['sub-categories', id],
        queryFn: () => fetchSubCategories(id!),
        enabled: id != null && id !== '',
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
