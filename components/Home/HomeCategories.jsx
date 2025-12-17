"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import { Card } from "@/components/ui/card";

import img1 from "@/src/images/category/vehicles.png";
import img2 from "@/src/images/category/estate.png";
import img3 from "@/src/images/category/electronics.png";
import img4 from "@/src/images/category/Buy&sell.png";
import img5 from "@/src/images/category/Contracting.png";


const categories = [
    { title: "محركات", href: "#", img: img1, alt: "vehicles" },
    { title: "عقارات", href: "#", img: img2, alt: "estate" },
    { title: "الكترونيات", href: "#", img: img3, alt: "electronics" },
    { title: "بيع وشراء", href: "#", img: img4, alt: "buy and sell" },
    { title: "مقاولات وحرف", href: "#", img: img5, alt: "contracting" },
];

export default function HomeCategories() {
    return (
        <section className="category-section">
            <div className="container">
                <div className="category-slider">
                    <Card className="border-0 bg-transparent shadow-none">
                        <Swiper
                            modules={[Autoplay]}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            loop
                            spaceBetween={16}
                            slidesPerView={2.2}
                            breakpoints={{
                                480: { slidesPerView: 3.2 },
                                768: { slidesPerView: 4.2 },
                                1024: { slidesPerView: 5 },
                            }}
                            className="swiper"
                        >
                            {categories.map((cat) => (
                                <SwiperSlide key={cat.title} className="swiper-slide">
                                    <Link href={cat.href} className="category-ancor">
                                        <figure className="category-figure">
                                            <Image
                                                src={cat.img}
                                                alt={cat.alt}
                                                width={120}
                                                height={120}
                                                className="h-auto w-full object-contain"
                                            />
                                        </figure>
                                        <span>{cat.title}</span>
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
