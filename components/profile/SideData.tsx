"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { API_BASE_URL } from "@/lib/apiConfig";
import { getToken } from "@/src/utils/token";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileData {
    id: number;
    name: string;
    phone: string;
    country_code: string;
    full_phone: string;
    image: string;
    language: string;
    verified_account: boolean;
    notification_allowed: boolean;
    whatsapp: string | null;
    whatsapp_country_code: string | null;
    full_whatsapp: string | null;
    type: string | null;
}

interface ProfileResponse {
    status: boolean;
    data: ProfileData;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SideData() {
    const pathname = usePathname();
    const [user, setUser] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                const headers: Record<string, string> = {
                    "accept-language": "ar",
                    "Content-Type": "application/json",
                };
                if (token) headers.Authorization = `Bearer ${token}`;

                const res = await fetch(`${API_BASE_URL}/auth/profile`, { headers });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json: ProfileResponse = await res.json();
                if (json.status) {
                    setUser(json.data);
                } else {
                    setError("فشل تحميل بيانات الملف الشخصي");
                }
            } catch {
                setError("حدث خطأ أثناء تحميل البيانات");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <aside className={`profile-container ${pathname !== "/profile" ? "not-the-main-page" : ""}`} dir="rtl">
            {loading && (
                <div className="flex justify-center items-center py-10">
                    <span className="text-gray-500">جاري التحميل...</span>
                </div>
            )}

            {error && (
                <div className="flex justify-center items-center py-10">
                    <span className="text-red-500">{error}</span>
                </div>
            )}

            {!loading && !error && user && (
                <>
                    <div className="profile-header">
                        <div className="avatar-wrap">
                            <Image
                                src={user.image}
                                alt={user.name}
                                width={120}
                                height={120}
                                className="rounded-full object-cover"
                            />
                        </div>

                        <h3 className="profile-name">{user.name}</h3>
                        <span className="profile-id">{user.full_phone}</span>

                        {!user.verified_account ? (
                            <Link href="/verify-account" className="verify-btn">
                                توثيق الحساب
                            </Link>
                        ) : (
                            <div className="verified">
                                <i className="fa-solid fa-badge-check" aria-hidden="true"></i> موثق
                            </div>
                        )}

                        <Link href="/profile/edit" className="profile-edit" aria-label="تعديل الملف الشخصي">
                            <i className="fa-solid fa-user-pen" aria-hidden="true"></i>
                        </Link>
                    </div>

                    {/* Menu */}
                    <ul className="profile-menu">
                        <li>
                            <Link href="/profile/my-products">
                                <span>
                                    <i className="fa-solid fa-user" aria-hidden="true"></i> إعلاناتي
                                </span>
                                <i className="fa-solid fa-caret-left" aria-hidden="true"></i>
                            </Link>
                        </li>

                        <li>
                            <Link href="/profile/my-auctions">
                                <span>
                                    <i className="fa-solid fa-gavel" aria-hidden="true"></i> مزايداتي
                                </span>
                                <i className="fa-solid fa-caret-left" aria-hidden="true"></i>
                            </Link>
                        </li>

                        <li>
                            <Link href="/profile/my-favourites">
                                <span>
                                    <i className="fa-solid fa-bookmark" aria-hidden="true"></i> المفضلة
                                </span>
                                <i className="fa-solid fa-caret-left" aria-hidden="true"></i>
                            </Link>
                        </li>

                        <li>
                            <Link href="/settings">
                                <span>
                                    <i className="fa-solid fa-gear" aria-hidden="true"></i> الإعدادات
                                </span>
                                <i className="fa-solid fa-caret-left" aria-hidden="true"></i>
                            </Link>
                        </li>

                        <li>
                            <Link href="/support">
                                <span>
                                    <i className="fa-solid fa-headphones" aria-hidden="true"></i> الدعم
                                </span>
                                <i className="fa-solid fa-caret-left" aria-hidden="true"></i>
                            </Link>
                        </li>

                        <li>
                            <Link href="/privacy">
                                <span>
                                    <i className="fa-solid fa-file-contract" aria-hidden="true"></i> سياسة الخصوصية
                                </span>
                                <i className="fa-solid fa-caret-left" aria-hidden="true"></i>
                            </Link>
                        </li>

                        <li>
                            <button type="button" className="linkBtn" onClick={shareApp}>
                                <span>
                                    <i className="fa-solid fa-share-from-square" aria-hidden="true"></i> مشاركة التطبيق
                                </span>
                                <i className="fa-solid fa-caret-left" aria-hidden="true"></i>
                            </button>
                        </li>
                    </ul>
                </>
            )}
        </aside>
    );
}

async function shareApp() {
    const url = typeof window !== "undefined" ? window.location.origin : "https://example.com";
    const text = "جرّب التطبيق ده 👇";

    try {
        if (navigator.share) {
            await navigator.share({ title: "App", text, url });
            return;
        }
    } catch {
        // ignore
    }

    try {
        await navigator.clipboard.writeText(url);
        alert("تم نسخ رابط التطبيق ✅");
    } catch {
        alert("لم يتم النسخ، انسخ الرابط يدويًا: " + url);
    }
}
