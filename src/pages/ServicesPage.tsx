import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight, CheckCircle2, ChartNoAxesCombined, ChevronRight, ClipboardCheck,
  Clock3, FileText, Landmark, Search, ShieldCheck, Users, Wallet, Workflow
} from 'lucide-react';

type Pillar = 'finance' | 'risk' | 'governance';
type Service = {
  id: string;
  pillar: Pillar;
  pillarLabel: string;
  title: string;
  badge: string;
  tagline: string;
  summary: string;
  idealFor: string;
  outcomes: string[];
  deliverables: string[];
  clientInputs: string;
  timeframe: string;
  engagement: string;
  price: string;
  exclusions: string;
  Icon: typeof ShieldCheck;
};

export const ADVISORY_DESKS: Service[] = [
  {
    id: 'financial-clarity',
    pillar: 'finance',
    pillarLabel: 'Finance & Business Performance',
    title: 'Financial Clarity Check',
    badge: 'Start here',
    tagline: 'Understand the cash and cost pressure before the next business decision.',
    summary: 'A fixed-scope review of cash flow, working capital, costs and the information needed to make the next financial decision with confidence.',
    idealFor: 'Owner-led SMEs facing cash pressure, unclear numbers or a major payment decision.',
    outcomes: [
      'A clear view of the main cash and margin pressure points',
      'A simple 13-week cash-flow view based on supplied information',
      'A practical 30-day action list with priorities'
    ],
    deliverables: [
      'Kickoff questionnaire and information checklist',
      'Review of supplied management accounts and cash-flow inputs',
      'Cash-flow assumptions sheet and short findings summary',
      'One findings call and 30-day action list'
    ],
    clientInputs: 'Recent profit-and-loss statement, bank summaries, receivables/payables ageing if available, and expected major payments.',
    timeframe: 'Typically 5–7 working days after complete inputs',
    engagement: 'A fixed-scope desk review and one findings call. It is designed as a focused starting point.',
    price: 'Fixed quote after a short scoping call',
    exclusions: 'Not a statutory audit, assurance opinion, loan approval, tax opinion or investment recommendation.',
    Icon: Wallet
  },
  {
    id: 'contract-collections',
    pillar: 'risk',
    pillarLabel: 'Contracts & Collections',
    title: 'Contract & Collections Review',
    badge: 'Payment support',
    tagline: 'Turn delayed payments and unclear terms into a prioritised follow-up plan.',
    summary: 'A practical review of a small, agreed set of customer contracts and overdue invoices, focused on payment friction and next actions.',
    idealFor: 'B2B service providers, distributors and small manufacturers dealing with delayed payments or unclear commercial terms.',
    outcomes: [
      'A concise list of payment and contract risks in the supplied records',
      'A prioritised overdue-invoice follow-up plan',
      'Commercial questions or clause changes to take for professional review'
    ],
    deliverables: [
      'Review of up to three agreed contracts and a supplied overdue-invoice list',
      'Clause and payment-risk checklist with page or section references',
      'Collections action tracker and draft non-legal follow-up wording',
      'Findings summary and one review call'
    ],
    clientInputs: 'Up to three customer contracts, relevant invoices, payment terms and a current overdue-invoice list.',
    timeframe: 'Typically 5–7 working days after complete inputs',
    engagement: 'A fixed document limit and one feedback round, with practical handover material.',
    price: 'Fixed quote based on document count and complexity',
    exclusions: 'Not a legal opinion, debt recovery service, litigation support or guarantee of payment.',
    Icon: FileText
  },
  {
    id: 'risk-assurance',
    pillar: 'risk',
    pillarLabel: 'Risk Management & Assurance',
    title: 'Risk Management & Assurance Review',
    badge: 'Risk view',
    tagline: 'Identify the risks that matter, who owns them and what should happen next.',
    summary: 'A clear, practical risk review that turns business concerns into a prioritised risk register and action plan.',
    idealFor: 'Owners and leadership teams that need a shared view of the risks affecting growth, cash, operations or reputation.',
    outcomes: [
      'A focused view of the agreed business risks',
      'Clear priorities using likelihood and potential impact',
      'Named owners, mitigation actions and review dates'
    ],
    deliverables: [
      'Risk discovery questionnaire and working session',
      'Focused risk register for the agreed business areas',
      'Risk-priority matrix and mitigation action tracker',
      'Management summary and review discussion'
    ],
    clientInputs: 'Current business plan, key contracts or policies where relevant, known incidents or concerns, and access to the relevant decision maker.',
    timeframe: 'Typically 7–10 working days after the discovery discussion',
    engagement: 'A defined review of agreed risk areas, designed for practical management action rather than a large enterprise programme.',
    price: 'Fixed quote after a short scoping call',
    exclusions: 'Not a regulatory certification, statutory assurance opinion, legal opinion or guarantee that every risk will be identified.',
    Icon: ShieldCheck
  },
  {
    id: 'controls-fraud',
    pillar: 'risk',
    pillarLabel: 'Controls & Assurance',
    title: 'Controls & Fraud-Prevention Snapshot',
    badge: 'Process check',
    tagline: 'Find the few control gaps worth fixing first in one business process.',
    summary: 'A lightweight review of one important process to identify practical control gaps, approval weaknesses and documentation priorities.',
    idealFor: 'Small teams concerned about payments, procurement, inventory, customer credit or recurring process errors.',
    outcomes: [
      'A simple view of how the selected process works today',
      'Priority control gaps and practical corrective actions',
      'Clear action owners and target dates'
    ],
    deliverables: [
      'One process walkthrough based on supplied information',
      'Short risk-and-control checklist with priority ratings',
      'Corrective-action tracker with owners and due dates',
      'Management summary and one findings call'
    ],
    clientInputs: 'Existing process notes, sample records, current policies if any, and one process owner for a short interview.',
    timeframe: 'Typically 5–10 working days depending on process complexity',
    engagement: 'One process only, with defined evidence limits and a practical handover.',
    price: 'Fixed quote after a short scoping call',
    exclusions: 'Not an internal audit opinion, forensic investigation, statutory audit, regulatory certification or legal advice.',
    Icon: Workflow
  },
  {
    id: 'funding-readiness',
    pillar: 'finance',
    pillarLabel: 'Finance & Funding',
    title: 'Lender & Funding Readiness Check',
    badge: 'Funding prep',
    tagline: 'Prepare the financial story and data before your next lender conversation.',
    summary: 'A scoped readiness review for businesses approaching a lender, renewing a facility or planning an important funding decision.',
    idealFor: 'Business owners preparing for capex, a loan renewal, working-capital discussion or a new financing conversation.',
    outcomes: [
      'A clear list of information a lender is likely to ask about',
      'A practical view of financial questions and data gaps',
      'A preparation plan for the next funding conversation'
    ],
    deliverables: [
      'Funding-readiness information checklist',
      'Review of supplied financial and debt-service information',
      'Indicative financial questions and gap list',
      'Next-conversation preparation note and review call'
    ],
    clientInputs: 'Recent financial statements, bank or loan summaries, planned use of funds, repayments and available management information.',
    timeframe: 'Typically 5–7 working days after complete inputs',
    engagement: 'A fixed-scope preparation review with an agreed information set.',
    price: 'Fixed quote after a short scoping call',
    exclusions: 'Not loan broking, a credit rating, a lending decision, a guarantee of funding or an investment recommendation.',
    Icon: Landmark
  },
  {
    id: 'growth-governance',
    pillar: 'governance',
    pillarLabel: 'Owner Decisions & Governance',
    title: 'Growth & Governance Sprint',
    badge: 'Growth support',
    tagline: 'Make roles, decisions and recurring business reviews clearer as the company grows.',
    summary: 'A practical sprint for leadership teams that need better decision ownership, accountability and operating rhythm.',
    idealFor: 'Growing or family-owned businesses where more people are involved but priorities and responsibilities remain unclear.',
    outcomes: [
      'Clearer ownership for important recurring decisions',
      'A simple management-review rhythm',
      'A realistic 90-day action plan for better execution'
    ],
    deliverables: [
      'Decision and responsibility discovery session',
      'Focused ownership and escalation map',
      'Suggested leadership-review cadence',
      '90-day governance and execution action plan'
    ],
    clientInputs: 'Current organisation view, key recurring decisions, examples of delayed decisions and one or two leadership interviews.',
    timeframe: 'Typically 7–10 working days after the discovery discussion',
    engagement: 'A focused business-governance sprint with practical implementation recommendations.',
    price: 'Fixed quote after a short scoping call',
    exclusions: 'Not legal advice, company-secretarial work, a formal board evaluation or a regulatory certification.',
    Icon: Users
  }
];

const SERVICE_HANDOFFS: Record<string, string> = {
  'financial-clarity': 'financial-clarity',
  lenderready: 'funding-readiness',
  'loan-eligibility': 'funding-readiness',
  'business-health': 'financial-clarity',
  'controlcfo-sprint': 'financial-clarity',
  'funding-readiness': 'funding-readiness',
  'contract-collections': 'contract-collections',
  'contract-to-cash': 'contract-collections',
  'contract-43b-h': 'contract-collections',
  tradeshield: 'contract-collections',
  'risk-assurance': 'risk-assurance',
  'controls-snapshot': 'controls-fraud',
  'controls-fraud': 'controls-fraud',
  'board-box': 'growth-governance',
  'do-key-person-gap': 'growth-governance',
  regtech: 'controls-fraud',
  'compliance-calendar': 'controls-fraud',
  fraudsignal: 'controls-fraud',
  'internal-audit': 'controls-fraud',
  'growth-governance': 'growth-governance'
};

const PROBLEM_SHORTCUTS = ADVISORY_DESKS.map(({ id, shortLabel, summary, Icon }) => ({
  id,
  title: shortLabel,
  detail: summary,
  Icon
}));

export interface ServicesPageProps {
  onInquiry: (deskTitle: string) => void;
}

function readRecommendedService(): string | null {
  if (typeof window === 'undefined') return null;
  const service = new URLSearchParams(window.location.search).get('service');
  return service ? SERVICE_HANDOFFS[service] || null : null;
}

export default function ServicesPage({ onInquiry }: ServicesPageProps) {
  const [query, setQuery] = useState('');
  const [recommendedId, setRecommendedId] = useState<string | null>(readRecommendedService);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ADVISORY_DESKS.filter((service) =>
      (!recommendedId || service.id === recommendedId) &&
      (!q || [
        service.title,
        service.pillarLabel,
        service.tagline,
        service.summary,
        service.idealFor,
        ...service.outcomes,
        ...service.deliverables
      ].join(' ').toLowerCase().includes(q))
    );
  }, [recommendedId, query]);

  useEffect(() => {
    if (!recommendedId) return;
    document.getElementById('service-' + recommendedId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [recommendedId]);

  const selectProblem = (serviceId: string) => {
    setQuery('');
    setRecommendedId(serviceId);
    const params = new URLSearchParams(window.location.search);
    params.set('service', serviceId);
    window.history.replaceState(null, '', '/services?' + params.toString());
  };

  const showAllServices = () => {
    setQuery('');
    setRecommendedId(null);
    const params = new URLSearchParams(window.location.search);
    params.delete('service');
    const queryString = params.toString();
    window.history.replaceState(null, '', '/services' + (queryString ? '?' + queryString : ''));
  };

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-14 sm:px-6 sm:py-20">
      <header className="mx-auto max-w-4xl space-y-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#1f4fff]">Navigalex Business Advisory</span>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Start with the business problem.</h2>
        <p className="text-base leading-relaxed text-slate-600 sm:text-lg">Choose the issue closest to yours. Each service shows the practical deliverables, client inputs, timing and boundaries before you request a proposal.</p>
        <div className="flex flex-wrap justify-center gap-3 pt-2 text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1.5"><ClipboardCheck className="h-4 w-4" />Defined deliverables</span>
          <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" />Agreed timelines</span>
          <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" />Clear ownership</span>
        </div>
      </header>

      <section aria-labelledby="problem-shortcuts-heading" className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 id="problem-shortcuts-heading" className="text-lg font-bold text-slate-950">What do you need help with?</h3>
            <p className="text-sm text-slate-600">Choose one to see the closest productised starting service. You can change it or browse all six.</p>
          </div>
          {recommendedId && (
            <button type="button" onClick={showAllServices} className="self-start text-sm font-semibold text-[#1f4fff] underline underline-offset-2">
              Show all six services
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {PROBLEM_SHORTCUTS.map(({ id, title, detail, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={recommendedId === id}
              onClick={() => selectProblem(id)}
              className={'min-h-32 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4fff] ' + (
                recommendedId === id
                  ? 'border-[#1f4fff] bg-blue-50 ring-1 ring-blue-200'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
              )}
            >
              <span className="flex items-start gap-3">
                <span className="rounded-xl bg-slate-100 p-2 text-slate-800"><Icon className="h-5 w-5" /></span>
                <span>
                  <span className="block text-sm font-bold leading-snug text-slate-950">{title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">{detail}</span>
                </span>
              </span>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#1f4fff]">See the starting service <ChevronRight className="h-3.5 w-3.5" /></span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-300">A clear engagement model</span>
          <h3 className="text-xl font-bold sm:text-2xl">Discover → Scope → Deliver → Review</h3>
          <p className="text-sm leading-relaxed text-slate-300">We confirm the business problem, required inputs, deliverables, timeline, fees and responsibilities before work starts. You receive a practical findings discussion and clear next actions.</p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[
            { n: '01', t: 'Discover', d: 'Understand the business issue and constraints.' },
            { n: '02', t: 'Scope', d: 'Agree the evidence, deliverables and success criteria.' },
            { n: '03', t: 'Deliver', d: 'Review the agreed information and prepare the outputs.' },
            { n: '04', t: 'Review', d: 'Walk through the findings and the next actions.' }
          ].map((item) => (
            <div key={item.n} className="rounded-xl border border-white/15 p-4">
              <span className="text-xs font-bold text-blue-300">{item.n}</span>
              <h4 className="mt-2 font-bold">{item.t}</h4>
              <p className="mt-1 text-sm text-slate-300">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex min-h-11 flex-1 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search services, outcomes or deliverables"
            aria-label="Search services, outcomes or deliverables"
            className="w-full py-3 text-base text-slate-950 outline-none"
          />
        </label>
        {(recommendedId || query) && (
          <button type="button" onClick={showAllServices} className="min-h-11 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Clear filters
          </button>
        )}
      </div>

      <p className="text-sm text-slate-600" aria-live="polite">
        {recommendedId ? 'Showing the starting service closest to the selected business problem.' : 'Showing all six starting services.'}
      </p>

      <div id="service-results" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {visible.map((service) => {
          const Icon = service.Icon;
          return (
            <article id={'service-' + service.id} key={service.id} className="navigalex-card flex flex-col gap-6 rounded-2xl border border-slate-200 border-t-4 border-t-[#1f4fff] bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-800">{service.badge}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500"><Clock3 className="h-3.5 w-3.5" />{service.timeframe}</span>
                </div>

                <div className="flex gap-3">
                  <span className="mt-0.5 rounded-xl bg-blue-50 p-2.5 text-[#1f4fff]"><Icon className="h-5 w-5" /></span>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-950">{service.title}</h3>
                    <p className="mt-1 text-xs font-semibold text-[#1f4fff]">{service.pillarLabel}</p>
                    <p className="mt-3 text-sm font-semibold text-slate-700">{service.tagline}</p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-slate-600">{service.summary}</p>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-slate-700">Best suited for</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{service.idealFor}</p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">Expected outcomes</h4>
                  <ul className="mt-2 space-y-2">
                    {service.outcomes.map((outcome) => (
                      <li key={outcome} className="flex gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">Included deliverables</h4>
                  <ul className="mt-2 space-y-2">
                    {service.deliverables.map((deliverable) => (
                      <li key={deliverable} className="flex gap-2 text-sm leading-relaxed text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <details className="rounded-xl border border-slate-200 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-800">Scope boundaries and client inputs</summary>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
                    <div><strong className="text-slate-800">Client inputs:</strong> {service.clientInputs}</div>
                    <div><strong className="text-slate-800">Engagement:</strong> {service.engagement}</div>
                    <div><strong className="text-slate-800">Scope boundary:</strong> {service.exclusions}</div>
                  </div>
                </details>
              </div>

              <div className="mt-auto space-y-3 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">Commercials</span>
                  <span className="text-right text-sm font-bold text-slate-900">{service.price}</span>
                </div>
                <p className="text-xs text-slate-500">Final scope, fee, taxes and delivery dates are confirmed in a written proposal.</p>
                <button
                  type="button"
                  onClick={() => onInquiry(service.title)}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-[#1f4fff] px-4 py-3 text-sm font-bold text-white hover:bg-[#183bc4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4fff]"
                >
                  Request a scoped proposal <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {visible.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-8 text-center">
          <p className="text-sm text-slate-600">No service matches that search. Clear the filters or let us help you choose.</p>
          <button type="button" onClick={() => onInquiry('Help me choose the right review')} className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#1f4fff] px-5 py-3 text-sm font-bold text-white hover:bg-[#183bc4]">Help me choose</button>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
        <h3 className="font-bold text-slate-900">Professional scope and independence</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">Navigalex provides business advisory, operational analysis and technology enablement within the scope agreed with each client. We do not advertise or offer legal services. Legal, tax, statutory audit, certification or other regulated professional work is outside scope unless delivered separately by appropriately qualified and authorised professionals under their own engagement. Recommendations depend on the accuracy and completeness of client-supplied information; outcomes are not guaranteed.</p>
      </div>
    </section>
  );
}
