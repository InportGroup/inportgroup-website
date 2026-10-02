import { memo, useMemo } from 'react'
import { useCamera } from '../../components/film/Film.jsx'
import { Segmented } from '../../components/Controls.jsx'
import { useSvgId } from '../../lib/hooks.js'
import { createRng, noise1 } from '../../lib/rng.js'
import { lerp } from '../../lib/svg.js'
import { fmtDec } from '../../lib/format.js'

// Cultivos leñosos (GUIA.md, 9.1), primera versión. Nació como escena de prueba del motor en la fase 0.
// Una finca de pistacheros de noche, una cámara térmica que barre el sector y el acercamiento al árbol
// más frío. Todo es función pura de t: se puede arrastrar hacia atrás.

const W = 1600
const H = 900
const CAM = { x: 1390, y: 430 }
const SWEEP = { a0: 104, a1: 188, from: 6.5, to: 11.5 }
const HORIZON = 486
const ROWS = [
  { y: 512, s: 0.34 },
  { y: 556, s: 0.48 },
  { y: 626, s: 0.66 },
  { y: 726, s: 0.88 },
  { y: 868, s: 1.16 },
]

// Temperatura de yema según el sitio: el frío se remansa en la vaguada, abajo a la izquierda.
function budTemp(x, row) {
  const dip = Math.exp(-(((x - 520) / 430) ** 2)) * (0.42 + 0.58 * (row / (ROWS.length - 1)))
  return 0.6 - 3.4 * dip
}

function buildTrees(detail) {
  const trees = []
  ROWS.forEach((r, row) => {
    const gap = 168 * r.s * (detail === 'bajo' ? 1.5 : 1)
    const offset = (row % 2) * gap * 0.5 - 80
    for (let x = offset; x < W + 120; x += gap) {
      const jitter = (noise1(x * 0.13 + row * 7.1) - 0.5) * gap * 0.25
      const tx = x + jitter
      trees.push({ id: `${row}:${Math.round(x)}`, x: tx, y: r.y, s: r.s, row, temp: budTemp(tx, row) })
    }
  })
  // El árbol más frío marca exactamente lo que dice el subtítulo.
  trees.reduce((a, b) => (b.temp < a.temp ? b : a)).temp = -2.8
  return trees
}

// Copa irregular: ocho puntos con ruido determinista unidos con curvas suaves.
function canopyPath(cx, cy, rx, ry, seed) {
  const pts = []
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2
    const k = 0.84 + noise1(seed + i * 3.7) * 0.3
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k])
  }
  let d = `M${((pts[0][0] + pts[8][0]) / 2).toFixed(1)} ${((pts[0][1] + pts[8][1]) / 2).toFixed(1)}`
  for (let i = 0; i < 9; i++) {
    const p = pts[i]
    const n = pts[(i + 1) % 9]
    d += ` Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${((p[0] + n[0]) / 2).toFixed(1)} ${((p[1] + n[1]) / 2).toFixed(1)}`
  }
  return `${d} Z`
}

// Escala de frío validada: cuanto más clara, más fría (GUIA.md, sección 4).
const COLD = ['#184f95', '#256abf', '#3987e5', '#6da7ec', '#9ec5f4', '#cde2fb']
function coldColor(temp) {
  const u = Math.min(1, Math.max(0, (1 - temp) / 4))
  return COLD[Math.round(u * (COLD.length - 1))]
}

const fmtTemp = (v) => (v < 0 ? `${fmtDec(v, 1)} bajo cero` : `${fmtDec(v, 1)} grados`)

const Sky = memo(function Sky({ ids }) {
  const stars = useMemo(() => {
    const rng = createRng('estrellas')
    return Array.from({ length: 70 }, () => ({ x: rng.range(0, W), y: rng.range(0, 520), r: rng.range(0.6, 1.6), o: rng.range(0.25, 0.8) }))
  }, [])
  return (
    <g>
      <rect width={W} height={H} fill={`url(#${ids.sky})`} />
      {stars.map((st, i) => (
        <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#e6e4de" opacity={st.o} />
      ))}
      <circle cx="1240" cy="168" r="120" fill={`url(#${ids.moon})`} />
      <circle cx="1240" cy="168" r="26" fill="#efe9da" opacity="0.92" />
      <path d={`M0 ${HORIZON + 6} Q 380 ${HORIZON - 14} 760 ${HORIZON - 2} T 1600 ${HORIZON - 10}`} fill="none" stroke="var(--screen-draw)" strokeWidth="1.2" />
      <path d={`M0 ${HORIZON + 6} Q 380 ${HORIZON - 14} 760 ${HORIZON - 2} T 1600 ${HORIZON - 10} L1600 900 L0 900 Z`} fill="#11161b" />
    </g>
  )
})

const Orchard = memo(function Orchard({ trees, reveal }) {
  return (
    <g fill="none" stroke="var(--screen-draw)" strokeLinecap="round" strokeLinejoin="round">
      {ROWS.map((r) => (
        <path key={r.y} d={`M-40 ${r.y + 2} L${W + 40} ${r.y - 4}`} stroke="var(--screen-line)" strokeWidth="1" />
      ))}
      {trees.map((tr) => {
        const { x, y, s } = tr
        const sw = Math.max(0.8, 1.4 * s)
        const draw = Math.min(1, Math.max(0, reveal * 1.6 - (1 - tr.row / ROWS.length) * 0.6))
        return (
          <g key={tr.id} strokeWidth={sw} strokeDasharray="1" strokeDashoffset={1 - draw}>
            <path pathLength="1" d={`M${x} ${y} L${x} ${y - 36 * s} M${x} ${y - 36 * s} L${x - 26 * s} ${y - 78 * s} M${x} ${y - 36 * s} L${x + 24 * s} ${y - 80 * s}`} />
            <path pathLength="1" d={canopyPath(x, y - 100 * s, 64 * s, 40 * s, x * 0.07 + tr.row)} />
          </g>
        )
      })}
    </g>
  )
})

const Thermal = memo(function Thermal({ trees, ids }) {
  return (
    <g filter={`url(#${ids.blur})`}>
      {trees.map((tr) => (
        <ellipse
          key={tr.id}
          cx={tr.x}
          cy={tr.y - 100 * tr.s}
          rx={70 * tr.s}
          ry={46 * tr.s}
          fill={coldColor(tr.temp)}
          opacity={Math.min(0.95, Math.max(0.12, (0.7 - tr.temp) / 2.6))}
        />
      ))}
    </g>
  )
})

function wedge(a0, a1, r) {
  const rad = (a) => (a * Math.PI) / 180
  const p = (a) => `${(CAM.x + Math.cos(rad(a)) * r).toFixed(1)} ${(CAM.y + Math.sin(rad(a)) * r).toFixed(1)}`
  const large = a1 - a0 > 180 ? 1 : 0
  return `M${CAM.x} ${CAM.y} L${p(a0)} A${r} ${r} 0 ${large} 1 ${p(a1)} Z`
}

function Scene({ film, state, detail, narrow }) {
  const ids = {
    sky: useSvgId('cielo'),
    moon: useSvgId('luna'),
    blur: useSvgId('termico'),
    mask: useSvgId('barrido'),
    beam: useSvgId('haz'),
  }
  const trees = useMemo(() => buildTrees(detail), [detail])
  const coldest = useMemo(() => trees.reduce((a, b) => (b.temp < a.temp ? b : a)), [trees])
  const marked = useMemo(() => {
    const pick = (target) => trees.filter((tr) => tr.row >= 2).reduce((a, b) => (Math.abs(b.temp - target) < Math.abs(a.temp - target) ? b : a))
    return [pick(-1.1), pick(-1.9), coldest]
  }, [trees, coldest])

  const { t, ease, between } = film
  const full = detail === 'alto'
  // En pantalla estrecha los textos del SVG crecen para no bajar de unos 11 px reales.
  const k = narrow ? 1.7 : 1
  const reveal = Math.round(ease(0.2, 5) * 100) / 100
  const sweep = ease(SWEEP.from, SWEEP.to)
  const angle = lerp(SWEEP.a0, SWEEP.a1, sweep)
  const showThermal = state.vista !== 'garita'
  // Acercamiento: el árbol más frío a un tercio por la izquierda, sin salirse del suelo.
  // En pantalla estrecha el encuadre es propio: menos cielo y el campo más cerca.
  const BASE = narrow ? [260, 250, 1120, 650] : [0, 0, W, H]
  const ZW = narrow ? 720 : 900
  const ZH = narrow ? 540 : 506
  const zoomX = Math.min(W - ZW, Math.max(0, coldest.x - ZW * 0.3))
  const zoomY = Math.min(H - ZH, Math.max(0, coldest.y - 100 * coldest.s - ZH * 0.5))
  const viewBox = useCamera(t, [
    { at: 0, box: BASE },
    { at: 12.2, box: BASE },
    { at: 15.5, box: [zoomX, zoomY, ZW, ZH] },
    { at: 18, box: [zoomX, zoomY, ZW, ZH] },
  ])
  const garita = lerp(0.9, 0.4, between(2, 12))
  const alert = ease(12.6, 14)
  const cold = { x: coldest.x, y: coldest.y - 100 * coldest.s }

  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={ids.sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#090c14" />
          <stop offset="0.66" stopColor="#151b28" />
          <stop offset="1" stopColor="#1b2230" />
        </linearGradient>
        <radialGradient id={ids.moon}>
          <stop offset="0" stopColor="#efe9da" stopOpacity="0.32" />
          <stop offset="1" stopColor="#efe9da" stopOpacity="0" />
        </radialGradient>
        <filter id={ids.blur} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <linearGradient id={ids.beam} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#9ec5f4" stopOpacity="0.32" />
          <stop offset="1" stopColor="#9ec5f4" stopOpacity="0" />
        </linearGradient>
        <mask id={ids.mask} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect width={W} height={H} fill="black" />
          {sweep > 0 && <path d={wedge(SWEEP.a0, Math.max(SWEEP.a0 + 0.5, angle), 1700)} fill="white" />}
        </mask>
      </defs>

      <Sky ids={ids} />

      {showThermal && (
        <g mask={`url(#${ids.mask})`} opacity={1 - 0.6 * alert}>
          <Thermal trees={trees} ids={ids} />
        </g>
      )}
      {showThermal && alert > 0 && (
        <ellipse cx={cold.x} cy={cold.y} rx={70 * coldest.s} ry={46 * coldest.s} fill={coldColor(-2.8)} opacity={alert} filter={`url(#${ids.blur})`} />
      )}

      <Orchard trees={trees} reveal={reveal} />

      {/* Garita: la estación meteorológica de la finca, a metro y medio del suelo, en primer término */}
      <g stroke="var(--screen-draw)" fill="none" strokeWidth="1.4">
        <path d="M150 900 L150 742" />
        <rect x="120" y="704" width="60" height="40" fill="#11161b" />
        <path d="M126 716 H174 M126 728 H174" stroke="var(--screen-line)" />
      </g>
      {full && (
        <g opacity={1 - alert} fontFamily="var(--font-mono)" fontSize={16 * k} fill="var(--screen-text)" paintOrder="stroke" stroke="#0f1215" strokeWidth="5" strokeLinejoin="round">
          <text x="194" y="716" fill="var(--screen-dim)" letterSpacing="1">GARITA</text>
          <text x="194" y={716 + 22 * k} className="num">{fmtTemp(garita)}</text>
        </g>
      )}

      {/* Cámara térmica en su poste, con el haz que barre el sector */}
      <g stroke="var(--screen-draw)" fill="none" strokeWidth="1.2">
        <path d={`M${CAM.x} ${CAM.y + 6} L${CAM.x} 640`} />
        <rect x={CAM.x - 14} y={CAM.y - 9} width="28" height="16" rx="2" />
      </g>
      {sweep > 0 && sweep < 1 && showThermal && (
        <path d={wedge(angle - 4, angle + 4, 1500)} fill={`url(#${ids.beam})`} />
      )}

      {/* Etiquetas en las yemas que el barrido ya ha visto */}
      {full && showThermal &&
        marked.map((tr, i) => {
          const a = (Math.atan2(tr.y - 100 * tr.s - CAM.y, tr.x - CAM.x) * 180) / Math.PI
          const deg = a < 0 ? a + 360 : a
          const seen = deg <= angle + 2 && sweep > 0
          const o = seen ? Math.min(1, between(SWEEP.from, SWEEP.to) * 4) : 0
          if (!o) return null
          const cx = tr.x
          const cy = tr.y - 100 * tr.s
          const lx = cx + 40 + i * 6
          const ly = cy - 70 - i * 18
          return (
            <g key={tr.id} opacity={o * (1 - alert)}>
              <circle cx={cx} cy={cy} r="5" fill="none" stroke="var(--screen-text)" strokeWidth="1.2" />
              <path d={`M${cx + 4} ${cy - 4} L${lx} ${ly + 6} H${lx + 120 * k}`} fill="none" stroke="var(--screen-dim)" strokeWidth="1" />
              <text x={lx + 2} y={ly} fontFamily="var(--font-mono)" fontSize={15 * k} fill="var(--screen-text)" paintOrder="stroke" stroke="#0f1215" strokeWidth="5" strokeLinejoin="round">
                {fmtTemp(tr.temp)}
              </text>
            </g>
          )
        })}

      {/* El aviso: una nota junto al árbol más frío, con la garita al lado para comparar */}
      {full && alert > 0 && showThermal && (
        <g opacity={alert}>
          <circle cx={cold.x} cy={cold.y} r="7" fill="none" stroke="var(--screen-text)" strokeWidth="1.4" />
          <path d={`M${cold.x + 7} ${cold.y - 4} L${cold.x + 96} ${cold.y - 52}`} fill="none" stroke="var(--screen-dim)" strokeWidth="1" />
          <g transform={`translate(${cold.x + 96} ${cold.y - 176})`}>
            <rect width="360" height="190" fill="#0f1215" fillOpacity="0.84" stroke="var(--screen-line)" />
            <text x="22" y="34" fontFamily="var(--font-mono)" fontSize="13" letterSpacing="1.5" fill="var(--screen-dim)">
              YEMA · SECTOR 4 · 04:10
            </text>
            <text x="18" y="112" fontFamily="var(--font-display)" fontWeight="300" fontSize="84" fill="var(--screen-text)" className="num">
              {fmtDec(coldest.temp, 1)}
            </text>
            <text x="150" y="110" fontFamily="var(--font-display)" fontStyle="italic" fontWeight="300" fontSize="28" fill="var(--screen-text)">
              bajo cero
            </text>
            <path d={`M22 128 H${22 + lerp(0, 316, alert)}`} stroke="var(--campo-s)" strokeWidth="3" />
            <text x="22" y="164" fontFamily="var(--font-mono)" fontSize="14" fill="var(--screen-dim)">
              La garita marca {fmtTemp(garita)}
            </text>
          </g>
        </g>
      )}
    </svg>
  )
}

function Controls({ state, setState }) {
  return (
    <Segmented
      label="Qué temperatura se ve"
      value={state.vista}
      onChange={(v) => setState((st) => ({ ...st, vista: v }))}
      options={[
        { value: 'yema', label: 'Yema' },
        { value: 'garita', label: 'Solo garita' },
      ]}
    />
  )
}

// Hora simulada por tramos, para que el cajetín diga lo mismo que los subtítulos.
const HORAS = [
  [0, 2 * 3600 + 40 * 60],
  [6, 3 * 3600 + 55 * 60],
  [12.4, 4 * 3600 + 10 * 60],
  [18, 4 * 3600 + 12 * 60],
]
function reloj(t) {
  let sec = HORAS[HORAS.length - 1][1]
  for (let i = 0; i < HORAS.length - 1; i++) {
    const [t0, s0] = HORAS[i]
    const [t1, s1] = HORAS[i + 1]
    if (t <= t1) {
      sec = lerp(s0, s1, Math.max(0, (t - t0) / (t1 - t0)))
      break
    }
  }
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}

export default {
  id: 'cultivo',
  label: 'Una finca de pistacheros de noche. Una cámara térmica barre el sector bajo y encuentra yemas por debajo de cero mientras la garita marca 0,4 grados.',
  duration: 18,
  poster: 15,
  aspect: '16 / 9',
  aspectNarrow: '4 / 3',
  frame: { lugar: 'Finca de pistacheros · Sector 4', origen: 'Cámara térmica 2', reloj },
  initialState: { vista: 'yema' },
  scenes: [
    { at: 0, title: 'La finca, de noche', caption: '02:40 · Cielo despejado, sin viento. La garita marca 0,9 grados.' },
    { at: 6, title: 'La cámara barre el sector', caption: '03:55 · El frío baja y se queda en la parte baja de la finca.' },
    { at: 12.4, title: 'Aviso', caption: '04:10 · La yema está a 2,8 bajo cero. La garita sigue en 0,4.' },
  ],
  Scene,
  Controls,
}
