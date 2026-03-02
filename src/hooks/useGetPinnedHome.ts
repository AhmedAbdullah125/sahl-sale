import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';
import { AdItem, Paginate } from '@/src/hooks/useGetAds';

interface PinnedHomeResponse {
    status: boolean;
    data: {
        items: AdItem[];
        paginate: Paginate;
        extra: unknown;
    };
}

const fetchPinnedHome = async (page: number): Promise<{ items: AdItem[]; paginate: Paginate }> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = { 'accept-language': 'ar' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/pinned-home?page=${page}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: PinnedHomeResponse = await res.json();
    if (!json.status) throw new Error('فشل تحميل الإعلانات المثبتة');
    return { items: json.data.items, paginate: json.data.paginate };
};

export function useGetPinnedHome(page: number) {
    return useQuery({
        queryKey: ['pinned-home', page],
        queryFn: () => fetchPinnedHome(page),
        staleTime: 1000 * 60 * 5,
    });
}
