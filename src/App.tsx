import React, { useState, useEffect } from 'react';
import LiveAdvisoryBot from './components/LiveAdvisoryBot';
import AdminPanel from './components/AdminPanel';
import ModalCloseButton from './components/ModalCloseButton';
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
    timeframe: "14â€“21 Days",
    humanSignoff: "Professional review as specified in the agreed engagement scope",
    price: "â‚¹75,000â€“â‚¹3 Lakh + lawful success fee"
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
    price: "â‚¹1.5â€“4 Lakh fixed"
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
    price: "â‚¹75,000â€“â‚¹3 Lakh setup + â‚¹25,000â€“â‚¹1 Lakh/month"
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
    price: "â‚¹2â€“10 Lakh per cycle"
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
    price: "â‚¹2â€“6 Lakh setup + â‚¹50,000â€“â‚¹1.5 Lakh/month"
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
    timeframe: "6â€“12 Weeks Project",
    humanSignoff: "Professional review as specified in the agreed engagement scope",
    price: "â‚¹5â€“25 Lakh per project"
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
    timeframe: "2â€“4 Weeks per Investigation",
    humanSignoff: "Professional review as specified in the agreed engagement scope",
    price: "â‚¹3â€“15 Lakh per investigation"
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
    timeframe: "24â€“48 Hours per Transaction / Monthly Retainer",
    humanSignoff: "Professional review as specified in the agreed engagement scope",
    price: "â‚¹50,000â€“â‚¹2 Lakh per transaction/retainer"
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
    timeframe: "8â€“12 Weeks Setup + Quarterly Retainer",
    humanSignoff: "Professional review as specified in the agreed engagement scope",
    price: "â‚¹2â€“10 Lakh setup + â‚¹75,000â€“â‚¹3 Lakh/month"
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

const readPersonaParam = () => {
  if (typeof window === "undefined") return "all";
  const value = new URLSearchParams(window.location.search).get("persona");
  return PERSONA_OPTIONS.some((option) => option.key === value) ? value || "all" : "all";
};


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
  "contract-43b-h": { serviceId: "contract-to-cash", persona: "growing", campaign: "contract-43b-h" }
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


export default function App() {
  // Check if URL is /admin or ?admin=true
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      if (p === '/43b-h-check' || p.startsWith('/43b-h-check')) {
        return '43b-h-check';
      }
      if (p === '/family-office' || p.startsWith('/family-office')) {
        return 'family-office';
      }
      if (p === '/services' || p.startsWith('/services') || new URLSearchParams(window.location.search).has('persona')) {
        return 'services';
      }
      if (p === '/admin' || p.startsWith('/admin') || window.location.search.includes('admin') || window.location.hash.includes('admin')) {
        return 'admin';
      }
    }
    return 'home';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [persona, setPersona] = useState(readPersonaParam);


  // Persistent Real Visitor ID
  const [visitorId] = useState(() => {
    if (typeof window !== 'undefined') {
      let vid = localStorage.getItem('navigalex_visitor_id');
      if (!vid) {
        vid = 'v_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
        localStorage.setItem('navigalex_visitor_id', vid);
      }
      return vid;
    }
    return 'v_client';
  });

  // Sync with browser back/forward and URL navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const p = window.location.pathname.toLowerCase();
      const urlPersona = new URLSearchParams(window.location.search).get('persona');
      setPersona(PERSONA_OPTIONS.some((option) => option.key === urlPersona) ? urlPersona || 'all' : 'all');
      if (p === '/43b-h-check' || p.startsWith('/43b-h-check')) {
        setActiveTab('43b-h-check');
      } else if (p === '/family-office' || p.startsWith('/family-office')) {
        setActiveTab('family-office');
      } else if (p === '/services' || p.startsWith('/services') || urlPersona) {
        setActiveTab('services');
      } else if (p === '/admin' || p.startsWith('/admin') || window.location.search.includes('admin') || window.location.hash.includes('admin')) {
        setActiveTab('admin');
      } else if (activeTab === 'admin' || activeTab === 'family-office' || activeTab === 'services') {
        setActiveTab('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [activeTab]);

  // Real-time visitor activity telemetry on route/tab change
  useEffect(() => {
    if (activeTab === 'admin') return;
    try {
      fetch('/api/track/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          eventType: 'PAGE_VIEW',
          path: '/' + (activeTab === 'home' ? '' : activeTab),
          details: `Viewed ${activeTab} section`
        })
      });
    } catch {
      // ignore offline errors
    }
  }, [activeTab, visitorId]);

  // Spaceship.com Kinetic Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live Contract Analyzer State
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docText, setDocText] = useState('');
  const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false);
  const [isDownloadingContractReport, setIsDownloadingContractReport] = useState(false);
  const [docResult, setDocResult] = useState<any>(null);
  const [docInputError, setDocInputError] = useState('');

  // Section 43B(h) payment-timing screening state
  const [paymentCheck, setPaymentCheck] = useState({
    msmeStatus: 'yes',
    acceptanceDate: '',
    agreedDays: '45',
    paidDate: '',
    amount: ''
  });
  const [paymentCheckResult, setPaymentCheckResult] = useState<any>(null);

  // Live CIBIL / Banking Health Calculator State
  const [cibilForm, setCibilForm] = useState({
    turnover: '',
    monthlyEmi: '',
    ccLimit: '',
    overdueDebtors: '',
    annualOperatingProfit: ''
  });
  const [isScanningCibil, setIsScanningCibil] = useState(false);
  const [cibilResult, setCibilResult] = useState<any>(null);
  const [cibilInputError, setCibilInputError] = useState('');

  // Live Business Health Diagnostic State
  const [diagnosticIndustry, setDiagnosticIndustry] = useState('');
  const [diagnosticRevenue, setDiagnosticRevenue] = useState('');
  const [diagnosticNotes, setDiagnosticNotes] = useState('');
  const [diagnosticInputError, setDiagnosticInputError] = useState('');
  const [diagnosticFile, setDiagnosticFile] = useState<File | null>(null);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);

  // Interactive 5-point slider state
  const [diagnosticScores, setDiagnosticScores] = useState({
    cash: 0,
    contract: 0,
    funding: 0,
    fraud: 0,
    governance: 0
  });

  // Lead Generation form state
  const [leadForm, setLeadForm] = useState({
    name: '',
    company: '',
    designation: '',
    email: '',
    phone: '',
    businessType: 'MSME / Manufacturing',
    turnover: 'â‚¹5 Cr - â‚¹25 Cr',
    primaryConcern: 'Contract & Receivable Cash Flow Risk',
    contactMethod: 'Phone',
    consent: false
  });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Modals for full transparency
  const [selectedDeskModal, setSelectedDeskModal] = useState<any>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showGuardrailsModal, setShowGuardrailsModal] = useState(false);

  useEffect(() => {
    const modalOpen = Boolean(selectedDeskModal || showPrivacyModal || showGuardrailsModal);
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (selectedDeskModal) setSelectedDeskModal(null);
      else if (showPrivacyModal) setShowPrivacyModal(false);
      else if (showGuardrailsModal) setShowGuardrailsModal(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedDeskModal, showPrivacyModal, showGuardrailsModal]);

  // Seamless "Request Assessment" trigger that always scrolls & focuses
  const openAssessmentForm = (concern?: string) => {
    if (concern) {
      setLeadForm(prev => ({
        ...prev,
        primaryConcern: concern
      }));
    }
    setSelectedDeskModal(null);
    setShowPrivacyModal(false);
    setShowGuardrailsModal(false);
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDeskForBooking = (deskTitle: string) => {
    openAssessmentForm(deskTitle);
  };

  const runPaymentTimingCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const { msmeStatus, acceptanceDate, agreedDays, paidDate, amount } = paymentCheck;
    if (!acceptanceDate) {
      setPaymentCheckResult({ type: 'input', message: 'Enter the acceptance or deemed-acceptance date.' });
      return;
    }

    const accepted = new Date(acceptanceDate + 'T00:00:00');
    if (Number.isNaN(accepted.getTime())) {
      setPaymentCheckResult({ type: 'input', message: 'Enter a valid acceptance date.' });
      return;
    }

    const agreed = Math.max(0, Number.parseInt(agreedDays || '45', 10) || 0);
    const statutoryMax = new Date(accepted);
    statutoryMax.setDate(statutoryMax.getDate() + 45);

    const agreedDue = new Date(accepted);
    agreedDue.setDate(agreedDue.getDate() + Math.min(agreed, 45));

    const today = new Date();
    const paid = paidDate ? new Date(paidDate + 'T00:00:00') : today;
    if (Number.isNaN(paid.getTime())) {
      setPaymentCheckResult({ type: 'input', message: 'Enter a valid payment date or leave it blank if unpaid.' });
      return;
    }

    const daysToPayment = Math.max(0, Math.floor((paid.getTime() - accepted.getTime()) / 86400000));
    const beyond45 = paid.getTime() > statutoryMax.getTime();
    const beyondAgreed = paid.getTime() > agreedDue.getTime();
    const potentialIssue = msmeStatus === 'yes' && (beyond45 || beyondAgreed);

    setPaymentCheckResult({
      type: potentialIssue ? 'flag' : 'clear',
      daysToPayment,
      statutoryMax: statutoryMax.toLocaleDateString('en-IN'),
      agreedDue: agreedDue.toLocaleDateString('en-IN'),
      amount: amount || '',
      potentialIssue,
      note: msmeStatus === 'yes'
        ? 'Based on the dates you entered, the payment appears to be beyond the Section 15 timing screen used for this check.'
        : 'The Section 15 timing screen is intended for a supplier that qualifies as a micro or small enterprise. Your answer indicates that status is not confirmed.'
    });
  };

  const handleAnalyzeDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setDocInputError('');
    let sourceText = docText.trim();
    if (!sourceText && docFile) {
      const isTextFile = /(^text\/)|(csv)|(json)/i.test(docFile.type) || /\.(txt|csv|json)$/i.test(docFile.name);
      if (!isTextFile) {
        setDocInputError('This version does not extract PDF, DOCX or image contents. Paste the actual contract text in Option B so the assessment is based on the document itself.');
        return;
      }
      try { sourceText = (await docFile.text()).trim(); } catch {
        setDocInputError('The selected text file could not be read. Paste the contract text directly.');
        return;
      }
    }
    if (sourceText.length < 80) {
      setDocInputError('Please provide enough of the actual contract text for a meaningful document-specific assessment.');
      return;
    }
    setIsAnalyzingDoc(true);
    try {
      const res = await fetch('/api/documents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: sourceText,
          fileName: docFile?.name || 'Pasted Agreement Text',
          visitorId
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setDocInputError(data.error || 'The contract could not be assessed from the supplied text.');
        return;
      }
      setDocResult(data.analysis);
    } catch (err) {
      console.error(err);
      setDocInputError('The contract assessment could not be completed. Please try again.');
    } finally {
      setIsAnalyzingDoc(false);
    }
  };
  const handleDownloadContractReport = async () => {
    if (!docResult || isDownloadingContractReport) return;
    setIsDownloadingContractReport(true);
    try {
      const response = await fetch('/api/report/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Contract Risk Review',
          documentName: docResult.fileName,
          analysis: {
            fileName: docResult.fileName,
            riskScore: docResult.riskScore,
            riskLevel: docResult.riskLevel,
            summary: docResult.summary,
            clauses: Array.isArray(docResult.clauses) ? docResult.clauses : [],
            recommendations: Array.isArray(docResult.recommendations) ? docResult.recommendations : []
          },
          generatedAt: new Date().toISOString()
        })
      });
      if (!response.ok) throw new Error('PDF generation failed.');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const linkEl = document.createElement('a');
      linkEl.href = url;
      linkEl.download = 'Navigalex-Contract-Risk-Report.pdf';
      document.body.appendChild(linkEl);
      linkEl.click();
      linkEl.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Contract report download failed:', err);
      alert('Unable to generate the personalized PDF report. Please try again.');
    } finally {
      setIsDownloadingContractReport(false);
    }
  };

  const handleScanCibil = async (e: React.FormEvent) => {
    e.preventDefault();
    const required = Object.values(cibilForm);
    if (required.some((value) => value === '')) { setCibilInputError('Enter all five figures before running the calculation.'); return; }
    setCibilInputError('');
    setIsScanningCibil(true);
    try {
      const res = await fetch('/api/cibil-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cibilForm, visitorId })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setCibilInputError(data.error || 'The banking assessment could not be calculated.');
        return;
      }
      setCibilResult(data.report);
    } catch (err) {
      console.error(err);
      setCibilInputError('The banking assessment could not be completed.');
    } finally {
      setIsScanningCibil(false);
    }
  };
  const handleRunDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    setDiagnosticInputError('');
    if (!diagnosticIndustry || !diagnosticRevenue) {
      setDiagnosticInputError('Select the industry and revenue range before running the assessment.');
      return;
    }
    let sourceText = diagnosticNotes.trim();
    if (!sourceText && diagnosticFile) {
      const isTextFile = /(^text\/)|(csv)|(json)/i.test(diagnosticFile.type) || /\.(txt|csv|json)$/i.test(diagnosticFile.name);
      if (!isTextFile) {
        setDiagnosticInputError('This version does not extract PDF or Excel files. Paste the actual financial and operating facts into the text box so the report is based on real inputs.');
        return;
      }
      try { sourceText = (await diagnosticFile.text()).trim(); } catch {
        setDiagnosticInputError('The supporting text file could not be read. Paste the figures directly.');
        return;
      }
    }
    if (sourceText.length < 40) {
      setDiagnosticInputError('Enter the actual financial and operating facts you want assessed. The system will not generate a report from preset assumptions.');
      return;
    }
    setIsRunningDiagnostic(true);
    try {
      const res = await fetch('/api/assessments/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: diagnosticIndustry,
          revenue: diagnosticRevenue,
          serviceType: 'Business Health Assessment',
          financialSummary: sourceText,
          visitorId
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setDiagnosticInputError(data.error || 'The business assessment could not be generated.');
        return;
      }
      setDiagnosticResult(data.assessment);
    } catch (err) {
      console.error(err);
      setDiagnosticInputError('The business assessment could not be completed. Please try again.');
    } finally {
      setIsRunningDiagnostic(false);
    }
  };
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.consent) {
      alert('Please accept the privacy and data consent notice.');
      return;
    }
    try {
      await fetch('/api/inquiries/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadForm,
          visitorId
        })
      });
    } catch (err) {
      console.error('Error posting inquiry:', err);
    }
    setLeadSubmitted(true);
  };

  const navigateToFamilyOffice = () => {
    window.history.pushState(null, '', '/family-office');
    setActiveTab('family-office');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibleAdvisoryDesks = PERSONA_SERVICE_IDS[persona]
    ? ADVISORY_DESKS.filter((srv) => PERSONA_SERVICE_IDS[persona].includes(srv.id))
    : ADVISORY_DESKS;

  const selectPersona = (nextPersona: string) => {
    setPersona(nextPersona);
    const url = new URL(window.location.href);
    if (nextPersona === 'all') url.searchParams.delete('persona');
    else url.searchParams.set('persona', nextPersona);
    window.history.replaceState(null, '', url.pathname + (url.search ? url.search : '') + url.hash);
  };

  if (activeTab === 'admin') {
    return (
      <>
        <AdminPanel onBackToSite={() => {
          if (typeof window !== 'undefined' && window.location.pathname.toLowerCase() === '/admin') {
            window.history.pushState(null, '', '/');
          }
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} />
        <LiveAdvisoryBot 
          onOpenAssessment={openAssessmentForm} 
          onNavigateTab={(tab) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#0f172a] flex flex-col font-['Inter'] selection:bg-blue-600 selection:text-white relative">
      {/* Spaceship.com Kinetic Top Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-slate-100/60 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 transition-all duration-75 shadow-[0_0_12px_rgba(59,130,246,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Spaceship.com Ambient Floating Mesh Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 -left-36 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] animate-spaceship-float"></div>
        <div className="absolute top-2/3 -right-36 w-[450px] h-[450px] bg-indigo-400/10 rounded-full blur-[140px] animate-spaceship-float-reverse"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-400/5 rounded-full blur-[100px] animate-spaceship-glow"></div>
      </div>

      {/* Clean brand strip */}
      <div className="bg-slate-950 text-white/90 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-8 flex items-center justify-center text-[10px] sm:text-[11px] font-medium tracking-wide">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            <><strong className="font-bold">Navigalex Advisory:</strong> We help Indian business owners assess financial, legal, governance and banking risks using AI-assisted analysis and professional review.</>
          </span>
        </div>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-[0_1px_12px_rgba(15,23,42,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[76px] grid grid-cols-[320px_minmax(0,1fr)_190px] items-center gap-3">
          <button
            type="button"
            aria-label="Go to Navigalex home"
            className="flex items-center gap-2.5 min-w-0 group w-full"
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm shadow-blue-600/20 shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </span>
            <span className="min-w-0 leading-none text-left">
              <span className="block text-[22px] sm:text-[25px] font-extrabold tracking-tight text-black">NAVIGALEX</span>
              <span className="block mt-1 text-[10px] sm:text-[11px] text-black font-extrabold tracking-[0.18em] uppercase">Executive Advisory</span>
            </span>
          </button>

          <nav className="hidden lg:flex min-w-0 overflow-hidden items-center justify-start gap-0.5 xl:gap-1 font-semibold" aria-label="Primary navigation">
            {[
              ['home', 'Home'],
              ['live-tools', 'Live AI Scanners'],
              ['services', 'Our 9 Services'],
              ['why-pick-us', 'Why Pick These Products'],
              ['industries', 'Industries'],
              ['how-it-works', 'How It Works'],
              ['about', 'About'],
              ['contact', 'Contact']
            ].map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`px-1 xl:px-1.5 py-2 rounded-lg text-[14px] xl:text-[15px] leading-tight whitespace-nowrap text-black transition-colors hover:bg-slate-100 ${activeTab === tab ? 'text-black bg-slate-100' : 'text-black'}`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2 shrink-0 w-full">
            <button
              onClick={() => openAssessmentForm()}
              className="hidden sm:inline-flex items-center justify-center w-full px-3 py-2.5 text-[14px] font-bold text-black bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm shadow-blue-600/20 transition-all cursor-pointer whitespace-nowrap"
            >
              Request Assessment
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 sm:px-6 py-4 shadow-xl">
            <div className="grid grid-cols-2 gap-2">
              {[
                ['home', 'Home'],
                ['live-tools', 'Live AI Scanners'],
                ['services', 'Our 9 Services'],
                ['why-pick-us', 'Why Pick These Products'],
                ['industries', 'Industries'],
                ['how-it-works', 'How It Works'],
                ['about', 'About'],
                ['contact', 'Contact']
              ].map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`text-left px-3 py-2.5 rounded-xl text-[14px] font-semibold text-black transition-colors ${activeTab === tab ? 'text-black bg-slate-100' : 'text-black hover:bg-slate-100'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => { openAssessmentForm(); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-black font-bold text-[14px] shadow-sm"
              >
                Request a Confidential Assessment
              </button>
            </div>
          </div>
        )}
      </header>
      {/* Main Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-24 pb-24">
            {/* Hero Section in Simple Layman Language */}
            <section className="relative pt-20 pb-20 px-6 max-w-7xl mx-auto overflow-hidden navigalex-light-gradient rounded-b-3xl border-b border-slate-200">
              <div className="max-w-4xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Business & Legal Advisory, Built for Complex Decisions</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 bg-clip-text text-transparent">
                  Navigate Business Decisions With <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 bg-clip-text text-transparent font-extrabold">Absolute Clarity.</span>
                </h1>

                <p className="text-base sm:text-xl text-slate-700 max-w-3xl leading-relaxed font-normal">
                  Navigalex helps lenders, founders and boards turn financial, risk and governance signals into clear decisions — before small issues become expensive problems.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button
                    onClick={() => openAssessmentForm()}
                    className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
                  >
                    <span>Request a Confidential Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setActiveTab('live-tools'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <span>Try Free Live Assessments</span>
                  </button>
                </div>

                <div className="pt-4 flex items-center gap-3 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Senior professional judgment. Smart AI scanning. Clear proof for every action.</span>
                </div>
              </div>

              {/* Three Live Commercial Highlights */}
              <div className="mt-12 p-6 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">LIVE 1</span>
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Contract Risk Scanner</h3>
                  <p className="text-xs text-slate-600 mt-1 mb-3">Upload any client/vendor agreement or paste text. Catch unlimited liability and payment default traps.</p>
                  <button onClick={() => { setActiveTab('live-tools'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    Try free assessment <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">LIVE 2</span>
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Bank Loan Readiness Check</h3>
                  <p className="text-xs text-slate-600 mt-1 mb-3">Calculate your Debt Service Coverage (DSCR) and see exactly what triggers loan rejection from banks.</p>
                  <button onClick={() => { setActiveTab('live-tools'); window.scrollTo({ top: 600, behavior: 'smooth' }); }} className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer">
                    Calculate DSCR <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 hover:border-indigo-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Flagship Product</span>
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">ControlCFOâ„¢ 30-Day Sprint</h3>
                  <p className="text-xs text-slate-600 mt-1 mb-3">Your part-time senior CFO and risk command centre, designed to give you senior oversight without a full-time CFO structure.</p>
                  <button onClick={() => { setSelectedDeskModal(ADVISORY_DESKS[0]); }} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer">
                    See sprint details <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </section>

            {/* Core Problem Section in Simple Layman Language */}
            <section className="max-w-7xl mx-auto px-6 space-y-12">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">THE REAL PROBLEM IN EVERY BUSINESS</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  Turn financial and business signals into clear decisions
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  As an Indian business owner, you pay your CA for tax filings and your lawyer for disputes. But neither of them connects your cash flow with your contract risks or bank limits. That is where money leaks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { role: "Your Accountant", whatTheyDo: "Files GST & Income Tax", blindspot: "Does not check if bad customer contract terms are trapping your working capital." },
                  { role: "Your Lawyer", whatTheyDo: "Fights court cases & drafts notices", blindspot: "Does not understand your monthly bank cash credit and debtor payment reality." },
                  { role: "Your Bank Manager", whatTheyDo: "Looks at collateral & past balance sheet", blindspot: "Does not warn you before rejecting your limit renewal due to DSCR dip." },
                  { role: "Your ERP / Software", whatTheyDo: "Generates bills and reports", blindspot: "Shows raw numbers, but cannot warn you of impending cash death traps." }
                ].map((item, idx) => (
                  <div key={idx} className="navigalex-card p-6 rounded-2xl space-y-3 border-l-4 border-blue-600">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.role}</span>
                    <h3 className="text-base font-bold text-slate-900">{item.whatTheyDo}</h3>
                    <p className="text-xs text-rose-600 font-medium"><strong>The Blindspot:</strong> {item.blindspot}</p>
                  </div>
                ))}
              </div>

              {/* The Navigalex Solution in Layman Terms */}
              <div className="navigalex-card p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white text-center space-y-4 shadow-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-300">HOW NAVIGALEX SOLVES THIS</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">One Unified Decision System For Your Money & Risk</h3>
                <p className="text-sm text-slate-200 max-w-2xl mx-auto leading-relaxed">
                  We connect each finding to the evidence supplied, an action owner, and a practical next step. Clear decisions and clear accountability.
                </p>
                <div className="pt-2">
                  <button onClick={() => { setActiveTab('live-tools'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer">
                    Explore Live Diagnostic Assessments
                  </button>
                </div>
              </div>
            </section>

            {/* Quick 5-Point Interactive Self-Check */}
            <section className="max-w-7xl mx-auto px-6 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">3-MINUTE BUSINESS RISK CHECK</span>
                <h2 className="text-3xl font-extrabold text-slate-900">How safe is your business right now?</h2>
                <p className="text-sm text-slate-600">Move the sliders to check your risk exposure in plain words.</p>
              </div>

              <div className="navigalex-card p-8 rounded-2xl max-w-3xl mx-auto space-y-8 shadow-lg">
                {[
                  { key: 'cash', label: '1. Customer Payment Delay (Receivables)', desc: 'How long does it take clients to clear bills? (1 = under 30 days, 5 = stuck over 90 days).' },
                  { key: 'contract', label: '2. Customer & Vendor Contracts', desc: 'Do you sign customer contracts without lawyer review or with unlimited penalties? (1 = fully capped, 5 = unlimited liability).' },
                  { key: 'funding', label: '3. Bank Loan & CC Limits', desc: 'Is your bank borrowing frequently close to its available limit with limited coverage? (1 = strong cushion, 5 = high pressure).' },
                  { key: 'fraud', label: '4. Internal Billing & Inventory Checks', desc: 'Can employees or partners release money or dispatch inventory without dual approvals? (1 = strict controls, 5 = blind trust).' },
                  { key: 'governance', label: '5. Board Minutes & Director Protection', desc: 'Are company resolutions and director meeting records properly drafted and signed? (1 = well documented, 5 = records are missing or unclear).' }
                ].map((dim) => (
                  <div key={dim.key} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-900">{dim.label}</span>
                      <span className="text-xs font-bold text-blue-600">
                        {diagnosticScores[dim.key as keyof typeof diagnosticScores] === 0 ? 'Not answered' : `Risk: ${diagnosticScores[dim.key as keyof typeof diagnosticScores]} / 5`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{dim.desc}</p>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      value={diagnosticScores[dim.key as keyof typeof diagnosticScores]}
                      onChange={(e) => setDiagnosticScores({...diagnosticScores, [dim.key]: parseInt(e.target.value)})}
                      className="w-full accent-blue-600 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                ))}

                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-600">
                    Your Total Risk Score: <strong className="text-blue-600 text-base">
                      {Object.values(diagnosticScores).reduce((a, b) => a + b, 0)} / 25
                    </strong>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      {Object.values(diagnosticScores).reduce((a, b) => a + b, 0) > 16 ? "âš ï¸ High Risk: Immediate cleanup recommended." : "Healthy profile with minor optimization needed."}
                    </span>
                  </div>
                  <button
                    disabled={Object.values(diagnosticScores).some((score) => score === 0)}
                    onClick={() => openAssessmentForm('Complete 5-Part Risk Assessment')} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-white rounded-xl transition-all shadow-md cursor-pointer">
                    Request Full Confidential Audit
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* LIVE AI ASSESSMENTS TAB */}
        {activeTab === 'live-tools' && (
          <div className="py-16 px-6 max-w-7xl mx-auto space-y-20">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">COMMERCIAL-GRADE WORKING ENGINES</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">Live AI Financial & Legal Assessments</h2>
              <p className="text-slate-600">Assess real contracts, check loan readiness, and generate an instant business diagnostic report.</p>
            </div>

            {/* LIVE 1: Contract & Agreement Risk Analyzer */}
            <section className="navigalex-card rounded-2xl p-8 sm:p-10 shadow-xl border-t-4 border-blue-600 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                    <FileText className="w-3.5 h-3.5" /> LIVE COMMERCIAL ENGINE
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">1. Contract & Document Risk Scanner</h3>
                  <p className="text-xs text-slate-600 mt-1">Upload any client MSA, vendor order, or contract clause to detect uncapped indemnity, penalty traps, and unfair termination terms.</p>
                </div>
                <div className="hidden sm:block text-xs text-slate-500">
                  Upload a real agreement or paste the clause you want reviewed.
                </div>
              </div>

              {/* WHY PICK THIS PRODUCT GUIDE */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-blue-900 uppercase">ðŸ’¡ What this assessment provides</span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Best fit:</strong> Teams reviewing customer, vendor or service agreements where commercial exposure matters.<br />
                  <strong>What it checks:</strong> Liability, indemnity, payment, termination, IP, jurisdiction and dispute terms actually present in the supplied text.<br />
                  <strong>Commercial value:</strong> Gives you a document-specific risk summary and negotiation actions before you decide whether to sign.
                </p>
              </div>

              <form onSubmit={handleAnalyzeDocument} className="space-y-6">
                {/* File Upload Zone */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Option A: Upload agreement text (TXT or CSV)</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50">
                    <input 
                      type="file" 
                      onChange={e => setDocFile(e.target.files?.[0] || null)}
                      className="hidden" 
                      id="contract-file-upload-live"
                      accept=".txt,.csv,.json"
                    />
                    <label htmlFor="contract-file-upload-live" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-blue-600" />
                      <span className="text-sm font-bold text-slate-800">
                        {docFile ? docFile.name : "Click to browse or drop agreement file here"}
                      </span>
                      <span className="text-xs text-slate-500">For PDF/DOCX/image contracts, paste the extracted text below. Text files and CSV are read directly.</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Option B: Or Paste Clause / Contract Text</label>
                  <textarea 
                    rows={4}
                    value={docText}
                    onChange={e => setDocText(e.target.value)}
                    placeholder="Paste indemnity, limitation of liability, payment terms, or termination clauses here..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isAnalyzingDoc || (!docText.trim() && !docFile)}
                  className="w-full flex items-center justify-center gap-3 py-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isAnalyzingDoc ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin" />
                      <span>Scanning clauses for commercial liability...</span>
                    </>
                  ) : (
                    <>
                      <span>Scan Contract For Hidden Risks</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                {docInputError && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900" role="alert">
                    {docInputError}
                  </div>
                )}

              </form>

              {/* Live Contract Scan Results */}
              {docResult && (
                <div className="mt-8 p-6 bg-slate-50 border border-slate-300 rounded-xl space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">Your Contract Risk Summary</h4>
                      <p className="text-xs text-slate-500">Reviewed document: {docResult.fileName}</p>
                    </div>
                    <span className="px-3.5 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold">
                      {docResult.riskScore} - {docResult.riskLevel}
                    </span>
                  </div>

                  <div className="rounded-xl bg-white border border-slate-200 p-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">Executive Summary</h5>
                    <p className="text-sm text-slate-700 leading-relaxed">{docResult.summary}</p>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Key Findings
                    </h5>
                    <div className="space-y-2">
                      {(docResult.clauses || []).slice(0, 3).map((c: string, idx: number) => (
                        <div key={idx} className="p-3 bg-white border border-rose-200 rounded-lg text-xs text-slate-800 shadow-sm flex items-start gap-2">
                          <span className="text-rose-600 font-bold shrink-0">{idx + 1}.</span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Recommended Actions
                    </h5>
                    <div className="space-y-2">
                      {(docResult.recommendations || []).slice(0, 3).map((r: string, idx: number) => (
                        <div key={idx} className="p-3 bg-white border border-emerald-200 rounded-lg text-xs text-slate-800 shadow-sm flex items-start gap-2">
                          <span className="text-emerald-600 font-bold shrink-0">{idx + 1}.</span>
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={handleDownloadContractReport}
                      disabled={isDownloadingContractReport}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-4 py-3 text-xs font-bold text-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      {isDownloadingContractReport ? 'Generating Personalized PDF...' : 'Download Personalized PDF'}
                    </button>
                    <a
                      href={getFreeToolHandoffUrl('contract-43b-h')}
                      className="flex-1 inline-flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-3 text-xs font-bold text-blue-800 transition-colors text-center"
                    >
                      Check payment timing under Section 43B(h)
                    </a>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    The page shows a concise decision summary. Download the personalized PDF for the detailed findings and actions.
                  </p>
                </div>
              )}
            </section>

            {/* LIVE 2: Bank Loan Readiness Calculator */}
            <section className="navigalex-card rounded-2xl p-8 sm:p-10 shadow-xl border-t-4 border-emerald-600 space-y-8">
              <div className="border-b border-slate-200 pb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
                  <Landmark className="w-3.5 h-3.5" /> LIVE BANKING ENGINE
                </div>
                <h3 className="text-2xl font-bold text-slate-900">2. Bank Loan Readiness Calculator</h3>
                <p className="text-xs text-slate-600 mt-1">Calculate DSCR and review the relationship between operating profit, debt service, borrowing and overdue receivables.</p>
              </div>

              {/* WHY PICK THIS PRODUCT GUIDE */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-emerald-900 uppercase">ðŸ’¡ Why pick this product?</span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Best fit:</strong> Businesses preparing or reviewing a bank borrowing package using their own financial figures.<br />
                  <strong>What it checks:</strong> DSCR and the relationship between operating profit, debt service, borrowing and overdue receivables based on your inputs.<br />
                  <strong>Commercial value:</strong> Helps you prepare a clearer lender discussion from the numbers you supply.
                </p>
              </div>

              <form onSubmit={handleScanCibil} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Annual Business Turnover (â‚¹ in Crores)</label>
                  <input 
                    type="number" 
                    step="0.5"
                    value={cibilForm.turnover}
                    onChange={e => setCibilForm({...cibilForm, turnover: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">e.g. 15 for â‚¹15 Crores annual sales</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Total Monthly Loan EMIs (â‚¹ in Lakhs)</label>
                  <input 
                    type="number" 
                    step="0.5"
                    value={cibilForm.monthlyEmi}
                    onChange={e => setCibilForm({...cibilForm, monthlyEmi: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">e.g. 4.5 for â‚¹4.5 Lakhs monthly EMI outflow</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Existing Bank Cash Credit / OD Limit (â‚¹ in Crores)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={cibilForm.ccLimit}
                    onChange={e => setCibilForm({...cibilForm, ccLimit: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">e.g. 2.5 for â‚¹2.5 Crores sanctioned limit</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Overdue Receivables Stuck &gt; 90 Days (â‚¹ in Lakhs)</label>
                  <input 
                    type="number" 
                    step="5"
                    value={cibilForm.overdueDebtors}
                    onChange={e => setCibilForm({...cibilForm, overdueDebtors: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">e.g. 45 for â‚¹45 Lakhs payments delayed over 90 days</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Annual Operating Profit (INR in Crores)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={cibilForm.annualOperatingProfit}
                    onChange={e => setCibilForm({...cibilForm, annualOperatingProfit: e.target.value})}
                    placeholder="e.g. 2.1"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Required for a real DSCR calculation; no operating-profit assumption is applied.</span>
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={isScanningCibil}
                    className="w-full py-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    {isScanningCibil ? "Calculating Banking Coverage..." : "Run Free Bank Readiness Diagnostic"}
                  </button>
                </div>
                {cibilInputError && (
                  <div className="sm:col-span-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900" role="alert">
                    {cibilInputError}
                  </div>
                )}

              </form>

              {/* Bank Readiness Result */}
              {cibilResult && (
                <div className="p-6 bg-slate-50 border border-slate-300 rounded-xl space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500 block uppercase font-bold">Calculated DSCR</span>
                      <span className="text-lg font-bold text-blue-700 mt-1 block">{cibilResult.calculatedDscr}</span>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500 block uppercase font-bold">Operating Profit Used</span>
                      <span className="text-lg font-bold text-slate-900 mt-1 block">{cibilResult.annualOperatingProfit}</span>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500 block uppercase font-bold">Annualized EMI</span>
                      <span className="text-lg font-bold text-slate-900 mt-1 block">{cibilResult.annualEmi}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                      <strong className="block text-slate-900 mb-1">CC/OD share of turnover</strong>
                      {cibilResult.ccLimitShareOfTurnover}
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                      <strong className="block text-slate-900 mb-1">Overdue receivables share of turnover</strong>
                      {cibilResult.overdueReceivablesShareOfTurnover}
                    </div>
                  </div>

                  <div className="pt-2">
                    <h5 className="text-xs font-bold text-slate-700 uppercase mb-2">Calculated observations:</h5>
                    <div className="space-y-1.5">
                      {(cibilResult.observations || []).map((p: string, i: number) => (
                        <div key={i} className="text-xs text-slate-700 p-2.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500">This calculation uses only the figures you entered. It is not a lender approval or credit decision.</p>
                </div>
              )}
            </section>

            {/* LIVE 3: Comprehensive Business Health & P&L Diagnostic */}
            <section className="navigalex-card rounded-2xl p-8 sm:p-10 shadow-xl border-t-4 border-indigo-600 space-y-8">
              <div className="border-b border-slate-200 pb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
                  <Activity className="w-3.5 h-3.5" /> LIVE BUSINESS ASSESSMENT
                </div>
                <h3 className="text-2xl font-bold text-slate-900">3. Business Health Assessment</h3>
                <p className="text-xs text-slate-600 mt-1">Provide your actual operating and financial facts to generate a business-specific management assessment.</p>
              </div>

              {/* WHY PICK THIS PRODUCT GUIDE */}
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-indigo-900 uppercase">ðŸ’¡ Why pick this product?</span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Best fit:</strong> Management teams willing to provide actual operating and financial facts for a business-specific review.<br />
                  <strong>What it checks:</strong> Cash conversion, controls, collections, debt and operating issues supported by the facts you provide.<br />
                  <strong>Commercial value:</strong> Produces a prioritized action list linked to the information available in your assessment.
                </p>
              </div>

              <form onSubmit={handleRunDiagnostic} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Industry Sector</label>
                    <select 
                      value={diagnosticIndustry}
                      onChange={e => setDiagnosticIndustry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                    >
                      <option value="" disabled>Select an industry</option>
                      <option>Manufacturing & Engineering</option>
                      <option>Exporters & International Trade</option>
                      <option>Distributors & Wholesale Trading</option>
                      <option>Schools, Colleges & Education</option>
                      <option>Real Estate, Construction & Property</option>
                      <option>NBFC & Fintech Vendors</option>
                      <option>Healthcare, Clinics & Hospitals</option>
                      <option>Professional Services & IT Agencies</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Annual Revenue Range</label>
                    <select 
                      value={diagnosticRevenue}
                      onChange={e => setDiagnosticRevenue(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                    >
                      <option value="" disabled>Select a revenue range</option>
                      <option>&lt; â‚¹1 Cr (Early Stage)</option>
                      <option>â‚¹1 Cr - â‚¹5 Cr</option>
                      <option>â‚¹5 Cr - â‚¹25 Cr (MSME Growth)</option>
                      <option>â‚¹25 Cr - â‚¹100 Cr (Mid-Corporate)</option>
                      <option>â‚¹100 Cr+ (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Optional supporting text (TXT/CSV)</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-indigo-500 transition-colors bg-slate-50">
                    <input 
                      type="file" 
                      onChange={e => setDiagnosticFile(e.target.files?.[0] || null)}
                      className="hidden" 
                      id="diagnostic-file-upload" accept=".txt,.csv,.json"
                    />
                    <label htmlFor="diagnostic-file-upload" className="cursor-pointer flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-700">
                        {diagnosticFile ? diagnosticFile.name : "Attach TXT/CSV supporting data"}
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Actual financial & operating facts</label>
                  <textarea
                    rows={6}
                    value={diagnosticNotes}
                    onChange={e => setDiagnosticNotes(e.target.value)}
                    placeholder="Example: Revenue ₹18 Cr; EBITDA ₹2.1 Cr; receivables ₹3.4 Cr; bank debt ₹4.2 Cr; top customer concentration 28%; two approval points for purchases; any known collection, contract or control issue..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isRunningDiagnostic}
                  className="w-full py-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  {isRunningDiagnostic ? "Compiling Executive Health Scan..." : "Generate Business Health Assessment"}
                </button>
                {diagnosticInputError && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900" role="alert">
                    {diagnosticInputError}
                  </div>
                )}

              </form>

              {diagnosticResult && (
                <div className="p-6 bg-slate-50 border border-slate-300 rounded-xl space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-200 pb-3">
                    <h4 className="font-bold text-slate-900">Business Assessment Summary</h4>
                    <p className="text-xs text-slate-500">{diagnosticResult.industry} | {diagnosticResult.revenue}</p>
                  </div>

                  <div className="rounded-xl bg-white border border-slate-200 p-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">Executive Summary</h5>
                    <p className="text-sm text-slate-700 leading-relaxed">{diagnosticResult.report.executiveSummary}</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-rose-700 uppercase">Key Findings:</h5>
                    {(diagnosticResult.report.keyFindings || []).map((f: string, i: number) => (
                      <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 flex items-start gap-2">
                        <span className="text-rose-600 font-bold shrink-0">{i + 1}.</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-emerald-700 uppercase">Recommended Actions:</h5>
                    {(diagnosticResult.report.actionSteps || []).map((a: string, i: number) => (
                      <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 flex items-start gap-2">
                        <span className="text-emerald-600 font-bold shrink-0">{i + 1}.</span>
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>

                  {(diagnosticResult.report.dataGaps || []).length > 0 && (
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">Data to tighten the assessment</h5>
                      <div className="space-y-1">
                        {diagnosticResult.report.dataGaps.map((g: string, i: number) => (
                          <div key={i} className="text-xs text-amber-900">• {g}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        )}

        {/* WHY PICK THESE PRODUCTS - COMPREHENSIVE GUIDE TAB */}
        {activeTab === 'why-pick-us' && (
          <div className="py-20 px-6 max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">CLEAR VALUE & RETURN ON INVESTMENT</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">How Navigalex Services Create Commercial Value</h2>
              <p className="text-slate-600">Here is the plain, straightforward reason why Indian promoters and directors engage our desks instead of traditional advisors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "1. ControlCFO™ 30-Day Sprint",
                  idealFor: "Owner-managed businesses that want structured senior finance and risk oversight without adding a full-time executive role.",
                  problemSolved: "Management has fragmented visibility across cash flow, customer collections, contracts, debt and controls.",
                  commercialValue: "Creates a single working view of cash, risk, responsibilities and next actions from the records supplied.",
                  price: "₹1.5–4 Lakh fixed",
                  deskIndex: 1
                },
                {
                  title: "2. Contract-to-Cash Risk Desk",
                  idealFor: "Contractors, manufacturers and service businesses negotiating material customer agreements.",
                  problemSolved: "Supplier-side exposure can sit in indemnity, termination, payment, IP and dispute provisions.",
                  commercialValue: "Turns the supplied contract language and receivable facts into a focused negotiation and collection action list.",
                  price: "₹75,000–₹3 Lakh setup",
                  deskIndex: 2
                },
                {
                  title: "3. LenderReady Credit Office",
                  idealFor: "Companies preparing a bank borrowing, renewal, enhancement or restructuring package.",
                  problemSolved: "Financial records may be incomplete, inconsistent or difficult for a lender to evaluate.",
                  commercialValue: "Creates a lender-ready information pack and highlights the figures or documents that need reconciliation.",
                  price: "₹75,000–₹3 Lakh + success fee",
                  deskIndex: 0
                },
                {
                  title: "4. TradeShield LC/BG Desk",
                  idealFor: "Exporters, importers and tender/EPC businesses handling documentary trade transactions.",
                  problemSolved: "Document wording and documentary mismatches can create payment, presentation or guarantee risks.",
                  commercialValue: "Produces a transaction-specific discrepancy and documentation checklist before presentation.",
                  price: "₹50,000–₹2 Lakh per transaction",
                  deskIndex: 7
                },
                {
                  title: "5. FraudSignal Investigation Cell",
                  idealFor: "Businesses investigating suspected leakage, unusual transactions or internal control breakdowns.",
                  problemSolved: "Transaction data can contain patterns that require structured testing and corroboration.",
                  commercialValue: "Produces a documented investigation trail, evidence index and issues for management or counsel review.",
                  price: "₹3–15 Lakh per investigation",
                  deskIndex: 6
                },
                {
                  title: "6. Family Wealth Governance",
                  idealFor: "Family-owned groups managing multiple entities, ownership structures or succession planning.",
                  problemSolved: "Ownership, authority and succession decisions can remain fragmented across family and operating entities.",
                  commercialValue: "Creates a structured governance and decision framework for review and formalisation with the appropriate professionals.",
                  price: "₹2–10 Lakh setup",
                  deskIndex: 8
                }
              ].map((p, idx) => (
                <div key={idx} className="navigalex-card p-8 rounded-2xl flex flex-col justify-between space-y-6 shadow-md border-t-4 border-blue-600">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
                    <div className="space-y-2 text-xs text-slate-700">
                      <div><strong className="text-slate-900">Who picks this:</strong> {p.idealFor}</div>
                      <div><strong className="text-rose-600">The Problem Solved:</strong> {p.problemSolved}</div>
                      <div><strong className="text-emerald-700">Commercial value:</strong> {p.commercialValue}</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Fee: {p.price}</span>
                    <button 
                      onClick={() => setSelectedDeskModal(ADVISORY_DESKS[p.deskIndex])}
                      className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 cursor-pointer"
                    >
                      See Full Scope
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALL 9 SERVICES TAB */}
        {activeTab === 'services' && (
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
              className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
            >
              {PERSONA_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  role="tab"
                  aria-selected={persona === option.key}
                  onClick={() => selectPersona(option.key)}
                  className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${persona === option.key ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`}
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
                      <span className="text-[11px] font-bold text-slate-500">â±ï¸ {srv.timeframe}</span>
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
                        onClick={() => handleSelectDeskForBooking('FraudSignal Referral Partner — CA / CS / Employment Lawyer')}
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
                        onClick={navigateToFamilyOffice}
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
                          onClick={() => handleSelectDeskForBooking('DPDP Gap Assessment')}
                          className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl border border-indigo-200 transition-colors text-left"
                        >
                          DPDP Gap Assessment{isResolvedPlaceholder(PRICING_CONFIG[srv.id].entryAssessmentPrice) ? ' — ' + PRICING_CONFIG[srv.id].entryAssessmentPrice : ''}
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setSelectedDeskModal(srv)}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-colors text-center cursor-pointer"
                      >
                        See Full Scope
                      </button>
                      <button 
                        onClick={() => handleSelectDeskForBooking(srv.title)}
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
        )}

        {activeTab === '43b-h-check' && (
          <div className="py-16 px-6 max-w-4xl mx-auto space-y-8">
            <button
              type="button"
              onClick={() => {
                window.history.pushState(null, '', '/services?persona=growing&service=contract-to-cash');
                setActiveTab('services');
              }}
              className="text-xs font-bold text-blue-700 hover:text-blue-600"
            >
              ← Back to Contract-to-Cash
            </button>

            <div className="space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">SECTION 43B(h) PAYMENT TIMING CHECK</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">Check payment timing under Section 43B(h)</h2>
              <p className="text-slate-600 max-w-3xl">
                Enter the transaction dates and supplier status. This screen checks payment timing against the Section 15 framework used for this assessment. It is a screening aid, not a legal or tax conclusion.
              </p>
            </div>

            <form onSubmit={runPaymentTimingCheck} className="navigalex-card rounded-2xl p-6 sm:p-8 shadow-xl border-t-4 border-blue-600 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Supplier status</label>
                  <select
                    value={paymentCheck.msmeStatus}
                    onChange={(e) => setPaymentCheck({ ...paymentCheck, msmeStatus: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900"
                  >
                    <option value="yes">Micro/small enterprise status confirmed</option>
                    <option value="no">Not confirmed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Acceptance / deemed acceptance date</label>
                  <input
                    required
                    type="date"
                    value={paymentCheck.acceptanceDate}
                    onChange={(e) => setPaymentCheck({ ...paymentCheck, acceptanceDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Written payment term (days)</label>
                  <input
                    type="number"
                    min="0"
                    max="45"
                    value={paymentCheck.agreedDays}
                    onChange={(e) => setPaymentCheck({ ...paymentCheck, agreedDays: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Enter the agreed payment term from your contract. The screen also applies the statutory 45-day outer limit used in this check.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Payment date</label>
                  <input
                    type="date"
                    value={paymentCheck.paidDate}
                    onChange={(e) => setPaymentCheck({ ...paymentCheck, paidDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Leave blank if still unpaid; the screen uses today's date.</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Outstanding amount (optional)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={paymentCheck.amount}
                    onChange={(e) => setPaymentCheck({ ...paymentCheck, amount: e.target.value })}
                    placeholder="e.g. 250000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg"
              >
                Check Payment Timing
              </button>
            </form>

            {paymentCheckResult && (
              <div className={`rounded-2xl border p-6 ${paymentCheckResult.type === 'flag' ? 'bg-amber-50 border-amber-200' : paymentCheckResult.type === 'clear' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                {paymentCheckResult.type === 'input' ? (
                  <p className="text-sm font-semibold text-slate-800">{paymentCheckResult.message}</p>
                ) : (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-900">
                      {paymentCheckResult.type === 'flag' ? 'Potential payment-timing issue' : 'No timing issue indicated by these entries'}
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Days from acceptance to payment check: {paymentCheckResult.daysToPayment}</li>
                      <li>• 45-day statutory timing screen date: {paymentCheckResult.statutoryMax}</li>
                      <li>• Written-term timing screen date: {paymentCheckResult.agreedDue}</li>
                      {paymentCheckResult.amount && <li>• Amount entered: ₹{paymentCheckResult.amount}</li>}
                    </ul>
                    <p className="text-xs text-slate-600">{paymentCheckResult.note}</p>
                    {paymentCheckResult.type === 'flag' && (
                      <button
                        type="button"
                        onClick={() => openAssessmentForm('Contract-to-Cash - Section 43B(h) Payment Review')}
                        className="inline-flex px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                      >
                        Request Contract-to-Cash Review
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'family-office' && (
          <div className="py-20 px-6 max-w-5xl mx-auto space-y-10">
            <button
              type="button"
              onClick={() => { window.history.pushState(null, '', '/services'); setActiveTab('services'); }}
              className="text-xs font-bold text-blue-700 hover:text-blue-600"
            >
              ← Back to all services
            </button>
            <div className="space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">FAMILY OFFICE</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">Family Wealth Governance Office</h2>
              <p className="text-slate-600 max-w-3xl">A dedicated governance and coordination service for multi-entity family businesses, succession planning and cross-entity risk.</p>
            </div>
            {(() => {
              const srv = ADVISORY_DESKS.find((item) => item.id === 'family-wealth');
              if (!srv) return null;
              return (
                <div className="navigalex-card rounded-2xl p-7 sm:p-9 space-y-7 shadow-xl border-t-4 border-blue-600">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{formatServiceTitle(srv.title)}</h3>
                      <p className="text-xs font-semibold text-blue-600 mt-1">{srv.tagline}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{srv.price}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{srv.summary}</p>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">What You Receive</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {srv.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Delivery Schedule</h4>
                    <div className="space-y-2">
                      {srv.deliverySchedule.map((item, i) => (
                        <div key={i} className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-700">{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-200 pt-5">
                    <span className="text-xs text-slate-500">{srv.timeframe}</span>
                    <button
                      type="button"
                      onClick={() => handleSelectDeskForBooking(srv.title)}
                      className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-md"
                    >
                      Inquire Family Office
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* INDUSTRIES TAB WITH ENHANCED LOCALIZED FEEL */}
        {activeTab === 'industries' && (
          <div className="py-20 px-6 max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">VERTICAL PLAYBOOKS</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">Tailored Solutions for Your Sector</h2>
              {/* REPHRASED LINE WITH AUTHENTIC LOCALIZED FEEL */}
              <p className="text-slate-700 font-medium text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                Rooted on-ground across â€” serving factory promoters, exporters, and enterprises in Noida Phase 2 & Sector 63, Greater Noida Ecotech & Surajpur industrial hubs,  Udyog Vihar & Manesar, and manufacturing corridors across North India.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Exporters & International Trade", desc: "Letter of Credit discrepancy prevention, shipping document compliance, and foreign buyer payment security." },
                { title: "Distributors & Wholesale Trading", desc: "Channel credit limits, dealer agreement safeguards, and working capital inventory velocity." },
                { title: "Schools & Educational Institutes", desc: "Trust compliance, student fee realization governance, and regulatory vendor contract audits." },
                { title: "Real Estate & Construction", desc: "RERA compliance, subcontractor milestone contracts, and construction debt service readiness." },
                { title: "NBFC & Fintech Vendors", desc: "Co-lending compliance, customer KYC/onboarding controls, and statutory audit remediation." },
                { title: "Family-Owned Enterprises", desc: "Succession planning, asset consolidation across private limited and LLP entities, and family charters." },
                { title: "Manufacturing & Engineering", desc: "Raw material price risk clauses, plant capex evaluation, and factory internal audit factories." },
                { title: "Healthcare & Clinics", desc: "Equipment lease agreements, medical vendor contracts, and patient data confidentiality guardrails." },
                { title: "IT & Professional Services", desc: "Master Services Agreement (MSA) protections, offshore client IP assignment, and milestone billing." }
              ].map((ind, i) => (
                <div key={i} className="navigalex-card p-6 rounded-2xl space-y-3 shadow-sm hover:border-blue-400 transition-colors">
                  <h3 className="text-lg font-bold text-slate-900">{ind.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{ind.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HOW IT WORKS TAB */}
        {activeTab === 'how-it-works' && (
          <div className="py-20 px-6 max-w-5xl mx-auto space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">SIMPLE 9-STEP PROCESS</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">How We Work With You</h2>
              <p className="text-slate-600">Smart AI speed combined with rigorous senior human professional review.</p>
            </div>

            <div className="space-y-4">
              {[
                { step: "01", title: "Intake & Discovery", desc: "We review the business goals and documents you choose to provide; confidentiality terms are agreed as applicable." },
                { step: "02", title: "Risk Classification", desc: "We group issues across the business areas supported by the information you provide." },
                { step: "03", title: "Evidence Collection", desc: "We reconcile bank statements, GST returns, debtor ledgers and agreements where those records are supplied and within scope." },
                { step: "04", title: "AI-Assisted Fast Scan", desc: "AI-assisted analysis can flag patterns, inconsistencies and clauses in supplied documents; results depend on the quality and completeness of the inputs." },
                { step: "05", title: "Senior Professional Review", desc: "Professional review is performed according to the engagement scope and the reviewer assigned to the matter." },
                { step: "06", title: "Executive Action Plan", desc: "You receive a concise brief with evidence-linked findings, priorities and recommended next actions." },
                { step: "07", title: "Implementation Support", desc: "Where implementation support is included, we help translate agreed actions into practical next steps." },
                { step: "08", title: "Closure Proof", desc: "We document completed actions and outstanding items; closure is recorded only where the agreed evidence supports it." },
                { step: "09", title: "Monthly Command Monitoring", desc: "Ongoing monitoring can be provided where included in the engagement." }
              ].map((w, idx) => (
                <div key={idx} className="navigalex-card p-6 rounded-2xl flex items-center gap-6 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-600 shrink-0">
                    {w.step}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{w.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quality Gates */}
            <div className="navigalex-card p-8 rounded-2xl border border-blue-200 space-y-4 bg-blue-50/40 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">Professional Review & Quality Controls</h3>
              <p className="text-xs text-slate-600">AI does not make final professional decisions. Human review and sign-off are provided where included in the engagement:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm"><strong>Finance:</strong> Dual review of cash models by qualified finance heads.</div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm"><strong>Legal:</strong> Review and sign-off by practicing advocates & counsel.</div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm"><strong>Forensics:</strong> Evidence preservation and investigation support are scoped to the matter and appropriate professional requirements.</div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm"><strong>Delivery:</strong> A client-approved action log can be maintained as part of the agreed delivery scope.</div>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="py-20 px-6 max-w-5xl mx-auto space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">ABOUT NAVIGALEX</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Governance & Risk Advisory For India</h2>
              <p className="text-slate-600">Founded to give owner-managed enterprises the same legal and financial rigor that large multinationals enjoy.</p>
            </div>

            <div className="navigalex-card p-8 sm:p-10 rounded-2xl space-y-6 shadow-md">
              <p className="text-sm text-slate-700 leading-relaxed">
                Navigalex was created because India's MSME growth is held back by preventable legal disputes, trapped receivables, and sudden bank loan rejections. By combining deep legal strategy, banking knowledge, forensic investigation, and private AI workflows, we bridge the gap between compliance filings and commercial reality.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Founding Expertise</h4>
                  <p className="text-xs text-slate-600">Legal strategy, insolvency, corporate finance, forensic audits, and trade financing.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Primary Operational Hub</h4>
                  <p className="text-xs text-slate-600">Serving India remotely and on-site where agreed.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Data Privacy Mandate</h4>
                  <p className="text-xs text-slate-600">Sensitive information is handled according to the published privacy terms and the controls of the engagement. Do not submit information you are not authorised to share.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT & ASSESSMENT TAB */}
        {activeTab === 'contact' && (
          <div className="py-20 px-6 max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">CONFIDENTIAL CONSULTATION</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Request a Confidential Assessment</h2>
              <p className="text-slate-600">Speak directly with a senior finance or legal advisory lead. Tell us what changed in your business or market; inquiries are handled confidentially.</p>
            </div>

            <div className="navigalex-card p-8 sm:p-10 rounded-2xl shadow-xl">
              {leadSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center mx-auto text-blue-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Inquiry Received Successfully</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thank you, {leadForm.name || 'there'}. Your request has been recorded. Our team will contact you using the method you selected.
                  </p>
                  <button onClick={() => setLeadSubmitted(false)} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white rounded-xl cursor-pointer">
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Your Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={leadForm.name}
                        onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                        placeholder="Rajesh Sharma" 
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Company / Enterprise Name *</label>
                      <input 
                        type="text" 
                        required
                        value={leadForm.company}
                        onChange={e => setLeadForm({...leadForm, company: e.target.value})}
                        placeholder="Apex Engineering Pvt Ltd" 
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Your Designation *</label>
                      <input 
                        type="text" 
                        required
                        value={leadForm.designation}
                        onChange={e => setLeadForm({...leadForm, designation: e.target.value})}
                        placeholder="Managing Director / Promoter / CFO" 
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Work Email *</label>
                      <input 
                        type="email" 
                        required
                        value={leadForm.email}
                        onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                        placeholder="rajesh@apexeng.com" 
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Phone / WhatsApp Number *</label>
                      <input 
                        type="tel" 
                        required
                        value={leadForm.phone}
                        onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                        placeholder="+91 98765 43210" 
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Annual Turnover</label>
                      <select 
                        value={leadForm.turnover}
                        onChange={e => setLeadForm({...leadForm, turnover: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                      >
                        <option>&lt; â‚¹5 Cr</option>
                        <option>â‚¹5 Cr - â‚¹25 Cr</option>
                        <option>â‚¹25 Cr - â‚¹100 Cr</option>
                        <option>â‚¹100 Cr+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Primary Business Challenge / Advisory Desk</label>
                    <select 
                      value={leadForm.primaryConcern}
                      onChange={e => setLeadForm({...leadForm, primaryConcern: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    >
                      <option>1. ControlCFOâ„¢ 30-Day Readiness Sprint</option>
                      <option>2. Board-in-a-Box Governance OS</option>
                      <option>3. Contract-to-Cash Risk Desk</option>
                      <option>4. TradeShield LC/BG Desk</option>
                      <option>5. FraudSignal Investigation Cell</option>
                      <option>6. LenderReady Credit & Recovery Office</option>
                      <option>7. RegTech Journey Lab</option>
                      <option>8. Family Wealth Governance Office</option>
                      <option>9. AI-Assisted Internal Audit Factory</option>
                      <option>Contract & Receivable Cash Flow Risk</option>
                      <option>Bank Loan CC/OD Renewal & Data Room</option>
                      <option>Direct Consultation with Practice Lead</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Preferred Contact Method</label>
                    <div className="flex gap-6 pt-1">
                      {['Phone', 'WhatsApp', 'Email', 'Confidential Video Call'].map(m => (
                        <label key={m} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input 
                            type="radio" 
                            name="contactMethod"
                            checked={leadForm.contactMethod === m}
                            onChange={() => setLeadForm({...leadForm, contactMethod: m})}
                            className="accent-blue-600"
                          />
                          <span>{m}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-3 text-xs text-slate-600 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={leadForm.consent}
                        onChange={e => setLeadForm({...leadForm, consent: e.target.checked})}
                        className="accent-blue-600 mt-0.5 shrink-0"
                        required
                      />
                      <span>I consent to Navigalex contacting me confidentially to review my assessment request under standard DPDP privacy safeguards.</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    Submit Confidential Assessment Request
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Professional & Regulatory Boundaries Section in Layman Words */}
      <section className="bg-slate-900 text-slate-300 py-16 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-400 shrink-0" />
            <h3 className="text-xl font-bold text-white">Professional & Regulatory Boundaries</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
            <strong>Clear legal clarity:</strong> Navigalex provides business, financial, governance, and risk advisory services. Navigalex does <em>not</em> provide unregistered securities tips, court appearance/litigation without enrolled advocates, statutory audit certificates, or formal court-appointed insolvency administration. Where statutory certifications are mandatory, we work in coordination with registered Investment Advisers (RIAs), practicing advocates, registered Insolvency Professionals, and statutory auditors. Data is handled according to applicable privacy requirements and the published privacy terms.
          </p>
        </div>
      </section>

      {/* Footer with Working Commercial Grade Links */}
      <footer className="bg-[#0b1329] text-slate-300 py-16 px-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white">NAVIGALEX</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Navigalex Advisory: We protect Indian business owners from hidden financial, legal, and bank-loan risks. Real senior advisors powered by smart AI.
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-white mb-4">Advisory Desks</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <button 
                  onClick={() => { setSelectedDeskModal(ADVISORY_DESKS[0]); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  ControlCFOâ„¢ Sprint
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedDeskModal(ADVISORY_DESKS[2]); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contract-to-Cash Desk
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedDeskModal(ADVISORY_DESKS[5]); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  LenderReady Credit Desk
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedDeskModal(ADVISORY_DESKS[3]); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  TradeShield LC/BG
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-white mb-4">Live Assessments & Guides</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <button 
                  onClick={() => { setActiveTab('live-tools'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contract Risk Scanner (Live)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('live-tools'); window.scrollTo({ top: 600, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Bank DSCR Scanner (Live)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('why-pick-us'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Why Pick These Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('industries'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Sector Playbooks
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-white mb-4">Legal & Privacy</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <button 
                  onClick={() => setShowPrivacyModal(true)} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Data Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setShowGuardrailsModal(true)} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Regulatory Guardrails
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openAssessmentForm('Direct Consultation with Practice Lead')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contact Practice Lead
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500">
          <p>Â© {new Date().getFullYear()} Navigalex Advisory & Governance Intelligence. All rights reserved.</p>
          <p className="text-[11px] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span>â€¢ â€¢ â€¢ </span>
          </p>
        </div>
      </footer>

      {/* MODAL 1: DETAILED DESK SCOPE & DELIVERY MODAL */}
      {selectedDeskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn" role="presentation">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8" role="dialog" aria-modal="true">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-[10px] font-bold text-blue-700 uppercase mb-1">
                  {selectedDeskModal.badge}
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{selectedDeskModal.title}</h3>
                <p className="text-xs font-semibold text-blue-600">{selectedDeskModal.tagline}</p>
              </div>

            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Overview</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{selectedDeskModal.summary}</p>
            </div>

            {/* Deliverables Checklist */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" /> Tangible Deliverables You Receive:
              </h4>
              <div className="space-y-1.5">
                {selectedDeskModal.deliverables.map((d: string, i: number) => (
                  <div key={i} className="text-xs text-slate-800 flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Schedule */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" /> Step-by-Step Delivery Schedule ({selectedDeskModal.timeframe}):
              </h4>
              <div className="space-y-2">
                {selectedDeskModal.deliverySchedule.map((s: string, i: number) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Inputs Needed */}
            <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-700 space-y-1">
              <strong className="text-slate-900 block font-semibold">Inputs Needed From You:</strong>
              <span>{selectedDeskModal.clientInputsNeeded}</span>
            </div>

            {/* Quality Gate Guarantee */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
              <Shield className="w-5 h-5 text-blue-600 shrink-0" />
              <span><strong>Human Quality Gate:</strong> {selectedDeskModal.humanSignoff}. The engagement scope states who performs professional review; AI is used only to accelerate structured analysis.</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div>
                <span className="text-xs text-slate-500 block">Indicative Scope Fee</span>
                <span className="text-lg font-bold text-slate-900">{selectedDeskModal.price}</span>
              </div>
              <div className="flex items-center justify-end w-full sm:w-auto">
                <ModalCloseButton onClick={() => setSelectedDeskModal(null)} label="Close service details" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DATA PRIVACY POLICY (DPDP COMPLIANCE) */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Commercial Data Privacy Policy</h3>
                  <p className="text-xs text-slate-500">Digital Personal Data Protection Act (DPDP) & Confidentiality Standards</p>
                </div>
              </div>

            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
                <strong className="text-blue-900 block font-bold mb-1">Data Handling</strong>
                <span>Use the site only to submit information you are authorised to share. Document handling and retention are governed by the service arrangement and applicable privacy requirements.</span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">1. Information Collection & Usage</h4>
                <p>Information submitted through the site is used to process the requested assessment or inquiry, operate the service, and maintain required records. Refer to the published privacy terms for applicable disclosures.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">2. Non-Disclosure & Legal Protection</h4>
                <p>Sensitive commercial information should be shared only after the parties have agreed the engagement terms and any required confidentiality arrangements.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">3. Data Retention & Secure Shredding</h4>
                <p>Retention periods depend on the applicable engagement terms, legal requirements and operational records policy.</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <ModalCloseButton onClick={() => setShowPrivacyModal(false)} label="Close privacy policy" />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REGULATORY GUARDRAILS & BOUNDARIES */}
      {showGuardrailsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Professional & Regulatory Boundaries</h3>
                  <p className="text-xs text-slate-500">Statutory Compliance Framework & Qualified Professional Coordination</p>
                </div>
              </div>

            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <strong>Statutory Notice:</strong> Navigalex provides management advisory, risk intelligence, and financial oversight. To protect clients and maintain clear professional boundaries, our operations follow defined engagement limits.
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-900 block font-bold">1. Legal Representation:</strong>
                  <span>Navigalex does not practice before courts or tribunals without duly enrolled Advocates. Formal court filings and litigation representation are executed in coordination with designated Advocates of the Bar Council.</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-900 block font-bold">2. Statutory Audit & Tax Attestation:</strong>
                  <span>Navigalex does not issue statutory audit reports or tax audit certificates under the Companies Act or Income Tax Act. These remain the sole purview of independent Chartered Accountant firms.</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-900 block font-bold">3. Insolvency & Securities Advice:</strong>
                  <span>Navigalex does not act as court-appointed Insolvency Resolution Professionals (IRPs) or registered Investment Advisers (RIAs). Where needed, we coordinate directly with licensed IPs and SEBI-registered RIAs.</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <ModalCloseButton onClick={() => setShowGuardrailsModal(false)} label="Close regulatory guardrails" />
            </div>
          </div>
        </div>
      )}

      {/* Spaceship.com Style Quick Scroll-to-Top Floating Pill */}
      {scrollProgress > 12 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 bg-white/95 hover:bg-white text-slate-700 hover:text-blue-600 px-3.5 py-2 rounded-full border border-blue-200/80 shadow-lg backdrop-blur-md text-xs font-bold flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-blue-500/15 cursor-pointer animate-fadeIn"
          title="Click to scroll to top"
        >
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
          <span>{Math.round(scrollProgress)}%</span>
          <ChevronRight className="w-3.5 h-3.5 -rotate-90 text-blue-600" />
        </button>
      )}

      {/* Live AI Advisory Bot */}
      <LiveAdvisoryBot 
        onOpenAssessment={openAssessmentForm} 
        onNavigateTab={(tab) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
      />
    </div>
  );
}



