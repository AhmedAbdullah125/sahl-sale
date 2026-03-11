"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import UpperHeader from "@/components/General/UpperHeader";
import { getToken } from "@/src/utils/token";
import { getNotifications, deleteNotification, Notification } from "@/src/services/notificationService";
import Loading from "@/src/app/loading";
import { toast } from "sonner";

export default function NotificationWrapper() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setError("يجب تسجيل الدخول أولاً");
            setLoading(false);
            return;
        }
        getNotifications(token)
            .then((res) => setNotifications(res.data))
            .catch(() => setError("حدث خطأ أثناء تحميل التنبيهات"))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: string) => {
        const token = getToken();
        if (!token) return;

        setDeletingIds((prev) => new Set(prev).add(id));

        try {
            await deleteNotification(id, token);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            toast.success("تم الحذف بنجاح");
        } catch {
            toast.error("حدث خطأ أثناء الحذف");
        } finally {
            setDeletingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    return (
        <section className="content-section">
            <div className="container flex flex-col gap-5 min-h-[calc(100vh-400px)] justify-between">
                <div className="">
                    <UpperHeader title="نبهني" />

                    {loading && <Loading />}

                    {error && (
                        <div className="notify-empty">
                            <span>{error}</span>
                        </div>
                    )}

                    {!loading && !error && notifications.length === 0 && (
                        <div className="notify-empty">
                            <span>لا توجد تنبيهات</span>
                        </div>
                    )}

                    {!loading && !error && notifications.length > 0 && (
                        <div className="notifications">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="notify-card" style={{ opacity: deletingIds.has(notif.id) ? 0.5 : 1 }}>
                                    <div className="notify-head">
                                        <span className="from">تستقبل تنبيهات من</span>
                                        <button
                                            className="notify-btn"
                                            aria-label="حذف"
                                            onClick={() => handleDelete(notif.id)}
                                            disabled={deletingIds.has(notif.id)}
                                        >
                                            {deletingIds.has(notif.id) ? (
                                                <i className="fa-solid fa-spinner fa-spin"></i>
                                            ) : (
                                                <i className="fa-solid fa-trash"></i>
                                            )}
                                        </button>
                                    </div>
                                    <div className="notify-content">
                                        {notif.extra?.image && (
                                            <figure className="notify-img">
                                                <img src={notif.extra.image} alt="notification" />
                                            </figure>
                                        )}
                                        <div className="notify-text">
                                            <p className="notify-title">{notif.extra?.title?.ar}</p>
                                            <p className="notify-body">{notif.extra?.body?.ar}</p>
                                            <span className="notify-date">{notif.created_at}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
                <div className="notify-add-btn-wrapper">
                    <Link href="/add-alert" className="notify-add-btn">
                        + إضافة تنبيه جديد
                    </Link>
                </div>
            </div>
        </section>
    );
}
