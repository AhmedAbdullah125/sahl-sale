import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Bookmark } from "lucide-react";
import pin from "@/src/images/pin.png";



export default function ProductCard({ product }) {
    const [fav, setFav] = useState({});

    return (
        <Link key={product.id} href={product.href} className="product-item">
            <div className="product-img">
                <figure>
                    <Image
                        src={product.img}
                        alt="product"
                        width={700}
                        height={500}
                        className="h-auto w-full object-cover"
                    />
                </figure>

                {/* auction UI */}
                {product.kind === "auction" ? (
                    <>
                        <div className="timer">{product.timer}</div>
                        <div className="live-dot" />
                    </>
                ) : (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="add-fav"
                        aria-label="Add to favorites"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setFav((prev) => ({ ...prev, [product.id]: !prev[product.id] }));
                        }}
                    >
                        <Bookmark
                            className={
                                fav[product.id] || product.isFav
                                    ? "h-5 w-5 fill-current"
                                    : "h-5 w-5"
                            }
                        />
                    </Button>
                )}

                {/* Pinned */}
                {product.pinned ? (
                    <div className="fixed-block">
                        <Image
                            src={pin}
                            alt="pin"
                            width={18}
                            height={18}
                        />
                        <span>مثبت</span>
                    </div>
                ) : null}
            </div>

            <div className="product-content">
                <div className="product-type">
                    <span>{product.typeA}</span> - <span>{product.typeB}</span>
                </div>

                <h3 className="product-name">{product.name}</h3>

                {product.kind === "auction" ? (
                    <div className="product-status">
                        السوم واصل : <span>{product.currentBid}</span>
                    </div>
                ) : (
                    <div className="product-info">
                        <span>{product.price}</span>
                        <div className="date">{product.dateText}</div>
                    </div>
                )}
            </div>
        </Link>
    );
}
