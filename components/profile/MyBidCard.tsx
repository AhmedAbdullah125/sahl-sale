"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function MyBidCard({
    href = "#",
    imageUrl,
    name = "سيارة لكزس RX 2025....",
    price = "2100 د.ك",
    statusText = "✅", // أو "+ سوم"
    variant = "pass", // "pass" | "fail"
    isLive = true,
}) {
    return (
        <Link href={href} className="my-bids-item" aria-label={name}>
            <div className="my-bids-flex">
                <div className="my-bids-info">
                    <figure>
                        <Image
                            src={imageUrl}
                            alt="product"
                            style={{ width: "100%", height: "auto" }}
                        />
                    </figure>
                    <h3 className="product-name">{name}</h3>
                </div>

                {isLive ? <div className="live-dot"></div> : null}
            </div>

            <div className={`bids-status ${variant}`}>
                <span className="price">{price}</span>
                <span className="status">{statusText}</span>
            </div>
        </Link>
    );
}
