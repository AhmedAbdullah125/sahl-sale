import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';

export interface Company {
    id: number;
    name: string;
    image: string;
    verified_account: boolean;
    ads_number: number;
}

export interface CompaniesResponse {
    items: Company[];
    paginate: {
        total: number;
        count: number;
        per_page: number;
        next_page_url: string;
        prev_page_url: string;
        current_page: number;
        total_pages: number;
    };
    extra: any;
}

export const fetchCompanies = async (search: string = ''): Promise<CompaniesResponse> => {
    const url = new URL(`${API_BASE_URL}/companies`);
    if (search) {
        url.searchParams.append('search', search);
    }

    const res = await fetch(url.toString(), {
        headers: { 'accept-language': 'ar' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: { status: boolean; data: CompaniesResponse } = await res.json();
    if (!json.status) throw new Error('فشل تحميل الشركات');
    return json.data;
};

export function useGetCompanies(search: string = '') {
    return useQuery<CompaniesResponse>({
        queryKey: ['companies', search],
        queryFn: () => fetchCompanies(search),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
