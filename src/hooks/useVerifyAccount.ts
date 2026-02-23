import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { API_BASE_URL } from '@/lib/apiConfig';
import { getToken } from '@/src/utils/token';

export interface VerifyAccountValues {
    id_front: File | null;
    id_back: File | null;
}

export function useVerifyAccount() {
    const router = useRouter();

    const verifyAccount = async (values: VerifyAccountValues) => {
        try {
            const token = getToken();
            const headers: Record<string, string> = { 'accept-language': 'ar' };
            if (token) headers.Authorization = `Bearer ${token}`;

            const formData = new FormData();
            formData.append('identity_front_image', values.id_front as File);
            formData.append('identity_back_image', values.id_back as File);

            const res = await fetch(`${API_BASE_URL}/auth/verify-account`, {
                method: 'POST',
                headers,
                body: formData,
            });

            const json = await res.json();
            if (!res.ok || !json.status) {
                throw new Error(json.message ?? 'حدث خطأ');
            }

            toast.success(json.data);
            router.push('/profile');
        } catch (err: unknown) {
            const msg =
                (err as { message?: string })?.message ?? 'حدث خطأ، يرجى المحاولة مجدداً';
            toast.error(msg);
        }
    };

    return { verifyAccount };
}
