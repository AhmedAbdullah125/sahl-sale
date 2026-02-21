"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Bookmark, Link as LinkIcon, AlertCircle, BadgeCheck, PhoneCall, PenLine, Trash2, } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import logo from "@/src/images/logo.svg";
import mainImg from "@/src/images/main.png";
import { useGetAd } from "@/src/hooks/useGetAd";
import { Loader2 } from "lucide-react";

export default function ProductWrapper({ id }: { id: string }) {
    const router = useRouter();
    const pathname = usePathname()
    const { data: ad, isLoading, error } = useGetAd(id);

    // If is_creator is returned from API, use it, otherwise fallback to path check
    const isMyProduct = ad?.is_creator || pathname.includes("my-products");
    const [isFav, setIsFav] = useState(false);

    // Use data from API
    const phone = ad?.user?.phone || "55558718";
    const whatsapp = ad?.user?.whatsapp || "55558718";
    const expireText = ad?.ended_at ? `ينتهي في ${ad.ended_at}` : "ينتهي في 11 يوليو 2026";

    // بدلها بصور API حسب id
    const images = useMemo(() => {
        if (ad?.images && ad.images.length > 0) {
            return ad.images.map(img => img.url);
        }
        return [mainImg];
    }, [ad]);

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !ad) {
        return (
            <div className="flex h-[400px] items-center justify-center text-red-500">
                حدث خطأ أثناء تحميل الإعلان
            </div>
        );
    }

    const handleShare = async () => {
        try {
            const url = window.location.href;
            if (navigator.share) {
                await navigator.share({ title: "إعلان", url });
            } else {
                await navigator.clipboard.writeText(url);
                alert("تم نسخ الرابط");
            }
        } catch {
            // ignore
        }
    };

    return (
        <section className="content-section" dir="rtl">
            <div className="container">
                {/* Header */}
                <div className="upper-header">
                    <button
                        type="button"
                        className="back-btn"
                        onClick={() => router.back()}
                        aria-label="Back"
                    >
                        <ArrowRight />
                    </button>

                    <div className="product-center">
                        {
                            !isMyProduct && (
                                <Link href="#" className="report-link">
                                    <AlertCircle />
                                    <span>تبليغ</span>
                                </Link>
                            )
                        }

                        <button type="button" onClick={handleShare}>
                            <LinkIcon />
                            <span>مشاركة</span>
                        </button>
                    </div>

                </div>

                {/* Detail */}
                <div className="product-detail">
                    <div className="product--detail-grid">
                        {/* Slider */}
                        <div className="slider-cont">
                            <main className="main-slider">
                                <Swiper
                                    modules={[Pagination]}
                                    pagination={{ clickable: true }}
                                    slidesPerView={1}
                                    spaceBetween={12}
                                    className="pro-swiper"
                                >
                                    {images.map((img, idx) => (
                                        <SwiperSlide key={idx}>
                                            <div className="main">
                                                <Link href="#!" className="pro-img">
                                                    <Image src={img} alt={`product-${idx + 1}`} priority={idx === 0} className="w-full h-auto" width={500} height={500} />
                                                </Link>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </main>

                            {/* ✅ Overlay buttons differ by mode */}
                            {!isMyProduct ? (
                                // Normal product -> fav
                                <button
                                    type="button"
                                    className="add-fav"
                                    aria-label="Add to favorites"
                                    onClick={() => setIsFav((v) => !v)}
                                >
                                    <Bookmark className={isFav ? "fill-current" : ""} />
                                </button>
                            ) : (
                                <>
                                    {/* My product -> edit/delete + expire */}
                                    <Link
                                        className="edit-btn"
                                        aria-label="Edit"
                                        href={`/edit-product/${id}`}
                                    >
                                        <PenLine />
                                    </Link>

                                    <button
                                        type="button"
                                        className="delete-btn"

                                        aria-label="Delete"
                                    >
                                        <Trash2 />
                                    </button>

                                    <div className="detail-expire">{expireText}</div>
                                </>
                            )}
                        </div>

                        {/* Main Info */}
                        <div className="detail-content">
                            <div className="detail-type text-primary/80">
                                {ad.parent_category && `${ad.parent_category} - `}{ad.category}
                            </div>
                            <h3 className="detail-name">{ad.title}</h3>
                            <div className="price">{Number(ad.price)} د.ك</div>
                            <div className="detail-date">نشر بتاريخ : {ad.created_at}</div>

                            {
                                !isMyProduct && ad.user && (
                                    <div className="company-item">
                                        <figure>
                                            <Image src={ad.user.image || logo} width={40} height={40} alt={ad.user.name} className="rounded-full object-cover" unoptimized />
                                        </figure>

                                        <div className="company-info">
                                            <span className="company-num">نشر بواسطة</span>
                                            <span className="company-name">
                                                {ad.user.name} {ad.user.verified_account === 1 && <BadgeCheck className="inline-block h-4 w-4 text-primary" />}
                                            </span>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        {/* Details box */}
                        <div className="detail-box">
                            <h2 className="title">التفاصيل</h2>

                            <div className="row-item">
                                {ad.city && (
                                    <div className="detail-item">
                                        <span className="label">المحافظة :</span>
                                        <span className="value">{ad.city}</span>
                                    </div>
                                )}
                                <div className="detail-item">
                                    <span className="label">القسم :</span>
                                    <span className="value">{ad.category}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="detail-box">
                            <h2 className="title">الوصف :</h2>
                            <p className="desc whitespace-pre-wrap">
                                {ad.description}
                            </p>
                        </div>
                    </div>

                    {/* Contact Buttons */}
                    <div className="contact-btns">
                        {ad.allow_phone === 1 && (
                            <Link href={`tel:${phone}`} className="phone-link">
                                <PhoneCall className="inline-block" />
                                <span>
                                    اتصال <span>{phone}</span>
                                </span>
                            </Link>
                        )}

                        {ad.allow_whatsapp === 1 && (
                            <Link
                                href={`https://wa.me/${whatsapp}`}
                                className="whats-link"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span>
                                    واتساب <span>{whatsapp}</span>
                                </span>
                            </Link>
                        )}
                    </div>

                    {/* ✅ My product only: Sold button */}
                    {isMyProduct ? (
                        <button type="button" className="form-btn">
                            تم البيع
                        </button>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
