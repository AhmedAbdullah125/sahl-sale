'use client';

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import logo from "@/src/images/logo.svg";

export default function Verifiy({ phone, onBack, onResend, onConfirm }) {
    const [otp, setOtp] = useState("");

    const formattedPhone = useMemo(() => {
        if (!phone) return "";
        // عرض بسيط — عدّل لو عندك format معين
        return phone.startsWith("+") ? phone.slice(1) : phone;
    }, [phone]);

    const submit = async (e) => {
        e?.preventDefault?.();
        if (otp.length !== 4) return;
        await onConfirm?.(otp);
    };

    return (
        <div className="sign-section" dir="rtl">
            <div className="sign-container">
                <div className="upper-header">
                    <button
                        type="button"
                        className="back-btn"
                        onClick={() => onBack?.()}
                        aria-label="رجوع"
                    >
                        <i className="fa-regular fa-arrow-right"></i>
                    </button>
                </div>

                <div className="upper-head">
                    <Link href="/" className="logo-ancor" aria-label="Home">
                        <figure className="logo-img">
                            <Image src={logo} alt="logo" width={140} height={60} className="img-fluid" />
                        </figure>
                    </Link>
                </div>

                <h2 className="form-head">تحقق من الهاتف</h2>
                <p className="form-pargh">من فضلك ادخل الرمز المرسل إلى رقم الهاتف</p>

                <div className="form-number">{formattedPhone}</div>

                <form onSubmit={submit} className="login-form">
                    <div className="form-cont">
                        <div className="form-group digit-group otp-form">
                            <InputOTP
                                maxLength={4}
                                value={otp}
                                onChange={(v) => setOtp(v)}
                                onComplete={(v) => {
                                    // optional auto submit
                                    // submit()  // لو عايز أول ما يكمل يبعت
                                    setOtp(v);
                                }}
                                containerClassName="w-full justify-center"
                            >
                                <InputOTPGroup className="gap-2 justify-center">
                                    {/* نفس شكل input بتاع UI dev: otp-field */}
                                    {[0, 1, 2, 3].map((i) => (
                                        <InputOTPSlot
                                            key={i}
                                            index={i}
                                            className="otp-field"
                                        />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <div className="form-btn-cont">
                            <Button type="submit" className="form-btn" disabled={otp.length !== 4}>
                                تأكيد
                            </Button>
                        </div>

                        <div className="text-center">
                            <span className="register-span"> لم استلم الرمز؟ </span>
                            <button
                                type="button"
                                className="register-btn"
                                onClick={() => onResend?.()}
                            >
                                إعادة إرسال
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
