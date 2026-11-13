const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanOneThousand(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ones[n] + ' ';
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '') + ' ';
  return ones[Math.floor(n / 100)] + ' Hundred ' + convertLessThanOneThousand(n % 100);
}

/**
 * Converts a number to Nepali/South Asian numbering words (Lakh, Crore)
 */
export function numberToWordsNPR(num: number): string {
  if (isNaN(num) || num <= 0) return 'Zero Rupees Only';

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  // South Asian scale: Units, Thousands, Lakhs, Crores
  const crore = Math.floor(integerPart / 10000000);
  const lakh = Math.floor((integerPart % 10000000) / 100000);
  const thousand = Math.floor((integerPart % 100000) / 1000);
  const remainder = integerPart % 1000;

  let words = '';

  if (crore > 0) {
    words += convertLessThanOneThousand(crore).trim() + ' Crore ';
  }
  if (lakh > 0) {
    words += convertLessThanOneThousand(lakh).trim() + ' Lakh ';
  }
  if (thousand > 0) {
    words += convertLessThanOneThousand(thousand).trim() + ' Thousand ';
  }
  if (remainder > 0) {
    words += convertLessThanOneThousand(remainder).trim() + ' ';
  }

  words = words.trim();
  let result = `Nepali Rupees ${words}`;

  if (decimalPart > 0) {
    result += ` and ${convertLessThanOneThousand(decimalPart).trim()} Paisa`;
  }

  result += ' Only';
  return result;
}

export function formatNPR(amount: number): string {
  if (isNaN(amount)) return '0.00';
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
