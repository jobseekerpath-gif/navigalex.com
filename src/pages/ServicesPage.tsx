import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight, CheckCircle2, ChevronRight, ClipboardCheck,
  ChartNoAxesCombined, Clock3, FileText, Landmark, Search, ShieldCheck, Users, Wallet, Workflow
} from 'lucide-react';

type Pillar = 'finance' | 'risk' | 'governance' | 'strategy' | 'project' | 'technology' | 'operations';
type ServiceGroup = 'all' | 'advisory' | 'backoffice' | 'it';
type Service = {
  id: string;
  pillar: Pillar;
  pillarLabel: string;
  serviceGroup?: Exclude<ServiceGroup, 'all'>;
  title: string;
  badge: string;
  shortLabel: string;
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
    shortLabel: 'Cash and cost pressure',
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
    shortLabel: 'Delayed payments or unclear contracts',
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
    shortLabel: 'Business risks need a clear plan',
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
    shortLabel: 'A process has gaps or fraud risk',
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
    shortLabel: 'Preparing for a lender conversation',
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
    shortLabel: 'Growth decisions and ownership feel unclear',
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
  },
  {
    id: 'strategy-sprint',
    pillar: 'governance',
    pillarLabel: 'Strategy & Growth',
    title: 'Strategy & Market Growth Sprint',
    badge: 'Growth decision',
    shortLabel: 'Choosing a growth direction',
    tagline: 'Compare practical growth options before committing time and money.',
    summary: 'A focused strategy engagement for one business decision, using client-supplied data and clearly stated assumptions rather than unsupported market claims.',
    idealFor: 'Owner-led SMEs evaluating a new market, product, channel, portfolio choice or turnaround priority.',
    outcomes: ['A clearer decision question and success measures', 'A transparent comparison of up to three strategic options', 'A prioritised 90-day execution roadmap'],
    deliverables: ['Decision brief and agreed scope', 'Options matrix with assumptions, risks and evidence gaps', '90-day action roadmap with owners and decision gates', 'One findings discussion'],
    clientInputs: 'Business goals, current performance information, customer/market evidence available to you, and the decision deadline.',
    timeframe: 'Typically 7–10 working days after complete inputs',
    engagement: 'One decision, up to three options and one feedback round. Market research, transaction due diligence and implementation are separately scoped.',
    price: 'Fixed quote after a short scoping call',
    exclusions: 'No guarantee of growth; not investment, legal, tax or transaction advice. M&A due diligence requires a separate qualified scope.',
    Icon: ChartNoAxesCombined
  },
  {
    id: 'project-delivery',
    pillar: 'governance',
    pillarLabel: 'Project Management & Delivery',
    title: 'Project Delivery & Recovery Review',
    badge: 'Delivery reset',
    shortLabel: 'A delayed or unclear project',
    tagline: 'Make milestones, dependencies, ownership and recovery actions visible.',
    summary: 'A bounded health review of one project to clarify delivery status and the most useful corrective actions.',
    idealFor: 'Small teams with a delayed project, changing scope, unclear accountability or budget pressure.',
    outcomes: ['A transparent view of milestone and delivery risks', 'A prioritised RAID and dependency list', 'A realistic recovery or next-phase plan'],
    deliverables: ['Review of one project plan, milestone list and available budget/status data', 'RAID log covering risks, assumptions, issues and dependencies', 'Ownership and decision tracker', 'Recovery recommendations and one review call'],
    clientInputs: 'Current project plan, milestone/status report, budget baseline if available, known issues and project owner availability.',
    timeframe: 'Typically 5–7 working days after complete inputs',
    engagement: 'One project health review. Ongoing PMO, project execution, specialist scheduling and change delivery are separately scoped based on capacity.',
    price: 'Fixed quote after a short scoping call',
    exclusions: 'No guarantee of delivery outcomes or independent assurance opinion. Large programme PMO and specialist delivery require confirmed capacity.',
    Icon: Workflow
  },

  {
    id: 'digital-workflow-review',
    serviceGroup: 'it',
    pillar: 'technology',
    pillarLabel: 'IT & Digital Operations',
    title: 'Digital Workflow & Systems Review',
    badge: 'Practical IT review',
    shortLabel: 'Tools and processes do not work smoothly together',
    tagline: 'Identify practical improvements to everyday digital workflows before investing in more software.',
    summary: 'A non-invasive review of one business workflow and the tools used to run it, focused on handoffs, duplicated work, reporting gaps and low-risk automation opportunities.',
    idealFor: 'Small businesses using spreadsheets, email and multiple SaaS tools to manage a recurring process.',
    outcomes: ['A map of the current workflow and its friction points', 'Prioritised process and configuration improvements', 'A phased implementation brief with dependencies and risks'],
    deliverables: ['One workflow discovery session', 'Current-state workflow map and issue list', 'Prioritised recommendations and a practical next-step brief'],
    clientInputs: 'A description of the selected workflow, examples of relevant forms/reports, and access to the process owner. No passwords or production credentials are required.',
    timeframe: 'Typically 5–7 working days after discovery',
    engagement: 'Advisory review only, limited to one workflow and the information the client chooses to share.',
    price: 'Fixed quote after a short scoping call',
    exclusions: 'Not penetration testing, cybersecurity certification, ITGC assurance, software development, managed IT support, vendor certification or a guarantee of security. Implementation is separately scoped.',
    Icon: Workflow
  },

  {
    id: 'bookkeeping-reconciliation',
    serviceGroup: 'backoffice',
    pillar: 'operations',
    pillarLabel: 'Back-office Operations',
    title: 'Bookkeeping & Reconciliation Support',
    badge: 'Finance operations',
    shortLabel: 'Books and reconciliations need regular attention',
    tagline: 'Keep routine financial records organised and reconciled on an agreed schedule.',
    summary: 'A practical back-office support desk for organising transaction records, preparing bookkeeping inputs and reconciling agreed bank, card or ledger accounts using client-authorised records.',
    idealFor: 'Small businesses that need dependable monthly finance administration but are not ready to hire a full in-house accounts team.',
    outcomes: ['More organised transaction records and supporting documents', 'A clear reconciliation status with unmatched items highlighted', 'A consistent monthly handover pack for the business owner or accountant'],
    deliverables: ['Agreed transaction categorisation and bookkeeping input support', 'Bank, card or selected ledger reconciliations for the agreed period', 'A list of missing records, unmatched entries and follow-up questions', 'A monthly close checklist and handover summary'],
    clientInputs: 'Authorised bank statements, invoices, receipts, prior-period records, chart of accounts and the contact details of the client’s accountant where relevant. Never share banking passwords or OTPs.',
    timeframe: 'Weekly or monthly cadence agreed at onboarding',
    engagement: 'Recurring remote back-office support with defined transaction volumes, account limits, review responsibilities and cut-off dates.',
    price: 'Monthly retainer quoted after a workload assessment',
    exclusions: 'Does not include statutory audit, tax opinions or filings, certification, independent accounting sign-off, fund handling or operation of client bank accounts.',
    Icon: Wallet
  },
  {
    id: 'payables-receivables-billing',
    serviceGroup: 'backoffice',
    pillar: 'operations',
    pillarLabel: 'Back-office Operations',
    title: 'Payables, Receivables & Billing Desk',
    badge: 'Billing operations',
    shortLabel: 'Invoices, follow-ups and payment trackers are scattered',
    tagline: 'Bring invoice processing and payment follow-ups into one controlled workflow.',
    summary: 'Routine administrative support for purchase and sales invoice registers, billing coordination, due-date tracking and courteous payment reminders based on client-approved instructions.',
    idealFor: 'B2B service firms, distributors and growing businesses managing a recurring volume of customer and supplier invoices.',
    outcomes: ['A current view of invoices issued, received, due and disputed', 'Fewer missed billing steps and overdue follow-ups', 'A documented handover of exceptions requiring owner approval'],
    deliverables: ['Sales and purchase invoice register maintenance', 'Billing document preparation from approved source information', 'Receivables ageing and payment-due tracker', 'Supplier payment schedule and customer reminder queue', 'Weekly exception report for approvals and unresolved items'],
    clientInputs: 'Approved rate cards, purchase orders, invoice formats, customer and supplier master data, payment terms and authorised reminder wording.',
    timeframe: 'Weekly or monthly cadence agreed at onboarding',
    engagement: 'A recurring admin desk with defined invoice volumes, approval matrix, communication channels and turnaround times.',
    price: 'Monthly retainer quoted after a workload assessment',
    exclusions: 'No debt recovery, legal notices, negotiation of disputed claims, payment authorisation, custody of funds or guarantee of collection.',
    Icon: FileText
  },
  {
    id: 'hr-payroll-administration',
    serviceGroup: 'backoffice',
    pillar: 'operations',
    pillarLabel: 'Back-office Operations',
    title: 'HR & Payroll Administration Support',
    badge: 'People operations',
    shortLabel: 'Employee records and payroll inputs take too much time',
    tagline: 'Make routine people administration more consistent and easier to review.',
    summary: 'Administrative support for employee records, onboarding checklists, attendance and leave inputs, payroll data collation and monthly people-operations reports.',
    idealFor: 'Small and mid-sized teams that need structured HR administration without building a large internal HR operations function.',
    outcomes: ['More complete and consistently maintained employee records', 'A reviewable attendance, leave and payroll-input trail', 'Clear monthly exceptions for the authorised HR or payroll approver'],
    deliverables: ['Employee master-data and document checklist maintenance', 'Joining, exit and onboarding administration trackers', 'Attendance, leave and variable-pay input collation', 'Payroll input validation checklist and payslip distribution coordination', 'Monthly HR administration summary'],
    clientInputs: 'Employee data supplied through an agreed secure channel, attendance and leave records, approved salary structures and the client’s payroll policies.',
    timeframe: 'Monthly cycle aligned to the client’s payroll calendar',
    engagement: 'Administrative processing only, with payroll calculations and final approvals assigned to the client or its authorised payroll professional.',
    price: 'Monthly retainer quoted by employee count and process scope',
    exclusions: 'No employment-law opinion, statutory compliance certification, independent payroll audit, hiring guarantee or release of salary payments.',
    Icon: Users
  },
  {
    id: 'data-document-admin',
    serviceGroup: 'backoffice',
    pillar: 'operations',
    pillarLabel: 'Back-office Operations',
    title: 'Data, Document & Administrative Support',
    badge: 'Admin support',
    shortLabel: 'Records, data entry and routine admin are slowing the team',
    tagline: 'Move repetitive administrative work into a clear, trackable support process.',
    summary: 'Flexible remote support for structured data entry, document indexing, CRM updates, report preparation, meeting coordination and routine business administration.',
    idealFor: 'Owner-led businesses and lean teams with recurring administrative work that can be documented and delegated safely.',
    outcomes: ['Cleaner and more searchable business records', 'A visible queue of completed, pending and blocked tasks', 'More owner and team time for customer-facing and decision work'],
    deliverables: ['Data entry, spreadsheet updates and agreed data checks', 'Document naming, indexing and digital filing', 'CRM and business-system record updates', 'Meeting scheduling, action logs and routine report preparation', 'Simple task SOPs and weekly completion summary'],
    clientInputs: 'Task instructions, approved templates, data definitions, access through named user accounts and a designated reviewer for exceptions.',
    timeframe: 'Task batches or recurring weekly support agreed at onboarding',
    engagement: 'A defined number of support hours or task volumes with agreed quality checks, turnaround targets and escalation rules.',
    price: 'Monthly support plan or fixed task quote after scoping',
    exclusions: 'No legal document drafting, regulated data processing, unapproved customer commitments, use of shared passwords or guarantee of error-free source data.',
    Icon: ClipboardCheck
  },
  {
    id: 'managed-it-helpdesk',
    serviceGroup: 'it',
    pillar: 'technology',
    pillarLabel: 'IT Services',
    title: 'Managed IT Helpdesk & Workplace Support',
    badge: 'IT support',
    shortLabel: 'Staff need reliable day-to-day IT help',
    tagline: 'Give your team one structured channel for routine technology support.',
    summary: 'Remote-first user support for common workplace technology issues, account setup coordination, device and software troubleshooting, IT asset records and vendor escalation.',
    idealFor: 'Small businesses without a dedicated IT support desk or with recurring user issues across laptops, email and business applications.',
    outcomes: ['A single queue for support requests and issue status', 'Better visibility of devices, software and recurring problems', 'Clear escalation for issues requiring specialist or on-site attention'],
    deliverables: ['Helpdesk intake, prioritisation and ticket tracking', 'Remote troubleshooting for agreed operating systems and business apps', 'User onboarding and offboarding checklists', 'IT asset and licence register maintenance', 'Monthly ticket trends and recurring-issue summary'],
    clientInputs: 'Device and software inventory, named user contacts, approved support access, escalation contacts and a list of critical business systems.',
    timeframe: 'Support hours and response targets agreed in the service schedule',
    engagement: 'Remote support within agreed business hours and supported systems. On-site visits, specialist repairs and out-of-hours coverage are separately scoped.',
    price: 'Monthly support plan based on users, devices and coverage',
    exclusions: 'No guaranteed 24/7 availability, hardware warranty, telecom service, incident-response retainer or security certification. Emergency recovery and specialist work require separate approval.',
    Icon: ShieldCheck
  },
  {
    id: 'website-business-app-development',
    serviceGroup: 'it',
    pillar: 'technology',
    pillarLabel: 'IT Services',
    title: 'Website & Business Application Development',
    badge: 'Digital delivery',
    shortLabel: 'You need a website, portal or business tool',
    tagline: 'Build practical digital experiences around the way your business works.',
    summary: 'Scoped design and development of business websites, landing pages, internal portals, workflow tools and focused application features, with testing and a structured handover.',
    idealFor: 'Businesses that need a professional web presence or a small digital product to support customers, staff or internal operations.',
    outcomes: ['A clear feature scope, delivery plan and acceptance criteria', 'A responsive website or application aligned to agreed requirements', 'A documented handover with ownership of access and next actions'],
    deliverables: ['Discovery brief, sitemap or workflow outline and UI direction', 'Responsive website, portal or agreed application features', 'Integration of approved forms, analytics or business services', 'Functional checks, launch checklist and handover notes'],
    clientInputs: 'Approved requirements, brand assets, content, domain and hosting ownership, integration credentials shared through secure methods and a decision maker for acceptance.',
    timeframe: 'Milestones and delivery date confirmed after requirements are agreed',
    engagement: 'Fixed-scope project with written requirements, acceptance criteria, change control and a separately agreed maintenance option.',
    price: 'Project quote after requirements discovery',
    exclusions: 'No guaranteed traffic, sales or search ranking; third-party licences and hosting are additional. Penetration testing, regulated software certification and ongoing maintenance require separate scopes.',
    Icon: ChartNoAxesCombined
  },
  {
    id: 'cloud-email-infrastructure',
    serviceGroup: 'it',
    pillar: 'technology',
    pillarLabel: 'IT Services',
    title: 'Cloud, Email & Infrastructure Setup',
    badge: 'Cloud & workplace',
    shortLabel: 'Email, hosting and cloud tools are fragmented',
    tagline: 'Set up a more organised and supportable digital workplace.',
    summary: 'Practical setup and administration support for business email, domains, hosting, cloud collaboration, backups and basic access-management practices.',
    idealFor: 'Small businesses moving from informal tools to managed business email, shared cloud workspaces and dependable hosting.',
    outcomes: ['A clearer inventory of domains, hosting, accounts and subscriptions', 'A more consistent setup for users, shared files and access', 'Documented backup and account-recovery responsibilities'],
    deliverables: ['Domain, DNS, hosting and business-email configuration support', 'Cloud workspace and user-access setup', 'Basic backup configuration and restore-check plan', 'MFA and account-recovery setup checklist', 'Infrastructure inventory and handover documentation'],
    clientInputs: 'Proof of domain and subscription ownership, nominated administrators, user list, current provider details and an approved change window.',
    timeframe: 'Typically 5–10 working days after access and requirements are confirmed',
    engagement: 'Project-based setup and handover. Ongoing administration, monitoring, migration and support are separately scoped.',
    price: 'Project quote based on users, systems and migration complexity',
    exclusions: 'No guarantee against outages, data loss or cyber incidents; no penetration testing, security certification, forensic response or managed security operations.',
    Icon: Workflow
  },
  {
    id: 'workflow-automation-integration',
    serviceGroup: 'it',
    pillar: 'technology',
    pillarLabel: 'IT Services',
    title: 'Workflow Automation & Systems Integration',
    badge: 'Automation',
    shortLabel: 'Teams repeat the same tasks across disconnected tools',
    tagline: 'Reduce manual handoffs by connecting the systems your team already uses.',
    summary: 'Design and implementation of agreed workflow automations, form-to-system handoffs, notifications, CRM connections and management dashboards for repeatable business processes.',
    idealFor: 'Businesses with recurring approvals, lead handling, reporting or data-transfer work spread across spreadsheets and SaaS tools.',
    outcomes: ['A documented current and proposed workflow', 'Fewer manual copy-and-paste steps in the agreed process', 'Clear exception handling, ownership and maintenance notes'],
    deliverables: ['Workflow mapping and automation suitability review', 'Configuration or development of the agreed automation', 'System integration and data-mapping checks', 'User acceptance checklist and exception-handling guide', 'Handover documentation and support recommendations'],
    clientInputs: 'Process owner, current workflow examples, approved system access, API or vendor permissions and sample data that can be safely shared.',
    timeframe: 'Milestones agreed after a technical feasibility review',
    engagement: 'One or more specifically scoped workflows with documented assumptions, data permissions and acceptance criteria.',
    price: 'Project quote based on workflow and integration complexity',
    exclusions: 'No guarantee that third-party APIs remain unchanged, no bypassing vendor security controls, and no handling of payment credentials or sensitive data without an agreed secure design.',
    Icon: Workflow
  },
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
  'growth-governance': 'growth-governance',
  'strategy-sprint': 'strategy-sprint',
  'project-delivery': 'project-delivery',
  'strategy-growth-sprint': 'strategy-sprint',
  'project-delivery-review': 'project-delivery',
  'digital-workflow-review': 'digital-workflow-review',
  'bookkeeping-reconciliation': 'bookkeeping-reconciliation',
  'payables-receivables-billing': 'payables-receivables-billing',
  'hr-payroll-administration': 'hr-payroll-administration',
  'data-document-admin': 'data-document-admin',
  'managed-it-helpdesk': 'managed-it-helpdesk',
  'website-business-app-development': 'website-business-app-development',
  'cloud-email-infrastructure': 'cloud-email-infrastructure',
  'workflow-automation-integration': 'workflow-automation-integration'
};

const PROBLEM_SHORTCUTS = ADVISORY_DESKS.map(({ id, shortLabel, summary, Icon, serviceGroup }) => ({
  id,
  title: shortLabel,
  detail: summary,
  serviceGroup: serviceGroup ?? 'advisory',
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
  const [serviceGroup, setServiceGroup] = useState<ServiceGroup>('all');
  const [recommendedId, setRecommendedId] = useState<string | null>(readRecommendedService);

  const recommendedService = useMemo(
    () => ADVISORY_DESKS.find((service) => service.id === recommendedId) ?? null,
    [recommendedId]
  );
  const RecommendedIcon = recommendedService?.Icon;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ADVISORY_DESKS.filter((service) =>
      (!recommendedId || service.id === recommendedId) &&
      (serviceGroup === 'all' || (service.serviceGroup ?? 'advisory') === serviceGroup) &&
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
  }, [recommendedId, query, serviceGroup]);

  // Do not auto-scroll to the selected service card here.
  // App-level route navigation resets the page to the top, keeping the page header visible.

  const selectProblem = (serviceId: string) => {
    setQuery('');
    setRecommendedId(serviceId);
    const params = new URLSearchParams(window.location.search);
    params.set('service', serviceId);
    window.history.replaceState(null, '', '/services?' + params.toString());
  };

  const showAllServices = () => {
    setQuery('');
    setServiceGroup('all');
    setRecommendedId(null);
    const params = new URLSearchParams(window.location.search);
    params.delete('service');
    const queryString = params.toString();
    window.history.replaceState(null, '', '/services' + (queryString ? '?' + queryString : ''));
  };

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-14 sm:px-6 sm:py-20">
      <header className="mx-auto max-w-4xl space-y-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#1f4fff]">Navigalex Business Services</span>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">{recommendedService ? "Your recommended starting service" : "Business advisory, back-office and IT support."}</h2>
        <p className="text-base leading-relaxed text-slate-600 sm:text-lg">{recommendedService ? "Review the recommended service, deliverables, timing and scope limits before requesting a proposal." : "Practical support across business decisions, everyday operations and business technology. Select a service area, compare the scope and request a proposal."}</p>
        <div className="flex flex-wrap justify-center gap-3 pt-2 text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1.5"><ClipboardCheck className="h-4 w-4" />Defined deliverables</span>
          <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" />Agreed timelines</span>
          <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" />Clear ownership</span>
        </div>
      </header>


      {!recommendedId && (
        <section aria-label="Service categories" className="grid gap-4 md:grid-cols-3">
          {[
            {
              id: 'advisory' as const,
              eyebrow: 'Business advisory',
              title: 'Make better business decisions',
              detail: 'Finance, contracts, risk, governance, strategy and project delivery.',
              Icon: ChartNoAxesCombined,
              count: ADVISORY_DESKS.filter((item) => (item.serviceGroup ?? 'advisory') === 'advisory').length
            },
            {
              id: 'backoffice' as const,
              eyebrow: 'Back-office operations',
              title: 'Keep daily work moving',
              detail: 'Bookkeeping support, billing, reconciliations, HR administration and document operations.',
              Icon: ClipboardCheck,
              count: ADVISORY_DESKS.filter((item) => item.serviceGroup === 'backoffice').length
            },
            {
              id: 'it' as const,
              eyebrow: 'IT services',
              title: 'Make technology work for you',
              detail: 'Helpdesk support, websites, cloud setup, workflow automation and systems improvement.',
              Icon: Workflow,
              count: ADVISORY_DESKS.filter((item) => item.serviceGroup === 'it').length
            }
          ].map((group) => {
            const selected = serviceGroup === group.id;
            const Icon = group.Icon;
            return (
              <button
                key={group.id}
                type="button"
                aria-pressed={selected}
                onClick={() => { setServiceGroup(selected ? 'all' : group.id); setQuery(''); }}
                className={'group rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4fff] sm:p-6 ' + (
                  selected
                    ? 'border-[#1f4fff] bg-blue-50 shadow-[0_10px_28px_rgba(31,79,255,0.10)]'
                    : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg'
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1f4fff]"><Icon className="h-5 w-5" /></span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">{group.count} services</span>
                </span>
                <span className="mt-5 block text-[11px] font-bold uppercase tracking-widest text-[#1f4fff]">{group.eyebrow}</span>
                <span className="mt-1 block text-lg font-extrabold tracking-tight text-slate-950">{group.title}</span>
                <span className="mt-2 block min-h-12 text-sm leading-relaxed text-slate-600">{group.detail}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#1f4fff]">{selected ? 'Showing this category' : 'Explore services'} <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
              </button>
            );
          })}
        </section>
      )}

      {recommendedService && (
        <section aria-labelledby="recommended-service-heading" className="overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-[0_10px_30px_rgba(31,79,255,0.10)]">
          <div className="bg-gradient-to-br from-[#07115f] via-[#1429b8] to-[#2852f0] p-5 text-white sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                {RecommendedIcon && <RecommendedIcon className="h-6 w-6" />}
              </span>
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-50">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Recommended for your selected issue
                </span>
                <h3 id="recommended-service-heading" className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{recommendedService.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-blue-100 sm:text-base">{recommendedService.tagline}</p>
                <p className="mt-3 max-w-4xl text-sm leading-relaxed text-white/90">{recommendedService.summary}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2.5 md:mt-6 md:grid-cols-3 md:gap-3">
              <div className="rounded-xl border border-white/15 bg-white/10 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-100">Typical timeframe</p>
                <p className="mt-1.5 text-sm font-semibold leading-relaxed">{recommendedService.timeframe}</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-100">Commercials</p>
                <p className="mt-1.5 text-sm font-semibold leading-relaxed">{recommendedService.price}</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-100">Next step</p>
                <p className="mt-1.5 text-sm font-semibold leading-relaxed">Confirm the scope and client inputs before work starts.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:grid-cols-3 sm:p-5">
            {[
              { number: "01", title: "Review the fit", detail: "Confirm this service matches your business issue." },
              { number: "02", title: "Agree the scope", detail: "We confirm information, deliverables, timing and fee." },
              { number: "03", title: "Request a proposal", detail: "Send an inquiry to discuss the agreed starting scope." }
            ].map((step) => (
              <div key={step.number} className="flex gap-3 rounded-xl bg-white p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-extrabold text-blue-800">{step.number}</span>
                <div>
                  <p className="text-sm font-bold text-slate-900">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <p className="max-w-2xl text-xs leading-relaxed text-slate-500">This is a suggested starting service, not a commitment. Final scope, fees and delivery dates are confirmed in writing.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={showAllServices} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Compare services</button>
              <button type="button" onClick={() => onInquiry(recommendedService.title)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#1f4fff] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#183bc4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                Request this service <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {!recommendedId && (
      <>
      <section aria-labelledby="problem-shortcuts-heading" className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 id="problem-shortcuts-heading" className="text-lg font-bold text-slate-950">What do you need help with?</h3>
            <p className="text-sm text-slate-600">Choose one to see the closest starting service, or browse the complete service list.</p>
          </div>
          {recommendedId && (
            <button type="button" onClick={showAllServices} className="self-start text-sm font-semibold text-[#1f4fff] underline underline-offset-2">
              Show all {ADVISORY_DESKS.length} services
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {PROBLEM_SHORTCUTS.filter((item) => serviceGroup === 'all' || item.serviceGroup === serviceGroup).map(({ id, title, detail, Icon }) => (
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
        <div className="mt-4 grid grid-cols-1 gap-3 md:mt-6 md:grid-cols-2 xl:grid-cols-4">
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
      </>
      )}

      {!recommendedId && (
      <>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
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

      <p className="text-sm text-slate-600" aria-live="polite">Showing {visible.length} of {ADVISORY_DESKS.length} service lines.</p>
      </>
      )}

      {recommendedService && (
        <div className="mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#1f4fff]">Step 2 of 3 · Review the recommendation</p>
            <h3 className="mt-1 text-xl font-extrabold text-slate-950">What is included in this service?</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">Review the outcomes, deliverables, client inputs and scope boundaries before you send an inquiry.</p>
          </div>
          <button type="button" onClick={() => onInquiry(recommendedService.title)} className="mt-2 inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1f4fff] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#183bc4] sm:mt-0">Request this service <ArrowUpRight className="h-4 w-4" /></button>
        </div>
      )}

      <div id="service-results" className={recommendedService ? "mx-auto grid w-full max-w-5xl grid-cols-1 gap-6" : "grid grid-cols-1 gap-6 lg:grid-cols-2"}>
        {visible.map((service) => {
          const Icon = service.Icon;
          return (
            <article id={'service-' + service.id} key={service.id} className="navigalex-card flex min-w-0 flex-col gap-4 rounded-2xl border border-slate-200 border-t-4 border-t-[#1f4fff] bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:gap-6 sm:p-6 lg:p-7">
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
        <p className="mt-2 text-sm leading-relaxed text-slate-600">Navigalex provides scoped business advisory, back-office administration and technology support within the scope agreed with each client. We do not advertise or offer legal services. Legal, tax, statutory audit, certification or other regulated professional work is outside scope unless delivered separately by appropriately qualified and authorised professionals under their own engagement. Recommendations depend on the accuracy and completeness of client-supplied information; outcomes are not guaranteed.</p>
      </div>
    </section>
  );
}
