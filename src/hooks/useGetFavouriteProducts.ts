'use client';

import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/apiConfig";
import { getToken } from "@/src/utils/token";

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
}

export interface FavouritePaginate {
    total: number;
    count: number;
    per_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    current_page: number;
    total_pages: number;
}

interface FavouriteResponse {
    status: boolean;
    data: {
        items: FavouriteProduct[];
        paginate: FavouritePaginate;
        extra: unknown;
    };
}

const fetchFavouriteProducts = async (page: number): Promise<{ items: FavouriteProduct[]; paginate: FavouritePaginate }> => {
    const token = getToken();
    const headers: Record<string, string> = { "accept-language": "ar" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/favorites?page=${page}`, { headers });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json: FavouriteResponse = await response.json();
    if (!json.status) throw new Error("فشل تحميل البيانات");

    return {
        items: json.data?.items ?? [],
        paginate: json.data?.paginate,
    };
};

export const useGetFavouriteProducts = (page = 1) =>
    useQuery({
        queryKey: ["favourite-products", page],
        queryFn: () => fetchFavouriteProducts(page),
        staleTime: 1000 * 60 * 5,
    });
