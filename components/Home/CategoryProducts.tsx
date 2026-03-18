"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ProductCard from "../General/ProductCard";
import { Category } from "@/types/home";
import AuctionCard from "../Auctions/AuctionCard";
import { Skeleton } from "@/components/ui/skeleton";

function ProductCardSkeleton() {
  return (
    <div style={{ flexShrink: 0, width: 220, display: "flex", flexDirection: "column", gap: 8 }}>
      <Skeleton className="h-[160px] w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-3 w-1/2 rounded" />
      <Skeleton className="h-5 w-1/3 rounded" />
    </div>
  );
}

export function CategoryProductsSkeletonList() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <section key={i} className="product-section">
          <div className="container">
            <div className="section-head">
              <h3 className="section-title">
                <Skeleton className="h-5 w-36 rounded" />
              </h3>
              <Skeleton className="products-link h-4 w-16 rounded" />
            </div>
            <div className="swiper">
              <div style={{ display: "flex", gap: 16, overflow: "hidden", paddingBottom: 8 }}>
                {Array.from({ length: 4 }).map((_, j) => (
                  <ProductCardSkeleton key={j} />
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

export default function CategoryProducts({ category }: { category: Category }) {
  return (
    <section className="product-section">
      <div className="container">
        <div className="section-head">
          <h3 className="section-title">{category.name}</h3>

          <Link
            href={category.id ? `/categories/${category.id}` : `/pinned-products`}
            className="products-link"
          >
            عرض الكل
          </Link>
        </div>

        {category.ads.length > 0 ? (
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
                  {item.type == "ad" ? (
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
                  ) : (
                    <AuctionCard
                      auction={{
                        id: String(item.id),
                        imageUrl: item.image,
                        name: item.title,
                        typeA: item.parent_category,
                        typeB: item.category ?? undefined,
                        ended_at: item.ended_at,
                        currentBid: item.latest_bid?.amount ?? item.price,
                        isLive: item.status === "live",
                        isPinned: category.slug === "pinned" ? true : item.is_pinned,
                      }}
                    />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <p>لا يوجد إعلانات في هذه الفئة</p>
        )}
      </div>
    </section>
  );
}
