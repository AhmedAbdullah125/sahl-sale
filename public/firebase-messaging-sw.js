// Firebase Cloud Messaging Service Worker
// Required by the Firebase Web SDK for background push notifications.
// The actual Firebase config values are injected at runtime via
// the initializeApp call below. Update the config object with your credentials.

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// NOTE: Service workers cannot access NEXT_PUBLIC_ env vars directly.
// Fill in the same values as your .env.local here.
firebase.initializeApp({
    apiKey: "AIzaSyDXK6A5faFH1iganJFn87RT5NjLvzrlSkA",
    authDomain: "sahlsale-9ae7a.firebaseapp.com",
    projectId: "sahlsale-9ae7a",
    storageBucket: "sahlsale-9ae7a.appspot.com",
    messagingSenderId: "125311735751",
    appId: "REPLACE_WITH_WEB_APP_ID", // ⚠️ Must be Web appId (1:...:web:...) from Firebase Console → Project Settings → Your apps
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const { title, body, icon } = payload.notification ?? {};
    self.registration.showNotification(title ?? "SahlSale", {
        body: body ?? "",
        icon: icon ?? "/favicon.ico",
    });
});
