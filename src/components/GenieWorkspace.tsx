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
  'My project is delayed or over budget'
];

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
  if (/(project|milestone|delivery|over budget|delayed|dependency|pmo|project management)/.test(value)) { return SERVICES.find((service) => service.id === 'project-delivery') ?? null; }
  if (/(strategy|market entry|new market|turnaround|portfolio|competitive|growth plan)/.test(value)) { return SERVICES.find((service) => service.id === 'strategy-sprint') ?? null; }
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
      text: 'Hi, I am Financial Genie. Tell me what is happening in your business, or choose a quick option below. I will suggest the clearest starting service.'
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
        throw new Error(payload.error || 'The advisory assistant is temporarily unavailable. Please use a service card or request a scoped proposal.');
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

  const reset = () => {
    setSelectedServiceId(null);
    setRoute(null);
    setScreen('start');
  };

  const openAllServices = () => {
    document.getElementById('genie-services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    <section className="relative mx-auto w-full max-w-5xl px-2 pb-6 pt-3 sm:px-4 sm:pt-4">
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
            <div className="space-y-4">
              <div className="max-w-3xl space-y-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#1f4fff]">
                  <Sparkles className="h-3.5 w-3.5" />
                  No jargon. No documents needed to begin.
                </span>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">What would you like to fix first?</h2>
                <p className="text-sm leading-relaxed text-slate-600 sm:text-base">Pick the statement closest to your situation. You can change it at any time.</p>
              </div>

              <div className="min-w-0">
              <section aria-label="Financial Genie chat" className="overflow-hidden rounded-2xl border border-blue-200 bg-slate-50 shadow-sm">
                <div className="flex items-center gap-3 bg-[#0d1c48] px-4 py-3 text-white">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><MessageCircle className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-extrabold">Chat with Financial Genie</p>
                    <p className="text-xs text-blue-100"><span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-300" />Ready to help you choose</p>
                  </div>
                </div>

                <div className="max-h-[32rem] min-h-[24rem] space-y-3 overflow-y-auto bg-white p-4 sm:p-6" aria-live="polite">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={message.role === 'user' ? 'ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-[#1f4fff] px-4 py-3 text-sm leading-relaxed text-white sm:max-w-[75%]' : 'max-w-[88%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-800 sm:max-w-[75%]'}>
                      {message.text}
                      {message.suggestedPrompts && (
                        <div className="mt-3 flex flex-wrap gap-2" aria-label="Suggested next questions">
                          {message.suggestedPrompts.map((prompt) => (
                            <button key={prompt} type="button" onClick={() => sendChatMessage(prompt)} disabled={chatBusy} className="min-h-10 rounded-xl border border-blue-200 bg-white px-3 py-2 text-left text-xs font-bold text-[#1f4fff] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4fff]">{prompt} <ArrowRight className="ml-1 inline h-3 w-3" /></button>
                          ))}
                        </div>
                      )}
                      {message.suggestedServiceId && (
                        <button
                          type="button"
                          onClick={() => chooseService(message.suggestedServiceId!)}
                          className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-[#1f4fff] px-3 py-2 text-xs font-extrabold text-white hover:bg-[#183bc4]"
                        >
                          Show my recommended service <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {chatBusy && <p className="px-4 py-2 text-xs font-semibold text-slate-600" role="status">Financial Genie is preparing a response…</p>}
                {chatError && <div className="mx-3 my-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="alert">{chatError} <button type="button" className="ml-2 font-bold underline" onClick={() => sendChatMessage(chatMessages.filter((m) => m.role === "user").slice(-1)[0]?.text || chatInput)}>Retry</button></div>}
                <div className="border-t border-slate-200 bg-slate-50 p-3 sm:p-4">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {CHAT_PROMPTS.map((prompt) => (
                      <button key={prompt} type="button" onClick={() => sendChatMessage(prompt)} disabled={chatBusy} className="min-h-9 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-[#1f4fff] hover:bg-blue-50">
                        {prompt}
                      </button>
                    ))}
                  </div>
                  <form onSubmit={(event) => { event.preventDefault(); sendChatMessage(chatInput); }} className="flex gap-2">
                    <label className="sr-only" htmlFor="financial-genie-message">Describe your business problem</label>
                    <input
                      id="financial-genie-message"
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      placeholder="For example: customers are paying us late"
                      className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-[#1f4fff] focus:ring-2 focus:ring-blue-100"
                    />
                    <button type="submit" disabled={chatBusy || !chatInput.trim()} className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#1f4fff] px-3 text-sm font-extrabold text-white hover:bg-[#183bc4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4fff]">
                      <Send className="h-4 w-4" /><span className="hidden sm:inline">Send</span>
                    </button>
                  </form>
                </div>

                <div className="border-t border-blue-100 bg-slate-50 p-3 sm:p-4">
                  <div className="mb-3">
                    <h3 className="text-sm font-extrabold text-slate-900">Choose a business need</h3>
                    <p className="mt-1 text-xs text-slate-600">Select any option to see the recommended starting service.</p>
                  </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SERVICES.map((service) => {
                  const Icon = service.Icon;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => chooseService(service.id)}
                      className="group min-h-0 rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#1f4fff] hover:shadow-lg hover:shadow-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4fff]"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="rounded-xl bg-blue-50 p-2.5 text-[#1f4fff]"><Icon className="h-5 w-5" /></span>
                        <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#1f4fff]" />
                      </span>
                      <span className="mt-2 block text-[11px] font-bold uppercase tracking-wide text-[#1f4fff]">{service.pillar}</span>
                      <span className="mt-1 block text-base font-extrabold leading-snug text-slate-950">{service.shortLabel}</span>
                      <span className="mt-2 block text-sm leading-relaxed text-slate-600">{service.description}</span>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#1f4fff]">Choose this path <ArrowRight className="h-3.5 w-3.5" /></span>
                    </button>
                  );
                })}
              </div>

                </div>
              </section>
              </div>
        </aside>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#1f4fff]" />
                  <div>
                    <p className="font-bold text-slate-900">Not sure what matters most?</p>
                    <p className="mt-1 text-sm text-slate-600">Choose one of the six fixed-scope advisory reviews below, or ask Financial Genie to guide you.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={openAllServices} className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-100">Browse all services in Genie</button>
                  <button type="button" onClick={() => onOpenAssessment('Help me choose the right Navigalex service')} className="min-h-11 rounded-xl bg-[#1f4fff] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#183bc4]">Help me choose</button>
                </div>
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
