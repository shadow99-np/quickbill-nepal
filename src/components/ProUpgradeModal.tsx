'use client';

import React, { useState } from 'react';
import { X, Crown, Check, Zap, ShieldCheck, Sparkles, Smartphone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatNPR } from '@/utils/numberToWords';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  if (!isOpen) return null;

  const proFeatures = [
    '🚫 100% Ad-Free Billing (No AdSense banners for you or clients)',
    '☁️ Multi-Device Cloud Sync (Switch seamlessly between Phone, Tablet & Laptop)',
    '⚡ Unlimited Items & Services Catalog (Save all your standard rates)',
    '📑 Monthly Automated IRD Sales Book (बिक्री खाता) CSV & Tax Reconciliation',
    '💬 1-Click WhatsApp Invoice Dispatch with Custom Message Templates',
    '👑 Priority 24/7 Nepali Business Support'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Hero */}
        <div className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Crown className="w-4 h-4 fill-current" />
            <span>QuickBill Nepal Pro</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Supercharge Your Business
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Built for serious Nepali freelancers, agencies, tutors, and merchants
          </p>

          {/* Pricing Toggle */}
          <div className="mt-5 inline-flex p-1 rounded-xl bg-white/10 border border-white/15">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                billingCycle === 'monthly' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Monthly (रु. १९९)
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Yearly (रु. १,९९९)</span>
              <span className="text-[10px] bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded font-extrabold">SAVE 16%</span>
            </button>
          </div>
        </div>

        {/* Features List */}
        <div className="p-6 space-y-4">
          <div className="space-y-2.5">
            {proFeatures.map((feat, i) => (
              <div key={i} className="flex items-start space-x-2.5 text-xs text-slate-700">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  ✓
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Payment Instructions Drawer */}
          {showPaymentInfo ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 animate-in fade-in">
              <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>Pay via eSewa or Fonepay</span>
              </h3>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Send <strong>रु. {billingCycle === 'yearly' ? '1,999' : '199'}</strong> to eSewa ID:
                <br />
                <span className="font-mono font-bold text-sm text-slate-900 bg-white px-2 py-0.5 rounded border border-emerald-300 inline-block mt-1">
                  9801234567
                </span>
                <span className="text-[11px] text-slate-600 block mt-1">
                  Remarks: <strong>{user?.email || 'Your Email'} - Pro</strong>
                </span>
              </p>
              <p className="text-[11px] text-slate-500">
                Once paid, your account is activated instantly by admin. You can also contact support on WhatsApp.
              </p>
            </div>
          ) : (
            <button
              onClick={() => setShowPaymentInfo(true)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Subscribe to QuickBill Pro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <p className="text-center text-[11px] text-slate-400">
            Cancel anytime • 100% Satisfaction Guarantee
          </p>
        </div>
      </div>
    </div>
  );
};
