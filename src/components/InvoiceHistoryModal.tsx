'use client';

import React, { useState } from 'react';
import {
  X,
  FileText,
  Search,
  Trash2,
  ExternalLink,
  Download,
  Plus,
  CheckCircle2,
  Clock,
  Send,
  Copy
} from 'lucide-react';
import { InvoiceData } from '@/types/invoice';
import { formatNPR } from '@/utils/numberToWords';
import { exportIRDSalesRegisterCSV } from '@/utils/storage';

interface InvoiceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: InvoiceData[];
  onSelectInvoice: (invoice: InvoiceData) => void;
  onDeleteInvoice: (id: string) => void;
  onNewInvoice: () => void;
  onToggleStatus: (id: string, newStatus: InvoiceData['status']) => void;
  onDuplicateInvoice?: (invoice: InvoiceData) => void;
}

export const InvoiceHistoryModal: React.FC<InvoiceHistoryModalProps> = ({
  isOpen,
  onClose,
  invoices,
  onSelectInvoice,
  onDeleteInvoice,
  onNewInvoice,
  onToggleStatus,
  onDuplicateInvoice
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceDateBS.includes(searchTerm)
  );

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.grandTotal, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Invoice History &amp; Records</h2>
              <p className="text-xs text-slate-500">
                Manage all your saved invoices, track payments, and export IRD Sales Book
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportIRDSalesRegisterCSV(invoices)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition-all"
              title="Download official Nepal IRD Sales Book Excel/CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export IRD CSV</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Analytics Top Bar */}
        <div className="grid grid-cols-3 gap-4 px-6 py-3 bg-white border-b border-slate-100 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">Total Invoices</span>
            <span className="text-base font-bold text-slate-900">{invoices.length}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
            <span className="text-emerald-700 block">Total Billed</span>
            <span className="text-base font-bold text-emerald-800 font-mono">
              NPR {formatNPR(totalBilled)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100">
            <span className="text-blue-700 block">Collected (Paid)</span>
            <span className="text-base font-bold text-blue-800 font-mono">
              NPR {formatNPR(totalPaid)}
            </span>
          </div>
        </div>

        {/* Search & New Invoice Action */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Invoice # (e.g. QB-001) or Client Name..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={() => {
              onNewInvoice();
              onClose();
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New Invoice</span>
          </button>
        </div>

        {/* Invoices List / Table */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-600">No invoices found</p>
              <p className="text-xs text-slate-400 mt-1">
                Save an invoice from the main screen or create a new one.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                >
                  {/* Left: Metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {inv.invoiceNumber}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{inv.invoiceDateBS} BS</span>

                      {/* Status Badges */}
                      <button
                        onClick={() => {
                          const nextStatus =
                            inv.status === 'draft' ? 'sent' : inv.status === 'sent' ? 'paid' : 'draft';
                          onToggleStatus(inv.id, nextStatus);
                        }}
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded transition-colors ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'sent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                        title="Click to toggle status (Draft -> Sent -> Paid)"
                      >
                        {inv.status}
                      </button>
                    </div>

                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">
                        {inv.client.name || 'Unnamed Client'}
                      </span>
                      {inv.client.phone && <span className="text-slate-400"> • {inv.client.phone}</span>}
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Grand Total
                      </span>
                      <span className="font-mono font-bold text-sm text-slate-900">
                        NPR {formatNPR(inv.grandTotal)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 border-l border-slate-200 pl-3">
                      <button
                        onClick={() => {
                          onSelectInvoice(inv);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-semibold text-xs rounded-lg transition-colors"
                      >
                        Open
                      </button>

                      {onDuplicateInvoice && (
                        <button
                          onClick={() => {
                            onDuplicateInvoice(inv);
                            onClose();
                          }}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1"
                          title="Duplicate / Clone this invoice"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Clone</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`Delete invoice ${inv.invoiceNumber}?`)) {
                            onDeleteInvoice(inv.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
