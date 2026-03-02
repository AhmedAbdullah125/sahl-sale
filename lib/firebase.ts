import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

/**
 * Requests notification permission and returns a Firebase FCM registration token.
 * Returns null if notifications are blocked, not supported, or on server-side.
 */
export async function getFcmToken(): Promise<string | null> {
    try {
        if (typeof window === "undefined") return null;

        const supported = await isSupported();
        if (!supported) return null;

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return null;

        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

        const sw = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

        const messaging = getMessaging(app);
        const token = await getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: sw,
        });

        return token || null;
    } catch (err) {
        console.error("[FCM] token error:", err);
        return null;
    }
}

export default app;
