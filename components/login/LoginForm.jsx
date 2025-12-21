'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "@/src/images/logo.svg";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneField from "./PhoneField";

// عدّل الشروط براحتك
const loginSchema = z.object({
    fullName: z
        .string()
        .min(1, "الاسم مطلوب")
        .transform((v) => v.trim().replace(/\s+/g, " "))
        .refine((v) => v.split(" ").filter(Boolean).length >= 2, "اكتب اسمك بالكامل (كلمتين على الأقل)"),

    phone: z
        .string()
        .min(1, "رقم الهاتف مطلوب")
        .refine((val) => {
            const phone = parsePhoneNumberFromString(val || "");
            return !!phone && phone.isValid();
        }, "رقم الهاتف غير صحيح"),
});
export default function LoginForm({ onSuccess, onSkip }) {
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { fullName: "", phone: "", },
        mode: "onSubmit",
    });

    const onSubmit = async (values) => {
        // TODO: call login request -> send otp
        // await fetch("/api/auth/login", { method: "POST", body: JSON.stringify(values) })
        onSuccess?.(values);
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

                <div className="upper-head">
                    <Link href="/" className="logo-ancor" aria-label="Home">
                        <figure className="logo-img">
                            {/* عدّل المسار حسب مشروعك */}
                            <Image src={logo} alt="logo" width={140} height={60} className="img-fluid" />
                        </figure>
                    </Link>
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
                                <Button type="submit" className="form-btn" disabled={form.formState.isSubmitting} >
                                    تسجيل دخول
                                </Button>
                            </div>
                            {/* تخطي */}
                            <Link href="/" className="link-escape"> تخطي </Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
