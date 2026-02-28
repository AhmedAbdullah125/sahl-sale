"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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

export const COUNTRIES = ["ياباني", "أمريكي", "ألماني", "كوري"];
export const BRANDS = ["تويوتا", "لكزس", "نيسان", "هوندا"];
export const MODELS = ["كامري", "كورولا", "لاندكروزر", "RX"];
export const YEARS = Array.from({ length: 15 }, (_, i) => String(2025 - i));
export const GOVERNORATES = ["الكويت", "حولي", "الأحمدي", "الفروانية"];




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

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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

            if (adData.images && adData.images.length > 0) {
                setImagePreviews(adData.images.map(img => img.url));
            }

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

    const cleanupRef = useRef<string[]>([]);

    // ✅ add images (append)
    const onPickImages = (files: FileList | File[]) => {
        if (!files || files.length === 0) return;

        const urls = Array.from(files).map((f: File) => {
            const u = URL.createObjectURL(f);
            cleanupRef.current.push(u);
            return u;
        });

        setImagePreviews((prev) => [...prev, ...urls]);
    };

    const onRemoveImageAt = (index: number) => {
        setImagePreviews((prev) => {
            const copy = [...prev];
            const url = copy[index];
            // revoke only blob
            if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
            copy.splice(index, 1);
            return copy;
        });
    };

    const onClearImages = () => {
        setImagePreviews((prev) => {
            prev.forEach((u) => u.startsWith("blob:") && URL.revokeObjectURL(u));
            return [];
        });
    };

    useEffect(() => {
        return () => {
            cleanupRef.current.forEach((u) => u.startsWith("blob:") && URL.revokeObjectURL(u));
            cleanupRef.current = [];
        };
    }, []);



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
        try {
            // Optimize new added images
            const optimizedImages = await Promise.all(
                (payload.images || []).map(async (img: any) => {
                    if (img instanceof File) {
                        return await optimizeImage(img);
                    }
                    return img; // Existing URL string
                })
            );

            // Need to figure out deleted images comparing adData.images and optimizedImages
            // Since we know existing URLs, we can check which original URLs are missing
            const remainingUrls = optimizedImages.filter(img => typeof img === 'string');
            const deleted_images = adData?.images
                ?.filter(orig => !remainingUrls.includes(orig.url))
                .map(orig => orig.id) || [];

            const isCar = adData?.ad_form === 'car' || adData?.type === 'auction';

            await editAd({
                id,
                title: payload.title,
                description: payload.description,
                ad_price: payload.price || 0,
                allow_whatsapp: payload.contactWhats ? 1 : 0,
                allow_phone: payload.contactCall ? 1 : 0,
                images: optimizedImages,
                deleted_images,

                // Cars / Auctions specific fields
                ...(isCar && {
                    // For demo logic, using 1 as defaults, or values mapped back if we have them
                    manufacturing_country_id: payload.country ? 1 : undefined, // Needs proper ID mapping
                    car_brand_id: payload.brand ? 1 : undefined, // Needs proper ID mapping
                    car_model_id: payload.model ? 1 : undefined, // Needs proper ID mapping
                    year: payload.year,
                    mileage: payload.mileage,
                }),

                // You can add logic for city mapping here
                // city_id: payload.governorate ? 1 : undefined,
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
                    imagePreviews={imagePreviews}
                    onPickImages={onPickImages}
                    onRemoveImageAt={onRemoveImageAt}
                    onClearImages={onClearImages}
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
