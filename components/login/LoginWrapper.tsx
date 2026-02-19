'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import Verifiy from "./Verifiy";
import { getFcmToken } from "@/lib/firebase";
import { verifyCode } from "@/src/services/authService";
import { saveToken, saveUser } from "@/src/utils/token";

interface LoginState {
    phone: string;
    country_code: string;
    name: string;
}

export default function LoginWrapper() {
    const router = useRouter();
    const [step, setStep] = useState<"login" | "verify">("login");
    const [fcmToken, setFcmToken] = useState<string>("");
    const [loginData, setLoginData] = useState<LoginState>({
        phone: "",
        country_code: "",
        name: "",
    });

    // Fetch FCM token once when component mounts
    useEffect(() => {
        getFcmToken().then((token) => {
            if (token) setFcmToken(token);
        });
    }, []);

    const handleLoginSuccess = (data: LoginState) => {
        setLoginData(data);
        setStep("verify");
    };

    const handleVerify = async (otp: string) => {
        const res = await verifyCode({
            phone: loginData.phone,
            code: otp,
            country_code: loginData.country_code,
        });

        if (res.status && res.data?.token) {
            saveToken(res.data.token);
            saveUser(res.data);
            router.push("/");
        }
    };

    const handleResend = async () => {
        // Re-trigger login to resend OTP
        // The LoginForm already handles calling the login API — just go back to it
        setStep("login");
    };

    return (
        <div className="login-wrapper">
            {step === "login" ? (
                <LoginForm
                    fcmToken={fcmToken}
                    onSuccess={handleLoginSuccess}
                    onSkip={() => router.push("/")}
                />
            ) : (
                <Verifiy
                    phone={loginData.phone}
                    countryCode={loginData.country_code}
                    onBack={() => setStep("login")}
                    onResend={handleResend}
                    onConfirm={handleVerify}
                />
            )}
        </div>
    );
}
