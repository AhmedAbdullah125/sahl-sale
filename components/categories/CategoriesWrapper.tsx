"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/apiConfig";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
    id: number;
    name: string;
    image: string;
    has_children: boolean;
    sub_categories_count: number;
}

interface CategoriesResponse {
    status: boolean;
    data: Category[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoriesWrapper() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_BASE_URL}/categories`, {
                    headers: { "accept-language": "ar" },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json: CategoriesResponse = await res.json();
                if (json.status) {
                    setCategories(json.data);
                } else {
                    setError("فشل تحميل الأقسام");
                }
            } catch {
                setError("حدث خطأ أثناء تحميل البيانات");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="home-page-content">
            <section className="content-section">
                <div className="container">
                    <h3 className="page-head">الأقسام</h3>

                    {loading && (
                        <div className="flex justify-center py-10">
                            <span className="text-gray-500">جاري التحميل...</span>
                        </div>
                    )}

                    {error && (
                        <div className="flex justify-center py-10">
                            <span className="text-red-500">{error}</span>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="category-grid">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={cat.has_children ? `/categories/${cat.id}` : `/sub-category/${cat.id}`}
                                    className="category-ancor"
                                >
                                    <figure className="category-figure">
                                        <Image
                                            src={cat.image}
                                            alt={cat.name}
                                            width={220}
                                            height={160}
                                            className="h-auto w-full object-contain"
                                        />
                                    </figure>
                                    <span>{cat.name}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
