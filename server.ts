import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8080;

  // Enable trust proxy for accurate real visitor IP tracking behind Google Cloud Run / Load Balancers
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '8mb' }));

  // Small in-process API rate limiter. On multi-instance deployments, move this
  // to a shared store (for example Redis) so limits apply across replicas.
  const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
  const rateLimit = (keyPrefix: string, maxRequests: number, windowMs: number) =>
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const now = Date.now();
      const key = `${keyPrefix}:${getClientIp(req)}`;
      let bucket = rateLimitBuckets.get(key);
      if (!bucket || bucket.resetAt <= now) {
        bucket = { count: 0, resetAt: now + windowMs };
        rateLimitBuckets.set(key, bucket);
      }
      bucket.count += 1;
      if (bucket.count > maxRequests) {
        res.setHeader('Retry-After', String(Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))));
        return res.status(429).json({ error: 'Too many requests. Please wait and try again.' });
      }
      // Keep the limiter bounded during long-running processes.
      if (rateLimitBuckets.size > 5000) {
        for (const [bucketKey, value] of rateLimitBuckets) {
          if (value.resetAt <= now) rateLimitBuckets.delete(bucketKey);
        }
      }
      next();
    };

  const inquiryRateLimit = rateLimit('inquiry', 8, 15 * 60 * 1000);
  const loginRateLimit = rateLimit('admin-login', 8, 15 * 60 * 1000);
  const botRateLimit = rateLimit('bot', 30, 60 * 1000);
  const assessmentRateLimit = rateLimit('assessment', 6, 15 * 60 * 1000);
  const documentRateLimit = rateLimit('document', 6, 15 * 60 * 1000);
  const financeRateLimit = rateLimit('finance', 30, 60 * 1000);
  const telemetryRateLimit = rateLimit('telemetry', 60, 60 * 1000);

  // In-Memory Secure Admin Store
  const adminTokens = new Map<string, number>();
  const ADMIN_CREDENTIALS = {
    username: process.env.ADMIN_USERNAME || 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@navigalex.com',
    password: process.env.ADMIN_PASSWORD || ''
  };

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
    eventType: 'AUTH_LOGIN' | 'AUTH_FAILED' | 'INQUIRY_RECEIVED' | 'STATUS_CHANGE' | 'CASE_STUDY_CREATED' | 'CASE_STUDY_UPDATED' | 'CASE_STUDY_DELETED' | 'DATA_EXPORT' | 'SECURITY_SCAN';
    description: string;
    ip: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
  }

  // Real Visitor Telemetry Interfaces
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

  // Real Visitor In-Memory Telemetry Stores
  const visitorSessions = new Map<string, VisitorSession>();
  const visitorActivities: VisitorActivity[] = [];

  // Helper: Extract real client IP accurately
  function getClientIp(req: express.Request): string {
    // Express resolves the forwarded address using the configured trusted proxy.
    // Do not trust a raw X-Forwarded-For header supplied by the caller.
    const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
    return clientIp.replace(/^::ffff:/, '');
  }

  // Helper: Parse client User Agent
  function parseUserAgent(ua: string = '') {
    let browser = 'Chrome';
    let os = 'Windows';
    let device = 'Desktop';

    if (/mobile|android|iphone|ipad|ipod/i.test(ua)) {
      device = 'Mobile';
    } else if (/tablet|ipad/i.test(ua)) {
      device = 'Tablet';
    }

    if (/chrome|crios/i.test(ua) && !/edge|edg|opr|opera/i.test(ua)) browser = 'Chrome';
    else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = 'Safari';
    else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
    else if (/edg/i.test(ua)) browser = 'Edge';
    else if (/opr|opera/i.test(ua)) browser = 'Opera';

    if (/windows/i.test(ua)) os = 'Windows';
    else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
    else if (/linux/i.test(ua)) os = 'Linux';

    return { browser, os, device };
  }

  // Helper: Record Real Visitor Activity
  function recordVisitorActivity(
    req: express.Request, 
    visitorId: string, 
    eventType: VisitorActivity['eventType'], 
    path: string, 
    details: string
  ): VisitorActivity {
    const ip = getClientIp(req);
    const ua = (req.headers['user-agent'] as string) || '';
    const { browser, os, device } = parseUserAgent(ua);
    const now = new Date().toISOString();
    const effectiveVisitorId = visitorId || `V-${ip.replace(/[^0-9]/g, '').slice(-6) || 'anon'}`;

    const activity: VisitorActivity = {
      id: `ACT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      visitorId: effectiveVisitorId,
      ip,
      timestamp: now,
      eventType,
      path: path || '/',
      details,
      browser,
      os,
      device
    };

    visitorActivities.unshift(activity);
    if (visitorActivities.length > 500) visitorActivities.pop();

    const existing = visitorSessions.get(effectiveVisitorId);
    if (existing) {
      existing.lastSeen = now;
      existing.ip = ip;
      existing.currentPath = path || existing.currentPath;
      existing.lastAction = details;
      existing.activitiesCount += 1;
      if (eventType === 'PAGE_VIEW') existing.pageViewsCount += 1;
    } else {
      visitorSessions.set(effectiveVisitorId, {
        visitorId: effectiveVisitorId,
        ip,
        browser,
        os,
        device,
        firstSeen: now,
        lastSeen: now,
        pageViewsCount: eventType === 'PAGE_VIEW' ? 1 : 0,
        activitiesCount: 1,
        currentPath: path || '/',
        lastAction: details
      });
    }

    return activity;
  }

  // JSON persistence is suitable only for a single process with a durable mounted volume.
  // Use a shared database before enabling multiple replicas.
  const dataDir = path.resolve(process.env.NAVIGALEX_DATA_DIR || './data');
  const dataFile = path.join(dataDir, 'store.json');
  interface PersistedState {
    inquiries?: Inquiry[];
    caseStudies?: CaseStudy[];
    auditLogs?: AuditLog[];
    visitorSessions?: VisitorSession[];
    visitorActivities?: VisitorActivity[];
  }
  let initialState: PersistedState = {};
  try {
    const loaded: unknown = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    if (loaded && typeof loaded === 'object') initialState = loaded as PersistedState;
  } catch (error: any) {
    if (error?.code !== 'ENOENT') console.error('Persistent store read failed:', error?.message || error);
  }
  let inquiries: Inquiry[] = Array.isArray(initialState.inquiries) ? initialState.inquiries : [];
  let caseStudies: CaseStudy[] = Array.isArray(initialState.caseStudies) ? initialState.caseStudies : [];
  let auditLogs: AuditLog[] = Array.isArray(initialState.auditLogs) ? initialState.auditLogs : [];
  if (Array.isArray(initialState.visitorSessions)) {
    for (const session of initialState.visitorSessions) {
      if (session && typeof session.visitorId === 'string') visitorSessions.set(session.visitorId, session);
    }
  }
  if (Array.isArray(initialState.visitorActivities)) visitorActivities.push(...initialState.visitorActivities.slice(0, 500));
  const persistState = () => {
    try {
      fs.mkdirSync(dataDir, { recursive: true, mode: 0o700 });
      const tmp = dataFile + '.tmp';
      const state: PersistedState = {
        inquiries, caseStudies, auditLogs: auditLogs.slice(0, 200),
        visitorSessions: Array.from(visitorSessions.values()).slice(0, 5000),
        visitorActivities: visitorActivities.slice(0, 500)
      };
      fs.writeFileSync(tmp, JSON.stringify(state), { encoding: 'utf8', mode: 0o600 });
      fs.renameSync(tmp, dataFile);
    } catch (error) {
      console.error('CRITICAL: Navigalex persistent store write failed:', error);
    }
  };
  persistState();

  // Helper to record an audit log
  const recordAuditLog = (actor: string, eventType: AuditLog['eventType'], description: string, ip: string, severity: AuditLog['severity'] = 'INFO') => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor,
      eventType,
      description,
      ip,
      severity
    };
    auditLogs.unshift(newLog);
    if (auditLogs.length > 200) auditLogs.pop(); // keep last 200 logs
    persistState();
  };

  // Auth Middleware
  const authenticateAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    const tokenExpiresAt = token ? adminTokens.get(token) : undefined;
    if (!token || !tokenExpiresAt || tokenExpiresAt <= Date.now()) {
      if (token) adminTokens.delete(token);
      const clientIp = getClientIp(req);
      recordAuditLog('Unknown', 'AUTH_FAILED', `Unauthorized attempt to access ${req.method} ${req.path}`, clientIp, 'WARNING');
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin credentials.' });
    }
    next();
  };

  // Public Telemetry: Real User Activity Tracking Endpoint
  app.post('/api/track/activity', telemetryRateLimit, (req, res) => {
    const { visitorId, path } = req.body;
    const cleanPath = typeof path === 'string' && path.startsWith('/') ? path.slice(0, 200) : '/';
    const act = recordVisitorActivity(
      req,
      typeof visitorId === 'string' ? visitorId.slice(0, 120) : '',
      'PAGE_VIEW',
      cleanPath,
      'Viewed page'
    );
    res.json({ success: true, activityId: act.id });
  });

  // Admin: Get Real Visitors List
  app.get('/api/admin/visitors', authenticateAdmin, (req, res) => {
    const sessions = Array.from(visitorSessions.values());
    const fifteenMinsAgo = Date.now() - 15 * 60 * 1000;
    const activeNow = sessions.filter(s => new Date(s.lastSeen).getTime() > fifteenMinsAgo).length;

    res.json({
      success: true,
      visitors: sessions.sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()),
      totalVisitors: sessions.length,
      activeNow
    });
  });

  // Admin: Get Real Activity Logs
  app.get('/api/admin/visitor-activities', authenticateAdmin, (req, res) => {
    res.json({
      success: true,
      activities: visitorActivities,
      totalCount: visitorActivities.length
    });
  });

  // Public: Submit Client Inquiry
  app.post('/api/inquiries/submit', inquiryRateLimit, async (req, res) => {
    const { name, company, designation, email, phone, businessType, turnover, primaryConcern, contactMethod, visitorId } = req.body;
    const clientIp = getClientIp(req);
    
    const cleanText = (value: unknown, maxLength: number): string =>
      typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
    const safeName = cleanText(name, 120);
    const safeCompany = cleanText(company, 160);
    const safeDesignation = cleanText(designation, 120);
    const safeEmail = cleanText(email, 254).toLowerCase();
    const safePhone = cleanText(phone, 32);
    const safeBusinessType = cleanText(businessType, 120);
    const safeTurnover = cleanText(turnover, 120);
    const safePrimaryConcern = cleanText(primaryConcern, 2000);
    const safeContactMethod = cleanText(contactMethod, 40);
    const safeVisitorId = cleanText(visitorId, 120);

    if (!safeName || !safeEmail || !safePhone) {
      return res.status(400).json({ error: 'Name, email, and phone are mandatory.' });
    }
    if (safeName.length < 2 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(safeEmail) ||
        !/^[+()\\d .-]{7,32}$/.test(safePhone)) {
      return res.status(400).json({ error: 'Enter a valid name, email address, and phone number.' });
    }

    const newInquiry: Inquiry = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: safeName,
      company: safeCompany || 'Confidential Enterprise',
      designation: safeDesignation || 'Promoter / Director',
      email: safeEmail,
      phone: safePhone,
      businessType: safeBusinessType || 'General Enterprise',
      turnover: safeTurnover || 'Not specified',
      primaryConcern: safePrimaryConcern || 'General advisory inquiry',
      contactMethod: safeContactMethod || 'Phone',
      status: 'New',
      submittedAt: new Date().toISOString(),
      ip: clientIp
    };

    const resendApiKey = process.env.RESEND_API_KEY;
    const inquiryRecipient = process.env.INQUIRY_TO_EMAIL;
    const resendFrom = process.env.RESEND_FROM_EMAIL;

    // Do not claim an inquiry was received unless a durable delivery path is configured.
    if (!resendApiKey || !inquiryRecipient || !resendFrom) {
      return res.status(503).json({
        error: 'The inquiry service is temporarily unavailable. Please use the published contact details or try again later.'
      });
    }

    const emailText = [
      'New Navigalex website inquiry',
      '',
      `Reference: ${newInquiry.id}`,
      `Name: ${newInquiry.name}`,
      `Company: ${newInquiry.company}`,
      `Designation: ${newInquiry.designation}`,
      `Email: ${newInquiry.email}`,
      `Phone: ${newInquiry.phone}`,
      `Business type: ${newInquiry.businessType}`,
      `Turnover: ${newInquiry.turnover}`,
      `Primary concern: ${newInquiry.primaryConcern}`,
      `Preferred contact: ${newInquiry.contactMethod}`,
      `Submitted at: ${newInquiry.submittedAt}`
    ].join('\\n');

    try {
      const delivery = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: resendFrom,
          to: [inquiryRecipient],
          reply_to: newInquiry.email,
          subject: `Navigalex inquiry ${newInquiry.id} — ${newInquiry.company}`,
          text: emailText
        }),
        signal: AbortSignal.timeout(10000)
      });
      if (!delivery.ok) {
        console.error('Inquiry email provider returned an error:', delivery.status);
        return res.status(502).json({ error: 'We could not deliver your inquiry right now. Please try again later.' });
      }
    } catch (error) {
      console.error('Inquiry email delivery failed:', error);
      return res.status(502).json({ error: 'We could not deliver your inquiry right now. Please try again later.' });
    }

    inquiries.unshift(newInquiry);
    persistState();
    recordAuditLog('Public Client', 'INQUIRY_RECEIVED', `Inquiry email delivered for ${newInquiry.id}`, clientIp);
    
    // Log real activity
    recordVisitorActivity(
      req, 
      safeVisitorId, 
      'INQUIRY_SUBMIT', 
      '/contact', 
      `Submitted assessment inquiry: ${name} (${company}) [${turnover || 'Turnover not specified'}]`
    );

    res.json({
      success: true,
      inquiryId: newInquiry.id,
      message: 'Your inquiry has been delivered to the Navigalex team.'
    });
  });

  // Admin Auth: Login
  app.post('/api/admin/login', loginRateLimit, (req, res) => {
    if (!ADMIN_CREDENTIALS.username || !ADMIN_CREDENTIALS.password) {
      return res.status(503).json({ error: 'Admin authentication is not configured.' });
    }
    const { email, username, password, visitorId } = req.body;
    const identifier = (username || email || '').trim().toLowerCase();
    const clientIp = getClientIp(req);

    const isValidUser = identifier === ADMIN_CREDENTIALS.username.toLowerCase() || identifier === ADMIN_CREDENTIALS.email.toLowerCase();
    const isValidPass = password === ADMIN_CREDENTIALS.password;

    if (isValidUser && isValidPass) {
      const token = `nvx-token-${Date.now()}-${crypto.randomUUID()}`;
      adminTokens.set(token, Date.now() + 8 * 60 * 60 * 1000);
      recordAuditLog(identifier, 'AUTH_LOGIN', `Admin session established successfully. Token issued.`, clientIp, 'INFO');
      recordVisitorActivity(req, visitorId || '', 'ADMIN_ACCESS', '/admin', `Admin user logged in successfully (${identifier})`);

      return res.json({
        success: true,
        token,
        admin: {
          username: ADMIN_CREDENTIALS.username,
          email: ADMIN_CREDENTIALS.email,
          role: 'Super Administrator',
          name: 'Practice Lead & Governance Officer',
          authenticatedAt: new Date().toISOString()
        }
      });
    }

    recordAuditLog(identifier || 'Anonymous', 'AUTH_FAILED', `Failed admin login attempt using identifier: ${identifier}`, clientIp, 'WARNING');
    return res.status(401).json({ error: 'Invalid admin username or password.' });
  });

  // Admin Auth: Verify Token
  app.get('/api/admin/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    const tokenExpiresAt = token ? adminTokens.get(token) : undefined;
    if (token && tokenExpiresAt && tokenExpiresAt > Date.now()) {
      return res.json({
        authenticated: true,
        admin: {
          username: ADMIN_CREDENTIALS.username,
          email: ADMIN_CREDENTIALS.email,
          role: 'Super Administrator',
          name: 'Practice Lead & Governance Officer'
        }
      });
    }
    if (token) adminTokens.delete(token);
    return res.status(401).json({ authenticated: false });
  });

  // Admin Inquiries: GET
  app.get('/api/admin/inquiries', authenticateAdmin, (req, res) => {
    res.json({
      success: true,
      inquiries,
      totalCount: inquiries.length
    });
  });

  // Admin Inquiries: PATCH Status / Notes
  app.patch('/api/admin/inquiries/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    const clientIp = getClientIp(req);
    
    const inquiry = inquiries.find(i => i.id === id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }

    const allowedStatuses = ['New', 'Under Review', 'NDA Executed', 'Diagnostic Delivered', 'Closed'];
    if (status !== undefined && !allowedStatuses.includes(status)) return res.status(400).json({ error: 'Invalid inquiry status.' });
    if (notes !== undefined && (typeof notes !== 'string' || notes.length > 4000)) return res.status(400).json({ error: 'Notes must be text under 4,000 characters.' });
    const prevStatus = inquiry.status;
    if (status) inquiry.status = status;
    if (notes !== undefined) inquiry.notes = notes.trim();
    persistState();

    recordAuditLog(
      ADMIN_CREDENTIALS.email, 
      'STATUS_CHANGE', 
      `Inquiry ${id} (${inquiry.company}) updated from "${prevStatus}" to "${inquiry.status}".`, 
      clientIp
    );

    res.json({ success: true, inquiry });
  });

  // Admin Inquiries: DELETE
  app.delete('/api/admin/inquiries/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const clientIp = getClientIp(req);
    const idx = inquiries.findIndex(i => i.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Inquiry not found' });

    const removed = inquiries.splice(idx, 1)[0];
    persistState();
    recordAuditLog(ADMIN_CREDENTIALS.email, 'STATUS_CHANGE', `Archived/deleted inquiry ${id} (${removed.company})`, clientIp, 'WARNING');

    res.json({ success: true, message: `Inquiry ${id} archived.` });
  });

  // Admin Case Studies: GET
  app.get('/api/admin/case-studies', authenticateAdmin, (req, res) => {
    res.json({
      success: true,
      caseStudies,
      totalCount: caseStudies.length
    });
  });

  // Admin Case Studies: POST
  app.post('/api/admin/case-studies', authenticateAdmin, (req, res) => {
    const { title, clientSector, region, dealSize, riskIdentified, advisoryProvided, concreteRoi, status } = req.body;
    const clientIp = getClientIp(req);
    
    if (!title || !clientSector || !riskIdentified || !advisoryProvided || !concreteRoi) {
      return res.status(400).json({ error: 'Title, client sector, risk description, advisory provided, and verified outcome are required.' });
    }

    const newCaseStudy: CaseStudy = {
      id: `CS-${crypto.randomUUID()}`,
      title,
      clientSector,
      region: region || 'Not disclosed',
      dealSize: dealSize || 'Not disclosed',
      riskIdentified,
      advisoryProvided,
      concreteRoi,
      status: status || 'Draft',
      submittedAt: new Date().toISOString(),
      author: 'Practice Director'
    };

    caseStudies.unshift(newCaseStudy);
    persistState();
    recordAuditLog(ADMIN_CREDENTIALS.email, 'CASE_STUDY_CREATED', `Created new case study: "${title}" (ID: ${newCaseStudy.id})`, clientIp);

    res.json({ success: true, caseStudy: newCaseStudy });
  });

  // Admin Case Studies: PATCH
  app.patch('/api/admin/case-studies/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const clientIp = getClientIp(req);
    const cs = caseStudies.find(c => c.id === id);
    if (!cs) return res.status(404).json({ error: 'Case study not found.' });

    const updates = req.body && typeof req.body === 'object' ? req.body : {};
    const allowedFields = ['title', 'clientSector', 'region', 'dealSize', 'riskIdentified', 'advisoryProvided', 'concreteRoi', 'status'];
    for (const field of allowedFields) if (Object.prototype.hasOwnProperty.call(updates, field)) (cs as any)[field] = String(updates[field]).slice(0, 4000);
    if (!['Published', 'Under Review', 'Draft'].includes(cs.status)) return res.status(400).json({ error: 'Invalid case study status.' });
    persistState();
    recordAuditLog(ADMIN_CREDENTIALS.email, 'CASE_STUDY_UPDATED', `Updated case study: ${cs.title} (ID: ${id})`, clientIp);

    res.json({ success: true, caseStudy: cs });
  });

  // Admin Case Studies: DELETE
  app.delete('/api/admin/case-studies/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const clientIp = getClientIp(req);
    const idx = caseStudies.findIndex(c => c.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Case study not found.' });

    const removed = caseStudies.splice(idx, 1)[0];
    recordAuditLog(ADMIN_CREDENTIALS.email, 'CASE_STUDY_DELETED', `Deleted case study ${id} (${removed.title})`, clientIp, 'WARNING');

    res.json({ success: true, message: `Case study ${id} deleted.` });
  });

  // Admin Audit Logs: GET
  app.get('/api/admin/audit-logs', authenticateAdmin, (req, res) => {
    res.json({
      success: true,
      auditLogs,
      totalCount: auditLogs.length
    });
  });

  // Initialize Gemini API client if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  // --- Document Analysis: Multi-Provider AI Helpers ---

  interface DocumentAnalysisResult {
    riskScore: number;
    riskLevel: string;
    summary: string;
    clauses: string[];
    recommendations: string[];
  }

  interface ProviderResponse {
    text: string;
    model: string;
  }

  function buildAnalysisPrompt(documentText: string, fileName: string): string {
    return `You are a senior Indian corporate contracts advisor. Review ONLY the document text supplied below and produce a personalized risk assessment for the business that submitted it.

Document name: ${fileName}
Document text:
"""
${documentText.slice(0, 12000)}
"""

Rules:
- Base every finding on the supplied text. Never invent clauses, facts, statistics, deadlines, fees, legal section numbers, benchmarks, or outcomes.
- Make findings document-specific: name the actual provision/topic and explain its practical commercial impact.
- Do not produce generic boilerplate warnings simply because a category was not found.
- If the submission is a report, summary, screenshot export, or otherwise not the underlying contract text, state that clearly and limit findings to what is actually visible. Do not fabricate missing contract terms.
- Keep the summary to 2-3 sentences.
- Return 3-8 meaningful findings and 3-8 concrete recommendations. Each recommendation must respond to a finding.
- Prefer concise bullet-ready wording.
- Use Indian context only when the supplied document itself supports it.

Respond with ONLY a JSON object (no markdown fences, no extra commentary) in exactly this shape:
{
  "riskScore": <integer 0-100>,
  "riskLevel": "<short risk level label>",
  "summary": "<2-3 sentence personalized executive summary>",
  "clauses": ["<document-specific finding 1>", "<document-specific finding 2>", "..."],
  "recommendations": ["<document-specific action 1>", "<document-specific action 2>", "..."]
}`;
  }
  function parseAnalysisJson(raw: string): DocumentAnalysisResult | null {
    try {
      const cleaned = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleaned);
      if (
        typeof parsed.riskScore !== 'number' ||
        !Array.isArray(parsed.clauses) ||
        !Array.isArray(parsed.recommendations)
      ) {
        return null;
      }
      return {
        riskScore: parsed.riskScore,
        riskLevel: typeof parsed.riskLevel === 'string' ? parsed.riskLevel : 'Moderate Risk (Needs Negotiation)',
        summary: typeof parsed.summary === 'string' ? parsed.summary : '',
        clauses: parsed.clauses.filter((c: unknown) => typeof c === 'string'),
        recommendations: parsed.recommendations.filter((r: unknown) => typeof r === 'string')
      };
    } catch {
      return null;
    }
  }

  async function analyzeWithClaude(prompt: string): Promise<ProviderResponse | null> {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) return null;
    const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model,
        max_tokens: 1536,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!resp.ok) {
      throw new Error(`Claude API error ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
    }
    const data: any = await resp.json();
    const text = data?.content?.[0]?.text;
    if (!text) throw new Error('Claude returned an empty response');
    return { text, model };
  }

  async function analyzeWithGemini(prompt: string): Promise<ProviderResponse | null> {
    if (!ai) return null;
    const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
    const response = await ai.models.generateContent({ model, contents: prompt });
    if (!response.text) throw new Error('Gemini returned an empty response');
    return { text: response.text, model };
  }

  async function analyzeWithVertex(prompt: string): Promise<ProviderResponse | null> {
    const project = process.env.GOOGLE_CLOUD_PROJECT;
    if (!project) return null;
    const model = process.env.VERTEX_MODEL || 'gemini-2.5-flash';
    const client = new GoogleGenAI({
      vertexai: true,
      project,
      location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
    });
    const response = await client.models.generateContent({ model, contents: prompt });
    if (!response.text) throw new Error('Vertex AI returned an empty response');
    return { text: response.text, model };
  }

  // Bot Chat Endpoint - provider-only, evidence-grounded responses
  app.post('/api/bot/chat', botRateLimit, async (req, res) => {
    const { message, history, visitorId } = req.body || {};
    if (typeof message !== 'string' || !message.trim()) return res.status(400).json({ error: 'Message is required' });
    if (message.length > 4000) return res.status(413).json({ error: 'Please keep each message under 4,000 characters.' });
    recordVisitorActivity(req, visitorId || '', 'BOT_CHAT', '/live-bot', 'Customer asked the advisory bot a question.');
    const recentHistory = Array.isArray(history) ? history.slice(-8) : [];
    const conversation = recentHistory
      .filter((item: any) => item && item.text)
      .map((item: any) => (item.role === 'user' ? 'User' : 'Navigalex Live') + ': ' + String(item.text).slice(0, 1200))
      .join('\n');
    const prompt = 'You are Navigalex Live, a senior business advisory assistant. Answer the exact user question using ONLY the facts in the conversation and the user message. Do not invent financial figures, legal conclusions, approvals, client outcomes, benchmarks, fees, deadlines, credentials or access to external systems. Do not promise an outcome. If a number or fact is missing, ask for it. For legal, tax or regulatory topics, clearly distinguish general information from professional advice. Keep the answer concise and useful.\n\nConversation:\n' +
      (conversation || '(none)') + '\n\nCurrent question:\n' + message;
    const providers: Array<{ name: string; run: () => Promise<ProviderResponse | null> }> = [
      { name: 'claude', run: () => analyzeWithClaude(prompt) },
      { name: 'gemini', run: () => analyzeWithGemini(prompt) },
      { name: 'vertex', run: () => analyzeWithVertex(prompt) }
    ];
    const failures: string[] = [];
    for (const provider of providers) {
      try {
        const result = await provider.run();
        if (result?.text?.trim()) return res.json({ success: true, reply: result.text.trim(), modelUsed: result.model, provider: provider.name });
        failures.push(provider.name + ': unavailable');
      } catch (err: any) { failures.push(provider.name + ': ' + (err?.message || String(err))); }
    }
    return res.status(503).json({ success: false, error: 'The advisory assistant is unavailable because no configured AI provider returned a response.', providers: failures.map((item) => item.split(':')[0]) });
  });
  // Diagnostics API Routes: Real Activity Hook
  app.post('/api/assessments/run', assessmentRateLimit, async (req, res) => {
    const { industry, revenue, serviceType, financialSummary, visitorId } = req.body || {};
    const summary = typeof financialSummary === 'string' ? financialSummary.trim() : '';
    if (summary.length > 20000) return res.status(413).json({ error: 'Assessment text is too large. Submit up to 20,000 characters.' });
    if (!industry || !revenue || summary.length < 40) {
      return res.status(400).json({ error: 'Enter the actual financial and operating facts you want assessed (at least 40 characters). No report is generated from preset assumptions.' });
    }
    recordVisitorActivity(req, visitorId || '', 'SCAN_HEALTH', '/live-tools', 'Ran Business Health Diagnostic from user-supplied business facts.');
    const prompt = 'You are a senior business advisory analyst. Review ONLY the user-supplied facts below. Do not invent figures, ratios, benchmarks, legal claims, deadlines or outcomes. Do not assume facts from the selected industry or revenue range. Return a concise personalized summary, evidence-based findings, concrete next actions, and missing-data items.\n\n' +
      'Industry: ' + industry + '\nRevenue range: ' + revenue + '\nService: ' + (serviceType || 'Business Health Assessment') + '\nUser-supplied facts:\n' + summary + '\n\n' +
      'Return ONLY JSON: {"summary":"2-3 sentence personalized summary","keyFindings":["finding 1"],"actionSteps":["action 1"],"dataGaps":["missing input"]}';
    const providers: Array<{ name: string; run: () => Promise<ProviderResponse | null> }> = [
      { name: 'claude', run: () => analyzeWithClaude(prompt) },
      { name: 'gemini', run: () => analyzeWithGemini(prompt) },
      { name: 'vertex', run: () => analyzeWithVertex(prompt) }
    ];
    let lastError = 'No configured AI provider.';
    for (const provider of providers) {
      try {
        const result = await provider.run();
        if (!result || !result.text) { lastError = provider.name + ' is not configured.'; continue; }
        const cleaned = result.text.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(cleaned);
        if (typeof parsed.summary !== 'string' || !Array.isArray(parsed.keyFindings) || !Array.isArray(parsed.actionSteps) || !Array.isArray(parsed.dataGaps)) {
          throw new Error('AI returned an invalid diagnostic structure.');
        }
        return res.json({ success: true, assessment: {
          industry, revenue, serviceType: serviceType || 'Business Health Assessment', createdAt: new Date().toISOString(),
          report: {
            executiveSummary: parsed.summary.trim(),
            keyFindings: parsed.keyFindings.filter((v: unknown) => typeof v === 'string').slice(0, 6),
            actionSteps: parsed.actionSteps.filter((v: unknown) => typeof v === 'string').slice(0, 6),
            dataGaps: parsed.dataGaps.filter((v: unknown) => typeof v === 'string').slice(0, 6)
          }
        } });
      } catch (err: any) { lastError = provider.name + ': ' + (err?.message || String(err)); }
    }
    return res.status(502).json({ error: 'The business assessment could not be generated from the supplied information.', detail: lastError });
  });

  app.post('/api/documents/analyze', documentRateLimit, async (req, res) => {
    const { documentText, fileName, visitorId } = req.body || {};
    const text = typeof documentText === 'string' ? documentText.trim() : '';
    const effectiveFileName = typeof fileName === 'string' ? fileName.trim().slice(0, 180) : 'Pasted Agreement Text';
    if (text.length > 100000) return res.status(413).json({ error: 'Document text is too large. Submit up to 100,000 characters.' });

    // Log real activity
    recordVisitorActivity(
      req,
      visitorId || '',
      'SCAN_CONTRACT',
      '/live-tools',
      `Analyzed contract clauses in "${effectiveFileName}" (${text.length} chars)`
    );

    if (!text || text.length < 80 || /^Uploaded file analysis:/i.test(text)) {
      return res.status(400).json({ error: 'Provide the actual contract text. The system does not generate a substantive review from a filename or upload acknowledgement alone.' });
    }

    const prompt = buildAnalysisPrompt(text, effectiveFileName);

    const providers: Array<{ name: string; run: () => Promise<ProviderResponse | null> }> = [
      { name: 'claude', run: () => analyzeWithClaude(prompt) },
      { name: 'gemini', run: () => analyzeWithGemini(prompt) },
      { name: 'vertex', run: () => analyzeWithVertex(prompt) }
    ];

    let lastError: string | null = null;

    for (const provider of providers) {
      try {
        const result = await provider.run();
        if (!result) continue; // provider not configured, try next

        const parsed = parseAnalysisJson(result.text);
        if (!parsed) {
          lastError = `${provider.name}/${result.model} returned unparsable output`;
          console.warn(`[documents/analyze] ${lastError}`);
          continue;
        }

        console.log(`[documents/analyze] provider=${provider.name} model=${result.model} used for "${effectiveFileName}"`);

        const riskScore = Math.max(0, Math.min(100, Math.round(parsed.riskScore)));
        return res.json({
          success: true,
          analysis: {
            fileName: effectiveFileName,
            riskScore: `${riskScore}/100`,
            riskLevel: parsed.riskLevel,
            summary: parsed.summary,
            clauses: parsed.clauses,
            recommendations: parsed.recommendations
          }
        });
      } catch (err: any) {
        lastError = err?.message || String(err);
        console.warn(`[documents/analyze] provider=${provider.name} failed: ${lastError}`);
      }
    }

    console.error(`[documents/analyze] all providers failed for "${effectiveFileName}". last error: ${lastError}`);
    return res.status(502).json({ error: 'All AI providers failed to analyze the document. Please try again later.' });
  });

  // Financial & CIBIL Health Scanner API: Real Activity Hook
  app.post('/api/cibil-scan', financeRateLimit, (req, res) => {
    const { turnover, monthlyEmi, ccLimit, overdueDebtors, annualOperatingProfit, visitorId } = req.body;
    const t = Number(turnover);
    const emi = Number(monthlyEmi);
    const cc = Number(ccLimit);
    const debtors = Number(overdueDebtors);
    const operatingProfit = Number(annualOperatingProfit);
    if (![t, emi, cc, debtors, operatingProfit].every(Number.isFinite) || t <= 0 || emi < 0 || cc < 0 || debtors < 0 || operatingProfit < 0 || t > 1e9 || emi > 1e7 || cc > 1e9 || debtors > 1e9 || operatingProfit > 1e9) {
      return res.status(400).json({ error: 'Enter actual numeric figures for turnover, EMI, CC/OD limit, overdue receivables and annual operating profit.' });
    }
    recordVisitorActivity(req, visitorId || '', 'SCAN_DSCR', '/live-tools', 'Calculated banking metrics from user-supplied financial figures.');
    // Indicative operating-profit proxy only. A formal DSCR needs verified cash flow available for
    // debt service and all scheduled principal and interest obligations.
    const annualEmiCr = (emi * 12) / 100;
    const dscr = annualEmiCr > 0 ? operatingProfit / annualEmiCr : null;
    const ccShare = t > 0 ? (cc / t) * 100 : 0;
    const overdueShare = t > 0 ? debtors / t : 0;
    const observations: string[] = [];
    if (annualEmiCr === 0) observations.push('No EMI burden was entered, so DSCR is not meaningful for this input set.');
    else observations.push('DSCR is calculated from the annual operating-profit and annualized EMI figures you entered.');
    if (operatingProfit < annualEmiCr) observations.push('The operating-profit figure entered is below the annual EMI burden; this warrants closer lender review.');
    if (overdueShare > 0) observations.push('Overdue receivables entered are ' + overdueShare.toFixed(2) + '% of annual turnover.');
    if (ccShare > 0) observations.push('The current CC/OD limit entered is ' + ccShare.toFixed(2) + '% of annual turnover.');
    res.json({ success: true, report: {
      calculatedDscr: dscr === null ? 'Not meaningful with zero EMI' : dscr.toFixed(2) + 'x (operating-profit proxy)',
      calculationDisclaimer: 'Indicative screening only. A formal DSCR requires verified cash flow available for debt service and all scheduled principal and interest obligations; have figures reviewed by a qualified finance professional.',
      annualOperatingProfit: operatingProfit.toFixed(2) + ' Cr',
      annualEmi: annualEmiCr.toFixed(2) + ' Cr',
      ccLimitShareOfTurnover: ccShare.toFixed(2) + '%',
      overdueReceivablesShareOfTurnover: overdueShare.toFixed(2) + '%',
      observations
    } });
  });

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, service: 'navigalex-api', timestamp: new Date().toISOString(), integrations: { inquiryEmailConfigured: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && process.env.INQUIRY_TO_EMAIL), aiProviderConfigured: Boolean(process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_CLOUD_PROJECT), adminConfigured: Boolean(process.env.ADMIN_PASSWORD) }, persistence: { directoryConfigured: Boolean(process.env.NAVIGALEX_DATA_DIR), directory: process.env.NAVIGALEX_DATA_DIR ? 'configured' : 'default-local-path' } });
  });

  app.use(express.static('dist', {
    setHeaders: (res, filePath) => {
      if (filePath.includes('/assets/') || filePath.includes('\\assets\\')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filePath.endsWith('/favicon.svg') || filePath.endsWith('\\favicon.svg')) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      } else if (filePath.endsWith('/index.html') || filePath.endsWith('\\index.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));
app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found.' }));

app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') { return next(); }
    res.sendFile(path.resolve('dist/index.html'));
  });

app.listen(Number(process.env.PORT) || 8080, "0.0.0.0", () => console.log(`Server running on 0.0.0.0:${process.env.PORT || 8080}`));
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});







