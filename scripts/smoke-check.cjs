const fs = require('node:fs');
const path = require('node:path');
const read = (file) => fs.readFileSync(path.join(process.cwd(), file), 'utf8');
const assert = (condition, message) => {
  if (!condition) {
    console.error('FAIL:', message);
    process.exitCode = 1;
  } else {
    console.log('PASS:', message);
  }
};

const server = read('server.ts');
const botBuildPatch = read('scripts/patch-server.cjs');
const page = read('src/pages/LiveAssessmentsPage.tsx');
const app = read('src/App.tsx');
const env = read('.env.example');
const ignore = read('.gitignore');
const railway = read('railway.toml');
const pkg = JSON.parse(read('package.json'));

assert(server.includes("app.post('/api/inquiries/submit', inquiryRateLimit"), 'inquiry endpoint is rate limited');
assert(server.includes("app.post('/api/admin/login', loginRateLimit"), 'admin login endpoint is rate limited');
assert(server.includes("app.post('/api/bot/chat', botRateLimit"), 'bot endpoint is rate limited in server source');
assert(botBuildPatch.includes("app.post('/api/bot/chat', botRateLimit"), 'postbuild patch preserves bot rate limiting');
assert(server.includes("app.post('/api/documents/analyze', documentRateLimit"), 'contract analysis endpoint is rate limited');
assert(server.includes("app.post('/api/assessments/run', assessmentRateLimit"), 'business assessment endpoint is rate limited');
assert(server.includes("app.post('/api/cibil-scan', financeRateLimit"), 'financial scanner endpoint is rate limited');
assert(server.includes("app.get('/api/health'"), 'health endpoint exists');
assert(server.includes("app.use('/api',"), 'unknown API routes return JSON 404');
assert(server.includes('RESEND_API_KEY') && server.includes('INQUIRY_TO_EMAIL'), 'inquiry email configuration is checked');
assert(server.includes('persistState'), 'file persistence adapter exists');
assert(server.includes('calculationDisclaimer'), 'financial output labels DSCR as indicative');
assert(page.includes('calculationDisclaimer'), 'financial disclaimer is shown in the UI');
assert(page.includes('/api/documents/analyze'), 'contract scanner is wired to analysis API');
assert(page.includes('/api/assessments/run'), 'business assessment is wired to API');
assert(page.includes('/api/cibil-scan'), 'financial scanner is wired to API');
assert(app.includes('/api/inquiries/submit') && app.includes('leadSubmitError'), 'contact form surfaces API failures');
assert(env.includes('NAVIGALEX_DATA_DIR') && env.includes('RESEND_API_KEY') && env.includes('ADMIN_PASSWORD'), 'environment template documents production config');
assert(ignore.includes('data/'), 'runtime data directory is excluded from Git');
assert(railway.includes('healthcheckPath = "/api/health"'), 'Railway checks API health');
assert(Boolean(pkg.scripts && pkg.scripts.postbuild), 'postbuild transformation pipeline is configured');
