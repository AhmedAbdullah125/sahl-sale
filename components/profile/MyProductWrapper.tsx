"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UpperHeader from "@/components/General/UpperHeader";
import { PackageOpen } from "lucide-react";
import { useGetMyAds, AdItem } from "@/src/hooks/useGetMyAds";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "active" | "auction" | "archived";

const TABS: { key: TabKey; label: string }[] = [
    { key: "active", label: "إعلاناتي الفعالة" },
    { key: "auction", label: "مزاداتي" },
    { key: "archived", label: "الأرشيف" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function MyProductWrapper() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("active");
    const [page, setPage] = useState(1);

    const { data, isLoading: loading, isError } = useGetMyAds(activeTab, page);
    const items: AdItem[] = data?.items ?? [];
    const paginate = data?.paginate ?? null;

    const handleTabChange = (tab: TabKey) => {
        setActiveTab(tab);
        setPage(1);
    };

    return (
        <section className="my-products-section" dir="rtl">
            <UpperHeader title="إعلاناتي" />

            <div className="product-cont">
                {/* tabs */}
                <div className="product-btn-filter">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            className={`filter-btn ${activeTab === t.key ? "active" : ""}`}
                            onClick={() => handleTabChange(t.key)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* states */}
                {loading && (
                    <div className="flex justify-center py-10">
                        <span className="text-gray-500">جاري التحميل...</span>
                    </div>
                )}

                {isError && (
                    <div className="flex justify-center py-10">
                        <span className="text-red-500">حدث خطأ أثناء تحميل البيانات</span>
                    </div>
                )}

                {!loading && !isError && (
                    <>
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <PackageOpen className="w-16 h-16 mb-4 text-gray-300" />
                                <h4 className="text-lg font-semibold mb-2">لا توجد إعلانات</h4>
                                <p className="text-sm">لم تقم بإضافة أي إعلانات في هذا القسم بعد.</p>
                            </div>
                        ) : (
                            <div className="product-grid">
                                {items.map((ad) => (
                                    <Link
                                        key={ad.id}
                                        href={`/product/${ad.id}`}
                                        className="product-item"
                                        aria-label={ad.title}
                                    >
                                        <div className="product-img">
                                            <figure>
                                                <Image src={ad.image} alt={ad.title} width={400} height={300} className="h-auto w-full object-cover" />
                                            </figure>

                                            <button
                                                type="button"
                                                className="edit-btn"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    router.push(`/edit-product/${ad.id}`);
                                                }}
                                                aria-label="تعديل الإعلان"
                                            >
                                                <i className="fa-solid fa-pen-line" aria-hidden="true"></i>
                                            </button>
                                        </div>

                                        <div className="product-content">
                                            <div className="product-type">
                                                <span>{ad.car?.brand ?? ad.parent_category}</span>
                                                {" - "}
                                                <span>{ad.car?.model ?? ad.category}</span>
                                            </div>

                                            <h3 className="product-name">{ad.title}</h3>

                                            <div className="product-info">
                                                <span>{ad.price}</span>
                                                <div className="date">{ad.created_at}</div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* pagination */}
                        {paginate && paginate.total_pages > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                <button
                                    type="button"
                                    className="filter-btn"
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    السابق
                                </button>
                                <span className="flex items-center px-3 text-sm">
                                    {paginate.current_page} / {paginate.total_pages}
                                </span>
                                <button
                                    type="button"
                                    className="filter-btn"
                                    disabled={page >= paginate.total_pages}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    التالي
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
