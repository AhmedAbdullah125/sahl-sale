// Firebase Cloud Messaging Service Worker
// Required by the Firebase Web SDK for background push notifications.
// The actual Firebase config values are injected at runtime via
// the initializeApp call below. Update the config object with your credentials.

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// NOTE: Service workers cannot access NEXT_PUBLIC_ env vars directly.
// Fill in the same values as your .env.local here.
firebase.initializeApp({
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Background message:", payload);
    const { title, body, icon } = payload.notification ?? {};
    self.registration.showNotification(title ?? "SahlSale", {
        body: body ?? "",
        icon: icon ?? "/favicon.ico",
    });
});
