import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://new.sahlsale.work/api";

export interface NotificationExtra {
    model_id: number;
    title: { ar: string; en: string };
    body: { ar: string; en: string };
    type: string;
    image?: string;
}

export interface Notification {
    id: string;
    created_at: string;
    extra: NotificationExtra;
}

export interface NotificationsResponse {
    status: boolean;
    data: Notification[];
}

export async function getNotifications(token: string): Promise<NotificationsResponse> {
    const { data } = await axios.get<NotificationsResponse>(`${BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
}

export async function deleteNotification(id: string, token: string): Promise<{ status: boolean; message?: string }> {
    const { data } = await axios.delete<{ status: boolean; message?: string }>(`${BASE_URL}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
}
