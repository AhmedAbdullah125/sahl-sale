"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import AuctionCard from "./AuctionCard";
import img1 from "@/src/images/01.jpg";

export default function AuctionsWrapper() {
    const router = useRouter();

    const items = useMemo(
        () => [
            {
                id: 1,
                href: "#",
                imageUrl: img1,
                typeA: "يباني",
                typeB: "لكزس",
                name: "سيارة لكزس RX 2025",
                currentBid: "2100 د.ك",
                timer: "00:15:30",
                isLive: true,
                isPinned: false,
            },
            {
                id: 2,
                href: "#",
                imageUrl: img1,
                typeA: "يباني",
                typeB: "لكزس",
                name: "سيارة لكزس RX 2025",
                currentBid: "2100 د.ك",
                timer: "00:15:30",
                isLive: true,
                isPinned: true,
            },
        ],
        []
    );

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
                        {/* انت بتستخدم FontAwesome في UI الأصلي */}
                        <i className="fa-regular fa-arrow-right" aria-hidden="true"></i>
                    </button>

                    <h3 className="page-title">المزادات</h3>
                    <div className="empty"></div>
                </div>

                <div className="product-cont">
                    <div className="product-grid">
                        {items.map((a) => (
                            <AuctionCard
                                key={a.id}
                                auction={a}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
