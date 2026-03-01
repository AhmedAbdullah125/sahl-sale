import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';

interface EditAdPayload {
    id: string | number;
    title: string;
    description: string;
    price: string | number;
    contactWhats: number;
    contactCall: number;
    images?: (File | string)[]; // Can be File objects or URLs for existing images
    deleted_images?: number[]; // IDs of images to delete

    // Optional parameters for cars
    country?: string | number;
    brand?: string | number;
    model?: string | number;
    year?: string | number;
    mileage?: string | number;

    // Optional parameter for auctions
    allow_notification?: number;

    governorate?: string | number;
    _method?: string; // Laravel PUT simulation via POST
}

const editAd = async (payload: EditAdPayload) => {

    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = { "accept-language": "ar" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const formData = new FormData();

    // We use POST with _method=PUT for Laravel to handle multipart/form-data correctly
    formData.append("_method", "PUT");

    // Helper to add if valid
    const appendIfValid = (key: string, value: any) => {
        if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value.toString());
        }
    };

    appendIfValid("title", payload.title);
    appendIfValid("description", payload.description);
    appendIfValid("ad_price", payload.price);
    appendIfValid("allow_whatsapp", payload.contactWhats);
    appendIfValid("allow_phone", payload.contactCall);

    appendIfValid("city_id", payload.governorate);

    // Optional fields for cars
    appendIfValid("manufacturing_country_id", payload.country);
    appendIfValid("car_brand_id", payload.brand);
    appendIfValid("car_model_id", payload.model);
    appendIfValid("year", payload.year);
    appendIfValid("mileage", payload.mileage);

    // Auction fields
    appendIfValid("allow_notification", payload.allow_notification);

    // Handle images array
    if (payload.images && payload.images.length > 0) {
        payload.images.forEach((img, index) => {
            if (img instanceof File) {
                formData.append(`images[${index}]`, img);
            } else if (typeof img === 'string') {
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
            queryClient.invalidateQueries({ queryKey: ["my-ads"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "حدث خطأ أثناء تعديل الإعلان");
        }
    });
}
