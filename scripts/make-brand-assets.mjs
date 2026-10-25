// Build the brand raster set from a single square master logo.
//
//   node scripts/make-brand-assets.mjs <master.png>
//
// Produces (all in src/assets/):
//   logo.png              master, untouched (source of truth)
//   icon-512.png          PWA / schema.org logo
//   icon-192.png          PWA / apple-touch
//   apple-touch-icon.png  180px, iOS home screen
//   logo-mark.png         72px, header/footer mark shown at 34–36px
//   favicon-96.png        raster payload embedded in favicon.svg
//   favicon.svg           navy tile + the mark, inline base64
//
// Pure Node (zlib only): no sharp/imagemagick dependency, so `npm ci` on any
// machine can regenerate the set. The master is cropped to the artwork's
// bounding box first — the supplied file has a lot of dead navy margin, and
// without the crop the mark is illegible at 16/32px.

import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync, deflateSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(ROOT, 'src', 'assets');

// ---------- PNG decode (8-bit truecolour, non-interlaced) ----------

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function decodePng(buf) {
  if (!buf.slice(0, 8).equals(PNG_SIG)) throw new Error('not a PNG');
  let pos = 8;
  let width = 0, height = 0, depth = 0, colorType = 0, interlace = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.slice(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      depth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') break;
    pos += 12 + len;
  }
  if (depth !== 8) throw new Error(`unsupported bit depth ${depth}`);
  if (interlace !== 0) throw new Error('interlaced PNG not supported');
  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 0;
  if (!channels) throw new Error(`unsupported colour type ${colorType}`);

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
      switch (filter) {
        case 0: break;
        case 1: v = (v + a) & 0xff; break;
        case 2: v = (v + b) & 0xff; break;
        case 3: v = (v + ((a + b) >> 1)) & 0xff; break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
          const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          v = (v + pr) & 0xff;
          break;
        }
        default: throw new Error(`bad filter ${filter}`);
      }
      cur[x] = v;
    }
    cur.copy(out, y * stride);
    prev = cur;
  }
  return { width, height, channels, data: out };
}

// ---------- PNG encode (RGBA, filter 0) ----------

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

function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // RGBA
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    PNG_SIG,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------- helpers ----------

function toRgba(img) {
  const { width, height, channels, data } = img;
  if (channels === 4) return { width, height, data };
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0, j = 0; i < width * height; i++, j += channels) {
    out[i * 4] = data[j];
    out[i * 4 + 1] = data[j + 1];
    out[i * 4 + 2] = data[j + 2];
    out[i * 4 + 3] = 255;
  }
  return { width, height, data: out };
}

/** Axis-aligned box of pixels that clearly differ from the corner colour.
 *  The master's background is a soft navy gradient, so a tight per-channel
 *  epsilon would swallow it whole — use a max-channel distance threshold. */
function contentBox({ width, height, data }, threshold = 90) {
  const bg = [data[0], data[1], data[2]];
  const near = (i) =>
    Math.max(
      Math.abs(data[i] - bg[0]),
      Math.abs(data[i + 1] - bg[1]),
      Math.abs(data[i + 2] - bg[2]),
    ) <= threshold;
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (!near(i)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return { x: 0, y: 0, w: width, h: height };
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/** Square crop around the artwork, padded so the mark never touches the edge. */
function squareCrop(img, box, padRatio) {
  const side = Math.max(box.w, box.h);
  const pad = Math.round(side * padRatio);
  const out = side + pad * 2;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const x0 = Math.round(cx - out / 2);
  const y0 = Math.round(cy - out / 2);
  const rgba = Buffer.alloc(out * out * 4);
  // Fill outside-the-source area with the master's background colour.
  const bg = [img.data[0], img.data[1], img.data[2], 255];
  for (let y = 0; y < out; y++) {
    for (let x = 0; x < out; x++) {
      const sx = x0 + x, sy = y0 + y;
      const d = (y * out + x) * 4;
      if (sx < 0 || sy < 0 || sx >= img.width || sy >= img.height) {
        rgba[d] = bg[0]; rgba[d + 1] = bg[1]; rgba[d + 2] = bg[2]; rgba[d + 3] = 255;
        continue;
      }
      const s = (sy * img.width + sx) * 4;
      rgba[d] = img.data[s];
      rgba[d + 1] = img.data[s + 1];
      rgba[d + 2] = img.data[s + 2];
      rgba[d + 3] = img.data[s + 3];
    }
  }
  return { width: out, height: out, data: rgba };
}

/** Box-filter downscale — averages every source pixel that lands in the target cell. */
function resize(src, size) {
  const { width, height, data } = src;
  const out = Buffer.alloc(size * size * 4);
  const sx = width / size;
  const sy = height / size;
  for (let y = 0; y < size; y++) {
    const y0 = Math.floor(y * sy), y1 = Math.max(y0 + 1, Math.floor((y + 1) * sy));
    for (let x = 0; x < size; x++) {
      const x0 = Math.floor(x * sx), x1 = Math.max(x0 + 1, Math.floor((x + 1) * sx));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let yy = y0; yy < y1; yy++) {
        for (let xx = x0; xx < x1; xx++) {
          const i = (yy * width + xx) * 4;
          r += data[i]; g += data[i + 1]; b += data[i + 2]; a += data[i + 3];
          n++;
        }
      }
      const d = (y * size + x) * 4;
      out[d] = Math.round(r / n);
      out[d + 1] = Math.round(g / n);
      out[d + 2] = Math.round(b / n);
      out[d + 3] = Math.round(a / n);
    }
  }
  return { width: size, height: size, data: out };
}

function hexOf({ data }) {
  return '#' + [data[0], data[1], data[2]].map((v) => v.toString(16).padStart(2, '0')).join('');
}

// ---------- run ----------

const masterPath = process.argv[2] || join(ASSETS, 'logo.png');
const master = readFileSync(masterPath);

// Keep the master in the repo as the regeneration source.
if (masterPath !== join(ASSETS, 'logo.png')) writeFileSync(join(ASSETS, 'logo.png'), master);

const decoded = toRgba(decodePng(master));
const box = contentBox(decoded);
const cropped = squareCrop(decoded, box, 0.06);
const bg = hexOf(decoded);

console.log(`master      ${decoded.width}×${decoded.height}  bg ${bg}`);
console.log(`artwork box x${box.x} y${box.y} ${box.w}×${box.h} → square ${cropped.width}px`);

const targets = [
  ['icon-512.png', 512],
  ['icon-192.png', 192],
  ['apple-touch-icon.png', 180],
  ['logo-mark.png', 72],
  ['favicon-96.png', 96],
];

for (const [name, size] of targets) {
  const img = resize(cropped, size);
  writeFileSync(join(ASSETS, name), encodePng(size, size, img.data));
  console.log(`  wrote src/assets/${name}  ${size}×${size}`);
}

// favicon.svg — a navy rounded tile with the mark inlined as base64 PNG. Browsers
// render an <image> data-URI fine, and it keeps the real artwork instead of a
// hand-traced approximation that would drift from the brand.
const fav96 = readFileSync(join(ASSETS, 'favicon-96.png')).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Tools4Market">
<rect width="64" height="64" rx="14" fill="${bg}"/>
<image x="4" y="4" width="56" height="56" href="data:image/png;base64,${fav96}"/>
</svg>
`;
writeFileSync(join(ASSETS, 'favicon.svg'), svg);
console.log(`  wrote src/assets/favicon.svg  (${(svg.length / 1024).toFixed(1)} KB)`);

// theme-color the manifest and <meta> should use
console.log(`theme-color ${bg}`);
