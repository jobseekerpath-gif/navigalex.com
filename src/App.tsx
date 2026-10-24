import React, { useState, useEffect, lazy, Suspense } from 'react';
const GenieWorkspace = lazy(() => import('./components/GenieWorkspace'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const LiveAssessmentsPage = lazy(() => import('./pages/LiveAssessmentsPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
import ModalCloseButton from './components/ModalCloseButton';
import { 
  Shield, Scale, FileText, BarChart3, ArrowRight, CheckCircle2, 
  Sparkles, Activity, Lock, Users, Building2, ChevronRight, Menu, X, 
  AlertTriangle, FileCheck, DollarSign, Briefcase, Clock, Check, 
  HelpCircle, Send, Download, Phone, Mail, Award, Eye, Database,
  Upload, File, RefreshCw, AlertCircle, TrendingUp, Landmark, MapPin, MessageCircle
} from 'lucide-react';

function resolveActiveTabFromLocation() {
  if (typeof window === 'undefined') return 'home';
  const pathname = window.location.pathname.toLowerCase();
  const search = new URLSearchParams(window.location.search);
  if (pathname === '/admin' || pathname.startsWith('/admin') || search.has('admin') || window.location.hash.includes('admin')) return 'admin';
  if (pathname === '/services' || pathname.startsWith('/services') || search.has('persona')) return 'services';
  if (pathname === '/family-office' || pathname.startsWith('/family-office')) return 'family-office';
  if (pathname === '/43b-h-check' || pathname.startsWith('/43b-h-check')) return '43b-h-check';
  if (pathname === '/live-tools' || pathname.startsWith('/live-tools')) return 'live-tools';
  if (pathname === '/about' || pathname.startsWith('/about')) return 'about';
  if (pathname === '/contact' || pathname.startsWith('/contact')) return 'contact';
  if (pathname === '/industries' || pathname.startsWith('/industries')) return 'industries';
  if (pathname === '/how-it-works' || pathname.startsWith('/how-it-works')) return 'how-it-works';
  if (pathname === '/why-pick-us' || pathname.startsWith('/why-pick-us')) return 'why-pick-us';
  return 'home';
}

export default function App() {
  const [activeTab, setActiveTab] = useState(resolveActiveTabFromLocation);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);


  // Keep analytics optional so blocked browser storage never prevents the app from loading.
  const [visitorId] = useState(() => {
    if (typeof window === 'undefined') return 'v_client';
    try {
      const storedId = window.localStorage.getItem('navigalex_visitor_id');
      if (storedId) return storedId;
    } catch {
      // Private browsing and storage policies may block localStorage.
    }
    const generatedId = 'v_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    try { window.localStorage.setItem('navigalex_visitor_id', generatedId); } catch { /* analytics remain optional */ }
    return generatedId;
  });

  // Sync direct links and browser Back/Forward with the visible app page.
  useEffect(() => {
    const handleLocationChange = () => setActiveTab(resolveActiveTabFromLocation());
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Always reset the document scroll position after the destination tab has rendered.
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    scrollToTop();
    const firstFrame = window.requestAnimationFrame(scrollToTop);
    const timer = window.setTimeout(scrollToTop, 120);
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.clearTimeout(timer);
    };
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

  // MSME supplier payment-timing screening state
  const [paymentCheck, setPaymentCheck] = useState({
    msmeStatus: 'unknown',
    writtenAgreement: 'unknown',
    acceptanceDate: '',
    agreedDays: '',
    paidDate: '',
    amount: ''
  });
  const [paymentCheckResult, setPaymentCheckResult] = useState<any>(null);

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
    turnover: '',
    primaryConcern: '',
    contactMethod: 'Email',
    consent: false
  });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSubmitError, setLeadSubmitError] = useState('');

  // Modals for full transparency
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showGuardrailsModal, setShowGuardrailsModal] = useState(false);

  useEffect(() => {
    const modalOpen = Boolean(showPrivacyModal || showGuardrailsModal);
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (showPrivacyModal) setShowPrivacyModal(false);
      else if (showGuardrailsModal) setShowGuardrailsModal(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [showPrivacyModal, showGuardrailsModal]);

  // Opens the inquiry form with the selected problem prefilled.
  const openAssessmentForm = (concern?: string) => {
    if (concern) {
      setLeadForm(prev => ({
        ...prev,
        primaryConcern: concern
      }));
    }
    setShowPrivacyModal(false);
    setShowGuardrailsModal(false);
    window.history.pushState(null, '', '/contact');
    setActiveTab('contact');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const runPaymentTimingCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const { msmeStatus, writtenAgreement, acceptanceDate, agreedDays, paidDate, amount } = paymentCheck;
    const parseDateOnly = (value: string): Date | null => {
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
      if (!match) return null;
      const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
      return date.toISOString().slice(0, 10) === value ? date : null;
    };
    const formatDate = (date: Date) => date.toLocaleDateString('en-IN', { timeZone: 'UTC' });

    const accepted = parseDateOnly(acceptanceDate);
    if (!accepted) {
      setPaymentCheckResult({ type: 'input', message: 'Enter a valid acceptance or deemed-acceptance date.' });
      return;
    }

    let allowedDays = 45;
    let timingRuleLabel = '45-day outer limit (written terms not confirmed)';
    if (writtenAgreement === 'no') {
      allowedDays = 15;
      timingRuleLabel = '15-day limit when there is no written payment agreement';
    } else if (writtenAgreement === 'yes') {
      if (!/^[0-9]+$/.test(agreedDays) || Number(agreedDays) > 3650) {
        setPaymentCheckResult({ type: 'input', message: 'Enter a whole-number written payment term from 0 to 3,650 days.' });
        return;
      }
      allowedDays = Math.min(Number(agreedDays), 45);
      timingRuleLabel = Number(agreedDays) > 45 ? '45-day maximum applied to the entered written term' : 'written payment term';
    }

    const timingThreshold = new Date(accepted);
    timingThreshold.setUTCDate(timingThreshold.getUTCDate() + allowedDays);
    const statutoryMax = new Date(accepted);
    statutoryMax.setUTCDate(statutoryMax.getUTCDate() + 45);

    const now = new Date();
    const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const payment = paidDate ? parseDateOnly(paidDate) : today;
    if (!payment) {
      setPaymentCheckResult({ type: 'input', message: 'Enter a valid payment date or leave it blank if unpaid.' });
      return;
    }

    const daysToPayment = Math.round((payment.getTime() - accepted.getTime()) / 86400000);
    const beyondThreshold = payment.getTime() > timingThreshold.getTime();
    const type = msmeStatus === 'yes' ? (beyondThreshold ? 'flag' : 'clear') : 'uncertain';

    let note = 'This is an informational screen based on the dates and answers entered. Confirm supplier eligibility, contract terms and the applicable tax-year treatment with a qualified professional before relying on it.';
    if (writtenAgreement === 'unknown') {
      note += ' Because written terms are not confirmed, a payment before the 45-day outer limit may still be late if no written agreement exists.';
    } else if (writtenAgreement === 'yes' && Number(agreedDays) > 45) {
      note += ' The entered written term exceeds 45 days; this screen applies the 45-day maximum.';
    }
    if (msmeStatus !== 'yes') {
      note += ' Supplier eligibility is not confirmed, so this screen cannot indicate whether the MSME timing rule applies.';
    }

    setPaymentCheckResult({
      type,
      daysToPayment: Math.max(0, daysToPayment),
      timingThreshold: formatDate(timingThreshold),
      statutoryMax: formatDate(statutoryMax),
      timingRuleLabel,
      show45DayOuterLimit: writtenAgreement !== 'no',
      amount: amount || '',
      potentialIssue: type === 'flag',
      note
    });
  };


  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitError('');
    if (!leadForm.consent) {
      setLeadSubmitError('Please accept the privacy and data consent notice before submitting.');
      return;
    }
    setLeadSubmitting(true);
    try {
      const response = await fetch('/api/inquiries/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...leadForm, visitorId })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Your inquiry could not be submitted. Please try again.');
      }
      setLeadSubmitted(true);
    } catch (err) {
      console.error('Error posting inquiry:', err);
      setLeadSubmitError(err instanceof Error ? err.message : 'Your inquiry could not be submitted. Please try again.');
    } finally {
      setLeadSubmitting(false);
    }
  };

  const navigateToFamilyOffice = () => {
    window.history.pushState(null, '', '/family-office');
    setActiveTab('family-office');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTab = (tab: string) => {
    const paths: Record<string, string> = {
      home: '/',
      services: '/services',
      'live-tools': '/live-tools',
      about: '/about',
      contact: '/contact',
      industries: '/industries',
      'how-it-works': '/how-it-works',
      'why-pick-us': '/why-pick-us',
      'family-office': '/family-office',
      '43b-h-check': '/43b-h-check',
      admin: '/admin'
    };
    const nextPath = paths[tab];
    const currentUrl = window.location.pathname + window.location.search;
    const keepServiceDeepLink = tab === 'services' && window.location.pathname.toLowerCase().startsWith('/services');
    if (nextPath && !keepServiceDeepLink && currentUrl !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };




  if (activeTab === 'admin') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-slate-600 text-sm">Loading Navigalex Admin…</div>}>
      <> 
        <AdminPanel onBackToSite={() => {
          if (typeof window !== 'undefined' && window.location.pathname.toLowerCase() === '/admin') {
            window.history.pushState(null, '', '/');
          }
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} />
        {/* Financial Genie is the single advisory entry point. */}
      </>
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#0f172a] flex flex-col font-['Inter'] selection:bg-blue-600 selection:text-white relative">
      {/* Spaceship.com Kinetic Top Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-slate-100/60 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-emerald-700 via-teal-600 to-lime-400 transition-all duration-75 shadow-[0_0_8px_rgba(16,185,129,0.45)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Spaceship.com Ambient Floating Mesh Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 -left-36 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] animate-spaceship-float"></div>
        <div className="absolute top-2/3 -right-36 w-[450px] h-[450px] bg-indigo-400/10 rounded-full blur-[140px] animate-spaceship-float-reverse"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-400/5 rounded-full blur-[100px] animate-spaceship-glow"></div>
      </div>

      {/* Sticky Header */}
      <header className="site-nav-header sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-[0_1px_12px_rgba(15,23,42,0.05)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-[58px] lg:h-[76px] grid grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[250px_minmax(0,1fr)_170px] items-center gap-2 lg:gap-3">
          <button
            type="button"
            aria-label="Go to Navigalex home"
            className="flex items-center gap-2.5 min-w-0 group w-full"
            onClick={() => { window.history.pushState(null, '', '/'); setActiveTab('home'); window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }}
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
              ['home', 'Financial Genie'],
                            ['about', 'About'],
              ['contact', 'Contact']
            ].map(([tab, label]) => (
              <button
                key={tab + '-' + label}
                type="button"
                onClick={() => navigateToTab(tab)}
                className={`px-1 xl:px-1.5 py-2 rounded-lg text-[14px] xl:text-[15px] leading-tight whitespace-nowrap text-black transition-colors hover:bg-slate-100 ${activeTab === tab ? 'text-black bg-slate-100' : 'text-black'}`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2 shrink-0 w-full">
            <button
              onClick={() => { openAssessmentForm(); setMobileMenuOpen(false); }}
              className="inline-flex min-h-11 items-center justify-center px-2.5 sm:px-3 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-sm shadow-blue-600/20 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span className="sm:hidden">Enquire</span><span className="hidden sm:inline">Request a proposal</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-primary-navigation"
              className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-primary-navigation" className="lg:hidden border-t border-slate-200 bg-white px-4 sm:px-6 py-4 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ['home', 'Home'],
                ['home', 'Services in Financial Genie'],
                                ['about', 'About'],
                ['contact', 'Contact']
              ].map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => navigateToTab(tab)}
                  className={`min-h-11 text-left px-3 py-2.5 rounded-xl text-[14px] font-semibold text-black transition-colors ${activeTab === tab ? 'text-black bg-slate-100' : 'text-black hover:bg-slate-100'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => { openAssessmentForm(); setMobileMenuOpen(false); }}
                className="min-h-11 w-full rounded-xl bg-blue-700 px-4 py-3 text-white font-bold text-sm shadow-sm hover:bg-blue-800"
              >
                Request a proposal
              </button>
            </div>
          </div>
        )}
      </header>
      {/* Main Content */}
      <main className="flex-1">
        {activeTab !== 'home' && (
          <div className="mx-auto flex w-full max-w-7xl justify-start px-4 pt-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => {
                window.history.pushState(null, '', '/');
                setActiveTab('home');
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-800 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-label="Return to Financial Genie"
            >
              <MessageCircle className="h-4 w-4" />
              Back to Financial Genie
            </button>
          </div>
        )}

        {activeTab === 'home' && (
          <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-sm text-slate-500">Opening your advisory workspace…</div>}>
            <GenieWorkspace
              onOpenAssessment={openAssessmentForm}
              onNavigateTab={navigateToTab}
            />
          </Suspense>
        )}

        {/* LIVE AI ASSESSMENTS TAB — lazy route/page chunk */}
        {activeTab === 'live-tools' && (
          <Suspense fallback={<div className="py-20 px-6 max-w-7xl mx-auto text-center text-sm text-slate-500">Loading live assessments…</div>}>
            <LiveAssessmentsPage
              visitorId={visitorId}
              onOpenAssessment={openAssessmentForm}
            />
          </Suspense>
        )}

        {/* WHY PICK THESE PRODUCTS */}
        {activeTab === 'why-pick-us' && (
          <section className="mx-auto max-w-5xl space-y-6 px-4 py-12 sm:px-6 sm:py-16">
            <div className="space-y-3 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700">A CLEAR PLACE TO START</span>
              <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">Choose the business problem first</h2>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600">Navigalex offers nine distinct productised starting reviews. Each shows expected outcomes, client inputs, timing and boundaries before you request a proposal.</p>
            </div>
            <div className="flex justify-center">
              <button type="button" onClick={() => { setActiveTab('services'); window.history.pushState(null, '', '/services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">Explore the scoped reviews <ArrowRight className="h-4 w-4" /></button>
            </div>
          </section>
        )}

        {/* SERVICES — lazy route/page chunk */}
        {activeTab === 'services' && (
          <Suspense fallback={<div className="py-20 px-6 max-w-7xl mx-auto text-center text-sm text-slate-500">Loading services…</div>}>
            <ServicesPage onInquiry={openAssessmentForm} />
          </Suspense>
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
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">MSME PAYMENT TIMING SCREEN</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">Check a supplier payment timeline</h2>
              <p className="text-slate-600 max-w-3xl">
                Enter the acceptance date, supplier eligibility and whether payment terms were agreed in writing. This is an informational screen, not a legal or tax conclusion.
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
                    <option value="unknown">Not sure</option>
                    <option value="yes">Micro/small supplier status confirmed</option>
                    <option value="no">Not confirmed / may not qualify</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Written payment agreement?</label>
                  <select
                    value={paymentCheck.writtenAgreement}
                    onChange={(e) => setPaymentCheck({ ...paymentCheck, writtenAgreement: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900"
                  >
                    <option value="unknown">Not sure</option>
                    <option value="yes">Yes, there is a written term</option>
                    <option value="no">No written agreement</option>
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

                {paymentCheck.writtenAgreement === 'yes' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Written payment term (days)</label>
                    <input
                      type="number"
                      min="0"
                      max="3650"
                      required
                      value={paymentCheck.agreedDays}
                      onChange={(e) => setPaymentCheck({ ...paymentCheck, agreedDays: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">Enter the term shown in the agreement. If it is longer, the screen applies a 45-day maximum.</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Actual or expected payment date</label>
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
                      {paymentCheckResult.type === 'flag' ? 'Potential payment-timing issue' : paymentCheckResult.type === 'uncertain' ? 'Confirm eligibility before relying on this result' : 'No timing issue indicated by these entries'}
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Days from acceptance to payment check: {paymentCheckResult.daysToPayment}</li>
                      <li>• {paymentCheckResult.timingRuleLabel}: {paymentCheckResult.timingThreshold}</li>
                      {paymentCheckResult.show45DayOuterLimit && <li>• 45-day outer limit for written terms: {paymentCheckResult.statutoryMax}</li>}
                      {paymentCheckResult.amount && <li>• Amount entered: ₹{paymentCheckResult.amount}</li>}
                    </ul>
                    <p className="text-xs text-slate-600">{paymentCheckResult.note}</p>
                    {paymentCheckResult.type === 'flag' && (
                      <button
                        type="button"
                        onClick={() => openAssessmentForm('Contract & Collections Review — MSME payment timing question')}
                        className="inline-flex px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                      >
                        Request a contract and collections review
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'family-office' && (
          <section className="mx-auto max-w-4xl space-y-8 px-4 py-12 sm:px-6 sm:py-16">
            <button type="button" onClick={() => { window.history.pushState(null, '', '/services'); setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex min-h-11 items-center text-sm font-bold text-blue-700 hover:text-blue-900">← Back to scoped reviews</button>
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700">FAMILY BUSINESS QUESTION</span>
              <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">Tell us what you need to work through</h2>
              <p className="max-w-3xl text-sm leading-relaxed text-slate-600">A standalone family-office, wealth-management, succession-planning, legal or tax service is not among the current published offers. If your question is about a business process, cash visibility, contracts or controls, send a short outline and we will confirm whether one of the scoped reviews fits.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => openAssessmentForm('Family business question: please confirm fit with current scoped reviews')} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">Discuss whether we can help</button>
              <button type="button" onClick={() => { setActiveTab('services'); window.history.pushState(null, '', '/services'); }} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50">Browse current reviews</button>
            </div>
          </section>
        )}

        {/* INDUSTRIES: problem examples for scoping */}
        {activeTab === 'industries' && (
          <section className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto max-w-3xl space-y-3 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700">COMMON BUSINESS CONTEXTS</span>
              <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">Start with the issue you need to solve</h2>
              <p className="text-sm leading-relaxed text-slate-600">Industry context can help shape a scoping conversation. It does not imply specialist credentials, regulatory certification, or a guaranteed outcome.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'Manufacturing & distribution', desc: 'Cash pressure, working capital, late collections, customer terms, or one operating process.' },
                { title: 'Export & international trade', desc: 'Cash visibility, payment timing, customer contracts, and ownership of documentation workflows.' },
                { title: 'Professional services & IT', desc: 'Milestone billing, receivables, contract handoffs, and ownership of client delivery processes.' },
                { title: 'Construction & real estate', desc: 'Project cash visibility, vendor payment processes, contract records, and control ownership.' },
                { title: 'Healthcare & education', desc: 'Vendor payment workflows, fee collection processes, and recordkeeping priorities.' },
                { title: 'Family-owned businesses', desc: 'Business cash visibility, decision ownership, customer terms, and process controls.' }
              ].map((ind) => (
                <article key={ind.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="font-bold text-slate-950">{ind.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{ind.desc}</p>
                </article>
              ))}
            </div>
            <div className="flex justify-center">
              <button type="button" onClick={() => { setActiveTab('services'); window.history.pushState(null, '', '/services'); }} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">Find a scoped starting review</button>
            </div>
          </section>
        )}

        {/* HOW IT WORKS */}
        {activeTab === 'how-it-works' && (
          <section className="mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto max-w-3xl space-y-3 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700">A SIMPLE, AGREED PROCESS</span>
              <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">Know what happens before work starts</h2>
              <p className="text-sm leading-relaxed text-slate-600">Scope, fee, timing, information handling, and any human review are confirmed in writing for each engagement.</p>
            </div>
            <ol className="space-y-3">
              {[
                { title: 'Describe the problem', desc: 'Tell us the business issue and the decision you need to make. Do not submit sensitive records in the first inquiry.' },
                { title: 'Check fit and scope', desc: 'We discuss the records, people, limits, and questions needed for a useful review.' },
                { title: 'Review the proposal', desc: 'You receive the proposed deliverables, fee, timing, assumptions, and information-handling terms.' },
                { title: 'Start after agreement', desc: 'Work begins after you approve the written scope and provide only the agreed inputs.' },
                { title: 'Receive findings and next steps', desc: 'We share the agreed output and discuss practical next actions within the agreed scope.' }
              ].map((step, index) => (
                <li key={step.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-800">{String(index + 1).padStart(2, '0')}</span>
                  <div><h3 className="font-bold text-slate-950">{step.title}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{step.desc}</p></div>
                </li>
              ))}
            </ol>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-600">
              AI-assisted tools may help organize information. They can be incomplete or wrong and are not a substitute for qualified professional advice. Any human reviewer and review scope are stated in the proposal.
            </div>
          </section>
        )}

        {/* ABOUT */}
        {activeTab === 'about' && (
          <section className="mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto max-w-3xl space-y-3 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700">ABOUT NAVIGALEX</span>
              <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">Practical starting points for business decisions</h2>
              <p className="text-sm leading-relaxed text-slate-600">Navigalex currently publishes three scoped starting reviews for owner-managed businesses: financial clarity, contract and collections, and one-process controls.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { title: 'Defined work', desc: 'Each published review lists its outcomes, inputs, timing, and scope limits.' },
                { title: 'Clear terms', desc: 'The fee, delivery dates, assumptions, and information-handling terms are agreed in a written proposal.' },
                { title: 'Appropriate boundaries', desc: 'Legal, tax, audit, certification, lending, investment, and other regulated work is not implied by the advisory tools or reviews.' }
              ].map((item) => (
                <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT & ASSESSMENT TAB */}
        {activeTab === 'contact' && (
          <div className="py-20 px-6 max-w-3xl mx-auto space-y-12">
            <button type="button" onClick={() => { setActiveTab('services'); window.history.pushState(null, '', '/services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900">← Back to services</button>
            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">BUSINESS INQUIRY</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Request a proposal</h2>
              <p className="text-slate-600">Tell us what you are working through. We will follow up to discuss fit, information needed, scope, timing and fees. Please do not send confidential records before engagement terms are agreed.</p>
            </div>

            <div className="navigalex-card p-8 sm:p-10 rounded-2xl shadow-xl">
              {leadSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center mx-auto text-blue-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Thanks, we received your inquiry</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thanks, {leadForm.name || 'there'}. Your inquiry has been received. We will use your selected contact method to follow up.
                  </p>
                  <button onClick={() => setLeadSubmitted(false)} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white rounded-xl cursor-pointer">
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-6">
                  {leadSubmitError && (
                    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                      {leadSubmitError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="lead-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Your name *</label>
                      <input 
                        id="lead-name"
                        autoComplete="name"
                        type="text" 
                        required
                        value={leadForm.name}
                        onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                        placeholder="Rajesh Sharma" 
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="lead-company" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Company (optional)</label>
                      <input 
                        id="lead-company"
                        autoComplete="organization"
                        type="text"
                        value={leadForm.company}
                        onChange={e => setLeadForm({...leadForm, company: e.target.value})}
                        placeholder="Apex Engineering Pvt Ltd" 
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="lead-designation" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Role (optional)</label>
                      <input 
                        id="lead-designation"
                        autoComplete="organization-title"
                        type="text"
                        value={leadForm.designation}
                        onChange={e => setLeadForm({...leadForm, designation: e.target.value})}
                        placeholder="Managing Director / Promoter / CFO" 
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="lead-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Email *</label>
                      <input 
                        id="lead-email"
                        autoComplete="email"
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
                      <label htmlFor="lead-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Phone / WhatsApp {leadForm.contactMethod === 'Phone' || leadForm.contactMethod === 'WhatsApp' ? '*' : '(optional)'}</label>
                      <input 
                        id="lead-phone"
                        type="tel" 
                        autoComplete="tel"
                        required={leadForm.contactMethod === 'Phone' || leadForm.contactMethod === 'WhatsApp'}
                        value={leadForm.phone}
                        onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                        placeholder="+91 98765 43210" 
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="lead-turnover" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Annual turnover (optional)</label>
                      <select
                        id="lead-turnover" 
                        value={leadForm.turnover}
                        onChange={e => setLeadForm({...leadForm, turnover: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                      >
                        <option value="">Prefer not to say</option>
                        <option>&lt; ₹5 Cr</option>
                        <option>₹5 Cr - ₹25 Cr</option>
                        <option>₹25 Cr - ₹100 Cr</option>
                        <option>₹100 Cr+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="primary-concern" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">What would you like help with? (optional)</label>
                    <textarea
                      id="primary-concern"
                      rows={3}
                      maxLength={2000}
                      value={leadForm.primaryConcern}
                      onChange={e => setLeadForm({...leadForm, primaryConcern: e.target.value})}
                      placeholder="Describe the issue in a sentence, or leave blank if you are not sure yet."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Preferred Contact Method</label>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
                      {['Phone', 'WhatsApp', 'Email', 'Video call'].map(m => (
                        <label key={m} className="flex min-h-11 items-center gap-2 text-xs text-slate-700 cursor-pointer">
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
                      <span>I consent to Navigalex contacting me about this inquiry.</span>
                    </label>
                    <button type="button" onClick={() => setShowPrivacyModal(true)} className="mt-2 text-xs font-semibold text-blue-700 underline underline-offset-2">View privacy notice</button>
                  </div>

                  <button
                    type="submit"
                    disabled={leadSubmitting}
                    className="w-full py-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    {leadSubmitting ? 'Sending…' : 'Request a proposal'}
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
            Navigalex's starter reviews cover business finance, contract and collections, and process controls as described in each scope. They do not include legal opinions or representation, statutory audit or assurance, tax opinions or attestations, debt recovery, loan approval, investment recommendations or regulatory certification. Share only information you are authorised to provide. See the privacy notice for current data handling.
          </p>
        </div>
      </section>

      {activeTab !== 'home' && (
        <div className="mx-auto flex w-full max-w-7xl justify-start px-4 py-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => {
              window.history.pushState(null, '', '/');
              setActiveTab('home');
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-800 shadow-sm transition hover:border-blue-400 hover:bg-blue-50"
          >
            <MessageCircle className="h-4 w-4" />
            Back to Financial Genie
          </button>
        </div>
      )}

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
              Practical finance, risk, contract, control and growth advisory for Indian businesses. Start with a defined service and clear next step.
            </p>
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
          <p>© {new Date().getFullYear()} Navigalex Advisory & Governance Intelligence. All rights reserved.</p>
          <p className="text-[11px] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span>• • • </span>
          </p>
        </div>
      </footer>

      {/* MODAL 2: PRIVACY INFORMATION */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 overflow-y-auto overscroll-contain animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-5 shadow-2xl border border-slate-200 my-0">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 pb-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Privacy information</h3>
                  <p className="text-xs text-slate-500">What this site collects and how it is used</p>
                </div>
              </div>

            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5">
                <strong className="mb-1 block font-bold text-blue-900">Before you share information</strong>
                <span>Share only information you are authorised to provide. Do not enter passwords, bank login details or confidential documents in chat. For a document review, agree the scope and handling terms first.</span>
              </div>
              <div>
                <h4 className="mb-1 font-bold uppercase tracking-wider text-slate-900">Information collected</h4>
                <p>When you send an inquiry, the site collects your name and email, any company, role or phone details you provide, your contact preference, the issue you describe, and the time you accept the contact notice. The site also records an IP address, a browser identifier and basic visit activity for administration and security.</p>
              </div>
              <div>
                <h4 className="mb-1 font-bold uppercase tracking-wider text-slate-900">How information is processed</h4>
                <p>Inquiry details are sent to the email address configured by the business through its email delivery provider and stored in the site's server records for follow-up. Text or documents entered into AI-assisted chat and assessment tools are sent to the AI provider configured for the site to generate a response.</p>
              </div>
              <div>
                <h4 className="mb-1 font-bold uppercase tracking-wider text-slate-900">Retention and requests</h4>
                <p>No fixed automatic deletion period is set. An administrator can delete inquiry records; visit and security logs remain in the site's operational records until they are removed. To ask about your information, use the contact form.</p>
              </div>
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">For a privacy question or request, use the contact form and include the email address connected to your inquiry.</p>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <ModalCloseButton onClick={() => setShowPrivacyModal(false)} label="Close privacy policy" />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REGULATORY GUARDRAILS & BOUNDARIES */}
      {showGuardrailsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 overflow-y-auto overscroll-contain animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-5 shadow-2xl border border-slate-200 my-0">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 pb-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Professional scope and boundaries</h3>
                  <p className="text-xs text-slate-500">What the starter reviews cover and exclude</p>
                </div>
              </div>

            </div>

            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-blue-950">
                Navigalex's starter reviews provide business, finance and process observations within a written scope agreed with the client.
              </div>
              <div className="space-y-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <strong className="mb-1 block font-bold text-slate-900">Outside the starter scope</strong>
                  <span>Legal opinions or representation, statutory audits or assurance opinions, tax opinions or attestations, debt recovery, loan approval, investment recommendations and regulatory certification are not included.</span>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <strong className="mb-1 block font-bold text-slate-900">How to use findings</strong>
                  <span>Reviews depend on the accuracy and completeness of the information provided. They do not guarantee an outcome or that every issue will be found. Obtain advice from an appropriately qualified professional where your situation requires it.</span>
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

      {/* Financial Genie is the single advisory entry point; duplicate floating bot removed. */}
    </div>
  );
}



