import './globals.css';
import '@/src/style/main.css';
import '@/src/style/all.min.css';
import ClientProviders from '@/src/utils/providers/ClientProviders';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const SITE_URL = "https://sahl-sale.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: "سهل سيل: أفضل موقع لعرض وبيع سيارات في الكويت | تجدد قائمة الاعلانات يوميًا",
  description:
    "ابحث وتصفح العروض المميزة على سهل سيل، أفضل موقع لعرض وشراء السيارات في الكويت. نقدم مجموعة متنوعة من السيارات المعتمدة والموثوقة للبيع، بما في ذلك سيارات مستعملة وجديدة من جميع الموديلات والأنواع.",

  keywords: ["SahlSale", "سهل سيل", "سيارات الكويت", "بيع سيارات", "شراء سيارات", "مزاد سيارات", "الكويت"],

  width: 'device-width',
  initialScale: 1,

  alternates: {
    canonical: "/",
    languages: {
      ar: "/",
    },
  },

  openGraph: {
    title: "سهل سيل: أفضل موقع لعرض وبيع سيارات في الكويت",
    description:
      "ابحث وتصفح العروض المميزة على سهل سيل، أفضل موقع لعرض وشراء السيارات في الكويت...",
    url: "/",
    siteName: "سهل سيل",
    type: "website",
    locale: "ar_KW",
    images: [
      {
        url: "https://sahl-sale.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.fafff90a.png&w=256&q=75", // Using existing logo as fallback
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
    images: ["https://sahl-sale.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.fafff90a.png&w=256&q=75"], // Using existing logo as fallback
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
  themeColor: "#0B1220",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
