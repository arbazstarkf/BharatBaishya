import HomeClient from './HomeClient';

export const metadata = {
  title: 'Dr. Bharat Baishya | Consultant Physician & Diabetes Specialist | Rangia, Assam',
  description:
    'Dr. Bharat Baishya is a trusted consultant physician and diabetes specialist with 20+ years of experience. MBBS, MD (Internal Medicine), CCEBDM, FICP. Book your appointment at Sparsh Hospital, Rangia or Tamulpur Hospital.',
  alternates: {
    canonical: 'https://drbharatassam.com',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
