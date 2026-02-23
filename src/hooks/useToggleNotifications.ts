import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/apiConfig';
import { getToken } from '@/src/utils/token';

export function useToggleNotifications() {
    const queryClient = useQueryClient();

    const toggleNotifications = async () => {
        try {
            const token = getToken();
            const headers: Record<string, string> = { 'accept-language': 'ar' };
            if (token) headers.Authorization = `Bearer ${token}`;

            const res = await fetch(`${API_BASE_URL}/toggle-notifications`, {
                method: 'POST',
                headers,
            });

            const json = await res.json();
            if (!res.ok || !json.status) {
                throw new Error(json.message ?? 'حدث خطأ');
            }

            // Refetch profile so notification_allowed reflects the new state
            await queryClient.invalidateQueries({ queryKey: ['profile'] });
        } catch (err: unknown) {
            const msg =
                (err as { message?: string })?.message ?? 'حدث خطأ، يرجى المحاولة مجدداً';
            toast.error(msg);
        }
    };

    return { toggleNotifications };
}
