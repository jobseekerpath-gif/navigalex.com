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

  return <section className="relative mx-auto w-full max-w-4xl px-3 pb-6 pt-3 sm:px-5 sm:pt-5">
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="bg-slate-900 px-4 py-4 text-white sm:px-6 sm:py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md bg-violet-500/15"><Sparkles className="h-2.5 w-2.5 text-violet-200"/></div>
          <div className="min-w-0 flex-1"><p className="text-[9px] font-semibold uppercase tracking-[.16em] text-violet-200">Navigalex</p><h1 className="text-lg font-bold tracking-tight sm:text-xl">Financial Genie</h1></div>
          {messages.length > 0 && <button onClick={reset} className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10" type="button"><RotateCcw className="h-3 w-3"/>Reset</button>}
        </div>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">Describe a business challenge. Get focused questions, practical options and a clear next step.</p>
      </header>

      <div className="min-w-0">
        <div className="flex min-h-[180px] flex-col gap-3 p-3 sm:p-5">
          {messages.length === 0 ? <>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
              <div className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-900"><MessageCircle className="h-4 w-4 text-teal-700"/> Start with your business question</div>
              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">Type your situation below or manually choose a suggested topic. Nothing starts until you select a suggestion or send your own message.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {starters.slice(0,4).map(({icon: Icon,title,prompt})=><button key={title} type="button" onClick={()=>send(prompt)} disabled={busy} className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 disabled:opacity-50"><Icon className="h-3.5 w-3.5 shrink-0 text-teal-700"/><span>{title}</span></button>)}
            </div>
          </> : messages.map(m=><div key={m.id} className={m.role==='user'?'ml-auto max-w-[94%] rounded-2xl rounded-tr-md bg-teal-800 px-3.5 py-3 text-sm leading-relaxed text-white sm:max-w-[85%]':'max-w-full rounded-2xl rounded-tl-md border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm leading-relaxed text-slate-800 sm:max-w-[94%]'}><div className="mb-1 text-[10px] font-bold uppercase tracking-wider opacity-70">{m.role==='user'?'You':'Financial Genie'}</div><div className="whitespace-pre-wrap"><GuideResponse text={m.text} /></div>{m.role==='guide'&&<div className="mt-3 border-t border-slate-200 pt-3"><p className="mb-2 text-xs font-bold text-slate-600">Choose a next question (optional)</p><div className="flex flex-wrap gap-2">{suggestServices([...messages].reverse().find(x=>x.role==='user')?.text || '').map(s=><button key={s.name} type="button" disabled={busy} onClick={()=>send('Help me explore: '+s.name+'. Ask me one focused question at a time before suggesting a solution.')} className="rounded-full border border-teal-200 bg-white px-3 py-2 text-xs font-semibold text-teal-900 hover:bg-teal-50 disabled:opacity-50">{s.name} <ChevronRight className="inline h-3 w-3"/></button>)}<button type="button" onClick={()=>onOpenAssessment(messages.filter(x=>x.role==='user').map(x=>x.text).join(' ').slice(0,180))} className="rounded-full bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700">Request an adviser</button></div></div>}</div>)}
          {busy&&<div className="flex items-center gap-2 text-xs text-slate-500"><span className="h-2 w-2 animate-pulse rounded-full bg-teal-700"/><span>Reviewing your situation…</span></div>}
          {error&&<div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{error} <button type="button" className="ml-1 font-bold underline" onClick={()=>send(messages.filter(m=>m.role==='user').slice(-1)[0]?.text)}>Try again</button></div>}
          <div ref={endRef}/>
        </div>
        <form onSubmit={e=>{e.preventDefault();void send();}} className="border-t border-slate-200 bg-white p-3 sm:p-4">
          <label htmlFor="genie-input" className="sr-only">Describe your problem or goal</label>
          <div className="flex items-end gap-2 rounded-xl border border-slate-300 bg-slate-50 p-2 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
            <textarea id="genie-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();void send();}}} rows={2} maxLength={4000} placeholder="Describe the business problem you want to solve…" className="max-h-32 min-h-[46px] flex-1 resize-y bg-transparent px-2 py-1.5 text-base text-slate-900 outline-none placeholder:text-slate-400" />
            <button type="submit" disabled={!input.trim()||busy} aria-label="Send message" className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-800 text-white transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-40"><ArrowUp className="h-4 w-4"/></button>
          </div>
          <p className="mt-1.5 px-1 text-[10px] text-slate-500">Avoid entering passwords or full bank account details.</p>
        </form>
      </div>

      <div className="border-t border-slate-200 bg-slate-50/70 p-3 sm:p-4">
        <p className="mb-2 text-xs font-semibold text-slate-600">Optional guided tools and questions — open only when needed</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <details className="rounded-xl border border-slate-200 bg-white p-3">
            <summary className="cursor-pointer list-none text-sm font-bold text-slate-800"><FileSearch className="mr-2 inline h-4 w-4 text-teal-700"/> Tools & Assessments <ChevronRight className="ml-1 inline h-3.5 w-3.5"/></summary>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">Open a structured scanner only when you choose it.</p>
            <div className="mt-2 space-y-2">
              <button type="button" onClick={()=>onNavigateTab('live-tools')} className="w-full rounded-lg border border-slate-200 p-2.5 text-left text-xs font-semibold text-slate-800 hover:border-teal-300 hover:bg-teal-50">Contract Risk Scanner <span className="mt-1 block font-normal text-slate-500">Review clauses and potential risk areas</span></button>
              <button type="button" onClick={()=>onNavigateTab('live-tools')} className="w-full rounded-lg border border-slate-200 p-2.5 text-left text-xs font-semibold text-slate-800 hover:border-teal-300 hover:bg-teal-50">Bank DSCR Scanner <span className="mt-1 block font-normal text-slate-500">Check debt-service coverage</span></button>
              <button type="button" onClick={()=>onNavigateTab('live-tools')} className="w-full rounded-lg bg-teal-800 p-2.5 text-left text-xs font-semibold text-white hover:bg-teal-900">View all live tools →</button>
            </div>
          </details>
          <details className="rounded-xl border border-slate-200 bg-white p-3">
            <summary className="cursor-pointer list-none text-sm font-bold text-slate-800"><BriefcaseBusiness className="mr-2 inline h-4 w-4 text-teal-700"/> Guided business questions <ChevronRight className="ml-1 inline h-3.5 w-3.5"/></summary>
            <div className="mt-2 flex flex-wrap gap-2">{starters.map(({icon: Icon,title,prompt})=><button key={title} type="button" onClick={()=>send(prompt)} disabled={busy} className="rounded-full border border-slate-200 px-3 py-2 text-left text-xs font-medium text-slate-700 hover:border-teal-300 hover:bg-teal-50 disabled:opacity-50"><Icon className="mr-1.5 inline h-3.5 w-3.5 text-teal-700"/>{title}</button>)}</div>
          </details>
          <details className="rounded-xl border border-slate-200 bg-white p-3">
            <summary className="cursor-pointer list-none text-sm font-bold text-slate-800"><Landmark className="mr-2 inline h-4 w-4 text-teal-700"/> Explore services <ChevronRight className="ml-1 inline h-3.5 w-3.5"/></summary>
            <p className="mt-2 text-xs text-slate-600">Choose a service to ask Genie about it; it will not start until clicked.</p>
            <div className="mt-2 space-y-1.5">{offerings.map(item=><button key={item.name} type="button" onClick={()=>send(item.prompt)} disabled={busy} className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:border-teal-200 hover:bg-teal-50 disabled:opacity-50">{item.name}<ChevronRight className="h-3 w-3 shrink-0 text-teal-700"/></button>)}</div>
            <button type="button" onClick={()=>onNavigateTab('services')} className="mt-3 text-xs font-bold text-teal-800 hover:text-teal-950">See full service scope →</button>
          </details>
          <details className="rounded-xl border border-slate-200 bg-white p-3">
            <summary className="cursor-pointer list-none text-sm font-bold text-slate-800"><Users className="mr-2 inline h-4 w-4 text-teal-700"/> Solutions by industry <ChevronRight className="ml-1 inline h-3.5 w-3.5"/></summary>
            <p className="mt-2 text-xs text-slate-600">Choose your sector to ask a question tailored to that business context.</p>
            <div className="mt-2 space-y-1.5">
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
              ].map(sector=><button key={sector.title} type="button" onClick={()=>send(sector.prompt)} disabled={busy} className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:border-teal-200 hover:bg-teal-50 disabled:opacity-50">{sector.title}<ChevronRight className="h-3 w-3 shrink-0 text-teal-700"/></button>)}
            </div>
          </details>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-slate-500">Guidance is based on the information you provide. Financial, legal, tax and regulated decisions may require review by an appropriately qualified professional.</p>
      </div>
    </div>
  </section>;
}