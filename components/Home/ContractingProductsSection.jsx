"use client";

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

import img1 from "@/src/images/3.jpg";
import ProductCard from "../General/ProductCard";



const contractingProducts = [
  {
    id: "1",
    href: "#",
    img: img1,
    typeA: "مقاولات",
    typeB: "بناء",
    name: "مشروع بناء مكتب سكني",
    price: "مجاني",
    dateText: "منذ 1 يوم",
  },
  {
    id: "2",
    href: "#",
    img: img1,
    typeA: "مقاولات",
    typeB: "ديكور",
    name: "مشروع ديكور مكتب",
    price: "2100 د.ك",
    dateText: "منذ 1 يوم",
  },

  {
    id: "3",
    href: "#",
    img: img1,
    typeA: "مقاولات",
    typeB: "صرف",
    name: "مشروع صرف صرف صرف صرف",
    price: "3000 د.ك",
    dateText: "منذ 2 يوم",
  },

  {
    id: "4",
    href: "#",
    img: img1,
    typeA: "مقاولات",
    typeB: "كهرباء",
    name: "مشروع كهرباء مبنى",
    price: "4500 د.ك",
    dateText: "منذ 3 يوم",
  },

  {
    id: "5",
    href: "#",
    img: img1,
    typeA: "مقاولات",
    typeB: "سباكة",
    name: "مشروع سباكة مبنى",
    price: "3500 د.ك",
    dateText: "منذ 4 يوم",
  },

];

export default function ContractingProductsSection() {

  return (
    <section className="product-section">
      <div className="container">
        <div className="section-head">
          <h3 className="section-title">مقاولات وحرف</h3>
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
            {contractingProducts.map((item) => (
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
