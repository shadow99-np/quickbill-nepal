'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  Printer,
  Download,
  Share2,
  Save,
  RotateCcw,
  CheckCircle2,
  FileText,
  User,
  LogOut,
  Package,
  BarChart3,
  Bell,
  ChevronDown,
  Building2,
  Crown,
  Home as HomeIcon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { NotificationBellButton } from './NotificationFeed';

interface NavbarProps {
  invoiceNumber: string;
  onPrint: () => void;
  onSave: () => void;
  onReset: () => void;
  onOpenWhatsApp: () => void;
  onOpenHistory: () => void;
  onOpenAuth: () => void;
  onOpenCatalog: () => void;
  onOpenStatements: () => void;
  onOpenNotifications: () => void;
  onOpenPro?: () => void;
  historyCount?: number;
  isSaved?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  invoiceNumber,
  onPrint,
  onSave,
  onReset,
  onOpenWhatsApp,
  onOpenHistory,
  onOpenAuth,
  onOpenCatalog,
  onOpenStatements,
  onOpenNotifications,
  onOpenPro,
  historyCount = 0,
  isSaved = true
}) => {
  const { user, logout } = useAuth();
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  return (
    <header className="no-print flex justify-between items-center w-full px-3 sm:px-6 lg:px-8 h-16 sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Left: Brand & Document Status Cluster */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-600 group-hover:bg-emerald-700 flex items-center justify-center text-white shadow-sm shrink-0 transition-colors">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          </div>
          <span className="text-base sm:text-xl font-bold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
            QuickBill <span className="text-emerald-600">Nepal</span>
          </span>
        </Link>

        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-colors"
          title="Return to Website Home Page"
        >
          <HomeIcon className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>

        <div className="h-5 w-[1px] bg-slate-200 hidden md:block"></div>

        {/* Live Auto-Save Pill */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-medium text-emerald-800">
            {isSaved ? 'Auto-saved' : 'Saving...'}
          </span>
        </div>

        {/* Tax Invoice Reference */}
        <div className="hidden lg:flex items-center space-x-1 text-slate-700">
          <span className="text-xs font-semibold text-slate-500 uppercase">Invoice:</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-900 font-bold border border-slate-200">
            #{invoiceNumber}
          </span>
        </div>
      </div>

      {/* Right: Actions, Business Tools, Auth */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Notification Bell */}
        <NotificationBellButton onClick={onOpenNotifications} />

        {/* Business Tools Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            title="Business Tools (Catalog & Statements)"
          >
            <span>Tools</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {isToolsOpen && (
            <div
              className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in duration-100"
              onClick={() => setIsToolsOpen(false)}
            >
              <button
                onClick={onOpenCatalog}
                className="w-full text-left px-3.5 py-2 hover:bg-emerald-50 flex items-center space-x-2 text-slate-700 hover:text-emerald-800"
              >
                <Package className="w-4 h-4 text-emerald-600" />
                <span>Items Catalog (मूल्य सूची)</span>
              </button>
              <button
                onClick={onOpenStatements}
                className="w-full text-left px-3.5 py-2 hover:bg-emerald-50 flex items-center space-x-2 text-slate-700 hover:text-emerald-800"
              >
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Statements &amp; Ledger (लेखा)</span>
              </button>
            </div>
          )}
        </div>

        {/* Invoice History Drawer Button */}
        <button
          onClick={onOpenHistory}
          className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-800 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 shadow-2xs"
          title="Open Saved Invoices History & Records"
        >
          <FileText className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Invoices</span>
          {historyCount > 0 && (
            <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded-full text-[10px] font-bold">
              {historyCount}
            </span>
          )}
        </button>

        {/* Print Icon Button */}
        <button
          onClick={onPrint}
          className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 shadow-xs transition-colors"
          title="Print Invoice"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span className="hidden md:inline">Print</span>
        </button>

        {/* Send via WhatsApp Action */}
        <button
          onClick={onOpenWhatsApp}
          className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 font-semibold text-xs rounded-lg transition-all"
        >
          <Share2 className="w-3.5 h-3.5 text-[#25D366]" />
          <span className="hidden md:inline">WhatsApp</span>
        </button>

        {/* Primary Action: Download PDF */}
        <button
          onClick={onPrint}
          className="inline-flex items-center space-x-1 sm:space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download PDF</span>
        </button>

        {/* Auth / Account Profile Button */}
        {user ? (
          <div className="flex items-center space-x-1.5 pl-1 border-l border-slate-200">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold truncate max-w-[140px] sm:max-w-[180px]"
              title={`Logged in as ${user.businessName}`}
            >
              <span className="truncate">{user.businessName}</span>
              {user.isPro ? (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black text-[9px] shadow-2xs shrink-0">
                  <Crown className="w-2.5 h-2.5 fill-amber-950" />
                  <span>PRO</span>
                </span>
              ) : (
                onOpenPro && (
                  <button
                    onClick={onOpenPro}
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold transition-colors shrink-0"
                    title="Upgrade to Pro"
                  >
                    <Crown className="w-2.5 h-2.5 text-amber-600" />
                    <span>PRO</span>
                  </button>
                )
              )}
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-all shadow-xs"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign In / Register</span>
          </button>
        )}
      </div>
    </header>
  );
};

