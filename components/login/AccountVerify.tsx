'use client';

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

const MAX_MB = 5;
const MAX_SIZE = MAX_MB * 1024 * 1024;

const fileSchema = z
    .instanceof(File, { message: "الملف مطلوب" })
    .refine((f) => f.type?.startsWith("image/"), "الملف لازم يكون صورة")
    .refine((f) => f.size <= MAX_SIZE, `حجم الصورة لازم يكون أقل من ${MAX_MB}MB`);

const verifySchema = z.object({
    id_front: z.union([fileSchema, z.null()]).refine((v) => v instanceof File, {
        message: "من فضلك ارفع صورة الهوية (الوجه)",
    }),
    id_back: z.union([fileSchema, z.null()]).refine((v) => v instanceof File, {
        message: "من فضلك ارفع صورة الهوية (الظهر)",
    }),
});

export default function AccountVerify() {
    const form = useForm({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            id_front: null,
            id_back: null,
        },
        mode: "onSubmit",
    });

    const frontFile = form.watch("id_front");
    const backFile = form.watch("id_back");

    const frontPreview = useMemo(() => {
        if (!(frontFile instanceof File)) return "";
        return URL.createObjectURL(frontFile);
    }, [frontFile]);

    const backPreview = useMemo(() => {
        if (!(backFile instanceof File)) return "";
        return URL.createObjectURL(backFile);
    }, [backFile]);

    // تنظيف الـObjectURL عشان ما يحصلش memory leak
    useEffect(() => {
        return () => {
            if (frontPreview) URL.revokeObjectURL(frontPreview);
        };
    }, [frontPreview]);

    useEffect(() => {
        return () => {
            if (backPreview) URL.revokeObjectURL(backPreview);
        };
    }, [backPreview]);

    const onSubmit = async (values) => {
        const formData = new FormData();
        formData.append("id_front", values.id_front);
        formData.append("id_back", values.id_back);

        // TODO: send to API
        // const res = await fetch("/api/account/verify", { method: "POST", body: formData });
        // if (!res.ok) throw new Error("Upload failed");

        console.log("Submitting:", values);
        alert("تم الإرسال ✅");
    };

    return (
        <section className="content-section" dir="rtl">
            <div className="container">
                <div className="upper-header">
                    <button
                        type="button"
                        className="back-btn"
                        onClick={() => window.history.back()}
                        aria-label="رجوع"
                    >
                        <i className="fa-regular fa-arrow-right"></i>
                    </button>

                    <h3 className="page-title">توثيق الحساب</h3>
                    <div className="empty"></div>
                </div>

                <div className="product-cont">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="id-upload">
                                {/* Front */}
                                <FormField
                                    control={form.control}
                                    name="id_front"
                                    className="upload-card w-full"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <label className="upload-card">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="sr-only"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0] ?? null;
                                                            field.onChange(file);
                                                        }}
                                                    />

                                                    <span className="add-span">
                                                        <i className="fa-solid fa-circle-plus"></i>
                                                    </span>

                                                    {frontPreview ? (
                                                        <figure style={{ margin: "12px 0 0" }}>
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={frontPreview}
                                                                alt="ID Front Preview"
                                                                style={{
                                                                    width: "100%",
                                                                    height: 160,
                                                                    objectFit: "cover",
                                                                    borderRadius: 12,
                                                                }}
                                                            />
                                                        </figure>
                                                    ) : null}

                                                    <p>
                                                        {frontFile instanceof File
                                                            ? `تم اختيار: ${frontFile.name}`
                                                            : "أضف صورة الهوية الوطنية (الوجه)"}
                                                    </p>
                                                </label>
                                            </FormControl>

                                            {/* رسالة الخطأ تحت الكارت */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Back */}
                                <FormField
                                    control={form.control}
                                    name="id_back"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <label className="upload-card">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="sr-only"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0] ?? null;
                                                            field.onChange(file);
                                                        }}
                                                    />

                                                    <span className="add-span">
                                                        <i className="fa-solid fa-circle-plus"></i>
                                                    </span>

                                                    {backPreview ? (
                                                        <figure style={{ margin: "12px 0 0" }}>
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={backPreview}
                                                                alt="ID Back Preview"
                                                                style={{
                                                                    width: "100%",
                                                                    height: 160,
                                                                    objectFit: "cover",
                                                                    borderRadius: 12,
                                                                }}
                                                            />
                                                        </figure>
                                                    ) : null}

                                                    <p>
                                                        {backFile instanceof File
                                                            ? `تم اختيار: ${backFile.name}`
                                                            : "أضف صورة الهوية الوطنية (الظهر)"}
                                                    </p>
                                                </label>
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <button className="form-btn" type="submit" disabled={form.formState.isSubmitting}>
                                إرسال
                            </button>
                        </form>
                    </Form>
                </div>
            </div>
        </section>
    );
}
