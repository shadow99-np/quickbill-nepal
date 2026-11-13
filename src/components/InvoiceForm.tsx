'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  User,
  PlusCircle,
  Trash2,
  Percent,
  QrCode,
  Upload,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  ImageIcon,
  Loader2,
  Package,
  Users,
  Check,
  Cloud,
  BookOpen
} from 'lucide-react';
import { InvoiceData, InvoiceItem, PaymentMethod, ClientProfile } from '@/types/invoice';
import { formatNPR } from '@/utils/numberToWords';
import { compressImage } from '@/utils/imageCompressor';
import { saveBusinessProfile, getSavedBusinessProfile } from '@/utils/storage';
import { useAuth } from '@/context/AuthContext';

interface InvoiceFormProps {
  invoice: InvoiceData;
  onChange: (updated: InvoiceData) => void;
  onOpenCatalog?: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onChange, onOpenCatalog }) => {
  const { user, token, updateProfile } = useAuth();
  const [isCompressingLogo, setIsCompressingLogo] = useState(false);
  const [isCompressingQr, setIsCompressingQr] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [hasSavedProfile, setHasSavedProfile] = useState(false);

  // Client directory state (Cloud-synced & Local fallback)
  const [savedClients, setSavedClients] = useState<ClientProfile[]>([]);
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [clientSavedSuccess, setClientSavedSuccess] = useState(false);

  useEffect(() => {
    const profile = getSavedBusinessProfile();
    if (profile && profile.issuer?.name) {
      setHasSavedProfile(true);
    }
  }, []);

  // Fetch or load clients
  useEffect(() => {
    if (token) {
      fetch('/api/user/clients', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clients && Array.isArray(data.clients)) {
            setSavedClients(data.clients);
          }
        })
        .catch(() => {});
    } else {
      try {
        const local = localStorage.getItem('quickbill_clients');
        if (local) {
          setSavedClients(JSON.parse(local));
        }
      } catch (e) {}
    }
  }, [token, user]);

  // Save current seller details as default (Local + Cloud Sync)
  const handleSaveDefaultProfile = () => {
    if (!invoice.issuer.name && !invoice.issuer.pan) {
      alert('Please fill in at least your Business Name or PAN before saving as default.');
      return;
    }
    saveBusinessProfile(invoice.issuer, invoice.payment);

    // Sync to cloud database if logged in
    if (user && token) {
      updateProfile({
        businessName: invoice.issuer.name,
        pan: invoice.issuer.pan,
        phone: invoice.issuer.phone,
        address: invoice.issuer.address,
        logoUrl: invoice.issuer.logoUrl,
        payment: invoice.payment,
      });
    }

    setSavedSuccess(true);
    setHasSavedProfile(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Save current client to directory (Local + Cloud Sync)
  const handleSaveClientToDirectory = async () => {
    if (!invoice.client.name.trim()) {
      alert('Please enter a Customer / Organization Name first.');
      return;
    }
    const clientToSave: ClientProfile = {
      name: invoice.client.name.trim(),
      pan: invoice.client.pan?.trim() || '',
      phone: invoice.client.phone?.trim() || '',
      email: invoice.client.email?.trim() || '',
      address: invoice.client.address?.trim() || '',
    };

    if (token) {
      try {
        const res = await fetch('/api/user/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ client: clientToSave }),
        });
        const data = await res.json();
        if (data.clients) {
          setSavedClients(data.clients);
        }
      } catch (e) {}
    } else {
      try {
        const existing: ClientProfile[] = JSON.parse(localStorage.getItem('quickbill_clients') || '[]');
        const filtered = existing.filter(c => c.name.toLowerCase() !== clientToSave.name.toLowerCase());
        const updated = [clientToSave, ...filtered];
        localStorage.setItem('quickbill_clients', JSON.stringify(updated));
        setSavedClients(updated);
      } catch (e) {}
    }

    setClientSavedSuccess(true);
    setTimeout(() => setClientSavedSuccess(false), 2500);
  };

  const handleSelectClient = (client: ClientProfile) => {
    onChange({
      ...invoice,
      client: {
        name: client.name,
        pan: client.pan || '',
        phone: client.phone || '',
        email: client.email || '',
        address: client.address || '',
      }
    });
    setShowClientPicker(false);
  };

  // Restore saved default profile
  const handleRestoreDefaultProfile = () => {
    const profile = getSavedBusinessProfile();
    if (profile) {
      onChange({
        ...invoice,
        issuer: { ...profile.issuer },
        payment: { ...profile.payment }
      });
    } else {
      alert('No saved business profile found.');
    }
  };

  // Update nested issuer
  const handleIssuerChange = (field: string, value: string) => {
    onChange({
      ...invoice,
      issuer: { ...invoice.issuer, [field]: value }
    });
  };

  // Update nested client
  const handleClientChange = (field: string, value: string) => {
    onChange({
      ...invoice,
      client: { ...invoice.client, [field]: value }
    });
  };

  // Update payment
  const handlePaymentChange = (field: string, value: any) => {
    onChange({
      ...invoice,
      payment: { ...invoice.payment, [field]: value }
    });
  };

  // Line item handlers
  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = invoice.items.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          const qty = field === 'quantity' ? Number(value) || 0 : item.quantity;
          const rate = field === 'rate' ? Number(value) || 0 : item.rate;
          updated.amount = qty * rate;
        }
        return updated;
      }
      return item;
    });
    recalculateTotals(
      updatedItems,
      invoice.discountValue ?? invoice.discount,
      invoice.hasVat,
      invoice.discountType || 'flat',
      invoice.currency || 'NPR'
    );
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    const updatedItems = [...invoice.items, newItem];
    recalculateTotals(
      updatedItems,
      invoice.discountValue ?? invoice.discount,
      invoice.hasVat,
      invoice.discountType || 'flat',
      invoice.currency || 'NPR'
    );
  };

  const handleDeleteItem = (id: string) => {
    if (invoice.items.length <= 1) return;
    const updatedItems = invoice.items.filter((item) => item.id !== id);
    recalculateTotals(
      updatedItems,
      invoice.discountValue ?? invoice.discount,
      invoice.hasVat,
      invoice.discountType || 'flat',
      invoice.currency || 'NPR'
    );
  };

  const CURRENCY_SYMBOLS: Record<string, string> = {
    NPR: 'रु',
    USD: '$',
    INR: '₹',
    EUR: '€',
    GBP: '£',
  };

  // Recalculate totals with support for Flat vs % discount and multi-currency
  const recalculateTotals = (
    items: InvoiceItem[],
    discVal: number,
    hasVat: boolean,
    discType: 'flat' | 'percentage' = invoice.discountType || 'flat',
    curr: 'NPR' | 'USD' | 'INR' | 'EUR' | 'GBP' = invoice.currency || 'NPR'
  ) => {
    const subtotal = items.reduce((acc, currItem) => acc + currItem.amount, 0);
    const discountAmount =
      discType === 'percentage'
        ? (subtotal * Math.min(100, Math.max(0, discVal))) / 100
        : Math.max(0, discVal);
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const vatAmount = hasVat ? taxableAmount * 0.13 : 0;
    const grandTotal = taxableAmount + vatAmount;

    onChange({
      ...invoice,
      items,
      subtotal,
      discount: discountAmount,
      discountType: discType,
      discountValue: discVal,
      hasVat,
      vatAmount,
      grandTotal,
      currency: curr,
      currencySymbol: CURRENCY_SYMBOLS[curr] || 'रु',
    });
  };

  // Handle Logo Upload with Canvas-based downscaling & compression
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressingLogo(true);
      const compressed = await compressImage(file, 400, 400, 0.85);
      handleIssuerChange('logoUrl', compressed);
    } catch (err) {
      console.error('Failed to compress logo', err);
      alert('Failed to process image. Please try a different photo.');
    } finally {
      setIsCompressingLogo(false);
    }
  };

  // Handle Custom QR Upload with Canvas-based downscaling & compression
  const handleCustomQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressingQr(true);
      const compressed = await compressImage(file, 600, 600, 0.90);
      handlePaymentChange('customQrImage', compressed);
    } catch (err) {
      console.error('Failed to process QR code image', err);
      alert('Failed to process QR image. Please try a different photo.');
    } finally {
      setIsCompressingQr(false);
    }
  };

  const isValidPan = (pan: string) => /^\d{9}$/.test(pan.trim());

  return (
    <div className="form-section space-y-6">
      {/* SECTION 1: BUSINESS PROFILE (SELLER) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              1
            </span>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Your Business Profile (Seller)</h2>
              <p className="text-[11px] text-slate-500 hidden sm:block">Details persist automatically for future invoices</p>
            </div>
          </div>

          {/* Quick Default Profile Actions */}
          <div className="flex items-center space-x-2">
            {hasSavedProfile && (
              <button
                type="button"
                onClick={handleRestoreDefaultProfile}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
                title="Reload your saved default business profile"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>Load Saved</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveDefaultProfile}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-2xs ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
              title="Save this business profile so new invoices load it automatically"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Saved for Next Time!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save as Default</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Registered Entity / Business Name
            </label>
            <input
              type="text"
              value={invoice.issuer.name}
              onChange={(e) => handleIssuerChange('name', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
              placeholder="Enter your business or freelance brand name"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                PAN / VAT Number (9 Digits)
              </label>
              {isValidPan(invoice.issuer.pan) ? (
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED PAN
                </span>
              ) : (
                <span className="text-[10px] font-medium text-amber-600 flex items-center gap-0.5">
                  <AlertCircle className="w-3 h-3" /> 9 digits required
                </span>
              )}
            </div>
            <input
              type="text"
              maxLength={9}
              value={invoice.issuer.pan}
              onChange={(e) => handleIssuerChange('pan', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono tracking-wider focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="9-digit PAN number"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Contact Mobile / Phone
            </label>
            <input
              type="text"
              value={invoice.issuer.phone}
              onChange={(e) => handleIssuerChange('phone', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="+977 98XXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Registered Office Address
            </label>
            <input
              type="text"
              value={invoice.issuer.address}
              onChange={(e) => handleIssuerChange('address', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Office / Studio address, Nepal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Billing Email
            </label>
            <input
              type="email"
              value={invoice.issuer.email}
              onChange={(e) => handleIssuerChange('email', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="billing@yourdomain.com"
            />
          </div>

          {/* Business Logo Upload */}
          <div className="md:col-span-2 pt-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Business Logo / Stamp (Optional)
            </label>
            {invoice.issuer.logoUrl ? (
              <div className="flex items-center space-x-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-16 h-16 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  <img
                    src={invoice.issuer.logoUrl}
                    alt="Business Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-bold text-slate-800">Custom Logo Active</p>
                  <p className="text-[11px] text-slate-500">
                    Auto-optimized &amp; compressed. Placed at top of all invoices &amp; PDFs.
                  </p>
                  <div className="flex items-center space-x-3 pt-1">
                    <label className="cursor-pointer text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>{isCompressingLogo ? 'Processing...' : 'Change Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={isCompressingLogo}
                      />
                    </label>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => handleIssuerChange('logoUrl', '')}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50/20 transition-all group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 shadow-2xs shrink-0">
                    {isCompressingLogo ? (
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                    ) : (
                      <ImageIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                      {isCompressingLogo ? 'Optimizing & Compressing Logo...' : 'Upload Business or Freelance Logo'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      PNG, JPG up to 10MB (Auto-compressed to &lt;80KB for instant storage)
                    </p>
                  </div>
                </div>
                <span className="mt-2 sm:mt-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 group-hover:border-emerald-500 group-hover:text-emerald-700 shadow-2xs">
                  Choose Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={isCompressingLogo}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: BILL TO (CLIENT DETAILS) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 relative">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              2
            </span>
            <h2 className="font-bold text-slate-900 text-base">Bill To (Client / Customer)</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Pick Saved Client */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowClientPicker(!showClientPicker)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Saved Clients ({savedClients.length})</span>
              </button>

              {/* Client Picker Dropdown */}
              {showClientPicker && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-30 p-3 max-h-72 overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      Client Directory
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowClientPicker(false)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>

                  {savedClients.length === 0 ? (
                    <div className="py-4 text-center text-xs text-slate-500">
                      No saved clients yet.<br />
                      Fill customer details and click <strong>"Save to Directory"</strong> below.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {savedClients.map((client, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectClient(client)}
                          className="p-2 rounded-lg hover:bg-emerald-50 border border-transparent hover:border-emerald-200 cursor-pointer transition-all text-left"
                        >
                          <div className="font-bold text-xs text-slate-900">{client.name}</div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            {client.pan && <span>PAN: {client.pan}</span>}
                            {client.phone && <span>• {client.phone}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Save Current Client to Directory */}
            <button
              type="button"
              onClick={handleSaveClientToDirectory}
              disabled={!invoice.client.name.trim()}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors disabled:opacity-40"
              title="Save this client to your directory (cloud-synced across your devices)"
            >
              {clientSavedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Save Client</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Customer / Organization Name
            </label>
            <input
              type="text"
              value={invoice.client.name}
              onChange={(e) => handleClientChange('name', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
              placeholder="Client or customer organization name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Customer PAN (9 Digits, Optional)
            </label>
            <input
              type="text"
              maxLength={9}
              value={invoice.client.pan}
              onChange={(e) => handleClientChange('pan', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono tracking-wider focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Client 9-digit PAN (optional)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Client Mobile / WhatsApp
            </label>
            <input
              type="text"
              value={invoice.client.phone}
              onChange={(e) => handleClientChange('phone', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="98XXXXXXXX"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Client Address
            </label>
            <input
              type="text"
              value={invoice.client.address}
              onChange={(e) => handleClientChange('address', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Client address / city, Nepal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Invoice Date (BS & AD)
            </label>
            <input
              type="text"
              value={invoice.invoiceDateBS}
              onChange={(e) => onChange({ ...invoice, invoiceDateBS: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. 2081/02/15 - May 28, 2024"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Due Date / Terms
            </label>
            <input
              type="text"
              value={invoice.dueDate}
              onChange={(e) => onChange({ ...invoice, dueDate: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Net 15 Days (Due June 12, 2024)"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: BILLABLE LINE ITEMS */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              3
            </span>
            <h2 className="font-bold text-slate-900 text-base">Billable Line Items</h2>
          </div>
          <div className="flex items-center space-x-2">
            {onOpenCatalog && (
              <button
                type="button"
                onClick={onOpenCatalog}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1 shadow-2xs"
                title="Pick saved products or services from your rate catalog"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Pick from Catalog</span>
              </button>
            )}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-500">Currency:</span>
              <select
                value={invoice.currency || 'NPR'}
                onChange={(e) => {
                  const newCurr = e.target.value as any;
                  recalculateTotals(
                    invoice.items,
                    invoice.discountValue ?? invoice.discount,
                    invoice.hasVat,
                    invoice.discountType || 'flat',
                    newCurr
                  );
                }}
                className="text-xs font-bold font-mono px-2 py-1 rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="NPR">NPR (रु)</option>
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {invoice.items.map((item, index) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-emerald-400 transition-colors"
            >
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                    Item #{index + 1} Description
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    className="w-full bg-white rounded border border-slate-300 px-2.5 py-1.5 text-sm font-medium focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Enter service or product description"
                  />
                </div>

                <div className="col-span-3 sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                    Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                    className="w-full bg-white rounded border border-slate-300 px-2 py-1.5 text-sm text-center focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                    Rate ({invoice.currencySymbol || 'रु'})
                  </label>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                    className="w-full bg-white rounded border border-slate-300 px-2 py-1.5 text-sm font-mono text-right focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="col-span-5 sm:col-span-2 flex items-center justify-between pl-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                      Amount
                    </label>
                    <span className="font-mono text-xs font-bold text-slate-900 block truncate">
                      {invoice.currencySymbol || 'रु'} {formatNPR(item.amount)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={invoice.items.length <= 1}
                    className="text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-400 p-1 transition-colors"
                    title="Delete Row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="w-full py-2.5 px-4 border border-dashed border-emerald-500 text-emerald-700 hover:bg-emerald-50 rounded-lg text-sm font-semibold flex items-center justify-center space-x-1.5 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Line Item</span>
        </button>
      </div>

      {/* SECTION 4: TAXES, DISCOUNTS & TOTALS */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              4
            </span>
            <h2 className="font-bold text-slate-900 text-base">Taxes & Calculation Modifiers</h2>
          </div>
          <span className="text-xs font-bold text-emerald-700 uppercase">
            IRD Rules 2080/81
          </span>
        </div>

        {/* 13% Nepal VAT Toggle */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <p className="text-sm font-bold text-slate-900">Apply 13% Nepal Government VAT</p>
            <p className="text-xs text-slate-500">
              Mandatory for VAT-registered firms; turn off for Non-VAT Pan/Freelancer receipts
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={invoice.hasVat}
              onChange={(e) => recalculateTotals(invoice.items, invoice.discount, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Discount ({invoice.discountType === 'percentage' ? '%' : (invoice.currency || 'NPR')})
              </label>
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() =>
                    recalculateTotals(
                      invoice.items,
                      invoice.discountValue ?? invoice.discount,
                      invoice.hasVat,
                      'flat',
                      invoice.currency
                    )
                  }
                  className={`px-2 py-0.5 rounded transition-colors ${
                    (invoice.discountType || 'flat') === 'flat'
                      ? 'bg-white text-emerald-700 shadow-2xs font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Flat ({invoice.currencySymbol || 'रु'})
                </button>
                <button
                  type="button"
                  onClick={() =>
                    recalculateTotals(
                      invoice.items,
                      invoice.discountValue ?? 0,
                      invoice.hasVat,
                      'percentage',
                      invoice.currency
                    )
                  }
                  className={`px-2 py-0.5 rounded transition-colors ${
                    invoice.discountType === 'percentage'
                      ? 'bg-white text-emerald-700 shadow-2xs font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  % Percent
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                max={invoice.discountType === 'percentage' ? 100 : undefined}
                value={invoice.discountValue ?? invoice.discount}
                onChange={(e) =>
                  recalculateTotals(
                    invoice.items,
                    Number(e.target.value) || 0,
                    invoice.hasVat,
                    invoice.discountType || 'flat',
                    invoice.currency
                  )
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder={invoice.discountType === 'percentage' ? 'e.g. 10%' : '0.00'}
              />
              {invoice.discountType === 'percentage' && invoice.discount > 0 && (
                <span className="text-[11px] text-slate-500 mt-1 block">
                  = {invoice.currencySymbol || 'रु'} {formatNPR(invoice.discount)} discount applied
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Invoice Status
            </label>
            <select
              value={invoice.status}
              onChange={(e) => onChange({ ...invoice, status: e.target.value as any })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
            >
              <option value="draft">Draft (Auto-saving)</option>
              <option value="sent">Sent to Client</option>
              <option value="paid">Paid & Settled</option>
              <option value="overdue">Payment Overdue</option>
            </select>
          </div>
        </div>

        {/* Live Financial Breakdown Summary */}
        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal ({invoice.items.length} items)</span>
            <span className="font-mono text-slate-900 font-medium">
              {invoice.currencySymbol || 'रु'} {formatNPR(invoice.subtotal)}
            </span>
          </div>

          {invoice.discount > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>
                Discount {invoice.discountType === 'percentage' ? `(${invoice.discountValue}%)` : ''}
              </span>
              <span className="font-mono text-rose-600">
                - {invoice.currencySymbol || 'रु'} {formatNPR(invoice.discount)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200/60">
            <span>Taxable Amount (करयोग्य रकम)</span>
            <span className="font-mono text-slate-900 font-semibold">
              {invoice.currencySymbol || 'रु'} {formatNPR(invoice.subtotal - invoice.discount)}
            </span>
          </div>

          {invoice.hasVat && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>13% Value Added Tax (VAT)</span>
              <span className="font-mono">
                + {invoice.currencySymbol || 'रु'} {formatNPR(invoice.vatAmount)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-baseline pt-2 border-t border-emerald-200 text-slate-900">
            <span className="font-bold text-base">Total Payable (जम्मा रकम)</span>
            <span className="font-bold text-xl text-emerald-700 font-mono">
              {invoice.currency || 'NPR'} {formatNPR(invoice.grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 5: PAYMENT & NEPALI QR CONFIGURATION */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              5
            </span>
            <h2 className="font-bold text-slate-900 text-base">Nepali Payment QR & Settlement</h2>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
            SCAN-TO-PAY
          </span>
        </div>

        {/* Network Selector Tabs */}
        <div className="grid grid-cols-4 gap-2">
          {(['fonepay', 'esewa', 'khalti', 'bank'] as PaymentMethod[]).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => handlePaymentChange('method', method)}
              className={`py-2 px-2 rounded-lg border text-xs font-bold capitalize transition-all ${
                invoice.payment.method === method
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        {/* Form fields based on selected payment method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {invoice.payment.method === 'fonepay' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Fonepay Merchant ID
                </label>
                <input
                  type="text"
                  value={invoice.payment.merchantId}
                  onChange={(e) => handlePaymentChange('merchantId', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="MERCHANT_88329"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Registered Mobile Number
                </label>
                <input
                  type="text"
                  value={invoice.payment.phoneNumber}
                  onChange={(e) => handlePaymentChange('phoneNumber', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="9801234567"
                />
              </div>
            </>
          )}

          {invoice.payment.method === 'esewa' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  eSewa Registered Mobile / ID
                </label>
                <input
                  type="text"
                  value={invoice.payment.phoneNumber}
                  onChange={(e) => handlePaymentChange('phoneNumber', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="98XXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  eSewa Account Holder Name
                </label>
                <input
                  type="text"
                  value={invoice.payment.accountName}
                  onChange={(e) => handlePaymentChange('accountName', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="e.g. Aayush Sharma"
                />
              </div>
            </>
          )}

          {invoice.payment.method === 'khalti' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Khalti Registered Mobile
                </label>
                <input
                  type="text"
                  value={invoice.payment.phoneNumber}
                  onChange={(e) => handlePaymentChange('phoneNumber', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="98XXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Khalti Account Name
                </label>
                <input
                  type="text"
                  value={invoice.payment.accountName}
                  onChange={(e) => handlePaymentChange('accountName', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="e.g. Aayush Sharma"
                />
              </div>
            </>
          )}

          {invoice.payment.method === 'bank' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={invoice.payment.bankName}
                  onChange={(e) => handlePaymentChange('bankName', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="e.g. Nabil Bank Ltd."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  value={invoice.payment.accountNumber}
                  onChange={(e) => handlePaymentChange('accountNumber', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="01928374650192"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={invoice.payment.accountName}
                  onChange={(e) => handlePaymentChange('accountName', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Himalayan Tech Innovations"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  value={invoice.payment.branchName}
                  onChange={(e) => handlePaymentChange('branchName', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="New Baneshwor Branch"
                />
              </div>
            </>
          )}

          {/* Option: Upload Custom QR image */}
          <div className="md:col-span-2 pt-3 border-t border-slate-100">
            <div className="mb-2">
              <span className="text-xs font-semibold text-slate-700 uppercase">
                Physical Counter Stand QR (Optional)
              </span>
            </div>

            {invoice.payment.customQrImage ? (
              <div className="flex items-center space-x-4 p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                <div className="w-16 h-16 rounded-lg border border-emerald-300 bg-white p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  <img
                    src={invoice.payment.customQrImage}
                    alt="Payment QR"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <p className="text-xs font-bold text-slate-900">Custom Counter QR Active</p>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Customers will scan your printed counter QR stand directly on this invoice.
                  </p>
                  <div className="flex items-center space-x-3 pt-1">
                    <label className="cursor-pointer text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>{isCompressingQr ? 'Processing...' : 'Replace Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCustomQrUpload}
                        className="hidden"
                        disabled={isCompressingQr}
                      />
                    </label>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => handlePaymentChange('customQrImage', undefined)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Use Auto-Generated QR Instead</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50/20 transition-all group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 shadow-2xs shrink-0">
                    {isCompressingQr ? (
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                    ) : (
                      <QrCode className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                      {isCompressingQr ? 'Optimizing & Processing QR Stand...' : 'Upload Physical Counter QR Stand Photo'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Snap a photo of your printed Fonepay / eSewa stand (Auto-compressed to &lt;90KB)
                    </p>
                  </div>
                </div>
                <span className="mt-2 sm:mt-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 group-hover:border-emerald-500 group-hover:text-emerald-700 shadow-2xs">
                  Upload Stand Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomQrUpload}
                  className="hidden"
                  disabled={isCompressingQr}
                />
              </label>
            )}
          </div>
        </div>

        {/* Dynamic Amount Embed Toggle */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
          <input
            type="checkbox"
            id="embed-amount"
            checked={invoice.payment.embedAmountInQr}
            onChange={(e) => handlePaymentChange('embedAmountInQr', e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
          />
          <label htmlFor="embed-amount" className="text-xs text-slate-700 font-medium cursor-pointer">
            Embed exact payable amount (NPR {formatNPR(invoice.grandTotal)}) inside QR code payload
          </label>
        </div>
      </div>
    </div>
  );
};
