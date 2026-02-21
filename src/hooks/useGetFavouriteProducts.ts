'use client';

import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/apiConfig";

export interface FavouriteProduct {
    id: number;
    title: string;
    price: string;
    ad_form: string;
    type: string;
    parent_category: string;
    category: string;
    is_pinned: boolean;
    image: string;
    created_at: string;
    ended_at: string;
    status: string;
    is_favorite: boolean;
    href: string;
}

interface FavouriteResponse {
    status: boolean;
    data: {
        items: FavouriteProduct[];
        paginate: {
            total: number;
            count: number;
            per_page: number;
            next_page_url: string | null;
            prev_page_url: string | null;
            current_page: number;
            total_pages: number;
        };
        extra: unknown;
    };
}

const fetchFavouriteProducts = async (): Promise<FavouriteProduct[]> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = {
        "accept-language": "ar",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/favorites`, { headers });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json: FavouriteResponse = await response.json();
    if (!json.status) throw new Error("فشل تحميل البيانات");

    return json.data?.items ?? [];
};

export const useGetFavouriteProducts = () =>
    useQuery({
        queryKey: ["favourite-products"],
        queryFn: fetchFavouriteProducts,
        staleTime: 1000 * 60 * 5,
    });
