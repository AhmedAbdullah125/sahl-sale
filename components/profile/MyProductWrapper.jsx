// components/SideData.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import img1 from "@/src/images/01.jpg";



export default function MyProductWrapper({ }) {
    const [activeTab, setActiveTab] = useState("active");
    const router = useRouter();
    const fallback = {
        active: [
            {
                id: 1,
                href: "/my-products/1",
                imageUrl: img1,
                typeLeft: "يباني",
                typeRight: "لكزس",
                name: "سيارة لكزس RX 2025",
                price: "2100 د.ك",
                dateLabel: "منذ 1 يوم",
            },
            {
                id: 2,
                href: "/my-products/2",
                imageUrl: img1,
                typeLeft: "يباني",
                typeRight: "لكزس",
                name: "سيارة لكزس RX 2025",
                price: "2100 د.ك",
                dateLabel: "منذ 1 يوم",
            },
        ],
        bids: [
            {
                id: 3,
                href: "/my-products/3",
                imageUrl: img1,
                typeLeft: "يباني",
                typeRight: "تويوتا",
                name: "مزاد تويوتا 2024",
                price: "1500 د.ك",
                dateLabel: "منذ 3 أيام",
            },
        ],
        archive: [
            {
                id: 4,
                href: "/my-products/4",
                imageUrl: img1,
                typeLeft: "أمريكي",
                typeRight: "فورد",
                name: "فورد موستنغ 2020 (مؤرشف)",
                price: "980 د.ك",
                dateLabel: "منذ 2 شهر",
            },
        ],
    };
    return (
        <section className="my-products-section" dir="rtl">
            <div className="upper-header">
                <button
                    type="button"
                    className="back-btn"
                    onClick={() => {
                        setActiveTab("active")
                        router.back()
                    }}
                    aria-label="رجوع"
                >
                    <i className="fa-regular fa-arrow-right" aria-hidden="true"></i>
                </button>

                <h3 className="page-title">{"إعلاناتي"}</h3>

                <div className="empty"></div>
            </div>

            <div className="product-cont">
                <div className="product-btn-filter">
                    <button
                        type="button"
                        className={`filter-btn ${activeTab === "active" ? "active" : ""}`}
                        onClick={() => setActiveTab("active")}
                    >
                        إعلاناتي الفعالة
                    </button>

                    <button
                        type="button"
                        className={`filter-btn ${activeTab === "bids" ? "active" : ""}`}
                        onClick={() => setActiveTab("bids")}
                    >
                        مزاداتي
                    </button>

                    <button
                        type="button"
                        className={`filter-btn ${activeTab === "archive" ? "active" : ""}`}
                        onClick={() => setActiveTab("archive")}
                    >
                        الأرشيف
                    </button>
                </div>

                <div className="product-grid-2">
                    {fallback[activeTab]?.length ? (
                        fallback[activeTab].map((p) => (
                            <Link
                                key={p.id}
                                href={p.href || "#"}
                                className="product-item"
                                aria-label={p.name}
                            >
                                <div className="product-img">
                                    <figure>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <Image src={p.imageUrl} alt="product" />
                                    </figure>

                                    <button
                                        type="button"
                                        className="edit-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            p.onEditClick?.();
                                        }}
                                        aria-label="تعديل الإعلان"
                                    >
                                        <i className="fa-solid fa-pen-line" aria-hidden="true"></i>
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
                        // اختياري: لو مفيش بيانات للتاب
                        <div className="product-grid-2">
                            <div style={{ padding: 12 }}>لا توجد عناصر</div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
