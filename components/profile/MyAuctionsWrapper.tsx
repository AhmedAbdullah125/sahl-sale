"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MyBidCard from "./MyBidCard";
import { useGetMyBids } from "@/src/hooks/useGetMyBids";
import { PackageOpen } from "lucide-react";

export default function MyAuctionsWrapper() {
    const router = useRouter();
    const [page, setPage] = useState(1);

    const { data, isLoading: loading, isError } = useGetMyBids(page);
    const items = data?.items ?? [];
    const paginate = data?.paginate ?? null;

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

                <h3 className="page-title">مزايداتي</h3>
                <div className="empty"></div>
            </div>

            <div className="product-cont">
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
                                <h4 className="text-lg font-semibold mb-2">لا يوجد مزايدات</h4>
                                <p className="text-sm">لم تقم بالمزايدة على أي منتج بعد.</p>
                            </div>
                        ) : (
                            <div className="product-grid">
                                {items.map((bid) => {
                                    const displayedPrice = bid.latest_bid?.amount || bid.price;
                                    const variant = bid.my_bid ? "pass" : "fail";
                                    const statusText = bid.my_bid ? "✅" : "+ سوم";
                                    const isLive = bid.status === "live";

                                    return (
                                        <MyBidCard
                                            key={bid.id}
                                            id={bid.id}
                                            imageUrl={bid.image}
                                            name={bid.title}
                                            price={`${displayedPrice} د.ك`}
                                            variant={variant}
                                            statusText={statusText}
                                            isLive={isLive}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {/* pagination */}
                        {paginate && paginate.total_pages > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                <button
                                    type="button"
                                    className="filter-btn"
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
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
