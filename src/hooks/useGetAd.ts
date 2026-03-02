import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/apiConfig";

export interface BidUser {
    id: number;
    name: string;
    image: string;
    phone: string;
    whatsapp: string | null;
}

export interface BidEntry {
    id: number;
    amount: string;
    user: BidUser | null;
    created_at: string;
}

export interface CarInfo {
    brand_id: number | null;
    brand: string | null;
    model_id: number | null;
    model: string | null;
    year: string | null;
    mileage: number | null;
}

export interface AdData {
    id: number;
    title: string;
    payment_url: string | null;
    price: string;
    ad_form: string;
    type: "ad" | "auction";
    is_creator: boolean;
    parent_category: string | null;
    category_id: number;
    category: string;
    city_id: number | null;
    city: string | null;
    description: string;
    allow_whatsapp: number;
    allow_phone: number;
    user: {
        id: number;
        name: string;
        image: string;
        phone: string;
        whatsapp: string | null;
        verified_account: number;
    };
    // Auction-specific
    car?: CarInfo;
    latest_bid?: BidEntry | null;
    bids?: BidEntry[];
    is_ended?: boolean;
    // Common
    images: { id: number; url: string }[];
    created_at: string;
    created_date?: string;
    created_date_milliseconds?: number;
    is_favorite: boolean;
    ended_at: string | null;
}

export const fetchAd = async (id: string): Promise<AdData> => {
    const headers: Record<string, string> = {

        'accept-language': 'ar',
    };
    const token = localStorage.getItem("token");
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE_URL}/ads/${id}`, {
        headers,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: { status: boolean; data: AdData } = await res.json();
    if (!json.status) throw new Error('فشل تحميل ماركات السيارات');
    return json.data;
};

export function useGetAd(id: string) {
    return useQuery<AdData>({
        queryKey: ['ad', id],
        queryFn: () => fetchAd(id),
        staleTime: 1000 * 60 * 60, // 1 hour
        enabled: !!id,
    });
}