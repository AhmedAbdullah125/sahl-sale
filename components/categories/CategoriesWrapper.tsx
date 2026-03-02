"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetCategories } from "@/src/hooks/useGetCategories";
import Loading from "@/src/app/loading";

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoriesWrapper() {
    const { data: categories, isLoading, error } = useGetCategories();

    return (
        <div className="home-page-content">
            <section className="content-section">
                <div className="container">
                    <h3 className="page-head">الأقسام</h3>

                    {isLoading && (
                        <Loading />
                    )}

                    {error && (
                        <div className="flex justify-center py-10">
                            <span className="text-red-500">{error.message || "حدث خطأ أثناء تحميل البيانات"}</span>
                        </div>
                    )}

                    {!isLoading && !error && categories && (
                        <div className="category-grid">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={cat.has_children ? `/categories/${cat.id}` : `/sub-category/${cat.id}`}
                                    className="category-ancor"
                                >
                                    <figure className="category-figure">
                                        <Image src={cat.image} alt={cat.name} width={220} height={160} className="h-auto w-full object-contain" />
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
