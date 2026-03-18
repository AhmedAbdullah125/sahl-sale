"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Card } from "@/components/ui/card";
import AuctionCard from "../Auctions/AuctionCard";
import { Ad } from "@/types/home";
import { Skeleton } from "@/components/ui/skeleton";

function AuctionCardSkeleton() {
  return (
    <div style={{ flexShrink: 0, width: 220, display: "flex", flexDirection: "column", gap: 8 }}>
      <Skeleton className="h-[160px] w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-3 w-1/2 rounded" />
      <Skeleton className="h-6 w-full rounded" />
    </div>
  );
}

interface BidsSectionProps {
  auctions: Ad[];
  isLoading?: boolean;
}

export default function BidsSection({ auctions, isLoading }: BidsSectionProps) {
  if (isLoading) {
    return (
      <section className="bids-section">
        <div className="container">
          <div className="section-head">
            <h3 className="section-title">
              <Skeleton className="h-5 w-20 rounded" />
            </h3>
            <Skeleton className="products-link h-4 w-16 rounded" />
          </div>
          <div className="swiper">
            <div style={{ display: "flex", gap: 16, overflow: "hidden", paddingBottom: 8 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <AuctionCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!auctions || auctions.length === 0) return null;

  return (
    <section className="bids-section">
      <div className="container">
        <div className="section-head">
          <h3 className="section-title">المزادات</h3>
          <Link href="/auctions" className="products-link">
            عرض الكل
          </Link>
        </div>

        <div className="swiper">
          <Card className="border-0 bg-transparent shadow-none">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={false}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              loop
              spaceBetween={16}
              slidesPerView={1.15}
              breakpoints={{
                100: { slidesPerView: 1.7 },
                480: { slidesPerView: 2.1 },
                768: { slidesPerView: 3.5 },
                1024: { slidesPerView: 4.5 },
              }}
              className="swiper-container"
            >
              {auctions.map((item) => (
                <SwiperSlide key={item.id} className="swiper-slide">
                  <AuctionCard
                    auction={{
                      id: item.id,
                      imageUrl: item.image || "",
                      typeA: item.car?.brand ?? undefined,
                      typeB: item.car?.model ?? undefined,
                      name: item.title,
                      currentBid: item.latest_bid?.amount ?? item.price,
                      isLive: item.status === "live",
                      isPinned: item.is_pinned,
                      ended_at: item.ended_at,
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Card>
        </div>
      </div>
    </section>
  );
}
