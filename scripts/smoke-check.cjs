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
const page = read('src/pages/LiveAssessmentsPage.tsx');
const app = read('src/App.tsx');
const genie = read('src/components/GenieWorkspace.tsx');
const services = read('src/pages/ServicesPage.tsx');
const env = read('.env.example');
const ignore = read('.gitignore');
const railway = read('railway.toml');
const pkg = JSON.parse(read('package.json'));

assert(server.includes("app.post('/api/inquiries/submit', inquiryRateLimit"), 'inquiry endpoint is rate limited');
assert(server.includes("app.post('/api/admin/login', loginRateLimit"), 'admin login endpoint is rate limited');
assert(server.includes("app.post('/api/bot/chat', botRateLimit"), 'bot endpoint is rate limited in server source');
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
assert(genie.includes('Financial Genie') && genie.includes('Recommended starting point'), 'Financial Genie offers a guided service path');
assert(genie.includes("fetch('/api/bot/chat'") && genie.includes('chatBusy'), 'Financial Genie uses the live advisory API and exposes loading state');
assert(genie.includes('genie-services') && genie.includes('Browse all services in Genie'), 'Service discovery remains inside Financial Genie');
assert(genie.includes('View full scope') && genie.includes('Request a scoped proposal'), 'Financial Genie has clear clickable next steps');
assert(services.includes('Risk Management & Assurance Review') && services.includes('Controls & Fraud-Prevention Snapshot'), 'risk product deliverables are published');
assert(server.includes('Risk Management & Assurance Review') && server.includes('Growth & Governance Sprint') && server.includes('Strategy & Market Growth Sprint') && server.includes('Project Delivery & Recovery Review'), 'live advisory API uses the eight scoped starter offers');
assert(services.includes('Lender & Funding Readiness Check') && services.includes('Growth & Governance Sprint'), 'funding and governance products are published');
assert(services.includes('Strategy & Market Growth Sprint') && services.includes('Project Delivery & Recovery Review'), 'strategy and project delivery offers are published');
assert(genie.includes('I need a growth strategy') && genie.includes('My project is delayed or over budget'), 'Financial Genie offers clickable strategy and project discovery prompts');
assert(env.includes('NAVIGALEX_DATA_DIR') && env.includes('RESEND_API_KEY') && env.includes('ADMIN_PASSWORD'), 'environment template documents production config');
assert(ignore.includes('data/'), 'runtime data directory is excluded from Git');
assert(railway.includes('healthcheckPath = "/api/health"'), 'Railway checks API health');
assert(Boolean(pkg.scripts && pkg.scripts.postbuild), 'postbuild asset processing is configured');
