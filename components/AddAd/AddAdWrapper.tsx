'use client';

import React, { useEffect, useMemo, useState, useRef } from "react";
import UpperHeader from "@/components/General/UpperHeader";
import { Progress } from "@/components/ui/progress";

import AddAdStepOne from "./steps/AddAdStepOne";
import AddAdStepTwo from "./steps/AddAdStepTwo";
import AddAdStepThree from "./steps/AddAdStepThree";
import AddAdStepFour from "./steps/AddAdStepFour";
import AddAdStepFive from "./steps/AddAdStepFive";

import done from "@/src/images/done.gif";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetCategories, type MainCategory } from "@/src/hooks/useGetCategories";
import { fetchSubCategories, type SubCategory } from "@/src/hooks/useGetSubCategories";
import { fetchManufacturingCountries, type ManufacturingCountry } from "@/src/hooks/useGetManufacturingCountries";
import { fetchManufacturingYears, type ManufacturingYear } from "@/src/hooks/useGetManufacturingYears";
import { fetchCities, type City } from "@/src/hooks/useGetCities";
import { fetchCarBrands, type CarBrand } from "@/src/hooks/useGetCarBrands";
import { fetchCarModels, type CarModel } from "@/src/hooks/useGetCarModels";
import { usePublishAd } from "@/src/hooks/usePublishAd";
import { toast } from "sonner";

const STEP_PROGRESS = [20, 40, 60, 80, 100];

export default function AddAdWrapper() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { mutateAsync: publishAd, isPending: isPublishing } = usePublishAd();
  const { data: mainCategories = [] } = useGetCategories();
  const [subLevel2, setSubLevel2] = useState<SubCategory[]>([]);
  const [subLevel3, setSubLevel3] = useState<SubCategory[]>([]);
  const [selectedMain, setSelectedMain] = useState<MainCategory | null>(null);
  const [selectedL2, setSelectedL2] = useState<SubCategory | null>(null);
  const [selectedL3, setSelectedL3] = useState<SubCategory | null>(null);
  const leafCategory = selectedL3 || (selectedL2 && !selectedL2.has_children ? selectedL2 : null);
  const [manufacturingCountries, setManufacturingCountries] = useState<ManufacturingCountry[]>([]);
  const [manufacturingYears, setManufacturingYears] = useState<ManufacturingYear[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [carBrands, setCarBrands] = useState<CarBrand[]>([]);
  const [carModels, setCarModels] = useState<CarModel[]>([]);

  const adForm: "default" | "car" = (leafCategory?.ad_form as any) || "default";
  const hasCity = !!leafCategory?.has_city;

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [ad, setAd] = useState<any>({
    title: "",
    description: "",
    ad_price: "",
    manufacturing_country_id: "",
    year: "",
    city_id: "",
    car_brand_id: "",
    car_model_id: "",
    mileage: "",
    allow_phone: true,
    allow_whatsapp: false,
    allow_notification: false,
    type: "ad",
  });

  const [showDone, setShowDone] = useState(false);
  const doneTimerRef = useRef<number | null>(null);

  const [pinSelections, setPinSelections] = useState<Record<number, boolean>>({});

  const [agree, setAgree] = useState(false);



  useEffect(() => {
    return () => {
      if (doneTimerRef.current) window.clearTimeout(doneTimerRef.current);
      imagePreviews.forEach((url) => url.startsWith("blob:") && URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const progress = STEP_PROGRESS[step - 1] ?? 20;

  const pathTitle = useMemo(() => {
    return [selectedMain?.name, selectedL2?.name, selectedL3?.name].filter(Boolean).join(" - ");
  }, [selectedMain, selectedL2, selectedL3]);

  const title = useMemo(() => {
    if (step === 1) return "اختر الفئة";
    if (step === 2) return selectedMain?.name ?? "اختر الفئة";
    if (step === 3) return `${selectedMain?.name ?? ""} - ${selectedL2?.name ?? ""}`.trim();
    if (step === 4) return pathTitle || "بيانات الإعلان";
    return ad.title || "مراجعة ونشر";
  }, [step, selectedMain, selectedL2, pathTitle, ad.title]);

  const handleBack = () => {
    setStep((s) => (s === 1 ? 1 : s - 1));

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

  const pickMain = async (cat: MainCategory) => {
    setSelectedMain(cat);
    setSelectedL2(null);
    setSelectedL3(null);
    setSubLevel3([]);

    const initialPins: Record<number, boolean> = {};
    (cat.active_pinning_prices || []).forEach((p) => (initialPins[p.id] = false));
    setPinSelections(initialPins);

    try {
      const subs = await fetchSubCategories(cat.id);
      setSubLevel2(subs);
      setStep(2);
    } catch (e) {
      console.error(e);
    }
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
      const subs = await fetchSubCategories(cat.id);
      setSubLevel3(subs);
      setStep(3);
    } catch (e) {
      console.error(e);
    }
  };

  const pickL3 = async (cat: SubCategory) => {
    setSelectedL3(cat);

    if (!cat.has_children) {
      await preloadStepFour(cat);
      setStep(4);
      return;
    }

    // support deeper nesting in same step
    try {
      const subs = await fetchSubCategories(cat.id);
      setSubLevel3(subs);
      setSelectedL2(cat as any);
      setSelectedL3(null);
      setStep(3);
    } catch (e) {
      console.error(e);
    }
  };

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
    } catch (e) {
      console.error(e);
    }
  };

  const onCarBrandChange = async (brandId: string) => {
    if (!brandId) {
      setCarModels([]);
      return;
    }
    try {
      const models = await fetchCarModels(brandId);
      setCarModels(models);
    } catch (e) {
      console.error(e);
    }
  };

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
    setImageFiles((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  const clearImages = () => {
    setImagePreviews((prev) => {
      prev.forEach((url) => url.startsWith("blob:") && URL.revokeObjectURL(url));
      return [];
    });
    setImageFiles([]);
  };

  const handlePublish = async () => {
    try {
      if (!leafCategory?.id) throw new Error("Missing final category");

      const response = await publishAd({
        categoryId: leafCategory.id,
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
        hasCityField: hasCity,
        pinSelections,
        adForm,
        carBrandId: ad.car_brand_id,
        carModelId: ad.car_model_id,
        mileage: ad.mileage,
      });

      if (response?.data?.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        setShowDone(true);
        if (doneTimerRef.current) window.clearTimeout(doneTimerRef.current);
        doneTimerRef.current = window.setTimeout(() => router.push("/"), 3000);
      }

    } catch (e) {
      console.error(e);
      toast.error("حدث خطأ أثناء نشر الإعلان");
    }
  };

  return (
    <section className="content-section">
      {showDone && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div dir="rtl" className="w-full max-w-96 rounded-xl bg-white px-6 py-4 text-center shadow-2xl">
            <div className="mx-auto mb-6 h-[160px] w-[160px]">
              <Image src={done} alt="done" className="h-full w-full object-contain" priority />
            </div>

            <h2 className="text-base font-bold text-zinc-900 md:text-xl">تم نشر إعلانك بنجاح</h2>
          </div>
        </div>
      )}
      <div className="container">
        <UpperHeader
          title="إضافة إعلان"
          onBack={handleBack}
          backDisabled={step === 1}
        />

        <div className="add-progress">
          <Progress value={progress} />
        </div>

        <h4 className="progress-name">{title}</h4>

        {step === 1 && <AddAdStepOne options={mainCategories} selectedId={selectedMain?.id ?? null} onPick={pickMain} />}

        {step === 2 && <AddAdStepTwo options={subLevel2} selectedId={selectedL2?.id ?? null} onPick={pickL2} />}

        {step === 3 && <AddAdStepThree options={subLevel3} selectedId={selectedL3?.id ?? null} onPick={pickL3} />}

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

        {step === 5 && (
          <AddAdStepFive
            sel={{ level1: selectedMain, level2: selectedL2, level3: selectedL3 }}
            ad={ad}
            imagePreview={imagePreviews[0]}
            addons={pinSelections}
            setAddons={setPinSelections}
            agree={agree}
            setAgree={setAgree}
            onPublish={handlePublish}
            termsHref="/terms"
            mainCategory={selectedMain}
            isPublishing={isPublishing}
          />
        )}
      </div>
    </section>
  );
}
