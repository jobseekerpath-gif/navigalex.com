const fs=require('fs');
const file='server.ts';
let source=fs.readFileSync(file,'utf8');
const start=source.indexOf('  // Pre-seed some initial activity logs');
const end=source.indexOf('  // Seed Data: Inquiries');
if(start>=0&&end>start){source=source.slice(0,start)+source.slice(end);fs.writeFileSync(file,source,'utf8');console.log('Removed demo visitor records.');}
