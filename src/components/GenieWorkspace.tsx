import React, { useMemo, useState } from 'react';
import {
  ArrowRight, CheckCircle2, ChartNoAxesCombined, ChevronLeft, ChevronRight,
  FileSearch, Landmark, MessageCircle, RotateCcw, ShieldCheck, Sparkles,
  Send, Users, Wallet, Workflow
} from 'lucide-react';

type Props = {
  onOpenAssessment: (concern?: string) => void;
  onNavigateTab: (tab: string) => void;
};

type RouteChoice = 'quick' | 'decision' | 'repeat';
type Service = {
  id: string;
  title: string;
  pillar: string;
  shortLabel: string;
  description: string;
  bestFor: string;
  deliverables: string[];
  concern: string;
  toolLabel?: string;
  Icon: typeof ShieldCheck;
};

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  suggestedServiceId?: string;
  suggestedPrompts?: string[];
};

const SERVICES: Service[] = [
  {
    id: 'financial-clarity',
    title: 'Financial Clarity Check',
    pillar: 'Finance & cash flow',
    shortLabel: 'Cash is tight or the numbers are unclear',
    description: 'See the cash, cost and working-capital pressure points before they become a bigger decision.',
    bestFor: 'Business owners who need a clear financial starting point before taking the next step.',
    deliverables: [
      'A simple 13-week cash-flow view using your supplied information',
      'A short list of cash, cost and working-capital pressure points',
      'A practical 30-day action plan with priorities'
    ],
    concern: 'Financial Clarity Check — cash flow, costs or working-capital pressure',
    Icon: Wallet
  },
  {
    id: 'contract-collections',
    title: 'Contract & Collections Review',
    pillar: 'Contracts & collections',
    shortLabel: 'Customer payments are late or contract terms worry me',
    description: 'Turn delayed payments and unclear commercial terms into a simple, prioritised follow-up plan.',
    bestFor: 'B2B businesses handling overdue invoices, disputed payments or unclear customer terms.',
    deliverables: [
      'A review of agreed customer contracts and overdue invoices',
      'A payment and clause risk checklist with clear priorities',
      'A collections tracker and non-legal follow-up wording'
    ],
    concern: 'Contract & Collections Review — overdue payments or customer contract terms',
    Icon: FileSearch
  },
  {
    id: 'risk-assurance',
    title: 'Risk Management & Assurance Review',
    pillar: 'Risk management',
    shortLabel: 'I want to know the risks that could hurt the business',
    description: 'Make the important risks visible, assign ownership and decide what deserves attention first.',
    bestFor: 'Owner-led businesses that want a practical risk view without starting a large consulting programme.',
    deliverables: [
      'A focused business risk register covering the agreed areas',
      'A simple likelihood-and-impact priority view',
      'Risk owners, mitigation actions and review dates'
    ],
    concern: 'Risk Management & Assurance Review — identify and prioritise business risks',
    Icon: ShieldCheck
  },
  {
    id: 'controls-fraud',
    title: 'Controls & Fraud-Prevention Snapshot',
    pillar: 'Controls & assurance',
    shortLabel: 'A process feels unsafe, inconsistent or hard to control',
    description: 'Review one important process and identify the few controls worth strengthening first.',
    bestFor: 'Teams concerned about approvals, payments, procurement, inventory or avoidable process errors.',
    deliverables: [
      'A walkthrough of one agreed business process',
      'A concise gap and control checklist',
      'A corrective-action tracker with owners and dates'
    ],
    concern: 'Controls & Fraud-Prevention Snapshot — process controls and assurance',
    Icon: Workflow
  },
  {
    id: 'funding-readiness',
    title: 'Lender & Funding Readiness Check',
    pillar: 'Finance & funding',
    shortLabel: 'I need to prepare for a loan, renewal or major funding decision',
    description: 'Understand the financial story, gaps and questions to address before you approach a lender.',
    bestFor: 'Businesses preparing for a facility renewal, capex decision or financing conversation.',
    deliverables: [
      'A lender-readiness checklist based on supplied information',
      'An indicative cash and debt-service discussion',
      'A document and data gap list for the next conversation'
    ],
    concern: 'Lender & Funding Readiness Check — preparing for a financing decision',
    toolLabel: 'Open the DSCR calculator',
    Icon: Landmark
  },
  {
    id: 'growth-governance',
    title: 'Growth & Governance Sprint',
    pillar: 'Owner decisions & governance',
    shortLabel: 'The business is growing but decisions and ownership feel messy',
    description: 'Create a clear way to manage important decisions, roles and recurring business reviews.',
    bestFor: 'Growing or family-owned businesses that need clearer accountability around the next stage of growth.',
    deliverables: [
      'A focused decision and responsibility map',
      'A simple leadership review cadence',
      'A 90-day governance and execution action list'
    ],
    concern: 'Growth & Governance Sprint — ownership, decisions and execution discipline',
    Icon: Users
  },
  {
    id: 'strategy-sprint',
    title: 'Strategy & Market Growth Sprint',
    pillar: 'Strategy & growth',
    shortLabel: 'I need to choose a growth direction or new market',
    description: 'Structure one important growth decision with explicit assumptions, options, risks and a short execution roadmap.',
    bestFor: 'Owner-led businesses evaluating a new market, product, channel or a turnaround priority.',
    deliverables: ['A decision brief defining the business question and success measures', 'A comparison of up to three strategic options using client-supplied evidence', 'A 90-day action roadmap with assumptions and decision gates'],
    concern: 'Strategy & Market Growth Sprint — prioritise growth options and a practical 90-day plan',
    Icon: ChartNoAxesCombined
  },
  {
    id: 'project-delivery',
    title: 'Project Delivery & Recovery Review',
    pillar: 'Project management',
    shortLabel: 'A project is delayed, over budget or unclear',
    description: 'Make delivery status, dependencies, risks and next decisions visible for one defined project.',
    bestFor: 'Small teams managing a project with missed milestones, unclear ownership or changing scope.',
    deliverables: ['A review of the current plan, milestones, budget assumptions and dependencies', 'A concise RAID log covering risks, assumptions, issues and dependencies', 'A recovery or next-phase plan with owners, dates and decision points'],
    concern: 'Project Delivery & Recovery Review — assess project health and reset next actions',
    Icon: Workflow
  },
  {
    id: 'digital-workflow-review',
    title: 'Digital Workflow & Systems Review',
    pillar: 'IT & digital operations',
    shortLabel: 'My software and everyday processes do not work smoothly together',
    description: 'Review one business workflow and its tools to identify duplicated work, handoff problems and practical improvements.',
    bestFor: 'Small teams relying on spreadsheets, email and multiple SaaS tools for recurring work.',
    deliverables: ['A current-state workflow map and friction-point list', 'Prioritised process and configuration improvements', 'A phased next-step brief with dependencies and risks'],
    concern: 'Digital Workflow & Systems Review — improve one business workflow and its tools',
    Icon: Workflow
  },
];

const ROUTE_CHOICES: Array<{ id: RouteChoice; title: string; detail: string }> = [
  {
    id: 'quick',
    title: 'I need a clear starting point',
    detail: 'Give me the fastest useful review and a short action list.'
  },
  {
    id: 'decision',
    title: 'I have an important decision coming up',
    detail: 'Help me prepare the facts and questions before I commit.'
  },
  {
    id: 'repeat',
    title: 'This issue keeps coming back',
    detail: 'Help me find the root gap and assign a practical fix.'
  }
];

const ROUTE_COPY: Record<RouteChoice, string> = {
  quick: 'Start with a defined review so you can see the issue, the evidence needed and the first actions without a long discovery process.',
  decision: 'Start with the facts that support the decision, then clarify the unanswered questions before you commit time or money.',
  repeat: 'Start by locating the repeat point in the process, then give the right person a measurable action to close it.'
};

const CHAT_PROMPTS = [
  'Cash flow is tight',
  'Customers are paying late',
  'I am worried about business risks',
  'I need funding or a loan',
  'A process feels unsafe',
  'Growth decisions are unclear',
  'I need a growth strategy',
  'My project is delayed or over budget',
  'Financial Clarity Check',
  'Contract & Collections Review',
  'Risk Management & Risk Assurance',
  'Controls & Compliance Snapshot',
  'Finance & Funding Readiness',
  'Strategy & Growth',
  'Project Management & Recovery',
  'IT & Digital Operations',
  'Contract Risk Scanner (Live)',
  'Bank DSCR Scanner (Live)'
]

function matchServiceFromMessage(message: string): Service | null {
  const value = message.toLowerCase();

  if (/(invoice|overdue|late payment|customer payment|contract|collections?)/.test(value)) {
    return SERVICES.find((service) => service.id === 'contract-collections') ?? null;
  }
  if (/(fraud|approval|procurement|inventory|process|control|unsafe)/.test(value)) {
    return SERVICES.find((service) => service.id === 'controls-fraud') ?? null;
  }
  if (/(loan|lender|funding|finance|borrow|dscr|facility|capex)/.test(value)) {
    return SERVICES.find((service) => service.id === 'funding-readiness') ?? null;
  }
  if (/(risk|compliance|incident|assurance|reputation)/.test(value)) {
    return SERVICES.find((service) => service.id === 'risk-assurance') ?? null;
  }
  if (/(project|milestone|delivery|over budget|delayed|dependency|pmo|project management|turnaround)/.test(value)) { return SERVICES.find((service) => service.id === 'project-delivery') ?? null; }
  if (/(strategy|market entry|new market|portfolio|competitive|growth plan|transformation)/.test(value)) { return SERVICES.find((service) => service.id === 'strategy-sprint') ?? null; }
  if (/(it & digital|digital operations|cybersecurity|cyber security|vendor risk|systems workflow|digital workflow|software tools)/.test(value)) { return SERVICES.find((service) => service.id === 'digital-workflow-review') ?? null; }
  if (/(growth|team|owner|ownership|governance|decision|accountability)/.test(value)) {
    return SERVICES.find((service) => service.id === 'growth-governance') ?? null;
  }
  if (/(cash|cost|margin|profit|working capital|money|financial)/.test(value)) {
    return SERVICES.find((service) => service.id === 'financial-clarity') ?? null;
  }

  return null;
}

export default function GenieWorkspace({ onOpenAssessment, onNavigateTab }: Props) {
  const [screen, setScreen] = useState<'start' | 'context' | 'result'>('start');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [route, setRoute] = useState<RouteChoice | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const [chatError, setChatError] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'I will suggest the clearest starting service.'
    }
  ]);

  const selectedService = useMemo(
    () => SERVICES.find((service) => service.id === selectedServiceId) ?? null,
    [selectedServiceId]
  );
  const step = screen === 'start' ? 1 : screen === 'context' ? 2 : 3;

  const chooseService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setRoute(null);
    setScreen('context');
  };

  const sendChatMessage = async (rawMessage: string) => {
    const text = rawMessage.trim();
    if (!text || chatBusy) return;
    setChatInput('');
    setChatError('');
    setChatBusy(true);
    const userMessage: ChatMessage = { id: 'user-' + Date.now(), role: 'user', text };
    setChatMessages((messages) => [...messages, userMessage]);
    try {
      const response = await fetch('/api/bot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: chatMessages.slice(-8), visitorId: 'financial-genie' })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.success !== true || typeof payload.reply !== 'string') {
        throw new Error(payload.error || 'Financial Genie could not respond just now. Please retry or describe your business problem.');
      }
      const match = matchServiceFromMessage(text);
      const prompts = match?.id === 'financial-clarity'
        ? ['Build a 13-week cash-flow forecast', 'Find the biggest cash leak', 'Make a 30-day action plan']
        : match?.id === 'contract-collections'
          ? ['Prioritise overdue invoices', 'Review customer payment terms', 'Create a collections tracker']
          : match?.id === 'risk-assurance'
            ? ['Create a business risk register', 'Prioritise compliance gaps', 'Review vendor and cyber risks']
            : match?.id === 'controls-fraud'
              ? ['Review payment approvals', 'Find process control gaps', 'Build a fraud-prevention checklist']
              : match?.id === 'funding-readiness'
                ? ['Check lender readiness', 'Estimate debt-service coverage', 'Prepare a lender document list']
                : match?.id === 'growth-governance'
                  ? ['Set 90-day priorities', 'Clarify team responsibilities', 'Build a simple performance dashboard']
                  : match?.id === 'strategy-sprint' ? ['Compare three growth options', 'Build a 90-day strategy roadmap', 'List assumptions to validate'] : match?.id === 'project-delivery' ? ['Review project milestones', 'Create a RAID log', 'Build a recovery plan'] : ['What information do you need from me?', 'Explain costs and deliverables', 'Help me choose a solution'];
      setChatMessages((messages) => [...messages, {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        text: payload.reply,
        suggestedServiceId: match?.id,
        suggestedPrompts: prompts
      }]);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : 'Could not reach the advisory assistant. Please try again.');
    } finally {
      setChatBusy(false);
    }
  };

  const chooseChatOption = (prompt: string) => {
    document.getElementById('financial-genie-chat')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    void sendChatMessage(prompt);
  };

  const reset = () => {
    setSelectedServiceId(null);
    setRoute(null);
    setScreen('start');
  };

  const openAllServices = () => {
    window.history.pushState(null, '', '/services');
    onNavigateTab('services');
  };

  const openScope = () => {
    if (!selectedService) return;
    window.history.pushState(null, '', '/services?service=' + selectedService.id);
    onNavigateTab('services');
  };

  const requestProposal = () => {
    if (!selectedService) return;
    const routeText = route
      ? ' — ' + ROUTE_CHOICES.find((choice) => choice.id === route)?.title
      : '';
    onOpenAssessment('Financial Genie: ' + selectedService.concern + routeText);
  };

  return (
    <section className="relative mx-auto w-full max-w-7xl px-2 pb-6 pt-3 sm:px-4 sm:pt-4">
      <div className="overflow-hidden rounded-2xl border border-[#244bd7]/25 bg-white shadow-[0_12px_36px_rgba(30,64,175,0.12)]">
        <header className="relative overflow-hidden bg-gradient-to-br from-[#0d1c48] via-[#1f4fff] to-[#27419d] px-3 py-2 text-white sm:px-4 sm:py-2.5">
          <div className="absolute -right-16 -top-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-cyan-200/15 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex max-w-3xl items-start gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-base font-black tracking-tight text-[#1f4fff] shadow-lg shadow-slate-950/15" aria-hidden="true">N</span>
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-100">Navigalex Advisory</p>
                <h1 className="mt-0.5 text-lg font-extrabold tracking-tight sm:text-xl">Financial Genie</h1>
                <p className="mt-1 max-w-2xl text-xs leading-snug text-blue-50 sm:text-sm">
                  Choose the business problem first. Financial Genie will show the right starting service, what you receive and the next step.
                </p>
              </div>
            </div>
            {screen !== 'start' && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <RotateCcw className="h-4 w-4" />
                Start over
              </button>
            )}
          </div>

          <div className="relative mt-2 grid grid-cols-3 gap-1 text-center text-[9px] sm:max-w-xl sm:text-[10px]">
            {[
              ['1', 'Choose your need'],
              ['2', 'Set your goal'],
              ['3', 'See your next step']
            ].map(([number, label], index) => (
              <div key={number} className={index + 1 <= step ? 'rounded-lg bg-white/20 px-2 py-1 font-bold text-white' : 'rounded-lg border border-white/15 bg-slate-950/10 px-2 py-1 text-blue-100'}>
                <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">{number}</span>
                {label}
              </div>
            ))}
          </div>
        </header>

        <div className="p-3 sm:p-5">
          {screen === 'start' && (
            <div className="space-y-5 rounded-2xl bg-gradient-to-br from-[#02044b] via-[#0715a5] to-[#000d63] p-4 text-white shadow-[0_16px_44px_rgba(2,6,80,0.28)] sm:p-6">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-blue-600 p-3"><MessageCircle className="h-6 w-6" /></span>
                <div>
                  <p className="text-sm font-semibold">Chat with</p>
                  <h2 className="text-2xl font-extrabold">Financial Genie</h2>
                </div>
              </div>
              <p className="text-lg font-bold lg:col-span-2">I will suggest the clearest starting service.</p>
              <div className="grid items-start gap-5 lg:col-span-2 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
              <section id="financial-genie-chat" aria-label="Financial Genie chat" className="order-2 min-w-0 rounded-xl bg-white p-3 text-slate-900 lg:order-1">
                <div className="max-h-72 min-h-20 space-y-3 overflow-y-auto p-2" aria-live="polite">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={message.role === 'user' ? 'ml-auto max-w-[85%] rounded-xl bg-blue-700 p-3 text-sm text-white' : 'max-w-[85%] rounded-xl bg-slate-100 p-3 text-sm text-slate-800'}>
                      {message.text}
                      {message.suggestedPrompts && <div className="mt-2 flex flex-wrap gap-2">{message.suggestedPrompts.map(prompt => <button key={prompt} type="button" disabled={chatBusy} onClick={() => sendChatMessage(prompt)} className="rounded-lg border bg-white px-2 py-1 text-xs text-blue-800">{prompt}</button>)}</div>}
                      {message.suggestedServiceId && <button type="button" onClick={() => chooseService(message.suggestedServiceId!)} className="mt-2 block rounded-lg bg-blue-700 px-3 py-2 text-xs font-bold text-white">Show recommended service</button>}
                    </div>
                  ))}
                </div>
                {chatBusy && <p role="status" className="p-2 text-xs">Financial Genie is preparing a response…</p>}
                {chatError && <p role="alert" className="p-2 text-xs text-red-700">{chatError}</p>}
                <div className="my-3 flex flex-wrap gap-2">
                  {CHAT_PROMPTS.slice(0, 8).map(prompt => <button key={prompt} type="button" disabled={chatBusy} onClick={() => chooseChatOption(prompt)} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-900 hover:bg-blue-100">{prompt}</button>)}
                </div>
                <form onSubmit={e => {e.preventDefault(); sendChatMessage(chatInput);}} className="space-y-2">
                  <label htmlFor="financial-genie-message" className="sr-only">Describe your business problem</label>
                  <textarea id="financial-genie-message" value={chatInput} onChange={e => setChatInput(e.target.value)} rows={4} placeholder="Describe your business problem..." className="w-full resize-y rounded-xl border border-slate-200 p-3 text-sm text-slate-950 outline-none focus:border-blue-500" />
                  <div className="flex justify-end"><button type="submit" disabled={chatBusy || !chatInput.trim()} className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-2 text-sm font-bold text-white disabled:opacity-50"><Send className="h-4 w-4" /> Send</button></div>
                </form>
              </section>
              <section aria-label="Navigalex Services and Live Assessments" className="order-1 min-w-0 space-y-4 lg:order-2">
                <section aria-label="Navigalex Services">
                  <h3 className="mb-2 text-base font-bold">Navigalex Services</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ['Financial Clarity Check','Cash flow, costs and credit readiness'],
                      ['Contract & Collections Review','Payment delays and key contract risks'],
                      ['Risk Management & Risk Assurance','Enterprise, operational, regulatory and third-party risks'],
                      ['Controls & Compliance Snapshot','Priority process gaps and next steps'],
                      ['Finance & Funding Readiness','Forecasting, financial modelling and lender preparation'],
                      ['Strategy & Growth','Market entry, transformation and performance improvement'],
                      ['Project Management & Recovery','Delivery, PMO, budgets, dependencies and turnaround'],
                      ['IT & Digital Operations','Systems workflows, IT controls, cybersecurity and vendor risks']
                    ].map(([title, detail]) => (
                      <button key={title} type="button" disabled={chatBusy} onClick={() => chooseChatOption(title + ': ' + detail)} className="flex min-h-24 items-center justify-between gap-2 rounded-xl border border-blue-100 bg-white p-3 text-left text-slate-950 shadow-sm transition hover:bg-blue-50 disabled:opacity-60">
                        <span><span className="block text-sm font-extrabold">{title}</span><span className="mt-1 block text-xs leading-relaxed text-slate-600">{detail}</span></span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-blue-700" />
                      </button>
                    ))}
                  </div>
                </section>
                <section aria-label="Live Assessments and Guides">
                  <h3 className="mb-2 text-base font-bold">Live Assessments &amp; Guides</h3>
                  <div className="grid gap-2">
                    {['Contract Risk Scanner','Bank DSCR Scanner'].map((title) => (
                      <button key={title} type="button" disabled={chatBusy} onClick={() => chooseChatOption('Help me use the ' + title)} className="flex items-center justify-between rounded-xl bg-cyan-50 p-4 text-left text-slate-950 hover:bg-cyan-100 disabled:opacity-60">
                        <span className="text-sm font-bold">{title} <span className="ml-2 rounded-full bg-emerald-200 px-2 py-1 text-xs text-emerald-900">Live</span></span>
                        <ChevronRight className="h-4 w-4 text-teal-700" />
                      </button>
                    ))}
                  </div>
                </section>
              </section>
              </div>
            </div>
          )}

          {screen === 'context' && selectedService && (
            <div className="mx-auto max-w-3xl space-y-6">
              <button type="button" onClick={() => setScreen('start')} className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-[#1f4fff] hover:text-[#183bc4]">
                <ChevronLeft className="h-4 w-4" /> Change the business problem
              </button>
              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 sm:p-6">
                <span className="text-xs font-bold uppercase tracking-wide text-[#1f4fff]">You selected</span>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">{selectedService.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{selectedService.bestFor}</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">What do you need from this first step?</h2>
                <p className="text-sm leading-relaxed text-slate-600">One choice helps Financial Genie show the most useful next action. This does not lock you into a service.</p>
              </div>

              <div className="grid gap-3">
                {ROUTE_CHOICES.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => { setRoute(choice.id); setScreen('result'); }}
                    className="group flex min-h-20 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-[#1f4fff] hover:bg-blue-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4fff]"
                  >
                    <span>
                      <span className="block font-extrabold text-slate-950">{choice.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-600">{choice.detail}</span>
                    </span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#1f4fff]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {screen === 'result' && selectedService && route && (
            <div className="mx-auto max-w-4xl space-y-6">
              <button type="button" onClick={() => setScreen('context')} className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-[#1f4fff] hover:text-[#183bc4]">
                <ChevronLeft className="h-4 w-4" /> Change what I need
              </button>

              <div className="overflow-hidden rounded-3xl border border-[#1f4fff]/20">
                <div className="bg-gradient-to-r from-[#eff4ff] to-white p-5 sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#1f4fff] shadow-sm">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Recommended starting point
                      </span>
                      <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{selectedService.title}</h2>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">{ROUTE_COPY[route]}</p>
                    </div>
                    <span className="inline-flex shrink-0 rounded-2xl bg-[#1f4fff] p-3 text-white"><selectedService.Icon className="h-6 w-6" /></span>
                  </div>
                </div>

                <div className="grid gap-6 bg-white p-5 sm:grid-cols-[1.1fr_.9fr] sm:p-7">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">What you receive</h3>
                    <ul className="mt-3 space-y-3">
                      {selectedService.deliverables.map((deliverable) => (
                        <li key={deliverable} className="flex gap-2.5 text-sm leading-relaxed text-slate-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">How it works</p>
                    <ol className="mt-3 space-y-3 text-sm text-slate-700">
                      <li><span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1f4fff] text-[10px] font-bold text-white">1</span>We confirm the scope and information needed.</li>
                      <li><span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1f4fff] text-[10px] font-bold text-white">2</span>You receive the agreed review and action list.</li>
                      <li><span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1f4fff] text-[10px] font-bold text-white">3</span>We discuss the practical next move.</li>
                    </ol>
                  </aside>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:flex-wrap sm:items-center sm:p-6">
                  <button type="button" onClick={openScope} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#1f4fff] bg-white px-4 py-3 text-sm font-bold text-[#1f4fff] hover:bg-blue-50">
                    View full scope <ArrowRight className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={requestProposal} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#1f4fff] px-4 py-3 text-sm font-bold text-white hover:bg-[#183bc4]">
                    Request a scoped proposal <ArrowRight className="h-4 w-4" />
                  </button>
                  {selectedService.toolLabel && (
                    <button type="button" onClick={() => onNavigateTab('live-tools')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-100">
                      <ChartNoAxesCombined className="h-4 w-4" /> {selectedService.toolLabel}
                    </button>
                  )}
                </div>
              </div>

              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-950">Want to explore a different need?</h3>
                    <p className="mt-1 text-sm text-slate-600">Choose another path without losing your place.</p>
                  </div>
                  <button type="button" onClick={reset} className="mt-2 min-h-11 self-start text-sm font-bold text-[#1f4fff] underline underline-offset-2 sm:mt-0">Show all choices</button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SERVICES.filter((service) => service.id !== selectedService.id).map((service) => (
                    <button key={service.id} type="button" onClick={() => chooseService(service.id)} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-left text-xs font-bold text-slate-700 hover:border-[#1f4fff] hover:bg-blue-50">
                      {service.title} <ChevronRight className="h-3.5 w-3.5 text-[#1f4fff]" />
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        <footer className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-xs leading-relaxed text-slate-600 sm:px-7">
          Navigalex provides business advisory within an agreed written scope. Financial Genie helps you choose a starting point; it does not provide legal, tax, regulatory, investment or lending approval advice.
        </footer>
      </div>
    </section>
  );
}
