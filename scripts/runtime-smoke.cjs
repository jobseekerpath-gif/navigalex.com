const { spawn } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const port = 18000 + (process.pid % 10000);
const baseUrl = 'http://127.0.0.1:' + port;
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'navigalex-runtime-smoke-'));
const child = spawn(
  process.execPath,
  [path.join(process.cwd(), 'node_modules', 'tsx', 'dist', 'cli.mjs'), 'server.ts'],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(port),
      NAVIGALEX_DATA_DIR: dataDir,
      GEMINI_API_KEY: '',
      ANTHROPIC_API_KEY: '',
      GOOGLE_CLOUD_PROJECT: '',
      ADMIN_PASSWORD: '',
      RESEND_API_KEY: '',
      RESEND_FROM_EMAIL: '',
      INQUIRY_TO_EMAIL: '',
      CASHFREE_APP_ID: '',
      CASHFREE_SECRET_KEY: 'runtime-test-cashfree-secret',
      CASHFREE_ENV: 'sandbox',
      MSMED_BANK_RATE: '6'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  }
);

let serverOutput = '';
child.stdout.on('data', chunk => { serverOutput += chunk.toString(); });
child.stderr.on('data', chunk => { serverOutput += chunk.toString(); });

function assert(condition, message) {
  if (!condition) throw new Error(message);
  console.log('PASS:', message);
}

async function request(pathname, options) {
  const response = await fetch(baseUrl + pathname, options);
  const text = await response.text();
  let data = {};
  try { data = JSON.parse(text); } catch { /* non-JSON route responses are tested by status */ }
  return { response, data, text };
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error('Server exited before health check. Output: ' + serverOutput.slice(-4000));
    }
    try {
      const { response, data } = await request('/api/health');
      if (response.ok && data.success) return data;
    } catch {
      // The server is still starting.
    }
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error('Server did not become healthy in time. Output: ' + serverOutput.slice(-4000));
}

async function stopServer() {
  if (child.exitCode === null) {
    child.kill('SIGTERM');
    await Promise.race([
      new Promise(resolve => child.once('exit', resolve)),
      new Promise(resolve => setTimeout(resolve, 2000))
    ]);
  }
}

async function main() {
  try {
    const health = await waitForServer();
    assert(health.service === 'navigalex-api', 'runtime health endpoint responds');
    assert(health.integrations.aiProviderConfigured === false, 'runtime health reports missing AI provider in the test environment');


    const msmeConfig = await request('/api/msme/config');
    assert(msmeConfig.response.ok && msmeConfig.data.bankRate === 6, 'MSME checker exposes the configured bank-rate assumption');

    const unavailablePaymentLink = await request('/api/msme/payment-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: 'single', email: 'test@example.com', name: 'Runtime Test' })
    });
    assert(unavailablePaymentLink.response.status === 503, 'paid report checkout fails closed when Cashfree credentials are absent');

    const invalidWebhook = await request('/api/msme/cashfree/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-webhook-signature': 'invalid', 'x-webhook-timestamp': 'test' },
      body: JSON.stringify({ type: 'PAYMENT_LINK_EVENT', data: { link_id: 'unknown', link_status: 'PAID' } })
    });
    assert(invalidWebhook.response.status === 401, 'Cashfree webhook rejects an invalid signature');

    const unpaidPdf = await request('/api/msme/report/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: 'invalid_invalid_invalid_invalid_invalid', bankRate: 6, taxYear: '2025-26', results: [{ invoice: 'test' }] })
    });

    assert(unpaidPdf.response.status === 402, 'MSME PDF endpoint refuses to generate a report without verified payment');

    const accessToken = 'runtime-msme-access-token-12345678901234567890';
    const webhookSecret = 'runtime-test-cashfree-secret';
    const linkId = 'runtime-smoke-msme-link';
    fs.writeFileSync(path.join(dataDir, 'msme-payments.json'), JSON.stringify({
      payments: [{
        tokenHash: crypto.createHash('sha256').update(accessToken).digest('hex'),
        linkId,
        plan: 'single',
        amount: 499,
        email: 'runtime@example.com',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        reportUsed: false
      }]
    }), 'utf8');

    const eventBody = JSON.stringify({
      type: 'PAYMENT_LINK_EVENT',
      data: {
        link_id: linkId,
        link_status: 'PAID',
        link_amount: 499,
        link_amount_paid: 499,
        link_currency: 'INR'
      }
    });
    const eventTimestamp = String(Date.now());
    const eventSignature = crypto.createHmac('sha256', webhookSecret)
      .update(eventTimestamp, 'utf8')
      .update(Buffer.from(eventBody, 'utf8'))
      .digest('base64');
    const signedWebhook = await request('/api/msme/cashfree/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-timestamp': eventTimestamp,
        'x-webhook-signature': eventSignature
      },
      body: eventBody
    });
    assert(signedWebhook.response.ok, 'valid signed Cashfree webhook is accepted');

    const paidAccess = await request('/api/msme/access/' + encodeURIComponent(accessToken));
    assert(paidAccess.response.ok && paidAccess.data.paid && paidAccess.data.pdfAvailable, 'valid signed payment activates the report entitlement');

    const paidPdf = await request('/api/msme/report/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken,
        bankRate: 6,
        taxYear: '2025-26',
        results: [{
          supplier: 'Test Supplier',
          invoice: 'TEST-001',
          amount: 499,
          acceptanceDate: '2025-04-01',
          dueDate: '2025-04-16',
          paymentDate: '',
          daysLate: 30,
          estimatedInterest: 4.5,
          disallowanceFlag: false,
          notes: ['Runtime smoke test']
        }]
      })
    });
    assert(paidPdf.response.ok && paidPdf.response.headers.get('content-type') === 'application/pdf' && paidPdf.text.startsWith('%PDF-1.4'), 'verified one-time payment generates a server-side PDF report');

    const repeatPdf = await request('/api/msme/report/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken,
        bankRate: 6,
        taxYear: '2025-26',
        results: [{ supplier: 'Test Supplier', invoice: 'TEST-001', amount: 499 }]
      })
    });
    assert(repeatPdf.response.status === 403, 'one-time PDF access cannot be reused after a successful download');


    // ---- Instant reports (supplier pack and loan readiness) ----
    const badProduct = await request('/api/msme/payment-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: 'nonsense', email: 'a@b.co', plan: 'single' })
    });
    assert(badProduct.response.status === 400, 'checkout rejects an unknown report product');

    const unpaidPack = await request('/api/reports/supplier-pack/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: 'invalid_invalid_invalid_invalid_invalid' })
    });
    assert(unpaidPack.response.status === 402, 'supplier pack PDF refuses to generate without verified payment');

    const packToken = 'runtime-pack-access-token-1234567890123456789012';
    const loanToken = 'runtime-loan-access-token-1234567890123456789012';
    const store = JSON.parse(fs.readFileSync(path.join(dataDir, 'msme-payments.json'), 'utf8'));
    const nowIso = new Date().toISOString();
    const mk = (token, link, product, amount) => ({
      product, downloads: 0, tokenHash: crypto.createHash('sha256').update(token).digest('hex'), linkId: link, plan: 'single',
      amount, email: 'runtime@example.com', status: 'PENDING', createdAt: nowIso, reportUsed: false
    });
    store.payments.push(mk(packToken, 'runtime-pack-link', 'supplier-pack', 299), mk(loanToken, 'runtime-loan-link', 'loan-readiness', 499));
    fs.writeFileSync(path.join(dataDir, 'msme-payments.json'), JSON.stringify(store), 'utf8');

    async function paidWebhook(link, amount, paidAmount) {
      const body = JSON.stringify({ type: 'PAYMENT_LINK_EVENT', data: { link_id: link, link_status: 'PAID', link_amount: amount, link_amount_paid: paidAmount, link_currency: 'INR' } });
      const ts = String(Date.now());
      const sig = crypto.createHmac('sha256', webhookSecret).update(ts, 'utf8').update(Buffer.from(body, 'utf8')).digest('base64');
      return request('/api/msme/cashfree/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-webhook-timestamp': ts, 'x-webhook-signature': sig }, body });
    }
    await paidWebhook('runtime-pack-link', 299, 100);
    const underpaid = await request('/api/msme/access/' + encodeURIComponent(packToken));
    assert(underpaid.data.paid === false, 'a part-payment does not unlock the supplier pack');
    await paidWebhook('runtime-pack-link', 299, 299);
    await paidWebhook('runtime-loan-link', 499, 499);
    const packAccess = await request('/api/msme/access/' + encodeURIComponent(packToken));
    assert(packAccess.data.paid && packAccess.data.product === 'supplier-pack' && packAccess.data.pdfAvailable && packAccess.data.downloadsLeft === 3, 'verified payment unlocks the supplier pack with 3 downloads');

    const wrongProduct = await request('/api/reports/loan-readiness/pdf', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: packToken, turnoverLatest: 1000000, netProfit: 100000, proposedAmount: 500000, proposedRate: 11, proposedTenureYears: 3 })
    });
    assert(wrongProduct.response.status === 403, 'a supplier pack payment cannot be used for the loan snapshot');
    const msmeWithPack = await request('/api/msme/report/pdf', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: packToken, bankRate: 6, taxYear: '2025-26', results: [{ invoice: 'x', amount: 1 }] })
    });
    assert(msmeWithPack.response.status === 403, 'a supplier pack payment cannot be used for the MSME ledger report');

    const badPack = await request('/api/reports/supplier-pack/pdf', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: packToken, supplier: 'S', buyer: 'B', bankRate: 6, invoices: [{ invoice: 'A', amount: -5, dueDate: '2026-01-01', paymentDate: '' }] })
    });
    assert(badPack.response.status === 400, 'supplier pack rejects invalid invoice data without using a download');

    const packBody = JSON.stringify({ accessToken: packToken, supplier: 'Test Supplier', buyer: 'Test Buyer', bankRate: 6, invoices: [{ invoice: 'INV-1', amount: 100000, dueDate: '2026-01-01', paymentDate: '' }] });
    const packPdf = await request('/api/reports/supplier-pack/pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: packBody });
    assert(packPdf.response.ok && packPdf.text.startsWith('%PDF-1.4') && packPdf.text.includes('FOLLOW-UP LETTER'), 'verified payment generates the supplier pack PDF');
    const packAfter = await request('/api/msme/access/' + encodeURIComponent(packToken));
    assert(packAfter.data.downloadsLeft === 2, 'a successful pack download uses one of three downloads');
    await request('/api/reports/supplier-pack/pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: packBody });
    await request('/api/reports/supplier-pack/pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: packBody });
    const fourth = await request('/api/reports/supplier-pack/pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: packBody });
    assert(fourth.response.status === 403, 'the supplier pack stops after 3 downloads');

    const loanBody = { accessToken: loanToken, business: 'Test Co', turnoverLatest: 5000000, turnoverPrevious: 4000000, netProfit: 400000, depreciation: 100000, interestPaid: 80000, existingPrincipalRepayment: 150000, proposedAmount: 1000000, proposedRate: 11, proposedTenureYears: 5, collateralValue: 1500000 };
    const badLoan = await request('/api/reports/loan-readiness/pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...loanBody, proposedTenureYears: 99 }) });
    assert(badLoan.response.status === 400, 'loan snapshot rejects an impossible tenure');
    const loanPdf = await request('/api/reports/loan-readiness/pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loanBody) });
    assert(loanPdf.response.ok && loanPdf.text.startsWith('%PDF-1.4') && loanPdf.text.includes('LOAN READINESS SNAPSHOT') && loanPdf.text.includes('Combined DSCR'), 'verified payment generates the loan readiness PDF');

    const invalidCibil = await request('/api/cibil-scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ turnover: '', monthlyEmi: '0', ccLimit: '0', overdueDebtors: '0', annualOperatingProfit: '0' })
    });
    assert(invalidCibil.response.status === 400, 'DSCR scanner rejects missing financial inputs');

    const validCibil = await request('/api/cibil-scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        turnover: '10',
        monthlyEmi: '50',
        ccLimit: '2',
        overdueDebtors: '50',
        annualOperatingProfit: '2',
        visitorId: 'runtime-smoke-test'
      })
    });
    assert(validCibil.response.ok && validCibil.data.success, 'DSCR scanner accepts valid financial inputs');
    assert(validCibil.data.report.overdueReceivablesShareOfTurnover === '5.00%', 'DSCR scanner expresses overdue receivables as the correct percentage');

    const collections = await request('/api/bot/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Customers are paying late', history: [], visitorId: 'runtime-smoke-test' })
    });
    assert(collections.response.ok && collections.data.success, 'chat routes late-payment questions without an AI provider');
    assert(collections.data.reply.includes('Contract & Collections Review'), 'late-payment chat returns the matching service recommendation');

    const genericChat = await request('/api/bot/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Can you help me choose the right service?', history: [], visitorId: 'runtime-smoke-test' })
    });
    assert(genericChat.response.ok && genericChat.data.success, 'chat returns a catalogue fallback when no AI provider is configured');
    assert(genericChat.data.provider === 'catalogue-fallback' && genericChat.data.dynamicAiAvailable === false, 'chat clearly identifies its no-AI fallback response');

    const invalidInquiry = await request('/api/inquiries/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Runtime Test', email: 'test@example.com', consent: false })
    });
    assert(invalidInquiry.response.status === 400, 'inquiry endpoint rejects missing consent');

    const unavailableInquiry = await request('/api/inquiries/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Runtime Test',
        email: 'test@example.com',
        contactMethod: 'Email',
        consent: true,
        primaryConcern: 'Runtime-only test'
      })
    });
    assert(unavailableInquiry.response.status === 503, 'inquiry endpoint does not claim delivery without email configuration');

    const unknownApi = await request('/api/route-that-does-not-exist');
    assert(unknownApi.response.status === 404 && unknownApi.data.error, 'unknown API routes return JSON 404');

    const adminUnavailable = await request('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: '' })
    });
    assert(adminUnavailable.response.status === 503, 'admin login fails closed when credentials are not configured');

    console.log('Runtime API smoke tests passed.');
  } finally {
    await stopServer();
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
}

main().catch(error => {
  console.error('Runtime API smoke test failed:', error);
  process.exitCode = 1;
});
