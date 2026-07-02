import { Josefin_Sans, Poppins, Inter } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import ConditionalLayout from '@/components/ConditionalLayout';
import CookieBanner from '@/components/CookieBanner';

const josefin = Josefin_Sans({
  subsets: ['latin'],
  variable: '--font-josefin',
  display: 'swap',
  weight: ['300', '400', '600', '700'],
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  metadataBase: new URL('https://drbharatassam.com'),
  robots: {
    index: false,
    follow: false,
  },
  title: {
    default: 'Dr. Bharat Baishya | Consultant Physician & Diabetes Specialist | Assam',
    template: '%s | Dr. Bharat Baishya',
  },
  description:
    'Dr. Bharat Baishya — MBBS, MD (Internal Medicine), CCEBDM, FICP. Consultant physician and diabetes specialist with 20+ years of experience serving Assam and North-East India. Book your appointment today.',
  keywords: [
    'Dr. Bharat Baishya',
    'physician Assam',
    'diabetes specialist Rangia',
    'internal medicine doctor',
    'consultant physician Kamrup',
    'MBBS MD doctor Assam',
    'diabetes management North East India',
    'Sparsh Hospital Rangia',
    'best doctor in Rangia',
    'health checkup Assam',
  ],
  authors: [{ name: 'Dr. Bharat Baishya' }],
  creator: 'Dr. Bharat Baishya',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://drbharatassam.com',
    siteName: 'Dr. Bharat Baishya',
    title: 'Dr. Bharat Baishya | Consultant Physician & Diabetes Specialist',
    description:
      'Trusted consultant physician with 20+ years of experience in Internal Medicine and Diabetes Management. Serving Assam and North-East India.',
    images: [
      {
        url: '/images/doctor-portrait.png',
        width: 1200,
        height: 630,
        alt: 'Dr. Bharat Baishya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Bharat Baishya | Consultant Physician & Diabetes Specialist',
    description:
      'Trusted consultant physician with 20+ years of experience in Internal Medicine and Diabetes Management.',
    images: ['/images/doctor-portrait.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://drbharatassam.com',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${josefin.variable} ${poppins.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Physician',
              name: 'Dr. Bharat Baishya',
              description:
                'Consultant physician specializing in Internal Medicine and Diabetes Management with over 20 years of experience.',
              medicalSpecialty: ['InternalMedicine', 'Endocrinology'],
              qualification: [
                'MBBS',
                'MD (Internal Medicine)',
                'CCEBDM',
                'FICP',
              ],
              telephone: '+91 9854004813',
              email: 'drbharatbaishya@gmail.com',
              address: [
                {
                  '@type': 'PostalAddress',
                  streetAddress: 'Dharampur, Ward No 3, Opp. Highway Chef Dhaba',
                  addressLocality: 'Rangia',
                  addressRegion: 'Kamrup, Assam',
                  addressCountry: 'IN',
                },
                {
                  '@type': 'PostalAddress',
                  streetAddress: 'Sparsh Hospital, Station Road, Ward No 2',
                  addressLocality: 'Rangia',
                  addressRegion: 'Kamrup, Assam',
                  addressCountry: 'IN',
                },
                {
                  '@type': 'PostalAddress',
                  streetAddress: 'Tamulpur Hospital',
                  addressLocality: 'Tamulpur',
                  addressRegion: 'Baksa, Assam',
                  addressCountry: 'IN',
                },
              ],
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
                  opens: '11:00',
                  closes: '17:00',
                  description: 'Sparsh Hospital, Rangia',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
                  opens: '18:00',
                  closes: '20:00',
                  description: 'Residence Clinic, Rangia',
                },
              ],
              sameAs: [
                'https://www.instagram.com/bharatinstabaishyas',
                'https://www.facebook.com/bharatfacebookbaishya',
              ],
              memberOf: [
                { '@type': 'Organization', name: 'Assam Physicians Association' },
                { '@type': 'Organization', name: 'Indian College of Physicians' },
                { '@type': 'Organization', name: 'Assam Medical Council' },
              ],
            }),
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ThemeProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'} />
        <CookieBanner />
      </body>
    </html>
  );
}
