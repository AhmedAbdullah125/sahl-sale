"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

import img1 from "@/src/images/01.jpg";
import pin from "@/src/images/pin.png";

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
    const [fav, setFav] = useState({});

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
                                    <Link href={`/product/${item.id}`} className="product-item">
                                        <div className="product-img">
                                            <figure>
                                                <Image
                                                    src={item.img}
                                                    alt="product"
                                                    width={700}
                                                    height={500}
                                                    className="h-auto w-full object-cover"
                                                />
                                            </figure>

                                            {/* Favorite */}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="add-fav"
                                                aria-label="Add to favorites"
                                                onClick={(e) => {
                                                    e.preventDefault(); // don't open the Link
                                                    e.stopPropagation();
                                                    setFav((p) => ({ ...p, [item.id]: !p[item.id] }));
                                                }}
                                            >
                                                <Bookmark
                                                    className={
                                                        fav[item.id] ? "h-5 w-5 fill-current" : "h-5 w-5"
                                                    }
                                                />
                                            </Button>

                                            {/* Pinned */}
                                            {item.pinned ? (
                                                <div className="fixed-block">
                                                    <Image
                                                        src={pin}
                                                        alt="pin"
                                                        width={18}
                                                        height={18}
                                                    />
                                                    <span>مثبت</span>
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="product-content">
                                            <div className="product-type">
                                                <span>{item.typeA}</span> - <span>{item.typeB}</span>
                                            </div>

                                            <h3 className="product-name">{item.name}</h3>

                                            <div className="product-info">
                                                <span>{item.price}</span>
                                                <div className="date">{item.dateText}</div>
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
            </div>
        </section >
    );
}
