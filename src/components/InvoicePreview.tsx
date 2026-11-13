'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { InvoiceData } from '@/types/invoice';
import { formatNPR, numberToWordsNPR } from '@/utils/numberToWords';
import { generateNepalQrString } from '@/utils/nepalQr';
import { Zap, ShieldCheck } from 'lucide-react';

interface InvoicePreviewProps {
  invoice: InvoiceData;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const currCode = invoice.currency || 'NPR';
  const currSym = invoice.currencySymbol || 'रु';
  const rawWords = numberToWordsNPR(invoice.grandTotal);
  const words =
    currCode === 'USD'
      ? rawWords.replace('Nepali Rupees', 'US Dollars')
      : currCode === 'INR'
      ? rawWords.replace('Nepali Rupees', 'Indian Rupees')
      : currCode === 'EUR'
      ? rawWords.replace('Nepali Rupees', 'Euros')
      : currCode === 'GBP'
      ? rawWords.replace('Nepali Rupees', 'British Pounds')
      : rawWords;

  const qrString = generateNepalQrString(invoice.payment, invoice.grandTotal);

  return (
    <div className="w-full flex flex-col items-center">
      {/* A4 PAPER CANVAS (Level 2 Elevation: Pristine White, Fine Hairline, Layered Ambient Shadow) */}
      <div
        id="invoice-printable-sheet"
        className="print-invoice-sheet w-full max-w-[720px] bg-white border border-slate-200 shadow-xl p-8 sm:p-10 text-slate-800 flex flex-col justify-between min-h-[980px] rounded-sm"
      >
        <div>
          {/* INVOICE TOP BANNER / TAX INVOICE HEADER */}
          <div className="text-center pb-4 mb-4 border-b-2 border-slate-900">
            <span className="inline-block px-3 py-0.5 bg-slate-900 text-white text-xs font-bold tracking-widest uppercase mb-1">
              {invoice.hasVat ? 'TAX INVOICE / कर बीजक' : 'INVOICE / बीजक'}
            </span>
            <p className="text-[11px] font-medium text-slate-500">
              {invoice.hasVat
                ? 'Issued pursuant to Sub-rule (1) of Rule 23 of Value Added Tax Rules, 2053'
                : 'Commercial Invoice for Professional Services / Goods'}
            </p>
          </div>

          {/* SELLER & INVOICE METADATA ROW */}
          <div className="grid grid-cols-12 gap-4 pb-6 border-b border-slate-200">
            {/* Left: Issuer Info */}
            <div className="col-span-7 space-y-1">
              <div className="flex items-center space-x-2">
                {invoice.issuer.logoUrl ? (
                  <img
                    src={invoice.issuer.logoUrl}
                    alt="Logo"
                    className="w-10 h-10 object-contain rounded"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                )}
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                  {invoice.issuer.name || (
                    <span className="text-slate-400 italic font-normal">[Your Business / Seller Name]</span>
                  )}
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                {invoice.issuer.address || (
                  <span className="text-slate-400 italic">[Seller Business Address]</span>
                )}
              </p>
              <p className="text-xs text-slate-600">
                {invoice.issuer.phone ? `Phone: ${invoice.issuer.phone}` : ''}
                {invoice.issuer.phone && invoice.issuer.email ? ' | ' : ''}
                {invoice.issuer.email || ''}
              </p>
              <div className="pt-1.5">
                <span className="inline-block px-2.5 py-0.5 bg-slate-100 rounded text-slate-900 font-mono text-xs font-bold border border-slate-300">
                  Seller PAN / VAT: {invoice.issuer.pan || '—'}
                </span>
              </div>
            </div>

            {/* Right: Invoice Metadata Block */}
            <div className="col-span-5 text-right space-y-1">
              <div className="font-mono text-xs font-bold text-slate-900">
                Invoice No:{' '}
                <span className="text-emerald-700 font-extrabold">{invoice.invoiceNumber}</span>
              </div>
              <p className="text-xs text-slate-600">
                Date (BS): <span className="font-semibold text-slate-900">{invoice.invoiceDateBS}</span>
              </p>
              <p className="text-[11px] text-slate-500">Date (AD): {invoice.invoiceDateAD}</p>
              <p className="text-xs text-slate-600">
                Terms: <span className="font-semibold text-slate-900">{invoice.paymentTerms}</span>
              </p>
              <p className="text-xs text-slate-600">
                Due Date: <span className="font-semibold text-slate-900">{invoice.dueDate}</span>
              </p>
              <div className="pt-1">
                <span className="inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Status: {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* BILL TO (CUSTOMER DETAILS) CONTAINER */}
          <div className="my-5 p-3.5 bg-slate-50 rounded border border-slate-200 grid grid-cols-12 gap-2 text-xs">
            <div className="col-span-7">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                Purchaser's Details (क्रेताको विवरण):
              </span>
              <p className="font-bold text-slate-900 text-sm">
                {invoice.client.name || (
                  <span className="text-slate-400 italic font-normal">[Client / Organization Name]</span>
                )}
              </p>
              <p className="text-slate-600">
                {invoice.client.address || (
                  <span className="text-slate-400 italic">[Client Address, Nepal]</span>
                )}
              </p>
              <p className="text-slate-600">
                {invoice.client.phone ? `Phone: ${invoice.client.phone}` : ''}
              </p>
            </div>
            <div className="col-span-5 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                Purchaser PAN (क्रेताको प्यान नं):
              </span>
              <span className="font-mono font-bold text-slate-900 text-xs px-2 py-0.5 bg-white border border-slate-300 rounded inline-block">
                {invoice.client.pan || '—'}
              </span>
            </div>
          </div>

          {/* LINE ITEMS TABLE */}
          <div className="mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y-2 border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-900 bg-slate-50">
                  <th className="py-2 px-2 text-center w-8">S.N.</th>
                  <th className="py-2 px-3">Description of Services / Goods</th>
                  <th className="py-2 px-2 text-center w-14">Qty</th>
                  <th className="py-2 px-3 text-right w-24">Rate ({currCode})</th>
                  <th className="py-2 px-3 text-right w-28">Amount ({currCode})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-2 text-center text-slate-500 font-mono">{index + 1}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {item.description || (
                        <span className="text-slate-400 italic font-normal">[Enter item / service description]</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {formatNPR(item.rate)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                      {formatNPR(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FINANCIAL SUMMARY TOTALS */}
          <div className="mt-5 pt-3 border-t-2 border-slate-800 flex justify-end">
            <div className="w-72 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (जम्मा रकम):</span>
                <span className="font-mono text-slate-900 font-medium">
                  {currSym} {formatNPR(invoice.subtotal)}
                </span>
              </div>

              {invoice.discount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>
                    Discount (छुट)
                    {invoice.discountType === 'percentage' ? ` [${invoice.discountValue}%]` : ''}:
                  </span>
                  <span className="font-mono text-rose-600">
                    - {currSym} {formatNPR(invoice.discount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                <span>Taxable Amount (करयोग्य मूल्य):</span>
                <span className="font-mono text-slate-900 font-semibold">
                  {currSym} {formatNPR(invoice.subtotal - invoice.discount)}
                </span>
              </div>

              {invoice.hasVat && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>13% VAT (मूल्य अभिवृद्धि कर):</span>
                  <span className="font-mono">+ {currSym} {formatNPR(invoice.vatAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-2 border-t-2 border-slate-900 text-slate-900 font-bold text-sm">
                <span>Grand Total (कुल रकम):</span>
                <span className="font-mono text-emerald-700 text-base">
                  {currCode} {formatNPR(invoice.grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* AMOUNT IN WORDS */}
          <div className="mt-4 p-2.5 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700">
            <span className="font-semibold text-slate-900">In Words: </span>
            <span className="italic">{words}</span>
          </div>

          {/* PAYMENT QR CODE CARD (HERO ELEMENT) */}
          <div className="mt-6 p-4 rounded-xl border border-slate-300 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              {/* QR Code Canvas */}
              <div className="p-2 bg-white rounded-lg border border-slate-300 shadow-xs shrink-0">
                {invoice.payment.customQrImage ? (
                  <img
                    src={invoice.payment.customQrImage}
                    alt="Payment QR"
                    className="w-24 h-24 object-contain"
                  />
                ) : (
                  <QRCodeSVG
                    value={qrString}
                    size={96}
                    level="M"
                    includeMargin={false}
                  />
                )}
              </div>

              {/* Instructions & Branding */}
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider">
                    {invoice.payment.method.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Scan &amp; Pay via Mobile Banking
                  </span>
                </div>

                <p className="text-[11px] text-slate-600">
                  {invoice.payment.method === 'fonepay' &&
                    (invoice.payment.merchantId || invoice.payment.phoneNumber
                      ? `Merchant: ${invoice.payment.merchantId || invoice.payment.phoneNumber}`
                      : 'Fonepay Merchant ID / Mobile not set')}
                  {invoice.payment.method === 'esewa' &&
                    (invoice.payment.phoneNumber
                      ? `eSewa ID: ${invoice.payment.phoneNumber} (${invoice.payment.accountName || 'Personal'})`
                      : 'eSewa ID / Mobile not set')}
                  {invoice.payment.method === 'khalti' &&
                    (invoice.payment.phoneNumber
                      ? `Khalti ID: ${invoice.payment.phoneNumber} (${invoice.payment.accountName || 'Personal'})`
                      : 'Khalti Mobile not set')}
                  {invoice.payment.method === 'bank' &&
                    (invoice.payment.bankName
                      ? `${invoice.payment.bankName} | A/C: ${invoice.payment.accountNumber}`
                      : 'Bank A/C Details not set')}
                </p>

                <p className="text-[10px] font-mono text-emerald-800 font-semibold">
                  Exact Amount: {currCode} {formatNPR(invoice.grandTotal)}
                </p>
              </div>
            </div>

            {/* Bank details info */}
            {invoice.payment.method !== 'bank' && invoice.payment.accountNumber && (
              <div className="text-right text-[11px] text-slate-500 hidden sm:block">
                <p className="font-semibold text-slate-700">{invoice.payment.bankName}</p>
                <p className="font-mono">A/C: {invoice.payment.accountNumber}</p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER & SIGNATURE SECTION */}
        <div className="mt-8 pt-4 border-t border-slate-200 grid grid-cols-12 gap-4 items-end text-xs text-slate-500">
          <div className="col-span-8 space-y-1">
            <p className="font-semibold text-slate-700">Terms &amp; Conditions:</p>
            <p className="text-[11px] leading-relaxed">
              1. Goods once sold or services rendered are subject to standard delivery terms.
              <br />
              2. Please quote invoice number <span className="font-mono font-bold text-slate-800">#{invoice.invoiceNumber}</span> when making bank payments.
            </p>
            <p className="text-[10px] text-slate-400 pt-1">
              Generated securely with QuickBill Nepal • Designed for Freelancers &amp; Businesses in Nepal
            </p>
          </div>

          <div className="col-span-4 text-center">
            <div className="h-12 flex items-center justify-center">
              <span className="font-serif italic text-emerald-800 text-sm">
                {invoice.issuer.name ? `${invoice.issuer.name}` : 'Authorized'}
              </span>
            </div>
            <div className="border-t border-slate-400 pt-1">
              <p className="font-semibold text-slate-800 text-xs">Authorized Signatory</p>
              <p className="text-[10px] text-slate-500">हस्ताक्षर / मुहर</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
