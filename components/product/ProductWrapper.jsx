"use client";

import React, { useMemo, useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Bookmark, Link as LinkIcon, AlertCircle, BadgeCheck, PhoneCall, PenLine, Trash2, } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import logo from "@/src/images/logo.svg";
import mainImg from "@/src/images/main.png";
export default function ProductWrapper({ id }) {
    const router = useRouter();
    const pathname = usePathname()
    const isMyProduct = pathname.includes("my-products");
    const [isFav, setIsFav] = useState(false);
    const phone = "55558718";
    const whatsapp = "55558718";
    const expireText = "ينتهي في 11 يوليو 2026";

    // بدلها بصور API حسب id
    const images = useMemo(() => [mainImg, mainImg], [id]);

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
                                                    <Image
                                                        src={img}
                                                        alt={`product-${idx + 1}`}
                                                        priority={idx === 0}
                                                        className="w-full h-auto"
                                                    />
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
                            <div className="detail-type">سيارات للبيع - ياباني - لكزس - RX</div>
                            <h3 className="detail-name">سيارة لكزس RX 2025</h3>
                            <div className="price">2100 د.ك</div>
                            <div className="detail-date">نشر بتاريخ : 12 / 5 / 2025 - 10:32 PM</div>

                            {
                                !isMyProduct &&
                                <div className="company-item">
                                    <figure>
                                        <Image src={logo} alt="logo" />
                                    </figure>

                                    <div className="company-info">
                                        <span className="company-num">نشر بواسطة</span>
                                        <span className="company-name">
                                            شركة الخليج العربي <BadgeCheck className="inline-block h-4 w-4" />
                                        </span>
                                    </div>
                                </div>
                            }
                        </div>

                        {/* Details box */}
                        <div className="detail-box">
                            <h2 className="title">التفاصيل</h2>

                            <div className="row-item">
                                <div className="detail-item">
                                    <span className="label">الماركة :</span>
                                    <span className="value">لكزس</span>
                                </div>

                                <div className="detail-item">
                                    <span className="label">بلد الصنع :</span>
                                    <span className="value">اليابان</span>
                                </div>

                                <div className="detail-item">
                                    <span className="label">الموديل :</span>
                                    <span className="value">RX</span>
                                </div>

                                <div className="detail-item">
                                    <span className="label">الممشى :</span>
                                    <span className="value">40,000 كم</span>
                                </div>

                                <div className="detail-item">
                                    <span className="label">سنة الصنع :</span>
                                    <span className="value">2025</span>
                                </div>

                                <div className="detail-item">
                                    <span className="label">المحافظة :</span>
                                    <span className="value">حولي</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="detail-box">
                            <h2 className="title">الوصف :</h2>
                            <p className="desc">
                                للبيع او للبدل لكزس RX موديل 2011 عداد 180 وارد الساير كامل المواصفات
                                جلد تان فتحه دخول ذكي بلوثوت خريطه بروجكتر شرط الفحص قير / مكينه /شاصي
                                البدي يوجد اصباغ متفرقه السعر 3000/ والصامل يبشر بالخير
                            </p>
                        </div>
                    </div>

                    {/* Contact Buttons */}
                    <div className="contact-btns">
                        <Link href={`tel:${phone}`} className="phone-link">
                            <PhoneCall className="inline-block" />
                            {/* ✅ لو CSS بتعتمد على span داخل span زي الـ HTML بتاعك */}
                            <span>
                                اتصال <span>{phone}</span>
                            </span>
                        </Link>

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
