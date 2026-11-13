'use client';

import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, Sparkles, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { NotificationItem } from '@/lib/db';

interface NotificationFeedProps {
  onOpenAdmin?: () => void;
}

export const NotificationFeed: React.FC<NotificationFeedProps> = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tickerDismissed, setTickerDismissed] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) {
          setNotifications(data.notifications);
        }
      })
      .catch((err) => console.warn('Failed to load notices', err));

    try {
      const stored = localStorage.getItem('quickbill_read_notifs');
      if (stored) {
        setReadIds(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const markAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    try {
      localStorage.setItem('quickbill_read_notifs', JSON.stringify(allIds));
    } catch (e) {}
  };

  const currentNotice = notifications[0];

  return (
    <>
      {/* 1. TOP NEWS TICKER (For critical IRD Tax & App updates) */}
      {!tickerDismissed && currentNotice && (
        <div className="no-print bg-slate-900 border-b border-slate-800 text-white px-4 py-2 text-xs flex items-center justify-between transition-all">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                currentNotice.type === 'tax'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : currentNotice.type === 'alert'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {currentNotice.type === 'tax' ? 'IRD Compliance Alert' : 'Announcement'}
            </span>

            <p className="truncate text-slate-200">
              <strong className="text-white font-medium mr-1.5">{currentNotice.title}:</strong>
              {currentNotice.message}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0 ml-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTickerDismissed(true)}
              className="p-1 text-slate-400 hover:text-slate-200 rounded"
              title="Dismiss announcement banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. SLIDE-OUT NOTIFICATIONS DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Nepal Tax &amp; Business Feed</h3>
                  <p className="text-xs text-slate-500">Official IRD advisories, billing updates &amp; alerts</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Info className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-medium text-slate-600">No active notices</p>
                  <p className="text-xs text-slate-400 mt-1">You are all caught up with official Nepal tax updates.</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      item.type === 'tax'
                        ? 'border-amber-200 bg-amber-50/50'
                        : item.type === 'alert'
                        ? 'border-rose-200 bg-rose-50/50'
                        : 'border-slate-200 bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          item.type === 'tax'
                            ? 'bg-amber-100 text-amber-800'
                            : item.type === 'alert'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
              <span>Source: Official IRD Nepal &amp; QuickBill Admin</span>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  window.location.href = '/admin';
                }}
                className="text-emerald-700 font-semibold hover:underline"
              >
                Admin Portal Login →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const NotificationBellButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) {
          const stored = localStorage.getItem('quickbill_read_notifs');
          const readIds: string[] = stored ? JSON.parse(stored) : [];
          const count = data.notifications.filter((n: any) => !readIds.includes(n.id)).length;
          setUnread(count);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
      title="View Announcements & IRD Tax Alerts"
    >
      <Bell className="w-4 h-4" />
      {unread > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
      )}
    </button>
  );
};
