import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Bookmark } from "lucide-react";
import pin from "@/src/images/pin.png";



export default function ProductCard({ product }) {
    const [fav, setFav] = useState({});

    return (
        <Link href={`/product/${product.id}`} className="product-item">
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

                {/* Favorite */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="add-fav"
                    aria-label="Add to favorites"
                    onClick={(e) => {
                        e.preventDefault(); // don't open the Link
                        e.stopPropagation();
                        setFav((p) => ({ ...p, [product.id]: !p[product.id] }));
                    }}
                >
                    <Bookmark
                        className={
                            fav[product.id] ? "h-5 w-5 fill-current" : "h-5 w-5"
                        }
                    />
                </Button>

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

                <div className="product-info">
                    <span>{product.price}</span>
                    <div className="date">{product.dateText}</div>
                </div>
            </div>
        </Link>
    );
}
