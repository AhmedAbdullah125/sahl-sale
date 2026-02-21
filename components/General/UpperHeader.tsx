"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpperHeaderProps {
    title: string;
    onBack?: () => void;
    backDisabled?: boolean;
}

export default function UpperHeader({ title, onBack, backDisabled }: UpperHeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <div className="upper-header">
            <button
                type="button"
                className="back-btn"
                onClick={handleBack}
                disabled={backDisabled}
                aria-label="Back"
            >
                <ArrowRight />
            </button>
            <h3 className="page-title">{title}</h3>
            <div className="empty" />
        </div>
    );
}
