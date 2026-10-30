import express, { type Express, type Request, type Response } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

type Plan = 'single' | 'annual';
type Payment = { tokenHash:string; linkId:string; plan:Plan; amount:number; email:string; status:'PENDING'|'PAID'|'FAILED'|'EXPIRED'; createdAt:string; paidAt?:string; expiresAt?:string; reportUsed:boolean };
type Store = { payments:Payment[] };
const price:Record<Plan,number>={single:499,annual:3000};
const apiVersion='2025-01-01';

function filePath(){const dir=path.resolve(process.env.NAVIGALEX_DATA_DIR||'./data');fs.mkdirSync(dir,{recursive:true,mode:0o700});return path.join(dir,'msme-payments.json');}
function readStore():Store{try{const value=JSON.parse(fs.readFileSync(filePath(),'utf8')) as Store;if(Array.isArray(value.payments))return value;}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')console.error('[msme] payment store read failed');}return{payments:[]};}
function writeStore(value:Store){const file=filePath();fs.writeFileSync(file+'.tmp',JSON.stringify(value),{encoding:'utf8',mode:0o600});fs.renameSync(file+'.tmp',file);}
function hash(token:string){return crypto.createHash('sha256').update(token).digest('hex');}
function findPayment(token:string){if(!/^[A-Za-z0-9_-]{32,80}$/.test(token))return undefined;const digest=hash(token);return readStore().payments.find(p=>p.tokenHash===digest);}
function clean(value:unknown,max=200){return typeof value==='string'?value.trim().slice(0,max):'';}
function baseUrl(){return process.env.CASHFREE_ENV==='production'?'https://api.cashfree.com/pg':'https://sandbox.cashfree.com/pg';}
function validSignature(signature:string,timestamp:string,body:Buffer,secret:string){if(!signature||!timestamp||!secret)return false;const expected=crypto.createHmac('sha256',secret).update(timestamp,'utf8').update(body).digest();const received=Buffer.from(signature,'base64');return received.length===expected.length&&crypto.timingSafeEqual(received,expected);}
function safePdf(value:unknown){return String(value??'').replaceAll('₹','Rs ').replaceAll('–','-').replaceAll('—','-').replace(/[^\x09\x0A\x0D\x20-\x7E]/g,' ').replace(/\s+/g,' ').trim();}
function wrap(value:string,width=92){const words=safePdf(value).split(' ').filter(Boolean);const lines:string[]=[];let line='';for(const word of words){const next=line?line+' '+word:word;if(next.length>width&&line){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines.length?lines:[''];}
function makePdf(lines:string[]):Buffer{
  const chunks:string[][]=[];for(let i=0;i<lines.length;i+=48)chunks.push(lines.slice(i,i+48));if(!chunks.length)chunks.push(['NAVIGALEX MSME SCREENING REPORT']);
  const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids ['+chunks.map((_,i)=>(4+i*2)+' 0 R').join(' ')+'] /Count '+chunks.length+' >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
  chunks.forEach((page,i)=>{const commands=['BT','/F1 9 Tf','0.12 0.16 0.23 rg'];let y=750;page.forEach((line,j)=>{const text=safePdf(line).replaceAll('\\','\\\\').replaceAll('(','\\(').replaceAll(')','\\)');commands.push('/F1 '+(j===0?14:9)+' Tf','1 0 0 1 48 '+y+' Tm','('+text.slice(0,180)+') Tj');y-=j===0?24:14;});commands.push('ET');const stream=commands.join('\n');objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents '+(5+i*2)+' 0 R >>');objects.push('<< /Length '+Buffer.byteLength(stream)+' >>\nstream\n'+stream+'\nendstream');});
  let pdf='%PDF-1.4\n';const offsets=[0];objects.forEach((o,i)=>{offsets.push(Buffer.byteLength(pdf));pdf+=(i+1)+' 0 obj\n'+o+'\nendobj\n';});const xref=Buffer.byteLength(pdf);pdf+='xref\n0 '+(objects.length+1)+'\n0000000000 65535 f \n';for(let i=1;i<offsets.length;i++)pdf+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';pdf+='trailer\n<< /Size '+(objects.length+1)+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF';return Buffer.from(pdf);
}

export function registerMsmeWebhook(app:Express){
  app.post('/api/msme/cashfree/webhook',express.raw({type:'application/json',limit:'1mb'}),(req:Request,res:Response)=>{
    const raw=Buffer.isBuffer(req.body)?req.body:Buffer.alloc(0);
    if(!validSignature(clean(req.headers['x-webhook-signature'],500),clean(req.headers['x-webhook-timestamp'],100),raw,process.env.CASHFREE_SECRET_KEY||''))return res.status(401).json({error:'Invalid webhook signature.'});
    let event:any;try{event=JSON.parse(raw.toString('utf8'));}catch{return res.status(400).json({error:'Invalid webhook payload.'});}
    const data=event?.data;if(event?.type!=='PAYMENT_LINK_EVENT'||typeof data?.link_id!=='string')return res.status(200).json({received:true,ignored:true});
    const store=readStore();const payment=store.payments.find(p=>p.linkId===data.link_id);if(!payment)return res.status(200).json({received:true,ignored:true});
    const paid=Number(data.link_amount_paid);const amount=Number(data.link_amount);
    const success=data.link_status==='PAID'&&Number.isFinite(paid)&&paid>=payment.amount&&amount===payment.amount&&(!data.link_currency||data.link_currency==='INR');
    if(success&&payment.status!=='PAID'){payment.status='PAID';payment.paidAt=new Date().toISOString();if(payment.plan==='annual'){const expiry=new Date();expiry.setUTCFullYear(expiry.getUTCFullYear()+1);payment.expiresAt=expiry.toISOString();}writeStore(store);}
    else if(!success&&payment.status!=='PAID'&&['EXPIRED','CANCELLED','INACTIVE'].includes(String(data.link_status))){payment.status='EXPIRED';writeStore(store);}
    return res.status(200).json({received:true});
  });
}

export function registerMsmeRoutes(app:Express){
  app.get('/api/msme/config',(_req,res)=>{const n=Number(process.env.MSMED_BANK_RATE??'6');const bankRate=Number.isFinite(n)&&n>0&&n<=30?n:6;res.json({success:true,bankRate,privacy:'Invoice rows are processed in the browser and are not stored by this service.'});});

  app.post('/api/msme/payment-links',async(req,res)=>{
    const appId=process.env.CASHFREE_APP_ID,secret=process.env.CASHFREE_SECRET_KEY;
    if(!appId||!secret)return res.status(503).json({error:'Paid reports are not configured yet. Use the free CSV export for now.'});
    const plan=req.body?.plan as Plan;if(plan!=='single'&&plan!=='annual')return res.status(400).json({error:'Choose a valid access plan.'});
    const email=clean(req.body?.email,254).toLowerCase();const name=clean(req.body?.name,80)||'Navigalex customer';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({error:'Enter a valid email address.'});
    const token=crypto.randomBytes(32).toString('base64url');const linkId='navmsme'+crypto.randomBytes(12).toString('hex');const amount=price[plan];
    const store=readStore();store.payments.push({tokenHash:hash(token),linkId,plan,amount,email,status:'PENDING',createdAt:new Date().toISOString(),reportUsed:false});store.payments=store.payments.slice(-5000);writeStore(store);
    const site=(process.env.APP_URL||'https://navigalex.com').replace(/\/+$/,'');
    const payload={link_id:linkId,link_amount:amount,link_currency:'INR',link_purpose:plan==='single'?'Navigalex MSME screening PDF report':'Navigalex MSME annual report access',customer_details:{customer_name:name,customer_email:email},link_meta:{return_url:site+'/43b-h-check?payment=return',notify_url:site+'/api/msme/cashfree/webhook'},link_notify:{send_email:false,send_sms:false},link_partial_payments:false,link_auto_reminders:false};
    try{
      const response=await fetch(baseUrl()+'/links',{method:'POST',headers:{'content-type':'application/json','x-client-id':appId,'x-client-secret':secret,'x-api-version':apiVersion,'x-request-id':crypto.randomUUID()},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
      const result=await response.json().catch(()=>({}));if(!response.ok||typeof result.link_url!=='string'){const failed=readStore();const record=failed.payments.find(p=>p.linkId===linkId);if(record){record.status='FAILED';writeStore(failed);}console.error('[msme] Cashfree create-link API returned HTTP '+response.status);return res.status(502).json({error:'Cashfree could not create the payment link. Check its environment and credentials.'});}
      return res.status(201).json({success:true,paymentUrl:result.link_url,accessToken:token,amount,plan});
    }catch{const failed=readStore();const record=failed.payments.find(p=>p.linkId===linkId);if(record){record.status='FAILED';writeStore(failed);}return res.status(502).json({error:'Cashfree is unavailable. Please try again.'});}
  });

  app.get('/api/msme/access/:token',(req,res)=>{
    const payment=findPayment(req.params.token);if(!payment)return res.status(404).json({error:'Access record not found.'});
    const annualActive=payment.plan==='annual'&&payment.status==='PAID'&&!!payment.expiresAt&&Date.parse(payment.expiresAt)>Date.now();
    return res.json({success:true,paid:payment.status==='PAID',plan:payment.plan,status:payment.status,annualActive,pdfAvailable:annualActive||(payment.plan==='single'&&payment.status==='PAID'&&!payment.reportUsed),expiresAt:payment.expiresAt||null});
  });

  app.post('/api/msme/report/pdf',(req,res)=>{
    const token=clean(req.body?.accessToken,100);const payment=findPayment(token);
    if(!payment||payment.status!=='PAID')return res.status(402).json({error:'A verified successful payment is required before downloading this PDF.'});
    const annual=payment.plan==='annual'&&!!payment.expiresAt&&Date.parse(payment.expiresAt)>Date.now();const oneTime=payment.plan==='single'&&!payment.reportUsed;
    if(!annual&&!oneTime)return res.status(403).json({error:'This report access has already been used or has expired.'});
    const rows=Array.isArray(req.body?.results)?req.body.results.slice(0,2000):[];if(!rows.length)return res.status(400).json({error:'There are no screening results to include.'});
    const rate=Number(req.body?.bankRate);if(!Number.isFinite(rate)||rate<=0||rate>30)return res.status(400).json({error:'Invalid bank rate.'});
    const lines=['NAVIGALEX - MSME PAYMENT SCREENING REPORT','Created: '+new Date().toLocaleString('en-IN'),'Tax year / reference: '+safePdf(req.body?.taxYear||'Not specified'),'Bank rate entered: '+rate+'% p.a. (confirm the applicable current RBI bank rate)','Invoice rows: '+rows.length,'','SCREENING RESULTS'];
    rows.forEach((item:any,index:number)=>{
      const amount=Number(item?.amount),days=Number(item?.daysLate),interest=item?.estimatedInterest==null?'Not determined':Number(item.estimatedInterest).toFixed(2);
      lines.push('',(index+1)+'. '+safePdf(item?.supplier||'Not supplied').slice(0,100)+' - Invoice: '+safePdf(item?.invoice||'Not supplied').slice(0,60));
      lines.push('Acceptance: '+safePdf(item?.acceptanceDate)+' | Indicative due date: '+safePdf(item?.dueDate));
      lines.push('Amount: INR '+(Number.isFinite(amount)?amount.toFixed(2):'Invalid')+' | Payment: '+safePdf(item?.paymentDate||'Unpaid'));
      lines.push('Days late: '+(Number.isFinite(days)?String(Math.max(0,days)):'Not determined')+' | Estimated interest INR: '+interest);
      lines.push('Year-end flag: '+(item?.disallowanceFlag===true?'Review possible disallowance':item?.disallowanceFlag===false?'No flag from entered data':'Eligibility unconfirmed'));
      if(Array.isArray(item?.notes))item.notes.filter((n:unknown)=>typeof n==='string').slice(0,5).forEach((n:string)=>lines.push('Note: '+safePdf(n)));
    });
    lines.push('','ASSUMPTIONS AND LIMITATIONS','This report uses only information entered by the user. Supplier status, activity eligibility, agreements, dates and payments are not independently verified.','Partial payments, disputes, credit notes, statutory exceptions and formal tax return positions may require separate review.','Screening estimate, not tax or legal advice; confirm with your CA.','Invoice data is submitted only for PDF generation and is not written to the payment store.');
    if(payment.plan==='single'){const latest=readStore();const record=latest.payments.find(p=>p.tokenHash===payment.tokenHash);if(!record||record.reportUsed||record.status!=='PAID')return res.status(409).json({error:'This one-time report download has already been used.'});record.reportUsed=true;writeStore(latest);}
    res.setHeader('Content-Type','application/pdf');res.setHeader('Content-Disposition','attachment; filename="Navigalex-MSME-Screening-Report.pdf"');res.setHeader('Cache-Control','no-store');return res.send(makePdf(lines.flatMap(line=>wrap(line))));
  });
}
