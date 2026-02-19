import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://new.sahlsale.work/api";

export interface LoginPayload {
    phone: string;
    country_code: string;
    fcm_token: string;
    name: string;
}

export interface VerifyPayload {
    phone: string;
    code: string;
    country_code: string;
}

export interface AuthUser {
    id: number;
    token: string;
    name: string;
    phone: string;
    country_code: string;
    full_phone: string;
    image: string;
    language: string;
    verified_account: boolean;
    notification_allowed: boolean;
    type: string | null;
    whatsapp: string | null;
    whatsapp_country_code: string | null;
    full_whatsapp: string | null;
}

export interface AuthResponse {
    status: boolean;
    data: AuthUser;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append("phone", payload.phone);
    formData.append("country_code", payload.country_code);
    formData.append("fcm_token", payload.fcm_token);
    formData.append("name", payload.name);

    const { data } = await axios.post<AuthResponse>(
        `${BASE_URL}/auth/login`,
        formData
    );
    return data;
}

export async function verifyCode(payload: VerifyPayload): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append("phone", payload.phone);
    formData.append("code", payload.code);
    formData.append("country_code", payload.country_code);

    const { data } = await axios.post<AuthResponse>(
        `${BASE_URL}/auth/verify-code`,
        formData
    );
    return data;
}
