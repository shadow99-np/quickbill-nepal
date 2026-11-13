'use client';

import React, { useState } from 'react';
import { X, BarChart3, Calendar, Download, Printer, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { InvoiceData } from '@/types/invoice';
import { formatNPR } from '@/utils/numberToWords';

interface StatementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: InvoiceData[];
}

export const StatementsModal: React.FC<StatementsModalProps> = ({ isOpen, onClose, invoices }) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'paid' | 'unpaid'>('all');

  if (!isOpen) return null;

  const filteredInvoices = invoices.filter((inv) => {
    if (filterPeriod === 'paid') return inv.status === 'paid';
    if (filterPeriod === 'unpaid') return inv.status !== 'paid';
    return true;
  });

  const totalBilled = filteredInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalTaxable = filteredInvoices.reduce(
    (sum, inv) => sum + (inv.hasVat ? inv.subtotal - inv.discount : 0),
    0
  );
  const totalVat = filteredInvoices.reduce((sum, inv) => sum + (inv.hasVat ? inv.vatAmount : 0), 0);
  const totalReceivables = invoices
    .filter((inv) => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.grandTotal, 0);

  // Group by client
  const clientMap: Record<string, { count: number; total: number; paid: number }> = {};
  invoices.forEach((inv) => {
    const name = inv.client.name.trim() || 'Cash Customer';
    if (!clientMap[name]) {
      clientMap[name] = { count: 0, total: 0, paid: 0 };
    }
    clientMap[name].count += 1;
    clientMap[name].total += inv.grandTotal;
    if (inv.status === 'paid') {
      clientMap[name].paid += inv.grandTotal;
    }
  });

  const clientList = Object.entries(clientMap).sort((a, b) => b[1].total - a[1].total);

  const handlePrint = () => {
    window.print();
  };

  const exportStatementCSV = () => {
    const headers = ['Invoice No', 'Date (BS)', 'Date (AD)', 'Client Name', 'Client PAN', 'Subtotal', 'VAT 13%', 'Grand Total', 'Status'];
    const rows = filteredInvoices.map((inv) => [
      `"${inv.invoiceNumber}"`,
      `"${inv.invoiceDateBS}"`,
      `"${inv.invoiceDateAD}"`,
      `"${inv.client.name || 'Cash Customer'}"`,
      `"${inv.client.pan || ''}"`,
      (inv.subtotal - inv.discount).toFixed(2),
      inv.vatAmount.toFixed(2),
      inv.grandTotal.toFixed(2),
      inv.status.toUpperCase(),
    ]);

    const csv = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QuickBill_Nepal_Statement_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Financial Statements &amp; Ledger (लेखा विवरण)
              </h2>
              <p className="text-xs text-slate-500">
                Monthly revenue, 13% VAT reconciliation, and accounts receivable
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={exportStatementCSV}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 bg-slate-50 border-b border-slate-100">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Total Invoiced
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-slate-900 block mt-0.5">
              NPR {formatNPR(totalBilled)}
            </span>
            <span className="text-[11px] text-slate-400">{filteredInvoices.length} invoices</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
              13% VAT Collected
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-800 block mt-0.5">
              NPR {formatNPR(totalVat)}
            </span>
            <span className="text-[11px] text-emerald-600">IRD Payable</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-blue-100 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
              Taxable Turnover
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-blue-800 block mt-0.5">
              NPR {formatNPR(totalTaxable)}
            </span>
            <span className="text-[11px] text-blue-600">Net Sales</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-amber-100 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
              Unpaid Receivables
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-amber-800 block mt-0.5">
              NPR {formatNPR(totalReceivables)}
            </span>
            <span className="text-[11px] text-amber-600">Pending Collection</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-500 uppercase text-[10px]">Filter Status:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              <button
                onClick={() => setFilterPeriod('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  filterPeriod === 'all' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All Invoices ({invoices.length})
              </button>
              <button
                onClick={() => setFilterPeriod('paid')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  filterPeriod === 'paid' ? 'bg-white shadow-2xs text-emerald-700' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Paid Only
              </button>
              <button
                onClick={() => setFilterPeriod('unpaid')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  filterPeriod === 'unpaid' ? 'bg-white shadow-2xs text-amber-700' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Unpaid / Due
              </button>
            </div>
          </div>

          <span className="text-slate-400 text-xs hidden sm:block">
            Fiscal Year: 2081/82 BS
          </span>
        </div>

        {/* Content: Client Breakdown + Transactions */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Client Breakdown Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Top Clients by Billed Amount
            </h3>
            {clientList.length === 0 ? (
              <p className="text-xs text-slate-400">No client records yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {clientList.slice(0, 6).map(([name, data]) => (
                  <div key={name} className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                    <p className="font-bold text-slate-900 text-xs truncate">{name}</p>
                    <p className="font-mono text-xs font-bold text-emerald-700">
                      NPR {formatNPR(data.total)}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>{data.count} bills</span>
                      <span className={data.total === data.paid ? 'text-emerald-600 font-medium' : 'text-amber-600'}>
                        {data.total === data.paid ? 'Settled' : `NPR ${formatNPR(data.total - data.paid)} due`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Invoices Ledger Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Invoice Statement Log ({filteredInvoices.length})
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Invoice No</th>
                    <th className="py-2.5 px-3 font-semibold">Date (BS)</th>
                    <th className="py-2.5 px-3 font-semibold">Client</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Taxable</th>
                    <th className="py-2.5 px-3 font-semibold text-right">13% VAT</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Grand Total</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white font-mono">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-900">{inv.invoiceNumber}</td>
                      <td className="py-2 px-3 text-slate-500">{inv.invoiceDateBS}</td>
                      <td className="py-2 px-3 font-sans text-slate-700 truncate max-w-[150px]">
                        {inv.client.name || 'Cash Customer'}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-600">
                        रु {formatNPR(inv.hasVat ? inv.subtotal - inv.discount : 0)}
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-700">
                        {inv.hasVat ? `+ रु ${formatNPR(inv.vatAmount)}` : '—'}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        रु {formatNPR(inv.grandTotal)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                            inv.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.status === 'sent'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
