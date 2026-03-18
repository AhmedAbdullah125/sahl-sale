"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Card } from "@/components/ui/card";
import { Category } from "@/types/home";
import { Skeleton } from "@/components/ui/skeleton";

interface HomeCategoriesProps {
  categories: Category[];
  isLoading?: boolean;
}

export default function HomeCategories({ categories, isLoading }: HomeCategoriesProps) {
  if (isLoading) {
    return (
      <section className="category-section">
        <div className="container">
          <div className="category-slider">
            <div style={{ display: "flex", gap: 16, overflow: "hidden", padding: "8px 0" }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="category-ancor" style={{ pointerEvents: "none" }}>
                  <figure className="category-figure">
                    <Skeleton className="h-[212px] w-[212px]" />
                  </figure>
                  <Skeleton style={{ height: 14, width: 56, borderRadius: 6, marginTop: 6 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

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
                <SwiperSlide key={cat.id} className="swiper-slide">
                  <Link href={`/categories/${cat.id}`} className="category-ancor">
                    <figure className="category-figure">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={120}
                        height={120}
                        className="h-auto w-full object-contain"
                      />
                    </figure>
                    <span>{cat.name}</span>
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
