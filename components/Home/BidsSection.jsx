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

const auctions = [
    {
        href: "#",
        img: img1,
        timer: "00:15:30",
        typeA: "يباني",
        typeB: "لكزس",
        name: "سيارة لكزس RX 2025",
        currentBid: "2100 د.ك",
        isLive: true,
    },
    {
        href: "#",
        img: img1,
        timer: "00:15:30",
        typeA: "يباني",
        typeB: "لكزس",
        name: "سيارة لكزس RX 2025",
        currentBid: "2100 د.ك",
        isLive: true,
    },
    {
        href: "#",
        img: img1,
        timer: "00:15:30",
        typeA: "يباني",
        typeB: "لكزس",
        name: "سيارة لكزس RX 2025",
        currentBid: "2100 د.ك",
        isLive: true,
    },
    {
        href: "#",
        img: img1,
        timer: "00:15:30",
        typeA: "يباني",
        typeB: "لكزس",
        name: "سيارة لكزس RX 2025",
        currentBid: "2100 د.ك",
        isLive: true,
    },
    {
        href: "#",
        img: img1,
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
                                    <Link href={`/product/${item.id}`} className="product-item">
                                        <div className="product-img">
                                            <figure>
                                                <Image
                                                    src={item.img}
                                                    alt="product"
                                                    width={600}
                                                    height={400}
                                                    className="h-auto w-full object-cover"
                                                />
                                            </figure>

                                            <div className="timer">{item.timer}</div>
                                            {item.isLive ? <div className="live-dot" /> : null}
                                        </div>

                                        <div className="product-content">
                                            <div className="product-type">
                                                <span>{item.typeA}</span> - <span>{item.typeB}</span>
                                            </div>

                                            <h3 className="product-name">{item.name}</h3>

                                            <div className="product-status">
                                                السوم واصل : <span>{item.currentBid}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Card>
                </div>
            </div>
        </section>
    );
}
