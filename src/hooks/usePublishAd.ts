import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/apiConfig";

export interface PublishAdPayload {
    categoryId: number;
    title: string;
    description: string;
    adPrice?: string | number;
    imageFiles: File[];
    allowWhatsapp: boolean;
    allowPhone: boolean;
    allowNotification: boolean;
    manufacturingCountryId?: string | number;
    year?: string | number;
    cityId?: string | number;
    hasCityField: boolean;
    pinSelections: Record<number, boolean>;
    adForm: "default" | "car";
    carBrandId?: string | number;
    carModelId?: string | number;
    mileage?: string | number;
}

export function usePublishAd() {
    return useMutation({
        mutationFn: async (payload: PublishAdPayload): Promise<void> => {
            const token = localStorage.getItem("auth_token");

            const headers: Record<string, string> = {
                "accept-language": "ar",
            };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const fd = new FormData();

            fd.append("category_id", String(payload.categoryId));
            fd.append("title", payload.title || "");
            fd.append("description", payload.description || "");
            if (payload.adPrice) fd.append("ad_price", String(payload.adPrice));

            payload.imageFiles.forEach((file, idx) => {
                fd.append(`images[${idx}]`, file);
            });

            fd.append("allow_whatsapp", payload.allowWhatsapp ? "1" : "0");
            fd.append("allow_phone", payload.allowPhone ? "1" : "0");
            fd.append("allow_notification", payload.allowNotification ? "1" : "0");

            if (payload.hasCityField) fd.append("city_id", String(payload.cityId || ""));

            const selectedPinIds = Object.entries(payload.pinSelections)
                .filter(([, v]) => v)
                .map(([k]) => k);
            selectedPinIds.forEach((id, i) =>
                fd.append(`pinning_prices_id[${i}]`, String(id))
            );

            fd.append("type", "ad");

            if (payload.adForm === "car") {
                fd.append("year", String(payload.year || ""));
                fd.append("manufacturing_country_id", String(payload.manufacturingCountryId || ""));
                fd.append("car_brand_id", String(payload.carBrandId || ""));
                fd.append("car_model_id", String(payload.carModelId || ""));
                if (payload.mileage) fd.append("mileage", String(payload.mileage));
            }

            const res = await fetch(`${API_BASE_URL}/ads`, {
                method: "POST",
                headers,
                body: fd,
            });

            if (!res.ok) {
                const txt = await res.text();
                console.error("POST /ads failed:", res.status, txt);
                throw new Error("Failed to publish ad");
            }
        }
    });
}
