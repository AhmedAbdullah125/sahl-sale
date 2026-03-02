"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { CirclePlus, Loader2, Trash2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

import logo from "@/src/images/logo.svg";
import phoneIcon from "@/src/images/phone-icon.png";
import whatsIcon from "@/src/images/whats-icon.png";
import { EditAdSchema } from "./edit-ad.schema";

export default function EditAdForm({ isCarOrAuction, ad, setAd, onSave, isPending, COUNTRIES, BRANDS, MODELS, YEARS, GOVERNORATES, existingImages = [], onDeleteExistingImage }: any) {
    const titleMax = 27;
    const inputRef = useRef<HTMLInputElement>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    useEffect(() => {
        return () => {
            imagePreviews.forEach(u => URL.revokeObjectURL(u));
        };
    }, []);

    const defaultValues = useMemo(() => {
        return {
            images: [],
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
    const { register, handleSubmit, setValue, watch, trigger, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(EditAdSchema),
        defaultValues,
        mode: "onSubmit",
    });

    useEffect(() => {
        reset(defaultValues);
    }, [ad, reset, defaultValues]);

    useEffect(() => {
        const sub = watch((v, { name, type }) => {
            if (name === "brand") {
                setValue("model", "", { shouldValidate: true });
                v.model = "";
            }
            setAd((p) => ({ ...p, ...v }));
        });
        return () => sub.unsubscribe();
    }, [watch, setAd, setValue]);
    const images = watch("images") || [];
    const title = watch("title") || "";

    const onSubmit = async (values) => {
        onSave(values);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <span className="upload-text">الصور</span>

            <div className="image-upload">
                <label className="upload-box">
                    <input ref={inputRef} type="file" accept="image/*" multiple onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;
                        const currentImages = watch("images") || [];
                        const newFiles = [...currentImages, ...files];
                        setValue("images", newFiles, { shouldValidate: true });
                        const urls = files.map(f => URL.createObjectURL(f));
                        setImagePreviews(prev => [...prev, ...urls]);
                        e.currentTarget.value = "";
                    }} />
                    <Image src={logo} alt="logo" className="upload-logo" />
                    <div className="upload-btn"> <CirclePlus className="h-5 w-5" /> أضف الصور </div>
                </label>

                {errors.images?.message ? (<p className="mt-2 text-sm text-red-500">{String(errors.images.message)}</p>) : null}

                {/* Existing images from the server */}
                {existingImages.length > 0 && (
                    <div className="mt-3 w-full">
                        <p className="mb-2 text-sm text-[#888]">الصور الحالية:</p>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                            {existingImages.map((img: { id: number; url: string }) => (
                                <div key={img.id} className="relative overflow-hidden rounded-md border">
                                    <Image src={img.url} alt={`existing-${img.id}`} width={200} height={140} className="h-24 w-full object-cover" unoptimized />
                                    <button type="button" className="remove-btn" onClick={(e) => {
                                        e.preventDefault();
                                        onDeleteExistingImage?.(img.id);
                                    }} aria-label="Remove existing image">
                                        <Trash2 className="h-5 w-5 text-red-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(!images || images.length === 0) && (
                    <p className="mt-2 text-sm text-[#888]">
                        ملاحظة: سيتم الاحتفاظ بالصور القديمة للإعلان في حال لم تقم بإضافة صور جديدة.
                    </p>
                )}

                <div className={images.length ? "mt-3 w-full" : "hidden"}>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                        {images.map((file: File, idx: number) => (
                            <div key={`${file.name}-${idx}`} className="relative overflow-hidden rounded-md border">
                                <Image src={imagePreviews[idx] || ""} alt={`preview-${idx + 1}`} width={200} height={140} className="h-24 w-full object-cover" unoptimized />
                                <button type="button" className="remove-btn" onClick={(e) => {
                                    e.preventDefault();
                                    const newImages = [...images];
                                    newImages.splice(idx, 1);
                                    setValue("images", newImages, { shouldValidate: true });

                                    setImagePreviews(prev => {
                                        const p = [...prev];
                                        if (p[idx]) URL.revokeObjectURL(p[idx]);
                                        p.splice(idx, 1);
                                        return p;
                                    });
                                }} aria-label="Remove image">
                                    <Trash2 className="h-5 w-5 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {images.length > 1 && (
                        <button type="button" className="mt-2 text-sm underline" onClick={(e) => {
                            e.preventDefault();
                            setValue("images", [], { shouldValidate: true });
                            imagePreviews.forEach(u => URL.revokeObjectURL(u));
                            setImagePreviews([]);
                        }}
                        > حذف الكل
                        </button>
                    )}
                </div>
            </div>


            {/* Title */}
            <div className="form-group">
                <label className="form-label">عنوان الاعلان</label>
                <Input className="form-input" placeholder="ادخل عنوان الاعلان" maxLength={titleMax} {...register("title")} />
                <span className="word-count">{title.length}/{titleMax}</span>
                {errors.title?.message ? (<p className="mt-1 text-sm text-red-500">{String(errors.title.message)}</p>) : null}
            </div>

            {/* باقي الفورم زي Step4 */}
            <div className="form-grid">
                {isCarOrAuction && (
                    <>
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
                                    {COUNTRIES.map((x: any) => (<SelectItem key={x.id} value={x.id.toString()}> {x.name} </SelectItem>))}
                                </SelectContent>
                            </Select>
                            {errors.country?.message ? (<p className="mt-1 text-sm text-red-500">{String(errors.country.message)}</p>) : null}
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
                                    {BRANDS.map((x: any) => (<SelectItem key={x.id} value={x.id.toString()}> {x.name} </SelectItem>))}
                                </SelectContent>
                            </Select>
                            {errors.brand?.message ? (
                                <p className="mt-1 text-sm text-red-500">{String(errors.brand.message)}</p>
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
                                    {MODELS.map((x: any) => (<SelectItem key={x.id} value={x.id.toString()}> {x.name} </SelectItem>))}
                                </SelectContent>
                            </Select>
                            {errors.model?.message ? (<p className="mt-1 text-sm text-red-500">{String(errors.model.message)}</p>) : null}
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
                                    {YEARS.map((x: any) => (<SelectItem key={x.value} value={x.value.toString()}> {x.label} </SelectItem>))}
                                </SelectContent>
                            </Select>
                            {errors.year?.message ? (<p className="mt-1 text-sm text-red-500">{String(errors.year.message)}</p>) : null}
                        </div>

                        <div className="form-group">
                            <label className="form-label">الممشى <span>( اختياري )</span></label>
                            <Input className="form-input" placeholder="ادخل الممشى" {...register("mileage")} />
                        </div>
                    </>
                )}

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
                            {GOVERNORATES.map((x: any) => (<SelectItem key={x.id} value={x.id.toString()}> {x.name} </SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="form-group">
                    <label className="form-label">السعر <span>( اختياري )</span></label>
                    <Input className="form-input" type="number" placeholder="ادخل السعر بالدينار الكويتي" {...register("price")} />
                    {errors.price?.message ? (<p className="mt-1 text-sm text-red-500">{String(errors.price.message)}</p>) : null}
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">الوصف</label>
                <Textarea className="form-input" placeholder="ادخل وصف الاعلان" {...register("description")} />
                {errors.description?.message ? (
                    <p className="mt-1 text-sm text-red-500">{String(errors.description.message)}</p>
                ) : null}
            </div>
            <div className="form-group">
                <label className="form-label">وسيلة الاتصال</label>

                {errors.contactCall?.message ? (
                    <p className="mb-2 text-sm text-red-500">{String(errors.contactCall.message)}</p>
                ) : null}

                <div className="form-contact">
                    <label className={`pill pill-btn ${watch("contactCall") ? "active" : ""}`}>
                        <span className="icon-text">
                            <Image src={phoneIcon} alt="icon" />
                            <span className="text">اتصال</span>
                        </span>
                        <input type="checkbox" checked={!!watch("contactCall")} onChange={(e) => setValue("contactCall", e.target.checked, { shouldValidate: true })} />
                        <span className="switch" />
                    </label>

                    <label className={`pill pill-btn ${watch("contactWhats") ? "active" : ""}`}>
                        <span className="icon-text">
                            <Image src={whatsIcon} alt="icon" />
                            <span className="text">واتساب</span>
                        </span>
                        <input type="checkbox" checked={!!watch("contactWhats")} onChange={(e) => setValue("contactWhats", e.target.checked, { shouldValidate: true })} /><span className="switch" />
                    </label>
                </div>
            </div>
            <button className="form-btn" type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="inline h-4 w-4 animate-spin ml-2" /> : null}
                حفظ التعديلات
            </button>
        </form>
    );
}
