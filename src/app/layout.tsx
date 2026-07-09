import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-paragraph',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-label',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Karjat Blooms — Private Estate Living by Rudram Realty',
  description:
    'Where pristine wilderness meets curated luxury. A private sanctuary crafted for the discerning few who demand more than a home.',
  keywords: 'Karjat Blooms, Rudram Realty, luxury estate, Karjat plots, Maharashtra real estate',
  icons: {
    icon: 'https://static.wixstatic.com/media/cef78c_d59cd6dd46d442059eaee5a6978b46d5~mv2.png',
    shortcut: 'https://static.wixstatic.com/media/cef78c_d59cd6dd46d442059eaee5a6978b46d5~mv2.png',
    apple: 'https://static.wixstatic.com/media/cef78c_d59cd6dd46d442059eaee5a6978b46d5~mv2.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${dmSans.variable} ${spaceGrotesk.variable}`}>
      {/* overflow-x:clip instead of hidden — clip does NOT create a scroll container
          so position:sticky works correctly throughout the page */}
      <body className="bg-[#022921]" style={{ overflowX: 'clip' }}>{children}</body>
    </html>
  );
}
