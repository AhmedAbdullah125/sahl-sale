'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { z } from 'zod';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { useGetProfile } from '@/src/hooks/useGetProfile';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loading from '@/src/app/loading';


// ─── Schema ───────────────────────────────────────────────────────────────────

const editSchema = z.object({
    name: z.string().min(1, 'الاسم مطلوب'),
    phone: z
        .string()
        .min(1, 'رقم الهاتف مطلوب')
        .refine((v) => isValidPhoneNumber(v || ''), 'رقم الهاتف غير صحيح'),
    whatsapp: z
        .string()
        .optional()
        .refine(
            (v) => !v || isValidPhoneNumber(v),
            'رقم الواتساب غير صحيح'
        ),
});

type EditFormValues = z.infer<typeof editSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function EditProfileWrapper() {
    const router = useRouter();
    const { updateProfile } = useUpdateProfile();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const { data: profile, isLoading: loadingProfile } = useGetProfile();

    const form = useForm<EditFormValues>({
        resolver: zodResolver(editSchema),
        defaultValues: { name: '', phone: '', whatsapp: '' },
        mode: 'onSubmit',
    });

    // Pre-fill form once profile data arrives
    useEffect(() => {
        if (!profile) return;
        form.reset({
            name: profile.name ?? '',
            phone: profile.full_phone ?? '',
            whatsapp: profile.full_whatsapp ?? '',
        });
        setImagePreview(profile.image ?? '');
    }, [profile, form]);

    // ── Image pick ────────────────────────────────────────────────────────────
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const onSubmit = async (values: EditFormValues) => {
        await updateProfile(values, imageFile);
    };

    if (loadingProfile) {
        return (
            <Loading />
        );
    }

    return (
        <div className="profile-details" dir="rtl">
            {/* ── Header ── */}
            <div className="upper-header">
                <button
                    type="button"
                    className="back-btn"
                    onClick={() => router.back()}
                    aria-label="رجوع"
                >
                    <i className="fa-regular fa-arrow-right"></i>
                </button>
                <h3 className="page-title">بيانات حسابي</h3>
                <div className="empty"></div>
            </div>

            {/* ── Avatar ── */}
            <div className="profile-header mb-12 !bg-transparent">
                <label className="avatar-upload" htmlFor="avatar-input" aria-label="تغيير الصورة">
                    <div className="avatar-wrap">
                        {imagePreview ? (
                            <Image
                                src={imagePreview}
                                alt="الصورة الشخصية"
                                width={120}
                                height={120}
                                className="rounded-full object-cover"
                                unoptimized={imagePreview.startsWith('blob:')}
                            />
                        ) : (
                            <i className="fa-solid fa-user"></i>
                        )}
                    </div>
                    <span className="edit-icon">
                        <i className="fa-solid fa-pen"></i>
                    </span>
                </label>
                <input
                    id="avatar-input"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                />
            </div>

            {/* ── Form ── */}
            <div className="account-form">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="login-form">
                        <div className="form-cont">

                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="form-group">
                                        <FormLabel className="form-label">الاسم</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="form-input"
                                                placeholder="ادخل اسمك"
                                                autoComplete="name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Phone */}
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="form-group">
                                        <FormLabel className="form-label">رقم الهاتف</FormLabel>
                                        <FormControl>
                                            <PhoneInput
                                                defaultCountry="kw"
                                                value={field.value}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                inputClassName="form-input phone-input"
                                                className="form-input"
                                                countrySelectorStyleProps={{
                                                    className: 'phone-country',
                                                    buttonClassName: 'phone-country-btn',
                                                }}
                                                placeholder="000 000 00"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Whatsapp */}
                            <FormField
                                control={form.control}
                                name="whatsapp"
                                render={({ field }) => (
                                    <FormItem className="form-group">
                                        <FormLabel className="form-label">رقم الواتساب</FormLabel>
                                        <FormControl>
                                            <PhoneInput
                                                defaultCountry="kw"
                                                value={field.value ?? ''}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                inputClassName="form-input phone-input"
                                                className="form-input"
                                                countrySelectorStyleProps={{
                                                    className: 'phone-country',
                                                    buttonClassName: 'phone-country-btn',
                                                }}
                                                placeholder="000 000 00"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="form-btn-cont">
                                <Button
                                    type="submit"
                                    className="form-btn"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
