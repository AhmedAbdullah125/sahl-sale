import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';

interface PlaceBidArgs {
    adId: string | number;
    amount: string | number;
}

const placeBid = async ({ adId, amount }: PlaceBidArgs) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = { "accept-language": "ar" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const formData = new FormData();
    formData.append("amount", String(amount));

    const res = await fetch(`${API_BASE_URL}/ads/${adId}/place-bid`, {
        method: 'POST',
        headers,
        body: formData,
    });

    const json = await res.json();
    if (!res.ok) {
        throw new Error(json.message || json.data || `HTTP ${res.status}`);
    }

    // Sometimes API returns success message in data or message
    const successMsg = typeof json.data === 'string' ? json.data : json.message || "تمت المزايدة بنجاح";
    toast.success(successMsg, { style: { backgroundColor: "#37b5ff", color: "#fff" } });

    return json;
};

export function usePlaceBid() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: placeBid,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["ad", String(variables.adId)] });
        },
        onError: (error: any) => {
            toast.error(error.message || "حدث خطأ أثناء المزايدة");
        }
    });
}
