'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { toast } from "sonner";
import { z } from "zod";

import logo from "@/src/images/logo.png";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PhoneField from "./PhoneField";
import { loginUser } from "@/src/services/authService";

const loginSchema = z.object({
    fullName: z
        .string()
        .min(1, "الاسم مطلوب")
        .transform((v) => v.trim().replace(/\s+/g, " "))
        .refine(
            (v) => v.split(" ").filter(Boolean).length >= 2,
            "اكتب اسمك بالكامل (كلمتين على الأقل)"
        ),
    phone: z
        .string()
        .min(1, "رقم الهاتف مطلوب")
        .refine(
            (val) => isValidPhoneNumber(val || ""),
            "رقم الهاتف غير صحيح"
        ),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
    fcmToken: string;
    onSuccess: (data: { phone: string; country_code: string; name: string }) => void;
    onSkip: () => void;
}

export default function LoginForm({ fcmToken, onSuccess, onSkip }: LoginFormProps) {
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { fullName: "", phone: "" },
        mode: "onSubmit",
    });

    const onSubmit = async (values: LoginFormValues) => {
        try {
            // Parse the E.164 phone (e.g. "+96526102xxx") into phone + country_code
            const parsed = parsePhoneNumber(values.phone);
            const country_code = parsed.countryCallingCode; // e.g. "965"
            const phone = parsed.nationalNumber;              // e.g. "26102xxx"

            await loginUser({
                phone,
                country_code,
                fcm_token: fcmToken || "no-token",
                name: values.fullName,
            });

            onSuccess({ phone, country_code, name: values.fullName });
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "حدث خطأ، يرجى المحاولة مجدداً";
            toast.error(msg);
        }
    };

    return (
        <div className="sign-section" dir="rtl">
            <div className="sign-container">
                <div className="upper-header">
                    <button
                        type="button"
                        className="back-btn"
                        onClick={() => window.history.back()}
                        aria-label="رجوع"
                    >
                        <i className="fa-regular fa-arrow-right"></i>
                    </button>
                </div>


                <h2 className="form-head">تسجيل دخول</h2>
                <p className="form-pargh">من فضلك ادخل اسمك ورقم هاتفك لتسجيل الدخول</p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="login-form">
                        <div className="form-cont">
                            {/* الاسم */}
                            <FormField
                                control={form.control}
                                name="fullName"
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

                            {/* رقم الهاتف */}
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="form-group">
                                        <FormLabel className="form-label">رقم الهاتف</FormLabel>
                                        <FormControl>
                                            <PhoneField
                                                value={field.value}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
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
                                    {form.formState.isSubmitting ? "جاري الإرسال..." : "تسجيل دخول"}
                                </Button>
                            </div>

                            <button
                                type="button"
                                onClick={onSkip}
                                className="link-escape"
                            >
                                تخطي
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
