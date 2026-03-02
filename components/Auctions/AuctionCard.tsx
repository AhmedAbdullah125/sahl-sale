"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import pinImg from "@/src/images/pin.png";

interface Auction {
    id: number | string;
    href?: string;
    imageUrl: StaticImageData | string;
    typeA?: string;
    typeB?: string;
    name: string;
    currentBid?: string | number | null;
    ended_at?: string;
    isLive?: boolean;
    isPinned?: boolean;
    status?: string;
    onEdit?: () => void;
}

function useCountdown(endedAt?: string): string | null {
    const [display, setDisplay] = useState<string | null>(null);

    useEffect(() => {
        if (!endedAt) { setDisplay(null); return; }

        // Parse "DD MMM YY" e.g. "09 Mar 26" → "09 Mar 2026"
        const parsed = endedAt.replace(
            /^(\d{1,2}\s[A-Za-z]{3})\s(\d{2})$/,
            (_, dm, yy) => `${dm} 20${yy}`
        );
        const target = new Date(parsed).getTime();
        if (isNaN(target)) { setDisplay(null); return; }

        const calc = () => {
            const diff = target - Date.now();
            if (diff <= 0) { setDisplay(null); return; }
            const s = Math.floor(diff / 1000);
            const pad = (n: number) => String(n).padStart(2, "0");
            setDisplay(`${pad(s % 60)} : ${pad(Math.floor((s % 3600) / 60))} : ${pad(Math.floor((s % 86400) / 3600))} : ${pad(Math.floor(s / 86400))} `);
        };

        calc();
        const id = setInterval(calc, 1000);
        return () => clearInterval(id);
    }, [endedAt]);

    return display;
}

export default function AuctionCard({ auction }: { auction: Auction }) {
    const countdown = useCountdown(auction.ended_at);

    return (
        <Link href={`/auction/${auction.id}`} className="product-item" aria-label={auction.name}>
            <div className="product-img">
                <figure>
                    <Image
                        src={auction.imageUrl}
                        alt="product"
                        className="h-auto w-full"
                        width={500}
                        height={500}
                        style={{ width: "100%", height: "auto" }}
                        unoptimized
                    />
                </figure>

                {auction.onEdit && (
                    <button
                        type="button"
                        className="edit-btn"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); auction.onEdit?.(); }}
                        aria-label="تعديل الإعلان"
                    >
                        <i className="fa-solid fa-pen-line" aria-hidden="true" />
                    </button>
                )}

                {countdown && <div className="timer">{countdown}</div>}

                {auction.isLive ? <div className="live-dot" /> : null}

                {auction.isPinned ? (
                    <div className="fixed-block">
                        <Image src={pinImg} alt="pin" width={24} height={24} className="h-auto w-auto" />
                        <span>مثبت</span>
                    </div>
                ) : null}
            </div>

            <div className="product-content">
                <div className="product-type">
                    <span>{auction.typeA}</span> - <span>{auction.typeB}</span>
                </div>

                <h3 className="product-name">{auction.name}</h3>

                <div className="product-status">
                    السوم واصل : <span>{auction.currentBid ?? "—"}</span>
                </div>
            </div>
        </Link>
    );
}
