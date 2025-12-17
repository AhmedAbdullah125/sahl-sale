"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import AddAdStepOne from "./steps/AddAdStepOne";
import AddAdStepTwo from "./steps/AddAdStepTwo";
import AddAdStepThree from "./steps/AddAdStepThree";
import AddAdStepFour from "./steps/AddAdStepFour";
import AddAdStepFive from "./steps/AddAdStepFive";

import vehicles from "@/src/images/category/vehicles.png";
import estate from "@/src/images/category/estate.png";
import electronics from "@/src/images/category/electronics.png";
import BuySell from "@/src/images/category/Buy&sell.png";
import contracting from "@/src/images/category/Contracting.png";

import done from "@/src/images/done.gif";
import Image from "next/image";
import { useRouter } from "next/navigation";

const STEP_PROGRESS = [20, 40, 60, 80, 100];

export const LEVEL1 = [
  { id: "motors", label: "محركات", img: vehicles },
  { id: "estate", label: "عقارات", img: estate },
  { id: "electronics", label: "الكترونيات", img: electronics },
  { id: "buysell", label: "بيع وشراء", img: BuySell },
  { id: "contracting", label: "مقاولات وحرف", img: contracting },
];

export const LEVEL2_BY_L1 = {
  motors: [
    { id: "vehicles", label: "مركبات", img: vehicles },
    { id: "bikes", label: "الدراجات النارية", img: estate },
    { id: "marine", label: "القسم البحري", img: electronics },
  ],
  estate: [
    { id: "sale", label: "للبيع", img: estate },
    { id: "rent", label: "للإيجار", img: estate },
    { id: "rooms", label: "غرف/مشاركة", img: estate },
  ],
  electronics: [
    { id: "laptops", label: "لابتوبات", img: electronics },
    { id: "mobiles", label: "جوالات", img: electronics },
    { id: "accessories", label: "ملحقات", img: electronics },
  ],
  buysell: [
    { id: "general", label: "بيع وشراء", img: BuySell },
    { id: "furniture", label: "أثاث", img: BuySell },
    { id: "animals", label: "حيوانات", img: BuySell },
  ],
  contracting: [
    { id: "services", label: "خدمات", img: contracting },
    { id: "jobs", label: "وظائف", img: contracting },
    { id: "handy", label: "حرفيين", img: contracting },
  ],
};

export const LEVEL3_BY_L2 = {
  vehicles: [
    { id: "cars_sale", label: "سيارات للبيع", img: vehicles },
    { id: "parts", label: "قطع غيار وإكسسوارات", img: vehicles },
    { id: "rent", label: "سيارات للإيجار", img: vehicles },
  ],
  bikes: [
    { id: "bikes_sale", label: "دراجات للبيع", img: estate },
    { id: "bikes_parts", label: "قطع غيار", img: estate },
    { id: "bikes_rent", label: "للإيجار", img: estate },
  ],
  marine: [
    { id: "boats", label: "قوارب", img: electronics },
    { id: "jetski", label: "جيت سكي", img: electronics },
    { id: "marine_parts", label: "قطع بحرية", img: electronics },
  ],
};

export const COUNTRIES = ["ياباني", "أمريكي", "ألماني", "كوري"];
export const BRANDS = ["تويوتا", "لكزس", "نيسان", "هوندا"];
export const MODELS = ["كامري", "كورولا", "لاندكروزر", "RX"];
export const YEARS = Array.from({ length: 15 }, (_, i) => String(2025 - i));
export const GOVERNORATES = ["الكويت", "حولي", "الأحمدي", "الفروانية"];

export default function AddAdWrapper() {
  const [step, setStep] = useState(1);
  const [sel, setSel] = useState({});
  const router = useRouter();

  const [imagePreviews, setImagePreviews] = useState([]);
  const [ad, setAd] = useState({
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
  const [showDone, setShowDone] = useState(false);
  const doneTimerRef = useRef(null);

  const handlePublish = async () => {
    // TODO: await your API publish here
    // await fetch(...)

    setShowDone(true);

    if (doneTimerRef.current) window.clearTimeout(doneTimerRef.current);
    doneTimerRef.current = window.setTimeout(() => {
      router.push("/");
    }, 3000);
  };

  const [addons, setAddons] = useState({
    pinHome: false,
    pinCarsSale: false,
    pinLandCruiser: false,
    pinToyota: false,
  });

  const [agree, setAgree] = useState(false);

  useEffect(() => {
    return () => {
      if (doneTimerRef.current) window.clearTimeout(doneTimerRef.current);

      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviews]);

  const progress = STEP_PROGRESS[step - 1] ?? 20;

  const pathTitle = useMemo(() => {
    return [sel.level1?.label, sel.level2?.label, sel.level3?.label]
      .filter(Boolean)
      .join(" - ");
  }, [sel]);

  const step5Title = useMemo(() => {
    const parts = [
      sel.level1?.label,
      sel.level3?.label || sel.level2?.label,
      ad.country,
      ad.brand,
      ad.model,
      ad.year,
    ].filter(Boolean);
    return parts.join(" - ");
  }, [sel, ad]);

  const title = useMemo(() => {
    if (step === 1) return "اختر الفئة";
    if (step === 2) return sel.level1?.label ?? "اختر الفئة";
    if (step === 3)
      return `${sel.level1?.label ?? ""} - ${sel.level2?.label ?? ""}`.trim();
    if (step === 4) return pathTitle || "بيانات الإعلان";
    return step5Title || "مراجعة ونشر";
  }, [step, sel, pathTitle, step5Title]);

  const handleBack = () => {
    setStep((s) => (s === 1 ? 1 : s - 1));
    setSel((prev) => {
      if (step === 2) return { level1: undefined };
      if (step === 3) return { ...prev, level3: undefined };
      return prev;
    });
  };

  const pickLevel1 = (opt) => {
    setSel({ level1: opt, level2: undefined, level3: undefined });
    setStep(2);
  };
  const pickLevel2 = (opt) => {
    setSel((p) => ({ ...p, level2: opt, level3: undefined }));
    setStep(3);
  };
  const pickLevel3 = (opt) => {
    setSel((p) => ({ ...p, level3: opt }));
    setStep(4);
  };

  const onPickImages = (files) => {
    if (!files || files.length === 0) return;

    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...urls]); // append
  };

  const removeImageAt = (index) => {
    setImagePreviews((prev) => {
      const copy = [...prev];
      const url = copy[index];
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      copy.splice(index, 1);
      return copy;
    });
  };

  const clearImages = () => {
    setImagePreviews((prev) => {
      prev.forEach((url) => url.startsWith("blob:") && URL.revokeObjectURL(url));
      return [];
    });
  };


  return (
    <section className="content-section">
      {showDone && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div
            dir="rtl"
            className="w-full max-w-96 rounded-xl bg-white px-6 py-4 text-center shadow-2xl"
          >
            <div className="mx-auto mb-6 h-[160px] w-[160px]">
              <Image
                src={done}
                alt="done"
                className="h-full w-full object-contain"
                priority
              />
            </div>

            <h2 className="text-base font-bold text-zinc-900 md:text-xl">
              تم نشر إعلانك بنجاح
            </h2>
          </div>
        </div>
      )}
      <div className="container">
        <div className="upper-header">
          <Button
            type="button"
            variant="ghost"
            className="back-btn"
            onClick={handleBack}
            disabled={step === 1}
            aria-label="Back"
          >
            <ArrowRight />
          </Button>

          <h3 className="page-title">إضافة إعلان</h3>
          <div className="empty" />
        </div>

        <div className="add-progress">
          <Progress value={progress} />
        </div>

        <h4 className="progress-name">{title}</h4>

        {step === 1 && <AddAdStepOne selected={sel.level1} onPick={pickLevel1} ad={ad} setAd={setAd} />}
        {step === 2 && (
          <AddAdStepTwo
            level1={sel.level1}
            selected={sel.level2}
            onPick={pickLevel2}
            ad={ad}
            setAd={setAd}
          />
        )}
        {step === 3 && (
          <AddAdStepThree
            level2={sel.level2}
            selected={sel.level3}
            onPick={pickLevel3}
            ad={ad}
            setAd={setAd}
          />
        )}

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
            COUNTRIES={COUNTRIES}
            BRANDS={BRANDS}
            MODELS={MODELS}
            YEARS={YEARS}
            GOVERNORATES={GOVERNORATES}
          />
        )}

        {step === 5 && (
          <AddAdStepFive
            sel={sel}
            ad={ad}
            imagePreview={imagePreviews[0]}
            addons={addons}
            setAddons={setAddons}
            agree={agree}
            setAgree={setAgree}
            onPublish={handlePublish}
            termsHref="#"
          />
        )}
      </div>
    </section>
  );
}
