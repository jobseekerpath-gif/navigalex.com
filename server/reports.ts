// Validation and PDF text for the fixed-price instant reports. No invoice or financial figures are stored:
// they arrive with the paid PDF request, are turned into text and discarded.
import { isIsoDate, screenSupplierInvoice, addDays, inr, type SupplierInvoice } from '../src/lib/msmeInterest.ts';
import { assessLoan, COMMON_LENDER_DOCUMENTS, type LoanInput } from '../src/lib/loanReadiness.ts';

const MAX_MONEY = 1e11;
const text = (v: unknown, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const money = (v: unknown, opts: { allowZero?: boolean; allowNegative?: boolean } = {}) => {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN;
  if (!Number.isFinite(n) || Math.abs(n) > MAX_MONEY) return null;
  if (!opts.allowNegative && n < 0) return null;
  if (!opts.allowZero && !opts.allowNegative && n === 0) return null;
  return n;
};

export type Checked<T> = { ok: true; value: T } | { ok: false; error: string };
const bad = (error: string): { ok: false; error: string } => ({ ok: false, error });

export type SupplierPackInput = { supplier: string; buyer: string; bankRate: number; invoices: SupplierInvoice[] };

export function checkSupplierPack(body: any): Checked<SupplierPackInput> {
  const rate = Number(body?.bankRate);
  if (!Number.isFinite(rate) || rate <= 0 || rate > 30) return bad('Enter the RBI bank rate as a number between 0 and 30.');
  const rows = Array.isArray(body?.invoices) ? body.invoices : [];
  if (!rows.length) return bad('Add at least one invoice.');
  if (rows.length > 20) return bad('A pack can include at most 20 invoices.');
  const invoices: SupplierInvoice[] = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const amount = money(r?.amount);
    if (amount === null) return bad('Invoice ' + (i + 1) + ': enter a positive amount.');
    if (!isIsoDate(r?.dueDate)) return bad('Invoice ' + (i + 1) + ': enter a valid due date.');
    const paymentDate = r?.paymentDate ? r.paymentDate : '';
    if (paymentDate && !isIsoDate(paymentDate)) return bad('Invoice ' + (i + 1) + ': the payment date is not valid.');
    invoices.push({ invoice: text(r?.invoice, 60) || 'Invoice ' + (i + 1), amount, dueDate: r.dueDate, paymentDate });
  }
  const supplier = text(body?.supplier, 100), buyer = text(body?.buyer, 100);
  if (!supplier || !buyer) return bad('Enter both the supplier (your business) and the buyer name.');
  return { ok: true, value: { supplier, buyer, bankRate: rate, invoices } };
}

export function supplierPackLines(input: SupplierPackInput, today: string): string[] {
  const results = input.invoices.map(inv => screenSupplierInvoice(inv, input.bankRate, today));
  const principal = results.reduce((s, r) => s + r.amount, 0);
  const interest = results.reduce((s, r) => s + r.interest, 0);
  const unpaid = results.filter(r => !r.paid);
  const lines: string[] = [
    'NAVIGALEX - DELAYED PAYMENT FOLLOW-UP PACK',
    'Prepared: ' + today + ' | Supplier: ' + input.supplier + ' | Buyer: ' + input.buyer,
    'Bank rate assumed: ' + input.bankRate + '% p.a. (interest estimated at three times this rate, compounded monthly). Confirm the current RBI bank rate.',
    '', '1. CALCULATION SCHEDULE'
  ];
  results.forEach((r, i) => {
    lines.push((i + 1) + '. ' + r.invoice + ' | Principal ' + inr(r.amount) + ' | Due ' + r.dueDate + ' | ' + (r.paid ? 'Paid ' + r.paymentDate : 'Unpaid as of ' + today));
    lines.push('   Days late: ' + r.daysLate + ' | Estimated interest ' + inr(r.interest) + ' | Principal plus interest ' + inr(r.total));
  });
  lines.push('', 'Totals: principal ' + inr(principal) + ' | estimated interest ' + inr(interest) + ' | principal plus interest ' + inr(principal + interest));
  lines.push('', '2. FOLLOW-UP LETTER (your own letter - review, edit and sign before sending)');
  const detail = results.map(r => r.invoice + ' of ' + inr(r.amount) + ' (due ' + r.dueDate + ', ' + (r.paid ? 'paid ' + r.paymentDate : 'unpaid') + ', ' + r.daysLate + ' days beyond due date)').join('; ');
  lines.push(
    'To: ' + input.buyer, 'From: ' + input.supplier, 'Date: ' + today, '',
    'Subject: Request for payment of overdue invoices', '',
    'Dear Sir or Madam,', '',
    'This is a follow-up on the following invoices: ' + detail + '.', '',
    'On an indicative basis, using a bank-rate assumption of ' + input.bankRate + '% per annum and interest at three times that rate with monthly rests, the estimated delayed-payment interest is ' + inr(interest) + ' on a principal of ' + inr(principal) + '. This is subject to confirmation of the applicable terms, payment history and the relevant RBI bank rate.', '',
    unpaid.length ? 'Please arrange payment of the outstanding amount and share the remittance details within seven days. If your records show a different position, please tell me promptly.' : 'Please confirm that the payments have been received and reconciled in your records, and share the remittance references if not already provided.', '',
    'Regards,', input.supplier
  );
  lines.push('', '3. WHAT TO DO NEXT');
  const next7 = addDays(today, 7), next15 = addDays(today, 15);
  [
    'Send the letter above by email and a trackable courier or hand delivery. Keep proof of sending.',
    'If there is no reply by ' + next7 + ', send one polite reminder referring to this letter.',
    'If there is still no payment by ' + next15 + ', check the current MSME dispute route (MSME Samadhaan or its successor portal) and whether you are eligible, before filing. Rules were amended in 2026; confirm what is in force.',
    'Keep these together: purchase order or contract, invoices, delivery proof, acceptance or receipt proof, ledger statement, bank credits, and all correspondence.',
    'Confirm your own Udyam registration category and that it covers the goods or services supplied; protection depends on eligibility.'
  ].forEach((s, i) => lines.push((i + 1) + '. ' + s));
  lines.push('', 'LIMITATIONS',
    'This is a business follow-up draft and a screening estimate. It is not an advocate\'s notice, legal advice, or a finding that the MSMED Act applies to you. Dates, agreements, acceptance, partial payments, disputes and credit notes can change the figures. Confirm with your CA or a qualified adviser before relying on it.',
    'The figures you entered were used only to create this PDF and are not stored.');
  return lines;
}

export function checkLoan(body: any): Checked<LoanInput> {
  const req = (v: unknown, label: string, opts?: { allowZero?: boolean; allowNegative?: boolean }) => {
    const n = money(v, opts);
    return n === null ? label : n;
  };
  const turnoverLatest = req(body?.turnoverLatest, 'Latest year turnover');
  const turnoverPrevious = req(body?.turnoverPrevious ?? 0, 'Previous year turnover', { allowZero: true });
  const netProfit = req(body?.netProfit, 'Net profit', { allowNegative: true });
  const depreciation = req(body?.depreciation ?? 0, 'Depreciation', { allowZero: true });
  const interestPaid = req(body?.interestPaid ?? 0, 'Interest paid', { allowZero: true });
  const existingPrincipalRepayment = req(body?.existingPrincipalRepayment ?? 0, 'Existing principal repayment', { allowZero: true });
  const proposedAmount = req(body?.proposedAmount, 'Proposed loan amount');
  const collateralValue = req(body?.collateralValue ?? 0, 'Collateral value', { allowZero: true });
  const proposedRate = Number(body?.proposedRate), proposedTenureYears = Number(body?.proposedTenureYears);
  const all = { turnoverLatest, turnoverPrevious, netProfit, depreciation, interestPaid, existingPrincipalRepayment, proposedAmount, collateralValue };
  for (const [, v] of Object.entries(all)) if (typeof v === 'string') return bad(v + ' must be a valid number.');
  if (!Number.isFinite(proposedRate) || proposedRate <= 0 || proposedRate > 40) return bad('Proposed interest rate must be between 0 and 40% a year.');
  if (!Number.isFinite(proposedTenureYears) || proposedTenureYears < 0.5 || proposedTenureYears > 30) return bad('Tenure must be between 0.5 and 30 years.');
  return { ok: true, value: { ...(all as Record<keyof typeof all, number>), proposedRate, proposedTenureYears } };
}

export function loanReadinessLines(input: LoanInput, business: string, today: string): string[] {
  const r = assessLoan(input);
  const pct = (v: number | null) => (v === null ? 'Not available' : v.toFixed(2) + '%');
  const x = (v: number | null) => (v === null ? 'Not available' : v.toFixed(2) + 'x');
  const lines: string[] = [
    'NAVIGALEX - LOAN READINESS SNAPSHOT',
    'Prepared: ' + today + (business ? ' | Business: ' + business : ''),
    '', 'RESULT: ' + r.band + (r.combinedDscr !== null ? ' (combined DSCR ' + x(r.combinedDscr) + ')' : ''),
    '', '1. YOUR INPUTS',
    'Turnover: latest ' + inr(input.turnoverLatest) + ' | previous ' + (input.turnoverPrevious ? inr(input.turnoverPrevious) : 'not entered'),
    'Net profit ' + inr(input.netProfit) + ' | Depreciation ' + inr(input.depreciation) + ' | Interest paid ' + inr(input.interestPaid),
    'Existing loan principal due in next 12 months ' + inr(input.existingPrincipalRepayment),
    'Proposed loan ' + inr(input.proposedAmount) + ' at ' + input.proposedRate + '% for ' + input.proposedTenureYears + ' years | Collateral value ' + (input.collateralValue ? inr(input.collateralValue) : 'none entered'),
    '', '2. HOW REPAYMENT LOOKS',
    'Cash available for debt service (profit + depreciation + interest): ' + inr(r.cashAccrual),
    'Existing yearly obligation (interest + principal): ' + inr(r.existingObligation) + ' | DSCR today: ' + x(r.existingDscr),
    'Proposed monthly instalment: ' + inr(r.proposedEmi) + ' | Yearly: ' + inr(r.proposedAnnualService),
    'Combined DSCR after the new loan: ' + x(r.combinedDscr),
    'Guide: 1.5x or more is strong; 1.25x to 1.5x is commonly acceptable; 1.0x to 1.25x is weak; below 1.0x cannot repay from profit. Lenders differ.',
    '', '3. OTHER RATIOS',
    'Profit margin ' + pct(r.profitMarginPct) + ' | Turnover growth ' + pct(r.turnoverGrowthPct) + ' | Loan as % of turnover ' + pct(r.loanToTurnoverPct),
    'Interest cover ' + x(r.interestCover) + ' | Collateral cover ' + pct(r.collateralCoverPct),
    '', '4. POINTS TO FIX OR EXPLAIN BEFORE YOU APPLY'
  ];
  if (r.flags.length) r.flags.forEach((f, i) => lines.push((i + 1) + '. ' + f)); else lines.push('No major flags on these inputs.');
  lines.push('', '5. DOCUMENTS LENDERS COMMONLY ASK FOR (varies by lender and scheme)');
  COMMON_LENDER_DOCUMENTS.forEach((d, i) => lines.push((i + 1) + '. ' + d));
  lines.push('', 'LIMITATIONS',
    'This is an indicative screening based only on the numbers you entered. It is not a credit appraisal, CMA data certification, lender approval, or advice to borrow. Lenders use their own methods and may treat items differently. Confirm with your CA and your lender.',
    'The figures you entered were used only to create this PDF and are not stored.');
  return lines;
}
