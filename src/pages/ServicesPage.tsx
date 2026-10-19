import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ChevronRight, ShieldCheck, ChartNoAxesCombined, FileText, Search, ClipboardCheck, Clock3, Users, ArrowUpRight } from 'lucide-react';

type Pillar = 'risk' | 'finance';
type Service = {
  id: string; pillar: Pillar; pillarLabel: string; title: string; badge: string;
  tagline: string; summary: string; idealFor: string; outcomes: string[];
  deliverables: string[]; clientInputs: string; timeframe: string;
  engagement: string; price: string; exclusions: string;
};

export const ADVISORY_DESKS: Service[] = [
  {id:'financial-clarity',pillar:'finance',pillarLabel:'Finance & Business Performance',title:'Financial Clarity Check',badge:'Core Starter Offer',tagline:'Understand cash pressure and make the next financial decision.',summary:'A tightly scoped review of cash flow, costs, working capital and basic borrowing readiness for small and growing businesses.',idealFor:'Owner-led SMEs that need clearer numbers before committing to a larger advisory project.',outcomes:['A short list of the main cash and margin pressure points','A simple 13-week cash-flow view based on supplied data','Three to five practical next actions with owners and priorities'],deliverables:['Kickoff questionnaire and document checklist','Review of supplied management accounts and cash-flow inputs','Basic cash-flow forecast and assumptions sheet','One-page findings summary and 30-day action list'],clientInputs:'Recent profit-and-loss statement, bank summaries, receivables/payables ageing if available, and expected major payments.',timeframe:'Typically 5–7 working days after complete inputs',engagement:'Fixed-scope desk review and one findings call. No ongoing CFO service is implied.',price:'Fixed quote after a short scoping call',exclusions:'Not a statutory audit, assurance opinion, loan approval, tax opinion or investment recommendation.'},
  {id:'contract-collections',pillar:'risk',pillarLabel:'Risk Management & Assurance',title:'Contract & Collections Review',badge:'Core Starter Offer',tagline:'Find avoidable payment friction before it becomes a bigger problem.',summary:'A practical review of a small, agreed set of customer contract clauses and overdue invoices, with clear observations and follow-up priorities.',idealFor:'B2B service providers, distributors and small manufacturers dealing with delayed payments or unclear commercial terms.',outcomes:['A concise list of payment and contract risks in the supplied records','A prioritised overdue-invoice follow-up plan','Suggested commercial questions or clause changes for professional review'],deliverables:['Review of up to three agreed contracts and a supplied overdue-invoice list','Clause and payment-risk checklist with page/section references','Collections action tracker and draft non-legal follow-up wording','Findings summary and one review call'],clientInputs:'Up to three customer contracts, relevant invoices, payment terms and a current overdue-invoice list.',timeframe:'Typically 5–7 working days after complete inputs',engagement:'Fixed document limit and one feedback round. Legal drafting or representation is separate.',price:'Fixed quote based on document count and complexity',exclusions:'Not a legal opinion, debt recovery service, litigation, or guarantee of payment.'},
  {id:'controls-snapshot',pillar:'risk',pillarLabel:'Risk Management & Assurance',title:'Controls & Compliance Snapshot',badge:'Core Starter Offer',tagline:'Identify the few process gaps worth fixing first.',summary:'A lightweight review of one business process to identify practical control gaps, ownership issues and documentation priorities.',idealFor:'Small teams that need better process discipline without launching a full internal-audit or compliance transformation project.',outcomes:['A simple process and control-gap map','Clear owners for priority corrective actions','A realistic 30-day improvement checklist'],deliverables:['One process walkthrough based on supplied information','Short risk-and-control checklist with priority ratings','Action tracker with owners and target dates','Management summary and one findings call'],clientInputs:'Existing process notes, sample records, current policies if any, and one process owner for a short interview.',timeframe:'Typically 5–10 working days depending on process complexity',engagement:'One process only, with defined evidence limits and a practical handover.',price:'Fixed quote after a short scoping call',exclusions:'Not a statutory audit, regulatory certification, legal advice or a guarantee that all control failures will be found.'}
];

const SERVICE_HANDOFFS: Record<string, string> = {
  'financial-clarity': 'financial-clarity',
  lenderready: 'financial-clarity',
  'loan-eligibility': 'financial-clarity',
  'business-health': 'financial-clarity',
  'controlcfo-sprint': 'financial-clarity',
  'contract-collections': 'contract-collections',
  'contract-to-cash': 'contract-collections',
  'contract-43b-h': 'contract-collections',
  tradeshield: 'contract-collections',
  'controls-snapshot': 'controls-snapshot',
  'board-box': 'controls-snapshot',
  'do-key-person-gap': 'controls-snapshot',
  regtech: 'controls-snapshot',
  'compliance-calendar': 'controls-snapshot',
  fraudsignal: 'controls-snapshot',
  'internal-audit': 'controls-snapshot'
};

const PROBLEM_SHORTCUTS = [
  { id: 'financial-clarity', title: 'Cash is tight or the numbers are unclear', detail: 'Start with cash flow, costs, working capital or borrowing readiness.', Icon: ChartNoAxesCombined },
  { id: 'contract-collections', title: 'Customer payments are late or contract terms worry me', detail: 'Review a small set of customer terms alongside overdue invoices.', Icon: FileText },
  { id: 'controls-snapshot', title: 'A process feels risky or hard to manage', detail: 'Pick one process and identify the most useful control fixes.', Icon: ShieldCheck }
];

export interface ServicesPageProps { onInquiry:(deskTitle:string)=>void; }

function readRecommendedService(): string | null {
  if (typeof window === 'undefined') return null;
  const service = new URLSearchParams(window.location.search).get('service');
  return service ? SERVICE_HANDOFFS[service] || null : null;
}

export default function ServicesPage({onInquiry}:ServicesPageProps) {
 const [query,setQuery]=useState('');
 const [recommendedId,setRecommendedId]=useState<string|null>(readRecommendedService);
 const visible=useMemo(()=>{
  const q=query.trim().toLowerCase();
  return ADVISORY_DESKS.filter(service=>
   (!recommendedId||service.id===recommendedId)&&
   (!q||[service.title,service.pillarLabel,service.tagline,service.summary,service.idealFor,...service.outcomes,...service.deliverables].join(' ').toLowerCase().includes(q))
  );
 },[recommendedId,query]);
 useEffect(()=>{
  if(!recommendedId) return;
  document.getElementById('service-'+recommendedId)?.scrollIntoView({behavior:'smooth',block:'start'});
 },[recommendedId]);
 const selectProblem=(serviceId:string)=>{
  setQuery('');
  setRecommendedId(serviceId);
  const params=new URLSearchParams(window.location.search);
  params.set('service',serviceId);
  window.history.replaceState(null,'','/services?'+params.toString());
 };
 const showAllServices=()=>{
  setQuery('');
  setRecommendedId(null);
  const params=new URLSearchParams(window.location.search);
  params.delete('service');
  const queryString=params.toString();
  window.history.replaceState(null,'','/services'+(queryString?'?'+queryString:''));
 };
 return <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
  <header className="max-w-4xl mx-auto text-center space-y-4"><span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Navigalex Business Advisory</span><h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950">Start with the business problem.</h2><p className="text-base sm:text-lg leading-relaxed text-slate-600">Choose the issue closest to yours. We offer three clearly scoped starting reviews, with timing, inputs and boundaries shown before you enquire.</p><div className="flex flex-wrap justify-center gap-3 pt-2 text-xs font-semibold text-slate-600"><span className="inline-flex items-center gap-1.5"><ClipboardCheck className="w-4 h-4"/>Defined deliverables</span><span className="inline-flex items-center gap-1.5"><Clock3 className="w-4 h-4"/>Agreed timelines</span><span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4"/>Clear ownership</span></div></header>
  <section aria-labelledby="problem-shortcuts-heading" className="space-y-4"><div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><h3 id="problem-shortcuts-heading" className="text-lg font-bold text-slate-950">What do you need help with?</h3><p className="text-sm text-slate-600">Pick one to see the closest starting offer. You can change it or browse all three.</p></div>{recommendedId&&<button type="button" onClick={showAllServices} className="self-start text-sm font-semibold text-blue-700 underline underline-offset-2">Show all three offers</button>}</div><div className="grid grid-cols-1 md:grid-cols-3 gap-3">{PROBLEM_SHORTCUTS.map(({id,title,detail,Icon})=><button key={id} type="button" aria-pressed={recommendedId===id} onClick={()=>selectProblem(id)} className={`min-h-28 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${recommendedId===id?'border-blue-600 bg-blue-50 ring-1 ring-blue-200':'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'}`}><span className="flex items-start gap-3"><span className="rounded-xl bg-slate-100 p-2 text-slate-800"><Icon className="h-5 w-5"/></span><span><span className="block text-sm font-bold leading-snug text-slate-950">{title}</span><span className="mt-1 block text-xs leading-relaxed text-slate-600">{detail}</span></span></span><span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700">See a starting point <ChevronRight className="h-3.5 w-3.5"/></span></button>)}</div></section>
  <div className="rounded-2xl bg-slate-950 text-white p-6 sm:p-8"><div className="text-center max-w-3xl mx-auto space-y-3"><span className="text-xs font-bold text-blue-300 uppercase tracking-widest">A clear engagement model</span><h3 className="text-xl sm:text-2xl font-bold">Discover → Scope → Deliver → Review</h3><p className="text-sm leading-relaxed text-slate-300">We confirm the business problem, required inputs, outputs, timeline, fees and responsibilities before work starts. Progress and material assumptions are reviewed with your team at agreed checkpoints.</p></div><div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">{[{n:'01',t:'Discover',d:'Understand goals and constraints.'},{n:'02',t:'Scope',d:'Agree deliverables and success criteria.'},{n:'03',t:'Deliver',d:'Work to the agreed plan and checkpoints.'},{n:'04',t:'Review',d:'Walk through outputs and next steps.'}].map(x=><div key={x.n} className="rounded-xl border border-white/15 p-4"><span className="text-xs text-blue-300 font-bold">{x.n}</span><h4 className="mt-2 font-bold">{x.t}</h4><p className="mt-1 text-sm text-slate-300">{x.d}</p></div>)}</div></div>
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center"><label className="flex min-h-11 flex-1 items-center gap-2 rounded-xl border border-slate-300 px-3 bg-white"><Search className="w-4 h-4 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search offers, outcomes or deliverables" aria-label="Search offers, outcomes or deliverables" className="w-full py-3 text-base text-slate-950 outline-none"/></label>{(recommendedId||query)&&<button type="button" onClick={()=>{setQuery('');showAllServices();}} className="min-h-11 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Clear filters</button>}</div><p className="text-sm text-slate-600" aria-live="polite">{recommendedId?'Showing the closest starting offer for your selected problem.':'Showing all three starting offers.'}</p>
  <div id="service-results" className="grid grid-cols-1 lg:grid-cols-2 gap-6">{visible.map(srv=><article id={"service-"+srv.id} key={srv.id} className="navigalex-card rounded-2xl border border-slate-200 border-t-4 border-t-blue-700 bg-white p-6 sm:p-7 flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow"><div className="space-y-4"><div className="flex items-center justify-between gap-3"><span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-[10px] font-bold text-blue-800 uppercase tracking-wide">{srv.badge}</span><span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500"><Clock3 className="w-3.5 h-3.5"/>{srv.timeframe}</span></div><div><h3 className="text-xl font-bold tracking-tight text-slate-950">{srv.title}</h3><p className="text-xs font-semibold text-blue-700 mt-1">{srv.pillarLabel}</p><p className="text-sm font-semibold text-slate-700 mt-3">{srv.tagline}</p></div><p className="text-sm leading-relaxed text-slate-600">{srv.summary}</p><div className="rounded-xl bg-slate-50 border border-slate-200 p-4"><h4 className="text-xs font-bold uppercase tracking-wide text-slate-700">Best suited for</h4><p className="mt-1.5 text-sm leading-relaxed text-slate-600">{srv.idealFor}</p></div><div><h4 className="text-sm font-bold text-slate-900">Expected outcomes</h4><ul className="mt-2 space-y-2">{srv.outcomes.map((d,i)=><li key={i} className="flex gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"/><span>{d}</span></li>)}</ul></div><div><h4 className="text-sm font-bold text-slate-900">Included deliverables</h4><ul className="mt-2 space-y-2">{srv.deliverables.map((d,i)=><li key={i} className="flex gap-2 text-sm leading-relaxed text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"/><span>{d}</span></li>)}</ul></div><details className="rounded-xl border border-slate-200 p-4"><summary className="cursor-pointer text-sm font-semibold text-slate-800">Scope boundaries and client inputs</summary><div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600"><div><strong className="text-slate-800">Client inputs:</strong> {srv.clientInputs}</div><div><strong className="text-slate-800">Engagement:</strong> {srv.engagement}</div><div><strong className="text-slate-800">Scope boundary:</strong> {srv.exclusions}</div></div></details></div><div className="mt-auto border-t border-slate-100 pt-4 space-y-3"><div className="flex items-center justify-between gap-3"><span className="text-xs text-slate-500">Commercials</span><span className="text-sm font-bold text-slate-900 text-right">{srv.price}</span></div><p className="text-xs text-slate-500">Final scope, fee, taxes and delivery dates are confirmed in a written proposal.</p><button type="button" onClick={()=>onInquiry(srv.title)} className="min-h-11 w-full rounded-xl bg-blue-700 px-4 py-3 text-white text-sm font-bold inline-flex items-center justify-center gap-1.5 hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">Request a scoped proposal <ArrowUpRight className="w-4 h-4"/></button></div></article>)}</div>
  {visible.length===0&&<div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-8 text-center"><p className="text-sm text-slate-600">No offer matches that search. Clear the filters or tell us what you need help with.</p><button type="button" onClick={()=>onInquiry('Help me choose the right review')} className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">Help me choose</button></div>}
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6"><h3 className="font-bold text-slate-900">Professional scope and independence</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">Navigalex provides business advisory, operational analysis and technology enablement within the scope agreed with each client. We do not advertise or offer legal services. Legal, tax, statutory audit, certification or other regulated professional work is outside scope unless delivered separately by appropriately qualified and authorised professionals under their own engagement. Recommendations depend on the accuracy and completeness of client-supplied information; outcomes are not guaranteed.</p></div>
 </section>;
}
