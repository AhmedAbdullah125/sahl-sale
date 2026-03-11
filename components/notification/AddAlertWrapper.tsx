"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import UpperHeader from "@/components/General/UpperHeader";
import { API_BASE_URL } from "@/lib/apiConfig";
import { getToken } from "@/src/utils/token";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useGetCategories, type MainCategory } from "@/src/hooks/useGetCategories";
import { fetchSubCategories, type SubCategory } from "@/src/hooks/useGetSubCategories";
import { useGetManufacturingCountries, type ManufacturingCountry } from "@/src/hooks/useGetManufacturingCountries";
import { useGetManufacturingYears, type ManufacturingYear } from "@/src/hooks/useGetManufacturingYears";
import { useGetCarBrands, type CarBrand } from "@/src/hooks/useGetCarBrands";
import { fetchCarModels, type CarModel } from "@/src/hooks/useGetCarModels";
import { useRouter } from "next/navigation";

// ── Zod schema ─────────────────────────────────────────────────────────────────
const alertSchema = z.object({
    category_id: z.string().min(1, "الفئة مطلوبة"),
    section_id: z.string().min(1, "القسم مطلوب"),
    sub_section_id: z.string().min(1, "القسم الفرعي مطلوب"),
    manufacturing_country_id: z.string().min(1, "بلد الصنع مطلوب"),
    car_brand_id: z.string().min(1, "الماركة مطلوبة"),
    car_model_id: z.string().min(1, "الموديل مطلوب"),
    year_from: z.string().min(1, "سنة البداية مطلوبة"),
    year_to: z.string().min(1, "سنة النهاية مطلوبة"),
});

type AlertFormValues = z.infer<typeof alertSchema>;

export default function AddAlertWrapper() {
    const router = useRouter();
    // ── Cascading data ──────────────────────────────────────────────────────────
    const { data: mainCategories = [], isLoading: categoriesLoading } = useGetCategories();
    const { data: manufacturingCountries = [], isLoading: countriesLoading } = useGetManufacturingCountries();
    const { data: manufacturingYears = [], isLoading: yearsLoading } = useGetManufacturingYears();
    const { data: carBrands = [], isLoading: brandsLoading } = useGetCarBrands();

    const [subLevel2, setSubLevel2] = useState<SubCategory[]>([]);
    const [subLevel2Loading, setSubLevel2Loading] = useState(false);

    const [subLevel3, setSubLevel3] = useState<SubCategory[]>([]);
    const [subLevel3Loading, setSubLevel3Loading] = useState(false);
    const [showSubLevel3, setShowSubLevel3] = useState(false);

    const [carModels, setCarModels] = useState<CarModel[]>([]);
    const [modelsLoading, setModelsLoading] = useState(false);

    // ── Form ────────────────────────────────────────────────────────────────────
    const form = useForm<AlertFormValues>({
        resolver: zodResolver(alertSchema),
        defaultValues: {
            category_id: "",
            section_id: "",
            sub_section_id: "",
            manufacturing_country_id: "",
            car_brand_id: "",
            car_model_id: "",
            year_from: "",
            year_to: "",
        },
        mode: "onSubmit",
    });

    // ── Cascading handlers ──────────────────────────────────────────────────────
    const handleMainChange = async (value: string) => {
        form.setValue("category_id", value);
        form.setValue("section_id", "");
        form.setValue("sub_section_id", "");
        setSubLevel2([]);
        setSubLevel3([]);
        setShowSubLevel3(false);

        if (!value) return;
        try {
            setSubLevel2Loading(true);
            const subs = await fetchSubCategories(value);
            setSubLevel2(subs);
        } catch (err) {
            console.error(err);
        } finally {
            setSubLevel2Loading(false);
        }
    };

    const handleL2Change = async (value: string) => {
        form.setValue("section_id", value);
        form.setValue("sub_section_id", "");
        setSubLevel3([]);
        setShowSubLevel3(false);

        if (!value) return;
        const chosen = subLevel2.find((s) => String(s.id) === value);

        if (!chosen?.has_children) {
            // No children — sub_section_id not needed; clear its validation
            setShowSubLevel3(false);
            return;
        }

        try {
            setSubLevel3Loading(true);
            const subs = await fetchSubCategories(value);
            setSubLevel3(subs);
            setShowSubLevel3(true);
        } catch (err) {
            console.error(err);
        } finally {
            setSubLevel3Loading(false);
        }
    };

    const handleBrandChange = async (value: string) => {
        form.setValue("car_brand_id", value);
        form.setValue("car_model_id", "");
        setCarModels([]);

        if (!value) return;
        try {
            setModelsLoading(true);
            const models = await fetchCarModels(value);
            setCarModels(models);
        } catch (err) {
            console.error(err);
        } finally {
            setModelsLoading(false);
        }
    };

    // ── Submit ──────────────────────────────────────────────────────────────────
    const onSubmit = async (values: AlertFormValues) => {
        try {
            const token = getToken();
            const headers: Record<string, string> = { "accept-language": "ar" };
            if (token) headers.Authorization = `Bearer ${token}`;

            const formData = new FormData();
            formData.append("category_id", values.category_id);
            formData.append("section_id", values.section_id);
            if (showSubLevel3) formData.append("sub_section_id", values.sub_section_id);
            formData.append("manufacturing_country_id", values.manufacturing_country_id);
            formData.append("car_brand_id", values.car_brand_id);
            formData.append("car_model_id", values.car_model_id);
            formData.append("year_from", values.year_from);
            formData.append("year_to", values.year_to);

            const res = await fetch(`${API_BASE_URL}/alerts`, {
                method: "POST",
                headers,
                body: formData,
            });

            const json = await res.json();
            if (!res.ok || !json.status) {
                throw new Error(json.message ?? "حدث خطأ");
            }

            toast.success(json.data ?? "تم إضافة التنبيه بنجاح");
            router.push("/");
        } catch (err: unknown) {
            const msg = (err as { message?: string })?.message ?? "حدث خطأ، يرجى المحاولة مجدداً";
            toast.error(msg);
        }
    };

    const isSubmitting = form.formState.isSubmitting;

    return (
        <section className="content-section">
            <div className="container">
                <UpperHeader title="إضافة تنبيه" />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="add-alert-form">
                        <div className="form-grid">

                            {/* Main category */}
                            <FormField
                                control={form.control}
                                name="category_id"
                                render={({ field }) => (
                                    <FormItem className="form-group">
                                        <FormLabel className="form-label">الفئة</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={handleMainChange}
                                            disabled={categoriesLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="form-input">
                                                    <SelectValue placeholder={categoriesLoading ? "جاري التحميل..." : "اختر الفئة"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {mainCategories.map((cat: MainCategory) => (
                                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Sub-category level 2 */}
                            <FormField
                                control={form.control}
                                name="section_id"
                                render={({ field }) => (
                                    <FormItem className="form-group">
                                        <FormLabel className="form-label">القسم</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={handleL2Change}
                                            disabled={!form.watch("category_id") || subLevel2Loading}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="form-input">
                                                    <SelectValue placeholder={subLevel2Loading ? "جاري التحميل..." : "اختر القسم"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {subLevel2.map((cat) => (
                                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Sub-category level 3 — shown only when parent has children */}
                            {(showSubLevel3 || subLevel3Loading) && (
                                <FormField
                                    control={form.control}
                                    name="sub_section_id"
                                    render={({ field }) => (
                                        <FormItem className="form-group">
                                            <FormLabel className="form-label">القسم الفرعي</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={(v) => form.setValue("sub_section_id", v)}
                                                disabled={subLevel3Loading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="form-input">
                                                        <SelectValue placeholder={subLevel3Loading ? "جاري التحميل..." : "اختر القسم الفرعي"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {subLevel3.map((cat) => (
                                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Manufacturing country */}
                            <FormField
                                control={form.control}
                                name="manufacturing_country_id"
                                render={({ field }) => (
                                    <FormItem className="form-group">
                                        <FormLabel className="form-label">بلد الصنع</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={countriesLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="form-input">
                                                    <SelectValue placeholder={countriesLoading ? "جاري التحميل..." : "اختر بلد الصنع"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {manufacturingCountries.map((c: ManufacturingCountry) => (
                                                    <SelectItem key={c.id} value={String(c.id)}>
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Car brand */}
                            <FormField
                                control={form.control}
                                name="car_brand_id"
                                render={({ field }) => (
                                    <FormItem className="form-group">
                                        <FormLabel className="form-label">الماركة</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={handleBrandChange}
                                            disabled={brandsLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="form-input">
                                                    <SelectValue placeholder={brandsLoading ? "جاري التحميل..." : "اختر الماركة"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {carBrands.map((b: CarBrand) => (
                                                    <SelectItem key={b.id} value={String(b.id)}>
                                                        {b.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Car model */}
                            <FormField
                                control={form.control}
                                name="car_model_id"
                                render={({ field }) => (
                                    <FormItem className="form-group">
                                        <FormLabel className="form-label">الموديل</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={!form.watch("car_brand_id") || modelsLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="form-input">
                                                    <SelectValue placeholder={modelsLoading ? "جاري التحميل..." : "اختر الموديل"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {carModels.map((m: CarModel) => (
                                                    <SelectItem key={m.id} value={String(m.id)}>
                                                        {m.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Manufacturing year range */}
                            <FormItem className="form-group">
                                <FormLabel className="form-label">سنة الصنع</FormLabel>
                                <div className="form-grid-half">
                                    {/* Year from */}
                                    <FormField
                                        control={form.control}
                                        name="year_from"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    disabled={yearsLoading}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="form-input">
                                                            <SelectValue placeholder={yearsLoading ? "جاري التحميل..." : "من"} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {manufacturingYears.map((y: ManufacturingYear) => (
                                                            <SelectItem key={y.value} value={String(y.value)}>
                                                                {y.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* Year to */}
                                    <FormField
                                        control={form.control}
                                        name="year_to"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    disabled={yearsLoading}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="form-input">
                                                            <SelectValue placeholder={yearsLoading ? "جاري التحميل..." : "إلي"} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {manufacturingYears.map((y: ManufacturingYear) => (
                                                            <SelectItem key={y.value} value={String(y.value)}>
                                                                {y.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </FormItem>

                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="form-btn add-alert-btn"
                        >
                            {isSubmitting ? "جاري الحفظ..." : "حفظ"}
                        </Button>
                    </form>
                </Form>
            </div>
        </section>
    );
}
