'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Users,
  FileText,
  DollarSign,
  Bell,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Loader2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Settings,
  Crown,
  Eye,
  Save,
  Check
} from 'lucide-react';
import { formatNPR } from '@/utils/numberToWords';
import { NotificationItem } from '@/lib/db';

export default function AdminPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'notices' | 'adsense' | 'users'>('overview');

  // Admin Data State
  const [stats, setStats] = useState<any>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isAddingNotice, setIsAddingNotice] = useState(false);

  // New Notice Form
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [noticeType, setNoticeType] = useState<'tax' | 'alert' | 'update' | 'info'>('tax');
  const [isSavingNotice, setIsSavingNotice] = useState(false);

  // Settings State
  const [adsenseClientId, setAdsenseClientId] = useState('');
  const [adsenseSlotId, setAdsenseSlotId] = useState('');
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [proMonthly, setProMonthly] = useState(199);
  const [proYearly, setProYearly] = useState(1999);
  const [adminEsewa, setAdminEsewa] = useState('9801234567');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Pro Granting by Identifier State
  const [grantIdentifier, setGrantIdentifier] = useState('');
  const [grantDuration, setGrantDuration] = useState('12');
  const [isGrantingPro, setIsGrantingPro] = useState(false);
  const [grantSuccessMsg, setGrantSuccessMsg] = useState<string | null>(null);
  const [grantErrorMsg, setGrantErrorMsg] = useState<string | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('quickbill_admin_token');
    if (saved) {
      setAdminToken(saved);
      loadAdminData(saved);
    }
  }, []);

  const loadAdminData = async (token: string) => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.stats) {
        setIsAdminLoggedIn(true);
        setStats(data.stats);
        setNotifications(data.stats.notifications || []);
        if (data.stats.settings) {
          setAdsenseClientId(data.stats.settings.adsenseClientId || '');
          setAdsenseSlotId(data.stats.settings.adsenseSlotId || '');
          setAdsEnabled(data.stats.settings.adsEnabled !== false);
          setProMonthly(data.stats.settings.proPriceMonthlyNpr || 199);
          setProYearly(data.stats.settings.proPriceYearlyNpr || 1999);
          setAdminEsewa(data.stats.settings.adminEsewaId || '9801234567');
        }
      } else {
        localStorage.removeItem('quickbill_admin_token');
        setIsAdminLoggedIn(false);
      }
    } catch (e) {
      setIsAdminLoggedIn(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      setIsLoggingIn(false);

      if (data.success && data.token) {
        localStorage.setItem('quickbill_admin_token', data.token);
        setAdminToken(data.token);
        loadAdminData(data.token);
      } else {
        setLoginError(data.error || 'Invalid admin password');
      }
    } catch (err) {
      setIsLoggingIn(false);
      setLoginError('Network error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    setIsSavingSettings(true);
    setSettingsSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          adsenseClientId,
          adsenseSlotId,
          adsEnabled,
          proPriceMonthlyNpr: Number(proMonthly),
          proPriceYearlyNpr: Number(proYearly),
          adminEsewaId: adminEsewa,
        }),
      });

      const data = await res.json();
      setIsSavingSettings(false);
      if (data.success) {
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      } else {
        alert(data.error || 'Failed to update settings');
      }
    } catch (err) {
      setIsSavingSettings(false);
      alert('Error updating settings');
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeMessage || !adminToken) return;

    setIsSavingNotice(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title: noticeTitle,
          message: noticeMessage,
          type: noticeType,
          active: true,
        }),
      });

      const data = await res.json();
      setIsSavingNotice(false);

      if (data.success && data.notice) {
        setNotifications([data.notice, ...notifications]);
        setNoticeTitle('');
        setNoticeMessage('');
        setIsAddingNotice(false);
        alert('Notification broadcasted live to all users!');
      } else {
        alert(data.error || 'Failed to create notice');
      }
    } catch (err) {
      setIsSavingNotice(false);
      alert('Error saving notice');
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!adminToken || !confirm('Delete this notice?')) return;
    try {
      await fetch(`/api/admin/notifications?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleToggleNotice = async (id: string, active: boolean) => {
    if (!adminToken) return;
    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ id, active }),
      });
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, active } : n))
      );
    } catch (err) {
      alert('Toggle failed');
    }
  };

  const handleToggleUserPro = async (userId: string, currentPro: boolean) => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ userId, isPro: !currentPro }),
      });
      const data = await res.json();
      if (data.success) {
        setStats({
          ...stats,
          users: stats.users.map((u: any) =>
            u.id === userId ? { ...u, isPro: !currentPro } : u
          ),
          totalPro: stats.totalPro + (!currentPro ? 1 : -1),
        });
      } else {
        alert(data.error || 'Failed to toggle Pro');
      }
    } catch (err) {
      alert('Toggle failed');
    }
  };

  const handleGrantProByIdentifier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !grantIdentifier.trim()) return;
    setIsGrantingPro(true);
    setGrantSuccessMsg(null);
    setGrantErrorMsg(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          identifier: grantIdentifier.trim(),
          durationMonths: Number(grantDuration),
        }),
      });

      const data = await res.json();
      setIsGrantingPro(false);

      if (data.success && data.user) {
        setGrantSuccessMsg(data.message || `Pro successfully activated for ${data.user.email}!`);
        setGrantIdentifier('');
        loadAdminData(adminToken);
        setTimeout(() => setGrantSuccessMsg(null), 6000);
      } else {
        setGrantErrorMsg(data.error || 'Failed to activate Pro');
      }
    } catch (err) {
      setIsGrantingPro(false);
      setGrantErrorMsg('Network error while granting Pro');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('quickbill_admin_token');
    setIsAdminLoggedIn(false);
    setAdminToken(null);
  };

  // LOGIN SCREEN
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">QuickBill Admin Portal</h1>
            <p className="text-xs text-slate-400">
              Manage website broadcasts, businesses, and platform analytics
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Admin Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password (default: admin777)"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 rounded-lg border border-slate-700 text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Access Admin Console</span>}
            </button>
          </form>

          <div className="text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">
              ← Return to QuickBill Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm font-bold text-sm">
            QB
          </div>
          <span className="font-bold text-base text-white">
            QuickBill Nepal <span className="text-emerald-400 font-mono text-xs ml-1 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">MASTER ADMIN</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <div className="bg-slate-900/50 border-b border-slate-800 px-6">
        <div className="max-w-7xl mx-auto flex space-x-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Overview &amp; Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'notices'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notification Feed Broadcasts</span>
          </button>

          <button
            onClick={() => setActiveTab('adsense')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'adsense'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>AdSense &amp; Monetization</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Businesses &amp; Pro Access</span>
          </button>
        </div>
      </div>

      {/* Main Admin View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs uppercase font-bold tracking-wider">Registered Businesses</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold font-mono text-white">{stats?.totalUsers || 0}</p>
                <p className="text-[11px] text-slate-500">Active merchant accounts</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs uppercase font-bold tracking-wider">Pro Subscribers</span>
                  <Crown className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold font-mono text-amber-400">{stats?.totalPro || 0}</p>
                <p className="text-[11px] text-slate-500">Paying Pro businesses</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs uppercase font-bold tracking-wider">Total Invoices</span>
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-2xl font-bold font-mono text-white">{stats?.totalInvoices || 0}</p>
                <p className="text-[11px] text-slate-500">Generated across Nepal</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs uppercase font-bold tracking-wider">Total Volume Tracked</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 truncate">
                  NPR {formatNPR(stats?.totalBilled || 0)}
                </p>
                <p className="text-[11px] text-slate-500">Gross billing transactions</p>
              </div>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Quick Actions for Owner</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setActiveTab('adsense')}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-left border border-slate-700 transition-colors"
                >
                  <p className="text-xs font-bold text-white">💰 Configure AdSense</p>
                  <p className="text-[11px] text-slate-400">Paste your Publisher ID to start earning</p>
                </button>
                <button
                  onClick={() => setActiveTab('notices')}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-left border border-slate-700 transition-colors"
                >
                  <p className="text-xs font-bold text-white">📢 Broadcast Notice</p>
                  <p className="text-[11px] text-slate-400">Post news &amp; tax alerts to user feed</p>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-left border border-slate-700 transition-colors"
                >
                  <p className="text-xs font-bold text-white">👑 Manage Pro Users</p>
                  <p className="text-[11px] text-slate-400">Activate Pro subscriptions for customers</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NOTIFICATIONS FEED BROADCAST */}
        {activeTab === 'notices' && (
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-emerald-400" />
                  <span>Live Notification Feed &amp; IRD Ticker Manager</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Broadcast announcements, tax filing deadlines, and feature updates instantly to all users
                </p>
              </div>

              <button
                onClick={() => setIsAddingNotice(!isAddingNotice)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingNotice ? 'Cancel' : '+ Broadcast New Notice'}</span>
              </button>
            </div>

            {/* New Notice Creator */}
            {isAddingNotice && (
              <form onSubmit={handleCreateNotice} className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Notice Headline *
                    </label>
                    <input
                      type="text"
                      required
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      placeholder="e.g. 🇳🇵 IRD Alert: VAT return deadline 25th of month"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Notice Category
                    </label>
                    <select
                      value={noticeType}
                      onChange={(e: any) => setNoticeType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="tax">Tax / IRD Compliance Alert</option>
                      <option value="alert">Critical Announcement</option>
                      <option value="update">Feature Update</option>
                      <option value="info">General Info</option>
                    </select>
                  </div>

                  <div className="sm:col-span-12">
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Full Advisory Message *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={noticeMessage}
                      onChange={(e) => setNoticeMessage(e.target.value)}
                      placeholder="Provide full instructions or explanation for Nepali businesses..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingNotice}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                  >
                    {isSavingNotice ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>Publish Notice Immediately</span>
                  </button>
                </div>
              </form>
            )}

            {/* Active Notices List */}
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No broadcasts registered yet.</p>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            item.type === 'tax'
                              ? 'bg-amber-500/20 text-amber-300'
                              : item.type === 'alert'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {item.type}
                        </span>
                        <h4 className="font-bold text-white text-sm">{item.title}</h4>
                        {!item.active && (
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                            Inactive (Hidden)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{item.message}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleToggleNotice(item.id, !item.active)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          item.active
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.active ? 'Live on Ticker' : 'Draft / Off'}
                      </button>
                      <button
                        onClick={() => handleDeleteNotice(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* TAB 3: ADSENSE & MONETIZATION SETTINGS */}
        {activeTab === 'adsense' && (
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-400" />
                <span>Google AdSense &amp; Monetization Settings</span>
              </h2>
              <p className="text-xs text-slate-400">
                Paste your official Google AdSense IDs here to start serving live ads and generating revenue
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
              {settingsSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Monetization settings saved and active immediately!</span>
                </div>
              )}

              {/* Master AdSense Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white">Enable Google AdSense Ads</h4>
                  <p className="text-xs text-slate-400">
                    Show AdSense banners to non-Pro free users
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={adsEnabled}
                  onChange={(e) => setAdsEnabled(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Google AdSense Publisher Client ID (ca-pub-XXXXXXXXXXXXXXXX)
                </label>
                <input
                  type="text"
                  value={adsenseClientId}
                  onChange={(e) => setAdsenseClientId(e.target.value)}
                  placeholder="e.g. ca-pub-1234567890123456"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Find this in your Google AdSense Dashboard under <strong>Account → Account Information → Publisher ID</strong>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Default Ad Slot ID
                </label>
                <input
                  type="text"
                  value={adsenseSlotId}
                  onChange={(e) => setAdsenseSlotId(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Pro Subscription Pricing */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Crown className="w-4 h-4" />
                  <span>Pro Subscription Pricing &amp; Payment Gateway</span>
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Monthly Pro (NPR रु.)</label>
                    <input
                      type="number"
                      value={proMonthly}
                      onChange={(e) => setProMonthly(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Yearly Pro (NPR रु.)</label>
                    <input
                      type="number"
                      value={proYearly}
                      onChange={(e) => setProYearly(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Admin eSewa Mobile ID (for payments)</label>
                  <input
                    type="text"
                    value={adminEsewa}
                    onChange={(e) => setAdminEsewa(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                {isSavingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save All Monetization Settings</span>
              </button>
            </form>
          </section>
        )}

        {/* TAB 4: BUSINESSES & PRO MANAGEMENT */}
        {activeTab === 'users' && (
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="pb-3 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>Registered Businesses &amp; Pro Access Control</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Search accounts, grant Pro memberships by username/email, and verify merchant records
                </p>
              </div>
            </div>

            {/* Quick Pro Activation by Identifier Card */}
            <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Grant Pro Subscription by Username or Email</h3>
                    <p className="text-[11px] text-slate-400">
                      Instantly activate ad-free Pro access for a customer using their login email, username, or business name
                    </p>
                  </div>
                </div>
              </div>

              {grantSuccessMsg && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{grantSuccessMsg}</span>
                </div>
              )}

              {grantErrorMsg && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{grantErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleGrantProByIdentifier} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-6">
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                    User Email, Username, or Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={grantIdentifier}
                    onChange={(e) => setGrantIdentifier(e.target.value)}
                    placeholder="e.g. himalaya@studio.np or himalayan_studio"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                    Plan Duration
                  </label>
                  <select
                    value={grantDuration}
                    onChange={(e) => setGrantDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-semibold focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="1">1 Month (रु. 199)</option>
                    <option value="3">3 Months (रु. 549)</option>
                    <option value="6">6 Months (रु. 999)</option>
                    <option value="12">1 Year (रु. 1,999)</option>
                    <option value="0">Lifetime Pro (Forever)</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    disabled={isGrantingPro}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    {isGrantingPro ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Crown className="w-3.5 h-3.5 fill-slate-950" />
                    )}
                    <span>Activate Pro Access</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Search Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <input
                type="text"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                placeholder="Search registered businesses by name, username, email, or PAN..."
                className="w-full sm:max-w-md px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-400 font-mono">
                {stats?.users
                  ? `Showing ${(stats.users || []).filter((u: any) =>
                      u.businessName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                      u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                      u.username?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                      u.pan?.includes(userSearchTerm)
                    ).length} of ${stats.users.length} accounts`
                  : ''}
              </span>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Business Entity</th>
                    <th className="py-2.5 px-4 font-semibold">Username / Email</th>
                    <th className="py-2.5 px-4 font-semibold">PAN</th>
                    <th className="py-2.5 px-4 font-semibold">Cloud Data</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Pro Status</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
                  {stats?.users && stats.users.length > 0 ? (
                    (stats.users || [])
                      .filter((u: any) =>
                        u.businessName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                        u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                        u.username?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                        u.pan?.includes(userSearchTerm)
                      )
                      .map((u: any) => (
                        <tr key={u.id} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-4">
                            <span className="font-bold font-sans text-white block">{u.businessName}</span>
                            {u.phone && <span className="text-[10px] text-slate-400 font-mono">Ph: {u.phone}</span>}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="text-amber-400/90 font-mono text-[11px] block">@{u.username || u.email.split('@')[0]}</span>
                            <span className="text-[10px] text-slate-400 font-sans">{u.email}</span>
                          </td>
                          <td className="py-2.5 px-4 text-emerald-400">{u.pan || '—'}</td>
                          <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                            <span>{u.invoicesCount || 0} bills</span>
                            {u.clientsCount > 0 && <span className="ml-1 text-slate-500">• {u.clientsCount} clients</span>}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            {u.isPro ? (
                              <div className="inline-flex flex-col items-center">
                                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase border border-amber-500/30">
                                  ★ PRO
                                </span>
                                {u.proExpiresAt && (
                                  <span className="text-[9px] text-amber-400/70 mt-0.5 font-mono">
                                    till {u.proExpiresAt.split('T')[0]}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                                Free
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => handleToggleUserPro(u.id, u.isPro)}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                                u.isPro
                                  ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              }`}
                            >
                              {u.isPro ? 'Revoke Pro' : 'Grant Pro'}
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">
                        No customer businesses registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
