// Regenerate src/assets/og-image.png (1200×630 social card).
//
//   node scripts/render-og.mjs
//   → open http://127.0.0.1:8792/ in any browser (renders + saves automatically)
//
// Why a browser: the card needs real type rendering. A canvas can do that at
// exact device pixels, so the output is a crisp 1200×630 instead of an upscaled
// viewport grab. The page POSTs the PNG back here and this process writes it.

import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync, inflateSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT || 8792);

// ---------- PNG re-encode: drop alpha + 5-bit-per-channel quantise ----------
// The canvas emits RGBA with smooth gradients, which PNG stores poorly (776 KB
// for one card). Opaque RGB at 32 levels per channel is visually identical at
// this size and lands around 57 KB — worth it for a thumbnail that gets fetched
// by every social crawler.

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function decodeRgba(buf) {
  let pos = 8;
  let width = 0, height = 0, colorType = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.slice(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  const channels = colorType === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);
  let prev = Buffer.alloc(stride);
  let rp = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[rp++];
    const line = raw.slice(rp, rp + stride);
    rp += stride;
    const cur = Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? cur[x - channels] : 0;
      const b = prev[x];
      const c = x >= channels ? prev[x - channels] : 0;
      let v = line[x];
      if (filter === 1) v = (v + a) & 0xff;
      else if (filter === 2) v = (v + b) & 0xff;
      else if (filter === 3) v = (v + ((a + b) >> 1)) & 0xff;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 0xff;
      }
      cur[x] = v;
    }
    cur.copy(out, y * stride);
    prev = cur;
  }
  return { width, height, channels, data: out };
}

function compressPng(buf) {
  const { width, height, channels, data } = decodeRgba(buf);
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const o = y * (stride + 1);
    raw[o] = 0;
    for (let x = 0; x < width; x++) {
      const s = (y * width + x) * channels;
      for (let k = 0; k < 3; k++) {
        // 5-bit quantise: level * 8, clamped so 248 is the brightest step below white
        const level = Math.round(data[s + k] / 8);
        raw[o + 1 + x * 3 + k] = level >= 32 ? 255 : level * 8;
      }
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2; // RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.css': 'text/css; charset=utf-8',
};

const server = createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/save') {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const buf = Buffer.concat(chunks);
    if (buf.slice(0, 8).toString('hex') !== '89504e470d0a1a0a') {
      res.writeHead(400).end('not a png');
      return;
    }
    const png = compressPng(buf);
    await writeFile(join(ROOT, 'src/assets/og-image.png'), png);
    res.writeHead(200, { 'content-type': 'text/plain' }).end('ok');
    console.log(`✔ wrote src/assets/og-image.png (${(png.length / 1024).toFixed(1)} KB, ${(buf.length / 1024).toFixed(0)} KB before)`);
    return;
  }

  const url = new URL(req.url, 'http://x');
  let p = decodeURIComponent(url.pathname);
  if (p === '/') p = '/og-card.html';

  const map = p.startsWith('/assets/')
    ? join(ROOT, 'src/assets', p.slice(8))
    : p.startsWith('/fonts/')
      ? join(ROOT, 'src/fonts', p.slice(7))
      : join(ROOT, 'scripts/brand', p.replace(/^\//, ''));

  const safe = normalize(map);
  if (!safe.startsWith(ROOT)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  try {
    const buf = await readFile(safe);
    res.writeHead(200, { 'content-type': TYPES[extname(safe)] || 'application/octet-stream' }).end(buf);
  } catch {
    res.writeHead(404).end('not found');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`OG card renderer → http://127.0.0.1:${PORT}/`);
});
