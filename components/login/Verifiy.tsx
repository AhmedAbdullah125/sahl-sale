'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import logo from "@/src/images/logo.png";
import { API_BASE_URL } from "@/lib/apiConfig";

interface VerifiyProps {
    phone: string;
    countryCode: string;
    onBack: () => void;
    onConfirm: (otp: string) => Promise<void>;
}

export default function Verifiy({ phone, countryCode, onBack, onConfirm }: VerifiyProps) {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startCooldown = () => {
        setResendCooldown(40);
        timerRef.current = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

    const handleResend = async () => {
        if (resendCooldown > 0 || loading) return;
        try {
            const formData = new FormData();
            formData.append("phone", phone);
            formData.append("country_code", countryCode);
            await fetch(`${API_BASE_URL}/auth/resend-code`, { method: "POST", body: formData });
            toast.success("تم إعادة إرسال الرمز");

        } catch {
            toast.error("فشل إعادة الإرسال، حاول مجدداً");
        } finally {
            startCooldown();
        }
    };

    const formattedPhone = useMemo(() => {
        if (!phone) return "";
        return `+${countryCode} ${phone}`;
    }, [phone, countryCode]);

    const submit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (otp.length !== 4 || loading) return;

        setLoading(true);
        try {
            await onConfirm(otp);
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "الرمز غير صحيح، يرجى المحاولة مجدداً";
            toast.error(msg);
            setOtp("");
        } finally {
            setLoading(false);
        }
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

                <h2 className="form-head">تحقق من الهاتف</h2>
                <p className="form-pargh">من فضلك ادخل الرمز المرسل إلى رقم الهاتف</p>

                <div className="form-number" dir="ltr">{formattedPhone}</div>

                <form onSubmit={submit} className="login-form">
                    <div className="form-cont">
                        <div className="form-group digit-group otp-form">
                            <InputOTP
                                maxLength={4}
                                value={otp}
                                onChange={(v) => setOtp(v)}
                                onComplete={(v) => setOtp(v)}
                                containerClassName="w-full justify-center"
                            >
                                <InputOTPGroup className="gap-2 justify-center">
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
                            <Button
                                type="submit"
                                className="form-btn"
                                disabled={otp.length !== 4 || loading}
                            >
                                {loading ? "جاري التحقق..." : "تأكيد"}
                            </Button>
                        </div>

                        <div className="text-center">
                            <span className="register-span"> لم استلم الرمز؟ </span>
                            <button
                                type="button"
                                className="register-btn"
                                onClick={handleResend}
                                disabled={loading || resendCooldown > 0}
                            >
                                {resendCooldown > 0 ? `إعادة إرسال (${resendCooldown}s)` : "إعادة إرسال"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
