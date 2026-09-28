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
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    recordVisitorActivity(req, visitorId || '', 'BOT_CHAT', '/live-bot',
      \`Asked bot: "\${message.slice(0, 75)}\${message.length > 75 ? '...' : ''}"\`);

    const recentHistory = Array.isArray(history) ? history.slice(-8) : [];
    const conversation = recentHistory
      .filter((item: any) => item && item.text)
      .map((item: any) => \`\${item.role === 'user' ? 'User' : 'Navigalex Live'}: \${String(item.text).slice(0, 1200)}\`)
      .join('\\n');

    const prompt = \`You are Navigalex Live, a real senior corporate advisory AI for Indian business owners, promoters and directors.

Answer the user's exact question using the conversation context. Be specific, practical and concise. Do not use canned introductions. If information is missing, ask one precise question. Do not invent client facts, laws, guarantees, approvals or professional credentials. For legal/tax matters, distinguish general information from professional advice.

Conversation:
\${conversation || '(none)'}

Current user question:
\${message}\`;

    const providers: Array<{ name: string; run: () => Promise<ProviderResponse | null> }> = [
      { name: 'claude', run: () => analyzeWithClaude(prompt) },
      { name: 'gemini', run: () => analyzeWithGemini(prompt) },
      { name: 'vertex', run: () => analyzeWithVertex(prompt) }
    ];

    const failures: string[] = [];
    for (const provider of providers) {
      try {
        const result = await provider.run();
        if (result?.text?.trim()) {
          console.log(\`[bot/chat] provider=\${provider.name} model=\${result.model}\`);
          return res.json({ success: true, reply: result.text.trim(), modelUsed: result.model, provider: provider.name });
        }
        failures.push(\`\${provider.name}: not configured\`);
      } catch (err: any) {
        failures.push(\`\${provider.name}: \${err?.message || String(err)}\`);
        console.warn(\`[bot/chat] \${provider.name} failed: \${err?.message || err}\`);
      }
    }

    console.error('[bot/chat] all AI providers failed:', failures.join(' | '));
    return res.status(503).json({
      success: false,
      error: 'AI service is not configured or all configured providers failed.',
      providers: failures.map(x => x.split(':')[0])
    });
  });

`;
source = source.slice(0, start) + replacement + source.slice(end);
fs.writeFileSync(file, source, 'utf8');
console.log('Bot endpoint patched: Claude -> Gemini -> Vertex; canned fallback removed.');
