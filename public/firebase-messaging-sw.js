// Firebase Cloud Messaging Service Worker
// Required by the Firebase Web SDK for background push notifications.
// The actual Firebase config values are injected at runtime via
// the initializeApp call below. Update the config object with your credentials.

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// NOTE: Service workers cannot access NEXT_PUBLIC_ env vars directly.
// Fill in the same values as your .env.local here.
firebase.initializeApp({
    apiKey: "AIzaSyBiWH-ArKp3hLekM031B1orqiFK16gjY7M",
    authDomain: "sahlsale-162ac.firebaseapp.com",
    projectId: "sahlsale-162ac",
    storageBucket: "sahlsale-162ac.firebasestorage.app",
    messagingSenderId: "307584996138",
    appId: "1:307584996138:web:6bb0953cfac3b0b0154453",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const { title, body, icon } = payload.notification ?? {};
    self.registration.showNotification(title ?? "SahlSale", {
        body: body ?? "",
        icon: icon ?? "/favicon.ico",
    });
});
