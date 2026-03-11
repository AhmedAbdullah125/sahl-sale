"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import UpperHeader from "@/components/General/UpperHeader";
import { API_BASE_URL } from "@/lib/apiConfig";
import { getToken } from "@/src/utils/token";
import { useGetCategories, type MainCategory } from "@/src/hooks/useGetCategories";
import { fetchSubCategories, type SubCategory } from "@/src/hooks/useGetSubCategories";
import { useGetManufacturingCountries, type ManufacturingCountry } from "@/src/hooks/useGetManufacturingCountries";
import { useGetManufacturingYears, type ManufacturingYear } from "@/src/hooks/useGetManufacturingYears";
import { useGetCarBrands, type CarBrand } from "@/src/hooks/useGetCarBrands";
import { fetchCarModels, type CarModel } from "@/src/hooks/useGetCarModels";

export default function AddAlertWrapper() {
    const [loading, setLoading] = useState(false);

    // ── Categories (cascading) ─────────────────────────────────────────────────
    const { data: mainCategories = [], isLoading: categoriesLoading } = useGetCategories();
    const [selectedMainId, setSelectedMainId] = useState<number | "">("");

    const [subLevel2, setSubLevel2] = useState<SubCategory[]>([]);
    const [subLevel2Loading, setSubLevel2Loading] = useState(false);
    const [selectedL2Id, setSelectedL2Id] = useState<number | "">("");

    const [subLevel3, setSubLevel3] = useState<SubCategory[]>([]);
    const [subLevel3Loading, setSubLevel3Loading] = useState(false);
    const [selectedL3Id, setSelectedL3Id] = useState<number | "">("");

    // ── Handlers ───────────────────────────────────────────────────────────────
    const handleMainChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        setSelectedMainId(id || "");
        setSelectedL2Id("");
        setSubLevel2([]);
        setSelectedL3Id("");
        setSubLevel3([]);

        if (!id) return;
        try {
            setSubLevel2Loading(true);
            const subs = await fetchSubCategories(id);
            setSubLevel2(subs);
        } catch (err) {
            console.error(err);
        } finally {
            setSubLevel2Loading(false);
        }
    };

    const handleL2Change = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        setSelectedL2Id(id || "");
        setSelectedL3Id("");
        setSubLevel3([]);

        if (!id) return;
        const chosen = subLevel2.find((s) => s.id === id);
        if (!chosen?.has_children) return;

        try {
            setSubLevel3Loading(true);
            const subs = await fetchSubCategories(id);
            setSubLevel3(subs);
        } catch (err) {
            console.error(err);
        } finally {
            setSubLevel3Loading(false);
        }
    };

    const handleL3Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedL3Id(Number(e.target.value) || "");
    };

    // ── Data loading ───────────────────────────────────────────────────────────
    const { data: manufacturingCountries = [], isLoading: countriesLoading } = useGetManufacturingCountries();
    const { data: manufacturingYears = [], isLoading: yearsLoading } = useGetManufacturingYears();
    const { data: carBrands = [], isLoading: brandsLoading } = useGetCarBrands();
    const [carModels, setCarModels] = useState<CarModel[]>([]);
    const [modelsLoading, setModelsLoading] = useState(false);

    const [selectedCountryId, setSelectedCountryId] = useState<number | "">("");
    const [selectedBrandId, setSelectedBrandId] = useState<number | "">("");
    const [selectedModelId, setSelectedModelId] = useState<number | "">("");
    const [selectedYearFrom, setSelectedYearFrom] = useState<number | "">("");
    const [selectedYearTo, setSelectedYearTo] = useState<number | "">("");

    const handleBrandChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        setSelectedBrandId(id || "");
        setSelectedModelId("");
        setCarModels([]);
        if (!id) return;
        try {
            setModelsLoading(true);
            const models = await fetchCarModels(id);
            setCarModels(models);
        } catch (err) {
            console.error(err);
        } finally {
            setModelsLoading(false);
        }
    };

    // ── Submit ──────────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = getToken();
            const headers: Record<string, string> = { 'accept-language': 'ar' };
            if (token) headers.Authorization = `Bearer ${token}`;

            const formData = new FormData();
            if (selectedMainId) formData.append('category_id', String(selectedMainId));
            if (selectedL2Id) formData.append('section_id', String(selectedL2Id));
            if (selectedL3Id) formData.append('sub_section_id', String(selectedL3Id));
            if (selectedBrandId) formData.append('car_brand_id', String(selectedBrandId));
            if (selectedModelId) formData.append('car_model_id', String(selectedModelId));
            if (selectedCountryId) formData.append('manufacturing_country_id', String(selectedCountryId));
            if (selectedYearFrom) formData.append('year_from', String(selectedYearFrom));
            if (selectedYearTo) formData.append('year_to', String(selectedYearTo));

            const res = await fetch(`${API_BASE_URL}/alerts`, {
                method: 'POST',
                headers,
                body: formData,
            });

            const json = await res.json();
            if (!res.ok || !json.status) {
                throw new Error(json.message ?? 'حدث خطأ');
            }

            toast.success(json.data ?? 'تم إضافة التنبيه بنجاح');
        } catch (err: unknown) {
            const msg = (err as { message?: string })?.message ?? 'حدث خطأ، يرجى المحاولة مجدداً';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="content-section">
            <div className="container">
                <UpperHeader title="إضافة تنبيه" />

                <form onSubmit={handleSubmit} className="add-alert-form">
                    <div className="form-grid">
                        {/* Main category */}
                        <div className="form-group">
                            <label className="form-label">الفئة</label>
                            <select
                                className="form-input"
                                value={selectedMainId}
                                onChange={handleMainChange}
                                disabled={categoriesLoading}
                            >
                                <option value="">
                                    {categoriesLoading ? "جاري التحميل..." : "اختر الفئة"}
                                </option>
                                {mainCategories.map((cat: MainCategory) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sub-category (level 2) */}
                        <div className="form-group">
                            <label className="form-label">القسم</label>
                            <select
                                className="form-input"
                                value={selectedL2Id}
                                onChange={handleL2Change}
                                disabled={!selectedMainId || subLevel2Loading}
                            >
                                <option value="">
                                    {subLevel2Loading ? "جاري التحميل..." : "اختر القسم"}
                                </option>
                                {subLevel2.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sub-category (level 3) — shown only when children exist */}
                        {(subLevel3.length > 0 || subLevel3Loading) && (
                            <div className="form-group">
                                <label className="form-label">القسم الفرعي</label>
                                <select
                                    className="form-input"
                                    value={selectedL3Id}
                                    onChange={handleL3Change}
                                    disabled={subLevel3Loading}
                                >
                                    <option value="">
                                        {subLevel3Loading ? "جاري التحميل..." : "اختر القسم الفرعي"}
                                    </option>
                                    {subLevel3.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Manufacturing country */}
                        <div className="form-group">
                            <label className="form-label">بلد الصنع</label>
                            <select
                                className="form-input"
                                value={selectedCountryId}
                                onChange={(e) => setSelectedCountryId(Number(e.target.value) || "")}
                                disabled={countriesLoading}
                            >
                                <option value="">
                                    {countriesLoading ? "جاري التحميل..." : "اختر بلد الصنع"}
                                </option>
                                {manufacturingCountries.map((c: ManufacturingCountry) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Car brand */}
                        <div className="form-group">
                            <label className="form-label">الماركة</label>
                            <select
                                className="form-input"
                                value={selectedBrandId}
                                onChange={handleBrandChange}
                                disabled={brandsLoading}
                            >
                                <option value="">
                                    {brandsLoading ? "جاري التحميل..." : "اختر الماركة"}
                                </option>
                                {carBrands.map((b: CarBrand) => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Car model — loads after brand is selected */}
                        <div className="form-group">
                            <label className="form-label">الموديل</label>
                            <select
                                className="form-input"
                                value={selectedModelId}
                                onChange={(e) => setSelectedModelId(Number(e.target.value) || "")}
                                disabled={!selectedBrandId || modelsLoading}
                            >
                                <option value="">
                                    {modelsLoading ? "جاري التحميل..." : "اختر الموديل"}
                                </option>
                                {carModels.map((m: CarModel) => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Manufacturing year range */}
                        <div className="form-group">
                            <label className="form-label">سنة الصنع</label>
                            <div className="form-grid-half">
                                <select
                                    className="form-input"
                                    value={selectedYearFrom}
                                    onChange={(e) => setSelectedYearFrom(Number(e.target.value) || "")}
                                    disabled={yearsLoading}
                                >
                                    <option value="">
                                        {yearsLoading ? "جاري التحميل..." : "من"}
                                    </option>
                                    {manufacturingYears.map((y: ManufacturingYear) => (
                                        <option key={y.value} value={y.value}>{y.label}</option>
                                    ))}
                                </select>
                                <select
                                    className="form-input"
                                    value={selectedYearTo}
                                    onChange={(e) => setSelectedYearTo(Number(e.target.value) || "")}
                                    disabled={yearsLoading}
                                >
                                    <option value="">
                                        {yearsLoading ? "جاري التحميل..." : "إلي"}
                                    </option>
                                    {manufacturingYears.map((y: ManufacturingYear) => (
                                        <option key={y.value} value={y.value}>{y.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="form-btn add-alert-btn">
                        {loading ? "جاري الحفظ..." : "حفظ"}
                    </button>
                </form>
            </div>
        </section>
    );
}
