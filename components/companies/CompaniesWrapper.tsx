"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import UpperHeader from "@/components/General/UpperHeader";
import { Search, BadgeCheck, Loader2, Building2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useGetCompanies } from "@/src/hooks/useGetCompanies";
import Loading from "@/src/app/loading";


export default function CompaniesWrapper() {
    const [q, setQ] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isLoading, error } = useGetCompanies(searchQuery);
    const companies = data?.items || [];

    return (
        <section className="content-section">
            <div className="container">
                <UpperHeader title="سيارات للبيع" />

                <div className="search-custom">
                    <form
                        className="search-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setSearchQuery(q);
                        }}
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
                    {isLoading ? (
                        <Loading />
                    ) : error ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-red-500">
                            <p className="text-lg font-medium">حدث خطأ أثناء تحميل الشركات</p>
                        </div>
                    ) : companies.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground w-full">
                            <Building2 className="h-16 w-16 mb-4 opacity-50" />
                            <p className="text-lg font-medium">لا توجد شركات مطابقة للبحث</p>
                        </div>
                    ) : (
                        companies.map((c) => (
                            <Link
                                key={c.id}
                                href={`/companies/${c.id}`}
                                className="company-item"
                                onClick={() => {
                                    if (typeof window !== "undefined") {
                                        sessionStorage.setItem("selectedCompany", JSON.stringify(c));
                                    }
                                }}
                            >
                                <figure>
                                    <Image
                                        src={c.image || "http://sahl.test/placeholders/logo.jpg"}
                                        alt={c.name}
                                        width={70}
                                        height={70}
                                        className="h-auto w-auto object-contain"
                                        unoptimized
                                    />
                                </figure>

                                <div className="company-info">
                                    <span className="company-name">
                                        {c.name}{" "}
                                        {c.verified_account ? (
                                            <BadgeCheck className="inline-block h-4 w-4 text-blue-500" />
                                        ) : null}
                                    </span>
                                    <span className="company-num">{c.ads_number} إعلان فعال</span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
