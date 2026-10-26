import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, User, Key, LogOut, CheckCircle2, AlertTriangle, 
  FileText, Briefcase, Eye, Search, Filter, RefreshCw, Plus, 
  Trash2, Edit3, ArrowRight, X, Clock, Database, Check, Phone, 
  Mail, Building2, TrendingUp, Layers, ChevronRight, Download, 
  Sparkles, Globe, Laptop, Smartphone, Activity, Copy
} from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  company: string;
  designation: string;
  email: string;
  phone: string;
  businessType: string;
  turnover: string;
  primaryConcern: string;
  contactMethod: string;
  status: 'New' | 'Under Review' | 'NDA Executed' | 'Diagnostic Delivered' | 'Closed';
  submittedAt: string;
  ip: string;
  notes?: string;
}

interface CaseStudy {
  id: string;
  title: string;
  clientSector: string;
  region: string;
  dealSize: string;
  riskIdentified: string;
  advisoryProvided: string;
  concreteRoi: string;
  status: 'Published' | 'Under Review' | 'Draft';
  submittedAt: string;
  author: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  eventType: string;
  description: string;
  ip: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

interface VisitorSession {
  visitorId: string;
  ip: string;
  browser: string;
  os: string;
  device: string;
  firstSeen: string;
  lastSeen: string;
  pageViewsCount: number;
  activitiesCount: number;
  currentPath: string;
  lastAction: string;
}

interface VisitorActivity {
  id: string;
  visitorId: string;
  ip: string;
  timestamp: string;
  eventType: 'PAGE_VIEW' | 'SCAN_CONTRACT' | 'SCAN_DSCR' | 'SCAN_HEALTH' | 'BOT_CHAT' | 'INQUIRY_SUBMIT' | 'ADMIN_ACCESS';
  path: string;
  details: string;
  browser: string;
  os: string;
  device: string;
}

interface AdminPanelProps {
  onBackToSite: () => void;
}

export default function AdminPanel({ onBackToSite }: AdminPanelProps) {
  // Authentication state; administrator credentials are supplied through secure server configuration.
  const [token, setToken] = useState<string | null>(() => {
    try { return window.sessionStorage.getItem('nvx_admin_token'); } catch { return null; }
  });
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin View: Inquiries | Live Visitors | Case Studies | Audit Logs
  const [activeAdminTab, setActiveAdminTab] = useState<'inquiries' | 'visitors' | 'casestudies' | 'auditlogs'>('inquiries');

  // Data States
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [visitors, setVisitors] = useState<VisitorSession[]>([]);
  const [visitorActivities, setVisitorActivities] = useState<VisitorActivity[]>([]);
  const [activeNowCount, setActiveNowCount] = useState<number>(0);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  // Filters & Search
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('All');
  const [logSeverityFilter, setLogSeverityFilter] = useState('All');
  const [activitySearch, setActivitySearch] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState('All');

  // Modals
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [showCaseStudyModal, setShowCaseStudyModal] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);

  // New Case Study Form State
  const [caseStudyForm, setCaseStudyForm] = useState({
    title: '',
    clientSector: 'Manufacturing & Engineering',
    region: '',
    dealSize: '',
    riskIdentified: '',
    advisoryProvided: '',
    concreteRoi: '',
    status: 'Draft' as 'Published' | 'Under Review' | 'Draft'
  });

  // Verify token on mount
  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  // Real-time polling every 4 seconds when autoRefresh is enabled
  useEffect(() => {
    if (!token || !autoRefresh) return;
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      fetchDashboardData(token, false);
    }, 4000);
    return () => clearInterval(interval);
  }, [token, autoRefresh]);

  const verifyToken = async (authToken: string) => {
    try {
      const res = await fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) return; // temporary problem such as rate limiting: keep the session
      const data = await res.json();
      if (data.authenticated) {
        setAdminUser(data.admin);
        fetchDashboardData(authToken);
      } else {
        handleLogout();
      }
    } catch {
      // Network or parse error: keep the session; the next refresh retries.
    }
  };

  const fetchDashboardData = async (authToken: string, showLoadingIndicator = true) => {
    if (showLoadingIndicator) setIsLoadingData(true);
    try {
      const [resInq, resCs, resLogs, resVisitors, resActs] = await Promise.all([
        fetch('/api/admin/inquiries', { headers: { Authorization: `Bearer ${authToken}` } }),
        fetch('/api/admin/case-studies', { headers: { Authorization: `Bearer ${authToken}` } }),
        fetch('/api/admin/audit-logs', { headers: { Authorization: `Bearer ${authToken}` } }),
        fetch('/api/admin/visitors', { headers: { Authorization: `Bearer ${authToken}` } }),
        fetch('/api/admin/visitor-activities', { headers: { Authorization: `Bearer ${authToken}` } })
      ]);

      if ([resInq, resCs, resLogs, resVisitors, resActs].some((r) => r.status === 401)) {
        handleLogout();
        return;
      }

      const [dataInq, dataCs, dataLogs, dataVisitors, dataActs] = await Promise.all([
        resInq.json(),
        resCs.json(),
        resLogs.json(),
        resVisitors.json(),
        resActs.json()
      ]);

      if (dataInq.success) setInquiries(dataInq.inquiries);
      if (dataCs.success) setCaseStudies(dataCs.caseStudies);
      if (dataLogs.success) setAuditLogs(dataLogs.auditLogs);
      if (dataVisitors.success) {
        setVisitors(dataVisitors.visitors);
        setActiveNowCount(dataVisitors.activeNow);
      }
      if (dataActs.success) setVisitorActivities(dataActs.activities);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      if (showLoadingIndicator) setIsLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const visitorId = localStorage.getItem('navigalex_visitor_id') || '';
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: loginUsername.trim(), 
          password: loginPassword,
          visitorId
        })
      });
      const data = await res.json();

      if (data.success && data.token) {
        try { window.sessionStorage.setItem('nvx_admin_token', data.token); } catch { /* keep the session in memory if storage is blocked */ }
        setToken(data.token);
        setAdminUser(data.admin);
        fetchDashboardData(data.token);
      } else {
        setLoginError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setLoginError('Server connection error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    try { window.sessionStorage.removeItem('nvx_admin_token'); } catch { /* token state is cleared in memory */ }
    setToken(null);
    setAdminUser(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIp(text);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  // Inquiry Status Update
  const handleUpdateInquiryStatus = async (inquiryId: string, newStatus: Inquiry['status']) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.map(inq => inq.id === inquiryId ? data.inquiry : inq));
        if (selectedInquiry?.id === inquiryId) {
          setSelectedInquiry(data.inquiry);
        }
        fetchDashboardData(token, false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Notes on Inquiry
  const handleSaveNotes = async () => {
    if (!token || !selectedInquiry) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notes: editingNotes })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.map(inq => inq.id === selectedInquiry.id ? data.inquiry : inq));
        setSelectedInquiry(data.inquiry);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete/Archive Inquiry
  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!token || !window.confirm(`Are you sure you want to archive inquiry ${inquiryId}?`)) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.filter(i => i.id !== inquiryId));
        if (selectedInquiry?.id === inquiryId) setSelectedInquiry(null);
        fetchDashboardData(token, false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Case Study (Create or Update)
  const handleSaveCaseStudy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingCaseStudy) {
        const res = await fetch(`/api/admin/case-studies/${editingCaseStudy.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(caseStudyForm)
        });
        const data = await res.json();
        if (res.status === 401) { handleLogout(); return; }
        if (!data.success) {
          window.alert(data.error || 'The case study could not be saved.');
          return;
        }
        if (data.success) {
          setCaseStudies(prev => prev.map(cs => cs.id === editingCaseStudy.id ? data.caseStudy : cs));
        }
      } else {
        const res = await fetch('/api/admin/case-studies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(caseStudyForm)
        });
        const data = await res.json();
        if (res.status === 401) { handleLogout(); return; }
        if (!data.success) {
          window.alert(data.error || 'The case study could not be saved.');
          return;
        }
        if (data.success) {
          setCaseStudies(prev => [data.caseStudy, ...prev]);
        }
      }
      setShowCaseStudyModal(false);
      setEditingCaseStudy(null);
      setCaseStudyForm({
        title: '',
        clientSector: 'Manufacturing & Engineering',
        region: '',
        dealSize: '',
        riskIdentified: '',
        advisoryProvided: '',
        concreteRoi: '',
        status: 'Draft'
      });
      fetchDashboardData(token, false);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Case Study
  const handleDeleteCaseStudy = async (csId: string) => {
    if (!token || !window.confirm('Delete this case study from the public platform?')) return;
    try {
      const res = await fetch(`/api/admin/case-studies/${csId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCaseStudies(prev => prev.filter(c => c.id !== csId));
        fetchDashboardData(token, false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Lists
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = 
      inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.company.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.primaryConcern.toLowerCase().includes(inquirySearch.toLowerCase());
    const matchesStatus = inquiryStatusFilter === 'All' || inq.status === inquiryStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredActivities = visitorActivities.filter(act => {
    const matchesSearch = 
      act.ip.toLowerCase().includes(activitySearch.toLowerCase()) ||
      act.path.toLowerCase().includes(activitySearch.toLowerCase()) ||
      act.details.toLowerCase().includes(activitySearch.toLowerCase()) ||
      act.browser.toLowerCase().includes(activitySearch.toLowerCase());
    const matchesType = activityTypeFilter === 'All' || act.eventType === activityTypeFilter;
    return matchesSearch && matchesType;
  });

  const filteredLogs = auditLogs.filter(log => {
    if (logSeverityFilter === 'All') return true;
    return log.severity === logSeverityFilter;
  });

  // 1. WHITE & BLUE LOGIN SCREEN (When not authenticated)
  if (!token || !adminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/60 text-slate-800 flex flex-col justify-center items-center p-6 font-['Inter'] relative overflow-hidden">
        {/* Decorative Blue Radiant Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-blue-400/15 to-indigo-400/15 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-white border border-blue-200/80 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-7">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 block">NAVIGALEX</span>
              <span className="text-[11px] font-extrabold text-blue-600 tracking-widest uppercase block mt-0.5">Admin Console</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Restricted administrative access. Use the credentials configured for this deployment.
            </p>
          </div>

          <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">Administrator login details are supplied by the site owner and are never displayed here.</p>

          {loginError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">User Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  placeholder="Admin username or email"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoggingIn ? "Verifying Credentials..." : "Authenticate & Open Console"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onBackToSite}
              className="text-xs text-slate-500 hover:text-blue-600 font-medium transition-colors cursor-pointer"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED WHITE & BLUE ADMIN CONSOLE
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Inter'] selection:bg-blue-600 selection:text-white">
      {/* Top Admin Bar in White & Deep Blue */}
      <header className="bg-white/95 border-b border-blue-100 sticky top-0 z-40 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base">NAVIGALEX ADMIN</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Telemetry
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block">User: <strong className="text-slate-800">admin</strong> (Super Administrator)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Auto-Refresh Indicator */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-xl border flex items-center gap-1.5 cursor-pointer transition-colors ${
                autoRefresh
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-100 border-slate-300 text-slate-500'
              }`}
              title="Toggle 4-second live polling"
            >
              <Activity className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-pulse text-emerald-600' : ''}`} />
              <span>{autoRefresh ? 'Live Polling (4s)' : 'Polling Paused'}</span>
            </button>

            <button
              onClick={() => fetchDashboardData(token, true)}
              disabled={isLoadingData}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
              title="Refresh Data Now"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            <button
              onClick={onBackToSite}
              className="px-4 py-2 text-xs bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-300 font-semibold cursor-pointer shadow-xs transition-colors"
            >
              Public Website
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content in White & Blue */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* KPI Summary Cards in White with Blue Accents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-blue-100 rounded-2xl space-y-2 shadow-xs hover:border-blue-300 transition-colors">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Real Visitor Sessions</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{visitors.length}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {activeNowCount} Active Now
              </span>
            </div>
          </div>

          <div className="p-5 bg-white border border-blue-100 rounded-2xl space-y-2 shadow-xs hover:border-blue-300 transition-colors">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Live Server Activity</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{visitorActivities.length}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Server-captured IPs
              </span>
            </div>
          </div>

          <div className="p-5 bg-white border border-blue-100 rounded-2xl space-y-2 shadow-xs hover:border-blue-300 transition-colors">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Client Inquiries</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{inquiries.length}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {inquiries.filter(i => i.status === 'New').length} Pending Review
              </span>
            </div>
          </div>

          <div className="p-5 bg-white border border-blue-100 rounded-2xl space-y-2 shadow-xs hover:border-blue-300 transition-colors">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Security Audit Trail</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{auditLogs.length}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('inquiries')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'inquiries'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white bg-transparent'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Client Inquiries & Pipeline ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('visitors')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'visitors'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white bg-transparent'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            <span>Real-Time Visitor IP & Activity ({visitorActivities.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('casestudies')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'casestudies'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white bg-transparent'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Case Study Submissions ({caseStudies.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('auditlogs')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'auditlogs'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white bg-transparent'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Audit Logs & Security ({auditLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: CLIENT INQUIRIES & PIPELINE */}
        {activeAdminTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={inquirySearch}
                  onChange={e => setInquirySearch(e.target.value)}
                  placeholder="Search by client name, company, or desk..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-semibold shrink-0">Filter Status:</span>
                <select
                  value={inquiryStatusFilter}
                  onChange={e => setInquiryStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="All">All Statuses ({inquiries.length})</option>
                  <option value="New">New ({inquiries.filter(i => i.status === 'New').length})</option>
                  <option value="Under Review">Under Review ({inquiries.filter(i => i.status === 'Under Review').length})</option>
                  <option value="NDA Executed">NDA Executed ({inquiries.filter(i => i.status === 'NDA Executed').length})</option>
                  <option value="Diagnostic Delivered">Diagnostic Delivered ({inquiries.filter(i => i.status === 'Diagnostic Delivered').length})</option>
                  <option value="Closed">Closed ({inquiries.filter(i => i.status === 'Closed').length})</option>
                </select>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Ref ID / Client</th>
                      <th className="py-3.5 px-4">Company & Sector</th>
                      <th className="py-3.5 px-4">Turnover</th>
                      <th className="py-3.5 px-4">Primary Concern</th>
                      <th className="py-3.5 px-4">Client IP</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          No client inquiries found matching current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredInquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-4 px-4">
                            <span className="font-mono text-blue-600 font-bold block">{inq.id}</span>
                            <span className="font-bold text-slate-900 block mt-0.5">{inq.name}</span>
                            <span className="text-[10px] text-slate-500">{inq.designation}</span>
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-semibold text-slate-800 block">{inq.company}</span>
                            <span className="text-[10px] text-slate-500">{inq.businessType}</span>
                          </td>

                          <td className="py-4 px-4 font-bold text-indigo-700">
                            {inq.turnover}
                          </td>

                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-medium inline-block">
                              {inq.primaryConcern}
                            </span>
                          </td>

                          <td className="py-4 px-4 font-mono text-[11px]">
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 block text-center font-bold">
                              {inq.ip}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-slate-700">
                            <div className="flex items-center gap-1.5 font-mono text-[11px]">
                              <Phone className="w-3 h-3 text-blue-600" />
                              <span>{inq.phone}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span className="truncate max-w-[140px]">{inq.email}</span>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as Inquiry['status'])}
                              className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                                inq.status === 'New' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                                inq.status === 'Under Review' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                                inq.status === 'NDA Executed' ? 'bg-purple-50 border-purple-200 text-purple-800' :
                                inq.status === 'Diagnostic Delivered' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                                'bg-slate-100 border-slate-200 text-slate-600'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Under Review">Under Review</option>
                              <option value="NDA Executed">NDA Executed</option>
                              <option value="Diagnostic Delivered">Diagnostic Delivered</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>

                          <td className="py-4 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedInquiry(inq);
                                setEditingNotes(inq.notes || '');
                              }}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              Review & Notes
                            </button>
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Archive inquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REAL-TIME LIVE VISITORS & IP ACTIVITY STREAM */}
        {activeAdminTab === 'visitors' && (
          <div className="space-y-6">
            {/* Real Visitors Header Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={activitySearch}
                  onChange={e => setActivitySearch(e.target.value)}
                  placeholder="Filter by IP, action, device, or route..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-semibold shrink-0">Filter Event:</span>
                <select
                  value={activityTypeFilter}
                  onChange={e => setActivityTypeFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="All">All Activities ({visitorActivities.length})</option>
                  <option value="PAGE_VIEW">Page Views</option>
                  <option value="SCAN_CONTRACT">Contract Scans</option>
                  <option value="SCAN_DSCR">Bank DSCR Scans</option>
                  <option value="SCAN_HEALTH">Health Diagnostics</option>
                  <option value="BOT_CHAT">Live Bot Chats</option>
                  <option value="INQUIRY_SUBMIT">Inquiry Submissions</option>
                  <option value="ADMIN_ACCESS">Admin Logins</option>
                </select>
              </div>
            </div>

            {/* Real-Time Live Activity Stream Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Live Real-Time Activity Feed ({filteredActivities.length} Events)
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500">Live server-captured activity</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Time</th>
                      <th className="py-3 px-4">Visitor IP Address</th>
                      <th className="py-3 px-4">Event Type</th>
                      <th className="py-3 px-4">Path / Section</th>
                      <th className="py-3 px-4">Action Details</th>
                      <th className="py-3 px-4">Device & Browser</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filteredActivities.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          No visitor activities captured yet. As users click pages or run scans, they appear here live.
                        </td>
                      </tr>
                    ) : (
                      filteredActivities.map((act) => (
                        <tr key={act.id} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                            {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                {act.ip}
                              </span>
                              <button
                                onClick={() => copyToClipboard(act.ip)}
                                className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                                title="Copy IP"
                              >
                                {copiedIp === act.ip ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              act.eventType === 'SCAN_CONTRACT' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                              act.eventType === 'SCAN_DSCR' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              act.eventType === 'SCAN_HEALTH' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              act.eventType === 'BOT_CHAT' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                              act.eventType === 'INQUIRY_SUBMIT' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              act.eventType === 'ADMIN_ACCESS' ? 'bg-slate-900 text-white' :
                              'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {act.eventType}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-700 font-bold">
                            {act.path}
                          </td>

                          <td className="py-3.5 px-4 font-sans text-xs text-slate-900 max-w-md">
                            {act.details}
                          </td>

                          <td className="py-3.5 px-4 font-sans text-[11px] text-slate-600 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              {act.device === 'Mobile' ? <Smartphone className="w-3.5 h-3.5 text-slate-400" /> : <Laptop className="w-3.5 h-3.5 text-slate-400" />}
                              <span>{act.browser} on {act.os}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Unique Visitors Session Summary Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Unique Active Visitor Sessions ({visitors.length} Unique Devices Today)
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Visitor ID</th>
                      <th className="py-3 px-4">IP Address</th>
                      <th className="py-3 px-4">Device / OS</th>
                      <th className="py-3 px-4">Pageviews</th>
                      <th className="py-3 px-4">Total Actions</th>
                      <th className="py-3 px-4">Last Active Path</th>
                      <th className="py-3 px-4">Last Seen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {visitors.map((v) => (
                      <tr key={v.visitorId} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{v.visitorId}</td>
                        <td className="py-3 px-4 font-bold text-blue-700">{v.ip}</td>
                        <td className="py-3 px-4 font-sans text-slate-600">{v.device} ({v.browser} on {v.os})</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{v.pageViewsCount}</td>
                        <td className="py-3 px-4 font-bold text-indigo-700">{v.activitiesCount}</td>
                        <td className="py-3 px-4 font-bold text-blue-600">{v.currentPath}</td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {new Date(v.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CASE STUDY SUBMISSIONS */}
        {activeAdminTab === 'casestudies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">Client Case Study Submissions</h3>
                <p className="text-xs text-slate-500">Manage verified client case studies. Publish only outcomes supported by client records and approval.</p>
              </div>
              <button
                onClick={() => {
                  setEditingCaseStudy(null);
                  setCaseStudyForm({
                    title: '',
                    clientSector: 'Manufacturing & Engineering',
                    region: '',
                    dealSize: '',
                    riskIdentified: '',
                    advisoryProvided: '',
                    concreteRoi: '',
                    status: 'Draft'
                  });
                  setShowCaseStudyModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Case Study</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((cs) => (
                <div key={cs.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-blue-600">{cs.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        cs.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        cs.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {cs.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{cs.title}</h4>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div><strong className="text-slate-800">Sector:</strong> {cs.clientSector} ({cs.region})</div>
                      <div><strong className="text-slate-800">Deal Size:</strong> {cs.dealSize}</div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-rose-700 uppercase block">Risk Identified:</span>
                        <p className="text-slate-700 text-[11px] mt-0.5 leading-relaxed">{cs.riskIdentified}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase block">Concrete ROI / Outcome:</span>
                        <p className="text-slate-700 text-[11px] mt-0.5 leading-relaxed font-medium">{cs.concreteRoi}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">By {cs.author}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCaseStudy(cs);
                          setCaseStudyForm({
                            title: cs.title,
                            clientSector: cs.clientSector,
                            region: cs.region,
                            dealSize: cs.dealSize,
                            riskIdentified: cs.riskIdentified,
                            advisoryProvided: cs.advisoryProvided,
                            concreteRoi: cs.concreteRoi,
                            status: cs.status
                          });
                          setShowCaseStudyModal(true);
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold text-[11px] cursor-pointer transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCaseStudy(cs.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BACKEND AUDIT LOGS */}
        {activeAdminTab === 'auditlogs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Admin Activity</h3>
                <p className="text-xs text-slate-500">Operational log of recent sign-ins, inquiry changes, and case-study actions. Up to 200 recent events are retained in the configured data store; this log is not tamper-proof evidence.</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-semibold">Filter Severity:</span>
                <select
                  value={logSeverityFilter}
                  onChange={e => setLogSeverityFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Events ({auditLogs.length})</option>
                  <option value="INFO">INFO ({auditLogs.filter(l => l.severity === 'INFO').length})</option>
                  <option value="WARNING">WARNING ({auditLogs.filter(l => l.severity === 'WARNING').length})</option>
                  <option value="CRITICAL">CRITICAL ({auditLogs.filter(l => l.severity === 'CRITICAL').length})</option>
                </select>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Event Type</th>
                      <th className="py-3 px-4">Actor / IP</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}{' '}
                          <span className="text-[10px] text-slate-400 block">{new Date(log.timestamp).toLocaleDateString()}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                            {log.eventType}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-slate-900 block font-sans text-xs font-bold">{log.actor}</span>
                          <span className="text-[10px] text-slate-400">{log.ip}</span>
                        </td>

                        <td className="py-3 px-4 font-sans text-slate-700 text-xs">
                          {log.description}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            log.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            log.severity === 'WARNING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {log.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: INQUIRY REVIEW & NOTES DRAWER */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600">{selectedInquiry.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {selectedInquiry.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedInquiry.name}</h3>
                <span className="text-xs text-slate-600">{selectedInquiry.designation} • {selectedInquiry.company}</span>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold block">Contact Direct</span>
                <span className="text-slate-900 font-mono font-bold block mt-0.5">{selectedInquiry.phone}</span>
                <span className="text-slate-600 block">{selectedInquiry.email}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold block">Enterprise Turnover</span>
                <span className="text-indigo-700 font-bold block mt-0.5">{selectedInquiry.turnover}</span>
                <span className="text-slate-600 block">{selectedInquiry.businessType}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-200">
                <span className="text-slate-500 uppercase text-[10px] font-bold block">Requested Advisory Desk</span>
                <span className="text-blue-700 font-bold block mt-0.5">{selectedInquiry.primaryConcern}</span>
                <span className="text-[11px] text-slate-500 mt-1 block">Preferred Outreach: {selectedInquiry.contactMethod}</span>
              </div>
            </div>

            {/* Status Change Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">Update Pipeline Stage</label>
              <div className="flex flex-wrap gap-2">
                {(['New', 'Under Review', 'NDA Executed', 'Diagnostic Delivered', 'Closed'] as Inquiry['status'][]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, st)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      selectedInquiry.status === st
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-blue-400'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Advocate / CA Review Notes */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Internal Review & Case Notes (Confidential)
              </label>
              <textarea
                rows={4}
                value={editingNotes}
                onChange={e => setEditingNotes(e.target.value)}
                placeholder="Add confidential notes from initial discovery call, contract clauses identified, CA feedback..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
              ></textarea>
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Save Internal Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CASE STUDY EDITOR */}
      {showCaseStudyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingCaseStudy ? 'Edit Case Study' : 'Create New Advisory Case Study'}
                </h3>
                <p className="text-xs text-slate-500">Publish verified enterprise outcomes and advisory turnarounds.</p>
              </div>
              <button
                onClick={() => setShowCaseStudyModal(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              ><span aria-label="Close" className="text-xl leading-none">×</span>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCaseStudy} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Title & Headline *</label>
                <input
                  type="text"
                  required
                  value={caseStudyForm.title}
                  onChange={e => setCaseStudyForm({...caseStudyForm, title: e.target.value})}
                  placeholder="e.g. Noida Automotive Component Manufacturer: ₹1.8 Cr Receivables Recovery"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Sector *</label>
                  <select
                    value={caseStudyForm.clientSector}
                    onChange={e => setCaseStudyForm({...caseStudyForm, clientSector: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option>Manufacturing & Engineering</option>
                    <option>Exporters & International Trade</option>
                    <option>Real Estate, Construction & Property</option>
                    <option>Distributors & Wholesale Trading</option>
                    <option>NBFC & Fintech Vendors</option>
                    <option>Chemicals & Pharmaceuticals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Region / Cluster *</label>
                  <input
                    type="text"
                    required
                    value={caseStudyForm.region}
                    onChange={e => setCaseStudyForm({...caseStudyForm, region: e.target.value})}
                    placeholder="e.g. Noida Phase-2, "
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Deal Size / Annual Turnover</label>
                <input
                  type="text"
                  value={caseStudyForm.dealSize}
                  onChange={e => setCaseStudyForm({...caseStudyForm, dealSize: e.target.value})}
                  placeholder="e.g. ₹42 Cr Annual Turnover"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Risk Identified & Client Challenge *</label>
                <textarea
                  rows={3}
                  required
                  value={caseStudyForm.riskIdentified}
                  onChange={e => setCaseStudyForm({...caseStudyForm, riskIdentified: e.target.value})}
                  placeholder="Describe the cash trap, unilateral penalty clause, or bank limit rejection faced..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Solution & Advisory Provided *</label>
                <textarea
                  rows={3}
                  required
                  value={caseStudyForm.advisoryProvided}
                  onChange={e => setCaseStudyForm({...caseStudyForm, advisoryProvided: e.target.value})}
                  placeholder="Describe how Navigalex CAs and Advocates structured the turnaround..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Concrete ROI / Tangible Outcome *</label>
                <input
                  type="text"
                  required
                  value={caseStudyForm.concreteRoi}
                  onChange={e => setCaseStudyForm({...caseStudyForm, concreteRoi: e.target.value})}
                  placeholder="Enter only a verified, evidence-backed client outcome; do not use estimates presented as facts."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 font-semibold">Publication Status:</span>
                  <select
                    value={caseStudyForm.status}
                    onChange={e => setCaseStudyForm({...caseStudyForm, status: e.target.value as CaseStudy['status']})}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 cursor-pointer"
                  >
                    <option value="Published">Published (Public)</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-colors cursor-pointer"
                >
                  {editingCaseStudy ? 'Update Case Study' : 'Save Case Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


