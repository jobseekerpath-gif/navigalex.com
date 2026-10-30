import React, { useMemo, useState } from 'react';
import { Download, FileSpreadsheet, ShieldCheck, Upload } from 'lucide-react';

type Invoice = {
  supplier: string;
  invoice: string;
  acceptanceDate: string;
  amount: number;
  paymentDate: string;
  writtenAgreement: 'yes' | 'no' | 'unknown';
  agreedDays: number | null;
  udyamStatus: 'yes' | 'no' | 'unknown';
};

type Result = Invoice & {
  dueDate: string;
  daysLate: number;
  estimatedInterest: number | null;
  outstandingAtYearEnd: number;
  disallowanceFlag: boolean | null;
  notes: string[];
};

const aliases: Record<string, string[]> = {
  supplier: ['supplier', 'vendor', 'vendor name', 'supplier name', 'party', 'party name'],
  invoice: ['invoice', 'invoice no', 'invoice number', 'bill no', 'bill number', 'document number'],
  acceptanceDate: ['acceptance date', 'accepted date', 'deemed acceptance date', 'delivery date'],
  amount: ['amount', 'invoice amount', 'invoice value', 'bill amount', 'total amount'],
  paymentDate: ['payment date', 'paid date', 'date paid', 'settlement date'],
  writtenAgreement: ['written agreement', 'agreement', 'written terms'],
  agreedDays: ['agreed days', 'payment terms days', 'credit days', 'payment days'],
  udyamStatus: ['udyam status', 'msme status', 'supplier msme', 'micro small status']
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (ch === ',' && !quoted) {
      row.push(cell.trim()); cell = '';
    } else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell.trim()); cell = '';
      if (row.some(v => v !== '')) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell.trim());
  if (row.some(v => v !== '')) rows.push(row);
  return rows;
}

function isoDate(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;
  let year: number, month: number, day: number;
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(raw);
  const indian = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(raw);
  if (iso) { year = +iso[1]; month = +iso[2]; day = +iso[3]; }
  else if (indian) { day = +indian[1]; month = +indian[2]; year = +indian[3]; }
  else return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
    ? date.toISOString().slice(0, 10) : null;
}

function plusDays(value: string, days: number): string {
  const d = new Date(value + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
function dayDiff(from: string, to: string): number {
  return Math.floor((Date.parse(to + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) / 86400000);
}
function money(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
}
function normalizeHeader(s: string): string { return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }

export default function MSME43BChecker() {
  const [fileName, setFileName] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [rate, setRate] = useState('6');
  const [taxYear, setTaxYear] = useState('2025-26');
  const [fileError, setFileError] = useState('');

  const results = useMemo<Result[]>(() => {
    const yearEnd = taxYear === '2025-26' ? '2026-03-31' : '2027-03-31';
    const bankRate = Number(rate);
    return invoices.map(inv => {
      const days = inv.writtenAgreement === 'no' ? 15 :
        inv.writtenAgreement === 'yes' && inv.agreedDays !== null ? Math.min(inv.agreedDays, 45) : 45;
      const dueDate = plusDays(inv.acceptanceDate, days);
      const effectiveDate = inv.paymentDate || new Date().toISOString().slice(0, 10);
      const daysLate = Math.max(0, dayDiff(dueDate, effectiveDate));
      const interestApplicable = inv.udyamStatus === 'yes' && Number.isFinite(bankRate) && bankRate > 0 && bankRate <= 30;
      const estimatedInterest = interestApplicable
        ? inv.amount * (Math.pow(1 + ((bankRate * 3) / 100) / 12, daysLate / 30.4375) - 1)
        : null;
      const unpaidAtYearEnd = !inv.paymentDate || inv.paymentDate > yearEnd;
      const disallowanceFlag = inv.udyamStatus === 'yes'
        ? unpaidAtYearEnd && dueDate < yearEnd
        : null;
      const notes: string[] = [];
      if (inv.writtenAgreement === 'unknown') notes.push('Written payment terms not confirmed; 45 days used only as a screening assumption.');
      if (inv.writtenAgreement === 'yes' && inv.agreedDays === null) notes.push('Written term missing; 45-day outer limit used as a screening assumption.');
      if (inv.writtenAgreement === 'yes' && (inv.agreedDays ?? 0) > 45) notes.push('Entered term exceeds 45 days; capped at 45 days for screening.');
      if (inv.udyamStatus !== 'yes') notes.push('Supplier micro/small status and activity eligibility are not confirmed; statutory flags and interest are not determined.');
      else notes.push('Eligibility is user-entered and not independently verified. Confirm Udyam status and eligible activity before relying on this result.');
      if (inv.paymentDate && inv.paymentDate < inv.acceptanceDate) notes.push('Payment date precedes acceptance date; verify the source data.');
      if (inv.paymentDate && daysLate > 0) notes.push('Interest estimate uses one full payment date. Partial payments and multiple payments are not modelled.');
      if (!inv.paymentDate && daysLate > 0) notes.push('Invoice is treated as unpaid through today for this estimate.');
      return { ...inv, dueDate, daysLate, estimatedInterest, outstandingAtYearEnd: unpaidAtYearEnd ? inv.amount : 0, disallowanceFlag, notes };
    });
  }, [invoices, rate, taxYear]);

  const importCsv = async (file?: File) => {
    setFileError(''); setErrors([]); setInvoices([]); setFileName('');
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setFileError('CSV must be 5 MB or smaller.'); return; }
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      setFileError('For this privacy-first beta, upload a CSV export from Excel or Tally. XLS/XLSX files are not uploaded or parsed in this version.');
      return;
    }
    const text = await file.text();
    const table = parseCsv(text);
    if (table.length < 2) { setFileError('The CSV needs a header row and at least one invoice row.'); return; }
    const headers = table[0].map(normalizeHeader);
    const map: Record<string, number> = {};
    for (const [field, names] of Object.entries(aliases)) {
      const index = headers.findIndex(h => names.includes(h));
      if (index >= 0) map[field] = index;
    }
    const required = ['acceptanceDate', 'amount'];
    const missing = required.filter(k => map[k] === undefined);
    if (missing.length) { setFileError('Missing required columns: ' + missing.map(k => k === 'acceptanceDate' ? 'acceptance or deemed-acceptance date (invoice date alone is not sufficient)' : k).join(', ') + '.'); return; }
    const parsed: Invoice[] = [];
    const rowErrors: string[] = [];
    table.slice(1).forEach((cells, idx) => {
      const get = (key: string) => map[key] === undefined ? '' : (cells[map[key]] ?? '').trim();
      const acceptanceDate = isoDate(get('acceptanceDate'));
      const amount = Number(get('amount').replace(/[₹,\s]/g, ''));
      const paymentDateRaw = get('paymentDate');
      const paymentDate = paymentDateRaw ? (isoDate(paymentDateRaw) ?? '') : '';
      const agreementRaw = get('writtenAgreement').toLowerCase();
      const writtenAgreement: Invoice['writtenAgreement'] = /^(yes|y|true|written)$/.test(agreementRaw) ? 'yes' : /^(no|n|false|none)$/.test(agreementRaw) ? 'no' : 'unknown';
      const daysRaw = get('agreedDays');
      const agreedDays = daysRaw && /^\d+$/.test(daysRaw) ? Number(daysRaw) : null;
      const msmeRaw = get('udyamStatus').toLowerCase();
      const udyamStatus: Invoice['udyamStatus'] = /^(yes|y|true|micro|small|confirmed|eligible)$/.test(msmeRaw) ? 'yes' : /^(no|n|false|not eligible|not msme)$/.test(msmeRaw) ? 'no' : 'unknown';
      if (!acceptanceDate || !Number.isFinite(amount) || amount <= 0 || (paymentDateRaw && !paymentDate)) {
        rowErrors.push('Row ' + (idx + 2) + ': invalid acceptance date, amount or payment date; skipped.');
        return;
      }
      parsed.push({
        supplier: get('supplier') || 'Not supplied',
        invoice: get('invoice') || 'Row ' + (idx + 2),
        acceptanceDate, amount, paymentDate,
        writtenAgreement, agreedDays, udyamStatus
      });
    });
    if (!parsed.length) { setFileError('No valid invoice rows were found. Check the dates and amounts.'); setErrors(rowErrors); return; }
    setFileName(file.name); setInvoices(parsed); setErrors(rowErrors);
  };

  const downloadReport = () => {
    const header = ['Supplier','Invoice','Acceptance date','Indicative deadline','Invoice amount INR','Payment date','Days late (screening)','Estimated interest INR','Outstanding at selected year-end INR','Potential tax timing flag','Notes'];
    const escape = (value: unknown) => '"' + String(value ?? '').replace(/"/g, '""') + '"';
    const lines = [header, ...results.map(r => [
      r.supplier, r.invoice, r.acceptanceDate, r.dueDate, r.amount.toFixed(2), r.paymentDate,
      r.daysLate, r.estimatedInterest === null ? 'Not determined' : r.estimatedInterest.toFixed(2),
      r.outstandingAtYearEnd.toFixed(2), r.disallowanceFlag === null ? 'Unconfirmed eligibility' : r.disallowanceFlag ? 'Review possible disallowance' : 'No flag from entered data',
      r.notes.join(' ')
    ])].map(row => row.map(escape).join(',')).join('\r\n');
    const blob = new Blob(['\uFEFF' + lines], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'navigalex-msme-payment-screening.csv'; link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 space-y-5">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-blue-50 p-3 text-blue-700"><FileSpreadsheet className="h-5 w-5" /></span>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Free beta · runs in your browser</p>
          <h3 className="mt-1 text-xl font-extrabold text-slate-950">MSME payment ledger checker</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">Screen invoice-level payment timing, possible year-end tax flags and an indicative interest estimate from a CSV exported by Excel or Tally. Mark supplier eligibility only after checking the supplier's Udyam certificate and activity type; trading registrations may not qualify for MSMED delayed-payment protections. Your ledger file is processed in this browser and is not sent to Navigalex's server by this tool.</p>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950">
        <strong>Important limitations:</strong> This beta handles one invoice row and at most one full payment date per invoice. It does not handle partial payments, FIFO matching, Udyam verification, multiple credits or formal Form 3CD Clause 22. Results are screening estimates, not tax advice or a CA-certified report. Do not rely on it without professional review.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">Tax year / rule reference
          <select value={taxYear} onChange={e => setTaxYear(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm">
            <option value="2025-26">Tax year 2025–26 · Income-tax Act 1961, section 43B(h)</option>
            
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700">RBI bank rate used for estimate (% p.a.)
          <input type="number" min="0" max="30" step="0.01" value={rate} onChange={e => setRate(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm" />
          <span className="mt-1 block text-xs font-normal text-slate-500">Default 6% is a starting assumption, not a live RBI feed. Confirm the applicable rate before use.</span>
        </label>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center hover:border-blue-400">
        <Upload className="h-6 w-6 text-blue-700" />
        <span className="text-sm font-bold text-slate-800">Choose a CSV ledger</span>
        <span className="text-xs text-slate-500">Maximum 5 MB · CSV only · headers are matched flexibly</span>
        <input type="file" accept=".csv,text/csv" className="sr-only" onChange={e => void importCsv(e.target.files?.[0])} />
      </label>
      {fileError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{fileError}</p>}
      {fileName && <p className="text-xs text-slate-600">Loaded {fileName}: {invoices.length} valid invoice rows. Processing stays in this browser.</p>}
      {errors.length > 0 && <ul className="list-disc space-y-1 pl-5 text-xs text-amber-800">{errors.slice(0, 8).map((e, i) => <li key={i}>{e}</li>)}</ul>}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Invoices screened</p><p className="mt-1 text-xl font-bold text-slate-900">{results.length}</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Late / possibly late</p><p className="mt-1 text-xl font-bold text-slate-900">{results.filter(r => r.daysLate > 0).length}</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Year-end amounts flagged for review</p><p className="mt-1 text-xl font-bold text-slate-900">{money(results.filter(r => r.disallowanceFlag === true).reduce((sum, r) => sum + r.amount, 0))}</p></div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-[760px] w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Supplier / invoice</th><th className="p-3">Indicative deadline</th><th className="p-3">Payment</th><th className="p-3">Days late</th><th className="p-3">Interest estimate</th><th className="p-3">Year-end flag</th></tr></thead>
              <tbody>{results.map((r, i) => <tr key={r.invoice + i} className="border-t border-slate-100"><td className="p-3"><strong>{r.supplier}</strong><br />{r.invoice}<br />{money(r.amount)}</td><td className="p-3">{r.dueDate}</td><td className="p-3">{r.paymentDate || 'Unpaid'}</td><td className="p-3">{r.daysLate}</td><td className="p-3">{r.estimatedInterest === null ? 'Eligibility unconfirmed' : money(r.estimatedInterest)}</td><td className="p-3">{r.disallowanceFlag === null ? 'Confirm status' : r.disallowanceFlag ? 'Review required' : 'No flag from entries'}</td></tr>)}</tbody>
            </table>
          </div>
          <button type="button" onClick={downloadReport} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800"><Download className="h-4 w-4" />Download screening CSV</button>
        </div>
      )}

      <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />Use this to identify records for review. It is not a substitute for the applicable law, the underlying agreement, verified supplier status or professional advice.</p>
    </section>
  );
}
