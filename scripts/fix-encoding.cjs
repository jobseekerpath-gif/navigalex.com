const fs = require('fs');
const path = require('path');

const cp1252Special = {
  '\u20AC': 0x80, '\u201A': 0x82, '\u0192': 0x83, '\u201E': 0x84,
  '\u2026': 0x85, '\u2020': 0x86, '\u2021': 0x87, '\u02C6': 0x88,
  '\u2030': 0x89, '\u0160': 0x8A, '\u2039': 0x8B, '\u0152': 0x8C,
  '\u017D': 0x8E, '\u2018': 0x91, '\u2019': 0x92, '\u201C': 0x93,
  '\u201D': 0x94, '\u2022': 0x95, '\u2013': 0x96, '\u2014': 0x97,
  '\u02DC': 0x98, '\u2122': 0x99, '\u0161': 0x9A, '\u203A': 0x9B,
  '\u0153': 0x9C, '\u017E': 0x9E, '\u0178': 0x9F
};

function toByte(ch) {
  const cp = ch.codePointAt(0);
  return cp <= 0xFF ? cp : (cp1252Special[ch] ?? null);
}

function repair(text) {
  const suspicious = new Set(['Â', 'Ã', 'â', 'ð', 'ï']);
  let out = '';

  for (let i = 0; i < text.length;) {
    if (!suspicious.has(text[i])) {
      out += text[i++];
      continue;
    }

    let best = null;
    for (let len = 2; len <= 8 && i + len <= text.length; len++) {
      const chunk = text.slice(i, i + len);
      const bytes = [];
      let valid = true;
      for (const ch of chunk) {
        const b = toByte(ch);
        if (b === null) { valid = false; break; }
        bytes.push(b);
      }
      if (!valid) break;
      const decoded = Buffer.from(bytes).toString('utf8');
      if (!decoded.includes('\uFFFD') && decoded !== chunk && /[^\x00-\x7F]/.test(decoded)) {
        best = { decoded, len };
      }
    }

    if (best) {
      out += best.decoded;
      i += best.len;
    } else {
      out += text[i++];
    }
  }
  return out;
}

const root = path.resolve('dist');
const extensions = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt']);
let changed = 0;

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (extensions.has(path.extname(entry.name).toLowerCase())) {
      const before = fs.readFileSync(full, 'utf8');
      const after = repair(before);
      if (after !== before) {
        fs.writeFileSync(full, after, 'utf8');
        changed++;
      }
    }
  }
}

walk(root);
console.log(`Encoding repair complete: ${changed} file(s) updated.`);
