"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGetSubCategories, type SubCategory } from "@/src/hooks/useGetSubCategories";

export default function CategoryWrapper({ id }: { id: string }) {
    const { data: subCategories = [], isLoading: loading, error: queryError } = useGetSubCategories(id);
    const error = queryError ? (queryError as Error).message || "حدث خطأ أثناء تحميل البيانات" : null;

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
