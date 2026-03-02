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

interface BidsSectionProps {
    auctions: Ad[];
}

export default function BidsSection({ auctions }: BidsSectionProps) {
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
