import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';

interface EditAdPayload {
    id: string | number;
    title: string;
    description: string;
    ad_price: string | number;
    allow_whatsapp: number;
    allow_phone: number;
    images?: (File | string)[]; // Can be File objects or URLs for existing images
    deleted_images?: number[]; // IDs of images to delete

    // Optional parameters for cars
    manufacturing_country_id?: string | number;
    car_brand_id?: string | number;
    car_model_id?: string | number;
    year?: string | number;
    mileage?: string | number;

    // Optional parameter for auctions
    allow_notification?: number;

    city_id?: string | number;
    _method?: string; // Laravel PUT simulation via POST
}

const editAd = async (payload: EditAdPayload) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = { "accept-language": "ar" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const formData = new FormData();

    // We use POST with _method=PUT for Laravel to handle multipart/form-data correctly
    formData.append("_method", "PUT");

    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("ad_price", payload.ad_price.toString());
    formData.append("allow_whatsapp", payload.allow_whatsapp.toString());
    formData.append("allow_phone", payload.allow_phone.toString());

    if (payload.city_id) formData.append("city_id", payload.city_id.toString());

    // Optional fields for cars
    if (payload.manufacturing_country_id) formData.append("manufacturing_country_id", payload.manufacturing_country_id.toString());
    if (payload.car_brand_id) formData.append("car_brand_id", payload.car_brand_id.toString());
    if (payload.car_model_id) formData.append("car_model_id", payload.car_model_id.toString());
    if (payload.year) formData.append("year", payload.year.toString());
    if (payload.mileage) formData.append("mileage", payload.mileage.toString());

    // Auction fields
    if (payload.allow_notification !== undefined) formData.append("allow_notification", payload.allow_notification.toString());

    // Handle images array
    if (payload.images && payload.images.length > 0) {
        payload.images.forEach((img, index) => {
            if (img instanceof File) {
                formData.append(`images[${index}]`, img);
            }
        });
    }

    // Handle deleted images
    if (payload.deleted_images && payload.deleted_images.length > 0) {
        payload.deleted_images.forEach((id, index) => {
            formData.append(`deleted_images[${index}]`, id.toString());
        });
    }

    const res = await fetch(`${API_BASE_URL}/ads/${payload.id}`, {
        method: 'POST', // Sent as POST, Laravel reads _method=PUT
        headers,
        body: formData,
    });

    const json = await res.json();
    if (!res.ok) {
        throw new Error(json.message || json.data || `HTTP ${res.status}`);
    }

    const successMsg = typeof json.data === 'string' ? json.data : json.message || "تم تعديل الإعلان بنجاح";
    toast.success(successMsg, { style: { backgroundColor: "#37b5ff", color: "#fff" } });

    return json;
};

export function useEditAd() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: editAd,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["ad", String(variables.id)] });
            queryClient.invalidateQueries({ queryKey: ["my-products"] });
            queryClient.invalidateQueries({ queryKey: ["myAds"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "حدث خطأ أثناء تعديل الإعلان");
        }
    });
}
