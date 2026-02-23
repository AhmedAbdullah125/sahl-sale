import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';
import { getToken } from '@/src/utils/token';

export interface ProfileData {
    id: number;
    name: string;
    phone: string;
    country_code: string;
    full_phone: string;
    image: string;
    language: string;
    verified_account: boolean;
    notification_allowed: boolean;
    whatsapp: string | null;
    whatsapp_country_code: string | null;
    full_whatsapp: string | null;
    type: string | null;
}

interface ProfileResponse {
    status: boolean;
    data: ProfileData;
}

const fetchProfile = async (): Promise<ProfileData> => {
    const token = getToken();
    const headers: Record<string, string> = { 'accept-language': 'ar' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/auth/profile`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json: ProfileResponse = await res.json();
    if (!json.status) throw new Error('فشل تحميل بيانات الملف الشخصي');

    return json.data;
};

export const useGetProfile = () =>
    useQuery({
        queryKey: ['profile'],
        queryFn: fetchProfile,
        staleTime: 1000 * 60 * 5,
    });
