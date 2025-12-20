"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import pinImg from "@/src/images/pin.png";

export default function AuctionCard({
    auction
}) {
    return (
        <Link href={`/auction/${auction.id}`} className="product-item" aria-label={auction.name}>
            <div className="product-img">
                <figure>
                    {/* لو imageUrl جاي من import (StaticImageData) أو string الاتنين شغالين */}
                    <Image
                        src={auction.imageUrl}
                        alt="product"
                        className="h-auto w-full"
                        // لو CSS متحكم في المقاسات، خليها responsive
                        style={{ width: "100%", height: "auto" }}
                    />
                </figure>

                <div className="timer">{auction.timer}</div>

                {auction.isLive ? <div className="live-dot" /> : null}

                {auction.isPinned ? (
                    <div className="fixed-block">
                        <Image
                            src={pinImg}
                            alt="pin"
                            width={24}
                            height={24}
                            className="h-auto w-auto"
                        />
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
                    السوم واصل : <span>{auction.currentBid}</span>
                </div>
            </div>
        </Link>
    );
}
