import type { Metadata, Viewport } from 'next';
import './tailwind.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'QuickBill Nepal — Professional Invoices with Fonepay & eSewa QR',
  description:
    'Generate professional IRD-compliant tax invoices and receipts in Nepali Rupees (NPR) with embedded Fonepay, eSewa, and Khalti scan-to-pay QR codes. Built for Nepali freelancers and businesses.',
  keywords: [
    'QuickBill Nepal',
    'Nepal Invoice Generator',
    'Fonepay QR Invoice',
    'eSewa QR Bill',
    'IRD Tax Invoice Nepal',
    'Nepali Freelancer Billing',
    'NPR Receipt Maker'
  ],
  other: {
    'google-adsense-account': 'ca-pub-4195575830261385',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased overflow-x-hidden">
      <head>
        <meta name="google-adsense-account" content="ca-pub-4195575830261385" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4195575830261385"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
