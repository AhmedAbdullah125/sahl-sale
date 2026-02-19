// components/MyFavouritesWrapper.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import img1 from "@/src/images/01.jpg";
import ProductCard from "../General/ProductCard";

export default function MyFavouritesWrapper() {
    const router = useRouter();

    const [items, setItems] = useState([
        {
            id: "1",
            href: "#",
            img: img1,
            typeA: "يباني",
            typeB: "لكزس",
            name: "سيارة لكزس RX 2025",
            price: "2100 د.ك",
            dateText: "منذ 1 يوم",
            isFav: true,
        },
        {
            id: "2",
            href: "#",
            img: img1,
            typeA: "يباني",
            typeB: "لكزس",
            name: "سيارة لكزس RX 2025",
            price: "2100 د.ك",
            dateText: "منذ 1 يوم",
            isFav: true,
        },
        {
            id: "3",
            href: "#",
            img: img1,
            typeA: "يباني",
            typeB: "لكزس",
            name: "سيارة لكزس RX 2025",
            price: "2100 د.ك",
            dateText: "منذ 1 يوم",
            isFav: true,
        }
    ]);

    const favItems = useMemo(() => items.filter((x) => x.isFav), [items]);

    const toggleFav = (id) => {
        setItems((prev) =>
            prev.map((x) => (x.id === id ? { ...x, isFav: !x.isFav } : x))
        );
    };

    return (
        <section className="content-section" dir="rtl">
            <div className="upper-header">
                <button
                    type="button"
                    className="back-btn"
                    onClick={() => router.back()}
                    aria-label="رجوع"
                >
                    <i className="fa-regular fa-arrow-right" aria-hidden="true"></i>
                </button>

                <h3 className="page-title">المفضلة</h3>
                <div className="empty"></div>
            </div>

            <div className="product-cont">
                <div className="product-grid">
                    {favItems.length ? (
                        favItems.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))
                    ) : (
                        <div style={{ padding: 12 }}>لا توجد عناصر في المفضلة</div>
                    )}
                </div>
            </div>
        </section>
    );
}
