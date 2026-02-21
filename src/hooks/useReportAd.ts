import { useMutation } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/apiConfig';

interface ReportParams {
    ad_id: string | number;
    reason: string;
}

const sendReport = async (params: ReportParams) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = { "accept-language": "ar" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const formData = new FormData();
    formData.append("ad_id", String(params.ad_id));
    formData.append("reason", params.reason);

    const res = await fetch(`${API_BASE_URL}/ad-report`, {
        method: 'POST',
        headers,
        body: formData,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.status) throw new Error(json.message || 'فشل إرسال البلاغ');
    return json;
};

export function useReportAd() {
    return useMutation({
        mutationFn: sendReport,
    });
}
