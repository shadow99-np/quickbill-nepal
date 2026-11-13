'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Smartphone,
  Laptop,
  Users,
  FileText,
  DollarSign,
  ArrowRight,
  Sparkles,
  Download,
  Share2,
  Printer,
  ChevronRight,
  Crown,
  HelpCircle,
  ExternalLink,
  Lock,
  Layers,
  Database,
  RefreshCw,
  Coins,
  Globe,
  Building2,
  Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { ProUpgradeModal } from '@/components/ProUpgradeModal';
import { NotificationFeed } from '@/components/NotificationFeed';
import { Footer } from '@/components/Footer';

export default function LandingPage() {
  const { user, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [isProOpen, setIsProOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleOpenAuth = (tab: 'login' | 'signup' = 'login') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const FAQS = [
    {
      q: 'Is QuickBill Nepal compliant with Inland Revenue Department (IRD) rules?',
      a: 'Yes. QuickBill Nepal generates invoices adhering strictly to IRD Rule 23 guidelines, including mandatory Seller & Purchaser PAN/VAT numbers, bilingual English/Nepali labels, formal fiscal year sequencing (e.g., QB-2081-XXXX), separate 13% VAT calculations, and exact amount in words.',
    },
    {
      q: 'How does the Fonepay, eSewa and Khalti QR code work?',
      a: 'You can either upload your shop’s physical counter QR stand or configure your merchant/mobile details. When an invoice is created, QuickBill embeds the payment QR directly on the bill so customers can scan with any Nepali banking app (Fonepay, eSewa, Khalti, ConnectIPS) and pay straight to your account with zero commission.',
    },
    {
      q: 'Will I lose my invoices and client data if I switch devices?',
      a: 'Not at all! When you create a free account, your business profile, logos, counter payment QR, client address directory, and past invoices automatically sync to our secure cloud database. You can start a bill on your office desktop and view or print it from your mobile phone anytime.',
    },
    {
      q: 'Can I issue invoices in foreign currencies like USD ($) or INR (₹)?',
      a: 'Yes. QuickBill supports multi-currency invoicing in NPR (रु), USD ($), INR (₹), EUR (€), and GBP (£) with automatic currency symbol formatting and words conversion, perfect for IT exporters, agencies, and remote consultants.',
    },
    {
      q: 'What is included in the Pro Plan and how do I activate it?',
      a: 'Pro includes unlimited cloud storage, cross-device client synchronization, custom counter QR stands, 100% ad-free experience, and priority IRD updates for just रु. १९९/month or रु. १,९९९/year. In addition, system administrators can instantly grant Pro access to any user using their @username or email from the Admin Portal.',
    },
    {
      q: 'Is the core billing tool really free to use?',
      a: 'Yes, QuickBill Nepal is 100% free for all Nepali shopkeepers, freelancers, and small businesses. The free tier is supported by clean Google AdSense ads, ensuring everyone has access to professional digital billing without expensive software fees.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <NotificationFeed />

      {/* 2. MAIN HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Compliance Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 transition-all">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1">
                  QuickBill <span className="text-emerald-600">Nepal</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 block -mt-1 uppercase">
                  बिलसाथी • IRD Rule 23
                </span>
              </div>
            </Link>

            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Nepal IRD Compliant
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#preview" className="hover:text-emerald-600 transition-colors">Live Preview</a>
            <a href="#cloud-sync" className="hover:text-emerald-600 transition-colors">Cloud Sync</a>
            <a href="#pricing" className="hover:text-emerald-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
            <Link href="/admin" className="text-slate-400 hover:text-slate-700 transition-colors text-xs font-mono">
              Admin Portal
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-end gap-1">
                    {user.isPro && <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />}
                    <span>{user.businessName || user.username || user.email}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">@{user.username || 'user'}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleOpenAuth('login')}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Primary Action Button: Open Tool */}
            <Link
              href="/billing"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all"
            >
              <span>Open Tool (निःशुल्क)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 text-emerald-800 text-xs sm:text-sm font-bold border border-emerald-200 shadow-2xs">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Smart Billing Engine for Nepal • IRD Rule 23 Aligned</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
              Generate Official <span className="text-emerald-600">Tax Invoices</span> with Dynamic <span className="text-indigo-600">Fonepay QR</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Create, customize, and print IRD Rule 23-compliant tax invoices in seconds. Embed customer payment QR codes, sync your client directory to the cloud, and access your billing books from any mobile or laptop with zero data loss.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/billing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-base shadow-lg shadow-emerald-600/30 transition-all"
              >
                <span>🚀 Open Billing Generator Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              {!user && (
                <button
                  onClick={() => handleOpenAuth('signup')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-base shadow-xs transition-all"
                >
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Create Free Account (Cloud Sync)</span>
                </button>
              )}
            </div>

            {/* Highlights Bar */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No Mandatory Registration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Automatic 13% VAT Calculation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Multi-Device Cloud Backup</span>
              </div>
            </div>
          </div>

          {/* Interactive Visual Hero Card / A4 Invoice Preview */}
          <div id="preview" className="mt-14 max-w-4xl mx-auto rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 sm:p-8 relative">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 text-xs text-slate-500 font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="ml-2 font-mono text-slate-600">Sample Tax Invoice • QB-2081-0001</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                  ● IRD Rule 23
                </span>
                <Link
                  href="/billing"
                  className="inline-flex items-center gap-1 text-emerald-600 font-bold hover:underline"
                >
                  <span>Edit in Tool</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Mockup Invoice Layout */}
            <div className="border border-slate-200 rounded-xl p-5 sm:p-8 bg-white font-sans text-xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    Himalayan Studio Nepal Pvt. Ltd.
                  </h3>
                  <p className="text-slate-500 text-[11px]">New Baneshwor, Kathmandu, Nepal • Phone: 9801234567</p>
                  <p className="text-slate-800 font-bold text-[11px] mt-1">
                    Seller PAN / VAT: <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">609823412</span>
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="inline-block px-3 py-1 bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider rounded">
                    TAX INVOICE (कर बिजक)
                  </div>
                  <div className="text-slate-500 text-[11px] mt-1 font-mono">Invoice: QB-2081-0001</div>
                  <div className="text-slate-500 text-[11px]">Date: 2081/08/28 BS (2026-11-13 AD)</div>
                </div>
              </div>

              {/* Bill To & QR Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Purchaser (Bill To)
                  </span>
                  <div className="font-bold text-slate-900 text-sm">Sunrise Trading & Mart</div>
                  <div className="text-slate-600 text-xs">Pokhara-8, Kaski, Nepal</div>
                  <div className="text-slate-600 text-xs">Buyer PAN: 601245890</div>
                </div>

                <div className="flex items-center gap-3 sm:justify-end">
                  <div className="w-16 h-16 bg-white border border-slate-300 rounded-lg p-1.5 flex items-center justify-center shadow-xs">
                    <QrCode className="w-full h-full text-emerald-700" />
                  </div>
                  <div className="text-left">
                    <span className="inline-block text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-600 text-white uppercase tracking-wider">
                      Fonepay Instant QR
                    </span>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">Scan to Pay via Banking</div>
                    <div className="text-[10px] text-slate-500">Auto-embeds exact total amount</div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                      <th className="py-2 px-3">S.N.</th>
                      <th className="py-2 px-3">Particulars / Description</th>
                      <th className="py-2 px-3 text-right">Qty</th>
                      <th className="py-2 px-3 text-right">Rate (रु)</th>
                      <th className="py-2 px-3 text-right">Amount (रु)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
                    <tr>
                      <td className="py-2.5 px-3">1</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">Custom Web Application Development</td>
                      <td className="py-2.5 px-3 text-right">1</td>
                      <td className="py-2.5 px-3 text-right">35,000.00</td>
                      <td className="py-2.5 px-3 text-right font-semibold">35,000.00</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3">2</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">Annual Cloud Hosting & Maintenance</td>
                      <td className="py-2.5 px-3 text-right">1</td>
                      <td className="py-2.5 px-3 text-right">5,000.00</td>
                      <td className="py-2.5 px-3 text-right font-semibold">5,000.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals & Words */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2 border-t border-slate-200">
                <div className="max-w-md">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    In Words (रकम अक्षरेरु)
                  </span>
                  <div className="font-semibold text-slate-800 text-xs italic bg-slate-50 p-2.5 rounded border border-slate-200 mt-1">
                    Forty-Five Thousand Two Hundred Rupees Only.
                  </div>
                </div>

                <div className="w-full sm:w-64 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono">रु 40,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount (Flat):</span>
                    <span className="font-mono">- रु 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>13% VAT (कर):</span>
                    <span className="font-mono">रु 5,200.00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-300 font-extrabold text-slate-900 text-sm">
                    <span>Grand Total:</span>
                    <span className="font-mono text-emerald-700">रु 45,200.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE FEATURES SHOWCASE */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Engineered for Nepali Commerce
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything Your Business Needs to Bill Smarter
            </p>
            <p className="text-base text-slate-600">
              From small retail counters to nationwide wholesale and IT service exporters, QuickBill Nepal eliminates manual paperwork and accelerates customer payments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Instant Fonepay & eSewa QR
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Embed dynamic payment QR codes with exact bill totals or upload your shop’s physical counter QR stand. Customers pay directly via mobile banking without transaction fees.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                IRD Rule 23 Tax Invoicing
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Standardized for Inland Revenue Department (आन्तरिक राजस्व विभाग) requirements. Accurate 13% VAT calculations, formal fiscal numbers (QB-2081-XXXX), and bilingual labels.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Cross-Device Cloud Sync
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Never lose your client lists, custom logos, or invoice history. Log in from your mobile phone, counter tablet, or home laptop with all your business data immediately synced.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Client Address Directory
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Save customer names, PAN numbers, WhatsApp contacts, and addresses once. Auto-fill buyer details in 1 click for future bills with complete cloud persistence.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Multi-Currency & Flat/% Discounts
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Invoice in रु NPR, $ USD, ₹ INR, € EUR, or £ GBP with dynamic currency formatting. Switch seamlessly between Flat cash discounts and Percentage (%) discounts.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                1-Click WhatsApp & Print Ready
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Send professional payment reminders directly to your client’s WhatsApp with pre-filled invoice breakdowns, or print crisp, borderless A4 bills in a single keystroke.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MULTI-DEVICE CLOUD SYNC SHOWCASE */}
      <section id="cloud-sync" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Zero Data Loss Across Devices</span>
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Your Invoices, Clients & Payments. <br />
                <span className="text-emerald-400">Available Anywhere.</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Whether you’re at your shop billing from a desktop computer, traveling and checking balances on your smartphone, or working from home on a laptop — QuickBill Nepal keeps your entire account synchronized in real-time.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Smartphone className="w-5 h-5" />
                    <span>Mobile Ready</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Optimized for mobile browsers. Create invoices on the go and send WhatsApp payment links directly from your pocket.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                    <Laptop className="w-5 h-5" />
                    <span>Desktop Counter</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Instant keyboard shortcuts, A4 full-sheet paper previews, and high-speed receipt printing for store counters.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/billing"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <span>Launch Cloud Billing Tool</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {!user && (
                  <button
                    onClick={() => handleOpenAuth('signup')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-sm transition-all"
                  >
                    <span>Sign Up with @username</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Card: Sync Diagram */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              <h3 className="text-base font-bold text-white flex items-center justify-between border-b border-slate-700 pb-3">
                <span>Cloud Synchronization Status</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Active
                </span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <Building2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-200">Business Profile & Logos</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Your PAN/VAT number, registered address, custom shop logo, and contact info stay pre-loaded.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <QrCode className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-200">Fonepay & Bank QR Stands</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Physical counter QR image and bank account configurations sync automatically.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <Users className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-200">Saved Customer Book</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Customer directory accessible from any device for 1-click invoice generation.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Simple 3-Step Workflow
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From Blank Screen to Paid in 60 Seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">
                1
              </span>
              <h3 className="text-base font-bold text-slate-900">Enter Seller & Payment QR</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Input your Business Name, PAN, and contact details. Set up your Fonepay QR or bank details. Click "Save as Default" to never type them again.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">
                2
              </span>
              <h3 className="text-base font-bold text-slate-900">Add Purchaser & Line Items</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pick a saved client from your cloud directory, add item descriptions, quantities, and rates. The engine automatically computes totals, discounts, and 13% VAT.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">
                3
              </span>
              <h3 className="text-base font-bold text-slate-900">Print or Send via WhatsApp</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Print crisp A4 tax invoices or send a 1-click WhatsApp message with payment details. Your client scans the QR code and pays straight to your bank!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING & PRO SECTION */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Simple, Transparent Pricing
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Start Free. Upgrade for Pro Cloud Power.
            </p>
            <p className="text-sm text-slate-600">
              No hidden fees. Free forever for essential billing, or upgrade to Pro for high-volume businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Free Plan */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Free Tier</h3>
                    <p className="text-xs text-slate-500">Perfect for startups and small counters</p>
                  </div>
                  <span className="text-2xl font-black text-slate-900">रु ०</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unlimited IRD Rule 23 Tax Invoices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Embedded Fonepay & eSewa QR Codes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Automatic Decimal to Words Conversion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1-Click WhatsApp Sharing & A4 Print</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Local History & Draft Persistence</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/billing"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-all block"
              >
                Use Free Billing Tool
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="rounded-2xl border-2 border-emerald-500 bg-white p-6 sm:p-8 flex flex-col justify-between space-y-6 relative shadow-xl shadow-emerald-500/10">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                Recommended
              </div>

              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                      <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <span>Pro Business</span>
                    </h3>
                    <p className="text-xs text-slate-500">For active shops, agencies & wholesalers</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-600">रु १९९</span>
                    <span className="text-xs text-slate-400 block font-normal">/ month</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2 font-semibold text-slate-900">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Everything in Free, plus:</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unlimited Cloud Invoices & Cross-Device Sync</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Custom Shop Counter QR Stand Backup</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cloud-Synced Client Directory Book</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% Ad-Free Clean Interface</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Multi-Currency (USD, INR, EUR, GBP)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Priority IRD Tax Updates & Audit Export</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setIsProOpen(true)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs text-center shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Upgrade to Pro Now</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Got Questions?
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-emerald-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-slate-400 font-mono text-base shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. BOTTOM FINAL CALL TO ACTION */}
      <section className="py-16 bg-emerald-600 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Modernize Your Invoicing in Nepal?
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto">
            Join thousands of Nepali shopkeepers, freelancers, and businesses who issue clean, IRD-aligned invoices with Fonepay QR in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/billing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 active:scale-95 text-emerald-800 font-extrabold text-sm shadow-xl transition-all"
            >
              <span>🚀 Open Billing Generator Free</span>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </Link>

            {!user && (
              <button
                onClick={() => handleOpenAuth('signup')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 border border-emerald-400 text-white font-bold text-sm transition-all"
              >
                <span>Create Business Account</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 10. COMPREHENSIVE FOOTER */}
      <Footer />

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
      />

      {/* PRO UPGRADE MODAL */}
      <ProUpgradeModal
        isOpen={isProOpen}
        onClose={() => setIsProOpen(false)}
      />
    </div>
  );
}
