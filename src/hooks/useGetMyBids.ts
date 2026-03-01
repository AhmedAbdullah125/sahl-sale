import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';
import { getToken } from '@/src/utils/token';

export interface CarDetails {
    brand: string;
    model: string;
    year: string;
}

export interface BidDetails {
    id: number;
    amount: string;
    user: any;
    created_at: string;
}

export interface BidItem {
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
    latest_bid: BidDetails | null;
    my_bid: boolean;
    created_at: string;
    ended_at: string;
    status: string;
    is_favorite: boolean;
}

export interface BidPaginate {
    total: number;
    count: number;
    per_page: number;
    next_page_url: string;
    prev_page_url: string;
    current_page: number;
    total_pages: number;
}

interface MyBidsResponse {
    status: boolean;
    data: {
        items: BidItem[];
        paginate: BidPaginate;
        extra: unknown;
    };
}

const fetchMyBids = async (page: number): Promise<{ items: BidItem[]; paginate: BidPaginate }> => {
    const token = getToken();
    const headers: Record<string, string> = { 'accept-language': 'ar' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const params = new URLSearchParams({ page: String(page) });
    const res = await fetch(`${API_BASE_URL}/my-bids?${params.toString()}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json: MyBidsResponse = await res.json();
    if (!json.status) throw new Error('فشل تحميل المزايدات');

    return { items: json.data.items, paginate: json.data.paginate };
};

export const useGetMyBids = (page: number) =>
    useQuery({
        queryKey: ['my-bids', page],
        queryFn: () => fetchMyBids(page),
        staleTime: 1000 * 60 * 2,
    });
