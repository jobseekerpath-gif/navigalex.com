const fs = require('fs');
const path = require('path');
const file = path.resolve('server.ts');
let source = fs.readFileSync(file, 'utf8');
const start = source.indexOf('  // Bot Chat Endpoint');
const end = source.indexOf('  // Diagnostics API Routes: Real Activity Hook');
if (start < 0 || end < 0 || end <= start) throw new Error('Bot endpoint markers not found');
const replacement = `  // Bot Chat Endpoint — real AI provider routing
  app.post('/api/bot/chat', async (req, res) => {
    const { message, history, visitorId } = req.body;
    if (!message || typeof message !== 'string') return res.status(400).json({ error: 'Message is required' });
    recordVisitorActivity(req, visitorId || '', 'BOT_CHAT', '/live-bot',
      \`Asked bot: "\${message.slice(0, 75)}\${message.length > 75 ? '...' : ''}"\`);
    const recentHistory = Array.isArray(history) ? history.slice(-8) : [];
    const conversation = recentHistory.filter((item: any) => item && item.text)
      .map((item: any) => \`\${item.role === 'user' ? 'User' : 'Navigalex Live'}: \${String(item.text).slice(0, 1200)}\`).join('\\n');
    const prompt = \`You are Navigalex Live, a real senior corporate advisory AI for Indian business owners, promoters and directors.\n\nAnswer the user's exact question using the conversation context. Be specific, practical and concise. Do not use canned introductions. If information is missing, ask one precise question. Do not invent client facts, laws, guarantees, approvals or professional credentials. For legal/tax matters, distinguish general information from professional advice.\n\nConversation:\n\${conversation || '(none)'}\n\nCurrent user question:\n\${message}\`;
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
        failures.push(\`\${provider.name}: not configured\`);
      } catch (err: any) { failures.push(\`\${provider.name}: \${err?.message || String(err)}\`); }
    }
    return res.status(503).json({ success: false, error: 'AI service is not configured or all configured providers failed.', providers: failures.map(x => x.split(':')[0]) });
  });

  // Branded, client-personalized PDF report endpoint. Uses only standard Node APIs.
  app.post('/api/report/pdf', (req, res) => {
    const body = req.body || {};
    const title = String(body.title || 'Advisory Diagnostic Report');
    const client = body.client && typeof body.client === 'object' ? body.client : {};
    const report = String(body.report || '').slice(0, 18000);
    const generatedAt = String(body.generatedAt || new Date().toISOString());
    const ascii = (s: string) => String(s).replace(/[₹]/g, 'Rs ').replace(/[™]/g, '(TM)').replace(/[–—]/g, '-').replace(/[“”]/g, '"').replace(/[’]/g, "'").replace(/[^\\x09\\x0A\\x0D\\x20-\\x7E]/g, '');
    const esc = (s: string) => ascii(s).replace(/\\/g, '\\\\').replace(/\\(/g, '\\\\(').replace(/\\)/g, '\\\\)');
    const lines: string[] = ['NAVIGALEX', title, 'Executive Advisory Diagnostic', `Generated: ${generatedAt}`];
    const fields: Array<[string,string]> = [['Name',client.name],['Company',client.company],['Designation',client.designation],['Email',client.email],['Phone',client.phone],['Business Type',client.businessType],['Turnover',client.turnover],['Primary Concern',client.primaryConcern]];
    for (const [label,value] of fields) if (value) lines.push(`${label}: ${String(value)}`);
    lines.push('', 'REPORT', ...ascii(report).split(/\\r?\\n/).flatMap((line: string) => line.match(/.{1,92}(?:\\s|$)/g) || ['']));
    const pages: string[][] = [];
    for (let i=0;i<lines.length;i+=46) pages.push(lines.slice(i,i+46));
    const objects: string[] = [];
    objects.push('<< /Type /Catalog /Pages 2 0 R >>');
    objects.push('<< /Type /Pages /Kids [' + pages.map((_,i)=>`${4+i*2} 0 R`).join(' ') + '] /Count ' + pages.length + ' >>');
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    pages.forEach((page,i)=>{
      const content = ['BT','/F1 11 Tf','50 780 Td'];
      page.forEach((line,idx)=>{ if(idx===0) content.push('/F1 18 Tf'); else if(idx===1) content.push('/F1 14 Tf'); else content.push('/F1 11 Tf'); content.push(`(${esc(line.slice(0,110))}) Tj`); content.push('0 -16 Td'); });
      content.push('ET');
      const stream = content.join('\\n');
      objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${5+i*2} 0 R >>`);
      objects.push(`<< /Length ${Buffer.byteLength(stream,'utf8')} >>\\nstream\\n${stream}\\nendstream`);
    });
    let pdf = '%PDF-1.4\\n'; const offsets=[0];
    objects.forEach((obj,i)=>{ offsets.push(Buffer.byteLength(pdf,'utf8')); pdf += `${i+1} 0 obj\\n${obj}\\nendobj\\n`; });
    const xref = Buffer.byteLength(pdf,'utf8');
    pdf += `xref\\n0 ${objects.length+1}\\n0000000000 65535 f \\n`;
    for(let i=1;i<offsets.length;i++) pdf += String(offsets[i]).padStart(10,'0')+' 00000 n \\n';
    pdf += `trailer\\n<< /Size ${objects.length+1} /Root 1 0 R >>\\nstartxref\\n${xref}\\n%%EOF`;
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition','attachment; filename="Navigalex-Report.pdf"');
    return res.send(Buffer.from(pdf,'utf8'));
  });

`;
source = source.slice(0, start) + replacement + source.slice(end);
fs.writeFileSync(file, source, 'utf8');
console.log('Server patched: Claude -> Gemini -> Vertex and branded personalized PDF reports.');
