import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Sparkles, Wallet, TrendingDown, Landmark, FileSearch, ShieldCheck, Workflow, Users, ChevronRight, RotateCcw, MessageCircle, BriefcaseBusiness, ChartNoAxesCombined } from 'lucide-react';

type Message = { id: string; role: 'user' | 'guide'; text: string; };
type Props = { onOpenAssessment: (concern?: string) => void; onNavigateTab: (tab: string) => void };

/** Render common Markdown from AI responses as readable UI instead of showing raw ## and ** markers. */
function GuideResponse({ text, onChoice }: { text: string; onChoice: (choice: string) => void }) {
  const lines = text.replace(/\r/g, '').split('\n');
  const renderInline = (value: string) => value.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  let interactiveChoices = false;
  const flushList = () => {
    if (list.length) {
      blocks.push(<ul key={`list-${blocks.length}`} className="my-2 list-disc space-y-1 pl-5">{list.map((item, i) => <li key={i}>{renderInline(item)}</li>)}</ul>);
      list = [];
    }
  };
  lines.forEach((raw, i) => {
    const line = raw.trim();
    const normalized = line.replace(/\*\*/g, '').replace(/^#{1,3}\s*/, '').replace(/:$/, '').trim();
    if (!line) { flushList(); return; }
    if (/^would you like help with$/i.test(normalized) || /^choose (?:a )?follow-up$/i.test(normalized) || /^what would you like to do next$/i.test(normalized)) {
      flushList();
      interactiveChoices = true;
      blocks.push(<p key={i} className="mt-3 font-semibold text-slate-800">Choose a follow-up (tap an option):</p>);
      return;
    }
    const bullet = line.match(/^(?:[-*•▪]|\d+[.)])\s+(.+)$/);
    if (interactiveChoices && bullet) {
      const choice = bullet[1].replace(/\*\*/g, '').trim();
      blocks.push(<button key={i} type="button" onClick={() => onChoice(choice)} className="my-1 flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-indigo-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-indigo-950 shadow-sm transition hover:border-indigo-400 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"><span>{renderInline(choice)}</span><span aria-hidden="true" className="shrink-0 text-lg">›</span></button>);
      return;
    }
    if (interactiveChoices) interactiveChoices = false;
    const heading = line.match(/^#{1,3}\s+(.+)$/);
    if (bullet) { list.push(bullet[1]); return; }
    flushList();
    if (heading) blocks.push(<h3 key={i} className="mb-1 mt-3 font-bold text-slate-900">{renderInline(heading[1])}</h3>);
    else blocks.push(<p key={i} className="my-1">{renderInline(line)}</p>);
  });
  flushList();
  return <div className="space-y-1">{blocks}</div>;
}


const starters = [
  { icon: Wallet, title: 'Cash is tight or the numbers are unclear', prompt: 'Cash is tight and I am unsure what is driving it. Help me identify where to start.' },
  { icon: FileSearch, title: 'Customer payments are late or contract terms worry me', prompt: 'Customer payments are late and contract terms worry me. Help me choose a practical first step.' },
  { icon: ShieldCheck, title: 'One process feels risky or hard to manage', prompt: 'One business process feels risky or hard to manage. Help me identify what to review first.' },
  { icon: MessageCircle, title: 'I am not sure which issue matters most', prompt: 'I am not sure which business issue to solve first. Ask me one focused question at a time.' }
];

export default function GenieWorkspace({ onOpenAssessment, onNavigateTab }: Props) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, busy]);

  const send = async (value?: string, retry = false) => {
    const prompt = (value ?? input).trim();
    if (!prompt || busy) return;
    const userMessage: Message = { id: `u-${Date.now()}`, role: 'user', text: prompt };
    const historyMessages = retry ? messages.slice(0, -2) : messages;
    const history = historyMessages.slice(-8).map(m => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }));
    if (!retry) setMessages(prev => [...prev, userMessage]);
    else setMessages(prev => prev.filter(m => !(m.role === 'guide' && m.text.startsWith('The live guide could not complete a reply.'))));
    setInput('');
    setError('');
    setBusy(true);
    try {
      let visitorId = '';
      try { visitorId = window.localStorage.getItem('navigalex_visitor_id') || ''; } catch { /* tracking is optional */ }
      const response = await fetch('/api/bot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, history, visitorId })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.reply) throw new Error(data.error || 'The guide could not respond just now. Please try again.');
      setMessages(prev => [...prev, { id: `g-${Date.now()}`, role: 'guide', text: String(data.reply) }]);
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'Could not connect.';
      setError(reason);
      setMessages(prev => [...prev, {
        id: `g-${Date.now()}`,
        role: 'guide',
        text: 'The live guide could not complete a reply. You can still start with one of these scoped reviews:\n\n- Financial Clarity Check: cash flow, costs, working capital and basic borrowing readiness.\n- Contract & Collections Review: up to three agreed customer contracts and an overdue-invoice list.\n- Controls & Compliance Snapshot: one business process and a short priority action plan.\n\nBrowse the offers or request a proposal. Please do not paste passwords, bank details or confidential documents into chat.'
      }]);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => { setMessages([]); setInput(''); setError(''); };

  return <section className="relative mx-auto w-full max-w-4xl px-3 pb-6 pt-3 sm:px-5 sm:pt-5">
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="bg-[#18213f] px-4 py-4 text-white sm:px-6 sm:py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-500/15"><Sparkles className="h-3 w-3 text-indigo-200"/></div>
          <div className="min-w-0 flex-1"><p className="text-[9px] font-semibold uppercase tracking-[.16em] text-indigo-200">Navigalex</p><h1 className="text-lg font-bold tracking-tight sm:text-xl">Financial Genie</h1></div>
          {messages.length > 0 && <button onClick={reset} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10" type="button"><RotateCcw className="h-3 w-3"/>Reset</button>}
        </div>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">Describe a business challenge. Get focused questions, practical options and a clear next step.</p>
      </header>

      <div className="min-w-0">
        <div className="flex min-h-[180px] flex-col gap-3 p-3 sm:p-5">
          {messages.length === 0 ? <>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
              <div className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-900"><MessageCircle className="h-4 w-4 text-indigo-700"/> Start with your business question</div>
              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">Type your situation below or manually choose a suggested topic. Nothing starts until you select a suggestion or send your own message.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {starters.slice(0,4).map(({icon: Icon,title,prompt})=><button key={title} type="button" onClick={()=>send(prompt)} disabled={busy} className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50"><Icon className="h-3.5 w-3.5 shrink-0 text-emerald-700"/><span>{title}</span></button>)}
            </div>
          </> : messages.map(m=><div key={m.id} className={m.role==='user'?'ml-auto max-w-[94%] rounded-2xl rounded-tr-md bg-indigo-700 px-3.5 py-3 text-sm leading-relaxed text-white sm:max-w-[85%]':'max-w-full rounded-2xl rounded-tl-md border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm leading-relaxed text-slate-800 sm:max-w-[94%]'}><div className="mb-1 text-[10px] font-bold uppercase tracking-wider opacity-70">{m.role==='user'?'You':'Financial Genie'}</div><div className="whitespace-pre-wrap"><GuideResponse text={m.text} onChoice={(choice)=>send(choice)} /></div>{m.role==='guide'&&<div className="mt-3 border-t border-slate-200 pt-3">
            <p className="mb-2 text-xs font-bold text-slate-600">Choose a next step</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={busy} onClick={()=>send('Help me choose among the three Navigalex starter reviews. Ask one focused question at a time.')} className="inline-flex min-h-11 items-center rounded-full border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-900 hover:bg-indigo-50 disabled:opacity-50">Help me choose <ChevronRight className="ml-1 h-3 w-3"/></button>
              <button type="button" onClick={()=>onNavigateTab('services')} className="inline-flex min-h-11 items-center rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50">Browse offers <ChevronRight className="ml-1 h-3 w-3"/></button>
              <button type="button" onClick={()=>onOpenAssessment('Proposal request from Financial Genie')} className="inline-flex min-h-11 items-center rounded-full bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700">Request a proposal</button>
            </div>
          </div></div>)}
          {busy&&<div className="flex items-center gap-2 text-xs text-slate-500"><span className="h-2 w-2 animate-pulse rounded-full bg-teal-700"/><span>Reviewing your situation…</span></div>}
          {error&&<div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{error} <button type="button" className="ml-1 inline-flex min-h-11 items-center font-bold underline" onClick={()=>send(messages.filter(m=>m.role==='user').slice(-1)[0]?.text, true)}>Try again</button></div>}
          <div ref={endRef}/>
        </div>
        <form onSubmit={e=>{e.preventDefault();void send();}} className="border-t border-slate-200 bg-white p-3 sm:p-4">
          <label htmlFor="genie-input" className="sr-only">Describe your problem or goal</label>
          <div className="flex items-end gap-2 rounded-xl border border-slate-300 bg-slate-50 p-2 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100">
            <textarea id="genie-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();void send();}}} rows={2} maxLength={4000} placeholder="Describe the business problem you want to solve…" className="max-h-32 min-h-[46px] flex-1 resize-y bg-transparent px-2 py-1.5 text-base text-slate-900 outline-none placeholder:text-slate-400" />
            <button type="submit" disabled={!input.trim()||busy} aria-label="Send message" className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-40"><ArrowUp className="h-4 w-4"/></button>
          </div>
          <p className="mt-1.5 px-1 text-[10px] text-slate-500">Avoid entering passwords or full bank account details.</p>
        </form>
      </div>

      <div className="border-t border-slate-200 bg-slate-50/70 p-3 sm:p-4">
        <p className="mb-2 text-xs font-semibold text-slate-600">Optional guided tools and questions — open only when needed</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <details className="rounded-xl border border-slate-200 bg-white p-3">
            <summary className="cursor-pointer list-none text-sm font-bold text-slate-800"><FileSearch className="mr-2 inline h-4 w-4 text-emerald-700"/> Tools & Assessments <ChevronRight className="ml-1 inline h-3.5 w-3.5"/></summary>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">Open a structured scanner only when you choose it.</p>
            <div className="mt-2 space-y-2">
              <button type="button" onClick={()=>onNavigateTab('live-tools')} className="w-full rounded-lg border border-slate-200 p-2.5 text-left text-xs font-semibold text-slate-800 hover:border-emerald-300 hover:bg-emerald-50">Contract Risk Scanner <span className="mt-1 block font-normal text-slate-500">Review clauses and potential risk areas</span></button>
              <button type="button" onClick={()=>onNavigateTab('live-tools')} className="w-full rounded-lg border border-slate-200 p-2.5 text-left text-xs font-semibold text-slate-800 hover:border-emerald-300 hover:bg-emerald-50">Bank DSCR Scanner <span className="mt-1 block font-normal text-slate-500">Check debt-service coverage</span></button>
              <button type="button" onClick={()=>onNavigateTab('live-tools')} className="w-full rounded-lg bg-emerald-800 p-2.5 text-left text-xs font-semibold text-white hover:bg-emerald-900">View all live tools →</button>
            </div>
          </details>
          <details className="rounded-xl border border-slate-200 bg-white p-3">
            <summary className="cursor-pointer list-none text-sm font-bold text-slate-800"><BriefcaseBusiness className="mr-2 inline h-4 w-4 text-emerald-700"/> Guided business questions <ChevronRight className="ml-1 inline h-3.5 w-3.5"/></summary>
            <div className="mt-2 flex flex-wrap gap-2">{starters.map(({icon: Icon,title,prompt})=><button key={title} type="button" onClick={()=>send(prompt)} disabled={busy} className="rounded-full border border-slate-200 px-3 py-2 text-left text-xs font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50"><Icon className="mr-1.5 inline h-3.5 w-3.5 text-emerald-700"/>{title}</button>)}</div>
          </details>          <details className="rounded-xl border border-slate-200 bg-white p-3">
            <summary className="cursor-pointer list-none text-sm font-bold text-slate-800"><Users className="mr-2 inline h-4 w-4 text-emerald-700"/> Solutions by industry <ChevronRight className="ml-1 inline h-3.5 w-3.5"/></summary>
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
              ].map(sector=><button key={sector.title} type="button" onClick={()=>send(sector.prompt)} disabled={busy} className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 disabled:opacity-50">{sector.title}<ChevronRight className="h-3 w-3 shrink-0 text-emerald-700"/></button>)}
            </div>
          </details>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-slate-500">Guidance is based on the information you provide. Financial, legal, tax and regulated decisions may require review by an appropriately qualified professional.</p>
      </div>
    </div>
  </section>;
}