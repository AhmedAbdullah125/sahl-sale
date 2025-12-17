"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { CirclePlus, Trash2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import logo from "@/src/images/logo.svg";
import phoneIcon from "@/src/images/phone-icon.png";
import whatsIcon from "@/src/images/whats-icon.png";


import { AddAdStepFourSchema } from "./schemas/add-ad.schema";

export default function AddAdStepFour({
    imagePreviews,        // string[]
    onPickImages,         // (files: FileList | null) => void
    onRemoveImageAt,      // (index: number) => void
    onClearImages,        // () => void (optional)
    ad,
    setAd,
    onNext,
    COUNTRIES,
    BRANDS,
    MODELS,
    YEARS,
    GOVERNORATES,
}) {
    const titleMax = 27;
    const inputRef = useRef(null);

    const defaultValues = useMemo(() => {
        return {
            images: imagePreviews ?? [],
            title: ad.title ?? "",
            country: ad.country ?? "",
            brand: ad.brand ?? "",
            model: ad.model ?? "",
            year: ad.year ?? "",
            mileage: ad.mileage ?? "",
            governorate: ad.governorate ?? "",
            price: ad.price ?? "",
            description: ad.description ?? "",
            contactCall: !!ad.contactCall,
            contactWhats: !!ad.contactWhats,
        };
    }, [ad, imagePreviews]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(AddAdStepFourSchema),
        defaultValues,
        mode: "onSubmit",
    });

    // sync images into RHF whenever previews change
    useEffect(() => {
        setValue("images", imagePreviews ?? [], { shouldValidate: false });
    }, [imagePreviews, setValue]);

    // optional: keep your external ad state synced (so step5 uses it)
    useEffect(() => {
        const sub = watch((v) => {
            setAd((p) => ({ ...p, ...v }));
        });
        return () => sub.unsubscribe();
    }, [watch, setAd]);

    const images = watch("images") || [];
    const title = watch("title") || "";

    const onSubmit = async (values) => {
        // values جاهزة 100%
        setAd((p) => ({ ...p, ...values }));
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
                            // علشان error الصور يختفي بعد الرفع
                            setTimeout(() => trigger("images"), 0);
                        }}
                    />

                    <Image src={logo} alt="logo" className="upload-logo" />

                    <div className="upload-btn">
                        <CirclePlus className="h-5 w-5" />
                        أضف الصور
                    </div>
                </label>

                {/* error images */}
                {errors.images?.message ? (
                    <p className="mt-2 text-sm text-red-500">{errors.images.message}</p>
                ) : null}

                {/* previews */}
                <div className={images.length ? "mt-3 w-full" : "hidden"}>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                        {imagePreviews?.map((src, idx) => (
                            <div key={`${src}-${idx}`} className="relative overflow-hidden rounded-md border">
                                <Image
                                    src={src}
                                    alt={`preview-${idx + 1}`}
                                    width={200}
                                    height={140}
                                    className="h-24 w-full object-cover"
                                    unoptimized
                                />
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
                <Input
                    className="form-input"
                    placeholder="ادخل عنوان الاعلان"
                    maxLength={titleMax}
                    {...register("title")}
                />
                <span className="word-count">
                    {title.length}/{titleMax}
                </span>
                {errors.title?.message ? (
                    <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                ) : null}
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">بلد الصنع</label>
                    <Select
                        value={watch("country")}
                        onValueChange={(v) => setValue("country", v, { shouldValidate: true })}
                    >
                        <SelectTrigger className="form-input">
                            <SelectValue placeholder="اختر بلد الصنع" />
                        </SelectTrigger>
                        <SelectContent>
                            {COUNTRIES.map((x) => (
                                <SelectItem key={x} value={x}>{x}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.country?.message ? (
                        <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>
                    ) : null}
                </div>

                <div className="form-group">
                    <label className="form-label">الماركة</label>
                    <Select
                        value={watch("brand")}
                        onValueChange={(v) => setValue("brand", v, { shouldValidate: true })}
                    >
                        <SelectTrigger className="form-input">
                            <SelectValue placeholder="اختر الماركة" />
                        </SelectTrigger>
                        <SelectContent>
                            {BRANDS.map((x) => (
                                <SelectItem key={x} value={x}>{x}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.brand?.message ? (
                        <p className="mt-1 text-sm text-red-500">{errors.brand.message}</p>
                    ) : null}
                </div>

                <div className="form-group">
                    <label className="form-label">الموديل</label>
                    <Select
                        value={watch("model")}
                        onValueChange={(v) => setValue("model", v, { shouldValidate: true })}
                    >
                        <SelectTrigger className="form-input">
                            <SelectValue placeholder="اختر الموديل" />
                        </SelectTrigger>
                        <SelectContent>
                            {MODELS.map((x) => (
                                <SelectItem key={x} value={x}>{x}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.model?.message ? (
                        <p className="mt-1 text-sm text-red-500">{errors.model.message}</p>
                    ) : null}
                </div>

                <div className="form-group">
                    <label className="form-label">سنة الصنع</label>
                    <Select
                        value={watch("year")}
                        onValueChange={(v) => setValue("year", v, { shouldValidate: true })}
                    >
                        <SelectTrigger className="form-input">
                            <SelectValue placeholder="اختر سنة الصنع" />
                        </SelectTrigger>
                        <SelectContent>
                            {YEARS.map((x) => (
                                <SelectItem key={x} value={x}>{x}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.year?.message ? (
                        <p className="mt-1 text-sm text-red-500">{errors.year.message}</p>
                    ) : null}
                </div>

                <div className="form-group">
                    <label className="form-label">الممشى <span>( اختياري )</span></label>
                    <Input className="form-input" placeholder="ادخل الممشى" {...register("mileage")} />
                </div>

                <div className="form-group">
                    <label className="form-label">المحافظة <span>( اختياري )</span></label>
                    <Select
                        value={watch("governorate")}
                        onValueChange={(v) => setValue("governorate", v)}
                    >
                        <SelectTrigger className="form-input">
                            <SelectValue placeholder="اختر المحافظة" />
                        </SelectTrigger>
                        <SelectContent>
                            {GOVERNORATES.map((x) => (
                                <SelectItem key={x} value={x}>{x}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="form-group">
                    <label className="form-label">السعر <span>( اختياري )</span></label>
                    <Input
                        className="form-input"
                        type="number"
                        placeholder="ادخل السعر بالدينار الكويتي"
                        {...register("price")}
                    />
                    {errors.price?.message ? (
                        <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
                    ) : null}
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">الوصف</label>
                <Textarea
                    className="form-input"
                    placeholder="ادخل وصف الاعلان"
                    {...register("description")}
                />
                {errors.description?.message ? (
                    <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                ) : null}
            </div>

            <div className="form-group">
                <label className="form-label">وسيلة الاتصال</label>

                {/* error contact (من refine) */}
                {errors.contactCall?.message ? (
                    <p className="mb-2 text-sm text-red-500">{errors.contactCall.message}</p>
                ) : null}

                <div className="form-contact">
                    <label className={`pill pill-btn ${watch("contactCall") ? "active" : ""}`}>
                        <span className="icon-text">
                            <Image src={phoneIcon} alt="icon" />
                            <span className="text">اتصال</span>
                        </span>

                        <input
                            type="checkbox"
                            checked={!!watch("contactCall")}
                            onChange={(e) => setValue("contactCall", e.target.checked, { shouldValidate: true })}
                        />
                        <span className="switch" />
                    </label>

                    <label className={`pill pill-btn ${watch("contactWhats") ? "active" : ""}`}>
                        <span className="icon-text">
                            <Image src={whatsIcon} alt="icon" />
                            <span className="text">واتساب</span>
                        </span>

                        <input
                            type="checkbox"
                            checked={!!watch("contactWhats")}
                            onChange={(e) => setValue("contactWhats", e.target.checked, { shouldValidate: true })}
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
