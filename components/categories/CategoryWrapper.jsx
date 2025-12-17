"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import vehicles from "@/src/images/category/vehicles.png";
import estate from "@/src/images/category/estate.png";
import electronics from "@/src/images/category/electronics.png";
import buySell from "@/src/images/category/Buy&sell.png";
import contracting from "@/src/images/category/Contracting.png";

const gridItems = [
    { id: "1", label: "محركات", img: vehicles, href: "/sub-category/1" },
    { id: "2", label: "عقارات", img: estate, href: "/sub-category/2" },
    { id: "3", label: "الكترونيات", img: electronics, href: "/sub-category/3" },
    { id: "4", label: "بيع وشراء", img: buySell, href: "/sub-category/4" },
    { id: "5", label: "مقاولات وحرف", img: contracting, href: "/sub-category/5" },
];

function CategoryGrid() {
    return (
        <div className="category-grid">
            {gridItems.map((item) => (
                <Link key={item.id} href={item.href} className="category-ancor">
                    <figure className="category-figure">
                        <Image
                            src={item.img}
                            alt={item.label}
                            width={220}
                            height={160}
                            className="h-auto w-full object-contain"
                        />
                    </figure>
                    <span>{item.label}</span>
                </Link>
            ))}
        </div>
    );
}

export default function CategoryWrapper({ id }) {
    return (
        <section className="content-section">
            <div className="container">
                <div className="upper-header">
                    <button
                        type="button"
                        className="back-btn"
                        onClick={() => window.history.back()}
                        aria-label="Back"
                    >
                        <ArrowRight />
                    </button>

                    <h3 className="page-title">محركات</h3>
                    <div className="empty" />
                </div>

                <Link href="/companies" className="page-ancor">
                    الشركات
                </Link>

                <h3 className="category-title">المركبات</h3>
                <CategoryGrid />

                <h3 className="category-title">الدراجات النارية</h3>
                <CategoryGrid />
            </div>
        </section>
    );
}
