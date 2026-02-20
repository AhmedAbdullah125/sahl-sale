import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';

export interface MainCategory {
    id: number;
    name: string;
    image?: string | null;
    has_children: boolean;
    sub_categories_count?: number;
    ad_fee?: string;
    auction_fee?: string;
    active_pinning_prices?: { id: number; position: string; price: string }[];
}

const fetchCategories = async (): Promise<MainCategory[]> => {
    const res = await fetch(`${API_BASE_URL}/categories`, {
        headers: { 'accept-language': 'ar' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: { status: boolean; data: MainCategory[] } = await res.json();
    if (!json.status) throw new Error('فشل تحميل الأقسام');
    return json.data;
};

export function useGetCategories() {
    return useQuery<MainCategory[]>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
