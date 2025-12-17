import './globals.css';
import '@/src/style/main.css';
import '@/src/style/all.min.css';
import ClientProviders from '@/src/utils/providers/ClientProviders';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export async function generateMetadata() {
  return {
    title: 'سهل سيل: أفضل موقع لعرض وبيع سيارات في الكويت | تجدد قائمة الاعلانات يوميًا',
    description: 'ابحث وتصفح العروض المميزة على سهل سيل، أفضل موقع لعرض وشراء السيارات في الكويت. نقدم مجموعة متنوعة من السيارات المعتمدة والموثوقة للبيع، بما في ذلك سيارات مستعملة وجديدة من جميع الموديلات والأنواع. احصل على أفضل صفقات السيارات وفرص الشراء المثالية. قم ببيع سيارتك بسهولة من خلال نشر إعلانك معنا. انضم إلى سهل سيل اليوم واحصل على تجربة تسوق مميزة وموثوقة.',
    keywords: 'SahlSale',
    openGraph: {
      title: 'سهل سيل: أفضل موقع لعرض وبيع سيارات في الكويت | تجدد قائمة الاعلانات يوميًا',
      description: 'ابحث وتصفح العروض المميزة على سهل سيل، أفضل موقع لعرض وشراء السيارات في الكويت. نقدم مجموعة متنوعة من السيارات المعتمدة والموثوقة للبيع، بما في ذلك سيارات مستعملة وجديدة من جميع الموديلات والأنواع. احصل على أفضل صفقات السيارات وفرص الشراء المثالية. قم ببيع سيارتك بسهولة من خلال نشر إعلانك معنا. انضم إلى سهل سيل اليوم واحصل على تجربة تسوق مميزة وموثوقة.',
      url: 'https://sahl-sale.vercel.app/',
      siteName: 'سهل سيل',
      images: [
        {
          url: 'https://sahl-sale.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.fee9394a.png&w=256&q=75',
          width: 1200,
          height: 630,
          alt: 'سهل سيل',
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
