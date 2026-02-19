"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ProductCard from "../General/ProductCard";
import { API_BASE_URL } from "@/lib/apiConfig";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CarDetails {
    brand: string;
    model: string;
    year: string;
}

interface AdItem {
    id: number;
    title: string;
    price: string;
    ad_form: string;
    type: "ad" | "auction";
    parent_category: string;
    category: string;
    is_pinned: boolean;
    car: CarDetails | null;
    image: string;
    created_at: string;
    ended_at: string;
    status: string;
    is_favorite: boolean;
}

interface Paginate {
    total: number;
    count: number;
    per_page: number;
    next_page_url: string;
    prev_page_url: string;
    current_page: number;
    total_pages: number;
}

interface AdsResponse {
    status: boolean;
    data: {
        items: AdItem[];
        paginate: Paginate;
        extra: unknown;
    };
}

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

// ─── Component ────────────────────────────────────────────────────────────────

export default function SubCategoryWrapper({ id }: { id: string }) {
    // filter state
    const [tab, setTab] = useState<"all" | "ad" | "auction">("all");
    const [q, setQ] = useState("");
    const [sBrand, setSBrand] = useState("");
    const [sModel, setSModel] = useState("");
    const [sYearFrom, setSYearFrom] = useState("");
    const [sYearTo, setSYearTo] = useState("");
    const [sPriceFrom, setSPriceFrom] = useState("");
    const [sPriceTo, setSPriceTo] = useState("");
    const [page, setPage] = useState(1);

    // data state
    const [items, setItems] = useState<AdItem[]>([]);
    const [paginate, setPaginate] = useState<Paginate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAds = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const headers: Record<string, string> = { "accept-language": "ar" };
            if (token) headers.Authorization = `Bearer ${token}`;

            const params = new URLSearchParams();
            params.set("page", String(page));
            params.set("category_id", id);
            if (tab !== "all") params.set("type", tab);
            if (sBrand) params.set("brand_id", sBrand);
            if (sModel) params.set("model_id", sModel);
            if (sYearFrom) params.set("year_from", sYearFrom);
            if (sYearTo) params.set("year_to", sYearTo);
            if (sPriceFrom) params.set("price_from", sPriceFrom);
            if (sPriceTo) params.set("price_to", sPriceTo);

            const res = await fetch(`${API_BASE_URL}/ads?${params.toString()}`, { headers });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json: AdsResponse = await res.json();
            if (json.status) {
                setItems(json.data.items);
                setPaginate(json.data.paginate);
            } else {
                setError("فشل تحميل الإعلانات");
            }
        } catch {
            setError("حدث خطأ أثناء تحميل البيانات");
        } finally {
            setLoading(false);
        }
    }, [id, tab, sBrand, sModel, sYearFrom, sYearTo, sPriceFrom, sPriceTo, page]);

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

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

    const displayedItems = q.trim()
        ? items.filter((item) => item.title.includes(q.trim()))
        : items;

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
                    <h3 className="page-title">الإعلانات</h3>
                    <div className="empty" />
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
                        <Button type="submit" size="icon" className="search-button" aria-label="Search">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                </div>

                {/* filters */}
                <form className="product-filters" onSubmit={(e) => e.preventDefault()}>
                    {/* type tabs */}
                    <div className="product-btn-filter pills">
                        {(["all", "ad", "auction"] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                className={`filter-btn ${tab === t ? "active" : ""}`}
                                onClick={() => { setTab(t); setPage(1); }}
                            >
                                {t === "all" ? "الكل" : t === "ad" ? "بيع" : "مزاد"}
                            </button>
                        ))}
                    </div>

                    {/* selects */}
                    <div className="product-select-filter selects-row">
                        <Select value={sBrand} onValueChange={applyFilter(setSBrand)}>
                            <SelectTrigger className="filter-select">
                                <SelectValue placeholder="الماركة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">تويوتا</SelectItem>
                                <SelectItem value="2">لكزس</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sModel} onValueChange={applyFilter(setSModel)}>
                            <SelectTrigger className="filter-select">
                                <SelectValue placeholder="الموديل" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">كامري</SelectItem>
                                <SelectItem value="2">RX</SelectItem>
                                <SelectItem value="3">لاندكروزر</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sYearFrom} onValueChange={applyFilter(setSYearFrom)}>
                            <SelectTrigger className="filter-select">
                                <SelectValue placeholder="سنة من" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 10 }, (_, i) => String(2025 - i)).map((y) => (
                                    <SelectItem key={y} value={y}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={sYearTo} onValueChange={applyFilter(setSYearTo)}>
                            <SelectTrigger className="filter-select">
                                <SelectValue placeholder="سنة إلى" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 10 }, (_, i) => String(2025 - i)).map((y) => (
                                    <SelectItem key={y} value={y}>{y}</SelectItem>
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

                    <div style={{ marginTop: 10 }}>
                        <Button type="button" variant="ghost" onClick={clearFilters}>
                            مسح الفلاتر
                        </Button>
                    </div>
                </form>

                {/* products */}
                <div className="product-cont">
                    {loading && (
                        <div className="flex justify-center py-10">
                            <span className="text-gray-500">جاري التحميل...</span>
                        </div>
                    )}
                    {error && (
                        <div className="flex justify-center py-10">
                            <span className="text-red-500">{error}</span>
                        </div>
                    )}
                    {!loading && !error && (
                        <>
                            <div className="product-grid">
                                {displayedItems.length === 0 ? (
                                    <div className="rounded-lg border p-4 text-center col-span-full">
                                        لا توجد نتائج مطابقة
                                    </div>
                                ) : (
                                    displayedItems.map((ad) => (
                                        <ProductCard key={ad.id} product={adToProductCard(ad)} />
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
