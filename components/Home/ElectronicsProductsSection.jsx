"use client";

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

import img1 from "@/src/images/4.jpg";
import ProductCard from "../General/ProductCard";


const electronicsProducts = [
  {
    id: "1",
    href: "#",
    img: img1,
    typeA: "الكترونيات",
    typeB: "لابتوب",
    name: "للبيع لابتوب ردمجك ٩ برو ١٦ رام",
    price: "2100 د.ك",
    dateText: "منذ 1 يوم",
  },
  {
    id: "2",
    href: "#",
    img: img1,
    typeA: "الكترونيات",
    typeB: "لابتوب",
    name: "للبيع لابتوب ردمجك ٩ برو ١٦ رام",
    price: "2100 د.ك",
    dateText: "منذ 1 يوم",
  },

  {
    id: "3",
    href: "#",
    img: img1,
    typeA: "الكترونيات",
    typeB: "هاتف",
    name: "للبيع هاتف آيفون 15 برو",
    price: "3500 د.ك",
    dateText: "منذ 3 أيام",
  },

  {
    id: "4",
    href: "#",
    img: img1,
    typeA: "الكترونيات",
    typeB: "سماعات",
    name: "سماعات لاسلكية Sony WH-1000XM5",
    price: "800 د.ك",
    dateText: "منذ 5 أيام",
  },

  {
    id: "5",
    href: "#",
    img: img1,
    typeA: "الكترونيات",
    typeB: "etableت",
    name: "etableت iPad Pro 12.9 بوصة",
    price: "4500 د.ك",
    dateText: "منذ 2 يوم",
  },
];

export default function ElectronicsProductsSection() {
  const [fav, setFav] = useState({});

  return (
    <section className="product-section">
      <div className="container">
        <div className="section-head">
          <h3 className="section-title">الكترونيات</h3>
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
            {electronicsProducts.map((item) => (
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
