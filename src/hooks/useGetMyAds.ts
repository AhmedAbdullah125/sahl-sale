import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';
import { getToken } from '@/src/utils/token';

export interface CarDetails {
    brand: string;
    model: string;
    year: string;
}

export interface LatestBid {
    id: number;
    amount: string;
    user: string | null;
    created_at: string;
}

export interface AdItem {
    id: number;
    title: string;
    price: string;
    ad_form: string;
    type: 'ad' | 'auction';
    parent_category: string;
    category: string;
    is_pinned: boolean;
    car: CarDetails | null;
    image: string;
    created_at: string;
    ended_at: string;
    latest_bid?: LatestBid | null;
    my_bid?: boolean;
    status: string;
    is_favorite: boolean;
}

export interface AdPaginate {
    total: number;
    count: number;
    per_page: number;
    next_page_url: string;
    prev_page_url: string;
    current_page: number;
    total_pages: number;
}

interface MyAdsResponse {
    status: boolean;
    data: {
        items: AdItem[];
        paginate: AdPaginate;
        extra: unknown;
    };
}

const fetchMyAds = async (tab: string, page: number): Promise<{ items: AdItem[]; paginate: AdPaginate }> => {
    const token = getToken();
    const headers: Record<string, string> = { 'accept-language': 'ar' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const params = new URLSearchParams({ tab, page: String(page) });
    const res = await fetch(`${API_BASE_URL}/my-ads?${params.toString()}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json: MyAdsResponse = await res.json();
    if (!json.status) throw new Error('فشل تحميل الإعلانات');

    return { items: json.data.items, paginate: json.data.paginate };
};

export const useGetMyAds = (tab: string, page: number) =>
    useQuery({
        queryKey: ['my-ads', tab, page],
        queryFn: () => fetchMyAds(tab, page),
        staleTime: 1000 * 60 * 2,
    });
