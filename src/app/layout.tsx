import type { Metadata } from 'next';
import { Playfair_Display, Open_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-paragraph',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Karjat Blooms — Private Estate Living by Rudram Realty',
  description:
    'Where pristine wilderness meets curated luxury. A private sanctuary crafted for the discerning few who demand more than a home.',
  keywords: 'Karjat Blooms, Rudram Realty, luxury estate, Karjat plots, Maharashtra real estate',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${openSans.variable}`}>
      {/* overflow-x:clip instead of hidden — clip does NOT create a scroll container
          so position:sticky works correctly throughout the page */}
      <body className="bg-cream" style={{ overflowX: 'clip' }}>{children}</body>
    </html>
  );
}
