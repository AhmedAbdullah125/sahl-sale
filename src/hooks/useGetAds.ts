import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';

export interface CarDetails {
    brand: string;
    model: string;
    year: string;
}

export interface AdItem {
    id: number;
    title: string;
    price: string;
    ad_form: string;
    type: "ad" | "auction";
    parent_category: string;
    category: string;
    is_pinned: boolean;
    car: CarDetails | null;
    image: string;
    created_at: string;
    ended_at: string;
    status: string;
    is_favorite: boolean;
}

export interface Paginate {
    total: number;
    count: number;
    per_page: number;
    next_page_url: string;
    prev_page_url: string;
    current_page: number;
    total_pages: number;
}

export interface AdsResponse {
    status: boolean;
    data: {
        items: AdItem[];
        paginate: Paginate;
        extra: unknown;
    };
}

interface FetchAdsParams {
    category_id?: string;
    company_id?: string;
    type?: string;
    brand_id?: string;
    model_id?: string;
    year_from?: string;
    year_to?: string;
    price_from?: string;
    price_to?: string;
    page: number;
    search?: string;
}

const fetchAds = async (params: FetchAdsParams): Promise<AdsResponse['data']> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = { "accept-language": "ar" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const urlParams = new URLSearchParams();
    urlParams.set("page", String(params.page));
    if (params.category_id) urlParams.set("category_id", params.category_id);
    if (params.company_id) urlParams.set("company_id", params.company_id);
    if (params.type && params.type !== "all") urlParams.set("type", params.type);
    if (params.brand_id) urlParams.set("brand_id", params.brand_id);
    if (params.model_id) urlParams.set("model_id", params.model_id);
    if (params.year_from) urlParams.set("year_from", params.year_from);
    if (params.year_to) urlParams.set("year_to", params.year_to);
    if (params.price_from) urlParams.set("price_from", params.price_from);
    if (params.price_to) urlParams.set("price_to", params.price_to);
    if (params.search) urlParams.set("search", params.search);

    const res = await fetch(`${API_BASE_URL}/ads?${urlParams.toString()}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: AdsResponse = await res.json();
    if (!json.status) throw new Error('فشل تحميل الإعلانات');
    return json.data;
};

export function useGetAds(params: FetchAdsParams) {
    return useQuery({
        queryKey: ['ads', params],
        queryFn: () => fetchAds(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
