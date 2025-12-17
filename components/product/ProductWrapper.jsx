"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Bookmark,
    Link as LinkIcon,
    AlertCircle,
    BadgeCheck,
    PhoneCall,
} from "lucide-react";

// ✅ Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import logo from "@/src/images/logo.svg";
import mainImg from "@/src/images/main.png";

export default function ProductWrapper({ id }) {
    const [isFav, setIsFav] = useState(false);

    // بدلها بالصور اللي جاية من API حسب id
    const images = useMemo(() => [mainImg, mainImg], [id]);

    return (
        <section className="content-section">
            <div className="container">
                {/* Header */}
                <div className="upper-header">
                    <button
                        type="button"
                        className="back-btn"
                        onClick={() => window.history.back()}
                        aria-label="Back"
                    >
                        <ArrowRight />
                    </button>

                    <div className="product-center">
                        <Link href="#" className="report-link">
                            <AlertCircle />
                            <span>تبليغ</span>
                        </Link>

                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    if (navigator.share) {
                                        await navigator.share({
                                            title: "إعلان",
                                            url: window.location.href,
                                        });
                                    } else {
                                        await navigator.clipboard.writeText(window.location.href);
                                        alert("تم نسخ الرابط");
                                    }
                                } catch {
                                    // ignore
                                }
                            }}
                        >
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

                            <button
                                type="button"
                                className="add-fav"
                                aria-label="Add to favorites"
                                onClick={() => setIsFav((v) => !v)}
                            >
                                <Bookmark className={isFav ? "fill-current" : ""} />
                            </button>
                        </div>

                        {/* Main Info */}
                        <div className="detail-content">
                            <div className="detail-type">سيارات للبيع - ياباني - لكزس - RX</div>
                            <h3 className="detail-name">سيارة لكزس RX 2025</h3>
                            <div className="price">2100 د.ك</div>
                            <div className="detail-date">نشر بتاريخ : 12 / 5 / 2025 - 10:32 PM</div>

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
                        <Link href="tel:+" className="phone-link">
                            <PhoneCall className="inline-block" /> اتصال
                        </Link>

                        <Link href="#" className="whats-link">
                            واتساب
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
