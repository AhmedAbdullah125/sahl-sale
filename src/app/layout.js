import './globals.css';
import '@/src/style/main.css';
import '@/src/style/all.min.css';
import ClientProviders from '@/src/utils/providers/ClientProviders';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export async function generateMetadata() {
  return {
    title: 'SahlSale',
    description: 'SahlSale',
    keywords: 'SahlSale',
    openGraph: {
      title: 'SahlSale',
      description: 'SahlSale',
      url: 'SahlSale-rose.vercel.com',
      siteName: 'SahlSale',
      images: [
        {
          url: 'https://SahlSale-rose.vercel.app/_next/static/media/blue-logo.62b83cbf.svg',
          width: 1200,
          height: 630,
          alt: 'SahlSale',
        },
      ],
      type: 'website',
      locale: 'ar_SA',
    },
  };
}

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
