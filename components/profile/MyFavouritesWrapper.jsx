// components/MyFavouritesWrapper.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import img1 from "@/src/images/01.jpg";

export default function MyFavouritesWrapper() {
    const router = useRouter();

    const [items, setItems] = useState([
        {
            id: 1,
            href: "#",
            imageUrl: img1,
            typeLeft: "يباني",
            typeRight: "لكزس",
            name: "سيارة لكزس RX 2025",
            price: "2100 د.ك",
            dateLabel: "منذ 1 يوم",
            isFav: true,
        },
        {
            id: 2,
            href: "#",
            imageUrl: img1,
            typeLeft: "يباني",
            typeRight: "لكزس",
            name: "سيارة لكزس RX 2025",
            price: "2100 د.ك",
            dateLabel: "منذ 1 يوم",
            isFav: true,
        },
        {
            id: 3,
            href: "#",
            imageUrl: img1,
            typeLeft: "يباني",
            typeRight: "لكزس",
            name: "سيارة لكزس RX 2025",
            price: "2100 د.ك",
            dateLabel: "منذ 1 يوم",
            isFav: true,
        },
        {
            id: 4,
            href: "#",
            imageUrl: img1,
            typeLeft: "يباني",
            typeRight: "لكزس",
            name: "سيارة لكزس RX 2025",
            price: "2100 د.ك",
            dateLabel: "منذ 1 يوم",
            isFav: true,
        },
        {
            id: 5,
            href: "#",
            imageUrl: img1,
            typeLeft: "يباني",
            typeRight: "لكزس",
            name: "سيارة لكزس RX 2025",
            price: "2100 د.ك",
            dateLabel: "منذ 1 يوم",
            isFav: true,
        },
        {
            id: 6,
            href: "#",
            imageUrl: img1,
            typeLeft: "يباني",
            typeRight: "لكزس",
            name: "سيارة لكزس RX 2025",
            price: "2100 د.ك",
            dateLabel: "منذ 1 يوم",
            isFav: true,
        },
    ]);

    const favItems = useMemo(() => items.filter((x) => x.isFav), [items]);

    const toggleFav = (id) => {
        setItems((prev) =>
            prev.map((x) => (x.id === id ? { ...x, isFav: !x.isFav } : x))
        );
    };

    return (
        <section className="content-section" dir="rtl">
            <div className="container">
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
                                <Link
                                    key={p.id}
                                    href={p.href || "#"}
                                    className="product-item"
                                    aria-label={p.name}
                                >
                                    <div className="product-img">
                                        <figure>
                                            <Image
                                                src={p.imageUrl}
                                                alt="product"
                                                // لو CSS بتتحكم في الحجم، خليه responsive:
                                                style={{ width: "100%", height: "auto" }}
                                            />
                                        </figure>

                                        <button
                                            type="button"
                                            className="add-fav"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleFav(p.id);
                                            }}
                                            aria-label="إزالة/إضافة للمفضلة"
                                        >
                                            <i className="fa-solid fa-bookmark" aria-hidden="true"></i>
                                        </button>
                                    </div>

                                    <div className="product-content">
                                        <div className="product-type">
                                            <span>{p.typeLeft}</span> - <span>{p.typeRight}</span>
                                        </div>

                                        <h3 className="product-name">{p.name}</h3>

                                        <div className="product-info">
                                            <span>{p.price}</span>
                                            <div className="date">{p.dateLabel}</div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div style={{ padding: 12 }}>لا توجد عناصر في المفضلة</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
