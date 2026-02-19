'use client'
import SideData from '@/components/profile/SideData';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'

export default function Profile({ children }) {

    const [lang, setLang] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedLang = localStorage.getItem('lang');
            if (storedLang === 'ar' || storedLang === 'en') return storedLang;
            return 'en';
        }
        return 'en';
    });
    const pathname = usePathname();
    console.log(pathname);

    return (
        <section className="content-section">
            <div className="container">
                <div className={`upper-header ${pathname !== '/profile' ? 'hide' : ''}`}>
                    <div className="empty"></div>
                    <h3 className="page-title">الحساب</h3>
                    <button className="back-btn logOut">
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
