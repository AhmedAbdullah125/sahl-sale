"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import img1 from "@/src/images/01.jpg";
import ProductCard from "../General/ProductCard";

const featuredAds = [
    {
        id: "1",
        href: "#",
        img: img1,
        typeA: "يباني",
        typeB: "لكزس",
        name: "سيارة لكزس RX 2025",
        price: "2100 د.ك",
        dateText: "منذ 1 يوم",
        pinned: true,
    },
    { id: "2", href: "#", img: img1, typeA: "يباني", typeB: "لكزس", name: "سيارة لكزس RX 2025", price: "2100 د.ك", dateText: "منذ 1 يوم", pinned: true },
    { id: "3", href: "#", img: img1, typeA: "يباني", typeB: "لكزس", name: "سيارة لكزس RX 2025", price: "2100 د.ك", dateText: "منذ 1 يوم", pinned: true },
    { id: "4", href: "#", img: img1, typeA: "يباني", typeB: "لكزس", name: "سيارة لكزس RX 2025", price: "2100 د.ك", dateText: "منذ 1 يوم", pinned: true },
];

export default function FeaturedProductsSection() {

    return (
        <section className="product-section">
            <div className="container">
                <div className="section-head">
                    <h3 className="section-title">الاعلانات المميزة</h3>
                    <Link href="#" className="products-link">
                        عرض الكل
                    </Link>
                </div>

                <div className="swiper">
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
                        }}
                        className="swiper-container"
                    >
                        {
                            featuredAds.map((item) => (
                                <SwiperSlide key={item.id} className="swiper-slide">
                                    <ProductCard product={item} />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
            </div>
        </section >
    );
}
