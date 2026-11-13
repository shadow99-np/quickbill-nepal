'use client';

import React, { useState } from 'react';
import { X, Crown, Check, Zap, ShieldCheck, Sparkles, Smartphone, ArrowRight, Copy, MessageCircle } from 'lucide-react';
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
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const proFeatures = [
    '🚫 100% Ad-Free Billing (No AdSense banners for you or clients)',
    '☁️ Multi-Device Cloud Sync (Switch seamlessly between Phone, Tablet & Laptop)',
    '⚡ Unlimited Items & Services Catalog (Save all your standard rates)',
    '📑 Monthly Automated IRD Sales Book (बिक्री खाता) CSV & Tax Reconciliation',
    '💬 1-Click WhatsApp Invoice Dispatch with Custom Message Templates',
    '👑 Priority 24/7 Nepali Business Support'
  ];

  const amountNpr = billingCycle === 'yearly' ? '1,999' : '199';
  const remarksText = `${user?.email || user?.username || 'quickbill'} - pro`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header Hero */}
        <div className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-5 sm:p-7 shrink-0">
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
          <div className="mt-4 inline-flex p-1 rounded-xl bg-white/10 border border-white/15">
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {!showPaymentInfo ? (
            <>
              {/* Features List */}
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

              <button
                onClick={() => setShowPaymentInfo(true)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Subscribe to QuickBill Pro (रु. {amountNpr})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Payment with Pushkar Nepal eSewa QR */
            <div className="space-y-3 animate-in fade-in">
              <div className="flex flex-col items-center bg-emerald-50/60 p-4 rounded-2xl border-2 border-emerald-400/80 shadow-xs">
                {/* Merchant Badge */}
                <div className="flex items-center justify-between w-full mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#60BB46] flex items-center justify-center text-white text-xs font-extrabold shadow-xs">
                      e
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 block leading-tight">Pushkar Nepal</span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> eSewa Verified
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
                    रु. {amountNpr}
                  </span>
                </div>

                {/* Real eSewa QR Code Image */}
                <div className="p-2.5 bg-white rounded-2xl border border-emerald-200 shadow-md">
                  <img
                    src="/images/esewa_pro_qr.jpg"
                    alt="eSewa QR Code - Pushkar Nepal"
                    className="w-44 h-44 sm:w-52 sm:h-52 object-contain rounded-xl"
                  />
                </div>

                <p className="text-[11px] text-slate-600 mt-2 font-medium text-center">
                  Scan this QR code using your <strong>eSewa app</strong> to upgrade instantly
                </p>

                {/* eSewa Mobile ID Row with Copy */}
                <div className="w-full mt-3 p-2.5 bg-white rounded-xl border border-emerald-200 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">eSewa Mobile Number</span>
                    <span className="font-mono font-bold text-sm text-slate-900 tracking-wide">9761033755</span>
                  </div>
                  <button
                    onClick={() => handleCopy('9761033755', 'id')}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    {copiedField === 'id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'id' ? 'Copied!' : 'Copy ID'}</span>
                  </button>
                </div>

                {/* Remarks Row with Copy */}
                <div className="w-full mt-2 p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] text-amber-800 uppercase font-bold tracking-wider block">Required Remarks</span>
                    <span className="font-mono text-xs font-semibold text-amber-950 truncate block">
                      {remarksText}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(remarksText, 'remarks')}
                    className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    {copiedField === 'remarks' ? <Check className="w-3.5 h-3.5 text-amber-800" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'remarks' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                {/* WhatsApp Instant Activation Button */}
                <a
                  href={`https://wa.me/9779761033755?text=${encodeURIComponent(
                    `Hello Pushkar, I have completed the payment of NPR ${amountNpr} via eSewa for QuickBill Nepal Pro subscription.\n\nAccount: ${user?.email || user?.username || 'Guest'}\nMobile: 9761033755\nPlease activate Pro for my account.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-3 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Send Screenshot on WhatsApp (9761033755)</span>
                </a>

                <button
                  onClick={() => setShowPaymentInfo(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold mt-2.5 transition-colors"
                >
                  ← Back to features
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-[11px] text-slate-400">
            Instant activation • Cancel anytime • 100% Nepali Business Guarantee
          </p>
        </div>
      </div>
    </div>
  );
};
