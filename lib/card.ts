// Canvas drawing for the Diwali greeting card and the photo frame.
// No website text is drawn anywhere – the logo is the only branding.

export type Theme = { id: string; label: string; sw: string; a: string; b: string; c: string };

export const THEMES: Theme[] = [
  { id: 'red', label: 'લાલ', sw: '#b91c1c', a: '#b3261e', b: '#640e12', c: '#1f0507' },
  { id: 'navy', label: 'વાદળી', sw: '#1e3a8a', a: '#2a45a0', b: '#13235e', c: '#050b24' },
  { id: 'saffron', label: 'કેસરી', sw: '#ea580c', a: '#e8640c', b: '#9a3412', c: '#3d1204' },
  { id: 'green', label: 'લીલો', sw: '#0f766e', a: '#12807a', b: '#0b4a47', c: '#031f1e' },
];

const GOLD = '#fbbf24';
const LIGHT = '#fde68a';
const PALE = '#fff8c9';
const DEEP = '#b45309';

type Ctx = CanvasRenderingContext2D;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function fontFamily() {
  try {
    const v = getComputedStyle(document.body).getPropertyValue('--f-head').trim();
    return v ? `${v}, serif` : 'serif';
  } catch {
    return 'serif';
  }
}

export async function loadFonts(fam: string) {
  try {
    await Promise.all([
      document.fonts.load(`700 100px ${fam}`, 'શુભ દિવાળી નૂતન વર્ષાભિનંદન'),
      document.fonts.load(`600 100px ${fam}`, 'દિવાળીની હાર્દિક શુભેચ્છાઓ પરિવાર'),
    ]);
  } catch {}
}

function bg(x: Ctx, W: number, H: number, t: Theme, cy: number) {
  const g = x.createRadialGradient(W / 2, cy, 60, W / 2, cy, Math.max(W, H) * 0.85);
  g.addColorStop(0, t.a);
  g.addColorStop(0.55, t.b);
  g.addColorStop(1, t.c);
  x.fillStyle = g;
  x.fillRect(0, 0, W, H);
  // soft bokeh lights
  const r = rng(11);
  for (let i = 0; i < 26; i++) {
    const px = r() * W, py = r() * H, pr = 8 + r() * 26;
    const bg2 = x.createRadialGradient(px, py, 0, px, py, pr);
    bg2.addColorStop(0, `rgba(253,230,138,${0.1 + r() * 0.12})`);
    bg2.addColorStop(1, 'rgba(253,230,138,0)');
    x.fillStyle = bg2;
    x.beginPath();
    x.arc(px, py, pr, 0, 7);
    x.fill();
  }
}

function border(x: Ctx, W: number, H: number) {
  x.strokeStyle = GOLD;
  x.lineWidth = 3;
  x.strokeRect(34, 34, W - 68, H - 68);
  x.globalAlpha = 0.55;
  x.lineWidth = 1.2;
  x.strokeRect(50, 50, W - 100, H - 100);
  x.globalAlpha = 1;
  x.fillStyle = GOLD;
  for (const [px, py] of [[34, 34], [W - 34, 34], [34, H - 34], [W - 34, H - 34]]) {
    x.save();
    x.translate(px, py);
    x.rotate(Math.PI / 4);
    x.fillRect(-9, -9, 18, 18);
    x.restore();
  }
}

// a string of warm fairy-lights along the top
function lights(x: Ctx, W: number) {
  const n = 4, seg = (W - 100) / n, top = 84, drop = 46;
  const bulbs = ['#fde047', '#fb923c', '#fef3c7', '#f59e0b'];
  x.lineWidth = 2;
  x.strokeStyle = 'rgba(251,191,36,.55)';
  for (let k = 0; k < n; k++) {
    const x0 = 50 + k * seg, x1 = x0 + seg, cxm = (x0 + x1) / 2;
    x.beginPath();
    x.moveTo(x0, top);
    x.quadraticCurveTo(cxm, top + drop * 2, x1, top);
    x.stroke();
    for (let i = 1; i < 6; i++) {
      const u = i / 6, ax = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * cxm + u * u * x1;
      const ay = (1 - u) * (1 - u) * top + 2 * (1 - u) * u * (top + drop * 2) + u * u * top;
      const c = bulbs[(k * 5 + i) % bulbs.length];
      const g = x.createRadialGradient(ax, ay + 12, 0, ax, ay + 12, 26);
      g.addColorStop(0, 'rgba(255,214,102,.65)');
      g.addColorStop(1, 'rgba(255,214,102,0)');
      x.fillStyle = g;
      x.beginPath();
      x.arc(ax, ay + 12, 26, 0, 7);
      x.fill();
      x.fillStyle = c;
      x.beginPath();
      x.ellipse(ax, ay + 12, 6, 9, 0, 0, 7);
      x.fill();
    }
  }
}

function sparkle(x: Ctx, px: number, py: number, s: number, a: number) {
  x.save();
  x.globalAlpha = a;
  x.fillStyle = PALE;
  x.beginPath();
  x.moveTo(px, py - s);
  x.quadraticCurveTo(px, py, px + s, py);
  x.quadraticCurveTo(px, py, px, py + s);
  x.quadraticCurveTo(px, py, px - s, py);
  x.quadraticCurveTo(px, py, px, py - s);
  x.fill();
  x.restore();
}

// y0 = rim centre line of the diya, s = scale (1 ≈ 380px wide bowl)
function diya(x: Ctx, cx: number, y0: number, s: number) {
  // ground shadow
  x.fillStyle = 'rgba(0,0,0,.35)';
  x.beginPath();
  x.ellipse(cx, y0 + 168 * s, 170 * s, 16 * s, 0, 0, 7);
  x.fill();
  // flame glow
  let g = x.createRadialGradient(cx, y0 - 120 * s, 10, cx, y0 - 120 * s, 330 * s);
  g.addColorStop(0, 'rgba(255,214,102,.8)');
  g.addColorStop(0.4, 'rgba(255,170,40,.28)');
  g.addColorStop(1, 'rgba(255,160,0,0)');
  x.fillStyle = g;
  x.fillRect(cx - 340 * s, y0 - 460 * s, 680 * s, 680 * s);
  // flame
  x.beginPath();
  x.moveTo(cx, y0 - 220 * s);
  x.bezierCurveTo(cx + 62 * s, y0 - 140 * s, cx + 46 * s, y0 - 55 * s, cx, y0 - 28 * s);
  x.bezierCurveTo(cx - 46 * s, y0 - 55 * s, cx - 62 * s, y0 - 140 * s, cx, y0 - 220 * s);
  g = x.createLinearGradient(0, y0 - 220 * s, 0, y0 - 28 * s);
  g.addColorStop(0, '#fde047');
  g.addColorStop(1, '#f97316');
  x.fillStyle = g;
  x.fill();
  x.beginPath();
  x.moveTo(cx, y0 - 145 * s);
  x.bezierCurveTo(cx + 24 * s, y0 - 100 * s, cx + 20 * s, y0 - 60 * s, cx, y0 - 40 * s);
  x.bezierCurveTo(cx - 20 * s, y0 - 60 * s, cx - 24 * s, y0 - 100 * s, cx, y0 - 145 * s);
  x.fillStyle = '#fffbe0';
  x.fill();
  // wick
  x.fillStyle = '#451a03';
  x.fillRect(cx - 6 * s, y0 - 30 * s, 12 * s, 28 * s);
  // bowl
  x.beginPath();
  x.moveTo(cx - 190 * s, y0);
  x.quadraticCurveTo(cx, y0 - 14 * s, cx + 190 * s, y0);
  x.bezierCurveTo(cx + 170 * s, y0 + 115 * s, cx + 80 * s, y0 + 160 * s, cx, y0 + 160 * s);
  x.bezierCurveTo(cx - 80 * s, y0 + 160 * s, cx - 170 * s, y0 + 115 * s, cx - 190 * s, y0);
  g = x.createLinearGradient(0, y0, 0, y0 + 160 * s);
  g.addColorStop(0, '#f59e0b');
  g.addColorStop(1, '#6b2d0b');
  x.fillStyle = g;
  x.fill();
  x.fillStyle = '#78350f';
  x.beginPath();
  x.ellipse(cx, y0, 190 * s, 30 * s, 0, 0, 7);
  x.fill();
  x.fillStyle = '#c2670d';
  x.beginPath();
  x.ellipse(cx, y0, 152 * s, 20 * s, 0, 0, 7);
  x.fill();
  // rim highlight + dots
  x.strokeStyle = 'rgba(253,230,138,.55)';
  x.lineWidth = 3 * s;
  x.beginPath();
  x.ellipse(cx, y0, 190 * s, 30 * s, 0, Math.PI * 0.1, Math.PI * 0.9);
  x.stroke();
  x.fillStyle = LIGHT;
  for (const dx of [-100, -50, 0, 50, 100]) {
    x.beginPath();
    x.arc(cx + dx * s, y0 + (82 - Math.abs(dx) * 0.18) * s, 7 * s, 0, 7);
    x.fill();
  }
}

function fit(x: Ctx, text: string, weight: number, size: number, max: number, fam: string, min = 28) {
  let fs = size;
  x.font = `${weight} ${fs}px ${fam}`;
  while (x.measureText(text).width > max && fs > min) {
    fs -= 2;
    x.font = `${weight} ${fs}px ${fam}`;
  }
  return fs;
}

function goldText(x: Ctx, text: string, cx: number, base: number, size: number, fam: string) {
  x.save();
  x.textAlign = 'center';
  x.shadowColor = 'rgba(251,191,36,.65)';
  x.shadowBlur = 34;
  const fs = fit(x, text, 700, size, 900, fam, 60);
  const g = x.createLinearGradient(0, base - fs, 0, base + 10);
  g.addColorStop(0, PALE);
  g.addColorStop(0.5, GOLD);
  g.addColorStop(1, DEEP);
  x.fillStyle = g;
  x.fillText(text, cx, base);
  x.restore();
}

function logoBadge(x: Ctx, logo: HTMLImageElement | null, cx: number, cy: number, r: number) {
  // soft glow
  const g = x.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.9);
  g.addColorStop(0, 'rgba(255,214,102,.5)');
  g.addColorStop(1, 'rgba(255,214,102,0)');
  x.fillStyle = g;
  x.beginPath();
  x.arc(cx, cy, r * 1.9, 0, 7);
  x.fill();
  x.save();
  x.beginPath();
  x.arc(cx, cy, r, 0, 7);
  x.closePath();
  x.fillStyle = '#fff';
  x.fill();
  x.clip();
  if (logo) {
    x.imageSmoothingEnabled = true;
    x.imageSmoothingQuality = 'high';
    x.drawImage(logo, cx - r + 4, cy - r + 4, (r - 4) * 2, (r - 4) * 2);
  }
  x.restore();
  x.strokeStyle = GOLD;
  x.lineWidth = 6;
  x.beginPath();
  x.arc(cx, cy, r + 4, 0, 7);
  x.stroke();
  x.strokeStyle = 'rgba(253,230,138,.5)';
  x.lineWidth = 1.5;
  x.beginPath();
  x.arc(cx, cy, r + 14, 0, 7);
  x.stroke();
}

export type CardOpts = { name: string; theme: number; logo: HTMLImageElement | null; fam: string };

// 1080 x 1350 – clean, uncluttered greeting card
export function drawCard(c: HTMLCanvasElement, o: CardOpts) {
  const W = 1080, H = 1350, cx = W / 2;
  c.width = W;
  c.height = H;
  const x = c.getContext('2d')!;
  const t = THEMES[o.theme] || THEMES[0];
  const fam = o.fam;
  x.textAlign = 'center';
  bg(x, W, H, t, 800);
  // faint mandala behind the diya
  x.save();
  x.translate(cx, 800);
  x.strokeStyle = 'rgba(253,224,71,.16)';
  x.lineWidth = 3;
  for (const r of [250, 335]) {
    x.beginPath();
    x.arc(0, 0, r, 0, 7);
    x.stroke();
  }
  for (let k = 0; k < 16; k++) {
    x.rotate((Math.PI * 2) / 16);
    x.beginPath();
    x.ellipse(0, -292, 22, 46, 0, 0, 7);
    x.stroke();
  }
  x.restore();
  border(x, W, H);
  lights(x, W);
  logoBadge(x, o.logo, cx, 240, 92);
  goldText(x, 'શુભ દિવાળી', cx, 492, 160, fam);
  // subtitle with small ornaments
  x.fillStyle = LIGHT;
  x.font = `600 56px ${fam}`;
  x.fillText('નૂતન વર્ષાભિનંદન', cx, 580);
  const sw = x.measureText('નૂતન વર્ષાભિનંદન').width / 2;
  x.strokeStyle = 'rgba(253,230,138,.7)';
  x.lineWidth = 2;
  for (const d of [-1, 1]) {
    x.beginPath();
    x.moveTo(cx + d * (sw + 28), 562);
    x.lineTo(cx + d * (sw + 120), 562);
    x.stroke();
    x.fillStyle = GOLD;
    x.beginPath();
    x.arc(cx + d * (sw + 130), 562, 5, 0, 7);
    x.fill();
  }
  diya(x, cx, 890, 1.05);
  const r = rng(5);
  for (let i = 0; i < 9; i++) {
    const a = r() * Math.PI * 2, d = 250 + r() * 130;
    const sx = cx + Math.cos(a) * d * 1.25, sy = 790 + Math.sin(a) * d * 0.7, ss = 8 + r() * 12, sa = 0.35 + r() * 0.5;
    if (Math.abs(sx - cx) < 240 && sy > 600 && sy < 1070) continue; // keep the diya clear
    sparkle(x, sx, sy, ss, sa);
  }
  // greeting
  const n = o.name.trim().slice(0, 28);
  const line = n ? `${n} પરિવારને` : 'આપ સૌને';
  fit(x, line, 700, 72, 900, fam, 34);
  x.fillStyle = '#fff';
  x.fillText(line, cx, 1170);
  x.fillStyle = LIGHT;
  x.font = `600 52px ${fam}`;
  x.fillText('દિવાળીની હાર્દિક શુભેચ્છાઓ', cx, 1245);
}

export type FrameOpts = {
  name: string;
  theme: number;
  logo: HTMLImageElement | null;
  photo: HTMLImageElement | null;
  zoom: number;
  ox: number;
  oy: number;
  fam: string;
};

// 1080 x 1080 – circular photo frame with logo badge
export function drawFrame(c: HTMLCanvasElement, o: FrameOpts) {
  const W = 1080, H = 1080, cx = W / 2, cy = 565, R = 285;
  c.width = W;
  c.height = H;
  const x = c.getContext('2d')!;
  const t = THEMES[o.theme] || THEMES[0];
  const fam = o.fam;
  x.textAlign = 'center';
  bg(x, W, H, t, cy);
  border(x, W, H);
  lights(x, W);
  goldText(x, 'શુભ દિવાળી', cx, 262, 112, fam);
  // glow + rings
  const g = x.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.5);
  g.addColorStop(0, 'rgba(255,200,80,.45)');
  g.addColorStop(1, 'rgba(255,200,80,0)');
  x.fillStyle = g;
  x.beginPath();
  x.arc(cx, cy, R * 1.5, 0, 7);
  x.fill();
  x.strokeStyle = 'rgba(253,224,71,.35)';
  x.lineWidth = 2;
  x.beginPath();
  x.arc(cx, cy, R + 38, 0, 7);
  x.stroke();
  // photo
  x.save();
  x.beginPath();
  x.arc(cx, cy, R, 0, 7);
  x.closePath();
  x.fillStyle = 'rgba(255,255,255,.12)';
  x.fill();
  x.clip();
  if (o.photo) {
    const iw = o.photo.naturalWidth, ih = o.photo.naturalHeight;
    const sc = Math.max((2 * R) / iw, (2 * R) / ih) * o.zoom;
    const dw = iw * sc, dh = ih * sc;
    const dx = cx - R - (dw - 2 * R) * ((o.ox + 1) / 2);
    const dy = cy - R - (dh - 2 * R) * ((o.oy + 1) / 2);
    x.imageSmoothingQuality = 'high';
    x.drawImage(o.photo, dx, dy, dw, dh);
  } else {
    x.fillStyle = 'rgba(255,255,255,.28)';
    x.beginPath();
    x.arc(cx, cy - 40, 82, 0, 7);
    x.fill();
    x.beginPath();
    x.ellipse(cx, cy + 190, 170, 150, 0, 0, 7);
    x.fill();
  }
  x.restore();
  x.strokeStyle = GOLD;
  x.lineWidth = 10;
  x.beginPath();
  x.arc(cx, cy, R + 5, 0, 7);
  x.stroke();
  // logo badge on the ring
  const a = Math.PI / 4;
  logoBadge(x, o.logo, cx + Math.cos(a) * (R + 5), cy + Math.sin(a) * (R + 5), 62);
  // two small diyas
  diya(x, 165, 905, 0.36);
  diya(x, W - 165, 905, 0.36);
  const n = o.name.trim().slice(0, 28);
  x.fillStyle = '#fff';
  if (n) {
    const l = `${n} પરિવાર તરફથી`;
    fit(x, l, 700, 52, 560, fam, 30);
    x.fillText(l, cx, 948);
  }
  x.fillStyle = LIGHT;
  fit(x, 'દિવાળીની હાર્દિક શુભેચ્છાઓ', 600, 50, 560, fam, 30);
  x.fillText('દિવાળીની હાર્દિક શુભેચ્છાઓ', cx, n ? 1012 : 985);
}

export function download(c: HTMLCanvasElement, file: string) {
  c.toBlob((b) => {
    if (!b) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = file;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  });
}

// Shares the image through the phone's share sheet (WhatsApp etc.).
// Desktop fallback: saves the image and tells the caller to attach it manually.
export function share(c: HTMLCanvasElement, file: string, text: string): Promise<'shared' | 'saved'> {
  return new Promise((res) => {
    c.toBlob(async (b) => {
      if (!b) return res('saved');
      const f = new File([b], file, { type: 'image/png' });
      const n: any = navigator;
      if (n.canShare?.({ files: [f] })) {
        try {
          await n.share({ files: [f], text });
          return res('shared');
        } catch {
          return res('saved');
        }
      }
      download(c, file);
      res('saved');
    });
  });
}

export function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((res) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => res(null);
    i.src = src;
  });
}
