'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
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
            <FileText className="w-4 h-4" />
            <span>Terms of Service • QuickBill Nepal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Effective Date: November 2026 • Please read carefully before using QuickBill Nepal
          </p>
        </div>

        {/* Section 1: Acceptance of Terms */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            By accessing or using QuickBill Nepal (&quot;QuickBill&quot;, &quot;we&quot;, &quot;us&quot;, or the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to all terms, please refrain from using our application.
          </p>
        </section>

        {/* Section 2: Purpose & Intended Use */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Service Description &amp; Scope</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            QuickBill Nepal is a productivity and invoice formatting utility created to help Nepali freelancers, creative professionals, sole proprietors, independent consultants, and micro-enterprises generate clean, printable, professional invoices and receipts with embedded payment QR codes (Fonepay, eSewa, Khalti, Bank Transfer).
          </p>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
            <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Standard Format Alignment (Rule 23 of VAT Rules 2053)</span>
            </p>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Our tax invoice template incorporates the standard statutory fields required by the Inland Revenue Department (IRD) of Nepal, including Seller Name, PAN/VAT, sequential Invoice Number, Buyer details, taxable/exempt breakdowns, 13% VAT, and amount in words.
            </p>
          </div>
        </section>

        {/* Section 3: IRD Regulatory Disclaimer */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            3. Tax &amp; Regulatory Disclaimer (Important)
          </h2>
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2 leading-relaxed">
            <p className="font-bold">
              QuickBill Nepal is a document generation tool, NOT an IRD-certified Electronic Cash Register (ECR) / CBMS-integrated billing software.
            </p>
            <p>
              Under Section 51 of the Income Tax Act 2058 and the VAT Directives of Nepal, businesses mandated by the Inland Revenue Department to maintain real-time Central Billing Monitoring System (CBMS) synchronization must issue invoices through IRD-approved certified software. Users are solely responsible for ensuring their tax compliance with their local Taxpayer Service Office (करदाता सेवा कार्यालय).
            </p>
          </div>
        </section>

        {/* Section 4: Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Limitation of Liability</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            QuickBill Nepal is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. Under no circumstances shall the creators or operators of QuickBill Nepal be liable for any direct, indirect, incidental, or consequential damages arising from the use of, or inability to use, this application.
          </p>
        </section>

        {/* Section 5: Governing Law */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Governing Law</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            These Terms shall be governed and construed in accordance with the laws of Nepal. Any disputes arising out of or related to the use of this website shall be subject to the exclusive jurisdiction of the competent courts of Kathmandu, Nepal.
          </p>
        </section>
      </div>
    </div>
  );
}
