import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Scene from './Scene.jsx';
import { PANELS, NAMES, N } from './data.jsx';
import { store } from './store.js';

const hasWebGL = () => {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
};

class Boundary extends React.Component {
  constructor(p) { super(p); this.state = { bad: false }; }
  static getDerivedStateFromError() { return { bad: true }; }
  componentDidCatch() { this.props.onFail(); }
  render() { return this.state.bad ? null : this.props.children; }
}

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const go = (k) => { const m = document.documentElement.scrollHeight - window.innerHeight; window.scrollTo({ top: (k / (N - 1)) * m, behavior: 'smooth' }); };

export default function App() {
  const [gl] = useState(hasWebGL);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(-1);
  const [fontsReady, setFontsReady] = useState(false);
  const [created, setCreated] = useState(false);
  const [timeout, setTimeoutDone] = useState(false);
  const mobile = useMemo(() => window.matchMedia('(max-width: 760px)').matches, []);
  const flat = !gl || failed;

  useEffect(() => {
    store.onActive = setActive;
    const ld = [document.fonts.load('700 48px Syncopate'), document.fonts.load('500 28px Sora'), document.fonts.load('400 24px Sora')];
    Promise.all(ld).catch(() => {}).then(() => setFontsReady(true));
    const t = setTimeout(() => setTimeoutDone(true), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (flat) return undefined;
    const onScroll = () => {
      const m = document.documentElement.scrollHeight - window.innerHeight;
      const p = m > 0 ? Math.min(1, Math.max(0, window.scrollY / m)) : 0;
      const u = p * (N - 1), i = Math.min(N - 1, Math.floor(u)), f = i >= N - 1 ? 0 : u - i;
      store.target = i + smooth(0.2, 0.8, f);   // dwell near each station
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [flat]);

  const onFail = useCallback(() => setFailed(true), []);
  const loaded = flat || (created && fontsReady) || timeout;

  return (
    <div className={flat ? 'flat' : ''}>
      {!flat && (
        <div id="stage" aria-hidden="true">
          <Boundary onFail={onFail}><Scene ready={fontsReady} onCreated={() => setCreated(true)} mobile={mobile} /></Boundary>
        </div>
      )}
      <nav>
        <b>AP</b>
        <button className="l" onClick={() => go(1)}>ABOUT</button>
        <button className="l" onClick={() => go(2)}>PROJECTS</button>
        <button className="l hide" onClick={() => go(7)}>HACKATHONS</button>
        <button className="l hide" onClick={() => go(8)}>SKILLS</button>
        <a className="cta" href="mailto:adityaprakashgupta76@gmail.com">HIRE ME</a>
      </nav>
      {!flat && (
        <>
          <div id="dots" role="navigation" aria-label="Chapters">
            {NAMES.map((n, k) => <button key={n} title={n} aria-label={n} className={active === k ? 'a' : ''} onClick={() => go(k)} />)}
          </div>
          <div id="lab">{active >= 0 ? `${String(active + 1).padStart(2, '0')} / ${NAMES[active].toUpperCase()}` : ''}</div>
        </>
      )}
      <main id="hud">
        {PANELS.map((p, i) => (
          <section key={i} className={`st ${p.side === 'bare' ? 'bare L' : p.side}${flat || active === i ? ' on' : ''}`}>{p.body}</section>
        ))}
      </main>
      {!flat && <div id="scroll" style={{ height: `${(N - 1) * 90 + 100}vh` }} />}
      <div className={`loader${loaded ? ' gone' : ''}`} aria-hidden="true">ENTERING</div>
    </div>
  );
}
