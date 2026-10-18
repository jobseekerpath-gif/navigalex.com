import React, { useState } from 'react';
import { 
  Shield, Scale, FileText, BarChart3, ArrowRight, CheckCircle2, 
  Sparkles, Activity, Lock, Users, Building2, ChevronRight, Menu, X, 
  AlertTriangle, FileCheck, DollarSign, Briefcase, Clock, Check, 
  HelpCircle, Send, Download, Phone, Mail, Award, Eye, Database,
  Upload, File, RefreshCw, AlertCircle, TrendingUp, Landmark, MapPin
} from 'lucide-react';

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
const isResolvedPlaceholder = (value: string) => Boolean(value.trim() && !/\{\{[^}]+\}\}/.test(value));

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

export interface LiveAssessmentsPageProps {
  visitorId: string;
  onOpenAssessment: (concern?: string) => void;
}

export default function LiveAssessmentsPage({ visitorId, onOpenAssessment }: LiveAssessmentsPageProps) {
  // Live Contract Analyzer State
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docText, setDocText] = useState('');
  const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false);
  const [isDownloadingContractReport, setIsDownloadingContractReport] = useState(false);
  const [docResult, setDocResult] = useState<any>(null);
  const [docInputError, setDocInputError] = useState('');
  const [isExtractingDocument, setIsExtractingDocument] = useState(false);

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
    if (docFile && docFile.size > 2 * 1024 * 1024) {
      setDocInputError('Please choose a text file smaller than 2 MB.');
      return;
    }
    if (!sourceText && docFile) {
      const isTextFile = /(^text\/)|(csv)|(json)/i.test(docFile.type) || /\.(txt|csv|json)$/i.test(docFile.name);
      if (!isTextFile) {
        setDocInputError('This version does not extract PDF, DOCX or image contents. Paste the actual contract text in Option B so the assessment is based on the document itself.');
        return;
      }
      setIsExtractingDocument(true);
      try { sourceText = (await docFile.text()).trim(); } catch {
        setDocInputError('The selected text file could not be read. Paste the contract text directly.');
        return;
      } finally {
        setIsExtractingDocument(false);
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
      setDocInputError('');
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
      setCibilInputError('');
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

  return (

          <div className="py-16 px-6 max-w-7xl mx-auto space-y-20">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">COMMERCIAL-GRADE WORKING ENGINES</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">Live AI Financial & Legal Assessments</h2>
              <p className="text-slate-600">Assess real contracts, check loan readiness, and generate an instant business diagnostic report.</p>
            </div>

            <div className="navigalex-card rounded-2xl p-4 sm:p-5 border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  ["01", "Free assessment", "Identify the issue from your own inputs."],
                  ["02", "Small paid diagnostic", "Deepen the finding with the records relevant to the issue."],
                  ["03", "Defined project", "Move into a clearly scoped advisory engagement."],
                  ["04", "Recurring advisory", "Continue support only where ongoing monitoring is useful."]
                ].map(([step, title, description]) => (
                  <div key={step} className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <span className="text-[10px] font-extrabold text-blue-700">{step}</span>
                    <strong className="block text-xs font-bold text-slate-900 mt-1">{title}</strong>
                    <span className="block text-[11px] text-slate-600 leading-relaxed mt-1">{description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* LIVE 1: Contract & Agreement Risk Analyzer */}
            <section className="navigalex-card rounded-2xl p-4 sm:p-10 shadow-xl border-t-4 border-blue-600 space-y-8">
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
                  {isExtractingDocument ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin" />
                      <span>Reading selected file...</span>
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
                  <CommercialPath path={COMMERCIAL_PATHS.contract} onOpenAssessment={onOpenAssessment} />
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Annual Business Turnover (₹ in Crores)</label>
                  <input 
                    type="number" 
                    step="0.5"
                    value={cibilForm.turnover}
                    onChange={e => setCibilForm({...cibilForm, turnover: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">e.g. 15 for ₹15 Crores annual sales</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Total Monthly Loan EMIs (₹ in Lakhs)</label>
                  <input 
                    type="number" 
                    step="0.5"
                    value={cibilForm.monthlyEmi}
                    onChange={e => setCibilForm({...cibilForm, monthlyEmi: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">e.g. 4.5 for ₹4.5 Lakhs monthly EMI outflow</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Existing Bank Cash Credit / OD Limit (₹ in Crores)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={cibilForm.ccLimit}
                    onChange={e => setCibilForm({...cibilForm, ccLimit: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">e.g. 2.5 for ₹2.5 Crores sanctioned limit</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Overdue Receivables Stuck &gt; 90 Days (₹ in Lakhs)</label>
                  <input 
                    type="number" 
                    step="5"
                    value={cibilForm.overdueDebtors}
                    onChange={e => setCibilForm({...cibilForm, overdueDebtors: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">e.g. 45 for ₹45 Lakhs payments delayed over 90 days</span>
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

                  <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">{cibilResult.calculationDisclaimer || 'Indicative screening only. This is not a lender approval or credit decision. Have the figures reviewed by a qualified finance professional.'}</p>
                  <CommercialPath path={COMMERCIAL_PATHS.lenderready} onOpenAssessment={onOpenAssessment} />
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
                      <option>&lt; ₹1 Cr (Early Stage)</option>
                      <option>₹1 Cr - ₹5 Cr</option>
                      <option>₹5 Cr - ₹25 Cr (MSME Growth)</option>
                      <option>₹25 Cr - ₹100 Cr (Mid-Corporate)</option>
                      <option>₹100 Cr+ (Enterprise)</option>
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
                  <CommercialPath path={COMMERCIAL_PATHS.controlcfo} onOpenAssessment={onOpenAssessment} />
                </div>
              )}
            </section>
          </div>
  );
}
