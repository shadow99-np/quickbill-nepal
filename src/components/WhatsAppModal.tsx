'use client';

import React, { useState } from 'react';
import { X, Send, Copy, Check, MessageSquare } from 'lucide-react';
import { InvoiceData } from '@/types/invoice';
import { formatNPR } from '@/utils/numberToWords';

interface WhatsAppModalProps {
  invoice: InvoiceData;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ invoice, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(invoice.client.phone || '');

  if (!isOpen) return null;

  // Clean phone number for WhatsApp wa.me link
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('977')
    ? cleanPhone
    : cleanPhone.length === 10
    ? `977${cleanPhone}`
    : cleanPhone;

  // Build the professional WhatsApp notification message
  const message = `Namaste ${invoice.client.name || 'Sir/Madam'},

Greetings from ${invoice.issuer.name || 'QuickBill'}!

Here are the details for your Invoice #${invoice.invoiceNumber}:
• Invoice Date: ${invoice.invoiceDateBS} (${invoice.invoiceDateAD})
• Total Amount: NPR ${formatNPR(invoice.grandTotal)}
• Payment Due: ${invoice.dueDate}

Payment Instructions:
Please scan the ${invoice.payment.method.toUpperCase()} QR code on the invoice or transfer directly:
${invoice.payment.method === 'esewa' ? `• eSewa ID: ${invoice.payment.phoneNumber}` : ''}${
    invoice.payment.method === 'fonepay' ? `• Fonepay Merchant: ${invoice.payment.merchantId || invoice.payment.phoneNumber}` : ''
  }${
    invoice.payment.method === 'bank'
      ? `• Bank: ${invoice.payment.bankName}\n• A/C No: ${invoice.payment.accountNumber}\n• Name: ${invoice.payment.accountName}`
      : ''
  }

Thank you for your business!
Best regards,
${invoice.issuer.name}
Phone: ${invoice.issuer.phone}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    const url = formattedPhone
      ? `https://wa.me/${formattedPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
              <MessageSquare className="w-4 h-4 fill-current" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Send Invoice via WhatsApp</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Client WhatsApp Number (with 977 or 10 digits)
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 9801234567 or 9779801234567"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Message Preview
            </label>
            <textarea
              readOnly
              rows={8}
              value={message}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-800 leading-relaxed resize-none focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleSendWhatsApp}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] rounded-lg shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Open WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
