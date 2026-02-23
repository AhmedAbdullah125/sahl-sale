import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { toast } from 'sonner';

import { API_BASE_URL } from '@/lib/apiConfig';
import { getToken } from '@/src/utils/token';

export interface UpdateProfileValues {
    name?: string;
    phone?: string;
    whatsapp?: string;
}

export function useUpdateProfile() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const updateProfile = async (
        values: UpdateProfileValues,
        imageFile: File | null
    ) => {
        try {
            // Parse phone
            const parsedPhone = parsePhoneNumber(values.phone);
            const phone = parsedPhone.nationalNumber;
            const country_code = parsedPhone.countryCallingCode;

            // Parse whatsapp (optional)
            let waPhone = '';
            let waCountryCode = '';
            if (values.whatsapp && isValidPhoneNumber(values.whatsapp)) {
                const parsedWa = parsePhoneNumber(values.whatsapp);
                waPhone = parsedWa.nationalNumber;
                waCountryCode = parsedWa.countryCallingCode;
            }

            const token = getToken();
            const headers: Record<string, string> = { 'accept-language': 'ar' };
            if (token) headers.Authorization = `Bearer ${token}`;

            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('phone', phone);
            formData.append('country_code', country_code);
            formData.append('whatsapp', waPhone);
            formData.append('whatsapp_country_code', waCountryCode);
            if (imageFile) formData.append('image', imageFile);

            const res = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'POST',
                headers,
                body: formData,
            });

            const json = await res.json();
            if (!res.ok || !json.status) {
                throw new Error(json.message ?? 'حدث خطأ');
            }

            toast.success('تم تحديث الملف الشخصي بنجاح');
            await queryClient.invalidateQueries({ queryKey: ['profile'] });
            router.push('/profile');
        } catch (err: unknown) {
            const msg =
                (err as { message?: string })?.message ?? 'حدث خطأ، يرجى المحاولة مجدداً';
            toast.error(msg);
        }
    };

    return { updateProfile };
}
