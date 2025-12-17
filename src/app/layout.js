
const SITE_URL = "https://sahl-sale.vercel.app";
import './globals.css';
import '@/src/style/main.css';
import '@/src/style/all.min.css';
import ClientProviders from '@/src/utils/providers/ClientProviders';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: "سهل سيل: أفضل موقع لعرض وبيع سيارات في الكويت | تجدد قائمة الاعلانات يوميًا",
  description:
    "ابحث وتصفح العروض المميزة على سهل سيل، أفضل موقع لعرض وشراء السيارات في الكويت. نقدم مجموعة متنوعة من السيارات المعتمدة والموثوقة للبيع...",

  keywords: ["SahlSale", "سهل سيل", "سيارات الكويت", "بيع سيارات", "شراء سيارات"],

  alternates: {
    canonical: "/",
    languages: {
      ar: "/",
    },
  },

  openGraph: {
    title: "سهل سيل: أفضل موقع لعرض وبيع سيارات في الكويت | تجدد قائمة الاعلانات يوميًا",
    description:
      "ابحث وتصفح العروض المميزة على سهل سيل، أفضل موقع لعرض وشراء السيارات في الكويت...",
    url: "/",
    siteName: "سهل سيل",
    type: "website",
    locale: "ar_KW", // أنسب للكويت من ar_SA (اختياري)
    images: [
      {
        url: "/opengraph-image.png", // من app/opengraph-image.png
        width: 1200,
        height: 630,
        alt: "سهل سيل",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "سهل سيل: أفضل موقع لعرض وبيع سيارات في الكويت",
    description:
      "ابحث وتصفح العروض المميزة على سهل سيل، أفضل موقع لعرض وشراء السيارات في الكويت...",
    images: ["/twitter-image.png"], // من app/twitter-image.png
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  themeColor: "#0B1220", // عدّلها حسب براندك
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body suppressHydrationWarning={true}>
        <ClientProviders>
          <Header />
          {children}
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
