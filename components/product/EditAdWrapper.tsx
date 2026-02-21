"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import UpperHeader from "@/components/General/UpperHeader";
import { useRouter } from "next/navigation";
import { useGetAd } from "@/src/hooks/useGetAd";

import EditAdForm from "./EditAdForm";

// نفس بياناتك (تقدر تنقلهم لملف constants)
import vehicles from "@/src/images/category/vehicles.png";
import estate from "@/src/images/category/estate.png";
import electronics from "@/src/images/category/electronics.png";
import BuySell from "@/src/images/category/Buy&sell.png";
import contracting from "@/src/images/category/Contracting.png";

export const COUNTRIES = ["ياباني", "أمريكي", "ألماني", "كوري"];
export const BRANDS = ["تويوتا", "لكزس", "نيسان", "هوندا"];
export const MODELS = ["كامري", "كورولا", "لاندكروزر", "RX"];
export const YEARS = Array.from({ length: 15 }, (_, i) => String(2025 - i));
export const GOVERNORATES = ["الكويت", "حولي", "الأحمدي", "الفروانية"];

// ✅ الجديد: القسم + القسم الفرعي
export const SECTIONS = [
    { id: "motors", label: "محركات", img: vehicles },
    { id: "estate", label: "عقارات", img: estate },
    { id: "electronics", label: "الكترونيات", img: electronics },
    { id: "buysell", label: "بيع وشراء", img: BuySell },
    { id: "contracting", label: "مقاولات وحرف", img: contracting },
];

export const SUBSECTIONS_BY_SECTION = {
    motors: [
        { id: "vehicles", label: "مركبات" },
        { id: "bikes", label: "الدراجات النارية" },
        { id: "marine", label: "القسم البحري" },
    ],
    estate: [
        { id: "sale", label: "للبيع" },
        { id: "rent", label: "للإيجار" },
        { id: "rooms", label: "غرف/مشاركة" },
    ],
    electronics: [
        { id: "laptops", label: "لابتوبات" },
        { id: "mobiles", label: "جوالات" },
        { id: "accessories", label: "ملحقات" },
    ],
    buysell: [
        { id: "general", label: "بيع وشراء" },
        { id: "furniture", label: "أثاث" },
        { id: "animals", label: "حيوانات" },
    ],
    contracting: [
        { id: "services", label: "خدمات" },
        { id: "jobs", label: "وظائف" },
        { id: "handy", label: "حرفيين" },
    ],
};

export default function EditAdWrapper({ id }: { id: string }) {
    console.log(id);

    const router = useRouter();

    const { data: adData, isLoading } = useGetAd(id);
    console.log(adData);


    // Initial structure matching the form fields
    const [ad, setAd] = useState({
        section: "motors",
        subSection: "vehicles",
        title: "",
        country: "",
        brand: "",
        model: "",
        year: "",
        mileage: "",
        governorate: "",
        price: "",
        description: "",
        contactCall: true,
        contactWhats: false,
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    useEffect(() => {
        if (adData) {
            setAd({
                section: adData.category, // TODO: Map properly if your API returns these
                subSection: "vehicles",
                title: adData.title || "",
                country: "", // Map if applicable
                brand: "",
                model: "",
                year: "",
                mileage: "",
                governorate: adData.city || "",
                price: adData.price || "",
                description: adData.description || "",
                contactCall: adData.allow_phone === 1,
                contactWhats: adData.allow_whatsapp === 1,
            });

            if (adData.images && adData.images.length > 0) {
                setImagePreviews(adData.images.map(img => img.url));
            }
        }
    }, [adData]);

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

    const subSections = useMemo(() => {
        if (!ad.section) return [];
        return SUBSECTIONS_BY_SECTION[ad.section] ?? [];
    }, [ad.section]);

    const handleSave = async (payload) => {
        // TODO: call your API update here
        // await fetch(`/api/ads/${adId}`, { method:'PUT', body: ... })

        setAd(payload);
        // onSaved?.({ ad: payload, images: imagePreviews });

        router.back();
    };

    return (
        <section className="content-section" dir="rtl">
            <div className="container">
                <UpperHeader title="تعديل إعلان" />

                {/* نفس فكرة عنوان progress-name */}
                <h4 className="progress-name">بيانات الإعلان</h4>

                <EditAdForm
                    imagePreviews={imagePreviews}
                    onPickImages={onPickImages}
                    onRemoveImageAt={onRemoveImageAt}
                    onClearImages={onClearImages}
                    ad={ad}
                    setAd={setAd}
                    onSave={handleSave}
                    SECTIONS={SECTIONS}
                    subSections={subSections}
                    COUNTRIES={COUNTRIES}
                    BRANDS={BRANDS}
                    MODELS={MODELS}
                    YEARS={YEARS}
                    GOVERNORATES={GOVERNORATES}
                />
            </div>
        </section>
    );
}
