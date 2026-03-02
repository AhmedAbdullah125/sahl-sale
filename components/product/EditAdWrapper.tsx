"use client";
import React, { useEffect, useState } from "react";
import UpperHeader from "@/components/General/UpperHeader";
import { useRouter } from "next/navigation";
import { useGetAd } from "@/src/hooks/useGetAd";
import { useEditAd } from "@/src/hooks/useEditAd";
import { useGetManufacturingCountries } from "@/src/hooks/useGetManufacturingCountries";
import { useGetCarBrands } from "@/src/hooks/useGetCarBrands";
import { useGetCarModels } from "@/src/hooks/useGetCarModels";
import { useGetManufacturingYears } from "@/src/hooks/useGetManufacturingYears";
import { useGetCities } from "@/src/hooks/useGetCities";
import { Loader2 } from "lucide-react";
import EditAdForm from "./EditAdForm";
import Loading from "@/src/app/loading";

export default function EditAdWrapper({ id }: { id: string }) {
    const router = useRouter();
    const { data: adData, isLoading } = useGetAd(id);

    // Dropdown queries
    const { data: countries } = useGetManufacturingCountries();
    const { data: brands } = useGetCarBrands();
    const { data: years } = useGetManufacturingYears();
    const { data: cities } = useGetCities();

    const [ad, setAd] = useState<any>(null);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

    const { mutateAsync: editAd, isPending } = useEditAd();

    // Map adData → form state using direct IDs from the API response
    useEffect(() => {
        if (adData && !ad) {
            const isCar = adData.ad_form === "car" || adData.type === "auction";
            setAd({
                title: adData.title || "",
                country: "",
                brand: isCar ? adData.car?.brand_id?.toString() || "" : "",
                model: isCar ? adData.car?.model_id?.toString() || "" : "",
                year: isCar ? adData.car?.year?.toString() || "" : "",
                mileage: isCar ? adData.car?.mileage?.toString() || "" : "",
                governorate: adData.city_id?.toString() || "",
                price: adData.price || "",
                description: adData.description || "",
                contactCall: adData.allow_phone === 1,
                contactWhats: adData.allow_whatsapp === 1,
            });
        }
    }, [adData, ad]);

    // Load models for the selected brand (depends on brand ID being set first)
    const { data: models } = useGetCarModels(ad?.brand);

    const optimizeImage = async (file: File): Promise<File> => {
        try {
            const formData = new FormData();
            formData.append("image", file);
            const res = await fetch("/api/optimize-image", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Optimization failed");
            const blob = await res.blob();
            return new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".png", { type: "image/png" });
        } catch (error) {
            console.error("Image optimization error:", error);
            return file;
        }
    };

    const handleSave = async (payload: any) => {
        try {
            const optimizedImages = await Promise.all(
                (payload.images || []).map((file: File) => optimizeImage(file))
            );

            const isCar = adData?.ad_form === "car" || adData?.type === "auction";

            await editAd({
                id,
                title: payload.title,
                description: payload.description,
                price: payload.price || 0,
                contactWhats: payload.contactWhats ? 1 : 0,
                contactCall: payload.contactCall ? 1 : 0,
                images: optimizedImages,
                deleted_images: deletedImageIds,

                ...(isCar && {
                    country: payload.country || undefined,
                    brand: payload.brand || undefined,
                    model: payload.model || undefined,
                    year: payload.year,
                    mileage: payload.mileage,
                }),
            });

            router.back();
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (!ad) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <span className="text-red-500">الإعلان غير موجود</span>
            </div>
        );
    }

    return (
        <section className="content-section" dir="rtl">
            <div className="container">
                <UpperHeader title="تعديل إعلان" />
                <h4 className="progress-name">بيانات الإعلان</h4>

                <EditAdForm
                    isCarOrAuction={adData?.ad_form === "car" || adData?.type === "auction"}
                    ad={ad}
                    setAd={setAd}
                    onSave={handleSave}
                    isPending={isPending}
                    COUNTRIES={countries || []}
                    BRANDS={brands || []}
                    MODELS={models || []}
                    YEARS={years || []}
                    GOVERNORATES={cities || []}
                    existingImages={adData?.images || []}
                    onDeleteExistingImage={(imgId: number) =>
                        setDeletedImageIds((prev) => [...prev, imgId])
                    }
                />
            </div>
        </section>
    );
}
