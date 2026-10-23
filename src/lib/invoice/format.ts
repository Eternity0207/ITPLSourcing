const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-07-17" -> "17-Jul-26", the format used on the invoices. */
export function formatInvoiceDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return iso;
  const [, year, month, day] = match;
  return `${day}-${MONTHS[Number(month) - 1]}-${year.slice(2)}`;
}

export function formatMoney(value: number, decimals = 2) {
  return value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const CURRENCY_WORDS: Record<string, { major: string; minor: string }> = {
  USD: { major: "US Dollars", minor: "Cents" },
  EUR: { major: "Euros", minor: "Cents" },
  GBP: { major: "Pounds Sterling", minor: "Pence" },
  AUD: { major: "Australian Dollars", minor: "Cents" },
  CAD: { major: "Canadian Dollars", minor: "Cents" },
  AED: { major: "UAE Dirhams", minor: "Fils" },
  SGD: { major: "Singapore Dollars", minor: "Cents" },
  INR: { major: "Indian Rupees", minor: "Paise" },
};

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function belowThousand(n: number) {
  const words: string[] = [];
  if (n >= 100) {
    words.push(`${ONES[Math.floor(n / 100)]} Hundred`);
    n %= 100;
  }
  if (n >= 20) {
    words.push(TENS[Math.floor(n / 10)]);
    n %= 10;
  }
  if (n > 0) words.push(ONES[n]);
  return words.join(" ");
}

function integerToWords(n: number, indian: boolean) {
  if (n === 0) return "Zero";
  const scales: [number, string][] = indian
    ? [[1e7, "Crore"], [1e5, "Lakh"], [1e3, "Thousand"]]
    : [[1e12, "Trillion"], [1e9, "Billion"], [1e6, "Million"], [1e3, "Thousand"]];

  const words: string[] = [];
  for (const [size, name] of scales) {
    if (n >= size) {
      const count = Math.floor(n / size);
      // Indian crores can exceed 999, so spell those recursively.
      words.push(`${count >= 1000 ? integerToWords(count, indian) : belowThousand(count)} ${name}`);
      n %= size;
    }
  }
  if (n > 0) words.push(belowThousand(n));
  return words.join(" ");
}

/** 561 -> "Five Hundred Sixty One US Dollars Only" */
export function amountInWords(amount: number, currency: string) {
  const names = CURRENCY_WORDS[currency] ?? { major: currency, minor: "Cents" };
  const cents = Math.round(Math.abs(amount) * 100);
  const major = Math.floor(cents / 100);
  const minor = cents % 100;
  const indian = currency === "INR";

  let words = `${integerToWords(major, indian)} ${names.major}`;
  if (minor) words += ` and ${integerToWords(minor, indian)} ${names.minor}`;
  return `${words} Only`;
}
