'use client'
import SideData from '@/components/profile/SideData';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { API_BASE_URL } from '@/lib/apiConfig';
import { removeToken, getToken } from '@/src/utils/token'

export default function Profile({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const token = getToken();
            const headers: Record<string, string> = { 'accept-language': 'ar' };
            if (token) headers.Authorization = `Bearer ${token}`;
            await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', headers });
        } catch {
            // proceed with local cleanup even if API fails
        } finally {
            removeToken();
            router.push('/login');
        }
    };

    const [lang, setLang] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedLang = localStorage.getItem('lang');
            if (storedLang === 'ar' || storedLang === 'en') return storedLang;
            return 'en';
        }
        return 'en';
    });
    const pathname = usePathname();

    return (
        <section className="content-section">
            <div className="container">
                <div className={`upper-header ${pathname !== '/profile' ? 'hide' : ''}`}>
                    <div className="empty"></div>
                    <h3 className="page-title">الحساب</h3>
                    <button type="button" className="back-btn logOut" onClick={handleLogout} aria-label="تسجيل الخروج">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </button>
                </div>
                <div className="profile-page">
                    <SideData />
                    <div className="profile-content" id='profile-content'>
                        {children}
                    </div>
                </div>
            </div>
        </section>
    )
}
