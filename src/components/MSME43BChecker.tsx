import React, { useEffect, useMemo, useState } from 'react';
import { Download, FileSpreadsheet, ShieldCheck, Upload, Calculator, Copy, FileText, LockKeyhole, RefreshCw } from 'lucide-react';

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
type AccessState = { paid:boolean; plan:'single'|'annual'; status:string; annualActive:boolean; pdfAvailable:boolean; expiresAt:string|null };

const aliases: Record<string,string[]> = {
  supplier:['supplier','vendor','vendor name','supplier name','party','party name'],
  invoice:['invoice','invoice no','invoice number','bill no','bill number','document number'],
  acceptanceDate:['acceptance date','accepted date','deemed acceptance date','delivery date'],
  amount:['amount','invoice amount','invoice value','bill amount','total amount'],
  paymentDate:['payment date','paid date','date paid','settlement date'],
  writtenAgreement:['written agreement','agreement','written terms'],
  agreedDays:['agreed days','payment terms days','credit days','payment days'],
  udyamStatus:['udyam status','msme status','supplier msme','micro small status']
};
function parseCsv(text:string):string[][] {
  const rows:string[][]=[];let row:string[]=[];let cell='';let quoted=false;
  for(let i=0;i<text.length;i++){const ch=text[i];if(ch==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
    else if(ch===','&&!quoted){row.push(cell.trim());cell='';}
    else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&text[i+1]==='\n')i++;row.push(cell.trim());cell='';if(row.some(v=>v!==''))rows.push(row);row=[];}
    else cell+=ch;}
  row.push(cell.trim());if(row.some(v=>v!==''))rows.push(row);return rows;
}
function isoDate(value:string):string|null {
  const raw=value.trim();if(!raw)return null;let year:number,month:number,day:number;
  const iso=/^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(raw);const indian=/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(raw);
  if(iso){year=+iso[1];month=+iso[2];day=+iso[3];}else if(indian){day=+indian[1];month=+indian[2];year=+indian[3];}else return null;
  const date=new Date(Date.UTC(year,month-1,day));return date.getUTCFullYear()===year&&date.getUTCMonth()===month-1&&date.getUTCDate()===day?date.toISOString().slice(0,10):null;
}
function plusDays(value:string,days:number){const d=new Date(value+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);}
function dayDiff(from:string,to:string){return Math.floor((Date.parse(to+'T00:00:00Z')-Date.parse(from+'T00:00:00Z'))/86400000);}
function money(value:number){return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(value);}
function normalizeHeader(value:string){return value.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function getStoredToken(){try{return window.localStorage.getItem('navigalex_msme_access_token')||'';}catch{return '';}}
function downloadBlob(blob:Blob,name:string){const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=name;anchor.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);}

export default function MSME43BChecker(){
  const [fileName,setFileName]=useState('');const [invoices,setInvoices]=useState<Invoice[]>([]);const [errors,setErrors]=useState<string[]>([]);
  const [rate,setRate]=useState('6');const [rateTouched,setRateTouched]=useState(false);const [taxYear,setTaxYear]=useState('2025-26');const [fileError,setFileError]=useState('');
  const [paymentName,setPaymentName]=useState('');const [paymentEmail,setPaymentEmail]=useState('');const [accessToken,setAccessToken]=useState(getStoredToken);
  const [access,setAccess]=useState<AccessState|null>(null);const [paymentBusy,setPaymentBusy]=useState(false);const [paymentMessage,setPaymentMessage]=useState('');
  const [supplier,setSupplier]=useState('');const [buyer,setBuyer]=useState('');const [supplierInvoice,setSupplierInvoice]=useState('');const [principal,setPrincipal]=useState('');const [dueDate,setDueDate]=useState('');const [actualPaymentDate,setActualPaymentDate]=useState('');
  const [letterMessage,setLetterMessage]=useState('');

  useEffect(()=>{fetch('/api/msme/config').then(r=>r.ok?r.json():null).then(data=>{if(data?.success&&!rateTouched)setRate(String(data.bankRate));}).catch(()=>{});},[rateTouched]);
  const checkAccess=async()=>{
    if(!accessToken)return;
    try{const response=await fetch('/api/msme/access/'+encodeURIComponent(accessToken));const data=await response.json();if(response.ok){setAccess(data);setPaymentMessage(data.paid?'Payment verified. PDF access is active.':'Payment is not yet verified. Refresh after completing payment.');}else{setAccess(null);setPaymentMessage('No paid access record was found for this browser.');}}
    catch{setPaymentMessage('Could not check payment status. Try again.');}
  };
  useEffect(()=>{if(accessToken)void checkAccess();},[accessToken]);

  const results=useMemo<Result[]>(()=>{
    const yearEnd=taxYear==='2025-26'?'2026-03-31':'2027-03-31';const bankRate=Number(rate);
    return invoices.map(inv=>{
      const days=inv.writtenAgreement==='no'?15:inv.writtenAgreement==='yes'&&inv.agreedDays!==null?Math.min(inv.agreedDays,45):45;
      const dueDateValue=plusDays(inv.acceptanceDate,days);const effectiveDate=inv.paymentDate||new Date().toISOString().slice(0,10);
      const daysLate=Math.max(0,dayDiff(dueDateValue,effectiveDate));
      const eligible=inv.udyamStatus==='yes'&&Number.isFinite(bankRate)&&bankRate>0&&bankRate<=30;
      const estimatedInterest=eligible?inv.amount*(Math.pow(1+((bankRate*3)/100)/12,daysLate/30.4375)-1):null;
      const unpaidAtYearEnd=!inv.paymentDate||inv.paymentDate>yearEnd;
      const disallowanceFlag=inv.udyamStatus==='yes'?unpaidAtYearEnd&&dueDateValue<yearEnd:null;
      const notes:string[]=[];
      if(inv.writtenAgreement==='unknown')notes.push('Written payment terms not confirmed; 45 days used only as a screening assumption.');
      if(inv.writtenAgreement==='yes'&&inv.agreedDays===null)notes.push('Written term missing; 45-day outer limit used as a screening assumption.');
      if(inv.writtenAgreement==='yes'&&(inv.agreedDays??0)>45)notes.push('Entered term exceeds 45 days; capped at 45 days for screening.');
      if(inv.udyamStatus!=='yes')notes.push('Supplier micro/small status and activity eligibility are not confirmed; statutory flags and interest are not determined.');
      else notes.push('Eligibility is user-entered and not independently verified. Confirm Udyam status and eligible activity before relying on this result.');
      if(inv.paymentDate&&inv.paymentDate<inv.acceptanceDate)notes.push('Payment date precedes acceptance date; verify the source data.');
      if(inv.paymentDate&&daysLate>0)notes.push('Interest estimate uses one full payment date. Partial payments and multiple payments are not modelled.');
      if(!inv.paymentDate&&daysLate>0)notes.push('Invoice is treated as unpaid through today for this estimate.');
      return {...inv,dueDate:dueDateValue,daysLate,estimatedInterest,outstandingAtYearEnd:unpaidAtYearEnd?inv.amount:0,disallowanceFlag,notes};
    });
  },[invoices,rate,taxYear]);

  const importCsv=async(file?:File)=>{
    setFileError('');setErrors([]);setInvoices([]);setFileName('');if(!file)return;
    if(file.size>5*1024*1024){setFileError('CSV must be 5 MB or smaller.');return;}
    if(!file.name.toLowerCase().endsWith('.csv')&&file.type!=='text/csv'){setFileError('Upload a CSV export from Excel or Tally. XLS/XLSX files are not parsed in this version.');return;}
    try{
      const table=parseCsv(await file.text());if(table.length<2){setFileError('The CSV needs a header row and at least one invoice row.');return;}
      const headers=table[0].map(normalizeHeader);const map:Record<string,number>={};
      for(const [field,names] of Object.entries(aliases)){const index=headers.findIndex(h=>names.includes(h));if(index>=0)map[field]=index;}
      const missing=['acceptanceDate','amount'].filter(k=>map[k]===undefined);
      if(missing.length){setFileError('Missing required columns: '+missing.map(k=>k==='acceptanceDate'?'acceptance or deemed-acceptance date (invoice date alone is not sufficient)':k).join(', ')+'.');return;}
      const parsed:Invoice[]=[];const rowErrors:string[]=[];
      table.slice(1).forEach((cells,idx)=>{
        const get=(key:string)=>map[key]===undefined?'':(cells[map[key]]??'').trim();const accepted=isoDate(get('acceptanceDate'));
        const amount=Number(get('amount').replace(/[₹,\s]/g,''));const rawPayment=get('paymentDate');const paid=rawPayment?(isoDate(rawPayment)??''):'';
        const agreement=get('writtenAgreement').toLowerCase();const writtenAgreement:Invoice['writtenAgreement']=/^(yes|y|true|written)$/.test(agreement)?'yes':/^(no|n|false|none)$/.test(agreement)?'no':'unknown';
        const daysRaw=get('agreedDays');const agreedDays=daysRaw&&/^\d+$/.test(daysRaw)?Number(daysRaw):null;
        const msme=get('udyamStatus').toLowerCase();const udyamStatus:Invoice['udyamStatus']=/^(yes|y|true|micro|small|confirmed|eligible)$/.test(msme)?'yes':/^(no|n|false|not eligible|not msme)$/.test(msme)?'no':'unknown';
        if(!accepted||!Number.isFinite(amount)||amount<=0||(rawPayment&&!paid)){rowErrors.push('Row '+(idx+2)+': invalid acceptance date, amount or payment date; skipped.');return;}
        parsed.push({supplier:get('supplier')||'Not supplied',invoice:get('invoice')||'Row '+(idx+2),acceptanceDate:accepted,amount,paymentDate:paid,writtenAgreement,agreedDays,udyamStatus});
      });
      if(!parsed.length){setFileError('No valid invoice rows were found. Check the dates and amounts.');setErrors(rowErrors);return;}
      setFileName(file.name);setInvoices(parsed);setErrors(rowErrors);
    }catch{setFileError('The CSV could not be read. Save it as UTF-8 CSV and try again.');}
  };

  const downloadCsv=()=>{
    const headers=['Supplier','Invoice','Acceptance date','Indicative deadline','Invoice amount INR','Payment date','Days late (screening)','Estimated interest INR','Outstanding at selected year-end INR','Potential tax timing flag','Notes'];
    const quote=(v:unknown)=>'"'+String(v??'').replace(/"/g,'""')+'"';
    const lines=[headers,...results.map(r=>[r.supplier,r.invoice,r.acceptanceDate,r.dueDate,r.amount.toFixed(2),r.paymentDate,r.daysLate,r.estimatedInterest===null?'Not determined':r.estimatedInterest.toFixed(2),r.outstandingAtYearEnd.toFixed(2),r.disallowanceFlag===null?'Unconfirmed eligibility':r.disallowanceFlag?'Review possible disallowance':'No flag from entered data',r.notes.join(' ')])].map(row=>row.map(quote).join(',')).join('\r\n');
    downloadBlob(new Blob(['\uFEFF'+lines],{type:'text/csv;charset=utf-8'}),'navigalex-msme-payment-screening.csv');
  };
  const beginPayment=async(plan:'single'|'annual')=>{
    if(!paymentEmail.trim()){setPaymentMessage('Enter your email address before continuing.');return;}
    setPaymentBusy(true);setPaymentMessage('');
    try{
      const response=await fetch('/api/msme/payment-links',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({plan,email:paymentEmail,name:paymentName})});
      const data=await response.json();if(!response.ok)throw new Error(data.error||'Payment link could not be created.');
      try{window.localStorage.setItem('navigalex_msme_access_token',data.accessToken);}catch{}
      setAccessToken(data.accessToken);window.location.assign(data.paymentUrl);
    }catch(error){setPaymentMessage(error instanceof Error?error.message:'Unable to start payment.');}
    finally{setPaymentBusy(false);}
  };
  const downloadPdf=async()=>{
    if(!access?.pdfAvailable||!accessToken){setPaymentMessage('A verified payment is required before generating the PDF.');return;}
    setPaymentBusy(true);setPaymentMessage('');
    try{
      const response=await fetch('/api/msme/report/pdf',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({accessToken,bankRate:Number(rate),taxYear,results})});
      if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.error||'PDF generation failed.');}
      downloadBlob(await response.blob(),'Navigalex-MSME-Screening-Report.pdf');await checkAccess();setPaymentMessage('Your PDF report was generated.');
    }catch(error){setPaymentMessage(error instanceof Error?error.message:'PDF generation failed.');}
    finally{setPaymentBusy(false);}
  };

  const supplierEstimate=useMemo(()=>{
    const amount=Number(principal);if(!dueDate||!Number.isFinite(amount)||amount<=0)return null;
    const end=actualPaymentDate?isoDate(actualPaymentDate)||'':new Date().toISOString().slice(0,10);if(!end)return null;
    const late=Math.max(0,dayDiff(dueDate,end));const bankRate=Number(rate);
    const interest=Number.isFinite(bankRate)&&bankRate>0?amount*(Math.pow(1+((bankRate*3)/100)/12,late/30.4375)-1):0;
    return {late,interest,end};
  },[principal,dueDate,actualPaymentDate,rate]);
  const demandLetter=useMemo(()=>{
    if(!supplierEstimate)return '';
    const amount=Number(principal);const total=amount+supplierEstimate.interest;
    return 'To: '+(buyer.trim()||'[Buyer name]')+'\nSubject: Request for payment of overdue invoice '+(supplierInvoice.trim()||'[Invoice number]')+'\n\nDear '+(buyer.trim()||'Accounts Team')+',\n\nThis is a follow-up regarding invoice '+(supplierInvoice.trim()||'[Invoice number]')+' for '+money(amount)+', which fell due on '+dueDate+'. As of '+supplierEstimate.end+', the amount remains '+(actualPaymentDate?'paid after the due date':'outstanding')+' and is '+supplierEstimate.late+' days beyond the stated due date.\n\nBased on an indicative bank-rate assumption of '+rate+'% per annum, the estimated delayed-payment interest at three times that rate with monthly rests is '+money(supplierEstimate.interest)+'. The indicative principal and interest total is '+money(total)+'. This calculation is subject to confirmation of MSMED Act eligibility, applicable terms, payment history and the relevant RBI bank rate.\n\nPlease arrange payment of the outstanding amount and share the remittance details within seven days. Please let me know promptly if your records show a different payment position.\n\nRegards,\n'+(supplier.trim()||'[Supplier name]'),[supplierEstimate,principal,buyer,supplierInvoice,dueDate,actualPaymentDate,rate,supplier]);

  const copyLetter=async()=>{try{await navigator.clipboard.writeText(demandLetter);setLetterMessage('Demand letter copied. Review the details before sending.');}catch{setLetterMessage('Copy failed. Select and copy the letter text manually.');}};

  return <section className="space-y-8">
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 space-y-5">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-blue-50 p-3 text-blue-700"><FileSpreadsheet className="h-5 w-5"/></span>
        <div><p className="text-xs font-bold uppercase tracking-widest text-blue-700">Free browser-based screening</p><h3 className="mt-1 text-xl font-extrabold text-slate-950">MSME payment ledger checker</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">Screen invoice-level payment timing, possible year-end tax flags and an indicative interest estimate from a CSV exported by Excel or Tally. Supplier status and activity eligibility must be checked against valid records. Your CSV is read in this browser; the ledger itself is not uploaded or saved by Navigalex.</p></div>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950"><strong>Important limitations:</strong> This tool models one invoice row and at most one full payment date per invoice. It does not handle partial payments, FIFO matching, Udyam verification, disputes, multiple credits or formal Form 3CD Clause 22. Screening estimate, not tax or legal advice; confirm with your CA.</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">Tax year / rule reference<select value={taxYear} onChange={e=>setTaxYear(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm"><option value="2025-26">Tax year 2025–26 · section 43B(h) screening</option></select></label>
        <label className="block text-sm font-semibold text-slate-700">RBI bank rate used for estimate (% p.a.)<input type="number" min="0.01" max="30" step="0.01" value={rate} onChange={e=>{setRateTouched(true);setRate(e.target.value);}} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm"/><span className="mt-1 block text-xs font-normal text-slate-500">Default is configured by Navigalex (6% unless changed by the administrator). Confirm the applicable current RBI bank rate before relying on the result.</span></label>
      </div>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center hover:border-blue-400"><Upload className="h-6 w-6 text-blue-700"/><span className="text-sm font-bold text-slate-800">Choose a CSV ledger</span><span className="text-xs text-slate-500">Maximum 5 MB · CSV only · flexible column matching</span><input type="file" accept=".csv,text/csv" className="sr-only" onChange={e=>void importCsv(e.target.files?.[0])}/></label>
      {fileError&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{fileError}</p>}
      {fileName&&<p className="text-xs text-slate-600">Loaded {fileName}: {invoices.length} valid invoice rows. The file remains in this browser.</p>}
      {errors.length>0&&<ul className="list-disc space-y-1 pl-5 text-xs text-amber-800">{errors.slice(0,8).map((item,i)=><li key={i}>{item}</li>)}</ul>}
      {results.length>0&&<div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Invoices screened</p><p className="mt-1 text-xl font-bold text-slate-900">{results.length}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Late / possibly late</p><p className="mt-1 text-xl font-bold text-slate-900">{results.filter(r=>r.daysLate>0).length}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Amounts flagged for year-end review</p><p className="mt-1 text-xl font-bold text-slate-900">{money(results.filter(r=>r.disallowanceFlag===true).reduce((sum,r)=>sum+r.amount,0))}</p></div></div>
        <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="min-w-[760px] w-full text-left text-xs"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Supplier / invoice</th><th className="p-3">Indicative deadline</th><th className="p-3">Payment</th><th className="p-3">Days late</th><th className="p-3">Interest</th><th className="p-3">Year-end flag</th></tr></thead><tbody>{results.map((r,i)=><tr key={r.invoice+i} className="border-t border-slate-100"><td className="p-3"><strong>{r.supplier}</strong><br/>{r.invoice}<br/>{money(r.amount)}</td><td className="p-3">{r.dueDate}</td><td className="p-3">{r.paymentDate||'Unpaid'}</td><td className="p-3">{r.daysLate}</td><td className="p-3">{r.estimatedInterest===null?'Eligibility unconfirmed':money(r.estimatedInterest)}</td><td className="p-3">{r.disallowanceFlag===null?'Confirm status':r.disallowanceFlag?'Review required':'No flag from entries'}</td></tr>)}</tbody></table></div>
        <div className="flex flex-wrap gap-3"><button type="button" onClick={downloadCsv} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50"><Download className="h-4 w-4"/>Download free CSV</button></div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 text-slate-900"><LockKeyhole className="h-5 w-5 text-blue-700"/><h4 className="font-bold">Download a professionally formatted PDF report</h4></div>
          <p className="text-xs text-slate-600">₹499 for one report or ₹3,000 for one year of report access. A PDF is generated on the server only after Cashfree confirms payment through its signed webhook.</p>
          {access?.pdfAvailable?<div className="flex flex-wrap items-center gap-3"><span className="text-sm font-semibold text-green-800">Verified access active{access.annualActive?' · annual plan':''}</span><button type="button" disabled={paymentBusy} onClick={()=>void downloadPdf()} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60"><FileText className="h-4 w-4"/>{paymentBusy?'Preparing…':'Download paid PDF report'}</button></div>:<div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">Name<input value={paymentName} onChange={e=>setPaymentName(e.target.value)} placeholder="Your name" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal"/></label>
            <label className="text-xs font-semibold text-slate-700">Email<input type="email" value={paymentEmail} onChange={e=>setPaymentEmail(e.target.value)} placeholder="name@company.com" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal"/></label>
            <button type="button" disabled={paymentBusy} onClick={()=>void beginPayment('single')} className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60">{paymentBusy?'Opening…':'Pay ₹499 · one PDF report'}</button>
            <button type="button" disabled={paymentBusy} onClick={()=>void beginPayment('annual')} className="rounded-xl border border-blue-300 bg-white px-4 py-3 text-sm font-bold text-blue-900 hover:bg-blue-50 disabled:opacity-60">{paymentBusy?'Opening…':'Pay ₹3,000 · annual access'}</button>
          </div>}
          {accessToken&&<button type="button" onClick={()=>void checkAccess()} className="inline-flex items-center gap-2 text-xs font-semibold text-blue-800 underline"><RefreshCw className="h-3.5 w-3.5"/>Refresh payment status</button>}
          {paymentMessage&&<p role="status" className="text-xs text-slate-700">{paymentMessage}</p>}
        </div>
      </div>}
      <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0"/>Privacy: invoice rows stay in browser memory and are not persisted by this service. Payment email and entitlement reference are retained for payment support. Processing of personal data is subject to the site's privacy notice and applicable Indian data-protection law. Share only data you are authorised to use.</p>
    </div>

    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 space-y-5">
      <div className="flex items-start gap-3"><span className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><Calculator className="h-5 w-5"/></span><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Supplier-side tool</p><h3 className="mt-1 text-xl font-extrabold text-slate-950">Delayed-payment interest calculator</h3><p className="mt-2 text-sm text-slate-600">Estimate interest on an overdue buyer payment and prepare a plain follow-up letter in your own name.</p></div></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">Supplier / your business<input value={supplier} onChange={e=>setSupplier(e.target.value)} placeholder="Your business name" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm font-normal"/></label>
        <label className="text-sm font-semibold text-slate-700">Buyer / customer<input value={buyer} onChange={e=>setBuyer(e.target.value)} placeholder="Buyer business name" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm font-normal"/></label>
        <label className="text-sm font-semibold text-slate-700">Invoice number<input value={supplierInvoice} onChange={e=>setSupplierInvoice(e.target.value)} placeholder="Invoice reference" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm font-normal"/></label>
        <label className="text-sm font-semibold text-slate-700">Invoice principal (₹)<input type="number" min="1" step="0.01" value={principal} onChange={e=>setPrincipal(e.target.value)} placeholder="e.g. 100000" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm font-normal"/></label>
        <label className="text-sm font-semibold text-slate-700">Contractual / statutory due date<input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm font-normal"/></label>
        <label className="text-sm font-semibold text-slate-700">Actual payment date (leave blank if unpaid)<input type="date" value={actualPaymentDate} onChange={e=>setActualPaymentDate(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm font-normal"/></label>
      </div>
      {supplierEstimate&&<div className="rounded-xl bg-slate-50 p-4 grid gap-3 sm:grid-cols-3"><div><p className="text-xs text-slate-500">Days past due</p><p className="text-lg font-bold text-slate-900">{supplierEstimate.late}</p></div><div><p className="text-xs text-slate-500">Indicative interest</p><p className="text-lg font-bold text-slate-900">{money(supplierEstimate.interest)}</p></div><div><p className="text-xs text-slate-500">Principal + indicative interest</p><p className="text-lg font-bold text-slate-900">{money(Number(principal)+supplierEstimate.interest)}</p></div></div>}
      <div className="space-y-2"><div className="flex items-center justify-between gap-3"><h4 className="font-bold text-slate-900">Your payment follow-up letter</h4><button type="button" disabled={!demandLetter} onClick={()=>void copyLetter()} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-40"><Copy className="h-3.5 w-3.5"/>Copy letter</button></div><textarea readOnly value={demandLetter||'Enter the invoice amount and due date to prepare a draft letter.'} rows={10} className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700"/>{letterMessage&&<p className="text-xs text-slate-600">{letterMessage}</p>}</div>
      <p className="text-xs leading-relaxed text-slate-500">This is a user-authored business follow-up draft, not an advocate's notice, legal representation or a determination that MSMED Act protections apply. Confirm eligibility, contract terms, acceptance date and RBI bank rate with a qualified professional before sending or claiming interest.</p>
    </div>
  </section>;
}
