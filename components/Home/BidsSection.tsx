"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { Card } from "@/components/ui/card";

import img1 from '@/src/images/01.jpg'
import AuctionCard from "../Auctions/AuctionCard";

const auctions = [
    {
        id: 1,
        href: "#",
        imageUrl: img1,
        typeA: "يباني",
        typeB: "لكزس",
        name: "سيارة لكزس RX 2025",
        currentBid: "2100 د.ك",
        timer: "00:15:30",
        isLive: true,
        isPinned: false,
    },
    {
        id: 2,
        href: "#",
        imageUrl: img1,
        timer: "00:15:30",
        typeA: "يباني",
        typeB: "لكزس",
        name: "سيارة لكزس RX 2025",
        currentBid: "2100 د.ك",
        isLive: true,
    },
    {
        id: 3,
        href: "#",
        imageUrl: img1,
        timer: "00:15:30",
        typeA: "يباني",
        typeB: "لكزس",
        name: "سيارة لكزس RX 2025",
        currentBid: "2100 د.ك",
        isLive: true,
    },
    {
        id: 4,
        href: "#",
        imageUrl: img1,
        timer: "00:15:30",
        typeA: "يباني",
        typeB: "لكزس",
        name: "سيارة لكزس RX 2025",
        currentBid: "2100 د.ك",
        isLive: true,
    },
    {
        id: 5,
        href: "#",
        imageUrl: img1,
        timer: "00:15:30",
        typeA: "يباني",
        typeB: "لكزس",
        name: "سيارة لكزس RX 2025",
        currentBid: "2100 د.ك",
        isLive: true,
    },

];

export default function BidsSection() {
    return (
        <section className="bids-section">
            <div className="container">
                <div className="section-head">
                    <h3 className="section-title">المزادات</h3>
                    <Link href="#" className="products-link">
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
                            {auctions.map((item, idx) => (
                                <SwiperSlide key={idx} className="swiper-slide">
                                    <AuctionCard auction={item} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Card>
                </div>
            </div>
        </section>
    );
}
