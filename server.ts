import express from 'express';
import path from 'node:path';
import crypto from 'node:crypto';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8080;

  // Enable trust proxy for accurate real visitor IP tracking behind Google Cloud Run / Load Balancers
  app.set('trust proxy', true);
  app.use(express.json({ limit: '8mb' }));

  // In-Memory Secure Admin Store
  const adminTokens = new Set<string>();
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
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim().replace(/^::ffff:/, '');
    }
    if (Array.isArray(forwarded) && forwarded.length > 0) {
      return forwarded[0].trim().replace(/^::ffff:/, '');
    }
    const sock = req.socket.remoteAddress || req.ip || '127.0.0.1';
    return sock.replace(/^::ffff:/, '');
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

  // Production telemetry starts empty and records only live visitor activity.

  let inquiries: Inquiry[] = [];

  let caseStudies: CaseStudy[] = [];

  let auditLogs: AuditLog[] = [];

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
  };

  // Auth Middleware
  const authenticateAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    if (!token || !adminTokens.has(token)) {
      const clientIp = getClientIp(req);
      recordAuditLog('Unknown', 'AUTH_FAILED', `Unauthorized attempt to access ${req.method} ${req.path}`, clientIp, 'WARNING');
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin credentials.' });
    }
    next();
  };

  // Public Telemetry: Real User Activity Tracking Endpoint
  app.post('/api/track/activity', (req, res) => {
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
  app.post('/api/inquiries/submit', (req, res) => {
    const { name, company, designation, email, phone, businessType, turnover, primaryConcern, contactMethod, visitorId } = req.body;
    const clientIp = getClientIp(req);
    
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are mandatory.' });
    }

    const newInquiry: Inquiry = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      company: company || 'Confidential Enterprise',
      designation: designation || 'Promoter / Director',
      email,
      phone,
      businessType: businessType || 'General Enterprise',
      turnover: turnover || '₹5 Cr - ₹25 Cr',
      primaryConcern: primaryConcern || 'Contract & Receivable Cash Flow Risk',
      contactMethod: contactMethod || 'Phone',
      status: 'New',
      submittedAt: new Date().toISOString(),
      ip: clientIp
    };

    inquiries.unshift(newInquiry);
    recordAuditLog('Public Client', 'INQUIRY_RECEIVED', `Confidential inquiry received from ${name} (${company}). Ref: ${newInquiry.id}`, clientIp);
    
    // Log real activity
    recordVisitorActivity(
      req, 
      visitorId || '', 
      'INQUIRY_SUBMIT', 
      '/contact', 
      `Submitted assessment inquiry: ${name} (${company}) [${turnover || 'Turnover not specified'}]`
    );

    res.json({
      success: true,
      inquiryId: newInquiry.id,
      message: 'Assessment inquiry received and queued for senior practice director review.'
    });
  });

  // Admin Auth: Login
  app.post('/api/admin/login', (req, res) => {
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
      adminTokens.add(token);
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
    
    if (token && adminTokens.has(token)) {
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

    const prevStatus = inquiry.status;
    if (status) inquiry.status = status;
    if (notes !== undefined) inquiry.notes = notes;

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
    recordAuditLog(ADMIN_CREDENTIALS.email, 'CASE_STUDY_CREATED', `Created new case study: "${title}" (ID: ${newCaseStudy.id})`, clientIp);

    res.json({ success: true, caseStudy: newCaseStudy });
  });

  // Admin Case Studies: PATCH
  app.patch('/api/admin/case-studies/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const clientIp = getClientIp(req);
    const cs = caseStudies.find(c => c.id === id);
    if (!cs) return res.status(404).json({ error: 'Case study not found.' });

    Object.assign(cs, req.body);
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
  app.post('/api/bot/chat', async (req, res) => {
    const { message, history, visitorId } = req.body;
    if (!message || typeof message !== 'string') return res.status(400).json({ error: 'Message is required' });
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
  app.post('/api/assessments/run', async (req, res) => {
    const { industry, revenue, serviceType, financialSummary, visitorId } = req.body;
    const summary = typeof financialSummary === 'string' ? financialSummary.trim() : '';
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

  app.post('/api/documents/analyze', async (req, res) => {
    const { documentText, fileName, visitorId } = req.body;
    const text = (documentText || "").trim();
    const effectiveFileName = fileName || 'Pasted Agreement Text';

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
  app.post('/api/cibil-scan', (req, res) => {
    const { turnover, monthlyEmi, ccLimit, overdueDebtors, annualOperatingProfit, visitorId } = req.body;
    const t = Number(turnover);
    const emi = Number(monthlyEmi);
    const cc = Number(ccLimit);
    const debtors = Number(overdueDebtors);
    const operatingProfit = Number(annualOperatingProfit);
    if (![t, emi, cc, debtors, operatingProfit].every(Number.isFinite) || t <= 0 || emi < 0 || cc < 0 || debtors < 0 || operatingProfit < 0) {
      return res.status(400).json({ error: 'Enter actual numeric figures for turnover, EMI, CC/OD limit, overdue receivables and annual operating profit.' });
    }
    recordVisitorActivity(req, visitorId || '', 'SCAN_DSCR', '/live-tools', 'Calculated banking metrics from user-supplied financial figures.');
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
      calculatedDscr: dscr === null ? 'Not meaningful with zero EMI' : dscr.toFixed(2) + 'x',
      annualOperatingProfit: operatingProfit.toFixed(2) + ' Cr',
      annualEmi: annualEmiCr.toFixed(2) + ' Cr',
      ccLimitShareOfTurnover: ccShare.toFixed(2) + '%',
      overdueReceivablesShareOfTurnover: overdueShare.toFixed(2) + '%',
      observations
    } });
  });

  app.use(express.static('dist'));
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







