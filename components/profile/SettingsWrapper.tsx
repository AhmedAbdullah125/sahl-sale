'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetProfile } from '@/src/hooks/useGetProfile';
import { useToggleNotifications } from '@/src/hooks/useToggleNotifications';

const LANGUAGES = [
    { code: 'ar', label: 'عربي', dir: 'rtl' },
    { code: 'en', label: 'English', dir: 'ltr' },
];

export default function SettingsWrapper() {
    const router = useRouter();
    const { data: profile } = useGetProfile();
    const { toggleNotifications } = useToggleNotifications();

    // ── Notifications ─────────────────────────────────────────────────────────
    const notificationsEnabled = profile?.notification_allowed ?? false;
    const [pending, setPending] = useState(false);

    const handleToggleNotifications = async () => {
        if (pending) return;
        setPending(true);
        await toggleNotifications();
        setPending(false);
    };

    // ── Language ──────────────────────────────────────────────────────────────
    const [currentLang, setCurrentLang] = useState('ar');

    useEffect(() => {
        const stored = localStorage.getItem('lang');
        if (stored === 'ar' || stored === 'en') setCurrentLang(stored);
    }, []);

    const handleChangeLang = (langCode: string) => {
        const selected = LANGUAGES.find((l) => l.code === langCode);
        if (!selected || langCode === currentLang) return;
        localStorage.setItem('lang', langCode);
        document.documentElement.lang = langCode;
        document.documentElement.dir = selected.dir;
        setCurrentLang(langCode);
    };

    const currentLangLabel = LANGUAGES.find((l) => l.code === currentLang)?.label ?? 'عربي';

    return (
        <section className="content-section" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="container">
                <div className="upper-header">
                    <button
                        type="button"
                        className="back-btn"
                        onClick={() => router.back()}
                        aria-label="رجوع"
                    >
                        <i className="fa-regular fa-arrow-right"></i>
                    </button>
                    <h3 className="page-title">الإعدادات</h3>
                    <div className="empty"></div>
                </div>

                <div className="profile-details">
                    <div className="item-info">

                        {/* Notifications */}
                        <div className="setting-item">
                            <span>الإشعارات</span>
                            <div className="setting-arrow">
                                <label className="pill" aria-label="تفعيل الإشعارات">
                                    <input
                                        type="checkbox"
                                        checked={notificationsEnabled}
                                        disabled={pending}
                                        onChange={handleToggleNotifications}
                                    />
                                    <span className="switch"></span>
                                </label>
                                <i className="fa-solid fa-chevron-left"></i>
                            </div>
                        </div>

                        {/* Language */}
                        <div className="setting-item">
                            <span>اللغة</span>

                            {/* Transparent select overlaid on entire row */}
                            <select
                                value={currentLang}
                                onChange={(e) => handleChangeLang(e.target.value)}
                                className="lang-select-overlay"
                                aria-label="اختر اللغة"
                            >
                                {LANGUAGES.map((l) => (
                                    <option key={l.code} value={l.code}>{l.label}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
