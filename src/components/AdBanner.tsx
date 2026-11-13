'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GoogleAd } from './GoogleAd';

interface AdBannerProps {
  className?: string;
  onOpenPro?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ className = '', onOpenPro }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<{
    adsenseClientId: string;
    adsenseSlotId: string;
    adsEnabled: boolean;
  } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  // Pro users get 100% ad-free experience
  if (user?.isPro) {
    return null;
  }

  // If admin turned off ads
  if (settings && !settings.adsEnabled) {
    return null;
  }

  const clientId = settings?.adsenseClientId || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slotId = settings?.adsenseSlotId || '1234567890';

  return (
    <div className={`ad-banner-section no-print w-full my-4 ${className}`}>
      {clientId ? (
        <GoogleAd client={clientId} slot={slotId} />
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-3.5 text-center flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Google AdSense Monetization Slot
            </span>
            <p className="text-xs font-semibold text-slate-700">
              Ready to display Google ads. Enter your Publisher ID in the{' '}
              <a href="/admin" className="text-emerald-700 underline font-bold">
                Admin Portal
              </a>{' '}
              to start earning.
            </p>
          </div>

          {onOpenPro && (
            <button
              onClick={onOpenPro}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors shrink-0"
            >
              ★ Upgrade to Pro (Remove Ads)
            </button>
          )}
        </div>
      )}
    </div>
  );
};
