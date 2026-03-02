"use client";

import React from "react";
import UpperHeader from "@/components/General/UpperHeader";
import { Loader2 } from "lucide-react";
import { useGetSettings } from "@/src/hooks/useGetSettings";
import Loading from "@/src/app/loading";

export default function PrivacyWrapper() {
    const { data, isLoading, error } = useGetSettings();

    return (
        <section className="content-section" dir="rtl">
            <div className="container">
                <UpperHeader title="سياسة الخصوصية" />

                {isLoading && (
                    <Loading />
                )}

                {error && (
                    <p className="text-center text-red-500 py-10">حدث خطأ أثناء تحميل البيانات</p>
                )}

                {data && (
                    <div
                        className="prose prose-sm max-w-none py-4"
                        dangerouslySetInnerHTML={{ __html: data.privacy }}
                    />
                )}
            </div>
        </section>
    );
}
