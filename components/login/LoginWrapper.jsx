'use client';

import React, { useState } from "react";
import LoginForm from "./LoginForm";
import Verifiy from "./Verifiy";

export default function LoginWrapper() {
    const [step, setStep] = useState("login");
    const [loginData, setLoginData] = useState({ fullName: "", phone: "" });

    return (
        <div className="login-wrapper">
            {step === "login" ? (
                <LoginForm
                    onSuccess={(data) => {
                        setLoginData(data);
                        setStep("verify");
                    }}
                    onSkip={() => {
                        // TODO: navigate to home or whatever
                        // router.push("/")
                    }}
                />
            ) : (
                <Verifiy
                    phone={loginData.phone}
                    onBack={() => setStep("login")}
                    onResend={() => {
                        // TODO: call resend otp API
                        // await fetch("/api/auth/resend-otp", { method: "POST", body: JSON.stringify({ phone: loginData.phone }) })
                    }}
                    onConfirm={async (otp) => {
                        // TODO: call verify API
                        // const res = await fetch("/api/auth/verify-otp", { method:"POST", body: JSON.stringify({ phone: loginData.phone, otp }) })
                        // if ok -> save token cookie and redirect
                        console.log("OTP:", otp, "PHONE:", loginData.phone);
                    }}
                />
            )}
        </div>
    );
}
