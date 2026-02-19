"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import MyBidCard from "./MyBidCard";

// مثال صورة محلية (بدّلها ببيانات API)
import img1 from "@/src/images/01.jpg";

export default function MyAuctionsWrapper() {
    const router = useRouter();

    // بيانات تجريبية — بدّلها ببيانات API
    const items = useMemo(
        () => [
            {
                id: 1,
                href: "#",
                imageUrl: img1,
                name: "سيارة لكزس RX 2025....",
                price: "2100 د.ك",
                variant: "pass",
                statusText: "✅",
                isLive: true,
            },
            {
                id: 2,
                href: "#",
                imageUrl: img1,
                name: "سيارة لكزس RX 2025....",
                price: "2100 د.ك",
                variant: "fail",
                statusText: "+ سوم",
                isLive: true,
            },
            {
                id: 3,
                href: "#",
                imageUrl: img1,
                name: "سيارة لكزس RX 2025....",
                price: "2100 د.ك",
                variant: "pass",
                statusText: "✅",
                isLive: true,
            },
            {
                id: 4,
                href: "#",
                imageUrl: img1,
                name: "سيارة لكزس RX 2025....",
                price: "2100 د.ك",
                variant: "fail",
                statusText: "+ سوم",
                isLive: true,
            },
        ],
        []
    );

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

                <h3 className="page-title">مزايداتي</h3>
                <div className="empty"></div>
            </div>

            <div className="product-cont">
                <div className="product-grid">
                    {items.map((x) => (
                        <MyBidCard
                            key={x.id}
                            href={x.href}
                            imageUrl={x.imageUrl}
                            name={x.name}
                            price={x.price}
                            variant={x.variant}
                            statusText={x.statusText}
                            isLive={x.isLive}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
