'use client';

import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface GoogleAdProps {
  slot?: string;
  client?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

export const GoogleAd: React.FC<GoogleAdProps> = ({
  slot = '1234567890',
  client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
  format = 'auto',
  className = ''
}) => {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (!client || client === 'ca-pub-0000000000000000') {
      return;
    }

    try {
      // Ensure Google AdSense script is loaded
      const existingScript = document.querySelector(
        `script[src*="googlesyndication.com/pagead/js/adsbygoogle.js"]`
      );

      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Push ad
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setAdLoaded(true);
    } catch (err) {
      console.warn('AdSense push failed', err);
    }
  }, [client, slot]);

  // If live AdSense Client ID is configured
  if (client && client !== 'ca-pub-0000000000000000') {
    return (
      <div className={`google-ad-container no-print overflow-hidden text-center my-4 ${className}`}>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
          Advertisement
        </span>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Fallback state while AdSense is pending review / approval
  return null;
};
