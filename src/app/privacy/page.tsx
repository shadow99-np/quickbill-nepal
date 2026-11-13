'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, Cookie } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Invoice Maker</span>
        </Link>

        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy Policy • QuickBill Nepal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Last Updated: November 2026 • Effective for all users of QuickBill Nepal
          </p>
        </div>

        {/* Section 1: 100% Client-Side Invoicing */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            1. Zero-Knowledge Client-Side Architecture
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            At QuickBill Nepal (बिलसाथी), we take your privacy and financial security with utmost seriousness. QuickBill Nepal operates as a <strong>100% client-side web application</strong>.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            All invoice drafting, PAN calculations, VAT sums, client names, line items, and uploaded QR codes/logos are processed exclusively in your browser’s local memory (<code className="bg-slate-100 px-1 py-0.5 rounded text-xs text-slate-800">localStorage</code>). <strong>None of your business details, customer records, or financial figures are transmitted, stored, or indexed on any external server or backend database.</strong>
          </p>
        </section>

        {/* Section 2: Cookies & Third-Party Advertising (Google AdSense) */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Cookie className="w-4 h-4 text-emerald-600" />
            2. Google AdSense &amp; Advertising Cookies
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            To keep QuickBill Nepal completely free for Nepali freelancers, independent contractors, and micro-merchants, we display third-party advertisements delivered by Google AdSense and contextual local sponsors.
          </p>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1.5 leading-relaxed">
            <li>
              Third party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to QuickBill Nepal and/or other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 underline font-medium"
              >
                Google Ads Settings
              </a>{' '}
              or by visiting{' '}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 underline font-medium"
              >
                aboutads.info
              </a>.
            </li>
          </ul>
        </section>

        {/* Section 3: Local Storage Usage */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-600" />
            3. What Data Is Stored on Your Device?
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            The following data is saved strictly on your local browser cache to enable convenience features:
          </p>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 text-xs">
            <li><strong className="text-slate-800">Default Business Profile:</strong> Your registered business name, PAN, contact phone, office address, and payment handles (e.g. Fonepay ID, Bank account number).</li>
            <li><strong className="text-slate-800">Invoice Draft &amp; History:</strong> Previous invoices you have created so you can re-open, print, or export them to IRD Sales Register CSV.</li>
            <li><strong className="text-slate-800">Compressed Image Cache:</strong> Downscaled logo or counter stand QR image.</li>
          </ul>
          <p className="text-xs text-slate-500">
            You can permanently wipe all stored data at any time by clearing your browser cache or clicking &quot;Reset&quot; on the app.
          </p>
        </section>

        {/* Section 4: Contact Us */}
        <section className="pt-4 border-t border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-1">Contacting Us</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            If you have any questions or concerns regarding this Privacy Policy or data privacy on QuickBill Nepal, feel free to contact us at{' '}
            <span className="font-semibold text-emerald-700">support@quickbillnepal.com</span> or via our{' '}
            <Link href="/about" className="text-emerald-600 underline font-medium">
              About Page
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
