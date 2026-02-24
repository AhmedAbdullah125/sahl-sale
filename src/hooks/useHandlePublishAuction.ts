import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";
import { usePublishAuction } from "./usePublishAuction";

interface HandlePublishAuctionOptions {
    ad: any;
    imageFiles: File[];
    pinSelections: Record<number, boolean>;
    categoryId: number;
    hasCityField?: boolean;
    onSuccess: () => void;           // called after successful publish (no payment redirect)
    onPaymentRedirect: (url: string) => void; // called when payment_url is returned
}

export function useHandlePublishAuction() {
    const router = useRouter();
    const { mutateAsync: publishAuction, isPending: isPublishing } = usePublishAuction();
    const doneTimerRef = useRef<number | null>(null);

    const handlePublish = async ({
        ad,
        imageFiles,
        pinSelections,
        categoryId,
        hasCityField = false,
        onSuccess,
        onPaymentRedirect,
    }: HandlePublishAuctionOptions) => {
        try {
            const response = await publishAuction({
                categoryId,
                title: ad.title,
                description: ad.description,
                adPrice: ad.ad_price,
                imageFiles,
                allowWhatsapp: ad.allow_whatsapp,
                allowPhone: ad.allow_phone,
                allowNotification: ad.allow_notification,
                manufacturingCountryId: ad.manufacturing_country_id,
                year: ad.year,
                cityId: ad.city_id,
                hasCityField,
                pinSelections,
                carBrandId: ad.car_brand_id,
                carModelId: ad.car_model_id,
                mileage: ad.mileage,
            });

            if (response?.data?.payment_url) {
                onPaymentRedirect(response.data.payment_url);
            } else {
                onSuccess();
                if (doneTimerRef.current) window.clearTimeout(doneTimerRef.current);
                doneTimerRef.current = window.setTimeout(() => router.push("/"), 3000);
            }
        } catch (e) {
            console.error(e);
            toast.error("حدث خطأ أثناء نشر المزاد");
        }
    };

    return { handlePublish, isPublishing, doneTimerRef };
}
