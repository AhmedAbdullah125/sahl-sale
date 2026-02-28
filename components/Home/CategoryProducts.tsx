"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ProductCard from "../General/ProductCard";
import { Category } from "@/types/home";

export default function CategoryProducts({ category }: { category: Category }) {

    return (
        <section className="product-section">
            <div className="container">
                <div className="section-head">
                    <h3 className="section-title">{category.name}</h3>
                    <Link href={`/category/${category.id}`} className="products-link">
                        عرض الكل
                    </Link>
                </div>

                {
                    category.ads.length > 0 ?
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
                                {category.ads.map((item) => (
                                    <SwiperSlide key={item.id} className="swiper-slide">
                                        <ProductCard
                                            product={{
                                                id: String(item.id),
                                                href: `/product/${item.id}`,
                                                img: item.image,
                                                name: item.title,
                                                price: item.price,
                                                kind: item.type,
                                                typeA: item.parent_category,
                                                typeB: item.category ?? undefined,
                                                timer: item.ended_at,
                                                currentBid: item.latest_bid?.amount ?? undefined,
                                                dateText: item.created_at,
                                                pinned: category.slug === "pinned" ? true : item.is_pinned,
                                                isFav: item.is_favorite,
                                            }}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        :
                        <p>لا يوجد إعلانات في هذه الفئة</p>
                }
            </div>
        </section>
    );
}
