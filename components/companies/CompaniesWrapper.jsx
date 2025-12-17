"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, BadgeCheck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import logo from "@/src/images/logo.svg";
import img1 from "@/src/images/01.jpg";


const COMPANIES = [
    {
        id: "1",
        href: "/companies/1",
        name: "شركة الخليج العربي",
        activeAds: 12,
        verified: true,
        img: logo,
    },
    {
        id: "2",
        href: "/companies/2",
        name: "شركة الخليج العربي",
        activeAds: 12,
        verified: true,
        img: img1,
    },
];

export default function CompaniesWrapper() {
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        const s = q.trim();
        if (!s) return COMPANIES;
        return COMPANIES.filter((c) => c.name.includes(s));
    }, [q]);

    return (
        <section className="content-section">
            <div className="container">
                <div className="upper-header">
                    <button
                        type="button"
                        className="back-btn"
                        onClick={() => window.history.back()}
                        aria-label="Back"
                    >
                        <ArrowRight />
                    </button>

                    <h3 className="page-title">سيارات للبيع</h3>
                    <div className="empty" />
                </div>

                <div className="search-custom">
                    <form
                        className="search-form"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <Input
                            className="search-input"
                            type="text"
                            placeholder="ابحث"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />

                        <Button type="submit" size="icon" className="search-button" aria-label="Search">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                </div>

                <div className="company-items">
                    {filtered.map((c) => (
                        <Link key={c.id} href={c.href} className="company-item">
                            <figure>
                                <Image
                                    src={c.img}
                                    alt="logo"
                                    width={70}
                                    height={70}
                                    className="h-auto w-auto object-contain"
                                />
                            </figure>

                            <div className="company-info">
                                <span className="company-name">
                                    {c.name}{" "}
                                    {c.verified ? (
                                        <BadgeCheck className="inline-block h-4 w-4" />
                                    ) : null}
                                </span>
                                <span className="company-num">{c.activeAds} إعلان فعال</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
