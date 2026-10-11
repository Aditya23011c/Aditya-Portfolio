import * as THREE from 'three';

const W = 1280, H = 800;
const INFO = {
  'mail-rakshak': { t: 'MAIL RAKSHAK', s: 'AI email threat detection', g: 'DistilBERT · FastAPI · Blockchain', c: '#ff8a4a' },
  'farm-rakshak': { t: 'FARM RAKSHAK', s: 'AI livestock intelligence hub', g: 'Gemini API · Multi-agent AI', c: '#c6f432' },
  'nlp-playground': { t: 'AI NLP PLAYGROUND', s: 'Six NLP tools in one app', g: 'Python · NLTK · HuggingFace', c: '#ffc46b' },
  'nasa-weather': { t: 'NASA WEATHER MODEL', s: 'Temperature and rain forecasts', g: 'Random Forest · MERRA-2 · GPM', c: '#ff9a5a' },
  cognitolab: { t: 'COGNITOLAB', s: 'Psychology experiments in the browser', g: 'Interactive web platform', c: '#ffd27a' },
  photo: { t: 'AP', s: '', g: '', c: '#ffa24a' },
};

function wrap(x, text, px, py, mw, lh) {
  let line = '';
  text.split(' ').forEach((w) => {
    const t = line ? line + ' ' + w : w;
    if (line && x.measureText(t).width > mw) { x.fillText(line, px, py); py += lh; line = w; } else line = t;
  });
  x.fillText(line, px, py);
  return py;
}

function motif(x, slug, c) {
  const bx = 700, by = 130, bw = 500, bh = 540;
  x.strokeStyle = 'rgba(255,162,74,.35)'; x.lineWidth = 2; x.strokeRect(bx, by, bw, bh);
  if (slug === 'mail-rakshak') {
    x.strokeStyle = c; x.lineWidth = 5; x.strokeRect(bx + 50, by + 90, 400, 250);
    x.beginPath(); x.moveTo(bx + 50, by + 90); x.lineTo(bx + 250, by + 240); x.lineTo(bx + 450, by + 90); x.stroke();
    x.fillStyle = '#ff4a3c'; x.beginPath(); x.arc(bx + 430, by + 95, 46, 0, 7); x.fill();
    x.fillStyle = '#fff'; x.font = '700 58px Sora, Arial'; x.textBaseline = 'middle'; x.textAlign = 'center'; x.fillText('!', bx + 430, by + 98); x.textAlign = 'left';
    [[.95, '#7be07b'], [.5, '#ffc34a'], [.2, '#ff5a3c']].forEach((b, k) => { x.fillStyle = 'rgba(255,255,255,.08)'; x.fillRect(bx + 50, by + 390 + k * 42, 400, 18); x.fillStyle = b[1]; x.fillRect(bx + 50, by + 390 + k * 42, 400 * b[0], 18); });
  } else if (slug === 'farm-rakshak') {
    [[bx + 170, by + 190, 170, '255,90,40'], [bx + 330, by + 300, 150, '255,190,60'], [bx + 250, by + 130, 110, '255,60,90']].forEach((b) => {
      const g = x.createRadialGradient(b[0], b[1], 5, b[0], b[1], b[2]); g.addColorStop(0, `rgba(${b[3]},.95)`); g.addColorStop(1, `rgba(${b[3]},0)`); x.fillStyle = g; x.fillRect(bx, by, bw, bh);
    });
    x.strokeStyle = c; x.lineWidth = 3; x.strokeRect(bx + 120, by + 110, 260, 260);
    x.beginPath(); x.moveTo(bx + 250, by + 90); x.lineTo(bx + 250, by + 390); x.moveTo(bx + 100, by + 240); x.lineTo(bx + 400, by + 240); x.stroke();
  } else if (slug === 'nlp-playground') {
    ['summarize', 'translate', 'entities', 'keywords', 'sentiment', 'chatbot'].forEach((s, k) => {
      const px = bx + 40 + (k % 2) * 230, py = by + 50 + ((k / 2) | 0) * 150;
      x.strokeStyle = c; x.lineWidth = 3; x.strokeRect(px, py, 200, 90); x.fillStyle = '#ffe2b8'; x.font = '500 26px Sora, Arial'; x.textBaseline = 'middle'; x.fillText(s, px + 20, py + 46);
    });
  } else if (slug === 'nasa-weather') {
    x.strokeStyle = c; x.lineWidth = 6; x.beginPath();
    for (let k = 0; k <= 40; k++) { const px = bx + 30 + k * 11.5, py = by + 270 + Math.sin(k / 4) * 120 + Math.cos(k / 2.3) * 40; k ? x.lineTo(px, py) : x.moveTo(px, py); }
    x.stroke(); x.fillStyle = '#fff';
    for (let k = 0; k <= 40; k += 5) { x.beginPath(); x.arc(bx + 30 + k * 11.5, by + 270 + Math.sin(k / 4) * 120 + Math.cos(k / 2.3) * 40, 9, 0, 7); x.fill(); }
  } else if (slug === 'cognitolab') {
    const cs = ['#ff5a3c', '#ffc34a', '#4aa8ff', '#7be07b'];
    for (let k = 0; k < 20; k++) { x.fillStyle = cs[(k * 7 + (k >> 2)) % 4]; x.beginPath(); x.arc(bx + 70 + (k % 5) * 90, by + 80 + (k >> 2) * 100, 34, 0, 7); x.fill(); }
  } else {
    x.fillStyle = c; x.font = '700 260px Syncopate, Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('AP', W / 2, H / 2); x.textAlign = 'left';
  }
}

export function makeArt(slug) {
  const info = INFO[slug] || INFO.photo;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const x = cv.getContext('2d');
  const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#1b0f08'); g.addColorStop(1, '#341a0b');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.strokeStyle = 'rgba(255,162,74,.07)'; x.lineWidth = 1;
  for (let k = 0; k < W; k += 40) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k, H); x.stroke(); }
  for (let k = 0; k < H; k += 40) { x.beginPath(); x.moveTo(0, k); x.lineTo(W, k); x.stroke(); }
  if (slug !== 'photo') {
    x.textBaseline = 'top'; x.fillStyle = info.c; x.font = '500 24px Sora, Arial'; x.fillText('SELECTED PROJECT', 70, 150);
    x.fillStyle = '#fff3e0'; x.font = '700 62px Syncopate, Arial'; const y = wrap(x, info.t, 70, 205, 580, 76);
    x.fillStyle = '#ffc98a'; x.font = '500 32px Sora, Arial'; const y2 = wrap(x, info.s, 70, y + 120, 580, 44);
    x.fillStyle = '#c9b49c'; x.font = '400 26px Sora, Arial'; wrap(x, info.g, 70, y2 + 80, 580, 38);
  }
  motif(x, slug, info.c);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
