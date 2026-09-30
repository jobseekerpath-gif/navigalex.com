import React, { useState, useEffect } from 'react';
import LiveAdvisoryBot from './components/LiveAdvisoryBot';
import AdminPanel from './components/AdminPanel';
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
    title: "1. LenderReady Credit & Recovery Office",
    tagline: "Bank Sanction Acceleration & Debt Restructuring",
    badge: "Initial Launch Priority",
    summary: "Prepares bank-grade financial files and debt service models so banks approve loans and CC limit enhancements 3x faster with lower interest.",
    problem: "Banks reject loan proposals or slash Cash Credit limits because DSCR is weak, GST returns don't match bank turnover, or drawing power calculations have errors.",
    deliverables: [
      "Bank-Grade Borrower Information Memorandum & CMA Data Pack",
      "Dynamic DSCR & Monthly Cash-Flow Coverage Model",
      "Loan Covenant Tracker to Prevent Penal Interest Sanctions",
      "One-Time Settlement (OTS) & Debt Restructuring Proposal (if stressed)",
      "Professional Representation During Bank Credit Committee Discussions"
    ],
    deliverySchedule: [
      "Week 1: Reconciliation of Last 24 Months Bank Statements, GST & ITR",
      "Week 2: Construction of Certified CMA Data & DSCR Model",
      "Week 3: Final Borrower Data Room Assembly & Bank Meeting Briefing"
    ],
    clientInputsNeeded: "Last 2 years Audited Balance Sheets, provisional P&L, 12 months Bank Statements, GST returns.",
    timeframe: "14â€“21 Days",
    humanSignoff: "Former Senior Credit Officer & Chartered Accountant",
    price: "â‚¹75,000â€“â‚¹3 Lakh + lawful success fee"
  },
    {
    id: "controlcfo-sprint",
    title: "2. ControlCFO 90-Day Readiness Sprint",
    tagline: "Flagship Outsourced Finance, Risk & Governance Command Centre",
    badge: "Initial Launch Priority",
    summary: "Like having an experienced, senior CFO and risk director running your financial governance on a part-time sprintâ€”without paying â‚¹35 Lakh/year full-time salary.",
    problem: "Sales are growing, but cash is constantly tight, debtors are delayed past 75 days, and bank limit renewal is stalled.",
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
    humanSignoff: "Senior CA & Corporate Advocate Dual Review",
    price: "â‚¹1.5â€“4 Lakh fixed"
  },
    {
    id: "contract-to-cash",
    title: "3. Contract-to-Cash Risk Desk",
    tagline: "Stop Unfair Contract Clauses & Accelerate Stuck Payments",
    badge: "Initial Launch Priority",
    summary: "An active risk desk that screens every customer agreement before you sign, and installs aggressive recovery workflows for delayed receivables.",
    problem: "Big clients insert unilateral termination, uncapped liability, and 90-day payment delays, leaving you with zero legal leverage when payments freeze.",
    deliverables: [
      "AI-Assisted Clause-by-Clause Contract Risk Scorecard",
      "Ready-to-Send Redline Amendments with MSME Samadhaan Protections",
      "Debtor Realization Tracking & Statutory Escalation Notices",
      "Contract Renewal & Milestone Payment Alert Dashboard",
      "Standardized Customer Master Services Agreement (MSA) Template"
    ],
    deliverySchedule: [
      "Week 1: Ingestion of Top 10 Existing Client Contracts & Debtor Ledger",
      "Week 2: Risk Scoring & Drafting Standard Protective Fallback Clauses",
      "Ongoing: 24-48 Hour Turnaround on New Client Contract Screening"
    ],
    clientInputsNeeded: "Top 5-10 Customer Master Services Agreements (MSAs), unpaid invoice list >60 days.",
    timeframe: "14-Day Setup + Monthly Retainer",
    humanSignoff: "Corporate Contracts Advocate",
    price: "â‚¹75,000â€“â‚¹3 Lakh setup + â‚¹25,000â€“â‚¹1 Lakh/month"
  },
    {
    id: "internal-audit",
    title: "4. AI-Assisted Internal Audit Factory",
    tagline: "Continuous Risk & Internal Financial Control Auditing",
    badge: "Continuous Controls",
    summary: "Continuous, risk-based internal control testing that catches billing errors, inventory leakages, and unauthorized expenditures every quarter.",
    problem: "Statutory annual audits only check past year's accounts for tax compliance, failing to catch real-time operational leakages and employee fraud.",
    deliverables: [
      "Risk-Based Internal Audit Charter & Annual Test Plan",
      "AI-Automated 100% Transaction Testing (Procurement, Payroll, Sales)",
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
    humanSignoff: "Internal Audit Partner (CA / CIA)",
    price: "â‚¹2â€“10 Lakh per cycle"
  }
],
    {
    id: "board-box",
    title: "5. Board-in-a-Box Governance OS",
    tagline: "Statutory Director Protection & Board Cadence",
    badge: "Turnkey System",
    summary: "Complete corporate governance system that protects promoter-directors from personal statutory liability and prepares the company for institutional funding or M&A.",
    problem: "Missing board minutes, undocumented shareholder agreements, ambiguous director authorities, and compliance lapses exposing founders to personal fines.",
    deliverables: [
      "Annual Board & Committee Calendar with Statutory Timelines",
      "Institutional Board Agenda, Resolutions & Minutes Packs",
      "Delegation of Authority (DoA) Financial Approval Matrix",
      "Director Conflicts of Interest & Related-Party Register",
      "Encrypted Evidence Vault for Audit & Due Diligence"
    ],
    deliverySchedule: [
      "Week 1-2: Corporate Secretarial & Governance Gap Analysis",
      "Week 3-4: Drafting Customized Delegation Matrix & Meeting Templates",
      "Month 2+: Monthly / Quarterly Board Pack Orchestration & Minutes Management"
    ],
    clientInputsNeeded: "Certificate of Incorporation, MOA/AOA, past 12 months Board Minutes, Statutory Registers.",
    timeframe: "4-Week Setup + Monthly Retainer",
    humanSignoff: "Company Secretary (CS) & Corporate Counsel",
    price: "â‚¹2â€“6 Lakh setup + â‚¹50,000â€“â‚¹1.5 Lakh/month"
  },
    {
    id: "regtech",
    title: "6. RegTech Journey Lab",
    tagline: "Compliance Architecture for NBFCs, Fintechs & Tech Vendors",
    badge: "Institutional RegTech",
    summary: "Turn statutory compliance into an automated, audit-proof workflow for co-lending, digital onboarding, DPDP privacy, and RBI outsourcing rules.",
    problem: "Fintechs and NBFC vendors getting penalized or rejected by enterprise partners due to loose KYC controls, missing data logs, or RBI audit deficiencies.",
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
    humanSignoff: "Fintech Regulatory Lawyer & Senior Systems Auditor",
    price: "â‚¹5â€“25 Lakh per project"
  },
    {
    id: "fraudsignal",
    title: "7. FraudSignal Investigation Cell",
    tagline: "Forensic Accounting & Internal Leakage Detection",
    badge: "Forensic & Whistleblower",
    summary: "Discreet forensic audits to detect vendor kickbacks, ghost billing, employee theft, and fund diversionâ€”backed by court-ready evidence.",
    problem: "Unexplained drops in gross profit margins, inventory mismatches, anonymous whistleblower tips, or suspected partner embezzlement.",
    deliverables: [
      "Forensic Transaction Analytics & Vendor Duplicate Billing Scan",
      "Whistleblower Complaint Intake & Independent Fact-Finding Brief",
      "Digital Audit Trail & Electronic Evidence Preservation Pack",
      "Asset Tracing Brief & Financial Discrepancy Reconciliation",
      "Counsel-Ready Investigation Report for Board or Police Filing"
    ],
    deliverySchedule: [
      "Week 1: Covert Data Extraction (ERP logs, Bank statements, Vendor masters)",
      "Week 2: Forensic Analytics, Pattern Matching & Interview Planning",
      "Week 3-4: Evidence Corroboration & Comprehensive Counsel-Ready Report"
    ],
    clientInputsNeeded: "Vendor ledgers, ERP audit logs, bank statements, whistleblower details (strictly confidential).",
    timeframe: "2â€“4 Weeks per Investigation",
    humanSignoff: "Certified Fraud Examiner (CFE) & Senior Forensic Auditor",
    price: "â‚¹3â€“15 Lakh per investigation"
  },
    {
    id: "tradeshield",
    title: "8. TradeShield LC/BG Desk",
    tagline: "Pre-Shipment LC Screening & Bank Guarantee Protection",
    badge: "Export & Tender Desk",
    summary: "Specialist documentary trade finance review to prevent foreign bank discrepancy rejections, frozen containers, and invoked bank guarantees.",
    problem: "Over 60% of export Letters of Credit get rejected due to minor paperwork mismatches under UCP 600 rules, delaying payment by months and incurring heavy demurrage.",
    deliverables: [
      "Pre-Issuance Letter of Credit (LC) Clause Audit",
      "Zero-Defect Export Document Checklist (BL, Certificate of Origin, Invoice)",
      "Bank Guarantee (BG) Wording Review to Prevent Unfair Encashment",
      "FEMA & RBI Trade Compliance Validation Report",
      "Direct Liaison Support with Issuing & Advising Banks"
    ],
    deliverySchedule: [
      "24-48 Hours: Rapid turnaround per LC or Bank Guarantee transaction",
      "Continuous: Monthly retainer for active exporters and EPC contractors"
    ],
    clientInputsNeeded: "Draft LC / Sanction letter, Proforma Invoice, Bill of Lading draft, Bank Guarantee text.",
    timeframe: "24â€“48 Hours per Transaction / Monthly Retainer",
    humanSignoff: "Trade Finance & International Banking Specialist",
    price: "â‚¹50,000â€“â‚¹2 Lakh per transaction/retainer"
  },
    {
    id: "family-wealth",
    title: "9. Family Wealth Governance Office",
    tagline: "Multi-Entity Asset Consolidation & Succession Peace",
    badge: "Promoter & Family Office",
    summary: "Structures family businesses across siblings, holding entities, and trustsâ€”preventing family disputes and preserving wealth across generations.",
    problem: "Messy cross-holdings between family members, informal loans, lack of a clear succession plan, and vulnerability to future family litigation.",
    deliverables: [
      "Consolidated Family Balance Sheet & Cross-Entity Asset Map",
      "Legally Binding Family Constitution & Decision Charter",
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
    humanSignoff: "Senior Estate Planning Advocate & Wealth Governance Advisor",
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


const isResolvedPlaceholder = (value?: string) => Boolean(value && !/^\\{\\{[^}]+\\}\\}$/.test(value));

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


export default function App() {
  // Check if URL is /admin or ?admin=true
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
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
      if (p === '/family-office' || p.startsWith('/family-office')) {
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
  const [docResult, setDocResult] = useState<any>(null);

  // Live CIBIL / Banking Health Calculator State
  const [cibilForm, setCibilForm] = useState({
    turnover: '15', // in Cr
    monthlyEmi: '4.5', // in Lakhs
    ccLimit: '2.5', // in Cr
    overdueDebtors: '45' // in Lakhs
  });
  const [isScanningCibil, setIsScanningCibil] = useState(false);
  const [cibilResult, setCibilResult] = useState<any>(null);

  // Live Business Health Diagnostic State
  const [diagnosticIndustry, setDiagnosticIndustry] = useState('Manufacturing & Engineering');
  const [diagnosticRevenue, setDiagnosticRevenue] = useState('â‚¹5 Cr - â‚¹25 Cr');
  const [diagnosticFile, setDiagnosticFile] = useState<File | null>(null);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);

  // Interactive 5-point slider state
  const [diagnosticScores, setDiagnosticScores] = useState({
    cash: 3,
    contract: 2,
    funding: 3,
    fraud: 2,
    governance: 3
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

  // Sample contract loader for instant testing
  const loadSampleContract = (type: string) => {
    if (type === 'indemnity') {
      setDocText(
        `Clause 14. INDEMNIFICATION AND LIABILITY:
The Vendor shall defend, indemnify and hold harmless the Client, its affiliates, directors and customers from and against any and all claims, losses, damages, liabilities, and expenses (including attorney fees) arising from any performance delay, defect, or alleged breach of this agreement. The Vendor's liability under this section shall be uncapped and perpetual. The Client reserves the right to terminate this agreement immediately at convenience without penalty, while any dispute shall be subject to the exclusive jurisdiction of the Courts in Singapore.`
      );
    } else if (type === 'msme') {
      setDocText(
        `Clause 7. PAYMENT TERMS AND PENALTIES:
Payment shall be released within 90 days after delivery and final acceptance. In case of any dispatch delay beyond 3 days, a penalty of 2% per week of the entire purchase order shall be deducted from pending invoices. In the event of dispute, the Vendor agrees not to approach any MSME arbitration council and agrees that the Client's internal arbitrator decision is final.`
      );
    }
  };

  const handleAnalyzeDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docText.trim() && !docFile) return;
    setIsAnalyzingDoc(true);
    try {
      const res = await fetch('/api/documents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          documentText: docText || `Uploaded file analysis: ${docFile?.name}`,
          fileName: docFile?.name || "Contract_Excerpt.txt",
          visitorId
        })
      });
      const data = await res.json();
      if (data.success) {
        setDocResult(data.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingDoc(false);
    }
  };

  const handleScanCibil = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanningCibil(true);
    try {
      const res = await fetch('/api/cibil-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cibilForm,
          visitorId
        })
      });
      const data = await res.json();
      if (data.success) {
        setCibilResult(data.report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanningCibil(false);
    }
  };

  const handleRunDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunningDiagnostic(true);
    try {
      const res = await fetch('/api/assessments/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: diagnosticIndustry,
          revenue: diagnosticRevenue,
          serviceType: 'Business Health Check',
          fileName: diagnosticFile?.name,
          visitorId
        })
      });
      const data = await res.json();
      if (data.success) {
        setDiagnosticResult(data.assessment);
      }
    } catch (err) {
      console.error(err);
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

      {/* Top Banner with Preserved Tagline */}
      <div className="bg-slate-900 border-b border-slate-800 py-2.5 px-4 text-center text-xs text-slate-300 tracking-wide flex items-center justify-center gap-2 relative z-10">
        <Shield className="w-4 h-4 text-blue-400 shrink-0" />
        <span>
          <strong>Navigalex Advisory:</strong> We protect Indian business owners from hidden financial, legal, and bank-loan risks. Real senior advisors powered by smart AI tools.
        </span>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">NAVIGALEX</span>
              <span className="block text-[9px] text-blue-600 font-extrabold tracking-widest uppercase">Executive Advisory</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`hover:text-blue-600 transition-colors ${activeTab === 'home' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`}>Home</button>
            <button onClick={() => { setActiveTab('live-tools'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${activeTab === 'live-tools' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`}>
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Live AI Scanners</span>
            </button>
            <button onClick={() => { setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`hover:text-blue-600 transition-colors ${activeTab === 'services' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`}>Our 9 Services</button>
            <button onClick={() => { setActiveTab('why-pick-us'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`hover:text-blue-600 transition-colors ${activeTab === 'why-pick-us' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`}>Why Pick These Products</button>
            <button onClick={() => { setActiveTab('industries'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`hover:text-blue-600 transition-colors ${activeTab === 'industries' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`}>Industries</button>
            <button onClick={() => { setActiveTab('how-it-works'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`hover:text-blue-600 transition-colors ${activeTab === 'how-it-works' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`}>How It Works</button>
            <button onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`hover:text-blue-600 transition-colors ${activeTab === 'about' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`}>About</button>
            <button onClick={() => { setActiveTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`hover:text-blue-600 transition-colors ${activeTab === 'contact' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`}>Contact</button>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => openAssessmentForm()}
              className="hidden sm:inline-flex px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              Request Assessment
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="lg:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl">
            <button onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block w-full text-left text-sm font-medium py-2 text-slate-700"><span aria-label="Close" className="text-xl leading-none">×</span>Home</button>
            <button onClick={() => { setActiveTab('live-tools'); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block w-full text-left text-sm font-medium py-2 text-blue-600 font-bold"><span aria-label="Close" className="text-xl leading-none">×</span>Live AI Scanners</button>
            <button onClick={() => { setActiveTab('services'); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block w-full text-left text-sm font-medium py-2 text-slate-700"><span aria-label="Close" className="text-xl leading-none">×</span>Our 9 Services</button>
            <button onClick={() => { setActiveTab('why-pick-us'); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block w-full text-left text-sm font-medium py-2 text-slate-700"><span aria-label="Close" className="text-xl leading-none">×</span>Why Pick These Products</button>
            <button onClick={() => { setActiveTab('industries'); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block w-full text-left text-sm font-medium py-2 text-slate-700"><span aria-label="Close" className="text-xl leading-none">×</span>Industries</button>
            <button onClick={() => { setActiveTab('how-it-works'); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block w-full text-left text-sm font-medium py-2 text-slate-700"><span aria-label="Close" className="text-xl leading-none">×</span>How It Works</button>
            <button onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block w-full text-left text-sm font-medium py-2 text-slate-700"><span aria-label="Close" className="text-xl leading-none">×</span>About</button>
            <button onClick={() => { setActiveTab('contact'); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block w-full text-left text-sm font-medium py-2 text-slate-700"><span aria-label="Close" className="text-xl leading-none">×</span>Contact</button>
            <div className="pt-4 border-t border-slate-200">
              <button onClick={() => { openAssessmentForm(); setMobileMenuOpen(false); }} className="w-full py-3 bg-blue-600 text-white font-semibold text-xs rounded-lg shadow-md"><span aria-label="Close" className="text-xl leading-none">×</span>
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
                  We help Indian business owners, MSMEs, and directors spot the hidden cash leakages, bad contract terms, and loan rejection traps that accountants, lawyers, and software missâ€”before they cost you money.
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
                    <span>Test Free Live Scanners</span>
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
                    Try scanner free <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">LIVE 2</span>
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Bank Loan & CIBIL Check</h3>
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
                  <p className="text-xs text-slate-600 mt-1 mb-3">Your part-time senior CFO and risk command centre without paying â‚¹35 Lakh/year full-time salary.</p>
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
                  Find the risks your accountant, lawyer, and software only partially see
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
                <h3 className="text-2xl sm:text-3xl font-bold text-white">One Unified Command System For Your Money & Safety</h3>
                <p className="text-sm text-slate-200 max-w-2xl mx-auto leading-relaxed">
                  We connect every risk to proof, an action item, a responsible owner, and a firm deadline. No assumptions, no academic theoriesâ€”just clear steps to protect your profits.
                </p>
                <div className="pt-2">
                  <button onClick={() => { setActiveTab('live-tools'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer">
                    Experience Our Live Diagnostic Tools
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
                  { key: 'funding', label: '3. Bank Loan & CC Limits', desc: 'Is your bank CC limit frequently 90%+ utilized with tight interest coverage? (1 = healthy cushion, 5 = near default).' },
                  { key: 'fraud', label: '4. Internal Billing & Inventory Checks', desc: 'Can employees or partners release money or dispatch inventory without dual approvals? (1 = strict controls, 5 = blind trust).' },
                  { key: 'governance', label: '5. Board Minutes & Director Protection', desc: 'Are company resolutions and director meeting records properly drafted and signed? (1 = 100% compliant, 5 = missing records).' }
                ].map((dim) => (
                  <div key={dim.key} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-900">{dim.label}</span>
                      <span className="text-xs font-bold text-blue-600">Risk: {diagnosticScores[dim.key as keyof typeof diagnosticScores]} / 5</span>
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
                  <button onClick={() => openAssessmentForm('Complete 5-Part Risk Assessment')} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-xl transition-all shadow-md cursor-pointer">
                    Request Full Confidential Audit
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* LIVE AI TOOLS TAB */}
        {activeTab === 'live-tools' && (
          <div className="py-16 px-6 max-w-7xl mx-auto space-y-20">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">COMMERCIAL-GRADE WORKING ENGINES</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">Live AI Financial & Legal Scanners</h2>
              <p className="text-slate-600">Test real contracts, calculate bank loan readiness, and generate instant business diagnostic reports right now.</p>
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
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => loadSampleContract('indemnity')}
                    className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 font-medium cursor-pointer"
                  >
                    Load Sample Trap #1
                  </button>
                  <button 
                    type="button" 
                    onClick={() => loadSampleContract('msme')}
                    className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 font-medium cursor-pointer"
                  >
                    Load Sample Trap #2
                  </button>
                </div>
              </div>

              {/* WHY PICK THIS PRODUCT GUIDE */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-blue-900 uppercase">ðŸ’¡ Why pick this product?</span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Who should use this:</strong> Any founder, director, or contractor signing agreements worth over â‚¹5 Lakhs.<br />
                  <strong>Disaster it prevents:</strong> Prevents signing "unlimited liability" clauses where a client can sue you for 10x your billing, or freeze payments for months.<br />
                  <strong>Expected ROI:</strong> Saves â‚¹5 Lakhs - â‚¹50 Lakhs in future litigation and avoids getting locked in unfavorable foreign arbitration.
                </p>
              </div>

              <form onSubmit={handleAnalyzeDocument} className="space-y-6">
                {/* File Upload Zone */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Option A: Upload Agreement Document (PDF, DOCX, TXT, Image)</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50">
                    <input 
                      type="file" 
                      onChange={e => setDocFile(e.target.files?.[0] || null)}
                      className="hidden" 
                      id="contract-file-upload-live"
                    />
                    <label htmlFor="contract-file-upload-live" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-blue-600" />
                      <span className="text-sm font-bold text-slate-800">
                        {docFile ? docFile.name : "Click to browse or drop agreement file here"}
                      </span>
                      <span className="text-xs text-slate-500">Supports PDF, Word, TXT agreements up to 50MB</span>
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
              </form>

              {/* Live Contract Scan Results */}
              {docResult && (
                <div className="mt-8 p-6 bg-slate-50 border border-slate-300 rounded-xl space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">Contract Scan Diagnostic</h4>
                      <p className="text-xs text-slate-500">File / Clause: {docResult.fileName}</p>
                    </div>
                    <span className="px-3.5 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold">
                      Risk Score: {docResult.riskScore} â€” {docResult.riskLevel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{docResult.summary}</p>

                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Danger Clauses Detected (What can hurt you)
                    </h5>
                    <div className="space-y-2">
                      {docResult.clauses?.map((c: string, idx: number) => (
                        <div key={idx} className="p-3 bg-white border border-rose-200 rounded-lg text-xs text-slate-800 shadow-sm flex items-start gap-2">
                          <span className="text-rose-600 font-bold shrink-0">âš ï¸</span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Recommended Safe Counter-Clauses (What to ask for)
                    </h5>
                    <div className="space-y-2">
                      {docResult.recommendations?.map((r: string, idx: number) => (
                        <div key={idx} className="p-3 bg-white border border-emerald-200 rounded-lg text-xs text-slate-800 shadow-sm flex items-start gap-2">
                          <span className="text-emerald-600 font-bold shrink-0">âœ“</span>
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* LIVE 2: CIBIL & Bank Loan Readiness Calculator */}
            <section className="navigalex-card rounded-2xl p-8 sm:p-10 shadow-xl border-t-4 border-emerald-600 space-y-8">
              <div className="border-b border-slate-200 pb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
                  <Landmark className="w-3.5 h-3.5" /> LIVE BANKING ENGINE
                </div>
                <h3 className="text-2xl font-bold text-slate-900">2. Bank Loan & CIBIL Readiness Scanner</h3>
                <p className="text-xs text-slate-600 mt-1">Check your Debt Service Coverage Ratio (DSCR), maximum working capital eligibility, and the exact reasons banks reject loan files.</p>
              </div>

              {/* WHY PICK THIS PRODUCT GUIDE */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-emerald-900 uppercase">ðŸ’¡ Why pick this product?</span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Who should use this:</strong> Any business owner applying for fresh bank loans, renewing CC/OD limits, or facing delayed bank credit sanction.<br />
                  <strong>Disaster it prevents:</strong> Prevents banks from rejecting your loan after 3 months of waiting or slapping 2% penalty interest due to DSCR dip.<br />
                  <strong>Expected ROI:</strong> Helps negotiate 50â€“75 bps lower interest rates and speeds up loan disbursal from months to weeks.
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

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={isScanningCibil}
                    className="w-full py-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    {isScanningCibil ? "Calculating Banking Coverage..." : "Run Free Bank Readiness Diagnostic"}
                  </button>
                </div>
              </form>

              {/* CIBIL Result Output */}
              {cibilResult && (
                <div className="p-6 bg-slate-50 border border-slate-300 rounded-xl space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500 block uppercase font-bold">Banking Health Rating</span>
                      <span className="text-lg font-bold text-emerald-700 mt-1 block">{cibilResult.healthScore}</span>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500 block uppercase font-bold">Your Calculated DSCR</span>
                      <span className="text-lg font-bold text-blue-700 mt-1 block">{cibilResult.calculatedDscr}</span>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500 block uppercase font-bold">Estimated Eligible CC Limit</span>
                      <span className="text-lg font-bold text-indigo-700 mt-1 block">{cibilResult.maxEligibleLimit}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h5 className="text-xs font-bold text-slate-700 uppercase mb-2">Bank Red Flags to Fix Before Applying:</h5>
                    <div className="space-y-1.5">
                      {cibilResult.riskPoints?.map((p: string, i: number) => (
                        <div key={i} className="text-xs text-slate-700 p-2.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
                    <strong>Navigalex Advisory Note:</strong> {cibilResult.advice}
                  </div>
                </div>
              )}
            </section>

            {/* LIVE 3: Comprehensive Business Health & P&L Diagnostic */}
            <section className="navigalex-card rounded-2xl p-8 sm:p-10 shadow-xl border-t-4 border-indigo-600 space-y-8">
              <div className="border-b border-slate-200 pb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
                  <Activity className="w-3.5 h-3.5" /> LIVE DIAGNOSTIC ENGINE
                </div>
                <h3 className="text-2xl font-bold text-slate-900">3. Business Health & File Upload Scanner</h3>
                <p className="text-xs text-slate-600 mt-1">Upload your P&L, balance sheet, or select your industry metrics to generate an instant executive health diagnostic.</p>
              </div>

              {/* WHY PICK THIS PRODUCT GUIDE */}
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-indigo-900 uppercase">ðŸ’¡ Why pick this product?</span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Who should use this:</strong> Promoters wanting a comprehensive 360-degree scan of their business health across contracts, banking, cash, and internal controls.<br />
                  <strong>Disaster it prevents:</strong> Discovers money leakages, uncollected debts, and compliance gaps before external auditors or tax authorities flag them.<br />
                  <strong>Expected ROI:</strong> Generates a prioritized 90-day action plan that helps improve net operating cash flow by 15â€“25%.
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
                      <option>&lt; â‚¹1 Cr (Early Stage)</option>
                      <option>â‚¹1 Cr - â‚¹5 Cr</option>
                      <option>â‚¹5 Cr - â‚¹25 Cr (MSME Growth)</option>
                      <option>â‚¹25 Cr - â‚¹100 Cr (Mid-Corporate)</option>
                      <option>â‚¹100 Cr+ (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Upload P&L / Statement / Financial Summary (Optional)</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-indigo-500 transition-colors bg-slate-50">
                    <input 
                      type="file" 
                      onChange={e => setDiagnosticFile(e.target.files?.[0] || null)}
                      className="hidden" 
                      id="diagnostic-file-upload"
                    />
                    <label htmlFor="diagnostic-file-upload" className="cursor-pointer flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-700">
                        {diagnosticFile ? diagnosticFile.name : "Click to attach PDF, Excel or CSV file"}
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isRunningDiagnostic}
                  className="w-full py-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  {isRunningDiagnostic ? "Compiling Executive Health Scan..." : "Generate Business Health Diagnostic Report"}
                </button>
              </form>

              {diagnosticResult && (
                <div className="p-6 bg-slate-50 border border-slate-300 rounded-xl space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <h4 className="font-bold text-slate-900">Diagnostic Report for {diagnosticResult.industry}</h4>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">Score: {diagnosticResult.score}/100</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{diagnosticResult.report.executiveSummary}</p>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-rose-700 uppercase">Top 3 Business Risk Blindspots:</h5>
                    {diagnosticResult.report.keyFindings?.map((f: string, i: number) => (
                      <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 flex items-start gap-2">
                        <span className="text-rose-600 font-bold shrink-0">â€¢</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-emerald-700 uppercase">Immediate Action Steps:</h5>
                    {diagnosticResult.report.actionSteps?.map((a: string, i: number) => (
                      <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 flex items-start gap-2">
                        <span className="text-emerald-600 font-bold shrink-0">âœ“</span>
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
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
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">Why Business Owners Choose Navigalex</h2>
              <p className="text-slate-600">Here is the plain, straightforward reason why Indian promoters and directors engage our desks instead of traditional advisors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "1. ControlCFOâ„¢ 30-Day Sprint",
                  idealFor: "Owner-managed MSMEs (â‚¹5 Cr - â‚¹50 Cr turnover) without a full-time senior CFO.",
                  problemSolved: "Your accountant only tells you what taxes to pay. No one is managing your future cash runway, debtor recovery, or bank limits.",
                  concreteRoi: "Saves â‚¹25+ Lakhs annually compared to hiring a full-time C-suite executive while giving you institutional board-grade control.",
                  price: "â‚¹1.5â€“4 Lakh fixed",
                  deskIndex: 0
                },
                {
                  title: "2. Contract-to-Cash Risk Desk",
                  idealFor: "Contractors, manufacturers, and agencies signing large client agreements.",
                  problemSolved: "Big clients insert unilateral termination, uncapped indemnity, and 90-day payment delays that choke your business.",
                  concreteRoi: "Closes payment loopholes before signing. Recovers stuck receivables up to 40% faster with formal MSME Samadhaan protections.",
                  price: "â‚¹75,000â€“â‚¹3 Lakh setup",
                  deskIndex: 2
                },
                {
                  title: "3. LenderReady Credit Office",
                  idealFor: "Companies applying for bank loans, CC limit enhancements, or facing high loan interest.",
                  problemSolved: "Banks take 3-6 months and often reject loans because balance sheet ratios (DSCR, drawing power) look weak or inconsistent.",
                  concreteRoi: "Prepares bank-compliant data rooms. Helps negotiate 50-75 bps lower interest rates, saving lakhs in interest every year.",
                  price: "â‚¹75,000â€“â‚¹3 Lakh + success fee",
                  deskIndex: 5
                },
                {
                  title: "4. TradeShield LC/BG Desk",
                  idealFor: "Exporters, importers, and government tender contractors.",
                  problemSolved: "Over 60% of export Letters of Credit suffer discrepancy rejections, trapping container shipments at foreign ports.",
                  concreteRoi: "Zero-defect document review prevents bank rejection, saves demurrage charges, and guarantees prompt payment realization.",
                  price: "â‚¹50,000â€“â‚¹2 Lakh per transaction",
                  deskIndex: 3
                },
                {
                  title: "5. FraudSignal Investigation Cell",
                  idealFor: "Business owners suspecting internal theft, kickbacks, or fake vendor billing.",
                  problemSolved: "Internal employees or partners siphoning company funds through inflated procurement or unauthorized dispatches.",
                  concreteRoi: "Discreet forensic audits produce evidence-grade documentation ready for legal action or asset recovery.",
                  price: "â‚¹3â€“15 Lakh per investigation",
                  deskIndex: 4
                },
                {
                  title: "6. Family Wealth Governance",
                  idealFor: "Family-owned businesses and promoters planning succession or multi-entity management.",
                  problemSolved: "Disputes between siblings or partners, messy asset ownership, and lack of clear authority matrices.",
                  concreteRoi: "Protects family wealth across generations with a legally sound family constitution and consolidated reporting.",
                  price: "â‚¹2â€“10 Lakh setup",
                  deskIndex: 7
                }
              ].map((p, idx) => (
                <div key={idx} className="navigalex-card p-8 rounded-2xl flex flex-col justify-between space-y-6 shadow-md border-t-4 border-blue-600">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
                    <div className="space-y-2 text-xs text-slate-700">
                      <div><strong className="text-slate-900">Who picks this:</strong> {p.idealFor}</div>
                      <div><strong className="text-rose-600">The Problem Solved:</strong> {p.problemSolved}</div>
                      <div><strong className="text-emerald-700">Expected ROI:</strong> {p.concreteRoi}</div>
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
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">All 9 Specialized Advisory Desks</h2>
              <p className="text-slate-600">
                Real, commercial advisory services combining 70% AI data ingestion with 100% senior CA and Advocate review. Click any desk below to see exact deliverables and the delivery schedule.
              </p>
            </div>

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
                <p className="text-xs text-slate-300">Zero academic theories. Here is the exact 4-step delivery pipeline from NDA to verified results.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">01</div>
                  <h4 className="font-bold text-sm">30-Min Intake & Mutual NDA</h4>
                  <p className="text-xs text-slate-300">We sign a strict 2-way non-disclosure agreement and identify your primary financial or legal pain point.</p>
                </div>

                <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">02</div>
                  <h4 className="font-bold text-sm">Secure Data Room Ingestion</h4>
                  <p className="text-xs text-slate-300">You drop Tally/ERP reports, bank statements, or client contracts into an encrypted, private client folder.</p>
                </div>

                <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">03</div>
                  <h4 className="font-bold text-sm">AI Speed + Senior Dual Sign-off</h4>
                  <p className="text-xs text-slate-300">AI extracts clauses and calculates DSCR in minutes. Practicing CAs and Advocates independently verify every figure.</p>
                </div>

                <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">04</div>
                  <h4 className="font-bold text-sm">Executive Pack & Action Matrix</h4>
                  <p className="text-xs text-slate-300">You receive a 1-page Risk Heatmap, ready-to-use contract redlines, bank packs, and a 90-day action plan.</p>
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
                { step: "01", title: "Intake & Discovery", desc: "We review your core business goals, contracts, and financial statements under complete non-disclosure." },
                { step: "02", title: "Risk Classification", desc: "We group risks across cash leakage, contract traps, and bank credit vulnerabilities." },
                { step: "03", title: "Evidence Collection", desc: "We reconcile bank statements, GST returns, debtor ledgers, and agreements." },
                { step: "04", title: "AI-Assisted Fast Scan", desc: "Our secure internal models scan hundreds of pages in minutes to flag dangerous clauses and discrepancies." },
                { step: "05", title: "Senior Professional Review", desc: "Experienced CFOs, senior corporate lawyers, and forensic specialists personally examine all flagged points." },
                { step: "06", title: "Executive Action Plan", desc: "You receive a 1-page board-grade brief with exact steps, priorities, and cost impact." },
                { step: "07", title: "Implementation Support", desc: "We help you re-negotiate contracts, fix bank files, or implement internal checks." },
                { step: "08", title: "Closure Proof", desc: "We verify and document that the risk has been permanently resolved." },
                { step: "09", title: "Monthly Command Monitoring", desc: "Continuous oversight through ControlCFOâ„¢ monthly check-ins." }
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
              <h3 className="text-xl font-bold text-slate-900">Our Strict Human Quality Gates</h3>
              <p className="text-xs text-slate-600">AI never makes final decisions alone. Every single recommendation is signed off by qualified human practitioners:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm"><strong>Finance:</strong> Dual review of cash models by qualified finance heads.</div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm"><strong>Legal:</strong> Review and sign-off by practicing advocates & counsel.</div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm"><strong>Forensics:</strong> Certified evidence preservation for any dispute.</div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm"><strong>Delivery:</strong> Clear client-approved action log with auditable trail.</div>
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
                  <p className="text-xs text-slate-600">Serving , and North India.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Data Privacy Mandate</h4>
                  <p className="text-xs text-slate-600">We never feed confidential client documents into open consumer AI platforms. All client data is encrypted and isolated.</p>
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
              <p className="text-slate-600">Speak directly with a senior finance or legal advisory lead. All inquiries protected under strict NDA.</p>
            </div>

            <div className="navigalex-card p-8 sm:p-10 rounded-2xl shadow-xl">
              {leadSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center mx-auto text-blue-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Inquiry Received Successfully</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thank you, {leadForm.name || 'Leader'}. A senior practice director will contact you via {leadForm.contactMethod} within 4 business hours to discuss your situation confidentially.
                  </p>
                  <button onClick={() => setLeadSubmitted(false)} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white rounded-xl cursor-pointer"><span aria-label="Close" className="text-xl leading-none">×</span>
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
            <strong>Clear legal clarity:</strong> Navigalex provides business, financial, governance, and risk advisory services. Navigalex does <em>not</em> provide unregistered securities tips, court appearance/litigation without enrolled advocates, statutory audit certificates, or formal court-appointed insolvency administration. Where statutory certifications are mandatory, we work in coordination with registered Investment Advisers (RIAs), practicing advocates, registered Insolvency Professionals, and statutory auditors. All data is handled under strict confidentiality and DPDP compliance.
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
              Navigalex Advisory: We protect Indian business owners from hidden financial, legal, and bank-loan risks. Real senior advisors powered by smart AI tools.
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
            <h4 className="font-bold uppercase tracking-wider text-white mb-4">Live Tools & Guides</h4>
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-[10px] font-bold text-blue-700 uppercase mb-1">
                  {selectedDeskModal.badge}
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{selectedDeskModal.title}</h3>
                <p className="text-xs font-semibold text-blue-600">{selectedDeskModal.tagline}</p>
              </div>
              <button 
                onClick={() => setSelectedDeskModal(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
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
              <span><strong>Human Quality Gate:</strong> {selectedDeskModal.humanSignoff}. AI accelerates discovery; experienced practitioners review and sign off every document.</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200">
              <div>
                <span className="text-xs text-slate-500 block">Indicative Scope Fee</span>
                <span className="text-lg font-bold text-slate-900">{selectedDeskModal.price}</span>
              </div>
              <button 
                onClick={() => handleSelectDeskForBooking(selectedDeskModal.title)}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Book Confidential Session on This Desk
              </button>
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
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              ><span aria-label="Close" className="text-xl leading-none">×</span>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
                <strong className="text-blue-900 block font-bold mb-1">Our Core Confidentiality Guarantee:</strong>
                <span>We never upload or train public consumer AI tools on your company’s financial records, Tally dumps, or customer contracts. All data ingestion operates in isolated enterprise-grade sandboxes with AES-256 encryption.</span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">1. Information Collection & Usage</h4>
                <p>We collect business financial data, banking sanction letters, contracts, and officer contact details exclusively to execute the requested advisory desk. No data is ever rented or shared with third parties.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">2. Non-Disclosure & Legal Protection</h4>
                <p>Prior to receiving sensitive general ledgers or customer agreements, Navigalex executes a formal mutual Non-Disclosure Agreement (NDA) with your authorized director or promoter.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">3. Data Retention & Secure Shredding</h4>
                <p>Upon mandate completion and delivery of final action logs, client working files are retained only for the agreed statutory period or permanently purged upon formal written request.</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              ><span aria-label="Close" className="text-xl leading-none">×</span>
                Close Privacy Policy
              </button>
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
              <button 
                onClick={() => setShowGuardrailsModal(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              ><span aria-label="Close" className="text-xl leading-none">×</span>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <strong>Statutory Notice:</strong> Navigalex provides management advisory, risk intelligence, and financial oversight. To protect clients and adhere to statutory standards, our operations maintain strict institutional boundaries.
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
              <button 
                onClick={() => setShowGuardrailsModal(false)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              ><span aria-label="Close" className="text-xl leading-none">×</span>
                Acknowledge & Close
              </button>
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



