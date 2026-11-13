export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export type PaymentMethod = 'fonepay' | 'esewa' | 'khalti' | 'bank';

export interface PaymentDetails {
  method: PaymentMethod;
  merchantId: string;
  phoneNumber: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  branchName: string;
  customQrImage?: string;
  embedAmountInQr: boolean;
}

export interface BusinessProfile {
  name: string;
  pan: string;
  phone: string;
  email: string;
  address: string;
  logoUrl?: string;
}

export interface ClientProfile {
  name: string;
  pan: string;
  phone: string;
  email: string;
  address: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  fiscalYear: string;
  invoiceDateBS: string;
  invoiceDateAD: string;
  dueDate: string;
  paymentTerms: string;
  issuer: BusinessProfile;
  client: ClientProfile;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  hasVat: boolean;
  vatRate: number; // usually 13 in Nepal
  vatAmount: number;
  grandTotal: number;
  amountInWords: string;
  notes: string;
  termsAndConditions: string;
  payment: PaymentDetails;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  currency?: 'NPR' | 'USD' | 'INR' | 'EUR' | 'GBP';
  currencySymbol?: string;
  discountType?: 'flat' | 'percentage';
  discountValue?: number;
}
