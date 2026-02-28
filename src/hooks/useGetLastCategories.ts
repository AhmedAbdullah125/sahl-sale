import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';

export interface LastLevelCategory {
    id: number;
    name: string;
    image: string;
    sub_categories_count: number | null;
    has_children: boolean;
    ad_fee: string;
    auction_fee: string;
    active_pinning_prices: { id: number; position: string; price: string }[];
    ads: unknown[];
}

const fetchLastCategories = async (): Promise<LastLevelCategory[]> => {
    const res = await fetch(`${API_BASE_URL}/categories-last-level`, {
        headers: { 'accept-language': 'ar' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: { status: boolean; data: LastLevelCategory[] } = await res.json();
    if (!json.status) throw new Error('فشل تحميل الأقسام');
    return json.data;
};

export function useGetLastCategories() {
    return useQuery<LastLevelCategory[]>({
        queryKey: ['categories-last-level'],
        queryFn: fetchLastCategories,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Returns all categories that have an `auction_fee` defined (non-null / non-empty).
 * Convenience helper used by AddAuctionWrapper.
 */
export function useGetAuctionCategories() {
    const query = useGetLastCategories();

    const auctionCategories = useMemo(
        () =>
            (query.data ?? []).filter(
                (c) => c.auction_fee !== null && c.auction_fee !== undefined && c.auction_fee !== ''
            ),
        [query.data]
    );

    return { ...query, auctionCategories };
}
