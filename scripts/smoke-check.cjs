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
assert(genie.includes('Navigalex Services and Live Assessments') && genie.includes('lg:grid-cols-[minmax(0,3fr)_minmax(280px,1.35fr)]'), 'Financial Genie gives the chat roughly three-quarters of desktop width and keeps services in a right panel');
assert(genie.includes('onClick={() => handleServiceChoice(title)}') && genie.includes('Your likely deliverables') && genie.includes('View solution and next steps'), 'Selecting a service starts a tailored recommendation with deliverables and a solution action');
assert(genie.includes('Change the business problem') && genie.includes("setChatMessages([{") && genie.includes("setChatInput('')"), 'Changing the business problem clears the previous conversation and selected service');
assert(genie.includes('chatRequestVersion.current += 1') && genie.includes('requestVersion !== chatRequestVersion.current'), 'reset ignores late chat replies from an old conversation');
assert(app.includes("if (tab === 'home') window.history.pushState(null, '', '/')"), 'home navigation clears stale service URL state');
assert(!app.includes('Navigalex Services</h4>') && !app.includes('Live Assessments & Guides</h4>'), 'service and assessment directories are removed from the footer');
assert(genie.includes('View full scope') && genie.includes('Request a scoped proposal'), 'Financial Genie has clear clickable next steps');
assert(services.includes('Risk Management & Assurance Review') && services.includes('Controls & Fraud-Prevention Snapshot'), 'risk product deliverables are published');
assert(server.includes('Risk Management & Assurance Review') && server.includes('Growth & Governance Sprint') && server.includes('Strategy & Market Growth Sprint') && server.includes('Project Delivery & Recovery Review') && server.includes('Digital Workflow & Systems Review'), 'live advisory API catalogue includes the published service set');
assert(server.includes('customers? (?:are )?paying late') && server.includes('Digital Workflow & Systems Review'), 'common collections and digital-services prompts have deterministic replies without an AI provider');
assert(server.includes("dynamicAiAvailable: false") && server.includes("provider: 'catalogue-fallback'"), 'chat returns a helpful catalogue fallback instead of failing when AI providers are unavailable');
assert(genie.includes('const match = selectedService ?? matchServiceFromMessage(text)'), 'chat follow-ups remain aligned with the selected service');
assert(server.includes('((debtors / 100) / t) * 100'), 'overdue receivables share is calculated as a percentage, with units converted');
assert(services.includes("'digital-workflow-review': 'digital-workflow-review'") && services.includes("'strategy-growth-sprint': 'strategy-sprint'") && services.includes("'project-delivery-review': 'project-delivery'"), 'service aliases and deep links resolve to canonical cards');
assert(!services.includes("id: 'strategy-growth-sprint'") && !services.includes("id: 'project-delivery-review'"), 'duplicate strategy and project service cards are not displayed');
assert(genie.includes("openAssessmentTool('contract-risk-scanner')") && genie.includes("openAssessmentTool('bank-dscr-scanner')") && page.includes('id="contract-risk-scanner"') && page.includes('id="bank-dscr-scanner"'), 'scanner choices navigate to their individual tool sections');
assert(services.includes('Lender & Funding Readiness Check') && services.includes('Growth & Governance Sprint'), 'funding and governance products are published');
assert(services.includes('Strategy & Market Growth Sprint') && services.includes('Project Delivery & Recovery Review'), 'strategy and project delivery offers are published');
assert(genie.includes('I need a growth strategy') && genie.includes('My project is delayed or over budget'), 'Financial Genie offers clickable strategy and project discovery prompts');
assert(env.includes('NAVIGALEX_DATA_DIR') && env.includes('RESEND_API_KEY') && env.includes('ADMIN_PASSWORD'), 'environment template documents production config');
assert(ignore.includes('data/'), 'runtime data directory is excluded from Git');
assert(railway.includes('healthcheckPath = "/api/health"'), 'Railway checks API health');
assert(Boolean(pkg.scripts && pkg.scripts.postbuild), 'postbuild asset processing is configured');
