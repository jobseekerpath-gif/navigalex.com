const fs = require('fs');
const path = require('path');

const file = path.resolve('server.ts');
let source = fs.readFileSync(file, 'utf8');
const start = source.indexOf('  // Bot Chat Endpoint');
const end = source.indexOf('  // Diagnostics API Routes: Real Activity Hook');

if (start < 0 || end < 0 || end <= start) {
  throw new Error('Bot endpoint markers not found');
}

const replacement = `  // Bot Chat Endpoint - real AI provider routing
  app.post('/api/bot/chat', async (req, res) => {
    const { message, history, visitorId } = req.body;
    if (!message || typeof message !== 'string') return res.status(400).json({ error: 'Message is required' });

    recordVisitorActivity(
      req,
      visitorId || '',
      'BOT_CHAT',
      '/live-bot',
      'Asked bot: "' + message.slice(0, 75) + (message.length > 75 ? '...' : '') + '"'
    );

    const recentHistory = Array.isArray(history) ? history.slice(-8) : [];
    const conversation = recentHistory
      .filter((item: any) => item && item.text)
      .map((item: any) => (item.role === 'user' ? 'User' : 'Navigalex Live') + ': ' + String(item.text).slice(0, 1200))
      .join('\\n');

    const prompt =
      'You are Navigalex Live, a senior business advisory assistant. Answer the exact user question using ONLY the facts in the conversation and the user message. ' +
      'Do not invent financial figures, legal conclusions, approvals, client outcomes, benchmarks, fees, deadlines, credentials or access to external systems. ' +
      'Do not promise an outcome. If a number or fact is missing, ask for it. For legal, tax or regulatory topics, distinguish general information from professional advice. ' +
      'Keep the answer concise and useful.\\n\\nConversation:\\n' +
      (conversation || '(none)') + '\\n\\nCurrent question:\\n' + message;

    const providers: Array<{ name: string; run: () => Promise<ProviderResponse | null> }> = [
      { name: 'claude', run: () => analyzeWithClaude(prompt) },
      { name: 'gemini', run: () => analyzeWithGemini(prompt) },
      { name: 'vertex', run: () => analyzeWithVertex(prompt) }
    ];

    const failures: string[] = [];
    for (const provider of providers) {
      try {
        const result = await provider.run();
        if (result && result.text && result.text.trim()) {
          return res.json({ success: true, reply: result.text.trim(), modelUsed: result.model, provider: provider.name });
        }
        failures.push(provider.name + ': not configured');
      } catch (err: any) {
        failures.push(provider.name + ': ' + (err?.message || String(err)));
      }
    }

    return res.status(503).json({
      success: false,
      error: 'AI service is not configured or all configured providers failed.',
      providers: failures.map((item) => item.split(':')[0])
    });
  });

  // System-level Navigalex personalized PDF report endpoint.
  app.post('/api/report/pdf', (req, res) => {
    const body = req.body || {};
    const analysis = body.analysis && typeof body.analysis === 'object' ? body.analysis : {};
    const documentName = String(analysis.fileName || body.documentName || 'Submitted document');
    const riskScore = String(analysis.riskScore || '');
    const riskLevel = String(analysis.riskLevel || '');
    const summary = String(analysis.summary || '').trim();
    const clauses = Array.isArray(analysis.clauses) ? analysis.clauses.filter((item: unknown) => typeof item === 'string' && item.trim()).slice(0, 6) : [];
    const recommendations = Array.isArray(analysis.recommendations) ? analysis.recommendations.filter((item: unknown) => typeof item === 'string' && item.trim()).slice(0, 6) : [];
    const generatedAt = new Date(body.generatedAt || Date.now());

    const clean = (value: unknown) => String(value == null ? '' : value)
      .replaceAll('₹', 'Rs ')
      .replaceAll('™', '(TM)')
      .replaceAll('–', '-')
      .replaceAll('—', '-')
      .replaceAll('“', '"')
      .replaceAll('”', '"')
      .replaceAll('’', "'")
      .replaceAll('•', '*')
      .replaceAll('●', '*')
      .replaceAll('▪', '*')
      .replaceAll('\\u00a0', ' ')
      .replaceAll('\\t', ' ')
      .replace(/[^\\x09\\x0A\\x0D\\x20-\\x7E]/g, '')
      .trim();

    const wrap = (value: string, width = 84) => {
      const words = clean(value).split(/\\s+/).filter(Boolean);
      const lines: string[] = [];
      let line = '';
      for (const word of words) {
        const next = line ? line + ' ' + word : word;
        if (next.length > width && line) {
          lines.push(line);
          line = word;
        } else {
          line = next;
        }
      }
      if (line) lines.push(line);
      return lines.length ? lines : [''];
    };

    const detail = (item: string) => wrap(item, 84);
    const reportLines: Array<{ text: string; kind: string }> = [];
    reportLines.push({ text: 'NAVIGALEX', kind: 'brand' });
    reportLines.push({ text: 'Contract Risk Review', kind: 'title' });
    reportLines.push({ text: 'Personalized report based only on the submitted document analysis', kind: 'subtitle' });
    reportLines.push({ text: 'Document: ' + clean(documentName), kind: 'meta' });
    reportLines.push({ text: 'Generated: ' + generatedAt.toLocaleString('en-IN'), kind: 'meta' });
    if (riskScore || riskLevel) reportLines.push({ text: 'Risk: ' + clean(riskScore) + (riskLevel ? ' - ' + clean(riskLevel) : ''), kind: 'risk' });

    reportLines.push({ text: 'EXECUTIVE SUMMARY', kind: 'section' });
    detail(summary || 'No document-specific summary was returned.').forEach((line) => reportLines.push({ text: line, kind: 'body' }));

    reportLines.push({ text: 'KEY FINDINGS', kind: 'section' });
    if (clauses.length) {
      clauses.forEach((item) => detail(item).forEach((line, index) => reportLines.push({ text: '* ' + (index === 0 ? line : '  ' + line), kind: 'bullet' })));
    } else {
      reportLines.push({ text: '* No document-specific findings were returned.', kind: 'bullet' });
    }

    reportLines.push({ text: 'RECOMMENDED ACTIONS', kind: 'section' });
    if (recommendations.length) {
      recommendations.forEach((item) => detail(item).forEach((line, index) => reportLines.push({ text: '* ' + (index === 0 ? line : '  ' + line), kind: 'bullet' })));
    } else {
      reportLines.push({ text: '* No document-specific recommendations were returned.', kind: 'bullet' });
    }

    reportLines.push({ text: 'NAVIGALEX | Executive Advisory', kind: 'footer' });

    const pageTop = 748;
    const pageBottom = 62;
    const lineHeight = 14;
    const sectionGap = 7;
    const pages: Array<typeof reportLines> = [];
    let page: typeof reportLines = [];
    let used = 0;

    for (const item of reportLines) {
      const height = item.kind === 'brand' ? 24 : item.kind === 'title' ? 24 : item.kind === 'subtitle' ? 16 :
        item.kind === 'section' ? 20 : item.kind === 'footer' ? 12 : lineHeight;
      if (used + height > pageTop - pageBottom && page.length) {
        pages.push(page);
        page = [];
        used = 0;
      }
      page.push(item);
      used += height;
      if (item.kind === 'section') used += sectionGap;
    }
    if (page.length) pages.push(page);

    const esc = (value: string) => clean(value)
      .replaceAll('\\\\', '\\\\\\\\')
      .replaceAll('(', '\\\\(')
      .replaceAll(')', '\\\\)');

    const objects: string[] = [];
    objects.push('<< /Type /Catalog /Pages 2 0 R >>');
    objects.push('<< /Type /Pages /Kids [' + pages.map((_, index) => (4 + index * 2) + ' 0 R').join(' ') + '] /Count ' + pages.length + ' >>');
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

    pages.forEach((pageItems, index) => {
      const content: string[] = [
        'q',
        '0.97 0.98 1 rg',
        '0 0 612 792 re',
        'f',
        'Q',
        'BT'
      ];
      content.push('/F1 18 Tf', '0.08 0.18 0.35 rg', '1 0 0 1 50 760 Tm', '(' + esc('NAVIGALEX') + ') Tj');
      content.push('/F1 7 Tf', '0.38 0.42 0.50 rg', '1 0 0 1 498 760 Tm', '(' + esc('CONFIDENTIAL') + ') Tj');

      let y = 731;
      for (const item of pageItems) {
        if (item.kind === 'brand') continue;
        if (item.kind === 'section') y -= 4;

        let size = 9;
        let color = '0.15 0.19 0.26';
        if (item.kind === 'title') { size = 16; color = '0.08 0.18 0.35'; }
        else if (item.kind === 'subtitle') { size = 8; color = '0.31 0.37 0.46'; }
        else if (item.kind === 'meta') { size = 8; color = '0.35 0.40 0.48'; }
        else if (item.kind === 'risk') { size = 10; color = '0.70 0.18 0.18'; }
        else if (item.kind === 'section') { size = 10; color = '0.08 0.36 0.85'; }
        else if (item.kind === 'footer') { size = 7; color = '0.40 0.44 0.50'; }

        content.push('/F1 ' + size + ' Tf', color + ' rg', '1 0 0 1 50 ' + y + ' Tm', '(' + esc(item.text.slice(0, 110)) + ') Tj');
        y -= item.kind === 'section' ? 20 : item.kind === 'title' ? 24 : item.kind === 'subtitle' ? 16 : item.kind === 'footer' ? 12 : lineHeight;
      }
      content.push('ET');

      const stream = content.join('\\n');
      objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ' + (5 + index * 2) + ' 0 R >>');
      objects.push('<< /Length ' + Buffer.byteLength(stream, 'utf8') + ' >>\\nstream\\n' + stream + '\\nendstream');
    });

    let pdf = '%PDF-1.4\\n';
    const offsets = [0];
    objects.forEach((object, index) => {
      offsets.push(Buffer.byteLength(pdf, 'utf8'));
      pdf += (index + 1) + ' 0 obj\\n' + object + '\\nendobj\\n';
    });
    const xref = Buffer.byteLength(pdf, 'utf8');
    pdf += 'xref\\n0 ' + (objects.length + 1) + '\\n0000000000 65535 f \\n';
    for (let index = 1; index < offsets.length; index++) {
      pdf += String(offsets[index]).padStart(10, '0') + ' 00000 n \\n';
    }
    pdf += 'trailer\\n<< /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\\nstartxref\\n' + xref + '\\n%%EOF';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Navigalex-Contract-Risk-Report.pdf"');
    return res.send(Buffer.from(pdf, 'utf8'));
  });

`;

source = source.slice(0, start) + replacement + source.slice(end);
fs.writeFileSync(file, source, 'utf8');
console.log('Server patched: real AI provider routing and system-level branded PDF reports.');
