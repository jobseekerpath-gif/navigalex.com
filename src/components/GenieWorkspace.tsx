import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Sparkles, Wallet, TrendingDown, Landmark, FileSearch, ShieldCheck, Scale, Workflow, Users, ChevronRight, RotateCcw, MessageCircle, BriefcaseBusiness, ChartNoAxesCombined } from 'lucide-react';

type Message = { id: string; role: 'user' | 'guide'; text: string; };
type Props = { onOpenAssessment: (concern?: string) => void; onNavigateTab: (tab: string) => void };

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
          <div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-200">Navigalex</p><h1 className="mt-1 text-xl font-bold tracking-tight sm:text-3xl">Tell us what is happening. Find your next step.</h1></div>
          {messages.length > 0 && <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10" type="button"><RotateCcw className="h-3.5 w-3.5"/>New chat</button>}
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">Describe your situation in everyday language. You do not need to know the name of a service or even what kind of help to ask for. We will help clarify the problem, explain possible options and guide you to a practical next step.</p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="min-w-0 border-b border-slate-200 lg:border-b-0 lg:border-r">
          <div className="flex min-h-[280px] flex-col gap-4 p-4 sm:p-7">
            {messages.length === 0 ? <>
              <div className="max-w-2xl rounded-2xl rounded-tl-md border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900"><MessageCircle className="h-4 w-4 text-blue-700"/> Start anywhere</div>
                <p className="text-sm leading-relaxed text-slate-600">Tell me what is going wrong, what you want to achieve, or what you are worried about. I can ask a few questions before suggesting a route. You can also choose an example on the right.</p>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {starters.slice(0,4).map(({icon: Icon,title,prompt})=><button key={title} type="button" onClick={()=>send(prompt)} className="group flex items-start gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-blue-300 hover:bg-blue-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"><span className="rounded-lg bg-slate-100 p-2 text-slate-700 group-hover:bg-white"><Icon className="h-4 w-4"/></span><span className="flex-1 text-sm font-semibold leading-snug text-slate-800">{title}<span className="mt-1 block text-xs font-normal text-slate-500">Help me figure this out <ChevronRight className="inline h-3 w-3"/></span></span></button>)}
              </div>
            </> : messages.map(m=><div key={m.id} className={m.role==='user'?'ml-auto max-w-[92%] rounded-2xl rounded-tr-md bg-blue-700 px-4 py-3 text-sm leading-relaxed text-white sm:max-w-[85%]':'max-w-[96%] rounded-2xl rounded-tl-md border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-relaxed text-slate-800 sm:max-w-[90%]'}><div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider opacity-70">{m.role==='user'?'You':'Navigalex guide'}</div><div className="whitespace-pre-wrap">{m.text}</div>{m.role==='guide'&&<div className="mt-4 border-t border-slate-200 pt-3"><p className="mb-2 text-xs font-bold text-slate-600">Possible next routes</p><div className="flex flex-wrap gap-2">{suggestServices(messages.filter(x=>x.role==='user').map(x=>x.text).join(' ')).map(s=><button key={s.name} type="button" onClick={()=>s.tab==='live-tools'?onNavigateTab('live-tools'):s.tab==='family-office'?onNavigateTab('family-office'):onNavigateTab('services')} className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-50">{s.name} <ChevronRight className="inline h-3 w-3"/></button>)}<button type="button" onClick={()=>onOpenAssessment(messages.filter(x=>x.role==='user').map(x=>x.text).join(' ').slice(0,180))} className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700">Talk to an adviser</button></div></div>}</div>)}
            {busy&&<div className="flex items-center gap-2 text-sm text-slate-500"><span className="h-2 w-2 animate-pulse rounded-full bg-blue-600"/><span>Reviewing your situation…</span></div>}
            {error&&<div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{error} <button type="button" className="ml-1 font-bold underline" onClick={()=>send(messages.filter(m=>m.role==='user').slice(-1)[0]?.text)}>Try again</button></div>}
            <div ref={endRef}/>
          </div>
          <form onSubmit={e=>{e.preventDefault();void send();}} className="border-t border-slate-200 bg-white p-3 sm:p-5">
            <label htmlFor="genie-input" className="sr-only">Describe your problem or goal</label>
            <div className="flex items-end gap-2 rounded-2xl border border-slate-300 bg-slate-50 p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <textarea id="genie-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();void send();}}} rows={2} maxLength={4000} placeholder="Describe what is happening… (e.g. customers pay late, costs keep rising, or I don't know where to start)" className="max-h-36 min-h-[52px] flex-1 resize-y bg-transparent px-2 py-2 text-base text-slate-900 outline-none placeholder:text-slate-400" />
              <button type="submit" disabled={!input.trim()||busy} aria-label="Send message" className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"><ArrowUp className="h-5 w-5"/></button>
            </div>
            <p className="mt-2 px-1 text-[11px] text-slate-500">Do not enter passwords, full bank account details or other highly sensitive information.</p>
          </form>
        </div>

        <aside className="bg-slate-50/70 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4 text-blue-700"/><h2 className="text-sm font-bold text-slate-900">Not sure what you need?</h2></div>
          <p className="mb-4 text-xs leading-relaxed text-slate-600">Choose the closest situation. These are starting points, not diagnoses.</p>
          <div className="space-y-2">{starters.map(({icon: Icon,title,prompt})=><button key={title} type="button" onClick={()=>send(prompt)} disabled={busy} className="flex w-full items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-700"/><span className="text-xs font-semibold leading-relaxed text-slate-700">{title}</span></button>)}</div>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs font-bold text-slate-800">Services available through this window</p><p className="mt-1.5 text-xs leading-relaxed text-slate-600">Finance, credit readiness, cash flow, contracts, collections, audit and controls, governance, compliance, trade finance, family wealth, strategy, operations, forecasting and digital systems.</p><button type="button" onClick={()=>onNavigateTab('services')} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900">Browse service details <ChevronRight className="h-3 w-3"/></button></div>
          <p className="mt-4 text-[10px] leading-relaxed text-slate-500">Guidance is based on the information you provide. Financial, legal, tax and regulated decisions may require review by an appropriately qualified professional.</p>
        </aside>
      </div>
    </div>
  </section>;
}
