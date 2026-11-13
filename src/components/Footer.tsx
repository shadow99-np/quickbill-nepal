'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Heart, FileText, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="no-print bg-white border-t border-slate-200 mt-16 pt-12 pb-10 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                QuickBill <span className="text-emerald-600">Nepal</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nepal’s fastest, privacy-first invoice maker. Designed for freelancers, tutors, photographers, and small businesses to bill clients with instant Fonepay &amp; eSewa QR codes.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Client-Side • Zero Data Stored on Server</span>
            </div>
          </div>

          {/* Quick Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-600 transition-colors">
                  IRD Rule 23 Tax Invoice Maker
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-emerald-600 transition-colors">
                  Fonepay &amp; eSewa Dynamic QR
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-emerald-600 transition-colors">
                  Nepali BS Date &amp; Lakhs/Crores Formatter
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-emerald-600 transition-colors">
                  IRD Sales Book (बिक्री खाता) CSV Export
                </Link>
              </li>
            </ul>
          </div>

          {/* Regulatory & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Nepal Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://ird.gov.np"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 transition-colors inline-flex items-center gap-1"
                >
                  <span>Inland Revenue Dept (IRD)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <span className="text-slate-400">VAT Act 2052 &amp; Rule 23 Format</span>
              </li>
              <li>
                <span className="text-slate-400">Fonepay Merchant Network</span>
              </li>
              <li>
                <span className="text-slate-400">eSewa &amp; Khalti QR Rails</span>
              </li>
            </ul>
          </div>

          {/* Legal & AdSense Requirements */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Legal &amp; Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-emerald-600 transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-600 transition-colors font-medium">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-600 transition-colors font-medium">
                  About Us &amp; Contact
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Version 1.2 (Active Production)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>
            © {new Date().getFullYear()} QuickBill Nepal. Built with pride for Nepali entrepreneurs.
          </p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> in Kathmandu, Nepal
          </p>
        </div>
      </div>
    </footer>
  );
};
