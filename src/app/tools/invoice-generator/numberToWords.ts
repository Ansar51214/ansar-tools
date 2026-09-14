// Utility: Convert numeric amounts into spoken currency words

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanThousand(num: number): string {
  let result = '';

  if (num >= 100) {
    result += ONES[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }

  if (num >= 20) {
    result += TENS[Math.floor(num / 10)] + ' ';
    num %= 10;
  }

  if (num > 0) {
    result += ONES[num] + ' ';
  }

  return result.trim();
}

/**
 * Converts integer numbers to words using Western scale (Billion, Million, Thousand)
 */
export function integerToWords(num: number): string {
  if (num === 0) return 'Zero';

  let words = '';

  if (num >= 1_000_000_000) {
    words += convertLessThanThousand(Math.floor(num / 1_000_000_000)) + ' Billion ';
    num %= 1_000_000_000;
  }

  if (num >= 1_000_000) {
    words += convertLessThanThousand(Math.floor(num / 1_000_000)) + ' Million ';
    num %= 1_000_000;
  }

  if (num >= 1_000) {
    words += convertLessThanThousand(Math.floor(num / 1_000)) + ' Thousand ';
    num %= 1_000;
  }

  if (num > 0) {
    words += convertLessThanThousand(num);
  }

  return words.trim();
}

/**
 * Formats full currency amount to words (e.g., "$1,250.50" => "One Thousand Two Hundred Fifty US Dollars and Fifty Cents Only")
 */
export function currencyToWords(amount: number, currencyCode: string = 'USD'): string {
  if (isNaN(amount) || amount === 0) {
    return `Zero ${getCurrencyUnitName(currencyCode, 1)} Only`;
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const integerPart = Math.floor(absAmount);
  const decimalPart = Math.round((absAmount - integerPart) * 100);

  const integerWords = integerToWords(integerPart);
  const currencyName = getCurrencyUnitName(currencyCode, integerPart);
  const subUnitName = getCurrencySubUnitName(currencyCode, decimalPart);

  let result = `${integerWords} ${currencyName}`;

  if (decimalPart > 0) {
    const decimalWords = integerToWords(decimalPart);
    result += ` and ${decimalWords} ${subUnitName}`;
  }

  result += ' Only';

  return (isNegative ? 'Minus ' : '') + result;
}

function getCurrencyUnitName(code: string, amount: number): string {
  const isPlural = amount !== 1;
  switch (code.toUpperCase()) {
    case 'PKR':
      return 'Pakistani Rupees';
    case 'INR':
      return 'Indian Rupees';
    case 'USD':
      return isPlural ? 'US Dollars' : 'US Dollar';
    case 'EUR':
      return 'Euros';
    case 'GBP':
      return isPlural ? 'British Pounds' : 'British Pound';
    case 'AED':
      return 'UAE Dirhams';
    case 'SAR':
      return 'Saudi Riyals';
    case 'CAD':
      return isPlural ? 'Canadian Dollars' : 'Canadian Dollar';
    case 'AUD':
      return isPlural ? 'Australian Dollars' : 'Australian Dollar';
    default:
      return code;
  }
}

function getCurrencySubUnitName(code: string, amount: number): string {
  const isPlural = amount !== 1;
  switch (code.toUpperCase()) {
    case 'PKR':
    case 'INR':
      return 'Paise';
    case 'USD':
    case 'CAD':
    case 'AUD':
    case 'EUR':
      return isPlural ? 'Cents' : 'Cent';
    case 'GBP':
      return isPlural ? 'Pence' : 'Penny';
    case 'AED':
      return 'Fils';
    case 'SAR':
      return 'Halalas';
    default:
      return 'Cents';
  }
}
