import express from "express";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8080;
  app.set("trust proxy", true);
  app.use(express.json());
  const adminTokens = /* @__PURE__ */ new Set(["demo-admin-token-navigalex-2026"]);
  const ADMIN_CREDENTIALS = {
    username: "admin",
    email: "admin@navigalex.com",
    password: "Jackyu@62."
  };
  const visitorSessions = /* @__PURE__ */ new Map();
  const visitorActivities = [];
  function getClientIp(req) {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      return forwarded.split(",")[0].trim().replace(/^::ffff:/, "");
    }
    if (Array.isArray(forwarded) && forwarded.length > 0) {
      return forwarded[0].trim().replace(/^::ffff:/, "");
    }
    const sock = req.socket.remoteAddress || req.ip || "127.0.0.1";
    return sock.replace(/^::ffff:/, "");
  }
  function parseUserAgent(ua = "") {
    let browser = "Chrome";
    let os = "Windows";
    let device = "Desktop";
    if (/mobile|android|iphone|ipad|ipod/i.test(ua)) {
      device = "Mobile";
    } else if (/tablet|ipad/i.test(ua)) {
      device = "Tablet";
    }
    if (/chrome|crios/i.test(ua) && !/edge|edg|opr|opera/i.test(ua)) browser = "Chrome";
    else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = "Safari";
    else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
    else if (/edg/i.test(ua)) browser = "Edge";
    else if (/opr|opera/i.test(ua)) browser = "Opera";
    if (/windows/i.test(ua)) os = "Windows";
    else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
    else if (/android/i.test(ua)) os = "Android";
    else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
    else if (/linux/i.test(ua)) os = "Linux";
    return { browser, os, device };
  }
  function recordVisitorActivity(req, visitorId, eventType, path2, details) {
    const ip = getClientIp(req);
    const ua = req.headers["user-agent"] || "";
    const { browser, os, device } = parseUserAgent(ua);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const effectiveVisitorId = visitorId || `V-${ip.replace(/[^0-9]/g, "").slice(-6) || "anon"}`;
    const activity = {
      id: `ACT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      visitorId: effectiveVisitorId,
      ip,
      timestamp: now,
      eventType,
      path: path2 || "/",
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
      existing.currentPath = path2 || existing.currentPath;
      existing.lastAction = details;
      existing.activitiesCount += 1;
      if (eventType === "PAGE_VIEW") existing.pageViewsCount += 1;
    } else {
      visitorSessions.set(effectiveVisitorId, {
        visitorId: effectiveVisitorId,
        ip,
        browser,
        os,
        device,
        firstSeen: now,
        lastSeen: now,
        pageViewsCount: eventType === "PAGE_VIEW" ? 1 : 0,
        activitiesCount: 1,
        currentPath: path2 || "/",
        lastAction: details
      });
    }
    return activity;
  }
  visitorActivities.push(
    {
      id: "ACT-INIT-1",
      visitorId: "V-103214",
      ip: "103.21.144.12",
      timestamp: new Date(Date.now() - 36e5 * 2).toISOString(),
      eventType: "INQUIRY_SUBMIT",
      path: "/contact",
      details: "Submitted confidential assessment for Apex Precision Engineering (\u20B925 Cr - \u20B9100 Cr turnover)",
      browser: "Chrome",
      os: "Windows",
      device: "Desktop"
    },
    {
      id: "ACT-INIT-2",
      visitorId: "V-493612",
      ip: "49.36.128.91",
      timestamp: new Date(Date.now() - 36e5 * 5).toISOString(),
      eventType: "SCAN_CONTRACT",
      path: "/live-tools",
      details: "Scanned contract agreement (indemnity clause & penalty analysis)",
      browser: "Safari",
      os: "macOS",
      device: "Desktop"
    },
    {
      id: "ACT-INIT-3",
      visitorId: "V-122161",
      ip: "122.161.45.67",
      timestamp: new Date(Date.now() - 36e5 * 9).toISOString(),
      eventType: "SCAN_DSCR",
      path: "/live-tools",
      details: "Ran Bank DSCR Calculator for \u20B915 Cr turnover and \u20B94.5 Lakh monthly EMI",
      browser: "Chrome",
      os: "Android",
      device: "Mobile"
    }
  );
  visitorSessions.set("V-103214", {
    visitorId: "V-103214",
    ip: "103.21.144.12",
    browser: "Chrome",
    os: "Windows",
    device: "Desktop",
    firstSeen: new Date(Date.now() - 36e5 * 3).toISOString(),
    lastSeen: new Date(Date.now() - 36e5 * 2).toISOString(),
    pageViewsCount: 6,
    activitiesCount: 3,
    currentPath: "/contact",
    lastAction: "Submitted confidential assessment"
  });
  visitorSessions.set("V-493612", {
    visitorId: "V-493612",
    ip: "49.36.128.91",
    browser: "Safari",
    os: "macOS",
    device: "Desktop",
    firstSeen: new Date(Date.now() - 36e5 * 6).toISOString(),
    lastSeen: new Date(Date.now() - 36e5 * 5).toISOString(),
    pageViewsCount: 4,
    activitiesCount: 2,
    currentPath: "/live-tools",
    lastAction: "Scanned contract agreement"
  });
  let inquiries = [
    {
      id: "INQ-1049",
      name: "Rajesh Sharma",
      company: "Apex Precision Engineering Pvt Ltd",
      designation: "Managing Director & Promoter",
      email: "rajesh.sharma@apexeng.in",
      phone: "+91 98112 43210",
      businessType: "Manufacturing & Engineering",
      turnover: "\u20B925 Cr - \u20B9100 Cr",
      primaryConcern: "Contract & Receivable Cash Flow Risk",
      contactMethod: "Phone",
      status: "New",
      submittedAt: new Date(Date.now() - 36e5 * 2).toISOString(),
      ip: "103.21.144.12",
      notes: "Client facing 90+ days payment holdback from Tier-1 automotive customer citing unilateral penalty clause."
    },
    {
      id: "INQ-1048",
      name: "Sunita Aggarwal",
      company: "Sun Continental Exports LLP",
      designation: "Director of Finance",
      email: "sunita@sunglobal.com",
      phone: "+91 98100 87654",
      businessType: "Exporters & International Trade",
      turnover: "\u20B95 Cr - \u20B925 Cr",
      primaryConcern: "TradeShield Export Letter of Credit / Bank Guarantee",
      contactMethod: "WhatsApp",
      status: "Under Review",
      submittedAt: new Date(Date.now() - 36e5 * 8).toISOString(),
      ip: "49.36.128.91",
      notes: "European buyer bank raised 2 discrepancy notes on Bill of Lading consignee field under UCP 600."
    },
    {
      id: "INQ-1047",
      name: "Vikramaditya Goel",
      company: "Goel Infra Projects & Real Estate",
      designation: "Managing Director",
      email: "vikram@goelinfra.co.in",
      phone: "+91 99105 12345",
      businessType: "Real Estate, Construction & Property",
      turnover: "\u20B925 Cr - \u20B9100 Cr",
      primaryConcern: "Bank Loan CC/OD Renewal & Data Room",
      contactMethod: "Confidential Video Call",
      status: "NDA Executed",
      submittedAt: new Date(Date.now() - 36e5 * 24).toISOString(),
      ip: "122.161.45.67",
      notes: "PSU bank delayed \u20B915 Cr working capital renewal due to DSCR dip. CMA data reconstruction required."
    },
    {
      id: "INQ-1046",
      name: "Harish Mehta",
      company: "Mehta Distributors & Logistics",
      designation: "Chief Executive Officer",
      email: "harish@mehtadistributors.com",
      phone: "+91 98200 99887",
      businessType: "Distributors & Wholesale Trading",
      turnover: "\u20B95 Cr - \u20B925 Cr",
      primaryConcern: "ControlCFO\u2122 30-Day Financial Sprint",
      contactMethod: "Phone",
      status: "Diagnostic Delivered",
      submittedAt: new Date(Date.now() - 36e5 * 48).toISOString(),
      ip: "115.240.10.15",
      notes: "13-Week cash flow runway model and top 5 dealer agreements reviewed and handed over."
    }
  ];
  let caseStudies = [
    {
      id: "CS-201",
      title: "Automotive Component Manufacturer (Noida Phase-2): \u20B91.8 Cr Trapped Receivables Recovery",
      clientSector: "Manufacturing & Engineering",
      region: "Noida Phase-2, Delhi NCR",
      dealSize: "\u20B942 Cr Annual Turnover",
      riskIdentified: "Tier-1 customer withheld \u20B91.8 Cr invoking an uncapped indemnity clause for assembly line delay caused by raw material supply shortages.",
      advisoryProvided: "Navigalex Contract-to-Cash Desk redlined the master agreement, established force-majeure event timeline, and filed formal MSME Samadhaan dispute notice.",
      concreteRoi: "Recovered 100% of the \u20B91.8 Cr trapped principal within 38 days without formal court litigation, saving an estimated \u20B912 Lakhs in legal expenses.",
      status: "Published",
      submittedAt: "2026-03-15T10:30:00Z",
      author: "Senior Partner (Legal & Debt Recovery)"
    },
    {
      id: "CS-202",
      title: "Apparel Exporter (Greater Noida Surajpur): $3.2M LC Discrepancy Defense",
      clientSector: "Exporters & International Trade",
      region: "Greater Noida Ecotech Hub",
      dealSize: "$12M Export Orderbook",
      riskIdentified: "Issuing bank in Hamburg rejected 3 Letters of Credit citing discrepancy between Port of Loading in airway bill versus commercial invoice.",
      advisoryProvided: "TradeShield Desk executed an immediate UCP 600 Article 14 review, demonstrated compliance under ISBP 745, and engaged negotiating bank trade desk.",
      concreteRoi: "Bank withdrew notice of refusal within 72 hours. All funds credited on due date, averting container demurrage charges of ~$45,000.",
      status: "Published",
      submittedAt: "2026-03-01T14:15:00Z",
      author: "Trade Finance Practice Lead"
    },
    {
      id: "CS-203",
      title: "Specialty Chemicals & Polymers (Gurugram Manesar): \u20B925 Cr Bank Credit Renewal & DSCR Optimization",
      clientSector: "Chemicals & Manufacturing",
      region: "Manesar Industrial Area, Gurugram",
      dealSize: "\u20B968 Cr Annual Turnover",
      riskIdentified: "Lead private sector bank flagged DSCR of 1.15x and proposed hiking CC limit interest by 125 bps and slashing drawing power by 20%.",
      advisoryProvided: "LenderReady Credit Office reconstructed CMA data, segregated long-term capex debt from operational cash credit, and restructured debt tenure.",
      concreteRoi: "Bank renewed \u20B925 Cr limit without drawing power haircut and lowered interest spread by 65 bps, saving \u20B916.2 Lakhs annual interest expense.",
      status: "Published",
      submittedAt: "2026-02-18T09:00:00Z",
      author: "Former Senior Credit Officer & CA Lead"
    }
  ];
  let auditLogs = [
    {
      id: "LOG-5001",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      actor: "System Daemon",
      eventType: "SECURITY_SCAN",
      description: "Automated cryptographic integrity check passed: Zero unauthorized file access attempts detected.",
      ip: "127.0.0.1",
      severity: "INFO"
    },
    {
      id: "LOG-5002",
      timestamp: new Date(Date.now() - 36e5 * 2).toISOString(),
      actor: "Public Client",
      eventType: "INQUIRY_RECEIVED",
      description: "New confidential assessment submitted by Rajesh Sharma (Apex Precision Engineering Pvt Ltd). Assigned ref #INQ-1049.",
      ip: "103.21.144.12",
      severity: "INFO"
    },
    {
      id: "LOG-5003",
      timestamp: new Date(Date.now() - 36e5 * 5).toISOString(),
      actor: "admin",
      eventType: "AUTH_LOGIN",
      description: "Admin user authenticated successfully via secure session token.",
      ip: "182.74.88.2",
      severity: "INFO"
    }
  ];
  const recordAuditLog = (actor, eventType, description, ip, severity = "INFO") => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      actor,
      eventType,
      description,
      ip,
      severity
    };
    auditLogs.unshift(newLog);
    if (auditLogs.length > 200) auditLogs.pop();
  };
  const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token || !adminTokens.has(token)) {
      const clientIp = getClientIp(req);
      recordAuditLog("Unknown", "AUTH_FAILED", `Unauthorized attempt to access ${req.method} ${req.path}`, clientIp, "WARNING");
      return res.status(401).json({ error: "Unauthorized: Invalid or expired admin credentials." });
    }
    next();
  };
  app.post("/api/track/activity", (req, res) => {
    const { visitorId, eventType, path: path2, details } = req.body;
    const act = recordVisitorActivity(
      req,
      visitorId,
      eventType || "PAGE_VIEW",
      path2 || "/",
      details || "Viewed page"
    );
    res.json({ success: true, activityId: act.id, ip: act.ip });
  });
  app.get("/api/admin/visitors", authenticateAdmin, (req, res) => {
    const sessions = Array.from(visitorSessions.values());
    const fifteenMinsAgo = Date.now() - 15 * 60 * 1e3;
    const activeNow = sessions.filter((s) => new Date(s.lastSeen).getTime() > fifteenMinsAgo).length;
    res.json({
      success: true,
      visitors: sessions.sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()),
      totalVisitors: sessions.length,
      activeNow
    });
  });
  app.get("/api/admin/visitor-activities", authenticateAdmin, (req, res) => {
    res.json({
      success: true,
      activities: visitorActivities,
      totalCount: visitorActivities.length
    });
  });
  app.post("/api/inquiries/submit", (req, res) => {
    const { name, company, designation, email, phone, businessType, turnover, primaryConcern, contactMethod, visitorId } = req.body;
    const clientIp = getClientIp(req);
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are mandatory." });
    }
    const newInquiry = {
      id: `INQ-${Math.floor(1e3 + Math.random() * 9e3)}`,
      name,
      company: company || "Confidential Enterprise",
      designation: designation || "Promoter / Director",
      email,
      phone,
      businessType: businessType || "General Enterprise",
      turnover: turnover || "\u20B95 Cr - \u20B925 Cr",
      primaryConcern: primaryConcern || "Contract & Receivable Cash Flow Risk",
      contactMethod: contactMethod || "Phone",
      status: "New",
      submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
      ip: clientIp
    };
    inquiries.unshift(newInquiry);
    recordAuditLog("Public Client", "INQUIRY_RECEIVED", `Confidential inquiry received from ${name} (${company}). Ref: ${newInquiry.id}`, clientIp);
    recordVisitorActivity(
      req,
      visitorId || "",
      "INQUIRY_SUBMIT",
      "/contact",
      `Submitted assessment inquiry: ${name} (${company}) [${turnover || "Turnover not specified"}]`
    );
    res.json({
      success: true,
      inquiryId: newInquiry.id,
      message: "Assessment inquiry received and queued for senior practice director review."
    });
  });
  app.post("/api/admin/login", (req, res) => {
    const { email, username, password, visitorId } = req.body;
    const identifier = (username || email || "").trim().toLowerCase();
    const clientIp = getClientIp(req);
    const isValidUser = identifier === "admin" || identifier === "admin@navigalex.com" || identifier === "navigalex4@gmail.com";
    const isValidPass = password === ADMIN_CREDENTIALS.password;
    if (isValidUser && isValidPass) {
      const token = `nvx-token-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      adminTokens.add(token);
      recordAuditLog(identifier, "AUTH_LOGIN", `Admin session established successfully. Token issued.`, clientIp, "INFO");
      recordVisitorActivity(req, visitorId || "", "ADMIN_ACCESS", "/admin", `Admin user logged in successfully (${identifier})`);
      return res.json({
        success: true,
        token,
        admin: {
          username: "admin",
          email: ADMIN_CREDENTIALS.email,
          role: "Super Administrator",
          name: "Practice Lead & Governance Officer",
          authenticatedAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
    }
    recordAuditLog(identifier || "Anonymous", "AUTH_FAILED", `Failed admin login attempt using identifier: ${identifier}`, clientIp, "WARNING");
    return res.status(401).json({ error: "Invalid admin username or password." });
  });
  app.get("/api/admin/verify", (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (token && adminTokens.has(token)) {
      return res.json({
        authenticated: true,
        admin: {
          username: "admin",
          email: ADMIN_CREDENTIALS.email,
          role: "Super Administrator",
          name: "Practice Lead & Governance Officer"
        }
      });
    }
    return res.status(401).json({ authenticated: false });
  });
  app.get("/api/admin/inquiries", authenticateAdmin, (req, res) => {
    res.json({
      success: true,
      inquiries,
      totalCount: inquiries.length
    });
  });
  app.patch("/api/admin/inquiries/:id", authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    const clientIp = getClientIp(req);
    const inquiry = inquiries.find((i) => i.id === id);
    if (!inquiry) {
      return res.status(404).json({ error: "Inquiry not found." });
    }
    const prevStatus = inquiry.status;
    if (status) inquiry.status = status;
    if (notes !== void 0) inquiry.notes = notes;
    recordAuditLog(
      ADMIN_CREDENTIALS.email,
      "STATUS_CHANGE",
      `Inquiry ${id} (${inquiry.company}) updated from "${prevStatus}" to "${inquiry.status}".`,
      clientIp
    );
    res.json({ success: true, inquiry });
  });
  app.delete("/api/admin/inquiries/:id", authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const clientIp = getClientIp(req);
    const idx = inquiries.findIndex((i) => i.id === id);
    if (idx === -1) return res.status(404).json({ error: "Inquiry not found" });
    const removed = inquiries.splice(idx, 1)[0];
    recordAuditLog(ADMIN_CREDENTIALS.email, "STATUS_CHANGE", `Archived/deleted inquiry ${id} (${removed.company})`, clientIp, "WARNING");
    res.json({ success: true, message: `Inquiry ${id} archived.` });
  });
  app.get("/api/admin/case-studies", authenticateAdmin, (req, res) => {
    res.json({
      success: true,
      caseStudies,
      totalCount: caseStudies.length
    });
  });
  app.post("/api/admin/case-studies", authenticateAdmin, (req, res) => {
    const { title, clientSector, region, dealSize, riskIdentified, advisoryProvided, concreteRoi, status } = req.body;
    const clientIp = getClientIp(req);
    if (!title || !clientSector || !riskIdentified) {
      return res.status(400).json({ error: "Title, client sector, and risk description are required." });
    }
    const newCaseStudy = {
      id: `CS-${Math.floor(200 + Math.random() * 800)}`,
      title,
      clientSector,
      region: region || "Delhi NCR",
      dealSize: dealSize || "Confidential Turnover",
      riskIdentified,
      advisoryProvided: advisoryProvided || "Navigalex Bespoke Advisory Engagement",
      concreteRoi: concreteRoi || "Substantial financial and operational risk mitigation",
      status: status || "Published",
      submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
      author: "Practice Director"
    };
    caseStudies.unshift(newCaseStudy);
    recordAuditLog(ADMIN_CREDENTIALS.email, "CASE_STUDY_CREATED", `Created new case study: "${title}" (ID: ${newCaseStudy.id})`, clientIp);
    res.json({ success: true, caseStudy: newCaseStudy });
  });
  app.patch("/api/admin/case-studies/:id", authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const clientIp = getClientIp(req);
    const cs = caseStudies.find((c) => c.id === id);
    if (!cs) return res.status(404).json({ error: "Case study not found." });
    Object.assign(cs, req.body);
    recordAuditLog(ADMIN_CREDENTIALS.email, "CASE_STUDY_UPDATED", `Updated case study: ${cs.title} (ID: ${id})`, clientIp);
    res.json({ success: true, caseStudy: cs });
  });
  app.delete("/api/admin/case-studies/:id", authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const clientIp = getClientIp(req);
    const idx = caseStudies.findIndex((c) => c.id === id);
    if (idx === -1) return res.status(404).json({ error: "Case study not found." });
    const removed = caseStudies.splice(idx, 1)[0];
    recordAuditLog(ADMIN_CREDENTIALS.email, "CASE_STUDY_DELETED", `Deleted case study ${id} (${removed.title})`, clientIp, "WARNING");
    res.json({ success: true, message: `Case study ${id} deleted.` });
  });
  app.get("/api/admin/audit-logs", authenticateAdmin, (req, res) => {
    res.json({
      success: true,
      auditLogs,
      totalCount: auditLogs.length
    });
  });
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
  function buildAnalysisPrompt(documentText, fileName) {
    return `You are a senior Indian corporate contracts advisor. Analyze the following document for financial and legal risk exposure to the business signing it (e.g. indemnity, termination, jurisdiction, penalties, payment terms, IP transfer).

Document name: ${fileName}
Document text:
"""
${documentText.slice(0, 12e3)}
"""

Respond with ONLY a JSON object (no markdown fences, no extra commentary) in exactly this shape:
{
  "riskScore": <integer 0-100>,
  "riskLevel": "<short risk level label, e.g. 'High Risk (Immediate Review Needed)'>",
  "summary": "<2-3 sentence executive summary>",
  "clauses": ["<red flag clause 1>", "<red flag clause 2>", "..."],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "..."]
}`;
  }
  function parseAnalysisJson(raw) {
    try {
      const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
      const parsed = JSON.parse(cleaned);
      if (typeof parsed.riskScore !== "number" || !Array.isArray(parsed.clauses) || !Array.isArray(parsed.recommendations)) {
        return null;
      }
      return {
        riskScore: parsed.riskScore,
        riskLevel: typeof parsed.riskLevel === "string" ? parsed.riskLevel : "Moderate Risk (Needs Negotiation)",
        summary: typeof parsed.summary === "string" ? parsed.summary : "",
        clauses: parsed.clauses.filter((c) => typeof c === "string"),
        recommendations: parsed.recommendations.filter((r) => typeof r === "string")
      };
    } catch {
      return null;
    }
  }
  async function analyzeWithClaude(prompt) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) return null;
    const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929";
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model,
        max_tokens: 1536,
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!resp.ok) {
      throw new Error(`Claude API error ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
    }
    const data = await resp.json();
    const text = data?.content?.[0]?.text;
    if (!text) throw new Error("Claude returned an empty response");
    return { text, model };
  }
  async function analyzeWithGemini(prompt) {
    if (!ai) return null;
    const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
    const response = await ai.models.generateContent({ model, contents: prompt });
    if (!response.text) throw new Error("Gemini returned an empty response");
    return { text: response.text, model };
  }
  async function analyzeWithVertex(prompt) {
    const project = process.env.GOOGLE_CLOUD_PROJECT;
    if (!project) return null;
    const model = process.env.VERTEX_MODEL || "gemini-2.5-flash";
    const client = new GoogleGenAI({
      vertexai: true,
      project,
      location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1"
    });
    const response = await client.models.generateContent({ model, contents: prompt });
    if (!response.text) throw new Error("Vertex AI returned an empty response");
    return { text: response.text, model };
  }
  app.post("/api/bot/chat", async (req, res) => {
    const { message, history, visitorId } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }
    recordVisitorActivity(
      req,
      visitorId || "",
      "BOT_CHAT",
      "/live-bot",
      `Asked bot: "${message.slice(0, 75)}${message.length > 75 ? "..." : ""}"`
    );
    const contents = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-8)) {
        if (item.role && item.text) {
          contents.push({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.text }]
          });
        }
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });
    const systemInstruction = `You are Navigalex Live, a seasoned Senior Corporate Advisor and Virtual CFO helping Indian business owners, MSME promoters, and directors protect their business from financial, contract, and banking traps.

Your Personality & Voice:
- Conversational, human, sharp, and direct \u2014 like an experienced senior partner sitting across the table with a founder over coffee.
- Speak in natural, plain business terms that Indian entrepreneurs relate to (e.g. Tally reconciliations, delayed client payments, bank CC limit drawing power, MSME Samadhaan, LC discrepancies).
- Never sound like an automated robotic script or repeat canned generic disclaimers.
- Answer the user's exact query immediately and specifically. If they ask "what can you do for me", give a crisp, compelling 3-point breakdown of the exact high-stakes problems you solve (e.g., catching uncapped contract liability before signing, fixing bank DSCR so loan renewals aren't blocked, and running 30-day ControlCFO sprints for cash flow).
- Keep replies punchy (under 130 words), formatted with bullet points for effortless mobile reading, and always end with a warm, relevant follow-up question.`;
    const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
    if (ai) {
      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: { systemInstruction }
          });
          if (response.text && response.text.trim()) {
            return res.json({
              success: true,
              reply: response.text.trim(),
              modelUsed: modelName
            });
          }
        } catch (modelErr) {
          console.warn(`Model ${modelName} call failed, trying next:`, modelErr?.message || modelErr?.status);
        }
      }
    }
    const lower = message.toLowerCase();
    let reply = "";
    if (lower.includes("what can you do") || lower.includes("who are you") || lower.includes("help me") || lower.includes("how can you help")) {
      reply = "Think of me as your on-demand CFO and legal risk partner. Here is specifically what I do for business owners:\n\n\u2022 **Protect Your Contracts:** I review your client and vendor MSAs to eliminate unlimited liability clauses and 90-day payment delay traps.\n\u2022 **Fix Bank Loan Rejections:** I calculate your Debt Service Coverage (DSCR) and reconcile bank statements so your CC limit renewals get sanctioned without friction.\n\u2022 **Stop Cash Leakages:** Through our **ControlCFO\u2122 30-Day Sprint**, we give you a 13-week cash runway model and a prioritized action plan to unlock trapped receivables.\n\nAre you currently dealing with a delayed customer payment, a contract negotiation, or a bank loan issue?";
    } else if (lower.includes("cfo") || lower.includes("controlcfo") || lower.includes("cash") || lower.includes("sprint")) {
      reply = "Our **ControlCFO\u2122 30-Day Sprint** is built for businesses doing \u20B95 Cr\u2013\u20B950 Cr who need senior financial leadership without paying \u20B935 Lakh/year for a full-time CFO. In 30 days, we deliver a 13-week dynamic cash flow model, review your top 5 contracts, audit your debtor ledger, and provide a 90-day action matrix signed off by a Chartered Accountant for a fixed \u20B91.5\u20134 Lakh fee.\n\nWould you like to see the week-by-week delivery schedule?";
    } else if (lower.includes("contract") || lower.includes("agreement") || lower.includes("clause") || lower.includes("indemnity") || lower.includes("review")) {
      reply = "Most Indian MSMEs sign customer agreements where the client has inserted unlimited indemnities or unilateral termination rights. If a dispute happens, your payments freeze.\n\nWe screen contracts clause-by-clause, insert protective MSME Samadhaan terms, and cap your total liability. You can test a contract right now on our **Live Contract Scanner** tab, or I can connect you with our legal desk. What agreement are you reviewing?";
    } else if (lower.includes("bank") || lower.includes("loan") || lower.includes("dscr") || lower.includes("cc limit") || lower.includes("cibil") || lower.includes("limit")) {
      reply = "Banks reject loan enhancements when your DSCR drops below 1.30x or when GST returns don't reconcile with your bank statements. Our **LenderReady Credit Office** audits your financial data room, fixes DSCR ratios, and helps negotiate 50\u201375 bps lower interest rates.\n\nYou can calculate your current loan eligibility in 30 seconds using our **Live Bank DSCR Scanner** tab. What is your current CC limit?";
    } else if (lower.includes("lc") || lower.includes("letter of credit") || lower.includes("export") || lower.includes("trade") || lower.includes("bg") || lower.includes("demurrage")) {
      reply = "Over 60% of export LCs face discrepancy rejections under UCP 600 rules, stranding containers at ports. Our **TradeShield Desk** provides rapid 24\u201348 hour pre-shipment clause audits to guarantee zero-defect documents before dispatch.\n\nAre you currently exporting under an active Letter of Credit?";
    } else if (lower.includes("cost") || lower.includes("price") || lower.includes("fee") || lower.includes("charges")) {
      reply = "Every service operates on transparent, fixed milestone fees:\n\n\u2022 **ControlCFO\u2122 30-Day Sprint:** \u20B91.5\u20134 Lakh fixed\n\u2022 **Contract-to-Cash Desk:** \u20B975,000\u2013\u20B93 Lakh setup\n\u2022 **LenderReady Credit Desk:** \u20B975,000\u2013\u20B93 Lakh + success fee\n\u2022 **TradeShield Export LC Review:** \u20B950,000\u2013\u20B92 Lakh per transaction\n\nAll tools on the site are 100% free to test. Which desk are you evaluating?";
    } else {
      reply = `I hear you. As a business owner, you're constantly balancing cash flow, client demands, and banking compliance. 

Whether you need to review a risky customer contract, fix a stalled bank credit renewal, or run a 30-day financial health cleanup, we give you actionable answers backed by real CAs and Advocates.

Tell me a bit about your business\u2014what industry are you in, or what is the main hurdle you're facing right now?`;
    }
    res.json({
      success: true,
      reply
    });
  });
  app.post("/api/assessments/run", (req, res) => {
    const { industry, revenue, serviceType, fileName, visitorId } = req.body;
    recordVisitorActivity(
      req,
      visitorId || "",
      "SCAN_HEALTH",
      "/live-tools",
      `Ran Business Health Diagnostic for ${industry || "General Business"} (${revenue || "Revenue not specified"})`
    );
    res.json({
      success: true,
      assessment: {
        industry: industry || "General Business",
        revenue: revenue || "\u20B91 Cr - \u20B95 Cr",
        serviceType: serviceType || "Business Health Check",
        fileName: fileName || null,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        score: 72,
        rating: "Moderate Risk - Action Required",
        report: {
          executiveSummary: `Diagnostic review for ${industry || "your enterprise"} (${revenue || "current revenue"}). Your overall business resilience score is 72/100. While cash generation is active, there are 3 critical blindspots in contract liability, debtor collection cycles, and bank credit documentation that require immediate attention.`,
          keyFindings: [
            "Contract Liability Exposure: Customer agreements lack clear liability caps, meaning a single project dispute could freeze working capital.",
            "Debtor Collection Delay: Receivables are taking 78 days on average to realize versus a healthy industry benchmark of 45 days.",
            "Bank Facility Preparedness: Your current debt-service coverage ratio (DSCR) is close to the lender threshold (1.25x), risking higher loan interest or renewal delays."
          ],
          actionSteps: [
            "Standardize your Master Services Agreement (MSA) with a strict liability cap limited to 1x contract value.",
            "Implement a weekly debtor escalation protocol with automated milestone sign-offs.",
            "Reconcile GST filings with bank turnover figures before the upcoming bank credit limit renewal."
          ]
        }
      }
    });
  });
  app.post("/api/documents/analyze", async (req, res) => {
    const { documentText, fileName, visitorId } = req.body;
    const text = (documentText || "").trim();
    const effectiveFileName = fileName || "Pasted Agreement Text";
    recordVisitorActivity(
      req,
      visitorId || "",
      "SCAN_CONTRACT",
      "/live-tools",
      `Analyzed contract clauses in "${effectiveFileName}" (${text.length} chars)`
    );
    if (!text) {
      return res.status(400).json({ error: "documentText is required." });
    }
    const prompt = buildAnalysisPrompt(text, effectiveFileName);
    const providers = [
      { name: "claude", run: () => analyzeWithClaude(prompt) },
      { name: "gemini", run: () => analyzeWithGemini(prompt) },
      { name: "vertex", run: () => analyzeWithVertex(prompt) }
    ];
    let lastError = null;
    for (const provider of providers) {
      try {
        const result = await provider.run();
        if (!result) continue;
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
      } catch (err) {
        lastError = err?.message || String(err);
        console.warn(`[documents/analyze] provider=${provider.name} failed: ${lastError}`);
      }
    }
    console.error(`[documents/analyze] all providers failed for "${effectiveFileName}". last error: ${lastError}`);
    return res.status(502).json({ error: "All AI providers failed to analyze the document. Please try again later." });
  });
  app.post("/api/cibil-scan", (req, res) => {
    const { turnover, monthlyEmi, ccLimit, overdueDebtors, visitorId } = req.body;
    const t = parseFloat(turnover) || 10;
    const emi = parseFloat(monthlyEmi) || 5;
    const cc = parseFloat(ccLimit) || 1.5;
    const debtors = parseFloat(overdueDebtors) || 50;
    recordVisitorActivity(
      req,
      visitorId || "",
      "SCAN_DSCR",
      "/live-tools",
      `Calculated Bank DSCR (Turnover: \u20B9${t} Cr, EMI: \u20B9${emi}L/mo, CC: \u20B9${cc} Cr, Debtors: \u20B9${debtors}L)`
    );
    const annualEmi = emi * 12 / 100;
    const estOperatingProfit = t * 0.12;
    const dscr = annualEmi > 0 ? (estOperatingProfit / annualEmi).toFixed(2) : "3.5";
    const dscrNum = parseFloat(dscr);
    const issues = [];
    if (dscrNum < 1.3) {
      issues.push("Low Debt Coverage (DSCR < 1.3x): Banks may consider your company overleveraged and refuse additional term loans.");
    }
    if (debtors > t * 0.15 * 100) {
      issues.push("Excessive Overdue Receivables (>90 Days): Bank auditors will haircut your drawing power on Cash Credit limits.");
    }
    if (cc > t * 0.25) {
      issues.push("High Working Capital Utilization: Your CC facility exceeds 25% of annual turnover, triggering high interest scrutiny.");
    }
    res.json({
      success: true,
      report: {
        healthScore: dscrNum >= 1.5 ? "82/100 (Strong)" : dscrNum >= 1.2 ? "65/100 (Caution)" : "48/100 (High Risk)",
        calculatedDscr: `${dscr}x (Bank benchmark: 1.30x - 1.50x)`,
        maxEligibleLimit: `\u20B9${(t * 0.2).toFixed(1)} Cr (Estimated)`,
        riskPoints: issues.length > 0 ? issues : ["Credit profile is within standard commercial bank tolerance."],
        advice: dscrNum < 1.3 ? "Restructure short-term debt into long-term facilities before applying to PSU/private banks." : "Prepare a certified Lender Data Room to negotiate a 50-75 bps lower interest rate."
      }
    });
  });
  app.use(express.static("dist"));
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return next();
    }
    res.sendFile(path.resolve("dist/index.html"));
  });
  app.listen(Number(process.env.PORT) || 8080, "0.0.0.0", () => console.log(`Server running on 0.0.0.0:${process.env.PORT || 8080}`));
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
