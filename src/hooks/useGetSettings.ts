import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';

export interface AppSettings {
    terms: string;
    phone: string;
    email: string;
    facebook: string;
    twitter: string;
    instagram: string;
    whatsapp: string;
    privacy: string;
    ad_duration_days: string;
    auction_duration_days: string;
}

interface SettingsResponse {
    status: boolean;
    data: AppSettings;
}

const fetchSettings = async (): Promise<AppSettings> => {
    const res = await fetch(`${API_BASE_URL}/settings`, {
        headers: { 'accept-language': 'ar' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: SettingsResponse = await res.json();
    if (!json.status) throw new Error('فشل تحميل الإعدادات');
    return json.data;
};

export function useGetSettings() {
    return useQuery<AppSettings>({
        queryKey: ['settings'],
        queryFn: fetchSettings,
        staleTime: 1000 * 60 * 60, // 1 hour — settings rarely change
    });
}
