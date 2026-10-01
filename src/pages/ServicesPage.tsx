import React from 'react';
import { 
  Shield, Scale, FileText, BarChart3, ArrowRight, CheckCircle2, 
  Sparkles, Activity, Lock, Users, Building2, ChevronRight, Menu, X, 
  AlertTriangle, FileCheck, DollarSign, Briefcase, Clock, Check, 
  HelpCircle, Send, Download, Phone, Mail, Award, Eye, Database,
  Upload, File, RefreshCw, AlertCircle, TrendingUp, Landmark, MapPin
} from 'lucide-react';

export const ADVISORY_DESKS = [
    {
    id: "lenderready",
    title: "1. LenderReady Credit Readiness & Debt Structuring Office",
    tagline: "Bank Credit Readiness & Debt Structuring",
    badge: "Core Advisory Desk",
    summary: "Prepares lender-ready financial files, reconciliations and debt-service models so your credit proposal is easier to review and challenge before submission.",
    problem: "Credit proposals can become difficult to assess when financial statements, GST data, bank turnover and borrowing data do not reconcile.",
    deliverables: [
      "Borrower Information Memorandum and CMA Data Pack prepared from supplied financial records",
      "Dynamic DSCR & Monthly Cash-Flow Coverage Model",
      "Loan covenant and obligation tracker based on the agreements and sanction terms supplied",
      "One-Time Settlement (OTS) & Debt Restructuring Proposal (if stressed)",
      "Support for management during lender meetings, based on the agreed engagement scope"
    ],
    deliverySchedule: [
      "Week 1: Reconciliation of Last 24 Months Bank Statements, GST & ITR",
      "Week 2: Construction of CMA Data and DSCR Model prepared from supplied financial records",
      "Week 3: Final Borrower Data Room Assembly & Bank Meeting Briefing"
    ],
    clientInputsNeeded: "Last 2 years Audited Balance Sheets, provisional P&L, 12 months Bank Statements, GST returns.",
    timeframe: "14–21 Days",
    humanSignoff: "Professional review as specified in the agreed engagement scope",
    price: "₹75,000–₹3 Lakh + lawful success fee"
  },
    {
    id: "controlcfo-sprint",
    title: "2. ControlCFO 90-Day Readiness Sprint",
    tagline: "Flagship Outsourced Finance, Risk & Governance Command Centre",
    badge: "Initial Launch Priority",
    summary: "Structured senior finance and risk oversight delivered as a defined sprint, with clear working papers, decision points and an action register.",
    problem: "Cash conversion, customer collections, borrowing capacity or management controls may be creating avoidable pressure on the business.",
    deliverables: [
      "13-Week Dynamic Cash-Flow Runway Model",
      "Top 5 Customer & Vendor Contract Risk Review (with Redlines)",
      "Master Risk & Control Register with Responsibility Matrix",
      "Bank & Lender Data Room Pack with Reconciled Financials",
      "90-Day Prioritized Action Plan with Proof of Closure"
    ],
    deliverySchedule: [
      "Week 1: Confidential Intake, Mutual NDA & Secure Tally/Bank Ingestion",
      "Week 2: AI Parsing of Contracts, Debtor Aging & DSCR Ratios",
      "Week 3: Dual Human Review by Senior Chartered Accountant & Corporate Advocate",
      "Week 4: Executive Board Presentation & 90-Day Action Matrix Handover"
    ],
    clientInputsNeeded: "Last 12 months Bank Statements, Tally / ERP backup, Top 5 Customer Agreements, GST 3B vs 2B returns.",
    timeframe: "30 Days Fixed Sprint",
    humanSignoff: "Professional review as specified in the agreed engagement scope",
    price: "₹1.5–4 Lakh fixed"
  },
    {
    id: "contract-to-cash",
    title: "3. Contract-to-Cash Risk Desk",
    tagline: "Stop Unfair Contract Clauses & Accelerate Stuck Payments",
    badge: "Initial Launch Priority",
    summary: "A structured contract and receivables desk that reviews customer terms before signing and builds a documented follow-up process for overdue amounts.",
    problem: "Commercial contracts can shift liability, termination rights and payment risk toward the supplier; the review identifies the provisions actually present in your documents.",
    deliverables: [
      "AI-Assisted Clause-by-Clause Contract Risk Scorecard",
      "Document-specific redline suggestions and payment-escalation options where applicable",
      "Debtor Realization Tracking & Statutory Escalation Notices",
      "Contract renewal and milestone-payment tracking based on supplied dates",
      "Standard customer MSA framework for review and legal customisation"
    ],
    deliverySchedule: [
      "Week 1: Ingestion of Top 10 Existing Client Contracts & Debtor Ledger",
      "Week 2: Risk Scoring & Drafting Standard Protective Fallback Clauses",
      "Ongoing: 24-48 Hour Turnaround on New Client Contract Screening"
    ],
    clientInputsNeeded: "Top 5-10 Customer Master Services Agreements (MSAs), unpaid invoice list >60 days.",
    timeframe: "14-Day Setup + Monthly Retainer",
    humanSignoff: "Professional review as specified in the agreed engagement scope",
    price: "₹75,000–₹3 Lakh setup + ₹25,000–₹1 Lakh/month"
  },
    {
    id: "internal-audit",
    title: "4. AI-Assisted Internal Audit Factory",
    tagline: "Continuous Risk & Internal Financial Control Auditing",
    badge: "Ongoing Controls",
    summary: "Continuous, risk-based internal control testing that catches billing errors, inventory leakages, and unauthorized expenditures every quarter.",
    problem: "A statutory audit and an internal control review serve different purposes; this engagement focuses on the control areas and transactions agreed in scope.",
    deliverables: [
      "Risk-Based Internal Audit Charter & Annual Test Plan",
      "Risk-based transaction testing across agreed procurement, payroll and sales populations",
      "Internal Financial Controls (IFC) Deficiency & Red Flag Scorecard",
      "Management Action Tracker with Proof of Remediation",
      "Quarterly Board & Audit Committee Presentation Deck"
    ],
    deliverySchedule: [
      "Month 1: Process Mapping & Test Script Configuration",
      "Quarterly: 2-Week Intensive Control Testing & Transaction Sampling",
      "Quarterly End: Executive Audit Report & Remediation Verification"
    ],
    clientInputsNeeded: "ERP raw dump, chart of accounts, delegation of authority matrix, sample vouchers.",
    timeframe: "Quarterly Audit Cycles",
    humanSignoff: "Professional review as specified in the agreed engagement scope",
    price: "₹2–10 Lakh per cycle"
  },
    {
    id: "board-box",
    title: "5. Board-in-a-Box Governance OS",
    tagline: "Board Governance & Director Risk Controls",
    badge: "Turnkey System",
    summary: "Structured corporate governance system to maintain board cadence, authority records and evidence for financing, diligence and ongoing governance.",
    problem: "Missing board minutes, undocumented shareholder agreements, ambiguous director authorities, and compliance lapses exposing founders to personal fines.",
    deliverables: [
      "Annual Board & Committee Calendar with Statutory Timelines",
      "Institutional Board Agenda, Resolutions & Minutes Packs",
      "Delegation of Authority (DoA) Financial Approval Matrix",
      "Director Conflicts of Interest & Related-Party Register",
      "Controlled evidence index and document pack for audit and due diligence"
    ],
    deliverySchedule: [
      "Week 1-2: Corporate Secretarial & Governance Gap Analysis",
      "Week 3-4: Drafting Customized Delegation Matrix & Meeting Templates",
      "Month 2+: Monthly / Quarterly Board Pack Orchestration & Minutes Management"
    ],
    clientInputsNeeded: "Certificate of Incorporation, MOA/AOA, past 12 months Board Minutes, Statutory Registers.",
    timeframe: "4-Week Setup + Monthly Retainer",
    humanSignoff: "Professional review as specified in the agreed engagement scope",
    price: "₹2–6 Lakh setup + ₹50,000–₹1.5 Lakh/month"
  },
    {
    id: "regtech",
    title: "6. RegTech Journey Lab",
    tagline: "Compliance Architecture for NBFCs, Fintechs & Tech Vendors",
    badge: "Institutional RegTech",
    summary: "Turn applicable compliance requirements into a documented control workflow for onboarding, data protection, outsourcing and other agreed requirements.",
    problem: "Compliance gaps in onboarding, data logging, outsourcing or privacy controls can create partner, audit or remediation issues.",
    deliverables: [
      "End-to-End Regulatory Controls Matrix & Gap Analysis",
      "KYC / AML Onboarding Architecture & Edge-Case Rules",
      "Digital Personal Data Protection (DPDP) Privacy Compliance Pack",
      "Vendor Outsourcing Risk Assessment & Service Level Agreement Audits",
      "Pre-Audit Remediation Plan for Institutional Compliance"
    ],
    deliverySchedule: [
      "Month 1: Gap Assessment & Architecture Blueprint",
      "Month 2: Controls Matrix Engineering & SLA Drafting",
      "Month 3: Simulated Regulatory Stress Test & Team Training"
    ],
    clientInputsNeeded: "Current onboarding workflows, data architecture diagram, vendor master agreements.",
    timeframe: "6–12 Weeks Project",
    humanSignoff: "Professional review as specified in the agreed engagement scope",
    price: "₹5–25 Lakh per project"
  },
    {
    id: "fraudsignal",
    title: "7. FraudSignal Investigation Cell",
    tagline: "Forensic Accounting & Internal Leakage Detection",
    badge: "Forensic & Whistleblower",
    summary: "Discreet forensic reviews that test transaction patterns, supporting records and control gaps, with evidence preservation structured for appropriate professional or legal follow-up.",
    problem: "Unexplained drops in gross profit margins, inventory mismatches, anonymous whistleblower tips, or suspected partner embezzlement.",
    deliverables: [
      "Forensic Transaction Analytics & Vendor Duplicate Billing Scan",
      "Whistleblower Complaint Intake & Independent Fact-Finding Brief",
      "Digital Audit Trail & Electronic Evidence Preservation Pack",
      "Asset Tracing Brief & Financial Discrepancy Reconciliation",
      "Investigation report formatted for review by the board and, where appropriate, external counsel or authorities"
    ],
    deliverySchedule: [
      "Week 1: Controlled data collection from agreed ERP, bank and vendor records",
      "Week 2: Forensic Analytics, Pattern Matching & Interview Planning",
      "Week 3-4: Evidence Corroboration & Comprehensive Counsel-Ready Report"
    ],
    clientInputsNeeded: "Vendor ledgers, ERP audit logs, bank statements, whistleblower details (strictly confidential).",
    timeframe: "2–4 Weeks per Investigation",
    humanSignoff: "Professional review as specified in the agreed engagement scope",
    price: "₹3–15 Lakh per investigation"
  },
    {
    id: "tradeshield",
    title: "8. TradeShield LC/BG Desk",
    tagline: "Pre-Shipment LC and Bank Guarantee Document Review",
    badge: "Export & Tender Desk",
    summary: "Specialist documentary trade-finance review to identify discrepancies and wording issues before documents are presented to banks or counterparties.",
    problem: "Documentary discrepancies and wording mismatches can delay payment or create bank/counterparty disputes; the desk reviews the transaction documents you provide.",
    deliverables: [
      "Pre-Issuance Letter of Credit (LC) Clause Audit",
      "Transaction-specific export document checklist covering the supplied LC/BG and trade documents",
      "Bank Guarantee (BG) wording review for presentation and encashment risk",
      "Trade-compliance issue log against the requirements applicable to the supplied transaction",
      "Coordination support with issuing and advising banks, subject to the agreed mandate"
    ],
    deliverySchedule: [
      "24-48 Hours: Rapid turnaround per LC or Bank Guarantee transaction",
      "Continuous: Monthly retainer for active exporters and EPC contractors"
    ],
    clientInputsNeeded: "Draft LC / Sanction letter, Proforma Invoice, Bill of Lading draft, Bank Guarantee text.",
    timeframe: "24–48 Hours per Transaction / Monthly Retainer",
    humanSignoff: "Professional review as specified in the agreed engagement scope",
    price: "₹50,000–₹2 Lakh per transaction/retainer"
  },
    {
    id: "family-wealth",
    title: "9. Family Wealth Governance Office",
    tagline: "Family Governance & Succession Coordination",
    badge: "Promoter & Family Office",
    summary: "Governance and coordination for family businesses, holding entities and succession planning, with legal formalisation handled with the appropriate professionals.",
    problem: "Messy cross-holdings between family members, informal loans, lack of a clear succession plan, and vulnerability to future family litigation.",
    deliverables: [
      "Consolidated Family Balance Sheet & Cross-Entity Asset Map",
      "Family Constitution and Decision Charter for review and formalisation with legal counsel where required",
      "Succession & Inter-Generational Transfer Roadmap (Will & Trust Deeds)",
      "Family Investment Policy Statement & Risk Allocation Guide",
      "Quarterly Family Council Governance Pack & Review Facilitation"
    ],
    deliverySchedule: [
      "Month 1: Confidential Family Stakeholder Interviews & Asset Mapping",
      "Month 2: Drafting Family Constitution & Authority Matrices",
      "Month 3: Legal Formalization of Wills, Trusts, and Shareholder Pacts",
      "Ongoing: Quarterly Family Governance Review"
    ],
    clientInputsNeeded: "Entity ownership cap tables, property title documents, family tree and key promoter objectives.",
    timeframe: "8–12 Weeks Setup + Quarterly Retainer",
    humanSignoff: "Professional review as specified in the agreed engagement scope",
    price: "₹2–10 Lakh setup + ₹75,000–₹3 Lakh/month"
  }
]

const PERSONA_SERVICE_IDS: Record<string, string[]> = {
  all: ADVISORY_DESKS.map((srv) => srv.id),
  growing: ["controlcfo-sprint", "lenderready", "contract-to-cash", "board-box", "internal-audit", "fraudsignal"],
  exporter: ["tradeshield", "contract-to-cash"],
  nbfc: ["regtech", "board-box"],
  family: ["family-wealth"]
};

const PERSONA_OPTIONS = [
  { key: "all", label: "All" },
  { key: "growing", label: "Growing Business" },
  { key: "exporter", label: "Exporter/Importer" },
  { key: "nbfc", label: "NBFC & Fintech" },
  { key: "family", label: "Family Office" }
];


const isResolvedPlaceholder = (value?: string) => Boolean(
  value && !(value.trim().startsWith('{{') && value.trim().endsWith('}}'))
);

const REGULATORY_TRIGGERS: Record<string, { label: string; value: string }> = {
  "regtech": { label: "DPDP compliance deadline", value: "{{DPDP_DEADLINE}}" },
  "board-box": { label: "Directors' personal liability", value: "{{COMPANIES_ACT_SECTION}}" }
};


const PRICING_CONFIG: Record<string, { anchor?: string; successFeeBasis?: string; minimumTerm?: string; entryAssessmentPrice?: string; outcomeClaim?: string }> = {
  "lenderready": { successFeeBasis: "{{SUCCESS_FEE_BASIS}}" },
  "board-box": { anchor: "From ₹50,000/month", minimumTerm: "{{MIN_TERM}}" },
  "regtech": { anchor: "From ₹5 Lakh", entryAssessmentPrice: "{{DPDP_ASSESSMENT_PRICE}}" },
  "controlcfo-sprint": { outcomeClaim: "{{OUTCOME_CLAIM}}" }
};


const BRAND_MARKS: Record<string, boolean> = {
  "ControlCFO": true,
  "LenderReady": false,
  "Contract-to-Cash": false,
  "AI-Assisted Internal Audit Factory": false,
  "Board-in-a-Box": false,
  "RegTech Journey Lab": false,
  "FraudSignal": false,
  "TradeShield": false,
  "Family Wealth Governance": false
};

const formatServiceTitle = (title: string) => BRAND_MARKS.ControlCFO && title.includes("ControlCFO") && !title.includes("™")
  ? title.replace("ControlCFO", "ControlCFO™")
  : title;

const SITE_TRUST = {
  clientCount: "{{CLIENT_COUNT}}",
  credential: "{{CREDENTIAL}}",
  anonymisedCaseOutcome: "{{ANONYMISED_CASE_OUTCOME}}"
};

const FRAUDSIGNAL_CREDENTIAL = "{{CREDENTIAL}}";
const LC_STAT_CONFIG = {
  value: "{{LC_REJECTION_RATE_STAT}}",
  source: "{{LC_STAT_SOURCE}}"
};


const FREE_TOOL_HANDOFFS: Record<string, { serviceId: string; persona: string; campaign: string }> = {
  "compliance-calendar": { serviceId: "regtech", persona: "nbfc", campaign: "compliance-calendar" },
  "loan-eligibility": { serviceId: "lenderready", persona: "growing", campaign: "loan-eligibility" },
  "do-key-person-gap": { serviceId: "board-box", persona: "growing", campaign: "do-key-person-gap" },
  "contract-43b-h": { serviceId: "contract-to-cash", persona: "growing", campaign: "contract-43b-h" },
  "business-health": { serviceId: "controlcfo-sprint", persona: "growing", campaign: "business-health" }
};

const getFreeToolHandoffUrl = (tool: string) => {
  const handoff = FREE_TOOL_HANDOFFS[tool];
  if (!handoff) return "/services";
  const params = new URLSearchParams({
    persona: handoff.persona,
    service: handoff.serviceId,
    utm_source: "free_tool",
    utm_campaign: handoff.campaign
  });
  if (tool === 'contract-43b-h') return "/43b-h-check?" + params.toString();
  return "/services?" + params.toString();
};


const COMMERCIAL_PATHS: Record<string, { tool: string; serviceId: string; persona: string; diagnostic: string; service: string; recurring: string; campaign: string }> = {
  contract: {
    tool: "contract-43b-h",
    serviceId: "contract-to-cash",
    persona: "growing",
    diagnostic: "Contract-to-Cash Diagnostic",
    service: "Contract-to-Cash Risk Desk",
    recurring: "Monthly contract and receivables support, where scoped",
    campaign: "contract-to-cash-diagnostic"
  },
  lenderready: {
    tool: "loan-eligibility",
    serviceId: "lenderready",
    persona: "growing",
    diagnostic: "Lender Readiness Diagnostic",
    service: "LenderReady Credit Readiness & Debt Structuring Office",
    recurring: "Ongoing lender-readiness and debt-structuring support, where scoped",
    campaign: "lenderreadiness-diagnostic"
  },
  controlcfo: {
    tool: "business-health",
    serviceId: "controlcfo-sprint",
    persona: "growing",
    diagnostic: "Business Control Diagnostic",
    service: "ControlCFO™ 90-Day Readiness Sprint",
    recurring: "Ongoing finance, risk and governance advisory, where scoped",
    campaign: "business-control-diagnostic"
  }
};

const DIAGNOSTIC_PRICE = "{{DIAGNOSTIC_PRICE}}";

function CommercialPath({
  path,
  onOpenAssessment
}: {
  path: typeof COMMERCIAL_PATHS[keyof typeof COMMERCIAL_PATHS];
  onOpenAssessment: (concern?: string) => void;
}) {
  const diagnosticPriceReady = isResolvedPlaceholder(DIAGNOSTIC_PRICE);
  const serviceParams = new URLSearchParams({
    persona: path.persona,
    service: path.serviceId,
    utm_source: "free_tool",
    utm_campaign: path.campaign
  });
  const serviceUrl = "/services?" + serviceParams.toString();

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">What happens next</span>
          <h5 className="text-sm sm:text-base font-bold text-slate-900 mt-1">{path.diagnostic}</h5>
        </div>
        {diagnosticPriceReady && (
          <span className="text-xs font-bold text-blue-900">Diagnostic: {DIAGNOSTIC_PRICE}</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        {[
          ["01", "Free assessment", "Use your result as the starting evidence."],
          ["02", "Paid diagnostic", "Review the issue in greater depth using the records in scope."],
          ["03", "Defined project", path.service],
          ["04", "Recurring advisory", path.recurring]
        ].map(([step, title, description]) => (
          <div key={step} className="rounded-xl bg-white border border-blue-100 p-3">
            <span className="text-[10px] font-extrabold text-blue-700">{step}</span>
            <strong className="block text-xs font-bold text-slate-900 mt-1">{title}</strong>
            <span className="block text-[11px] text-slate-600 leading-relaxed mt-1">{description}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => onOpenAssessment(`Paid Diagnostic — ${path.diagnostic}`)}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-3 text-xs font-bold text-white transition-colors"
        >
          Start Paid Diagnostic
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <a
          href={serviceUrl}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-blue-200 px-4 py-3 text-xs font-bold text-blue-800 transition-colors text-center"
        >
          View Defined Project
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <p className="text-[10px] text-slate-500">
        The diagnostic is a separate paid engagement; its scope and fee are confirmed before work begins.
      </p>
    </div>
  );
}

export interface ServicesPageProps {
  persona: string;
  onSelectPersona: (nextPersona: string) => void;
  onSelectDesk: (desk: any) => void;
  onInquiry: (deskTitle: string) => void;
  onNavigateFamilyOffice: () => void;
}

export default function ServicesPage({ persona, onSelectPersona, onSelectDesk, onInquiry, onNavigateFamilyOffice }: ServicesPageProps) {
  const visibleAdvisoryDesks = PERSONA_SERVICE_IDS[persona]
    ? ADVISORY_DESKS.filter((srv) => PERSONA_SERVICE_IDS[persona].includes(srv.id))
    : ADVISORY_DESKS;

  return (

          <div className="py-20 px-6 max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">PRODUCT ARCHITECTURE & DELIVERABLES</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">8 Core Advisory Desks + Dedicated Family Office</h2>
              <p className="text-slate-600">
                Real advisory services using AI-assisted analysis plus the professional review and delivery scope agreed for each engagement. Click any desk below to see deliverables and the delivery schedule.
              </p>
            </div>

            {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('utm_source') === 'free_tool' && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900" role="status">
                <strong>Recommended next step:</strong> your free-assessment result maps to the relevant Navigalex advisory service below.
              </div>
            )}

            {isResolvedPlaceholder(SITE_TRUST.clientCount) &&
              isResolvedPlaceholder(SITE_TRUST.credential) &&
              isResolvedPlaceholder(SITE_TRUST.anonymisedCaseOutcome) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 shadow-sm" aria-label="Navigalex trust signals">
                  <div className="text-center sm:text-left">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-700">Clients</span>
                    <span className="text-sm font-bold text-slate-900">{SITE_TRUST.clientCount}</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-700">Credential</span>
                    <span className="text-sm font-bold text-slate-900">{SITE_TRUST.credential}</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-700">Case Outcome</span>
                    <span className="text-sm font-bold text-slate-900">{SITE_TRUST.anonymisedCaseOutcome}</span>
                  </div>
                </div>
              )}

            {/* THE 4-STEP OPERATING MODEL: HOW WE DELIVER */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">TRANSPARENT OPERATING MODEL</span>
                <h3 className="text-2xl font-bold">How Any Advisory Desk Is Delivered To Your Business</h3>
                <p className="text-xs text-slate-300">A clear four-step delivery model from intake through documented recommendations.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">01</div>
                  <h4 className="font-bold text-sm">01. Intake & Confidentiality</h4>
                  <p className="text-xs text-slate-300">We identify the business question, agree the scope and put appropriate confidentiality terms in place before sensitive material is shared.</p>
                </div>

                <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">02</div>
                  <h4 className="font-bold text-sm">02. Evidence Collection</h4>
                  <p className="text-xs text-slate-300">You provide the records needed for the agreed assessment through the agreed secure channel.</p>
                </div>

                <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">03</div>
                  <h4 className="font-bold text-sm">03. AI Analysis + Human Review</h4>
                  <p className="text-xs text-slate-300">AI assists with structured analysis; professional review is performed where it is included in the engagement scope.</p>
                </div>

                <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">04</div>
                  <h4 className="font-bold text-sm">04. Decision Pack</h4>
                  <p className="text-xs text-slate-300">You receive the agreed summary, evidence-linked findings, recommendations and action tracker.</p>
                </div>
              </div>
            </div>

            {/* THE 9 DETAILED SERVICE CARDS */}
            <div
              role="tablist"
              aria-label="Filter services by buyer persona"
              className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm overflow-x-auto overscroll-contain"
            >
              {PERSONA_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  role="tab"
                  aria-selected={persona === option.key}
                  onClick={() => onSelectPersona(option.key)}
                  className={`shrink-0 min-w-[150px] sm:flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${persona === option.key ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleAdvisoryDesks.map((srv) => (
                <div key={srv.id} className="navigalex-card p-7 rounded-2xl flex flex-col justify-between space-y-6 relative shadow-lg border-t-4 border-blue-600 hover:border-blue-500 transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-[10px] font-bold text-blue-700 uppercase">
                        {srv.badge}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">⏱️ {srv.timeframe}</span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">{formatServiceTitle(srv.title)}</h3>
                      {srv.id === 'contract-to-cash' && (
                        <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs font-bold text-amber-900">
                          Use Section 43B(h) to get paid on time
                        </div>
                      )}
                      {REGULATORY_TRIGGERS[srv.id] && isResolvedPlaceholder(REGULATORY_TRIGGERS[srv.id].value) && (
                        <div className="mt-2 inline-flex max-w-full items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[11px] font-semibold text-blue-800">
                          {REGULATORY_TRIGGERS[srv.id].label}: {REGULATORY_TRIGGERS[srv.id].value}
                        </div>
                      )}
                      <span className="block text-xs font-semibold text-blue-600 mt-1">{srv.tagline}</span>
                      {PRICING_CONFIG[srv.id]?.outcomeClaim && isResolvedPlaceholder(PRICING_CONFIG[srv.id].outcomeClaim) && (
                        <div className="mt-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-900">
                          {PRICING_CONFIG[srv.id].outcomeClaim}
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{srv.summary}</p>
                    {srv.id === 'internal-audit' && (
                      <span className="inline-flex rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-[11px] font-bold text-indigo-800">
                        Next step after ControlCFO or FraudSignal
                      </span>
                    )}
                    {srv.id === 'fraudsignal' && (
                      <button
                        type="button"
                        onClick={() => onInquiry('FraudSignal Referral Partner — CA / CS / Employment Lawyer')}
                        className="w-full rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2 text-left text-[11px] font-semibold text-slate-700"
                      >
                        Referral partners: CAs, CS, employment lawyers
                      </button>
                    )}
                    {srv.id === 'contract-to-cash' && (
                      <a
                        href={getFreeToolHandoffUrl('contract-43b-h')}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2 text-xs font-bold text-blue-800 transition-colors"
                      >
                        Check payment timing under Section 43B(h)
                      </a>
                    )}
                    {srv.id === 'family-wealth' && (
                      <button
                        type="button"
                        onClick={onNavigateFamilyOffice}
                        className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[11px] font-bold text-blue-800 hover:bg-blue-100"
                      >
                        View dedicated Family Office page
                      </button>
                    )}

                    <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">Problem Solved</span>
                      <p className="text-xs text-slate-800 leading-relaxed">{srv.problem}</p>
                    </div>
                    {srv.id === 'fraudsignal' && isResolvedPlaceholder(FRAUDSIGNAL_CREDENTIAL) && (
                      <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-700">
                        Credential: {FRAUDSIGNAL_CREDENTIAL}
                      </div>
                    )}
                    {srv.id === 'tradeshield' && isResolvedPlaceholder(LC_STAT_CONFIG.value) && isResolvedPlaceholder(LC_STAT_CONFIG.source) && (
                      <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-[11px] text-slate-700">
                        {LC_STAT_CONFIG.value} <span className="text-slate-500">Source: {LC_STAT_CONFIG.source}</span>
                      </div>
                    )}

                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">What You Receive:</span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {srv.deliverables.slice(0, 3).map((d, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{d}</span>
                          </li>
                        ))}
                        {srv.deliverables.length > 3 && (
                          <li className="text-[11px] text-blue-600 font-semibold pl-5">
                            + {srv.deliverables.length - 3} more board-grade deliverables
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-xs text-slate-500 font-medium">Indicative Fee:</span>
                        <span className="text-sm font-bold text-slate-900">{srv.price}</span>
                      </div>
                      {PRICING_CONFIG[srv.id]?.anchor && (
                        <span className="text-xs font-bold text-blue-700">{PRICING_CONFIG[srv.id].anchor}</span>
                      )}
                      {srv.id === 'lenderready' && PRICING_CONFIG[srv.id]?.successFeeBasis && isResolvedPlaceholder(PRICING_CONFIG[srv.id].successFeeBasis) && (
                        <span className="text-[11px] text-slate-600">Success fee: {PRICING_CONFIG[srv.id].successFeeBasis}</span>
                      )}
                      {srv.id === 'board-box' && PRICING_CONFIG[srv.id]?.minimumTerm && isResolvedPlaceholder(PRICING_CONFIG[srv.id].minimumTerm) && (
                        <span className="text-[11px] text-slate-600">Minimum term / first-quarter review: {PRICING_CONFIG[srv.id].minimumTerm}</span>
                      )}
                      {srv.id === 'regtech' && (
                        <button
                          type="button"
                          onClick={() => onInquiry('DPDP Gap Assessment')}
                          className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl border border-indigo-200 transition-colors text-left"
                        >
                          DPDP Gap Assessment{isResolvedPlaceholder(PRICING_CONFIG[srv.id].entryAssessmentPrice) ? ' — ' + PRICING_CONFIG[srv.id].entryAssessmentPrice : ''}
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => onSelectDesk(srv)}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-colors text-center cursor-pointer"
                      >
                        See Full Scope
                      </button>
                      <button 
                        onClick={() => onInquiry(srv.title)}
                        className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors text-center cursor-pointer"
                      >
                        Inquire Desk
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
  );
}
