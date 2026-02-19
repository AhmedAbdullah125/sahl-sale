"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { API_BASE_URL } from "@/lib/apiConfig";

interface SubCategory {
    id: number;
    name: string;
    image: string;
    sub_categories_count: number;
    has_children: boolean;
    ad_form: string;
    company_allowed: boolean;
    supports_auction: boolean;
    has_city: boolean;
}

interface ApiResponse {
    status: boolean;
    data: SubCategory[];
}

export default function CategoryWrapper({ id }: { id: string }) {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                const headers: Record<string, string> = {
                    "accept-language": "ar",
                    "Content-Type": "application/json",
                };
                if (token) headers.Authorization = `Bearer ${token}`;

                const res = await fetch(`${API_BASE_URL}/sub-categories/${id}`, { headers });
                if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
                const json: ApiResponse = await res.json();
                if (json.status) {
                    setSubCategories(json.data);
                } else {
                    setError("فشل تحميل البيانات");
                }
            } catch (err) {
                setError("حدث خطأ أثناء تحميل البيانات");
            } finally {
                setLoading(false);
            }
        };

        fetchSubCategories();
    }, [id]);

    const getHref = (item: SubCategory) =>
        item.has_children ? `/categories/${item.id}` : `/sub-category/${item.id}`;

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
                    <h3 className="page-title">الفئات</h3>
                    <div className="empty" />
                </div>

                <Link href="/companies" className="page-ancor">
                    الشركات
                </Link>

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

                {!loading && !error && subCategories.length === 0 && (
                    <div className="flex justify-center items-center py-10">
                        <span className="text-gray-500">لا توجد فئات</span>
                    </div>
                )}

                {!loading && !error && subCategories.length > 0 && (
                    <div className="category-grid">
                        {subCategories.map((item) => (
                            <Link key={item.id} href={getHref(item)} className="category-ancor">
                                <figure className="category-figure">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={220}
                                        height={160}
                                        className="h-auto w-full object-contain"
                                    />
                                </figure>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
