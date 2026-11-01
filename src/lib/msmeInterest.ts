// Shared by the browser preview and the server-generated PDF so both always show the same numbers.
// Screening estimate only: MSMED Act interest is three times the RBI bank rate, compounded with monthly rests.

export type SupplierInvoice = {
  invoice: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  paymentDate: string; // YYYY-MM-DD or ''
};

export type SupplierInvoiceResult = SupplierInvoice & {
  daysLate: number;
  interest: number;
  total: number;
  paid: boolean;
};

const DAY_MS = 86400000;

export function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function daysBetween(from: string, to: string): number {
  return Math.floor((Date.parse(to + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) / DAY_MS);
}

export function addDays(value: string, days: number): string {
  const d = new Date(value + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function compoundInterest(principal: number, bankRatePercent: number, daysLate: number): number {
  if (!(principal > 0) || !(bankRatePercent > 0) || daysLate <= 0) return 0;
  const monthlyRate = (bankRatePercent * 3) / 100 / 12;
  return principal * (Math.pow(1 + monthlyRate, daysLate / 30.4375) - 1);
}

export function screenSupplierInvoice(inv: SupplierInvoice, bankRatePercent: number, today: string): SupplierInvoiceResult {
  const paid = Boolean(inv.paymentDate);
  const end = paid ? inv.paymentDate : today;
  const daysLate = Math.max(0, daysBetween(inv.dueDate, end));
  const interest = compoundInterest(inv.amount, bankRatePercent, daysLate);
  return { ...inv, daysLate, interest, total: inv.amount + interest, paid };
}

export function inr(n: number): string {
  return 'INR ' + new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
