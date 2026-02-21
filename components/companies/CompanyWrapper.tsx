"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Search, BadgeCheck, Loader2, SearchX } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import logo from "@/src/images/logo.svg";
import ProductCard from "../General/ProductCard";
import { useGetCarBrands } from "@/src/hooks/useGetCarBrands";
import { useGetCarModels } from "@/src/hooks/useGetCarModels";
import { useGetManufacturingYears } from "@/src/hooks/useGetManufacturingYears";
import { useGetAds, type AdItem } from "@/src/hooks/useGetAds";
import type { Company } from "@/src/hooks/useGetCompanies";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function adToProductCard(ad: AdItem) {
    return {
        id: String(ad.id),
        href: `/product/${ad.id}`,
        img: ad.image,
        typeA: ad.car?.brand ?? ad.parent_category,
        typeB: ad.car?.model ?? ad.category,
        name: ad.title,
        kind: ad.type === "auction" ? "auction" : "sale",
        price: ad.type === "ad" ? ad.price : undefined,
        currentBid: ad.type === "auction" ? ad.price : undefined,
        dateText: ad.created_at,
        pinned: ad.is_pinned,
        isFav: ad.is_favorite,
    };
}

export default function CompanyWrapper({ id }: { id: string }) {
    // filter state
    const [tab, setTab] = useState<"all" | "ad" | "auction">("all");
    const [q, setQ] = useState("");
    const [debouncedQ, setDebouncedQ] = useState("");
    const [sBrand, setSBrand] = useState("");
    const [sModel, setSModel] = useState("");
    const [sYearFrom, setSYearFrom] = useState("");
    const [sYearTo, setSYearTo] = useState("");
    const [sPriceFrom, setSPriceFrom] = useState("");
    const [sPriceTo, setSPriceTo] = useState("");
    const [page, setPage] = useState(1);
    const [cachedCompany, setCachedCompany] = useState<Company | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const cached = sessionStorage.getItem("selectedCompany");
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    // verify it matches the current id
                    if (String(parsed.id) === id) {
                        setCachedCompany(parsed);
                    }
                } catch (e) {
                    console.error("Failed to parse cached company", e);
                }
            }
        }
    }, [id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQ(q);
            setPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [q]);

    // lookup data from hooks
    const { data: brands = [] } = useGetCarBrands();
    const { data: models = [] } = useGetCarModels(sBrand);
    const { data: years = [] } = useGetManufacturingYears();

    // data query
    const { data, isLoading: loading, error } = useGetAds({
        company_id: id,
        type: tab,
        brand_id: sBrand,
        model_id: sModel,
        year_from: sYearFrom,
        year_to: sYearTo,
        price_from: sPriceFrom,
        price_to: sPriceTo,
        page,
        search: debouncedQ,
    });

    const items = data?.items || [];
    const paginate = data?.paginate || null;
    const errorMessage = error instanceof Error ? error.message : null;

    // reset to page 1 whenever filters change
    const applyFilter = (setter: (v: string) => void) => (v: string) => {
        setter(v);
        setPage(1);
    };

    const clearFilters = () => {
        setTab("all");
        setQ("");
        setSBrand("");
        setSModel("");
        setSYearFrom("");
        setSYearTo("");
        setSPriceFrom("");
        setSPriceTo("");
        setPage(1);
    };

    return (
        <section className="content-section">
            <div className="container">
                {/* header */}
                <div className="upper-header">
                    <button
                        type="button"
                        className="back-btn"
                        onClick={() => window.history.back()}
                        aria-label="Back"
                    >
                        <ArrowRight />
                    </button>
                    <h3 className="page-title">تفاصيل الحساب</h3>
                    <div className="empty" />
                </div>

                {/* company item */}
                <div className="company-item">
                    <figure>
                        {cachedCompany ? (
                            <Image
                                src={cachedCompany.image || "http://sahl.test/placeholders/logo.jpg"}
                                alt={cachedCompany.name}
                                width={70}
                                height={70}
                                className="h-auto w-auto object-contain"
                                unoptimized
                            />
                        ) : (
                            <Image
                                src={logo}
                                alt="logo"
                                width={70}
                                height={70}
                                className="object-contain"
                            />
                        )}
                    </figure>
                    <div className="company-info">
                        <span className="company-name">
                            {cachedCompany ? cachedCompany.name : "شركة الخليج العربي"}{" "}
                            {cachedCompany ? (
                                cachedCompany.verified_account && <BadgeCheck className="inline-block h-4 w-4 text-blue-500" />
                            ) : (
                                <BadgeCheck className="inline-block h-4 w-4" />
                            )}
                        </span>
                        <span className="company-num">
                            {cachedCompany ? `${cachedCompany.ads_number} إعلان فعال` : "12 إعلان فعال"}
                        </span>
                    </div>
                </div>

                {/* search */}
                <div className="search-custom">
                    <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                        <Input
                            className="search-input"
                            placeholder="ابحث"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="search-button"
                            aria-label="Search"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                </div>

                {/* filters */}
                <form className="product-filters" onSubmit={(e) => e.preventDefault()}>
                    {/* tabs */}
                    <div className="product-btn-filter pills">
                        <button
                            type="button"
                            className={`filter-btn ${tab === "all" ? "active" : ""}`}
                            onClick={() => { setTab("all"); setPage(1); }}
                        >
                            الكل
                        </button>
                        <button
                            type="button"
                            className={`filter-btn ${tab === "ad" ? "active" : ""}`}
                            onClick={() => { setTab("ad"); setPage(1); }}
                        >
                            بيع
                        </button>
                        <button
                            type="button"
                            className={`filter-btn ${tab === "auction" ? "active" : ""}`}
                            onClick={() => { setTab("auction"); setPage(1); }}
                        >
                            مزاد
                        </button>
                    </div>

                    {/* 4 selects */}
                    <div className="product-select-filter selects-row">
                        <Select
                            value={sBrand}
                            onValueChange={(v) => {
                                setSBrand(v);
                                setSModel("");
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="filter-select">
                                <SelectValue placeholder="الماركة" />
                            </SelectTrigger>
                            <SelectContent>
                                {brands.map((b) => (
                                    <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={sModel} onValueChange={applyFilter(setSModel)}>
                            <SelectTrigger className="filter-select">
                                <SelectValue placeholder="الموديل" />
                            </SelectTrigger>
                            <SelectContent>
                                {models.map((m) => (
                                    <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={sYearFrom} onValueChange={applyFilter(setSYearFrom)}>
                            <SelectTrigger className="filter-select">
                                <SelectValue placeholder="سنة من" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((y) => (
                                    <SelectItem key={y.value} value={String(y.value)}>{y.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={sYearTo} onValueChange={applyFilter(setSYearTo)}>
                            <SelectTrigger className="filter-select">
                                <SelectValue placeholder="سنة إلى" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((y) => (
                                    <SelectItem key={y.value} value={String(y.value)}>{y.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            className="filter-select"
                            placeholder="السعر من"
                            type="number"
                            value={sPriceFrom}
                            onChange={(e) => { setSPriceFrom(e.target.value); setPage(1); }}
                        />

                        <Input
                            className="filter-select"
                            placeholder="السعر إلى"
                            type="number"
                            value={sPriceTo}
                            onChange={(e) => { setSPriceTo(e.target.value); setPage(1); }}
                        />
                    </div>

                    {/* optional: clear */}
                    <div style={{ marginTop: 10 }}>
                        <Button type="button" variant="ghost" onClick={clearFilters}>
                            مسح الفلاتر
                        </Button>
                    </div>
                </form>

                {/* products */}
                <div className="product-cont">
                    {loading && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground w-full">
                            <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                            <p className="text-lg font-medium">جاري التحميل...</p>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-red-500 w-full">
                            <p className="text-lg font-medium">{errorMessage}</p>
                        </div>
                    )}
                    {!loading && !errorMessage && (
                        <>
                            <div className="product-grid">
                                {items.length === 0 ? (
                                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground w-full">
                                        <SearchX className="h-16 w-16 mb-4 opacity-50" />
                                        <p className="text-lg font-medium">لا توجد نتائج مطابقة</p>
                                    </div>
                                ) : (
                                    items.map((p) => (
                                        <ProductCard key={p.id} product={adToProductCard(p)} />
                                    ))
                                )}
                            </div>

                            {/* pagination */}
                            {paginate && paginate.total_pages > 1 && (
                                <div className="flex justify-center gap-2 mt-6">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        disabled={page <= 1}
                                        onClick={() => setPage((p) => p - 1)}
                                    >
                                        السابق
                                    </Button>
                                    <span className="flex items-center px-3 text-sm">
                                        {paginate.current_page} / {paginate.total_pages}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        disabled={page >= paginate.total_pages}
                                        onClick={() => setPage((p) => p + 1)}
                                    >
                                        التالي
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
