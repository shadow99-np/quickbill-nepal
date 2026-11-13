'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { InvoiceForm } from '@/components/InvoiceForm';
import { InvoicePreview } from '@/components/InvoicePreview';
import { WhatsAppModal } from '@/components/WhatsAppModal';
import { InvoiceHistoryModal } from '@/components/InvoiceHistoryModal';
import { NotificationFeed } from '@/components/NotificationFeed';
import { AuthModal } from '@/components/AuthModal';
import { ItemCatalogModal } from '@/components/ItemCatalogModal';
import { StatementsModal } from '@/components/StatementsModal';
import { ProUpgradeModal } from '@/components/ProUpgradeModal';
import { AdBanner } from '@/components/AdBanner';
import { Footer } from '@/components/Footer';
import { InvoiceData, InvoiceItem } from '@/types/invoice';
import { useAuth } from '@/context/AuthContext';
import {
  getSavedBusinessProfile,
  getInvoiceHistory,
  saveInvoiceToHistory,
  deleteInvoiceFromHistory
} from '@/utils/storage';

const DEFAULT_INVOICE: InvoiceData = {
  id: 'inv_1',
  invoiceNumber: 'QB-2081-0001',
  fiscalYear: '2081/82',
  invoiceDateBS: '2081/08/28',
  invoiceDateAD: new Date().toISOString().split('T')[0],
  dueDate: 'Due on Receipt',
  paymentTerms: 'Due on Receipt',
  issuer: {
    name: '',
    pan: '',
    phone: '',
    email: '',
    address: '',
  },
  client: {
    name: '',
    pan: '',
    phone: '',
    email: '',
    address: '',
  },
  items: [
    {
      id: 'item_1',
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    },
  ],
  subtotal: 0,
  discount: 0,
  hasVat: false,
  vatRate: 13,
  vatAmount: 0,
  grandTotal: 0,
  amountInWords: 'Zero Rupees Only',
  notes: '',
  termsAndConditions: '1. Goods once sold or services rendered are subject to standard delivery terms.\n2. Please quote invoice number when transferring funds.',
  payment: {
    method: 'fonepay',
    merchantId: '',
    phoneNumber: '',
    accountName: '',
    bankName: '',
    accountNumber: '',
    branchName: '',
    embedAmountInQr: true,
  },
  status: 'draft',
  currency: 'NPR',
  currencySymbol: 'रु',
  discountType: 'flat',
  discountValue: 0,
};

export default function Home() {
  const { user, token } = useAuth();
  const [invoice, setInvoice] = useState<InvoiceData>(DEFAULT_INVOICE);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isStatementsOpen, setIsStatementsOpen] = useState(false);
  const [isProOpen, setIsProOpen] = useState(false);
  const [historyInvoices, setHistoryInvoices] = useState<InvoiceData[]>([]);
  const [isSaved, setIsSaved] = useState(true);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      // 1. Load History
      const loadedHistory = getInvoiceHistory();
      setHistoryInvoices(loadedHistory);

      // 2. Load Saved Business Profile
      const savedProfile = getSavedBusinessProfile();

      // 3. Load Active Draft
      const savedDraft = localStorage.getItem('quickbill_nepal_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (
          parsed.issuer?.name === 'Himalayan Tech Innovations Pvt. Ltd.' ||
          parsed.issuer?.pan === '609823412'
        ) {
          localStorage.removeItem('quickbill_nepal_draft');
          initInvoiceWithProfile(savedProfile, loadedHistory);
        } else {
          setInvoice(parsed);
        }
      } else {
        initInvoiceWithProfile(savedProfile, loadedHistory);
      }
    } catch (e) {
      console.warn('LocalStorage load failed', e);
    }
  }, []);

  // When user logs in, auto-sync business profile & server invoices
  useEffect(() => {
    if (user) {
      // Auto-populate issuer with user details if current is blank
      if (!invoice.issuer.name) {
        setInvoice((prev) => ({
          ...prev,
          issuer: {
            ...prev.issuer,
            name: user.businessName || prev.issuer.name,
            pan: user.pan || prev.issuer.pan,
            phone: user.phone || prev.issuer.phone,
            address: user.address || prev.issuer.address,
            email: user.email || prev.issuer.email,
            logoUrl: user.logoUrl || prev.issuer.logoUrl,
          },
          payment: user.payment && user.payment.phoneNumber ? { ...user.payment } : prev.payment,
        }));
      }

      // Fetch cloud invoices
      if (token) {
        fetch('/api/invoices', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.invoices && data.invoices.length > 0) {
              setHistoryInvoices((prev) => {
                const combined = [...data.invoices, ...prev];
                // unique by id
                const unique = Array.from(new Map(combined.map((i) => [i.id, i])).values());
                return unique;
              });
            }
          })
          .catch(() => {});
      }
    }
  }, [user, token]);

  const initInvoiceWithProfile = (savedProfile: any, history: InvoiceData[]) => {
    const nextSeq = history.length + 1;
    const invNumber = `QB-2081-${String(nextSeq).padStart(4, '0')}`;
    const initial: InvoiceData = {
      ...DEFAULT_INVOICE,
      id: `inv_${Date.now()}`,
      invoiceNumber: invNumber,
      issuer: savedProfile?.issuer ? { ...savedProfile.issuer } : { ...DEFAULT_INVOICE.issuer },
      payment: savedProfile?.payment ? { ...savedProfile.payment } : { ...DEFAULT_INVOICE.payment }
    };
    setInvoice(initial);
  };

  // Save to LocalStorage automatically & sync history / cloud
  const handleInvoiceChange = (updated: InvoiceData) => {
    setInvoice(updated);
    setIsSaved(false);
    try {
      localStorage.setItem('quickbill_nepal_draft', JSON.stringify(updated));
      const updatedHistory = saveInvoiceToHistory(updated);
      setHistoryInvoices(updatedHistory);

      // Cloud sync if logged in
      if (token) {
        fetch('/api/invoices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ invoice: updated }),
        }).catch(() => {});
      }

      setTimeout(() => setIsSaved(true), 400);
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  };

  const handleManualSave = () => {
    try {
      localStorage.setItem('quickbill_nepal_draft', JSON.stringify(invoice));
      const updatedHistory = saveInvoiceToHistory(invoice);
      setHistoryInvoices(updatedHistory);
      setIsSaved(true);

      if (token) {
        fetch('/api/invoices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ invoice }),
        }).catch(() => {});
      }

      alert('Invoice saved successfully to your records & history!');
    } catch (e) {
      alert('Save failed.');
    }
  };

  // Open invoice from history
  const handleSelectInvoice = (selected: InvoiceData) => {
    setInvoice(selected);
    localStorage.setItem('quickbill_nepal_draft', JSON.stringify(selected));
    setIsSaved(true);
  };

  // Delete invoice from history
  const handleDeleteInvoice = (id: string) => {
    const updated = deleteInvoiceFromHistory(id);
    setHistoryInvoices(updated);
    if (token) {
      fetch(`/api/invoices?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    if (invoice.id === id) {
      handleNewInvoice();
    }
  };

  // Create new sequential invoice keeping seller details
  const handleNewInvoice = () => {
    const profile = getSavedBusinessProfile();
    const nextSeq = historyInvoices.length + 1;
    const nextNumber = `QB-2081-${String(nextSeq).padStart(4, '0')}`;

    const newInv: InvoiceData = {
      ...DEFAULT_INVOICE,
      id: `inv_${Date.now()}`,
      invoiceNumber: nextNumber,
      invoiceDateAD: new Date().toISOString().split('T')[0],
      issuer: user?.businessName
        ? {
            name: user.businessName,
            pan: user.pan || '',
            phone: user.phone || '',
            email: user.email || '',
            address: user.address || '',
          }
        : profile?.issuer
        ? { ...profile.issuer }
        : { ...DEFAULT_INVOICE.issuer },
      payment: profile?.payment ? { ...profile.payment } : { ...DEFAULT_INVOICE.payment },
      items: [
        {
          id: `item_${Date.now()}`,
          description: '',
          quantity: 1,
          rate: 0,
          amount: 0,
        },
      ],
    };

    setInvoice(newInv);
    localStorage.setItem('quickbill_nepal_draft', JSON.stringify(newInv));
    const updatedHistory = saveInvoiceToHistory(newInv);
    setHistoryInvoices(updatedHistory);
    setIsSaved(true);
  };

  // Duplicate an existing invoice with a new invoice number
  const handleDuplicateInvoice = (source: InvoiceData) => {
    const nextSeq = historyInvoices.length + 1;
    const nextNumber = `QB-2081-${String(nextSeq).padStart(4, '0')}`;
    const duplicated: InvoiceData = {
      ...source,
      id: `inv_${Date.now()}`,
      invoiceNumber: nextNumber,
      invoiceDateAD: new Date().toISOString().split('T')[0],
      status: 'draft',
      items: source.items.map((it, idx) => ({
        ...it,
        id: `item_${Date.now()}_${idx}`,
      })),
    };
    setInvoice(duplicated);
    localStorage.setItem('quickbill_nepal_draft', JSON.stringify(duplicated));
    const updatedHistory = saveInvoiceToHistory(duplicated);
    setHistoryInvoices(updatedHistory);
    setIsSaved(true);
  };

  // Toggle invoice status (draft -> sent -> paid)
  const handleToggleStatus = (id: string, newStatus: InvoiceData['status']) => {
    const updatedHistory = historyInvoices.map((inv) =>
      inv.id === id ? { ...inv, status: newStatus } : inv
    );
    setHistoryInvoices(updatedHistory);
    localStorage.setItem('quickbill_invoices_history', JSON.stringify(updatedHistory));
    if (invoice.id === id) {
      setInvoice((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // Insert picked catalog item into line items
  const handleInsertCatalogItem = (item: { description: string; rate: number }) => {
    const newItem: InvoiceItem = {
      id: `item_${Date.now()}`,
      description: item.description,
      quantity: 1,
      rate: item.rate,
      amount: item.rate,
    };

    const isFirstEmpty =
      invoice.items.length === 1 &&
      !invoice.items[0].description &&
      invoice.items[0].rate === 0;

    const updatedItems = isFirstEmpty ? [newItem] : [...invoice.items, newItem];
    const subtotal = updatedItems.reduce((acc, curr) => acc + curr.amount, 0);
    const taxableAmount = Math.max(0, subtotal - (invoice.discount || 0));
    const vatAmount = invoice.hasVat ? taxableAmount * 0.13 : 0;
    const grandTotal = taxableAmount + vatAmount;

    handleInvoiceChange({
      ...invoice,
      items: updatedItems,
      subtotal,
      vatAmount,
      grandTotal,
    });
  };

  const handleReset = () => {
    if (confirm('Create a fresh blank invoice? Your business profile will be preserved.')) {
      handleNewInvoice();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* 1. TOP NEWS TICKER (For critical IRD Tax & App updates) */}
      <NotificationFeed />

      {/* 2. Top Application Header */}
      <Navbar
        invoiceNumber={invoice.invoiceNumber}
        onPrint={handlePrint}
        onSave={handleManualSave}
        onReset={handleReset}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        onOpenStatements={() => setIsStatementsOpen(true)}
        onOpenNotifications={() => {
          const bell = document.querySelector('.notification-drawer-trigger');
          if (bell) (bell as HTMLElement).click();
        }}
        onOpenPro={() => setIsProOpen(true)}
        historyCount={historyInvoices.length}
        isSaved={isSaved}
      />

      {/* 3. Main Split-Screen Workspace */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Google AdSense Slot (Real Monetization) */}
        <AdBanner onOpenPro={() => setIsProOpen(true)} />

        {/* Mobile View Switcher (Visible only on mobile/tablet) */}
        <div className="lg:hidden flex items-center p-1 bg-slate-200/90 rounded-xl mb-4 border border-slate-300 shadow-2xs">
          <button
            type="button"
            onClick={() => setMobileTab('form')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'form'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>✏️ 1. Edit Details</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'preview'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📄 2. View A4 Bill & QR</span>
          </button>
        </div>

        {/* 2-Column Split: Form (Left) & Live Preview Canvas (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: FORM ENGINE (Cols 1-6) */}
          <div className={`lg:col-span-6 space-y-6 ${mobileTab === 'form' ? 'block' : 'hidden lg:block'}`}>
            <InvoiceForm
              invoice={invoice}
              onChange={handleInvoiceChange}
              onOpenCatalog={() => setIsCatalogOpen(true)}
            />
          </div>

          {/* RIGHT: LIVE PREVIEW (Cols 7-12) */}
          <div className={`lg:col-span-6 sticky top-20 ${mobileTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
            <div className="no-print flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Live Real-time A4 Paper Preview
              </span>
              <span className="text-xs text-slate-500 font-mono">100% Print-Ready</span>
            </div>

            <InvoicePreview invoice={invoice} />
          </div>
        </div>
      </main>

      {/* Footer with Compliance, AdSense Links, and IRD Resources */}
      <Footer />

      {/* WhatsApp Modal */}
      <WhatsAppModal
        invoice={invoice}
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

      {/* Invoice History & IRD Sales Book Modal */}
      <InvoiceHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        invoices={historyInvoices}
        onSelectInvoice={handleSelectInvoice}
        onDeleteInvoice={handleDeleteInvoice}
        onNewInvoice={handleNewInvoice}
        onToggleStatus={handleToggleStatus}
        onDuplicateInvoice={handleDuplicateInvoice}
      />

      {/* Business Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Items & Services Catalog Modal */}
      <ItemCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectItem={handleInsertCatalogItem}
      />

      {/* Financial Statements & Monthly Ledger Modal */}
      <StatementsModal
        isOpen={isStatementsOpen}
        onClose={() => setIsStatementsOpen(false)}
        invoices={historyInvoices}
      />

      {/* Pro Upgrade Subscription Modal */}
      <ProUpgradeModal isOpen={isProOpen} onClose={() => setIsProOpen(false)} />
    </div>
  );
}
