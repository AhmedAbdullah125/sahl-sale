'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";

import UpperHeader from "@/components/General/UpperHeader";
import { Progress } from "@/components/ui/progress";
import AddAdStepFour from "@/components/AddAd/steps/AddAdStepFour";
import AddAdStepFive from "@/components/AddAd/steps/AddAdStepFive";

import done from "@/src/images/done.gif";

import { useGetCategories, type MainCategory } from "@/src/hooks/useGetCategories";
import { fetchManufacturingCountries, type ManufacturingCountry } from "@/src/hooks/useGetManufacturingCountries";
import { fetchManufacturingYears, type ManufacturingYear } from "@/src/hooks/useGetManufacturingYears";
import { fetchCities, type City } from "@/src/hooks/useGetCities";
import { fetchCarBrands, type CarBrand } from "@/src/hooks/useGetCarBrands";
import { fetchCarModels, type CarModel } from "@/src/hooks/useGetCarModels";
import { useHandlePublishAuction } from "@/src/hooks/useHandlePublishAuction";

const STEP_PROGRESS = [50, 100];
const AUCTION_CATEGORY_ID = 3;

export default function AddAuctionWrapper() {
    const { handlePublish, isPublishing, doneTimerRef } = useHandlePublishAuction();

    // ── Category ───────────────────────────────────────────────────────────────
    const { data: mainCategories = [] } = useGetCategories();
    const [auctionCategory, setAuctionCategory] = useState<MainCategory | null>(null);

    useEffect(() => {
        if (!mainCategories.length) return;
        const car = mainCategories[0] ?? null;
        setAuctionCategory(car);
        const initialPins: Record<number, boolean> = {};
        (car?.active_pinning_prices ?? []).forEach((p) => (initialPins[p.id] = false));
        setPinSelections(initialPins);
    }, [mainCategories]);

    // ── Data loading ───────────────────────────────────────────────────────────
    const [manufacturingCountries, setManufacturingCountries] = useState<ManufacturingCountry[]>([]);
    const [manufacturingYears, setManufacturingYears] = useState<ManufacturingYear[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [carBrands, setCarBrands] = useState<CarBrand[]>([]);
    const [carModels, setCarModels] = useState<CarModel[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [countries, years, brands, c] = await Promise.all([
                    fetchManufacturingCountries(),
                    fetchManufacturingYears(),
                    fetchCarBrands(),
                    fetchCities(),
                ]);
                setManufacturingCountries(countries);
                setManufacturingYears(years);
                setCarBrands(brands);
                setCities(c);
            } catch (e) { console.error(e); }
        };
        load();
    }, []);

    const onCarBrandChange = async (brandId: string) => {
        if (!brandId) { setCarModels([]); return; }
        try {
            const models = await fetchCarModels(brandId);
            setCarModels(models);
        } catch (e) { console.error(e); }
    };

    // ── Images ─────────────────────────────────────────────────────────────────
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const onPickImages = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const list = Array.from(files);
        const urls = list.map((f) => URL.createObjectURL(f));
        setImageFiles((prev) => [...prev, ...list]);
        setImagePreviews((prev) => [...prev, ...urls]);
    };

    const removeImageAt = (index: number) => {
        setImagePreviews((prev) => {
            const copy = [...prev];
            const url = copy[index];
            if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
            copy.splice(index, 1);
            return copy;
        });
        setImageFiles((prev) => { const copy = [...prev]; copy.splice(index, 1); return copy; });
    };

    const clearImages = () => {
        setImagePreviews((prev) => { prev.forEach((url) => url.startsWith("blob:") && URL.revokeObjectURL(url)); return []; });
        setImageFiles([]);
    };

    // ── Ad state ───────────────────────────────────────────────────────────────
    const [ad, setAd] = useState<any>({
        title: "", description: "", ad_price: "",
        manufacturing_country_id: "", year: "", city_id: "",
        car_brand_id: "", car_model_id: "", mileage: "",
        allow_phone: true, allow_whatsapp: false, allow_notification: false,
    });

    // ── Step & addons ──────────────────────────────────────────────────────────
    const [step, setStep] = useState(1);
    const [pinSelections, setPinSelections] = useState<Record<number, boolean>>({});
    const [agree, setAgree] = useState(false);
    const [showDone, setShowDone] = useState(false);

    const progress = STEP_PROGRESS[step - 1] ?? 50;

    // ── Cleanup ────────────────────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            if (doneTimerRef.current) window.clearTimeout(doneTimerRef.current);
            imagePreviews.forEach((url) => url.startsWith("blob:") && URL.revokeObjectURL(url));
        };
    }, [doneTimerRef, imagePreviews]);

    return (
        <section className="content-section" dir="rtl">
            {showDone && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-96 rounded-xl bg-white px-6 py-4 text-center shadow-2xl">
                        <div className="mx-auto mb-6 h-[160px] w-[160px]">
                            <Image src={done} alt="done" className="h-full w-full object-contain" priority />
                        </div>
                        <h2 className="text-base font-bold text-zinc-900 md:text-xl">تم نشر مزادك بنجاح</h2>
                    </div>
                </div>
            )}

            <div className="container">
                <UpperHeader
                    title="إضافة مزاد"
                    onBack={() => setStep((s) => Math.max(1, s - 1))}
                    backDisabled={step === 1}
                />

                <div className="add-progress">
                    <Progress value={progress} />
                </div>

                <h4 className="progress-name">
                    {step === 1 ? "بيانات المزاد" : ad.title || "مراجعة ونشر"}
                </h4>

                {step === 1 && (
                    <AddAdStepFour
                        imagePreviews={imagePreviews}
                        onPickImages={onPickImages}
                        onRemoveImageAt={removeImageAt}
                        onClearImages={clearImages}
                        ad={ad}
                        setAd={setAd}
                        onNext={() => setStep(2)}
                        adForm="car"
                        hasCity={true}
                        manufacturingCountries={manufacturingCountries}
                        manufacturingYears={manufacturingYears}
                        cities={cities}
                        carBrands={carBrands}
                        carModels={carModels}
                        onCarBrandChange={onCarBrandChange}
                    />
                )}

                {step === 2 && (
                    <AddAdStepFive
                        sel={{ level1: auctionCategory }}
                        ad={ad}
                        imagePreview={imagePreviews[0]}
                        addons={pinSelections}
                        setAddons={setPinSelections}
                        agree={agree}
                        setAgree={setAgree}
                        onPublish={() =>
                            handlePublish({
                                ad,
                                imageFiles,
                                pinSelections,
                                categoryId: AUCTION_CATEGORY_ID,
                                hasCityField: true,
                                onSuccess: () => setShowDone(true),
                                onPaymentRedirect: (url) => { window.location.href = url; },
                            })
                        }
                        termsHref="#"
                        mainCategory={auctionCategory}
                        isPublishing={isPublishing}
                        isAuction={true}
                    />
                )}
            </div>
        </section>
    );
}
