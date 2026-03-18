"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuctionCard from "./AuctionCard";
import { useGetAds, type AdItem } from "@/src/hooks/useGetAds";
import Loading from "@/src/app/loading";

function adToAuction(ad: AdItem) {
    return {
        id: String(ad.id),
        href: `/auction/${ad.id}`,
        imageUrl: ad.image,
        typeA: ad.car?.brand ?? ad.parent_category,
        typeB: ad.car?.model ?? ad.category,
        name: ad.title,
        currentBid: ad.latest_bid?.amount ?? ad.price,
        ended_at: ad.ended_at,
        isLive: ad.status === "live",
        isPinned: ad.is_pinned,
    };
}

export default function AuctionsWrapper() {
    const router = useRouter();
    const [page, setPage] = useState(1);

    const { data, isLoading: loading, error } = useGetAds({ type: "auction", page });

    const items: AdItem[] = data?.items || [];
    const paginate = data?.paginate || null;
    const errorMessage = error instanceof Error ? error.message : null;

    return (
        <section className="content-section" dir="rtl">
            <div className="container">
                <div className="upper-header">
                    <div className="">
                        {/* <button
                            type="button"
                            className="back-btn"
                            onClick={() => router.back()}
                            aria-label="رجوع"
                        >
                            <i className="fa-regular fa-arrow-right" aria-hidden="true" />
                        </button> */}
                    </div>
                    <h3 className="page-title">المزادات</h3>
                    <div className="empty" />
                </div>

                <div className="product-cont">
                    {loading && (
                        <Loading />
                    )}

                    {errorMessage && (
                        <div className="flex flex-col items-center justify-center py-12 text-red-500 w-full">
                            <p className="text-lg font-medium">{errorMessage}</p>
                        </div>
                    )}

                    {!loading && !errorMessage && (
                        <>
                            <div className="product-grid">
                                {items.length === 0 ? (
                                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground w-full">
                                        <SearchX className="h-16 w-16 mb-4 opacity-50" />
                                        <p className="text-lg font-medium">لا توجد مزادات</p>
                                    </div>
                                ) : (
                                    items.map((ad) => (
                                        <AuctionCard key={ad.id} auction={adToAuction(ad)} />
                                    ))
                                )}
                            </div>

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
