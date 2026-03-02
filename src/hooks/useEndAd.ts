import { useMutation } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';
import { useQueryClient } from '@tanstack/react-query';

const endAd = async (adId: string | number) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = { "accept-language": "ar" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/ads/${adId}/end`, {
        method: 'POST',
        headers,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.status) throw new Error(json.message || 'فشل أرشفة الإعلان');
    return json;
};

export function useEndAd() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: endAd,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ads"] });
            queryClient.invalidateQueries({ queryKey: ["my-ads", "active", 1] });
            queryClient.invalidateQueries({ queryKey: ["my-ads", "archived", 1] });
            queryClient.invalidateQueries({ queryKey: ["my-ads", "auction", 1] });
        },
    });
}
