"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Assets (بدّلهم حسب مشروعك)
import logo from "@/src/images/logo.svg";
import mainImg from "@/src/images/main.png";

export default function AuctionDetailsWrapper({ id }) {
    const router = useRouter();

    const [notifyBids, setNotifyBids] = useState(false);
    const [bidValue, setBidValue] = useState("");

    // صور المزاد (بدّلها بصور API حسب id)
    const images = useMemo(() => [mainImg, mainImg], [id]);

    // بيانات تجريبية — بدّلها من API
    const data = useMemo(
        () => ({
            reportHref: "#",
            type: "سيارات للبيع - ياباني - لكزس - RX",
            name: "سيارة لكزس RX 2025",
            currentBid: "2100 د.ك",
            endsIn: "00:15:30",
            price: "2100 د.ك",
            publishedAt: "نشر بتاريخ : 12 / 5 / 2025 - 10:32 PM",
            companyName: "شركة الخليج العربي",
            details: [
                { label: "الماركة :", value: "لكزس" },
                { label: "بلد الصنع :", value: "اليابان" },
                { label: "الموديل :", value: "RX" },
                { label: "الممشى :", value: "40,000 كم" },
                { label: "سنة الصنع :", value: "2025" },
                { label: "المحافظة :", value: "حولي" },
            ],
            description:
                "للبيع او للبدل لكزس RX موديل 2011 عداد 180 وارد الساير كامل المواصفات جلد تان فتحه دخول ذكي بلوثوت خريطه بروجكتر شرط الفحص قير / مكينه /شاصي البدي يوجد اصباغ متفرقه السعر 3000/ والصامل يبشر بالخير",
            contributions: [
                { id: 1, name: "محمود محمد", delta: "+50", time: "منذ 1 ساعة" },
                { id: 2, name: "محمود محمد", delta: "+50", time: "منذ 1 ساعة" },
                { id: 3, name: "محمود محمد", delta: "+50", time: "منذ 1 ساعة" },
            ],
        }),
        []
    );

    // optional collapse
    const [openDetails, setOpenDetails] = useState(true);
    const [openDesc, setOpenDesc] = useState(true);
    const [openBids, setOpenBids] = useState(true);

    const share = async () => {
        try {
            const url = window.location.href;
            if (navigator.share) {
                await navigator.share({ title: data.name, url });
            } else {
                await navigator.clipboard.writeText(url);
                alert("تم نسخ الرابط");
            }
        } catch {
            // ignore
        }
    };

    const onBidSubmit = (extra = 0) => {
        const n = Number(bidValue || 0) + Number(extra || 0);

        // TODO: call your API bid here
        // await fetch(...)

        setBidValue(String(n));
        // مثال UX بسيط:
        alert(`تم إرسال السوم: ${n}`);
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
                        aria-label="رجوع"
                    >
                        <i className="fa-regular fa-arrow-right" aria-hidden="true"></i>
                    </button>

                    <figure className="img-logo">
                        <Link href="#" aria-label="home">
                            <Image src={logo} alt="logo" />
                        </Link>
                    </figure>

                    <div className="product-center">
                        <Link href={data.reportHref} aria-label="report">
                            <i className="fa-regular fa-circle-exclamation" aria-hidden="true"></i>
                            <span>تبليغ</span>
                        </Link>

                        <button type="button" onClick={share} aria-label="share">
                            <i className="fa-regular fa-link" aria-hidden="true"></i>
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
                                    className="swiper-container"
                                >
                                    {images.map((img, idx) => (
                                        <SwiperSlide key={idx} className="swiper-slide">
                                            <div className="main">
                                                <Link href="#!" className="pro-img" aria-label={`image-${idx + 1}`}>
                                                    <Image
                                                        src={img}
                                                        alt={`main-${idx + 1}`}
                                                        priority={idx === 0}
                                                        style={{ width: "100%", height: "auto" }}
                                                    />
                                                </Link>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {/* لو الستايل بتاعك محتاج pagination element */}
                                <div className="swiper-pagination" />
                            </main>
                        </div>

                        {/* Content */}
                        <div className="detail-content">
                            {/* notification toggle */}
                            <div className="item-info">
                                <div className="item-content">
                                    <div className="item-name">تفعيل الاشعارات عند المزايدات</div>
                                </div>
                                <div className="item-box">
                                    <label className="pill">
                                        <input
                                            type="checkbox"
                                            checked={notifyBids}
                                            onChange={(e) => setNotifyBids(e.target.checked)}
                                        />
                                        <span className="switch"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="product-info">
                                <div className="product-status">
                                    السوم واصل : <span>{data.currentBid}</span>
                                </div>
                                <div className="product-status">
                                    ينتهي خلال :<span>{data.endsIn}</span>
                                </div>
                            </div>

                            <div className="detail-type">{data.type}</div>
                            <h3 className="detail-name">{data.name}</h3>
                            <div className="price">{data.price}</div>
                            <div className="detail-date">{data.publishedAt}</div>

                            <div className="company-item">
                                <figure>
                                    <Image src={logo} alt="logo" />
                                </figure>
                                <div className="company-info">
                                    <span className="company-num">نشر بواسطة</span>
                                    <span className="company-name">
                                        {data.companyName}{" "}
                                        <i className="fa-solid fa-badge-check" aria-hidden="true"></i>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Details (collapse optional) */}
                        <div className="detail-box">
                            <h2
                                className="title"
                                role="button"
                                tabIndex={0}
                                onClick={() => setOpenDetails((v) => !v)}
                                onKeyDown={(e) => e.key === "Enter" && setOpenDetails((v) => !v)}
                            >
                                التفاصيل
                            </h2>

                            {openDetails ? (
                                <div className="row-item">
                                    {data.details.map((d, idx) => (
                                        <div className="detail-item" key={idx}>
                                            <span className="label">{d.label}</span>
                                            <span className="value">{d.value}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        {/* Description (collapse optional) */}
                        <div className="detail-box">
                            <h2
                                className="title"
                                role="button"
                                tabIndex={0}
                                onClick={() => setOpenDesc((v) => !v)}
                                onKeyDown={(e) => e.key === "Enter" && setOpenDesc((v) => !v)}
                            >
                                الوصف :
                            </h2>

                            {openDesc ? <p className="desc">{data.description}</p> : null}
                        </div>

                        {/* Bids list */}
                        <div className="detail-box">
                            <h2
                                className="title"
                                role="button"
                                tabIndex={0}
                                onClick={() => setOpenBids((v) => !v)}
                                onKeyDown={(e) => e.key === "Enter" && setOpenBids((v) => !v)}
                            >
                                السومات :
                            </h2>

                            {openBids ? (
                                <div className="contributors-list">
                                    {data.contributions.map((c) => (
                                        <div className="contributor" key={c.id}>
                                            <div className="info">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src="https://i.pravatar.cc/40" alt="user" />
                                                <div className="text">
                                                    <strong>{c.name}</strong>
                                                    <small>أضاف مساهمة {c.delta}</small>
                                                </div>
                                            </div>
                                            <span className="time">{c.time}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Action */}
                    <div className="auction-action">
                        <div className="relative ">
                            <input
                                type="number"
                                placeholder="ادخل قيمة للمزايدة +"
                                value={bidValue}
                                onChange={(e) => setBidValue(e.target.value)}
                            />
                            <button
                                type="button"
                                className="auction-btn"
                                onClick={() => onBidSubmit(0)}
                            >
                                سوم
                            </button>
                        </div>

                        <button type="button" className="add" onClick={() => onBidSubmit(50)}>
                            +50
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
