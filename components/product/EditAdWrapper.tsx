"use client";
import React, { useEffect, useRef, useState } from "react";
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

export default function EditAdWrapper({ id }: { id: string }) {
    const router = useRouter();
    const { data: adData, isLoading } = useGetAd(id);

    // Dropdown queries
    const { data: countries } = useGetManufacturingCountries();
    const { data: brands } = useGetCarBrands();
    const { data: years } = useGetManufacturingYears();
    const { data: cities } = useGetCities();

    // Initial structure matching the form fields
    const [ad, setAd] = useState<any>(null);
    const [isMapping, setIsMapping] = useState(true);

    const { mutateAsync: editAd, isPending } = useEditAd();

    // 1. Initial mapping from adData to ad state
    useEffect(() => {
        if (adData && countries && brands && years && cities && !ad) {
            const isCar = adData.ad_form === 'car' || adData.type === 'auction';

            let brandId = "";
            let yearVal = "";
            let cityId = "";

            if (isCar && adData.car) {
                brandId = brands.find(b => b.name === adData.car?.brand)?.id?.toString() || "";
                yearVal = years.find(y => y.label === adData.car?.year || y.value.toString() === adData.car?.year)?.value?.toString() || "";
            }
            cityId = cities.find(c => c.name === adData.city)?.id?.toString() || "";

            setAd({
                section: "motors",
                subSection: "vehicles",
                title: adData.title || "",
                country: "", // API doesn't return manufacturing_country, leave empty or map if needed
                brand: brandId,
                model: "", // We map this later once models load
                year: yearVal,
                mileage: "", // Not returned yet
                governorate: cityId,
                price: adData.price || "",
                description: adData.description || "",
                contactCall: adData.allow_phone === 1,
                contactWhats: adData.allow_whatsapp === 1,
                _originalModelString: adData.car?.model
            });

            if (!brandId) {
                setIsMapping(false);
            }
        }
    }, [adData, countries, brands, years, cities, ad]);

    // 2. Load models for the selected brand
    const { data: models } = useGetCarModels(ad?.brand);

    // 3. Map model string to model ID once models load
    useEffect(() => {
        if (ad && isMapping) {
            if (ad.brand && ad._originalModelString) {
                if (models) {
                    const modelId = models.find(m => m.name === ad._originalModelString)?.id?.toString() || "";
                    setAd(prev => ({ ...prev, model: modelId, _originalModelString: undefined }));
                    setIsMapping(false);
                }
            } else {
                setIsMapping(false);
            }
        }
    }, [ad, models, isMapping]);

    const optimizeImage = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("image", file);
            const res = await fetch("/api/optimize-image", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Optimization failed");
            const blob = await res.blob();
            return new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".png", { type: "image/png" });
        } catch (error) {
            console.error("Image optimization error:", error);
            return file; // Fallback
        }
    };

    const handleSave = async (payload: any) => {
        console.log(payload);

        try {
            // Optimize new added images
            const optimizedImages = await Promise.all(
                (payload.images || []).map(async (file: File) => {
                    return await optimizeImage(file);
                })
            );

            const isCar = adData?.ad_form === 'car' || adData?.type === 'auction';

            await editAd({
                id,
                title: payload.title,
                description: payload.description,
                price: payload.price || 0,
                contactWhats: payload.contactWhats ? 1 : 0,
                contactCall: payload.contactCall ? 1 : 0,
                images: optimizedImages,
                deleted_images: [],

                // Cars / Auctions specific fields
                ...(isCar && {
                    country: payload.country ? payload.country : undefined,
                    brand: payload.brand ? payload.brand : undefined,
                    model: payload.model ? payload.model : undefined,
                    year: payload.year,
                    mileage: payload.mileage,
                }),

                // governorate: payload.governorate ? payload.governorate : undefined,
            });

            router.back();
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading || !ad || isMapping) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <section className="content-section" dir="rtl">
            <div className="container">
                <UpperHeader title="تعديل إعلان" />

                {/* نفس فكرة عنوان progress-name */}
                <h4 className="progress-name">بيانات الإعلان</h4>

                <EditAdForm
                    isCarOrAuction={adData?.ad_form === 'car' || adData?.type === 'auction'}
                    ad={ad}
                    setAd={setAd}
                    onSave={handleSave}
                    COUNTRIES={countries || []}
                    BRANDS={brands || []}
                    MODELS={models || []}
                    YEARS={years || []}
                    GOVERNORATES={cities || []}
                />
            </div>
        </section>
    );
}
