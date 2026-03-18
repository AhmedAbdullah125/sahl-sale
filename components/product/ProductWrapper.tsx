"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle, Link as LinkIcon } from "lucide-react";

import { useGetAd } from "@/src/hooks/useGetAd";
import { useReportAd } from "@/src/hooks/useReportAd";
import { useToggleFavorite } from "@/src/hooks/useToggleFavorite";
import { useGetProfile } from "@/src/hooks/useGetProfile";
import { usePlaceBid } from "@/src/hooks/usePlaceBid";
import { useEndAd } from "@/src/hooks/useEndAd";
import { useDeleteAd } from "@/src/hooks/useDeleteAd";

import { ProductSkeleton } from "./ProductSkeleton";
import ProductImageSlider from "./ProductImageSlider";
import ProductMainInfo from "./ProductMainInfo";
import ProductDetailsBox from "./ProductDetailsBox";
import AuctionBidsHistory from "./AuctionBidsHistory";
import ProductActions from "./ProductActions";
import ProductReportModal from "./ProductReportModal";
import ProductArchiveModal from "./ProductArchiveModal";
import ProductDeleteModal from "./ProductDeleteModal";
import ProductDoneModal from "./ProductDoneModal";
import VerificationModal from "../Auctions/VerificationModal";
import { toast } from "sonner";

export default function ProductWrapper({ id }: { id: string }) {
    const router = useRouter();
    const { data: ad, isLoading, error } = useGetAd(id);
    const { data: profile } = useGetProfile();

    const isMyProduct = ad?.user.id === profile?.id;
    const isAuction = ad?.type === "auction";

    // Favourite
    const [isFav, setIsFav] = useState(false);
    const { mutate: toggleFavorite, isPending: isFavPending } = useToggleFavorite();

    // Auction state
    const [notifyBids, setNotifyBids] = useState(false);
    const [bidValue, setBidValue] = useState("");
    const [showVerificationModal, setShowVerificationModal] = useState(false);

    React.useEffect(() => {
        if (ad) setIsFav(ad.is_favorite);
    }, [ad]);

    // Report
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [showDone, setShowDone] = useState(false);
    const { mutate: reportAd, isPending: isReporting } = useReportAd();

    // Bid
    const { mutate: placeBid, isPending: isPlacingBid } = usePlaceBid();

    // Archive / Delete
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);
    const { mutate: endAd, isPending: isEndingAd } = useEndAd();

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { mutate: deleteAd, isPending: isDeletingAd } = useDeleteAd();

    // ── Guards ───────────────────────────────────────────────────
    if (isLoading) return <ProductSkeleton />;

    if (error || !ad) {
        return (
            <div className="flex h-[400px] items-center justify-center text-red-500">
                حدث خطأ أثناء تحميل الإعلان
            </div>
        );
    }

    // ── Derived values ───────────────────────────────────────────
    const phone = ad.user?.phone;
    const whatsapp = ad.user?.whatsapp;
    const expireText = ad.ended_at ? `ينتهي في ${ad.ended_at}` : "";

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

    const onBidSubmit = (extra = 0) => {
        if (!profile?.verified_account) {
            setShowVerificationModal(true);
            return;
        }
        const amount = Number(bidValue || 0) + Number(extra || 0);
        placeBid({ adId: id, amount }, { onSuccess: () => setBidValue("") });
    };

    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    // ── Render ───────────────────────────────────────────────────
    return (
        <section className="content-section" dir="rtl">
            <div className="container">

                {/* Header bar */}
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
                        {!isMyProduct && (
                            <button type="button" className="report-link" onClick={() => {
                                if (token) {
                                    setIsReportOpen(true)
                                }
                                else {
                                    toast.error("يجب تسجيل الدخول للإبلاغ عن إعلان",

                                        //action
                                        {
                                            action: (
                                                <button onClick={() => router.push("/login")} className="text-white bg-primary px-2 py-1 rounded-md" >
                                                    تسجيل الدخول
                                                </button>
                                            )
                                        }
                                    )
                                }
                            }}>
                                <AlertCircle />
                                <span>تبليغ</span>
                            </button>
                        )}
                        <button type="button" onClick={handleShare}>
                            <LinkIcon />
                            <span>مشاركة</span>
                        </button>
                    </div>
                </div>

                {/* Detail grid */}
                <div className="product-detail">
                    <div className="product--detail-grid">

                        <ProductImageSlider
                            id={id}
                            images={ad.images}
                            isMyProduct={isMyProduct}
                            isFav={isFav}
                            isFavPending={isFavPending}
                            expireText={expireText}
                            onFavToggle={() => {
                                setIsFav((v) => !v);
                                toggleFavorite(id, { onError: () => setIsFav((v) => !v) });
                            }}
                            onEditClick={() => { }}
                            onDeleteClick={() => setIsDeleteOpen(true)}
                        />

                        <ProductMainInfo
                            ad={ad}
                            isAuction={!!isAuction}
                            isMyProduct={isMyProduct}
                            notifyBids={notifyBids}
                            onNotifyBidsChange={setNotifyBids}
                        />

                        <ProductDetailsBox
                            city={ad.city}
                            category={ad.category}
                            adForm={ad.ad_form}
                            car={ad.car}
                            description={ad.description}
                        />

                        {isAuction && <AuctionBidsHistory bids={ad.bids ?? []} />}

                    </div>

                    <ProductActions
                        isAuction={!!isAuction}
                        isEnded={!!ad.is_ended}
                        isMyProduct={isMyProduct}
                        phone={phone}
                        whatsapp={whatsapp}
                        allowPhone={ad.allow_phone}
                        allowWhatsapp={ad.allow_whatsapp}
                        bidValue={bidValue}
                        isPlacingBid={isPlacingBid}
                        onBidValueChange={setBidValue}
                        onBidSubmit={onBidSubmit}
                        onSoldClick={() => setIsArchiveOpen(true)}
                    />
                </div>
            </div>

            {/* Modals */}
            <VerificationModal
                isOpen={showVerificationModal}
                onClose={() => setShowVerificationModal(false)}
            />

            <ProductArchiveModal
                isOpen={isArchiveOpen}
                isLoading={isEndingAd}
                onClose={() => setIsArchiveOpen(false)}
                onConfirm={() =>
                    endAd(id, {
                        onSuccess: () => { setIsArchiveOpen(false); router.back(); },
                        onError: (err) => alert(err.message || "حدث خطأ أثناء أرشفة الإعلان"),
                    })
                }
            />

            <ProductDeleteModal
                isOpen={isDeleteOpen}
                isLoading={isDeletingAd}
                isAuction={!!isAuction}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={() =>
                    deleteAd(id, {
                        onSuccess: () => { setIsDeleteOpen(false); router.back(); },
                        onError: (err) => alert(err.message || "حدث خطأ أثناء حذف الإعلان"),
                    })
                }
            />

            <ProductReportModal
                isOpen={isReportOpen}
                reason={reportReason}
                isSubmitting={isReporting}
                onClose={() => setIsReportOpen(false)}
                onReasonChange={setReportReason}
                onSubmit={() =>
                    reportAd(
                        { ad_id: id, reason: reportReason.trim() },
                        {
                            onSuccess: () => {
                                setIsReportOpen(false);
                                setReportReason("");
                                setShowDone(true);
                                setTimeout(() => setShowDone(false), 3000);
                            },
                            onError: (err) => alert(err.message || "حدث خطأ أثناء إرسال البلاغ"),
                        }
                    )
                }
            />

            <ProductDoneModal isOpen={showDone} />
        </section>
    );
}
