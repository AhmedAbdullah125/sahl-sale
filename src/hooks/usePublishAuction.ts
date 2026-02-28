import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/apiConfig";
import { getToken } from "@/src/utils/token";

// ── Image optimization ──────────────────────────────────────────────────────
async function optimizeImage(file: File): Promise<File> {
    try {
        const fd = new FormData();
        fd.append("image", file);

        const res = await fetch("/api/optimize-image", { method: "POST", body: fd });
        if (!res.ok) throw new Error(`optimize-image HTTP ${res.status}`);

        const blob = await res.blob();
        const name = file.name.replace(/\.[^.]+$/, "") + ".png";
        return new File([blob], name, { type: "image/png" });
    } catch (err) {
        console.warn("[optimizeImage] fallback to original:", err);
        return file; // fallback — send original if optimization fails
    }
}

export interface PublishAuctionPayload {
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
    carBrandId?: string | number;
    carModelId?: string | number;
    mileage?: string | number;
}

export function usePublishAuction() {
    return useMutation({
        mutationFn: async (payload: PublishAuctionPayload): Promise<any> => {
            const token = getToken();
            const headers: Record<string, string> = { "accept-language": "ar" };
            if (token) headers.Authorization = `Bearer ${token}`;

            // Optimize all images in parallel before building the form data
            const optimizedFiles = await Promise.all(
                payload.imageFiles.map(optimizeImage)
            );

            const fd = new FormData();

            fd.append("category_id", String(payload.categoryId));
            fd.append("title", payload.title || "");
            fd.append("description", payload.description || "");
            if (payload.adPrice) fd.append("ad_price", String(payload.adPrice));

            optimizedFiles.forEach((file, idx) => {
                fd.append(`images[${idx}]`, file);
            });

            fd.append("allow_whatsapp", payload.allowWhatsapp ? "1" : "0");
            fd.append("allow_phone", payload.allowPhone ? "1" : "0");
            fd.append("allow_notification", payload.allowNotification ? "1" : "0");

            if (payload.hasCityField) fd.append("city_id", String(payload.cityId || ""));

            // Pinning add-ons
            const selectedPinIds = Object.entries(payload.pinSelections)
                .filter(([, v]) => v)
                .map(([k]) => k);
            selectedPinIds.forEach((id, i) =>
                fd.append(`pinning_prices_id[${i}]`, String(id))
            );

            // ── Auction-specific ──────────────────────────────────────────────
            fd.append("type", "auction");

            fd.append("year", String(payload.year || ""));
            fd.append("manufacturing_country_id", String(payload.manufacturingCountryId || ""));
            fd.append("car_brand_id", String(payload.carBrandId || ""));
            fd.append("car_model_id", String(payload.carModelId || ""));
            if (payload.mileage) fd.append("mileage", String(payload.mileage));

            const res = await fetch(`${API_BASE_URL}/ads`, {
                method: "POST",
                headers,
                body: fd,
            });

            if (!res.ok) {
                const txt = await res.text();
                console.error("POST /ads (auction) failed:", res.status, txt);
                throw new Error("Failed to publish auction");
            }

            return res.json();
        },
    });
}
