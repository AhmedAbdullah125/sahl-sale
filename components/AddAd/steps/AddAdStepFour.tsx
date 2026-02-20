'use client';

import React, { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { CirclePlus, Trash2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import logo from "@/src/images/logo.svg";
import phoneIcon from "@/src/images/phone-icon.png";
import whatsIcon from "@/src/images/whats-icon.png";

import { makeAddAdStepFourSchema, AddAdStepFourValues } from "./schemas/add-ad.schema";

type Option = { id: number; name: string };
type YearOpt = { value: number; label: string };

export default function AddAdStepFour({
  imagePreviews,
  onPickImages,
  onRemoveImageAt,
  onClearImages,
  ad,
  setAd,
  onNext,
  adForm,
  hasCity,
  manufacturingCountries,
  manufacturingYears,
  cities,
  carBrands,
  carModels,
  onCarBrandChange,
}: {
  pathTitle?: string;
  imagePreviews: string[];
  onPickImages: (files: FileList | null) => void;
  onRemoveImageAt: (index: number) => void;
  onClearImages?: () => void;
  ad: any;
  setAd: any;
  onNext: () => void;

  adForm: "default" | "car";
  hasCity: boolean;

  manufacturingCountries: Option[];
  manufacturingYears: YearOpt[];
  cities: Option[];

  carBrands: Option[];
  carModels: Option[];
  onCarBrandChange: (brandId: string) => void;
}) {
  const titleMax = 27;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const defaultValues = useMemo<AddAdStepFourValues>(() => {
    return {
      images: imagePreviews ?? [],
      title: ad.title ?? "",

      manufacturing_country_id: ad.manufacturing_country_id ?? "",
      year: ad.year ?? "",
      city_id: ad.city_id ?? "",

      car_brand_id: ad.car_brand_id ?? "",
      car_model_id: ad.car_model_id ?? "",
      mileage: ad.mileage ?? "",

      ad_price: ad.ad_price ?? "",
      description: ad.description ?? "",

      allow_phone: ad.allow_phone ?? true,
      allow_whatsapp: ad.allow_whatsapp ?? false,
      allow_notification: ad.allow_notification ?? false,
    };
  }, [ad, imagePreviews]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<AddAdStepFourValues>({
    resolver: zodResolver(makeAddAdStepFourSchema(adForm)),
    defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    setValue("images", imagePreviews ?? [], { shouldValidate: false });
  }, [imagePreviews, setValue]);

  useEffect(() => {
    const sub = watch((v) => setAd((p: any) => ({ ...p, ...v })));
    return () => sub.unsubscribe();
  }, [watch, setAd]);

  const images = watch("images") || [];
  const title = watch("title") || "";

  const onSubmit = async (values: AddAdStepFourValues) => {
    if (hasCity && !values.city_id) {
      setError("city_id", { type: "manual", message: "اختر المحافظة" });
      return;
    } else {
      clearErrors("city_id");
    }

    if (adForm === "car") {
      if (!values.car_brand_id) {
        setError("car_brand_id", { type: "manual", message: "اختر الماركة" });
        return;
      }
      if (!values.car_model_id) {
        setError("car_model_id", { type: "manual", message: "اختر الموديل" });
        return;
      }
    }

    setAd((p: any) => ({ ...p, ...values }));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <span className="upload-text">الصور</span>

      <div className="image-upload">
        <label className="upload-box">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={async (e) => {
              onPickImages(e.target.files);
              e.currentTarget.value = "";
              setTimeout(() => trigger("images"), 0);
            }}
          />

          <Image src={logo} alt="logo" className="upload-logo" />

          <div className="upload-btn">
            <CirclePlus className="h-5 w-5" />
            أضف الصور
          </div>
        </label>

        {errors.images?.message ? <p className="mt-2 text-sm text-red-500">{errors.images.message}</p> : null}

        <div className={images.length ? "mt-3 w-full" : "hidden"}>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {imagePreviews?.map((src, idx) => (
              <div key={`${src}-${idx}`} className="relative overflow-hidden rounded-md border">
                <Image src={src} alt={`preview-${idx + 1}`} width={200} height={140} className="h-24 w-full object-cover" unoptimized />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={async (e) => {
                    e.preventDefault();
                    onRemoveImageAt(idx);
                    setTimeout(() => trigger("images"), 0);
                  }}
                  aria-label="Remove image"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>

          {typeof onClearImages === "function" && images.length > 1 ? (
            <button
              type="button"
              className="mt-2 text-sm underline"
              onClick={async (e) => {
                e.preventDefault();
                onClearImages();
                setTimeout(() => trigger("images"), 0);
              }}
            >
              حذف الكل
            </button>
          ) : null}
        </div>
      </div>

      {/* Title */}
      <div className="form-group">
        <label className="form-label">عنوان الاعلان</label>
        <Input className="form-input" placeholder="ادخل عنوان الاعلان" maxLength={titleMax} {...register("title")} />
        <span className="word-count">
          {title.length}/{titleMax}
        </span>
        {errors.title?.message ? <p className="mt-1 text-sm text-red-500">{errors.title.message}</p> : null}
      </div>

      <div className="form-grid">
        {adForm === "car" ? (
          <div className="form-group">
            <label className="form-label">بلد الصنع</label>
            <Select
              value={watch("manufacturing_country_id") || ""}
              onValueChange={(v) => setValue("manufacturing_country_id", v, { shouldValidate: true })}
            >
              <SelectTrigger className="form-input">
                <SelectValue placeholder="اختر بلد الصنع" />
              </SelectTrigger>
              <SelectContent>
                {manufacturingCountries.map((x) => (
                  <SelectItem key={x.id} value={String(x.id)}>
                    {x.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.manufacturing_country_id?.message ? (
              <p className="mt-1 text-sm text-red-500">{errors.manufacturing_country_id.message}</p>
            ) : null}
          </div>
        ) : null}
        {adForm === "car" ? (
          <div className="form-group">
            <label className="form-label">سنة الصنع</label>
            <Select value={watch("year") || ""} onValueChange={(v) => setValue("year", v, { shouldValidate: true })}>
              <SelectTrigger className="form-input">
                <SelectValue placeholder="اختر سنة الصنع" />
              </SelectTrigger>
              <SelectContent>
                {manufacturingYears.map((x) => (
                  <SelectItem key={x.value} value={String(x.value)}>
                    {x.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.year?.message ? <p className="mt-1 text-sm text-red-500">{errors.year.message}</p> : null}
          </div>
        ) : null}
        {hasCity ? (
          <div className="form-group">
            <label className="form-label">المحافظة</label>
            <Select value={watch("city_id") || ""} onValueChange={(v) => setValue("city_id", v, { shouldValidate: true })}>
              <SelectTrigger className="form-input">
                <SelectValue placeholder="اختر المحافظة" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((x) => (
                  <SelectItem key={x.id} value={String(x.id)}>
                    {x.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city_id?.message ? <p className="mt-1 text-sm text-red-500">{errors.city_id.message}</p> : null}
          </div>
        ) : null}

        {adForm === "car" ? (
          <>
            <div className="form-group">
              <label className="form-label">الماركة</label>
              <Select
                value={watch("car_brand_id") || ""}
                onValueChange={(v) => {
                  setValue("car_brand_id", v, { shouldValidate: true });
                  setValue("car_model_id", "", { shouldValidate: true });
                  onCarBrandChange(v);
                }}
              >
                <SelectTrigger className="form-input">
                  <SelectValue placeholder="اختر الماركة" />
                </SelectTrigger>
                <SelectContent>
                  {carBrands.map((x) => (
                    <SelectItem key={x.id} value={String(x.id)}>
                      {x.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.car_brand_id?.message ? <p className="mt-1 text-sm text-red-500">{errors.car_brand_id.message}</p> : null}
            </div>

            <div className="form-group">
              <label className="form-label">الموديل</label>
              <Select value={watch("car_model_id") || ""} onValueChange={(v) => setValue("car_model_id", v, { shouldValidate: true })}>
                <SelectTrigger className="form-input">
                  <SelectValue placeholder="اختر الموديل" />
                </SelectTrigger>
                <SelectContent>
                  {carModels.map((x) => (
                    <SelectItem key={x.id} value={String(x.id)}>
                      {x.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.car_model_id?.message ? <p className="mt-1 text-sm text-red-500">{errors.car_model_id.message}</p> : null}
            </div>

            <div className="form-group">
              <label className="form-label">
                الممشى <span>( اختياري )</span>
              </label>
              <Input className="form-input" placeholder="ادخل الممشى" {...register("mileage")} />
            </div>
          </>
        ) : null}

        <div className="form-group">
          <label className="form-label">
            السعر <span>( اختياري )</span>
          </label>
          <Input className="form-input" type="number" placeholder="ادخل السعر بالدينار الكويتي" {...register("ad_price")} />
          {errors.ad_price?.message ? <p className="mt-1 text-sm text-red-500">{errors.ad_price.message}</p> : null}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">الوصف</label>
        <Textarea className="form-input" placeholder="ادخل وصف الاعلان" {...register("description")} />
        {errors.description?.message ? <p className="mt-1 text-sm text-red-500">{errors.description.message}</p> : null}
      </div>

      <div className="form-group">
        <label className="form-label">وسيلة الاتصال</label>

        <div className="form-contact">
          <label className={`pill pill-btn ${watch("allow_phone") ? "active" : ""}`}>
            <span className="icon-text">
              <Image src={phoneIcon} alt="icon" />
              <span className="text">اتصال</span>
            </span>

            <input
              type="checkbox"
              checked={!!watch("allow_phone")}
              onChange={(e) => setValue("allow_phone", e.target.checked, { shouldValidate: true })}
            />
            <span className="switch" />
          </label>

          <label className={`pill pill-btn ${watch("allow_whatsapp") ? "active" : ""}`}>
            <span className="icon-text">
              <Image src={whatsIcon} alt="icon" />
              <span className="text">واتساب</span>
            </span>

            <input
              type="checkbox"
              checked={!!watch("allow_whatsapp")}
              onChange={(e) => setValue("allow_whatsapp", e.target.checked, { shouldValidate: true })}
            />
            <span className="switch" />
          </label>

          <label className={`pill pill-btn ${watch("allow_notification") ? "active" : ""}`}>
            <span className="icon-text">
              <span className="text">إشعارات</span>
            </span>

            <input
              type="checkbox"
              checked={!!watch("allow_notification")}
              onChange={(e) => setValue("allow_notification", e.target.checked, { shouldValidate: true })}
            />
            <span className="switch" />
          </label>
        </div>
      </div>

      <button className="form-btn" type="submit">
        التالي
      </button>
    </form>
  );
}
