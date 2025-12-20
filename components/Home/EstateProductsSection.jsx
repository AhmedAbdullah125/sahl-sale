"use client";

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

import img1 from "@/src/images/2.png";
import ProductCard from "../General/ProductCard";



const estateProducts = [
  {
    id: "1",
    href: "#",
    img: img1,
    typeA: "عقارات - للبيع",
    typeB: "شقة",
    name: "شقة في الرياض",
    price: "2100 د.ك",
    dateText: "منذ 1 يوم",
  },
  {
    id: "2",
    href: "#",
    img: img1,
    typeA: "عقارات - للبيع",
    typeB: "للبيع",
    name: "سيارة للبيع RX 2025",
    price: "2100 د.ك",
    dateText: "منذ 1 يوم",
  },
  {
    id: "3",
    href: "#",
    img: img1,
    typeA: "عقارات - للبيع",
    typeB: "للبيع",
    name: "شقة للبيع في الرياض",
    price: "2100 د.ك",
    dateText: "منذ 1 يوم",
  },
  {
    id: "4",
    href: "#",
    img: img1,
    typeA: "عقارات - للبيع",
    typeB: "للبيع",
    name: "سيارة للبيع RX 2025",
    price: "2100 د.ك",
    dateText: "منذ 1 يوم",
  },
];

export default function EstateProductsSection() {
  const [fav, setFav] = useState({});

  return (
    <section className="product-section">
      <div className="container">
        <div className="section-head">
          <h3 className="section-title">عقارات</h3>
          <Link href="#" className="products-link">
            عرض الكل
          </Link>
        </div>

        <div className="swiper">
          <Swiper
            modules={[Autoplay]}
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
            {estateProducts.map((item) => (
              <SwiperSlide key={item.id} className="swiper-slide">
                <ProductCard product={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
