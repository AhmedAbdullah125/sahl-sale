"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

export default function EditAdWrapper({ id }) {
    const router = useRouter();
    const initialAd = {
        // ✅ New selects
        section: "motors",     // محركات
        subSection: "vehicles",// مركبات

        // ✅ Ad data from screenshot
        title: "سيارة لكزس RX 2025",
        country: "ياباني",          // لو عندك COUNTRIES فيها "اليابان" بدل "ياباني" غيّرها
        brand: "لكزس",
        model: "RX",
        year: "2025",
        mileage: "40000",           // أو "40,000" لو بتعرضها كنص
        governorate: "حولي",
        price: "2100",
        description:
            "للبيع او للبدل لكزس RX موديل 2011 عداد 180 وارد الساير كامل المواصفات جلد تان فتحه دخول ذكي بلوثوت خريطه بروجكتر شرط الفحص قير / مكينه /شاصي البدي يوجد اصباغ متفرقه السعر 3000/ والصامل يبشر بالخير",

        // ✅ Contact
        contactCall: true,
        contactWhats: true,

        // ✅ Existing images (placeholder path — عدّلها حسب اللي عندك من API)
        images: ["/images/main.png"],

        // (اختياري) بيانات مفيدة لو هتحتاجها في UI بتاع "منتجي"
        phone: "55558718",
        whatsapp: "55558718",
        expireText: "ينتهي في 11 يوليو 2025",
        publishedAtText: "نشر بتاريخ : 12 / 5 / 2025 - 10:32 PM",
    };


    // previews urls (existing urls + new blob urls)
    const [imagePreviews, setImagePreviews] = useState(initialAd?.images ?? []);

    const [ad, setAd] = useState({
        section: initialAd?.section ?? "",
        subSection: initialAd?.subSection ?? "",
        title: initialAd?.title ?? "",
        country: initialAd?.country ?? "",
        brand: initialAd?.brand ?? "",
        model: initialAd?.model ?? "",
        year: initialAd?.year ?? "",
        mileage: initialAd?.mileage ?? "",
        governorate: initialAd?.governorate ?? "",
        price: initialAd?.price ?? "",
        description: initialAd?.description ?? "",
        contactCall: initialAd?.contactCall ?? true,
        contactWhats: initialAd?.contactWhats ?? false,
    });

    const cleanupRef = useRef([]);

    // ✅ add images (append)
    const onPickImages = (files) => {
        if (!files || files.length === 0) return;

        const urls = Array.from(files).map((f) => {
            const u = URL.createObjectURL(f);
            cleanupRef.current.push(u);
            return u;
        });

        setImagePreviews((prev) => [...prev, ...urls]);
    };

    const onRemoveImageAt = (index) => {
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
                <div className="upper-header">
                    <Button
                        type="button"
                        variant="ghost"
                        className="back-btn"
                        onClick={() => router.back()}
                        aria-label="Back"
                    >
                        <ArrowRight />
                    </Button>

                    <h3 className="page-title">تعديل إعلان</h3>
                    <div className="empty" />
                </div>

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
