"use client";

import React from "react";
import Link from "next/link";
import UpperHeader from "@/components/General/UpperHeader";
import { Mail, Phone } from "lucide-react";
import { useGetSettings } from "@/src/hooks/useGetSettings";
import Loading from "@/src/app/loading";

export default function SupportWrapper() {
    const { data, isLoading, error } = useGetSettings();

    return (
        <section className="content-section" dir="rtl">
            <div className="container">
                <UpperHeader title="الدعم والمساعدة" />

                {isLoading && (
                    <Loading />
                )}

                {error && (
                    <p className="text-center text-red-500 py-10">حدث خطأ أثناء تحميل البيانات</p>
                )}

                {data && (
                    <div className="flex flex-col justify-center gap-4 py-4">
                        <div className="flex gap-3 items-center justify-center">
                            {data.phone && (
                                <Link
                                    href={`tel:${data.phone}`}
                                    className="flex items-center gap-3 rounded-xl border p-4 hover:bg-muted transition"
                                >
                                    <Phone className="h-5 w-5 text-primary" />
                                    <span className="text-sm font-medium">{data.phone}</span>
                                </Link>
                            )}

                            {data.whatsapp && (
                                <Link
                                    href={`https://wa.me/${data.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-xl border p-4 hover:bg-muted transition"
                                >
                                    <i className="fa-brands fa-whatsapp text-green-500 text-lg" aria-hidden="true" />
                                    <span className="text-sm font-medium">{data.whatsapp}</span>
                                </Link>
                            )}

                            {data.email && (
                                <Link
                                    href={`mailto:${data.email}`}
                                    className="flex items-center gap-3 rounded-xl border p-4 hover:bg-muted transition"
                                >
                                    <Mail className="h-5 w-5 text-primary" />
                                    <span className="text-sm font-medium">{data.email}</span>
                                </Link>
                            )}

                        </div>
                        {/* Social links */}
                        <div className="flex items-center justify-center gap-3 mt-2">
                            {data.facebook && (
                                <Link href={data.facebook} target="_blank" rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border hover:bg-muted transition">
                                    <i className="fa-brands fa-facebook text-blue-600" aria-hidden="true" />
                                </Link>
                            )}
                            {data.twitter && (
                                <Link href={data.twitter} target="_blank" rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border hover:bg-muted transition">
                                    <i className="fa-brands fa-x-twitter" aria-hidden="true" />
                                </Link>
                            )}
                            {data.instagram && (
                                <Link href={data.instagram} target="_blank" rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border hover:bg-muted transition">
                                    <i className="fa-brands fa-instagram text-pink-500" aria-hidden="true" />
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
