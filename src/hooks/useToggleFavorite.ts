import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';

const toggleFavorite = async (adId: string | number) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = { "accept-language": "ar" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/ads/${adId}/toggle-favorite`, {
        method: 'POST',
        headers,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    console.log(json);
    toast.success(json.data, { style: { backgroundColor: "#37b5ff", color: "#fff" } });
    return json;
};

export function useToggleFavorite() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: toggleFavorite,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favourite-products"] });
        }
    });
}
