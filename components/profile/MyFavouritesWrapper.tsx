"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "../General/ProductCard";
import { useGetFavouriteProducts } from "@/src/hooks/useGetFavouriteProducts";

export default function MyFavouritesWrapper() {
    const router = useRouter();
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useGetFavouriteProducts(page);

    const items = data?.items ?? [];
    const paginate = data?.paginate;
    const totalPages = paginate?.total_pages ?? 1;

    return (
        <section className="content-section" dir="rtl">
            <div className="upper-header">
                <button
                    type="button"
                    className="back-btn"
                    onClick={() => router.back()}
                    aria-label="رجوع"
                >
                    <i className="fa-regular fa-arrow-right" aria-hidden="true"></i>
                </button>

                <h3 className="page-title">المفضلة</h3>
                <div className="empty"></div>
            </div>

            <div className="product-cont">
                {/* ── Loading ── */}
                {isLoading && (
                    <div className="flex justify-center items-center py-16">
                        <span className="text-gray-400">جاري التحميل...</span>
                    </div>
                )}

                {/* ── Error ── */}
                {isError && !isLoading && (
                    <div className="flex justify-center items-center py-16">
                        <span className="text-red-500">حدث خطأ أثناء تحميل البيانات</span>
                    </div>
                )}

                {/* ── Items grid ── */}
                {!isLoading && !isError && (
                    <>
                        {items.length > 0 ? (
                            <div className="product-grid">
                                {items.map((p) => (
                                    <ProductCard
                                        key={p.id}
                                        product={{
                                            id: String(p.id),
                                            href: `/product/${p.id}`,
                                            img: p.image,
                                            typeA: p.parent_category,
                                            typeB: p.category,
                                            name: p.title,
                                            price: p.price,
                                            dateText: p.created_at,
                                            pinned: p.is_pinned,
                                            isFav: p.is_favorite,
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <i className="fa-regular fa-bookmark" aria-hidden="true"></i>
                                <p>لا توجد عناصر في المفضلة</p>
                            </div>
                        )}

                        {/* ── Pagination ── */}
                        {totalPages > 1 && (
                            <div className="pagination" dir="rtl">
                                <button
                                    className="page-btn"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    aria-label="الصفحة السابقة"
                                >
                                    <i className="fa-regular fa-chevron-right"></i>
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                                    <button
                                        key={num}
                                        className={`page-btn ${num === page ? "active" : ""}`}
                                        onClick={() => setPage(num)}
                                        aria-label={`صفحة ${num}`}
                                        aria-current={num === page ? "page" : undefined}
                                    >
                                        {num}
                                    </button>
                                ))}

                                <button
                                    className="page-btn"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    aria-label="الصفحة التالية"
                                >
                                    <i className="fa-regular fa-chevron-left"></i>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
