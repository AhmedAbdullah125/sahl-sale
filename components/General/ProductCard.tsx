import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Bookmark } from "lucide-react";
import pin from "@/src/images/pin.png";
import { useToggleFavorite } from "@/src/hooks/useToggleFavorite";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Product {
    id: string;
    href: string;
    img: StaticImageData | string;
    typeA?: string;
    typeB?: string;
    name: string;
    kind?: string;
    timer?: string;
    currentBid?: string;
    price?: string;
    dateText?: string;
    pinned?: boolean;
    isFav?: boolean;
    onEdit?: () => void;
}

export default function ProductCard({ product }: { product: Product }) {
    const [fav, setFav] = useState(product.isFav);
    const router = useRouter();
    const token = localStorage.getItem("token");

    const { mutate: toggleFavorite, isPending } = useToggleFavorite();

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

                {product.onEdit && (
                    <button
                        type="button"
                        className="edit-btn"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); product.onEdit?.(); }}
                        aria-label="تعديل الإعلان"
                    >
                        <i className="fa-solid fa-pen-line" aria-hidden="true" />
                    </button>
                )}

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
                            if (!token) {
                                toast.error("الرجاء تسجيل الدخول", {
                                    action: {
                                        label: "تسجيل الدخول",
                                        onClick: () => router.push("/login"),

                                    },
                                    style: {
                                        background: "#fef08a",
                                        color: "#92400e",
                                        border: "1px solid #fcd34d",
                                    }
                                });
                                return
                            }
                            setFav((prev) => !prev);
                            toggleFavorite(product.id, {
                                onError: () => setFav((prev) => !prev), // revert on error
                            });
                        }}
                        disabled={isPending}
                    >
                        <Bookmark className={`h-5 w-5 ${isPending ? "fill-current opacity-50" : fav ? "fill-current" : ""}`} />
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
