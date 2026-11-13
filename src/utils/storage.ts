import { BusinessProfile, PaymentDetails, InvoiceData } from '@/types/invoice';

const PROFILE_KEY = 'quickbill_saved_business_profile';
const INVOICES_KEY = 'quickbill_invoices_history';

export interface SavedBusinessData {
  issuer: BusinessProfile;
  payment: PaymentDetails;
  updatedAt: string;
}

/**
 * Saves the user's business profile and default payment info
 * so they never have to re-type it for subsequent invoices.
 */
export function saveBusinessProfile(issuer: BusinessProfile, payment: PaymentDetails): void {
  try {
    const data: SavedBusinessData = {
      issuer,
      payment,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save business profile', e);
  }
}

/**
 * Loads the saved business profile and default payment info.
 */
export function getSavedBusinessProfile(): SavedBusinessData | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load business profile', e);
    return null;
  }
}

/**
 * Saves or updates an invoice in the local history.
 */
export function saveInvoiceToHistory(invoice: InvoiceData): InvoiceData[] {
  try {
    const history = getInvoiceHistory();
    const existingIndex = history.findIndex((inv) => inv.id === invoice.id);

    let updatedHistory: InvoiceData[];
    if (existingIndex >= 0) {
      updatedHistory = [...history];
      updatedHistory[existingIndex] = invoice;
    } else {
      updatedHistory = [invoice, ...history];
    }

    localStorage.setItem(INVOICES_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (e) {
    console.error('Failed to save invoice to history', e);
    return getInvoiceHistory();
  }
}

/**
 * Returns all saved invoices from history.
 */
export function getInvoiceHistory(): InvoiceData[] {
  try {
    const raw = localStorage.getItem(INVOICES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load invoice history', e);
    return [];
  }
}

/**
 * Deletes an invoice from history by ID.
 */
export function deleteInvoiceFromHistory(id: string): InvoiceData[] {
  try {
    const history = getInvoiceHistory();
    const updated = history.filter((inv) => inv.id !== id);
    localStorage.setItem(INVOICES_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete invoice', e);
    return getInvoiceHistory();
  }
}

/**
 * Exports all saved invoices into the official Nepal Inland Revenue Department (IRD)
 * Sales Register (बिक्री खाता) CSV format.
 */
export function exportIRDSalesRegisterCSV(invoices: InvoiceData[]): void {
  if (!invoices.length) {
    alert('No invoices found to export. Create at least one invoice first.');
    return;
  }

  // IRD Standard Columns
  const headers = [
    'S.N.',
    'Date (BS)',
    'Date (AD)',
    'Invoice No (बीजक नं)',
    'Buyer Name (क्रेताको नाम)',
    'Buyer PAN (क्रेताको प्यान)',
    'Taxable Sales (करयोग्य बिक्री रु)',
    'Non-Taxable Sales (कर छुट बिक्री रु)',
    '13% VAT (मूल्य अभिवृद्धि कर रु)',
    'Total Amount (जम्मा रकम रु)',
    'Status'
  ];

  const rows = invoices.map((inv, index) => {
    const taxable = inv.hasVat ? (inv.subtotal - inv.discount).toFixed(2) : '0.00';
    const nonTaxable = !inv.hasVat ? (inv.subtotal - inv.discount).toFixed(2) : '0.00';
    const vat = inv.hasVat ? inv.vatAmount.toFixed(2) : '0.00';
    const total = inv.grandTotal.toFixed(2);

    return [
      index + 1,
      `"${inv.invoiceDateBS}"`,
      `"${inv.invoiceDateAD}"`,
      `"${inv.invoiceNumber}"`,
      `"${inv.client.name || 'Cash Customer'}"`,
      `"${inv.client.pan || ''}"`,
      taxable,
      nonTaxable,
      vat,
      total,
      inv.status.toUpperCase()
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `IRD_Sales_Register_Nepal_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
