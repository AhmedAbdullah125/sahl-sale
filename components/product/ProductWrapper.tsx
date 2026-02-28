"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Bookmark, Link as LinkIcon, AlertCircle, BadgeCheck, PhoneCall, PenLine, Trash2, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import logo from "@/src/images/logo.svg";
import mainImg from "@/src/images/main.png";
import done from "@/src/images/done.gif";
import { useGetAd } from "@/src/hooks/useGetAd";
import { useReportAd } from "@/src/hooks/useReportAd";
import { useToggleFavorite } from "@/src/hooks/useToggleFavorite";
import { useGetProfile } from "@/src/hooks/useGetProfile";
import { Loader2 } from "lucide-react";
import FancyboxWrapper from "../ui/FancyboxWrapper";
import VerificationModal from "../Auctions/VerificationModal";

export default function ProductWrapper({ id }: { id: string }) {
    const router = useRouter();
    const pathname = usePathname()
    const { data: ad, isLoading, error } = useGetAd(id);

    // If is_creator is returned from API, use it, otherwise fallback to path check
    const isMyProduct = ad?.is_creator || pathname.includes("my-products");
    const isAuction = ad?.type === "auction";
    const [isFav, setIsFav] = useState(false);
    const { mutate: toggleFavorite, isPending: isFavPending } = useToggleFavorite();

    // Auction state
    const [notifyBids, setNotifyBids] = useState(false);
    const [bidValue, setBidValue] = useState("");
    const [showVerificationModal, setShowVerificationModal] = useState(false);

    React.useEffect(() => {
        if (ad) setIsFav(ad.is_favorite);
    }, [ad]);

    // Report states
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [showDone, setShowDone] = useState(false);
    const { mutate: reportAd, isPending: isReporting } = useReportAd();

    // User profile
    const { data: profile } = useGetProfile();

    // Use data from API
    const phone = ad?.user?.phone;
    const whatsapp = ad?.user?.whatsapp;
    const expireText = ad?.ended_at ? `ينتهي في ${ad.ended_at}` : "";

    const onBidSubmit = (extra = 0) => {
        const isVerified = Boolean(profile?.verified_account);
        if (!isVerified) {
            setShowVerificationModal(true);
            return;
        }
        const n = Number(bidValue || 0) + Number(extra || 0);
        setBidValue(String(n));
    };

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
                                <button type="button" className="report-link" onClick={() => setIsReportOpen(true)}>
                                    <AlertCircle />
                                    <span>تبليغ</span>
                                </button>
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
                                <FancyboxWrapper>
                                    <Swiper
                                        modules={[Pagination]}
                                        pagination={{ clickable: true }}
                                        slidesPerView={1}
                                        spaceBetween={12}
                                        className="pro-swiper"
                                    >
                                        {ad.images.map((img, idx) => (
                                            <SwiperSlide key={idx}>
                                                <div className="main">
                                                    <div className="pro-img">
                                                        <a href={img.url} data-fancybox="gallery" className="w-full h-full">
                                                            <Image src={img.url} alt={`product-${idx + 1}`} priority={idx === 0} className="w-full h-auto" width={500} height={500} />
                                                        </a>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </FancyboxWrapper>
                            </main>

                            {/* ✅ Overlay buttons differ by mode */}
                            {!isMyProduct ? (
                                // Normal product -> fav
                                <button
                                    type="button"
                                    className="add-fav"
                                    aria-label="Add to favorites"
                                    disabled={isFavPending}
                                    onClick={() => {
                                        setIsFav((v) => !v);
                                        toggleFavorite(id, {
                                            onError: () => setIsFav((v) => !v)
                                        });
                                    }}
                                >
                                    <Bookmark className={isFavPending ? "fill-current opacity-50" : isFav ? "fill-current" : ""} />
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
                            {/* Auction: notification toggle */}
                            {isAuction && (
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
                                            <span className="switch" />
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Auction: current bid & ends */}
                            {isAuction && (
                                <div className="product-info">
                                    <div className="product-status">
                                        السوم واصل : <span>{ad.latest_bid?.amount ?? ad.price} د.ك</span>
                                    </div>
                                    {ad.ended_at && (
                                        <div className="product-status">
                                            ينتهي في : <span>{ad.ended_at}</span>
                                        </div>
                                    )}
                                </div>
                            )}

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
                                {/* Auction / car details */}
                                {isAuction && ad.car && (
                                    <>
                                        {ad.car.brand && (
                                            <div className="detail-item">
                                                <span className="label">الماركة :</span>
                                                <span className="value">{ad.car.brand}</span>
                                            </div>
                                        )}
                                        {ad.car.model && (
                                            <div className="detail-item">
                                                <span className="label">الموديل :</span>
                                                <span className="value">{ad.car.model}</span>
                                            </div>
                                        )}
                                        {ad.car.year && (
                                            <div className="detail-item">
                                                <span className="label">سنة الصنع :</span>
                                                <span className="value">{ad.car.year}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="detail-box">
                            <h2 className="title">الوصف :</h2>
                            <p className="desc whitespace-pre-wrap">
                                {ad.description}
                            </p>
                        </div>

                        {/* Auction: bids history */}
                        {isAuction && ad.bids && ad.bids.length > 0 && (
                            <div className="detail-box">
                                <h2 className="title">السومات :</h2>
                                <div className="contributors-list">
                                    {ad.bids.map((bid) => (
                                        <div className="contributor" key={bid.id}>
                                            <div className="info">
                                                {bid.user?.image ? (
                                                    <Image
                                                        src={bid.user.image}
                                                        alt={bid.user.name}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                                                )}
                                                <div className="text">
                                                    <strong>{bid.user?.name ?? "مجهول"}</strong>
                                                    <small>سوم بـ {bid.amount} د.ك</small>
                                                </div>
                                            </div>
                                            <span className="time">{bid.created_at}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Auction action: bid input */}
                    {isAuction && !ad.is_ended && (
                        <div className="auction-action">
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="ادخل قيمة للمزايدة +"
                                    value={bidValue}
                                    onChange={(e) => setBidValue(e.target.value)}
                                />
                                <button type="button" className="auction-btn" onClick={() => onBidSubmit(0)}>سوم</button>
                            </div>
                            <button type="button" className="add" onClick={() => onBidSubmit(50)}>+50</button>
                        </div>
                    )}

                    {/* Ad: contact buttons */}
                    {!isAuction && (
                        <div className="contact-btns">
                            {ad.allow_phone === 1 && (
                                <Link href={`tel:${phone}`} className="phone-link">
                                    <PhoneCall className="inline-block" />
                                    <span>
                                        اتصال <span>{phone}</span>
                                    </span>
                                </Link>
                            )}

                            {ad.allow_whatsapp === 1 && whatsapp && (
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
                    )}

                    {/* My product only: Sold button */}
                    {isMyProduct && !isAuction ? (
                        <button type="button" className="form-btn">
                            تم البيع
                        </button>
                    ) : null}
                </div>
            </div>

            {/* Verification Modal (auction) */}
            <VerificationModal
                isOpen={showVerificationModal}
                onClose={() => setShowVerificationModal(false)}
            />

            {/* Report Modal */}
            {
                isReportOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
                        <div dir="rtl" className="w-full max-w-md rounded-2xl bg-[#F8F9FA] p-6 shadow-2xl relative">
                            <button
                                type="button"
                                onClick={() => setIsReportOpen(false)}
                                className="absolute left-6 top-6 text-gray-500 hover:text-black"
                            >
                                <X className="h-6 w-6" />
                            </button>
                            <h2 className="text-xl font-bold text-center mb-6 mt-2">ابلاغ</h2>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-3 pr-2 text-right">
                                    سبب الابلاغ
                                </label>
                                <textarea
                                    className="w-full rounded-xl border border-gray-200 bg-white p-4 min-h-[160px] outline-none focus:ring-2 focus:ring-[#37bdf8]"
                                    placeholder="اكتب سبب الابلاغ"
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                />
                            </div>

                            <button
                                type="button"
                                disabled={isReporting || !reportReason.trim()}
                                onClick={() => {
                                    reportAd(
                                        { ad_id: id, reason: reportReason.trim() },
                                        {
                                            onSuccess: () => {
                                                setIsReportOpen(false);
                                                setReportReason("");
                                                setShowDone(true);
                                                setTimeout(() => setShowDone(false), 3000);
                                            },
                                            onError: (err) => {
                                                alert(err.message || 'حدث خطأ أثناء إرسال البلاغ');
                                            }
                                        }
                                    );
                                }}
                                className="w-full rounded-xl bg-[#37bdf8] py-4 text-white font-bold text-lg hover:bg-sky-500 transition-colors disabled:opacity-50 flex items-center justify-center h-14"
                            >
                                {isReporting ? <Loader2 className="h-6 w-6 animate-spin" /> : "إرسال"}
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Success Done Modal */}
            {
                showDone && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
                        <div dir="rtl" className="w-full max-w-96 rounded-xl bg-white px-6 py-4 text-center shadow-2xl">
                            <div className="mx-auto mb-6 h-[160px] w-[160px]">
                                <Image src={done} alt="done" className="h-full w-full object-contain" priority />
                            </div>
                            <h2 className="text-base font-bold text-zinc-900 md:text-xl">تم إرسال بلاغك بنجاح</h2>
                        </div>
                    </div>
                )
            }

        </section >
    );
}
