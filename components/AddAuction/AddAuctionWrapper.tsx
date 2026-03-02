'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import UpperHeader from "@/components/General/UpperHeader";
import { Progress } from "@/components/ui/progress";
import AddAdStepOne from "@/components/AddAd/steps/AddAdStepOne";
import AddAdStepTwo from "@/components/AddAd/steps/AddAdStepTwo";
import AddAdStepThree from "@/components/AddAd/steps/AddAdStepThree";
import AddAdStepFour from "@/components/AddAd/steps/AddAdStepFour";
import AddAdStepFive from "@/components/AddAd/steps/AddAdStepFive";

import done from "@/src/images/done.gif";

import { useGetAuctionTopCategories, type MainCategory } from "@/src/hooks/useGetCategories";
import { fetchAuctionSubCategories, type SubCategory } from "@/src/hooks/useGetSubCategories";
import { fetchManufacturingCountries, type ManufacturingCountry } from "@/src/hooks/useGetManufacturingCountries";
import { fetchManufacturingYears, type ManufacturingYear } from "@/src/hooks/useGetManufacturingYears";
import { fetchCities, type City } from "@/src/hooks/useGetCities";
import { fetchCarBrands, type CarBrand } from "@/src/hooks/useGetCarBrands";
import { fetchCarModels, type CarModel } from "@/src/hooks/useGetCarModels";
import { useHandlePublishAuction } from "@/src/hooks/useHandlePublishAuction";

const STEP_PROGRESS = [20, 40, 60, 80, 100];

export default function AddAuctionWrapper() {
    const router = useRouter();
    const { handlePublish, isPublishing, doneTimerRef } = useHandlePublishAuction();

    // ── Categories (cascading) ─────────────────────────────────────────────────
    const { data: mainCategories = [], isLoading: categoriesLoading } = useGetAuctionTopCategories();
    const [subLevel2, setSubLevel2] = useState<SubCategory[]>([]);
    const [subLevel3, setSubLevel3] = useState<SubCategory[]>([]);
    const [selectedMain, setSelectedMain] = useState<MainCategory | null>(null);
    const [selectedL2, setSelectedL2] = useState<SubCategory | null>(null);
    const [selectedL3, setSelectedL3] = useState<SubCategory | null>(null);

    // The leaf is the deepest selected category that has no more children
    const leafCategory = selectedL3 || (selectedL2 && !selectedL2.has_children ? selectedL2 : null);

    // ── Data loading ───────────────────────────────────────────────────────────
    const [manufacturingCountries, setManufacturingCountries] = useState<ManufacturingCountry[]>([]);
    const [manufacturingYears, setManufacturingYears] = useState<ManufacturingYear[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [carBrands, setCarBrands] = useState<CarBrand[]>([]);
    const [carModels, setCarModels] = useState<CarModel[]>([]);

    // ── Images ─────────────────────────────────────────────────────────────────
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

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

    const progress = STEP_PROGRESS[step - 1] ?? 20;

    // ── Derived display title ──────────────────────────────────────────────────
    const pathTitle = useMemo(() => {
        return [selectedMain?.name, selectedL2?.name, selectedL3?.name].filter(Boolean).join(" - ");
    }, [selectedMain, selectedL2, selectedL3]);

    const title = useMemo(() => {
        if (step === 1) return "اختر الفئة";
        if (step === 2) return selectedMain?.name ?? "اختر الفئة";
        if (step === 3) return `${selectedMain?.name ?? ""} - ${selectedL2?.name ?? ""}`.trim();
        if (step === 4) return pathTitle || "بيانات المزاد";
        return ad.title || "مراجعة ونشر";
    }, [step, selectedMain, selectedL2, pathTitle, ad.title]);

    // ── Cleanup ────────────────────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            if (doneTimerRef.current) window.clearTimeout(doneTimerRef.current);
            imagePreviews.forEach((url) => url.startsWith("blob:") && URL.revokeObjectURL(url));
        };
    }, [doneTimerRef, imagePreviews]);

    // ── Navigation ─────────────────────────────────────────────────────────────
    const handleBack = () => {
        if (step === 1) return;
        setStep((s) => s - 1);
        if (step === 2) {
            setSelectedMain(null);
            setSubLevel2([]);
            setSelectedL2(null);
            setSubLevel3([]);
            setSelectedL3(null);
        } else if (step === 3) {
            setSelectedL2(null);
            setSubLevel3([]);
            setSelectedL3(null);
        } else if (step === 4) {
            if (selectedL3) setSelectedL3(null);
            else setSelectedL2(null);
        }
    };

    // ── Preload step-4 data when leaf is selected ──────────────────────────────
    const preloadStepFour = async (leaf: SubCategory) => {
        try {
            const [countries, years] = await Promise.all([
                fetchManufacturingCountries(),
                fetchManufacturingYears(),
            ]);
            setManufacturingCountries(countries);
            setManufacturingYears(years);

            if (leaf.has_city) {
                const c = await fetchCities();
                setCities(c);
            } else {
                setCities([]);
                setAd((p: any) => ({ ...p, city_id: "" }));
            }

            if (leaf.ad_form === "car") {
                const brands = await fetchCarBrands();
                setCarBrands(brands);
            } else {
                setCarBrands([]);
                setCarModels([]);
                setAd((p: any) => ({ ...p, car_brand_id: "", car_model_id: "", mileage: "" }));
            }
        } catch (e) { console.error(e); }
    };

    // ── Category pickers ───────────────────────────────────────────────────────
    const pickMain = async (cat: MainCategory) => {
        setSelectedMain(cat);
        setSelectedL2(null);
        setSelectedL3(null);
        setSubLevel3([]);

        const initialPins: Record<number, boolean> = {};
        (cat.active_pinning_prices || []).forEach((p) => (initialPins[p.id] = false));
        setPinSelections(initialPins);

        if (!cat.has_children) {
            // Treat top-level as leaf (shouldn't normally happen for auctions)
            setStep(4);
            return;
        }

        try {
            const subs = await fetchAuctionSubCategories(cat.id);
            setSubLevel2(subs);
            setStep(2);
        } catch (e) { console.error(e); }
    };

    const pickL2 = async (cat: SubCategory) => {
        setSelectedL2(cat);
        setSelectedL3(null);

        if (!cat.has_children) {
            await preloadStepFour(cat);
            setStep(4);
            return;
        }

        try {
            const subs = await fetchAuctionSubCategories(cat.id);
            setSubLevel3(subs);
            setStep(3);
        } catch (e) { console.error(e); }
    };

    const pickL3 = async (cat: SubCategory) => {
        setSelectedL3(cat);

        if (!cat.has_children) {
            await preloadStepFour(cat);
            setStep(4);
            return;
        }

        // Support deeper nesting in the same step
        try {
            const subs = await fetchAuctionSubCategories(cat.id);
            setSubLevel3(subs);
            setSelectedL2(cat as any);
            setSelectedL3(null);
            setStep(3);
        } catch (e) { console.error(e); }
    };

    // ── Car brand → models ─────────────────────────────────────────────────────
    const onCarBrandChange = async (brandId: string) => {
        if (!brandId) { setCarModels([]); return; }
        try {
            const models = await fetchCarModels(brandId);
            setCarModels(models);
        } catch (e) { console.error(e); }
    };

    // ── Images ─────────────────────────────────────────────────────────────────
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

    const adForm: "default" | "car" = (leafCategory?.ad_form as any) || "car";
    const hasCity = !!leafCategory?.has_city;

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
                    onBack={handleBack}
                    backDisabled={step === 1}
                />

                <div className="add-progress">
                    <Progress value={progress} />
                </div>

                <h4 className="progress-name">{title}</h4>

                {/* Step 1: Top-level auction categories */}
                {step === 1 && (
                    categoriesLoading
                        ? <div className="flex justify-center py-10"><span className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>
                        : <AddAdStepOne options={mainCategories} selectedId={selectedMain?.id ?? null} onPick={pickMain} />
                )}

                {/* Step 2: Sub-categories (level 2) */}
                {step === 2 && <AddAdStepTwo options={subLevel2} selectedId={selectedL2?.id ?? null} onPick={pickL2} />}

                {/* Step 3: Sub-categories (level 3+) */}
                {step === 3 && <AddAdStepThree options={subLevel3} selectedId={selectedL3?.id ?? null} onPick={pickL3} />}

                {/* Step 4: Ad form */}
                {step === 4 && (
                    <AddAdStepFour
                        pathTitle={pathTitle}
                        imagePreviews={imagePreviews}
                        onPickImages={onPickImages}
                        onRemoveImageAt={removeImageAt}
                        onClearImages={clearImages}
                        ad={ad}
                        setAd={setAd}
                        onNext={() => setStep(5)}
                        adForm={adForm}
                        hasCity={hasCity}
                        manufacturingCountries={manufacturingCountries}
                        manufacturingYears={manufacturingYears}
                        cities={cities}
                        carBrands={carBrands}
                        carModels={carModels}
                        onCarBrandChange={onCarBrandChange}
                    />
                )}

                {/* Step 5: Review & publish */}
                {step === 5 && (
                    <AddAdStepFive
                        sel={{ level1: selectedMain, level2: selectedL2, level3: selectedL3 }}
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
                                categoryId: leafCategory?.id ?? 0,
                                hasCityField: hasCity,
                                onSuccess: () => setShowDone(true),
                                onPaymentRedirect: (url) => { window.location.href = url; },
                            })
                        }
                        termsHref="/terms"
                        mainCategory={selectedMain}
                        isPublishing={isPublishing}
                        isAuction={true}
                    />
                )}
            </div>
        </section>
    );
}
