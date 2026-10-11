import React, { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, MeshReflectorMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { S, N, SD, FRAMES, HACKATHONS, SKILL_WORDS } from './data.jsx';
import { store } from './store.js';
import { makeArt } from './art.js';

// Colours > 1 with toneMapped={false} are what make the strips glow (bloom picks them up).
const GLOW = [1.9, 0.95, 0.22];
const GLOW_SOFT = [1.0, 0.5, 0.12];
const EMBER = [1.8, 0.5, 0.1];
const FONT = '/fonts/syncopate-700.woff';
const FONT_BODY = '/fonts/sora-500.woff';
const LEN = 150, CZ = -67; // corridor length and centre


const spriteTex = (() => {
  let tex = null;
  return () => {
    if (tex) return tex;
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const x = c.getContext('2d'); const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,.6)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    tex = new THREE.CanvasTexture(c); return tex;
  };
})();

// Floating dust motes (own implementation: soft round sprites that drift slowly).
function Dust({ count }) {
  const ref = useRef();
  const pos = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { a[i * 3] = (Math.random() - 0.5) * 5.8; a[i * 3 + 1] = Math.random() * 5; a[i * 3 + 2] = 8 - Math.random() * LEN; }
    return a;
  }, [count]);
  useFrame(({ clock }) => { if (ref.current) ref.current.position.y = Math.sin(clock.elapsedTime * 0.3) * 0.15; });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" array={pos} count={count} itemSize={3} /></bufferGeometry>
      <pointsMaterial map={spriteTex()} size={0.07} color="#ffb060" transparent opacity={0.65} depthWrite={false} sizeAttenuation />
    </points>
  );
}

class Guard extends React.Component {
  constructor(p) { super(p); this.state = { bad: false }; }
  static getDerivedStateFromError() { return { bad: true }; }
  componentDidCatch() {}
  render() { return this.state.bad ? null : this.props.children; }
}
// 3D text that is only shown while the camera is near its station (troika text ignores fog).
function T({ at, range = 1.4, ...props }) {
  const g = useRef();
  useFrame(() => { if (g.current && at !== undefined) g.current.visible = Math.abs(store.cur - at) < range; });
  return <group ref={g}><Guard><Suspense fallback={null}><Text font={FONT} {...props} /></Suspense></Guard></group>;
}

function Corridor({ mobile }) {
  const slats = useRef();
  const count = 100;
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(); let k = 0;
    for (let i = 0; i < count; i++) [-1, 1].forEach((s) => { m.makeTranslation(s * 3.1, 2.6, 6 - i * (LEN / count)); slats.current.setMatrixAt(k++, m); });
    slats.current.instanceMatrix.needsUpdate = true;
  }, []);
  const ribs = useMemo(() => Array.from({ length: 38 }, (_, i) => 8 - i * 4), []);
  return (
    <group>
      <mesh position={[0, 0, CZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.4, LEN]} />
        {mobile
          ? <meshStandardMaterial color="#1a0e07" metalness={0.5} roughness={0.5} />
          : <MeshReflectorMaterial blur={[300, 100]} resolution={512} mixBlur={1} mixStrength={1.4} roughness={0.9} depthScale={0.5} minDepthThreshold={0.4} maxDepthThreshold={1.2} color="#1a0e07" metalness={0.5} mirror={0.6} />}
      </mesh>
      <mesh position={[0, 0.012, CZ]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.3, LEN]} /><meshBasicMaterial color="#3a1706" transparent opacity={0.85} /></mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 3.2, 2.7, CZ]} rotation={[0, -s * Math.PI / 2, 0]}><planeGeometry args={[LEN, 5.4]} /><meshStandardMaterial color="#1f1008" roughness={0.85} /></mesh>
          <mesh position={[s * 3.12, 0.22, CZ]}><boxGeometry args={[0.06, 0.06, LEN]} /><meshBasicMaterial color={GLOW} toneMapped={false} /></mesh>
          <mesh position={[s * 3.12, 4.75, CZ]}><boxGeometry args={[0.06, 0.05, LEN]} /><meshBasicMaterial color={GLOW_SOFT} toneMapped={false} /></mesh>
          <mesh position={[s * 1.4, 5.36, CZ]}><boxGeometry args={[0.1, 0.04, LEN]} /><meshBasicMaterial color={GLOW} toneMapped={false} /></mesh>
          <mesh position={[s * 0.65, 0.03, CZ]}><boxGeometry args={[0.03, 0.02, LEN]} /><meshBasicMaterial color={GLOW_SOFT} toneMapped={false} /></mesh>
        </group>
      ))}
      <mesh position={[0, 5.4, CZ]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[6.4, LEN]} /><meshStandardMaterial color="#120a05" roughness={0.9} /></mesh>
      <instancedMesh ref={slats} args={[null, null, count * 2]}>
        <boxGeometry args={[0.12, 5, 0.34]} />
        <meshStandardMaterial color="#3c1f0e" metalness={0.3} roughness={0.55} emissive="#1d0b03" />
      </instancedMesh>
      {ribs.map((z, i) => (
        <group key={z} position={[0, 2, z]}>
          <mesh><torusGeometry args={[3.15, 0.07, 8, 48, Math.PI]} /><meshStandardMaterial color="#9a5226" metalness={0.8} roughness={0.35} emissive="#3a1604" /></mesh>
          {i % 2 === 0 && <mesh><torusGeometry args={[3.04, 0.016, 6, 64, Math.PI]} /><meshBasicMaterial color={GLOW_SOFT} toneMapped={false} /></mesh>}
        </group>
      ))}
      <mesh position={[0, 2.7, CZ - LEN / 2 + 3]}><planeGeometry args={[6.4, 5.4]} /><meshStandardMaterial color="#120a05" /></mesh>
    </group>
  );
}

// Circuit-style tree on the right wall of the entrance.
function Tree({ z }) {
  const pts = useRef();
  const { lines, nodes } = useMemo(() => {
    let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const seg = [], nd = [];
    const br = (x, y, a, l, d) => {
      const ex = x + Math.sin(a) * l, ey = y + Math.cos(a) * l;
      seg.push([x, y, ex, ey]); nd.push([ex, ey]);
      if (d === 0) return;
      const k = d > 3 ? 3 : 2;
      for (let i = 0; i < k; i++) br(ex, ey, a + (i - (k - 1) / 2) * (0.5 + rnd() * 0.35), l * (0.7 + rnd() * 0.08), d - 1);
    };
    br(0, 0, 0, 1.45, 6);
    const L = [], P = [];
    seg.forEach(([x1, y1, x2, y2]) => L.push(2.92, y1 + 0.35, z - x1 * 1.15, 2.92, y2 + 0.35, z - x2 * 1.15));
    nd.forEach(([x, y]) => P.push(2.92, y + 0.35, z - x * 1.15));
    return { lines: new Float32Array(L), nodes: new Float32Array(P) };
  }, [z]);
  useFrame(({ clock }) => { if (pts.current) pts.current.material.size = 0.15 + Math.sin(clock.elapsedTime * 2) * 0.03; });
  return (
    <group>
      <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" array={lines} count={lines.length / 3} itemSize={3} /></bufferGeometry><lineBasicMaterial color={GLOW} toneMapped={false} /></lineSegments>
      <points ref={pts}><bufferGeometry><bufferAttribute attach="attributes-position" array={nodes} count={nodes.length / 3} itemSize={3} /></bufferGeometry><pointsMaterial map={spriteTex()} alphaTest={0.3} transparent size={0.16} color={[2, 1.4, 0.5]} toneMapped={false} sizeAttenuation depthWrite={false} /></points>
      <mesh position={[2.9, 0.2, z]}><boxGeometry args={[0.1, 0.4, 1.2]} /><meshBasicMaterial color={GLOW} toneMapped={false} /></mesh>
    </group>
  );
}

function useArt(slug, aspect, ready) {
  const [tex, setTex] = useState(null);
  useEffect(() => {
    if (!ready) return undefined;
    let dead = false;
    setTex(makeArt(slug));
    const urls = slug === 'photo' ? ['/photo.jpg'] : ['png', 'jpg', 'webp'].map((e) => `/projects/${slug}.${e}`);
    const tryNext = (i) => {
      if (dead || i >= urls.length) return;
      new THREE.TextureLoader().load(urls[i], (t) => {
        if (dead) return;
        t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
        const ia = t.image.width / t.image.height;
        if (ia > aspect) { t.repeat.x = aspect / ia; t.offset.x = (1 - t.repeat.x) / 2; } else { t.repeat.y = ia / aspect; t.offset.y = (1 - t.repeat.y) / 2; }
        setTex(t);
      }, undefined, () => tryNext(i + 1));
    };
    tryNext(0);
    return () => { dead = true; };
  }, [slug, aspect, ready]);
  return tex;
}

function Frame({ f, ready }) {
  const tex = useArt(f.slug, f.w / f.h, ready);
  const bar = useRef();
  useFrame(({ clock }) => { if (bar.current) bar.current.position.y = ((clock.elapsedTime * 0.35 + f.st * 0.3) % 1) * f.h - f.h / 2; });
  const z = -S * f.st - 5;
  const bw = 0.026;
  return (
    <group position={[f.side * 2.78, 1.95, z]} rotation={[0, -f.side * Math.PI / 2, 0]}>
      <mesh><boxGeometry args={[f.w + 0.34, f.h + 0.34, 0.14]} /><meshStandardMaterial color="#6d4021" metalness={0.7} roughness={0.35} /></mesh>
      {[[f.w + 0.4, bw, 0, (f.h + 0.34) / 2], [f.w + 0.4, bw, 0, -(f.h + 0.34) / 2], [bw, f.h + 0.4, (f.w + 0.34) / 2, 0], [bw, f.h + 0.4, -(f.w + 0.34) / 2, 0]].map((e, i) => (
        <mesh key={i} position={[e[2], e[3], 0.085]}><boxGeometry args={[e[0], e[1], 0.05]} /><meshBasicMaterial color={GLOW} toneMapped={false} /></mesh>
      ))}
      {tex && <mesh position={[0, 0, 0.08]}><planeGeometry args={[f.w, f.h]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>}
      <mesh ref={bar} position={[0, 0, 0.09]}><planeGeometry args={[f.w, 0.03]} /><meshBasicMaterial color={[1.2, 0.6, 0.15]} transparent opacity={0.28} toneMapped={false} /></mesh>
      <T at={f.st} position={[0, -(f.h / 2 + 0.42), 0.09]} fontSize={0.13} color="#ffd9a8" letterSpacing={0.08} anchorX="center" anchorY="middle">{f.title}</T>
      <pointLight position={[0, 0.3, 2.4]} color="#ffa860" intensity={9} distance={7} />
    </group>
  );
}

function HackRings({ z0 }) {
  return (
    <group>
      {HACKATHONS.map((name, k) => {
        const z = z0 - 3 - k * 2.4;
        return (
          <group key={name} position={[0, 0, z]}>
            <mesh position={[0, 1.95, 0]}><torusGeometry args={[1.9, 0.025, 10, 80]} /><meshBasicMaterial color={k % 2 ? GLOW_SOFT : GLOW} toneMapped={false} /></mesh>
            <Float speed={1.2} floatIntensity={0.3} rotationIntensity={0}>
              <T at={7} position={[k % 2 ? 1.0 : -1.0, 1.7 + (k % 2 ? 0.45 : -0.25), 0]} fontSize={0.2} color="#fff0dc" letterSpacing={0.06} anchorX="center" anchorY="middle">{name}</T>
            </Float>
          </group>
        );
      })}
    </group>
  );
}

function SkillCloud({ z0 }) {
  return (
    <group>
      {SKILL_WORDS.map((w, k) => (
        <Float key={w} speed={1 + (k % 3) * 0.4} floatIntensity={0.5} rotationIntensity={0}>
          <T at={8} range={1.2} position={[-0.6 + ((k * 0.83) % 1) * 3.2, 0.7 + ((k * 0.57) % 1) * 3.3, z0 - 2.5 - ((k * 1.1) % 9)]} fontSize={k % 4 === 0 ? 0.36 : 0.26} color={k % 3 === 0 ? '#ffb45a' : k % 3 === 1 ? '#fff0dc' : '#ffd27a'} anchorX="center" anchorY="middle">{w}</T>
        </Float>
      ))}
    </group>
  );
}

function Portal({ z }) {
  const a = useRef(), b = useRef();
  useFrame(({ clock }) => { const t = clock.elapsedTime; if (a.current) a.current.rotation.z = t * 0.25; if (b.current) b.current.rotation.z = -t * 0.18; });
  return (
    <group position={[0, 2.6, z]}>
      <mesh ref={a}><torusGeometry args={[2.5, 0.05, 12, 100]} /><meshBasicMaterial color={GLOW} toneMapped={false} /></mesh>
      <mesh ref={b}><torusGeometry args={[2.9, 0.02, 8, 100]} /><meshBasicMaterial color={EMBER} toneMapped={false} /></mesh>
      <mesh position={[0, 0, -0.05]}><circleGeometry args={[2.45, 64]} /><meshBasicMaterial color={[0.9, 0.35, 0.06]} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
      <T at={9} range={1.2} position={[0, 0.4, 0.1]} fontSize={0.42} color="#fff0dc" letterSpacing={0.06} anchorX="center" anchorY="middle">{"LET'S BUILD"}</T>
      <T at={9} range={1.2} position={[0, -0.25, 0.1]} fontSize={0.42} color="#ffb45a" letterSpacing={0.06} anchorX="center" anchorY="middle">SOMETHING</T>
      <pointLight color="#ff9a40" intensity={14} distance={16} />
    </group>
  );
}

function Rig({ mobile }) {
  const { camera, pointer } = useThree();
  const light = useRef();
  useFrame((state, dt) => {
    store.cur += (store.target - store.cur) * (1 - Math.exp(-dt * 4.5));
    const cur = store.cur, r = Math.round(cur), d = cur - r;
    const near = 1 - THREE.MathUtils.smoothstep(Math.abs(d), 0, 0.3);
    const on = Math.abs(d) < 0.28 ? r : -1;
    if (on !== store.active) { store.active = on; store.onActive(on); }
    const t = state.clock.elapsedTime;
    const px = mobile ? 0 : pointer.x, py = mobile ? 0 : pointer.y;
    camera.position.set(px * 0.25, 1.7 + Math.sin(t * 0.9) * 0.03 + py * 0.08, -cur * S);
    const yaw = (SD[Math.max(0, Math.min(N - 1, r))] || 0) * (r === 0 ? 0.3 : 0.34) * near;
    camera.rotation.set(py * 0.03, -yaw - px * 0.04, 0);
    const fov = state.size.width / state.size.height < 1 ? 74 : 60;
    if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
    if (light.current) light.current.position.copy(camera.position);
  });
  return <pointLight ref={light} color="#ffaa66" intensity={14} distance={12} />;
}

export default function Scene({ ready, onCreated, mobile }) {
  const pdb = window.location.search.includes('pdb');   // debug only: keeps the frame buffer for screenshots
  return (
    <Canvas onCreated={onCreated} camera={{ fov: 60, near: 0.1, far: 170, position: [0, 1.7, 0] }} dpr={[1, mobile ? 1.25 : 1.6]} gl={{ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: pdb }}>
      <color attach="background" args={['#0a0503']} />
      <fog attach="fog" args={['#0a0503', 8, 66]} />
      <ambientLight color="#ffb070" intensity={0.3} />
      <hemisphereLight args={['#ffd0a0', '#1a0a04', 0.4]} />
      <Rig mobile={mobile} />
      <Corridor mobile={mobile} />
      <Tree z={-7} />
      {FRAMES.map((f) => <Frame key={f.slug} f={f} ready={ready} />)}
      <HackRings z0={-S * 7} />
      <SkillCloud z0={-S * 8} />
      <Portal z={-S * 9 - 8} />
      <Dust count={mobile ? 260 : 520} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={mobile ? 0.55 : 0.7} luminanceThreshold={0.85} luminanceSmoothing={0.25} mipmapBlur />
        <Vignette offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
