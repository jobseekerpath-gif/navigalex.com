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
      'You are Navigalex Live, a senior corporate advisory AI for Indian business owners, promoters and directors.\\n\\n' +
      'Answer the exact user question using the conversation context. Be specific, practical and concise. Do not invent client facts, laws, guarantees, approvals or credentials. ' +
      'For legal and tax matters, distinguish general information from professional advice.\\n\\nConversation:\\n' +
      (conversation || '(none)') + '\\n\\nCurrent user question:\\n' + message;

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

  // System-level Navigalex branded PDF report endpoint.
  app.post('/api/report/pdf', (req, res) => {
    const body = req.body || {};
    const title = String(body.title || 'Advisory Diagnostic Report');
    const client = body.client && typeof body.client === 'object' ? body.client : {};
    const rawReport = String(body.report || '').slice(0, 18000);
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
      .split('\\n')
      .map((part) => part.trim())
      .filter(Boolean)
      .join(' ')
      .trim();

    const wrap = (text: string, width = 88) => {
      const words = clean(text).split(' ').filter(Boolean);
      const out: string[] = [];
      let line = '';
      for (const word of words) {
        const candidate = line ? line + ' ' + word : word;
        if (candidate.length > width && line) {
          out.push(line);
          line = word;
        } else {
          line = candidate;
        }
      }
      if (line) out.push(line);
      return out.length ? out : [''];
    };

    const sourceLines = rawReport
      .split('\\n')
      .map(clean)
      .filter(Boolean);

    const bullets: string[] = [];
    const normal: string[] = [];
    const isNumbered = (line: string) => {
      if (!line || line.length < 2) return false;
      let i = 0;
      while (i < line.length && line.charCodeAt(i) >= 48 && line.charCodeAt(i) <= 57) i += 1;
      return i > 0 && i < line.length && (line[i] === '.' || line[i] === ')') && line[i + 1] === ' ';
    };

    for (const line of sourceLines) {
      const first = line.charAt(0);
      const isBullet = first === '-' || first === '*' || first === '•' || first === '▪' || isNumbered(line);
      let normalized = line;
      if (isBullet) {
        normalized = line.replace(/^[-*•▪]/, '').trim();
        if (isNumbered(normalized)) normalized = normalized.slice(2).trim();
        bullets.push(normalized);
      } else {
        normal.push(normalized);
      }
    }

    const summarySource = sourceLines.find((line) => {
      const lower = line.toLowerCase();
      return (lower.includes('executive summary') || lower === 'summary' || lower.includes('overall assessment') || lower.includes('assessment summary')) && line.length > 20;
    });
    const executiveSummary = clean(summarySource ? summarySource.split(':').slice(1).join(':') : normal.slice(0, 2).join(' ')).slice(0, 700);

    const findingWords = ['risk', 'red flag', 'issue', 'exposure', 'liabil', 'payment', 'termination', 'indemn', 'jurisdiction', 'penalt', 'concern', 'finding'];
    const recommendationWords = ['recommend', 'action', 'should', 'consider', 'revise', 'remove', 'add', 'negotiate', 'protect', 'mitigat', 'next'];
    const hasAny = (text: string, words: string[]) => words.some((word) => text.toLowerCase().includes(word));
    const findingLines = bullets.filter((item) => hasAny(item, findingWords));
    const recommendationLines = bullets.filter((item) => hasAny(item, recommendationWords));
    const selectedFindings = (findingLines.length ? findingLines : bullets).slice(0, 8);
    const selectedRecommendations = (recommendationLines.length ? recommendationLines : bullets).slice(0, 8);

    const clientFields: Array<[string, string]> = [
      ['Name', client.name],
      ['Company', client.company],
      ['Designation', client.designation],
      ['Email', client.email],
      ['Phone', client.phone],
      ['Business Type', client.businessType],
      ['Turnover', client.turnover],
      ['Primary Concern', client.primaryConcern]
    ].filter((entry) => Boolean(entry[1]));

    const lines: Array<{ text: string; kind: string }> = [];
    lines.push({ text: 'NAVIGALEX', kind: 'brand' });
    lines.push({ text: title, kind: 'title' });
    lines.push({ text: 'Executive Advisory | Confidential Diagnostic Report', kind: 'subtitle' });
    lines.push({ text: 'Generated: ' + generatedAt.toLocaleString('en-IN'), kind: 'small' });
    lines.push({ text: '', kind: 'rule' });

    if (clientFields.length) {
      lines.push({ text: 'CLIENT SNAPSHOT', kind: 'section' });
      for (const entry of clientFields) lines.push({ text: entry[0] + ': ' + clean(entry[1]), kind: 'body' });
    }

    lines.push({ text: 'EXECUTIVE SUMMARY', kind: 'section' });
    for (const part of wrap(executiveSummary || 'No executive summary was returned by the diagnostic.', 88)) lines.push({ text: part, kind: 'body' });

    lines.push({ text: 'KEY FINDINGS', kind: 'section' });
    for (const item of selectedFindings) for (const part of wrap(item, 82)) lines.push({ text: '* ' + part, kind: 'bullet' });
    if (!selectedFindings.length) lines.push({ text: '* No discrete findings were returned.', kind: 'bullet' });

    lines.push({ text: 'RECOMMENDED ACTIONS', kind: 'section' });
    for (const item of selectedRecommendations) for (const part of wrap(item, 82)) lines.push({ text: '* ' + part, kind: 'bullet' });
    if (!selectedRecommendations.length) lines.push({ text: '* Obtain qualified professional review before acting.', kind: 'bullet' });

    lines.push({ text: 'FULL DIAGNOSTIC OUTPUT', kind: 'section' });
    for (const line of sourceLines.slice(0, 180)) {
      const lower = line.toLowerCase();
      if (lower === 'contract scan diagnostic' || lower === 'download pdf report') continue;
      for (const part of wrap(line, 88)) lines.push({ text: part, kind: part.charAt(0) === '*' ? 'bullet' : 'body' });
    }
    lines.push({ text: 'NAVIGALEX | Executive Advisory', kind: 'small' });

    const esc = (value: string) => clean(value)
      .replaceAll('\\\\', '\\\\\\\\')
      .replaceAll('(', '\\\\(')
      .replaceAll(')', '\\\\)');

    const top = 748;
    const bottom = 54;
    const pages: Array<typeof lines> = [];
    let page: typeof lines = [];
    let used = 0;
    const heightFor = (kind: string) => kind === 'brand' ? 25 : kind === 'title' ? 22 : kind === 'section' ? 20 : kind === 'rule' ? 10 : kind === 'subtitle' ? 16 : 14;

    for (const item of lines) {
      const height = heightFor(item.kind);
      if (used + height > top - bottom && page.length) {
        pages.push(page);
        page = [];
        used = 0;
      }
      page.push(item);
      used += height;
    }
    if (page.length) pages.push(page);

    const objects: string[] = [];
    objects.push('<< /Type /Catalog /Pages 2 0 R >>');
    objects.push('<< /Type /Pages /Kids [' + pages.map((_, index) => (4 + index * 2) + ' 0 R').join(' ') + '] /Count ' + pages.length + ' >>');
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

    pages.forEach((pageItems, index) => {
      const content: string[] = ['q', '0.96 0.98 1 rg', '0 0 612 792 re', 'f', 'Q', 'BT'];
      content.push('/F1 18 Tf', '0.08 0.18 0.35 rg', '1 0 0 1 50 760 Tm', '(' + esc('NAVIGALEX') + ') Tj');
      content.push('/F1 7 Tf', '0.35 0.40 0.48 rg', '1 0 0 1 500 760 Tm', '(' + esc('CONFIDENTIAL') + ') Tj');
      let y = 730;

      for (const item of pageItems) {
        if (item.kind === 'rule') {
          content.push('ET', '0.82 0.86 0.92 RG', '50 ' + y + ' m', '562 ' + y + ' l', 'S', 'BT');
          y -= 10;
          continue;
        }
        if (item.kind === 'brand') continue;

        let size = 9;
        let color = '0.15 0.19 0.26';
        if (item.kind === 'title') { size = 16; color = '0.08 0.18 0.35'; }
        else if (item.kind === 'subtitle') { size = 9; color = '0.25 0.35 0.50'; }
        else if (item.kind === 'section') { size = 10; color = '0.08 0.36 0.85'; y -= 5; }
        else if (item.kind === 'small') { size = 7; color = '0.40 0.44 0.50'; }

        content.push('/F1 ' + size + ' Tf', color + ' rg', '1 0 0 1 50 ' + y + ' Tm', '(' + esc(item.text.slice(0, 105)) + ') Tj');
        y -= heightFor(item.kind);
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
    for (let index = 1; index < offsets.length; index++) pdf += String(offsets[index]).padStart(10, '0') + ' 00000 n \\n';
    pdf += 'trailer\\n<< /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\\nstartxref\\n' + xref + '\\n%%EOF';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Navigalex-Contract-Scan-Report.pdf"');
    return res.send(Buffer.from(pdf, 'utf8'));
  });

`;

source = source.slice(0, start) + replacement + source.slice(end);
fs.writeFileSync(file, source, 'utf8');
console.log('Server patched: real AI provider routing and system-level branded PDF reports.');
