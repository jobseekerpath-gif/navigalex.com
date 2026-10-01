import React, { useMemo, useState } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export const ADVISORY_DESKS = [
  { id:'lenderready', title:'1. LenderReady Credit Readiness & Debt Structuring Office', badge:'Core Advisory Desk', tagline:'Bank Credit Readiness & Debt Structuring', summary:'Prepares lender-ready financial files, reconciliations and debt-service models from the records supplied.', problem:'Financial statements, GST data, bank turnover and borrowing data may not reconcile cleanly.', timeframe:'14–21 Days', price:'₹75,000–₹3 Lakh + lawful success fee', deliverables:['Borrower Information Memorandum and CMA Data Pack','Dynamic DSCR & Monthly Cash-Flow Coverage Model','Loan covenant and obligation tracker','Debt restructuring / OTS proposal where applicable','Support for agreed lender meetings'] },
  { id:'controlcfo-sprint', title:'2. ControlCFO 90-Day Readiness Sprint', badge:'Initial Launch Priority', tagline:'Finance, Risk & Governance Command Centre', summary:'A defined finance and risk oversight sprint with working papers, decision points and an action register.', problem:'Cash conversion, collections, borrowing capacity or management controls may need structured attention.', timeframe:'30 Days Fixed Sprint', price:'₹1.5–4 Lakh fixed', deliverables:['13-Week Dynamic Cash-Flow Runway Model','Top Customer & Vendor Contract Risk Review','Master Risk & Control Register','Bank & Lender Data Room Pack','90-Day Prioritized Action Plan'] },
  { id:'contract-to-cash', title:'3. Contract-to-Cash Risk Desk', badge:'Initial Launch Priority', tagline:'Contract & Receivables Risk', summary:'Reviews customer terms and creates a documented process for contract risk and overdue receivables.', problem:'Payment, liability, termination, IP and dispute provisions can shift commercial risk toward the supplier.', timeframe:'14-Day Setup + Monthly Retainer', price:'₹75,000–₹3 Lakh setup + ₹25,000–₹1 Lakh/month', deliverables:['Clause-by-clause Contract Risk Scorecard','Document-specific redline suggestions','Debtor realization tracking','Contract renewal and milestone tracking','Customer MSA framework for professional review'] },
  { id:'internal-audit', title:'4. AI-Assisted Internal Audit Factory', badge:'Ongoing Controls', tagline:'Continuous Risk & Internal Financial Control Auditing', summary:'Risk-based internal control testing across agreed transactions and processes.', problem:'Billing errors, inventory leakage and unauthorized expenditure can remain hidden between statutory audits.', timeframe:'Quarterly Audit Cycles', price:'₹2–10 Lakh per cycle', deliverables:['Risk-Based Internal Audit Charter & Test Plan','Transaction testing across agreed populations','IFC deficiency and red-flag scorecard','Management remediation tracker','Quarterly board / audit committee report'] },
  { id:'board-box', title:'5. Board-in-a-Box Governance OS', badge:'Turnkey System', tagline:'Board Governance & Director Risk Controls', summary:'A structured governance system for board cadence, authority records and evidence.', problem:'Missing minutes, unclear authority and governance gaps can create financing and compliance problems.', timeframe:'4-Week Setup + Monthly Retainer', price:'₹2–6 Lakh setup + ₹50,000–₹1.5 Lakh/month', deliverables:['Annual Board & Committee Calendar','Board agenda, resolutions and minutes packs','Delegation of Authority matrix','Conflict and related-party register','Controlled evidence index'] },
  { id:'regtech', title:'6. RegTech Journey Lab', badge:'Institutional RegTech', tagline:'Compliance Architecture for NBFCs, Fintechs & Tech Vendors', summary:'Converts applicable compliance requirements into documented controls and workflows.', problem:'Onboarding, data protection, outsourcing and privacy gaps can create audit and partner issues.', timeframe:'6–12 Weeks Project', price:'₹5–25 Lakh per project', deliverables:['Regulatory Controls Matrix & Gap Analysis','KYC / AML onboarding architecture','DPDP privacy compliance pack','Vendor outsourcing risk assessment','Pre-audit remediation plan'] },
  { id:'fraudsignal', title:'7. FraudSignal Investigation Cell', badge:'Forensic & Whistleblower', tagline:'Forensic Accounting & Internal Leakage Detection', summary:'Discreet forensic reviews of transaction patterns, supporting records and control gaps.', problem:'Unexplained margins, inventory mismatches or suspected leakage require structured fact-finding.', timeframe:'2–4 Weeks per Investigation', price:'₹3–15 Lakh per investigation', deliverables:['Forensic transaction analytics','Whistleblower fact-finding brief','Electronic evidence preservation pack','Asset tracing and discrepancy reconciliation','Board / counsel-ready investigation report'] },
  { id:'tradeshield', title:'8. TradeShield LC/BG Desk', badge:'Export & Tender Desk', tagline:'LC and Bank Guarantee Document Review', summary:'Transaction-specific documentary trade-finance review before documents are presented.', problem:'Document wording and documentary mismatches can delay payment or create disputes.', timeframe:'24–48 Hours per Transaction / Retainer', price:'₹50,000–₹2 Lakh per transaction/retainer', deliverables:['Pre-issuance LC clause audit','Export document discrepancy checklist','Bank Guarantee wording review','Trade-compliance issue log','Coordination support within agreed mandate'] },
  { id:'family-wealth', title:'9. Family Wealth Governance Office', badge:'Promoter & Family Office', tagline:'Family Governance & Succession Coordination', summary:'Governance and coordination for family businesses, holding entities and succession planning.', problem:'Ownership, authority and succession decisions can remain fragmented across family and operating entities.', timeframe:'8–12 Weeks Setup + Quarterly Retainer', price:'₹2–10 Lakh setup + ₹75,000–₹3 Lakh/month', deliverables:['Consolidated family balance sheet and asset map','Family constitution and decision charter','Succession and inter-generational roadmap','Family investment policy statement','Quarterly Family Council governance pack'] }
];

const PERSONAS = [
  { key:'all', label:'All' }, { key:'growing', label:'Growing Business' }, { key:'exporter', label:'Exporter/Importer' }, { key:'nbfc', label:'NBFC & Fintech' }, { key:'family', label:'Family Office' }
];
const PERSONA_IDS: Record<string,string[]> = {
  all: ADVISORY_DESKS.map(s => s.id), growing: ['controlcfo-sprint','lenderready','contract-to-cash','board-box','internal-audit','fraudsignal'], exporter: ['tradeshield','contract-to-cash'], nbfc: ['regtech','board-box'], family: ['family-wealth']
};

const DIAGNOSTIC_OFFERS: Record<string, { price:string; duration:string; label:string; description:string }> = {
  'contract-to-cash': {
    price:'₹15,000 fixed', duration:'3–5 working days', label:'Contract Risk Diagnostic',
    description:'Review a defined set of customer contracts and receivables evidence, identify material commercial risks and produce a short priority action brief.'
  },
  'board-box': {
    price:'₹20,000 fixed', duration:'5–7 working days', label:'Governance Readiness Diagnostic',
    description:'Review the supplied governance documents and board records, identify priority gaps and produce a practical remediation roadmap.'
  },
  regtech: {
    price:'₹25,000 fixed', duration:'5–7 working days', label:'RegTech Gap Diagnostic',
    description:'Map the supplied workflow against the agreed compliance scope, identify control gaps and produce a prioritized remediation brief.'
  },
  fraudsignal: {
    price:'₹25,000 fixed', duration:'3–5 working days', label:'FraudSignal Scoping Diagnostic',
    description:'Review the agreed initial evidence set, identify red-flag patterns and define the evidence and investigation scope before a full forensic engagement.'
  }
};

export interface ServicesPageProps { persona:string; onSelectPersona:(nextPersona:string)=>void; onSelectDesk:(desk:any)=>void; onInquiry:(deskTitle:string)=>void; onNavigateFamilyOffice:()=>void; }

export default function ServicesPage({ persona, onSelectPersona, onSelectDesk, onInquiry, onNavigateFamilyOffice }: ServicesPageProps) {
  const [query, setQuery] = useState('');
  const visible = useMemo(() => {
    const ids = PERSONA_IDS[persona] || PERSONA_IDS.all;
    const base = ADVISORY_DESKS.filter(s => ids.includes(s.id));
    const q = query.trim().toLowerCase();
    return q ? base.filter(s => `${s.title} ${s.tagline} ${s.summary} ${s.problem}`.toLowerCase().includes(q)) : base;
  }, [persona, query]);

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      <div className="text-center max-w-4xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">PRODUCT ARCHITECTURE & DELIVERABLES</span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">Our 9 Services</h2>
        <p className="text-slate-600">Nine defined advisory desks with clear deliverables, delivery timelines and indicative fees.</p>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:p-7">
        <div className="text-center max-w-4xl mx-auto">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">START SMALL. PROVE THE NEED. SCALE THE ENGAGEMENT.</span>
          <h3 className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900">Free assessment → Paid diagnostic → Defined project → Recurring advisory</h3>
          <p className="mt-2 text-sm text-slate-600">You do not need to commit to a ₹5–25 lakh engagement before the problem, evidence and scope are understood. Start with a low-risk diagnostic where available, then move into the substantive engagement if the findings justify it.</p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
            {[
              ['1','Free assessment','Identify the business problem and whether a specialist desk is relevant.'],
              ['2','Paid diagnostic','Review a defined evidence set and produce a concise findings/action brief.'],
              ['3','Defined project','Convert confirmed findings into a scoped implementation, investigation or remediation project.'],
              ['4','Recurring advisory','Continue with a monthly or quarterly operating rhythm where ongoing oversight is required.']
            ].map(([n,title,copy]) => <div key={n} className="rounded-xl bg-white border border-blue-100 p-4"><span className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">{n}</span><h4 className="mt-2 text-sm font-bold text-slate-900">{title}</h4><p className="mt-1 text-xs leading-relaxed text-slate-600">{copy}</p></div>)}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-950 text-white p-6 sm:p-8">
        <div className="text-center max-w-2xl mx-auto space-y-2"><span className="text-xs font-bold text-blue-400 uppercase tracking-widest">HOW WE DELIVER</span><h3 className="text-xl sm:text-2xl font-bold">Evidence → AI-assisted analysis → Professional review → Decision pack</h3><p className="text-xs text-slate-300">Scope and professional review are confirmed before each engagement.</p></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div role="tablist" aria-label="Filter services" className="flex-1 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {PERSONAS.map(p => <button key={p.key} type="button" role="tab" aria-selected={persona === p.key} onClick={() => onSelectPersona(p.key)} className={`shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold ${persona === p.key ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>{p.label}</button>)}
        </div>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search services" aria-label="Search services" className="lg:w-64 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 bg-white" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map(srv => {
          const diagnostic = DIAGNOSTIC_OFFERS[srv.id];
          return <article key={srv.id} className="navigalex-card p-6 rounded-2xl flex flex-col justify-between gap-6 border-t-4 border-blue-600">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2"><span className="px-2 py-1 rounded bg-blue-50 border border-blue-200 text-[10px] font-bold text-blue-700 uppercase">{srv.badge}</span><span className="text-[10px] font-bold text-slate-500">{srv.timeframe}</span></div>
              <div><h3 className="text-lg font-bold text-slate-900 leading-tight">{srv.title}</h3><p className="text-xs font-semibold text-blue-600 mt-1">{srv.tagline}</p></div>
              <p className="text-xs text-slate-600 leading-relaxed">{srv.summary}</p>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl"><span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">Problem addressed</span><p className="text-xs text-slate-800 mt-1">{srv.problem}</p></div>
              <ul className="space-y-2">{srv.deliverables.slice(0,3).map((d,i)=><li key={i} className="flex gap-2 text-xs text-slate-700"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5"/><span>{d}</span></li>)}<li className="text-[11px] text-blue-600 font-semibold pl-5">+ {Math.max(0,srv.deliverables.length-3)} more deliverables</li></ul>
            </div>
            <div className="border-t border-slate-100 pt-4 space-y-3">
              {diagnostic && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Low-risk first transaction</span><span className="text-sm font-extrabold text-emerald-900">{diagnostic.price}</span></div>
                <p className="mt-1 text-xs font-bold text-slate-900">{diagnostic.label} · {diagnostic.duration}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{diagnostic.description}</p>
                <button type="button" onClick={() => onInquiry(`${diagnostic.label} — ${srv.title}`)} className="mt-3 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">Start Paid Diagnostic</button>
              </div>}
              <div className="flex items-start justify-between gap-3"><span className="text-xs text-slate-500">Substantive engagement</span><span className="text-sm font-bold text-slate-900 text-right">{srv.price}</span></div>
              <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => onSelectDesk(srv)} className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold">See Full Scope</button><button type="button" onClick={() => onInquiry(srv.title)} className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold">Inquire Desk</button></div>
              {diagnostic && <button type="button" onClick={() => onInquiry(`Free assessment — ${srv.title}`)} className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900">Start with Free Assessment <ChevronRight className="w-3 h-3"/></button>}
              {srv.id === 'family-wealth' && <button type="button" onClick={onNavigateFamilyOffice} className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-blue-700">Dedicated Family Office <ChevronRight className="w-3 h-3"/></button>}
            </div>
          </article>;
        })}
      </div>
      {visible.length === 0 && <div className="text-center py-12 text-sm text-slate-500">No matching service found.</div>}
    </section>
  );
}
