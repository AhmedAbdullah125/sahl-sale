"use client";

import React, { useState } from "react";
import UpperHeader from "@/components/General/UpperHeader";
import { Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/General/ProductCard";
import AuctionCard from "@/components/Auctions/AuctionCard";
import { useGetPinnedHome } from "@/src/hooks/useGetPinnedHome";
import type { AdItem } from "@/src/hooks/useGetAds";
import Loading from "@/src/app/loading";

function adToCard(ad: AdItem) {
    return {
        id: String(ad.id),
        href: ad.type === "auction" ? `/auction/${ad.id}` : `/product/${ad.id}`,
        imageUrl: ad.image,
        img: ad.image,
        typeA: ad.car?.brand ?? ad.parent_category,
        typeB: ad.car?.model ?? ad.category,
        name: ad.title,
        price: ad.type === "ad" ? ad.price : undefined,
        currentBid: ad.type === "auction" ? (ad.latest_bid?.amount ?? ad.price) : undefined,
        dateText: ad.created_at,
        isPinned: ad.is_pinned,
        pinned: ad.is_pinned,
        isLive: ad.status === "live",
        isFav: ad.is_favorite,
        ended_at: ad.ended_at,
    };
}

export default function PinnedProductsWrapper() {
    const [page, setPage] = useState(1);
    const { data, isLoading: loading, error } = useGetPinnedHome(page);

    const items = data?.items || [];
    const paginate = data?.paginate || null;
    const errorMessage = error instanceof Error ? error.message : null;

    return (
        <section className="content-section">
            <div className="container">
                <UpperHeader title="الإعلانات المثبتة" />

                <div className="product-cont">
                    {loading && (
                        <Loading />
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
                                    items.map((p) =>
                                        p.type === "auction" ? (
                                            <AuctionCard key={p.id} auction={adToCard(p)} />
                                        ) : (
                                            <ProductCard key={p.id} product={adToCard(p)} />
                                        )
                                    )
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
