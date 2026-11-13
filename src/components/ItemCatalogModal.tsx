'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, Plus, Trash2, Tag, Check, Search, ArrowRight } from 'lucide-react';
import { CatalogItem } from '@/lib/db';
import { formatNPR } from '@/utils/numberToWords';
import { useAuth } from '@/context/AuthContext';

interface ItemCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem?: (item: { description: string; rate: number }) => void;
}

export const ItemCatalogModal: React.FC<ItemCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectItem,
}) => {
  const { token, user } = useAuth();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [rate, setRate] = useState<number | ''>('');
  const [unit, setUnit] = useState('pcs');
  const [category, setCategory] = useState('Services');

  const loadItems = async () => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/catalog', { headers });
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (e) {
      console.warn('Failed to load catalog', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadItems();
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || rate === '') return;

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/catalog', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, rate: Number(rate), unit, category }),
      });

      const data = await res.json();
      if (data.success && data.item) {
        setItems([data.item, ...items]);
        setName('');
        setRate('');
        setIsAdding(false);
      } else {
        alert(data.error || 'Failed to add item');
      }
    } catch (err) {
      alert('Network error while saving item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      await fetch(`/api/catalog?id=${id}`, {
        method: 'DELETE',
        headers,
      });
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Items &amp; Services Catalog (सामान सूची)
              </h3>
              <p className="text-xs text-slate-500">
                Save standard rates to insert into invoices with 1 click
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Cancel' : 'Add Item'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Item Form Drawer */}
        {isAdding && (
          <form
            onSubmit={handleAddItem}
            className="p-4 bg-emerald-50/50 border-b border-emerald-100 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
          >
            <div className="sm:col-span-5">
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                Item / Service Description *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wedding Photography 1-Day"
                className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                Unit Rate (रु NPR) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={rate}
                onChange={(e) => setRate(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="5000"
                className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-mono focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500"
              >
                <option value="pcs">pcs</option>
                <option value="hr">hr</option>
                <option value="day">day</option>
                <option value="session">session</option>
                <option value="project">project</option>
                <option value="month">month</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-2xs"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items by name or category..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Item List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-600">No items found</p>
              <p className="text-xs text-slate-400 mt-1">Add items above to build your standard rate list.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white flex items-center justify-between gap-3 transition-all"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                      {item.name}
                    </span>
                    {item.category && (
                      <span className="text-[10px] px-2 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono font-bold text-emerald-700">
                    NPR {formatNPR(item.rate)}{' '}
                    <span className="text-[10px] font-normal text-slate-400">/{item.unit || 'pcs'}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {onSelectItem && (
                    <button
                      onClick={() => {
                        onSelectItem({ description: item.name, rate: item.rate });
                        onClose();
                      }}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 rounded-lg text-xs font-bold transition-colors"
                    >
                      <span>Insert</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  {item.userId !== 'admin_1' && (
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
