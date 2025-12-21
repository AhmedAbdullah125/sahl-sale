"use client";

import React from "react";
import Link from "next/link";

export default function VerificationModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="verification-modal-backdrop"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="verification-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div className="verification-modal-content">
                    {/* Icon */}
                    <div className="verification-icon">
                        <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
                    </div>

                    {/* Title */}
                    <h2 id="modal-title" className="verification-title">حسابك غير موثق</h2>

                    {/* Message */}
                    <p className="verification-message">
                        يجب توثيق حسابك للتمكن من المشاركة في المزاد
                    </p>

                    {/* Action Button */}
                    <Link href="/verify-account" className="verification-btn">
                        توثيق الحساب
                    </Link>
                </div>
            </div>
        </>
    );
}
