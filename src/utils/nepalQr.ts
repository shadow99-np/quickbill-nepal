import { PaymentDetails } from '@/types/invoice';

/**
 * Builds payment QR payload string for Nepal's digital payment networks
 */
export function generateNepalQrString(payment: PaymentDetails, amount: number): string {
  const finalAmount = payment.embedAmountInQr ? amount.toFixed(2) : '';

  switch (payment.method) {
    case 'fonepay': {
      const merchant = payment.merchantId || payment.phoneNumber || 'MERCHANT_88329';
      if (finalAmount) {
        return `fonepay://pay?merchantId=${encodeURIComponent(merchant)}&amount=${finalAmount}&remarks=QuickBillInvoice`;
      }
      return `fonepay://pay?merchantId=${encodeURIComponent(merchant)}`;
    }
    case 'esewa': {
      const id = payment.phoneNumber || '9801234567';
      if (finalAmount) {
        return `https://esewa.com.np/pay?to=${encodeURIComponent(id)}&amt=${finalAmount}`;
      }
      return `https://esewa.com.np/pay?to=${encodeURIComponent(id)}`;
    }
    case 'khalti': {
      const mobile = payment.phoneNumber || '9801234567';
      if (finalAmount) {
        return `https://khalti.com/pay?mobile=${encodeURIComponent(mobile)}&amount=${finalAmount}`;
      }
      return `https://khalti.com/pay?mobile=${encodeURIComponent(mobile)}`;
    }
    case 'bank': {
      return `IBFT:${payment.bankName || 'Nabil Bank'}|ACC:${payment.accountNumber || ''}|NAME:${encodeURIComponent(payment.accountName || '')}|AMT:${finalAmount}`;
    }
    default:
      return `PAY:${payment.phoneNumber || '9801234567'}|NPR:${finalAmount}`;
  }
}
