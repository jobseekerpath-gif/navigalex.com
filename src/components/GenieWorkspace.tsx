import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Sparkles, Wallet, TrendingDown, Landmark, FileSearch, ShieldCheck, Workflow, Users, ChevronRight, RotateCcw, MessageCircle, BriefcaseBusiness, ChartNoAxesCombined } from 'lucide-react';

type Message = { id: string; role: 'user' | 'guide'; text: string; };
type Props = { onOpenAssessment: (concern?: string) => void; onNavigateTab: (tab: string) => void };

/** Render common Markdown from AI responses as readable UI instead of showing raw ## and ** markers. */
function GuideResponse({ text }: { text: string }) {
  const lines = text.replace(/\r/g, '').split('\n');
  const renderInline = (value: string) => value.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  const flushList = () => {
    if (list.length) {
      blocks.push(<ul key={`list-${blocks.length}`} className="my-2 list-disc space-y-1 pl-5">{list.map((item, i) => <li key={i}>{renderInline(item)}</li>)}</ul>);
      list = [];
    }
  };
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) { flushList(); return; }
    const heading = line.match(/^#{1,3}\s+(.+)$/);
    const bullet = line.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/);
    if (bullet) { list.push(bullet[1]); return; }
    flushList();
    if (heading) blocks.push(<h3 key={i} className="mb-1 mt-3 font-bold text-slate-900">{renderInline(heading[1])}</h3>);
    else blocks.push(<p key={i} className="my-1">{renderInline(line)}</p>);
  });
  flushList();
  return <div className="space-y-1">{blocks}</div>;
}


const starters = [
  { icon: Wallet, title: 'Sales are coming in, but cash is short', prompt: 'My business makes sales but I never have enough cash to pay expenses on time. Help me find the likely causes and what to do first.' },
  { icon: TrendingDown, title: 'Costs are eating my profits', prompt: 'My costs are rising and profits are falling. Help me identify what to check and which solutions could fit.' },
  { icon: Landmark, title: 'I need funding or a loan', prompt: 'I need funding but do not know which option is suitable or why a lender might reject me. Help me assess my next steps.' },
  { icon: FileSearch, title: 'Payments are stuck or contracts worry me', prompt: 'Customers are delaying payments and I am worried about contract terms. Help me understand the risks and options.' },
  { icon: ShieldCheck, title: 'I suspect errors, leakage or fraud', prompt: 'I suspect unexplained financial discrepancies or weak controls. Help me plan a careful, evidence-based review.' },
  { icon: Workflow, title: 'My business is hard to manage', prompt: 'My business processes are messy and people rely on spreadsheets and manual work. Help me prioritise improvements.' },
  { icon: Users, title: 'Governance, compliance or family business', prompt: 'I need help with governance, compliance, succession or responsibilities in a family business. Help me identify the right starting point.' },
  { icon: ChartNoAxesCombined, title: 'I need forecasts or better reports', prompt: 'I want to understand my business numbers, forecast cash flow and make better financial decisions. What information should I start with?' }
];

const offerings = [
  { name: 'LenderReady — credit readiness & debt structuring', prompt: 'Explain the LenderReady service in plain language and help me decide whether credit readiness or debt structuring fits my situation.' },
  { name: 'ControlCFO — cash flow, finance & controls', prompt: 'Explain the ControlCFO service and help me identify whether cash flow, finance oversight, risk controls or a 90-day action plan could help.' },
  { name: 'Contract-to-Cash — contracts & collections', prompt: 'Explain the Contract-to-Cash service and help me with risky contract terms, delayed invoices or payment follow-up.' },
  { name: 'Internal Audit Factory — controls & leakage', prompt: 'Explain the internal audit service and help me assess unexplained costs, billing errors, inventory leakage or weak controls.' },
  { name: 'Board-in-a-Box — governance & board records', prompt: 'Explain the governance service and help me identify gaps in board processes, approvals, director responsibilities or records.' },
  { name: 'RegTech Journey Lab — compliance systems', prompt: 'Explain the compliance service and help me map potential onboarding, privacy, outsourcing or regulatory control gaps.' },
  { name: 'FraudSignal — discrepancies & investigations', prompt: 'Explain the financial investigation service and help me plan a careful evidence-based review of suspected discrepancies.' },
  { name: 'TradeShield — letters of credit & guarantees', prompt: 'Explain the trade finance service and help me understand a letter of credit, bank guarantee or export document issue.' },
  { name: 'Family Wealth Governance — succession & family business', prompt: 'Explain the family wealth governance service and help me identify issues involving succession, ownership or family business decisions.' },
  { name: 'Business strategy, operations & growth', prompt: 'Help me assess a business growth, operations or process improvement challenge and identify practical options.' },
  { name: 'Financial planning, forecasting & reporting', prompt: 'Help me work out what financial records are needed for forecasting, budgeting, reporting or scenario planning.' },
  { name: 'IT, data & workflow automation', prompt: 'Help me identify whether technology, workflow automation, integrations or reporting improvements could solve my business problem.' }
];

const serviceMap = [
  { name: 'Credit readiness & debt structuring', words: ['loan','lender','funding','credit','dscr','bank','borrowing','cibil'], tab: 'live-tools' },
  { name: 'Cash flow & finance leadership', words: ['cash flow','cashflow','working capital','collections','cost','profit','cfo','forecast','reporting'], tab: 'live-tools' },
  { name: 'Contracts & overdue payments', words: ['contract','clause','invoice','overdue','payment','receivable','unpaid','agreement'], tab: 'live-tools' },
  { name: 'Internal audit & financial controls', words: ['audit','fraud','leakage','discrepancy','unauthorised','unauthorized','control'], tab: 'live-tools' },
  { name: 'Board governance & compliance', words: ['board','governance','director','compliance','regulatory','privacy','dpdp','nbfc','fintech'], tab: 'services' },
  { name: 'Trade finance & export documents', words: ['export','import','trade','letter of credit','lc','bank guarantee','bg'], tab: 'services' },
  { name: 'Family wealth & succession planning', words: ['family','succession','inheritance','wealth','trust','will'], tab: 'family-office' },
  { name: 'Strategy, operations & digital systems', words: ['strategy','growth','expand','operations','process','automation','technology','it','spreadsheet'], tab: 'services' }
];

function suggestServices(text: string) {
  const q = text.toLowerCase();
  const matched = serviceMap.filter(s => s.words.some(w => q.includes(w)));
  return (matched.length ? matched : serviceMap.slice(0, 3)).slice(0, 3);
}

export default function GenieWorkspace({ onOpenAssessment, onNavigateTab }: Props) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, busy]);

  const send = async (value?: string) => {
    const prompt = (value ?? input).trim();
    if (!prompt || busy) return;
    const userMessage: Message = { id: `u-${Date.now()}`, role: 'user', text: prompt };
    const history = messages.slice(-8).map(m => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }));
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError('');
    setBusy(true);
    try {
      const response = await fetch('/api/bot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, history })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.reply) throw new Error(data.error || 'The guide could not respond just now. Please try again.');
      setMessages(prev => [...prev, { id: `g-${Date.now()}`, role: 'guide', text: String(data.reply) }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not connect. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const reset = () => { setMessages([]); setInput(''); setError(''); };

  return <section className="relative mx-auto w-full max-w-6xl px-3 pb-12 pt-5 sm:px-6 sm:pt-10">
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_-35px_rgba(15,23,42,.28)]">
      <div className="bg-slate-950 px-5 py-5 text-white sm:px-8 sm:py-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 ring-1 ring-blue-300/30"><Sparkles className="h-6 w-6 text-blue-200"/></div>
          <div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-200">Navigalex</p><h1 className="mt-1 text-xl font-bold tracking-tight sm:text-3xl">Financial Genie</h1></div>
          {messages.length > 0 && <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10" type="button"><RotateCcw className="h-3.5 w-3.5"/>Start over</button>}
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">Your business decision workspace. Explain the challenge in your own words, choose a guided path, and build toward a clear action plan with less back-and-forth.</p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="min-w-0 border-b border-slate-200 lg:border-b-0 lg:border-r">
          <div className="flex min-h-[280px] flex-col gap-4 p-4 sm:p-7">
            {messages.length === 0 ? <>
              <div className="max-w-2xl rounded-2xl rounded-tl-md border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900"><MessageCircle className="h-4 w-4 text-blue-700"/> Your business, understood</div>
                <p className="text-sm leading-relaxed text-slate-600">Start with a business goal or problem. Financial Genie will help identify the relevant area, ask focused follow-up questions, and guide you toward the next useful action.</p>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {starters.slice(0,4).map(({icon: Icon,title,prompt})=><button key={title} type="button" onClick={()=>send(prompt)} className="group flex items-start gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-blue-300 hover:bg-blue-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"><span className="rounded-lg bg-slate-100 p-2 text-slate-700 group-hover:bg-white"><Icon className="h-4 w-4"/></span><span className="flex-1 text-sm font-semibold leading-snug text-slate-800">{title}<span className="mt-1 block text-xs font-normal text-slate-500">Help me figure this out <ChevronRight className="inline h-3 w-3"/></span></span></button>)}
              </div>
            </> : messages.map(m=><div key={m.id} className={m.role==='user'?'ml-auto max-w-[92%] rounded-2xl rounded-tr-md bg-blue-700 px-4 py-3 text-sm leading-relaxed text-white sm:max-w-[85%]':'max-w-[96%] rounded-2xl rounded-tl-md border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-relaxed text-slate-800 sm:max-w-[90%]'}><div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider opacity-70">{m.role==='user'?'You':'Financial Genie'}</div><div className="whitespace-pre-wrap"><GuideResponse text={m.text} /></div>{m.role==='guide'&&<div className="mt-4 border-t border-slate-200 pt-3"><p className="mb-2 text-xs font-bold text-slate-600">Suggested next steps</p><div className="flex flex-wrap gap-2">{suggestServices([...messages].reverse().find(x=>x.role==='user')?.text || '').map(s=><button key={s.name} type="button" onClick={()=>s.tab==='live-tools'?onNavigateTab('live-tools'):s.tab==='family-office'?onNavigateTab('family-office'):onNavigateTab('services')} className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-50">{s.name} <ChevronRight className="inline h-3 w-3"/></button>)}<button type="button" onClick={()=>onOpenAssessment(messages.filter(x=>x.role==='user').map(x=>x.text).join(' ').slice(0,180))} className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700">Request an adviser</button></div></div>}</div>)}
            {busy&&<div className="flex items-center gap-2 text-sm text-slate-500"><span className="h-2 w-2 animate-pulse rounded-full bg-blue-600"/><span>Reviewing your situation…</span></div>}
            {error&&<div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{error} <button type="button" className="ml-1 font-bold underline" onClick={()=>send(messages.filter(m=>m.role==='user').slice(-1)[0]?.text)}>Try again</button></div>}
            <div ref={endRef}/>
          </div>
          <form onSubmit={e=>{e.preventDefault();void send();}} className="border-t border-slate-200 bg-white p-3 sm:p-5">
            <label htmlFor="genie-input" className="sr-only">Describe your problem or goal</label>
            <div className="flex items-end gap-2 rounded-2xl border border-slate-300 bg-slate-50 p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <textarea id="genie-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();void send();}}} rows={2} maxLength={4000} placeholder="Tell Financial Genie what you need to solve…" className="max-h-36 min-h-[52px] flex-1 resize-y bg-transparent px-2 py-2 text-base text-slate-900 outline-none placeholder:text-slate-400" />
              <button type="submit" disabled={!input.trim()||busy} aria-label="Send message" className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"><ArrowUp className="h-5 w-5"/></button>
            </div>
            <p className="mt-2 px-1 text-[11px] text-slate-500">Do not enter passwords, full bank account details or other highly sensitive information.</p>
          </form>
        </div>

        <aside className="bg-slate-50/70 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2"><FileSearch className="h-4 w-4 text-blue-700"/><h2 className="text-sm font-bold text-slate-900">Tools & Assessments</h2></div>
          <p className="mb-3 text-xs leading-relaxed text-slate-600">Open a focused business tool from this workspace whenever you need a structured check.</p>
          <div className="mb-5 space-y-2">
            <button type="button" onClick={()=>onNavigateTab('live-tools')} className="flex w-full items-start gap-2.5 rounded-xl border border-blue-200 bg-white p-3 text-left transition hover:border-blue-400 hover:bg-blue-50">
              <FileSearch className="mt-0.5 h-4 w-4 shrink-0 text-blue-700"/>
              <span className="text-xs font-semibold leading-relaxed text-slate-800">Contract Risk Scanner <span className="mt-1 block text-[11px] font-normal text-slate-500">Review contract clauses and potential risk areas</span></span>
              <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-700"/>
            </button>
            <button type="button" onClick={()=>onNavigateTab('live-tools')} className="flex w-full items-start gap-2.5 rounded-xl border border-blue-200 bg-white p-3 text-left transition hover:border-blue-400 hover:bg-blue-50">
              <ChartNoAxesCombined className="mt-0.5 h-4 w-4 shrink-0 text-blue-700"/>
              <span className="text-xs font-semibold leading-relaxed text-slate-800">Bank DSCR Scanner <span className="mt-1 block text-[11px] font-normal text-slate-500">Check debt-service coverage and repayment readiness</span></span>
              <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-700"/>
            </button>
            <button type="button" onClick={()=>onNavigateTab('live-tools')} className="w-full rounded-lg bg-blue-700 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-blue-800">View all live tools <ChevronRight className="ml-1 inline h-3 w-3"/></button>
          </div>
          <div className="mb-3 flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4 text-blue-700"/><h2 className="text-sm font-bold text-slate-900">Choose a guided path</h2></div>
          <p className="mb-4 text-xs leading-relaxed text-slate-600">Pick a business situation or service. Genie will use your choice to guide the conversation.</p>
          <div className="space-y-2">{starters.map(({icon: Icon,title,prompt})=><button key={title} type="button" onClick={()=>send(prompt)} disabled={busy} className="flex w-full items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-700"/><span className="text-xs font-semibold leading-relaxed text-slate-700">{title}</span></button>)}</div>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs font-bold text-slate-800">Explore services with Genie</p><p className="mt-1.5 text-xs leading-relaxed text-slate-600">Choose a service to start a focused assessment without navigating away.</p><div className="mt-3 max-h-72 space-y-1.5 overflow-y-auto pr-1">{offerings.map(item=><button key={item.name} type="button" onClick={()=>send(item.prompt)} disabled={busy} className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-2 text-left text-[11px] font-semibold leading-relaxed text-slate-700 hover:border-blue-200 hover:bg-blue-50 disabled:opacity-50">{item.name}<ChevronRight className="h-3 w-3 shrink-0 text-blue-700"/></button>)}</div><button type="button" onClick={()=>onNavigateTab('services')} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900">See full service scope <ChevronRight className="h-3 w-3"/></button></div>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-1 flex items-center gap-2"><Landmark className="h-4 w-4 text-blue-700"/><h2 className="text-sm font-bold text-slate-900">Tailored Solutions for Your Sector</h2></div>
            <p className="mb-3 text-xs leading-relaxed text-slate-600">Choose your industry to get sector-specific questions, risk areas and practical next steps directly in Financial Genie.</p>
            <div className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
              {[
                {title:'Exporters & International Trade',prompt:'I run an export or international trade business. Help me assess letter of credit discrepancies, shipping document compliance, and foreign buyer payment security. Ask focused questions before recommending next steps.'},
                {title:'Distributors & Wholesale Trading',prompt:'I run a distribution or wholesale business. Help me assess channel credit limits, dealer agreement safeguards, working capital, and inventory velocity. Ask focused questions before recommending next steps.'},
                {title:'Schools & Educational Institutes',prompt:'I manage a school or educational institute. Help me review fee realization governance, trust compliance considerations, and vendor contract risks. Distinguish general guidance from issues requiring qualified professional review.'},
                {title:'Real Estate & Construction',prompt:'I work in real estate or construction. Help me assess RERA-related compliance questions, subcontractor milestone contracts, and construction debt-service readiness. Ask focused questions before recommending next steps.'},
                {title:'NBFC & Fintech Vendors',prompt:'I work with an NBFC or fintech vendor. Help me map co-lending compliance considerations, KYC/onboarding controls, and audit remediation priorities. Flag matters that require qualified compliance or legal review.'},
                {title:'Family-Owned Enterprises',prompt:'I run a family-owned enterprise. Help me structure a discussion about succession planning, ownership across companies or LLPs, and family governance. Ask focused questions before recommending next steps.'},
                {title:'Manufacturing & Engineering',prompt:'I run a manufacturing or engineering business. Help me assess raw-material price risk clauses, plant capex decisions, and internal control or audit priorities. Ask focused questions before recommending next steps.'},
                {title:'Healthcare & Clinics',prompt:'I manage a healthcare business or clinic. Help me assess equipment lease agreements, medical vendor contracts, and patient-data confidentiality controls. Flag issues needing qualified legal or privacy review.'},
                {title:'IT & Professional Services',prompt:'I run an IT or professional services business. Help me assess master services agreements, client IP assignment, offshore delivery risks, and milestone billing. Ask focused questions before recommending next steps.'}
              ].map(sector=><button key={sector.title} type="button" onClick={()=>send(sector.prompt)} disabled={busy} className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-2 text-left text-[11px] font-semibold leading-relaxed text-slate-700 hover:border-blue-200 hover:bg-blue-50 disabled:opacity-50">{sector.title}<ChevronRight className="h-3 w-3 shrink-0 text-blue-700"/></button>)}
            </div>
          </div>
          <p className="mt-4 text-[10px] leading-relaxed text-slate-500">Guidance is based on the information you provide. Financial, legal, tax and regulated decisions may require review by an appropriately qualified professional.</p>
        </aside>
      </div>
    </div>
  </section>;
}
