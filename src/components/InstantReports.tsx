import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Copy, Download, FileText, Plus, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import { screenSupplierInvoice, inr, isIsoDate, type SupplierInvoice } from '../lib/msmeInterest';
import { assessLoan, type LoanInput } from '../lib/loanReadiness';

type Product = 'supplier-pack' | 'loan-readiness';
type Access = { paid: boolean; pdfAvailable: boolean; downloadsLeft: number | null; product: string };

const PDF_ROUTE: Record<Product, string> = {
  'supplier-pack': '/api/reports/supplier-pack/pdf',
  'loan-readiness': '/api/reports/loan-readiness/pdf'
};
const TOKEN_KEY: Record<Product, string> = {
  'supplier-pack': 'navigalex_access_supplier_pack',
  'loan-readiness': 'navigalex_access_loan_readiness'
};

const todayIst = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
const readToken = (product: Product) => { try { return window.localStorage.getItem(TOKEN_KEY[product]) || ''; } catch { return ''; } };
const saveToken = (product: Product, value: string) => { try { window.localStorage.setItem(TOKEN_KEY[product], value); } catch { /* storage may be blocked */ } };
const num = (value: string) => (value.trim() === '' ? NaN : Number(value));

const field = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-900';
const label = 'block text-xs font-semibold text-slate-700';

function PayBox({ product, price, ready, notReadyHint, buildBody }: {
  product: Product; price: number; ready: boolean; notReadyHint: string; buildBody: () => Record<string, unknown>;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(() => readToken(product));
  const [restore, setRestore] = useState('');
  const [access, setAccess] = useState<Access | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const returned = useMemo(() => {
    const q = new URLSearchParams(window.location.search);
    return q.get('payment') === 'return' && q.get('product') === product;
  }, [product]);

  const checkAccess = async (code: string) => {
    if (!code) return null;
    try {
      const response = await fetch('/api/msme/access/' + encodeURIComponent(code));
      const data = await response.json();
      if (!response.ok || data.product !== product) { setAccess(null); return null; }
      setAccess(data);
      return data as Access;
    } catch { setMessage('Could not check payment status. Please try again.'); return null; }
  };

  useEffect(() => { if (token) void checkAccess(token); }, [token]);

  // After returning from the payment page the webhook can take a few seconds to arrive.
  useEffect(() => {
    if (!returned || !token || access?.paid) return;
    let tries = 0;
    const timer = window.setInterval(async () => {
      tries += 1;
      const result = await checkAccess(token);
      if (result?.paid || tries >= 15) window.clearInterval(timer);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [returned, token, access?.paid]);

  const pay = async () => {
    if (!ready) { setMessage(notReadyHint); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setMessage('Enter a valid email address to continue.'); return; }
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/msme/payment-links', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ product, email: email.trim(), name: name.trim() })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to start payment.');
      saveToken(product, data.accessToken);
      setToken(data.accessToken);
      window.location.assign(data.paymentUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to start payment.');
      setBusy(false);
    }
  };

  const download = async () => {
    if (!ready) { setMessage(notReadyHint); return; }
    setBusy(true); setMessage('');
    try {
      const response = await fetch(PDF_ROUTE[product], {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ accessToken: token, ...buildBody() })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'The PDF could not be created.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = 'Navigalex-' + product + '.pdf';
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      await checkAccess(token);
      setMessage('Your PDF has been downloaded.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The PDF could not be created.');
    } finally { setBusy(false); }
  };

  const useRestoreCode = async () => {
    const code = restore.trim();
    if (!code) return;
    const result = await checkAccess(code);
    if (result) { saveToken(product, code); setToken(code); setRestore(''); setMessage(result.paid ? 'Access restored.' : 'Code found, but payment is not confirmed yet.'); }
    else setMessage('That access code was not found for this report.');
  };

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(token); setCopied(true); window.setTimeout(() => setCopied(false), 2000); } catch { /* clipboard may be blocked */ }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-blue-200 bg-blue-50/40 p-4 sm:p-5">
      <div className="flex items-center gap-2 text-slate-900"><FileText className="h-5 w-5 text-blue-700" /><h4 className="font-bold">Get the PDF report · ₹{price}</h4></div>
      {access?.pdfAvailable ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-green-800"><CheckCircle2 className="mr-1 inline h-4 w-4" />Payment confirmed. {access.downloadsLeft} download{access.downloadsLeft === 1 ? '' : 's'} left.</p>
          <button type="button" disabled={busy || !ready} onClick={() => void download()} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60"><Download className="h-4 w-4" />{busy ? 'Preparing…' : 'Download PDF'}</button>
          {!ready && <p className="text-xs text-amber-800">{notReadyHint}</p>}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={label}>Name<input className={field} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></label>
          <label className={label}>Email<input type="email" className={field} value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" /></label>
          <button type="button" disabled={busy} onClick={() => void pay()} className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60 sm:col-span-2">{busy ? 'Opening payment…' : 'Pay ₹' + price + ' and get the PDF'}</button>
        </div>
      )}
      {token && (
        <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
          <p className="font-semibold">Your access code <span className="font-normal text-slate-500">(save it; it brings your PDF back on any device)</span></p>
          <div className="flex flex-wrap items-center gap-2"><code className="break-all rounded bg-slate-100 px-2 py-1 text-[11px]">{token}</code>
            <button type="button" onClick={() => void copyCode()} className="inline-flex items-center gap-1 font-semibold text-blue-800 underline"><Copy className="h-3.5 w-3.5" />{copied ? 'Copied' : 'Copy'}</button>
            <button type="button" onClick={() => void checkAccess(token)} className="inline-flex items-center gap-1 font-semibold text-blue-800 underline"><RefreshCw className="h-3.5 w-3.5" />Refresh payment status</button></div>
        </div>
      )}
      <details className="text-xs text-slate-600">
        <summary className="cursor-pointer font-semibold text-slate-700">Already paid? Restore with your access code</summary>
        <div className="mt-2 flex gap-2"><input className={field + ' mt-0'} value={restore} onChange={e => setRestore(e.target.value)} placeholder="Paste access code" />
          <button type="button" onClick={() => void useRestoreCode()} className="rounded-lg border border-blue-300 bg-white px-3 text-xs font-bold text-blue-900">Restore</button></div>
      </details>
      {message && <p role="status" className="text-xs text-slate-700">{message}</p>}
      <p className="text-xs text-slate-500">Secure payment through Cashfree. The PDF is created automatically once the payment is confirmed. You can download it up to 3 times within 7 days. If payment succeeds but the PDF fails, contact us from the Contact page and we will re-issue the report or refund the payment.</p>
    </div>
  );
}

function SupplierPack() {
  const [bankRate, setBankRate] = useState('6');
  const [supplier, setSupplier] = useState('');
  const [buyer, setBuyer] = useState('');
  const [rows, setRows] = useState<{ invoice: string; amount: string; dueDate: string; paymentDate: string }[]>([{ invoice: '', amount: '', dueDate: '', paymentDate: '' }]);

  useEffect(() => { fetch('/api/msme/config').then(r => r.json()).then(d => { if (d?.bankRate) setBankRate(String(d.bankRate)); }).catch(() => undefined); }, []);

  const parsed = useMemo(() => {
    const out: SupplierInvoice[] = [];
    for (const r of rows) {
      const amount = num(r.amount);
      if (!(amount > 0) || !isIsoDate(r.dueDate) || (r.paymentDate && !isIsoDate(r.paymentDate))) return null;
      out.push({ invoice: r.invoice.trim(), amount, dueDate: r.dueDate, paymentDate: r.paymentDate });
    }
    return out;
  }, [rows]);
  const rate = num(bankRate);
  const rateOk = rate > 0 && rate <= 30;
  const ready = Boolean(parsed && parsed.length && supplier.trim() && buyer.trim() && rateOk);
  const results = useMemo(() => (parsed && rateOk ? parsed.map(i => screenSupplierInvoice(i, rate, todayIst())) : []), [parsed, rate, rateOk]);
  const totalInterest = results.reduce((s, r) => s + r.interest, 0);
  const totalPrincipal = results.reduce((s, r) => s + r.amount, 0);
  const update = (i: number, key: 'invoice' | 'amount' | 'dueDate' | 'paymentDate', value: string) => setRows(rows.map((r, j) => (j === i ? { ...r, [key]: value } : r)));

  return (
    <section id="supplier-pack" className="scroll-mt-28 space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">₹299 · Instant PDF</p>
        <h3 className="mt-1 text-xl font-extrabold text-slate-950">Delayed-payment follow-up pack</h3>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">A customer is paying you late? Enter up to 20 invoices. See the days late and an estimated interest figure for free. The PDF adds a ready follow-up letter, a calculation schedule and a step-by-step plan with an evidence checklist.</p></div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className={label}>Your business name<input className={field} value={supplier} onChange={e => setSupplier(e.target.value)} /></label>
        <label className={label}>Buyer (who owes you)<input className={field} value={buyer} onChange={e => setBuyer(e.target.value)} /></label>
        <label className={label}>RBI bank rate (% p.a.)<input type="number" step="0.01" className={field} value={bankRate} onChange={e => setBankRate(e.target.value)} /></label>
      </div>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="grid gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            <label className={label}>Invoice no.<input className={field} value={r.invoice} onChange={e => update(i, 'invoice', e.target.value)} /></label>
            <label className={label}>Amount (₹)<input type="number" min="1" className={field} value={r.amount} onChange={e => update(i, 'amount', e.target.value)} /></label>
            <label className={label}>Due date<input type="date" className={field} value={r.dueDate} onChange={e => update(i, 'dueDate', e.target.value)} /></label>
            <label className={label}>Paid on (blank if unpaid)<input type="date" className={field} value={r.paymentDate} onChange={e => update(i, 'paymentDate', e.target.value)} /></label>
            <button type="button" aria-label="Remove invoice" disabled={rows.length === 1} onClick={() => setRows(rows.filter((_, j) => j !== i))} className="self-end rounded-lg border border-slate-300 bg-white p-2.5 text-slate-600 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        <button type="button" disabled={rows.length >= 20} onClick={() => setRows([...rows, { invoice: '', amount: '', dueDate: '', paymentDate: '' }])} className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 underline disabled:opacity-40"><Plus className="h-3.5 w-3.5" />Add invoice</button>
      </div>
      {results.length > 0 && (
        <div className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
          <div><p className="text-xs text-slate-500">Principal</p><p className="text-lg font-bold text-slate-900">{inr(totalPrincipal)}</p></div>
          <div><p className="text-xs text-slate-500">Estimated interest</p><p className="text-lg font-bold text-slate-900">{inr(totalInterest)}</p></div>
          <div><p className="text-xs text-slate-500">Longest delay</p><p className="text-lg font-bold text-slate-900">{Math.max(...results.map(r => r.daysLate))} days</p></div>
        </div>
      )}
      <PayBox product="supplier-pack" price={299} ready={ready} notReadyHint="Fill in both business names, the bank rate and valid amounts and dates for every invoice."
        buildBody={() => ({ supplier: supplier.trim(), buyer: buyer.trim(), bankRate: rate, invoices: parsed })} />
      <p className="text-xs text-slate-500">A business follow-up draft and screening estimate, not an advocate's notice or legal advice. Whether the MSMED Act protects you depends on your registration and the facts.</p>
    </section>
  );
}

function LoanReadiness() {
  const [v, setV] = useState({ business: '', turnoverLatest: '', turnoverPrevious: '', netProfit: '', depreciation: '', interestPaid: '', existingPrincipalRepayment: '', proposedAmount: '', proposedRate: '', proposedTenureYears: '', collateralValue: '' });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value });
  const input: LoanInput | null = useMemo(() => {
    const opt = (s: string) => (s.trim() === '' ? 0 : Number(s));
    const x: LoanInput = {
      turnoverLatest: num(v.turnoverLatest), turnoverPrevious: opt(v.turnoverPrevious), netProfit: num(v.netProfit),
      depreciation: opt(v.depreciation), interestPaid: opt(v.interestPaid), existingPrincipalRepayment: opt(v.existingPrincipalRepayment),
      proposedAmount: num(v.proposedAmount), proposedRate: num(v.proposedRate), proposedTenureYears: num(v.proposedTenureYears), collateralValue: opt(v.collateralValue)
    };
    const finite = Object.values(x).every(n => Number.isFinite(n));
    const valid = finite && x.turnoverLatest > 0 && x.proposedAmount > 0 && x.proposedRate > 0 && x.proposedRate <= 40 && x.proposedTenureYears >= 0.5 && x.proposedTenureYears <= 30
      && [x.turnoverPrevious, x.depreciation, x.interestPaid, x.existingPrincipalRepayment, x.collateralValue].every(n => n >= 0);
    return valid ? x : null;
  }, [v]);
  const result = input ? assessLoan(input) : null;
  const money = (k: keyof typeof v, text: string, help?: string) => (
    <label className={label}>{text}<input type="number" className={field} value={v[k]} onChange={set(k)} />{help && <span className="mt-1 block font-normal text-slate-500">{help}</span>}</label>
  );
  return (
    <section id="loan-readiness" className="scroll-mt-28 space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div><p className="text-xs font-bold uppercase tracking-widest text-blue-700">₹499 · Instant PDF</p>
        <h3 className="mt-1 text-xl font-extrabold text-slate-950">Loan readiness snapshot</h3>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">Planning to borrow? Enter your last-year numbers and the loan you want. You see your repayment strength (DSCR) for free. The PDF adds the instalment, the other ratios lenders look at, what to fix before you apply and the documents to prepare.</p></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className={label}>Business name (optional)<input className={field} value={v.business} onChange={set('business')} /></label>
        {money('turnoverLatest', 'Turnover, latest year (₹)')}
        {money('turnoverPrevious', 'Turnover, previous year (₹)', 'Optional but lenders compare two years')}
        {money('netProfit', 'Net profit, latest year (₹)', 'Use a negative number for a loss')}
        {money('depreciation', 'Depreciation (₹)')}
        {money('interestPaid', 'Interest paid on existing loans (₹)')}
        {money('existingPrincipalRepayment', 'Existing loan principal due in next 12 months (₹)')}
        {money('proposedAmount', 'Loan you want (₹)')}
        {money('proposedRate', 'Expected interest rate (% a year)')}
        {money('proposedTenureYears', 'Tenure (years)')}
        {money('collateralValue', 'Collateral value, if any (₹)')}
      </div>
      {result && (
        <div className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
          <div><p className="text-xs text-slate-500">Combined DSCR after new loan</p><p className="text-lg font-bold text-slate-900">{result.combinedDscr === null ? 'n/a' : result.combinedDscr.toFixed(2) + 'x'}</p></div>
          <div><p className="text-xs text-slate-500">Indicative reading</p><p className="text-lg font-bold text-slate-900">{result.band}</p></div>
          <div><p className="text-xs text-slate-500">Monthly instalment</p><p className="text-lg font-bold text-slate-900">{inr(result.proposedEmi)}</p></div>
        </div>
      )}
      <PayBox product="loan-readiness" price={499} ready={Boolean(input)} notReadyHint="Fill in turnover, net profit, the loan amount, rate and tenure with valid numbers."
        buildBody={() => ({ business: v.business.trim(), ...input })} />
      <p className="text-xs text-slate-500">Indicative screening only. Not a credit appraisal, CMA certification, lender approval or advice to borrow. Lenders use their own methods.</p>
    </section>
  );
}

export default function InstantReports({ onNavigateTab }: { onNavigateTab: (tab: string) => void }) {
  const cards = [
    { title: 'MSME payment ledger check', price: '₹499', provide: 'A CSV of supplier invoices from Excel or Tally', get: 'Screening of late payments, possible year-end tax flags and interest estimates as a PDF', action: () => onNavigateTab('43b-h-check'), cta: 'Open the ledger check' },
    { title: 'Delayed-payment follow-up pack', price: '₹299', provide: 'Up to 20 unpaid or late invoices', get: 'Calculation schedule, a ready follow-up letter, next steps and evidence checklist as a PDF', action: () => document.getElementById('supplier-pack')?.scrollIntoView({ behavior: 'smooth' }), cta: 'Start the pack' },
    { title: 'Loan readiness snapshot', price: '₹499', provide: 'Last-year turnover, profit, existing loan payments and the loan you want', get: 'Repayment strength, instalment, key ratios, fix-before-you-apply list and document checklist as a PDF', action: () => document.getElementById('loan-readiness')?.scrollIntoView({ behavior: 'smooth' }), cta: 'Start the snapshot' }
  ];
  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Instant reports · fixed price · no calls</span>
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-5xl">Three practical reports for small businesses, ready in minutes</h2>
        <p className="max-w-3xl text-slate-600">Enter your details, see the key numbers free, and pay only if you want the full PDF. No waiting for a consultant.</p>
      </div>
      <ol className="grid gap-3 sm:grid-cols-3">
        {['Enter your numbers. The key result shows free on screen.', 'Pay securely through Cashfree (UPI, cards, net banking).', 'Your PDF is created automatically as soon as payment is confirmed.'].map((step, i) => (
          <li key={step} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700"><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">{i + 1}</span>{step}</li>
        ))}
      </ol>
      <div className="grid gap-4 lg:grid-cols-3">
        {cards.map(c => (
          <div key={c.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-baseline justify-between gap-3"><h3 className="font-extrabold text-slate-900">{c.title}</h3><span className="text-lg font-extrabold text-blue-700">{c.price}</span></div>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">You provide</p><p className="text-sm text-slate-700">{c.provide}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">You get</p><p className="text-sm text-slate-700">{c.get}</p>
            <button type="button" onClick={c.action} className="mt-4 inline-flex items-center gap-2 self-start text-sm font-bold text-blue-800 hover:text-blue-950">{c.cta}<ArrowRight className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      <SupplierPack />
      <LoanReadiness />
      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <p>These reports are automated screening aids, not legal, tax, audit or credit advice, and they are not certifications. Your figures are used only to build the PDF and are not stored; we keep your email and payment reference to confirm payment. Need a person to review your case? <button type="button" onClick={() => onNavigateTab('services')} className="font-bold text-blue-800 underline">See scoped reviews</button> or <button type="button" onClick={() => onNavigateTab('contact')} className="font-bold text-blue-800 underline">contact us</button>.</p>
      </div>
    </section>
  );
}
