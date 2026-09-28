const fs = require('fs');
const path = require('path');
const file = path.resolve('src/components/LiveAdvisoryBot.tsx');
let s = fs.readFileSync(file, 'utf8');

s = s.replace("const history = messages.slice(-6).map(m => ({", "const history = messages.slice(-8).map(m => ({");
s = s.replace("body: JSON.stringify({\n          message: textToSend.trim(),\n          history\n        })", "body: JSON.stringify({\n          message: textToSend.trim(),\n          history,\n          visitorId: localStorage.getItem('navigalex_visitor_id') || undefined\n        })");
s = s.replace("const data = await res.json();\n      const botReply = data.reply || \"I am here to guide you on financial controls, contracts, and banking credit readiness. Feel free to ask any specific business question.\";", "const data = await res.json();\n      if (!res.ok || !data.reply) {\n        throw new Error(data.error || `Bot request failed (${res.status})`);\n      }\n      const botReply = data.reply;");
s = s.replace("text: \"Navigalex advisory desks protect businesses against contract liability, delayed receivables, and bank limit rejections. Would you like to request an assessment or try our free live scanners?\",", "text: `Live AI is temporarily unavailable. ${err instanceof Error ? err.message : 'The AI provider did not return a response.'} Please try again.`,");
s = s.replace(/ControlCFOÃ¢â€žÂ¢/g, 'ControlCFO™');
s = s.replace(/Ã¢â‚¬Â¢/g, '•');
s = s.replace(/Ã¢â‚¬â€˜/g, '–');
s = s.replace(/Ã¢â‚¬â€�/g, '—');
s = s.replace(/Ã¢â‚¬â„¢/g, '’');
s = s.replace(/Ã¢â‚¬Å“/g, '“');
s = s.replace(/Ã¢â‚¬Â/g, '”');
s = s.replace(/Ã‚¹/g, '₹');
s = s.replace(/Ã¢â‚¬â€œ/g, '–');
s = s.replace(/Ã¢â‚¬â€/g, '—');

fs.writeFileSync(file, s, 'utf8');
console.log('Bot UI patched: visitor context, HTTP error handling, and encoding repair.');
