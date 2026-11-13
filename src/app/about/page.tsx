'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Heart, Mail, MapPin, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-10">
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
            <Zap className="w-4 h-4 fill-current" />
            <span>Empowering Nepali Micro-Businesses</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About QuickBill Nepal (बिलसाथी)
          </h1>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            A free, privacy-first web utility built to help freelancers, creative agencies, home businesses, and independent merchants in Nepal get paid faster with professional tax invoices and instant payment QR codes.
          </p>
        </div>

        {/* The Problem We Solve */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Why We Built QuickBill Nepal</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            In Nepal, over 300,000+ talented freelancers (developers, UI/UX designers, video editors, content creators), private tutors, photographers, caterers, and small trade shops bill clients every single day.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Most of them are forced to choose between two bad options:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">The Bad Option 1</span>
              <h3 className="font-bold text-slate-900 text-sm">Messy Word / Excel Templates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manually editing tables, broken formulas, misaligned logos, and no way for clients to scan and pay directly on mobile.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">The Bad Option 2</span>
              <h3 className="font-bold text-slate-900 text-sm">Expensive Enterprise ERPs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Priced at NPR 10,000 to 40,000 per year, requiring complex server setups and storing your private customer list on their servers.
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed pt-2">
            <strong>QuickBill Nepal solves this completely:</strong> It runs 100% locally in your web browser. You fill in the details, your business profile is saved for next time, an exact payment QR code is embedded, and you download a clean, print-ready PDF in 10 seconds — 100% free forever.
          </p>
        </section>

        {/* Core Pillars */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Our Core Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Zero-Server Privacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your customer names, prices, and PAN details never leave your device. Everything lives safely in your browser.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <Zap className="w-6 h-6 text-emerald-600 fill-current" />
              <h3 className="text-sm font-bold text-slate-900">Nepal Payment Ready</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatic generation of Fonepay, eSewa, Khalti, and Bank Transfer QR codes with exact payable NPR amounts.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">IRD Rule 23 Aligned</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complies with standard Nepal VAT &amp; PAN rules with instant export of IRD Sales Register (बिक्री खाता) CSVs.
              </p>
            </div>
          </div>
        </section>

        {/* Contact & Feedback */}
        <section className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-emerald-950 flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-700" />
            <span>Get in Touch &amp; Feedback</span>
          </h2>
          <p className="text-xs text-emerald-900 leading-relaxed">
            Have a suggestion, need a custom feature for your Nepali business, or found a bug? We would love to hear from you:
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-semibold text-emerald-950 pt-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-emerald-700" />
              <span>Email: <a href="mailto:support@quickbillnepal.com" className="underline hover:text-emerald-700">support@quickbillnepal.com</a></span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Kathmandu, Bagmati Province, Nepal</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
