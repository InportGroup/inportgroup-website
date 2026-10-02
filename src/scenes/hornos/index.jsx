import { memo, useMemo } from 'react'
import { useCamera } from '../../components/film/Film.jsx'
import { useSvgId } from '../../lib/hooks.js'
import { createRng } from '../../lib/rng.js'
import { clamp, lerp } from '../../lib/svg.js'
import { fmtDec } from '../../lib/format.js'
import { Etiqueta, HALO, MONO, Nota, Rotulo, SERIF, hm, kOf, relojPorTramos, ventana } from '../kit.jsx'

// Valorización energética (GUIA.md, 9.5), primera versión. Del vídeo de la cámara de parrilla a los
// veinte valores que llegan al sistema de control. Función pura de t.

const W = 1600
const H = 900
const FIRE = ['#b03a0c', '#e45a12', '#fa8c42', '#fdbb7e', '#ffe3c4']

// Parrilla inclinada en la sección: de la tolva (izquierda) a la caída de escoria (derecha).
const G0 = { x: 300, y: 470 }
const G1 = { x: 1150, y: 640 }
const gy = (x) => G0.y + ((x - G0.x) * (G1.y - G0.y)) / (G1.x - G0.x)
const ZONAS = [300, 512.5, 725, 937.5, 1150]
const CAMARA = { x: 1232, y: 196 }

// Intensidad de fuego por zona (0..3, de la entrada a la escoria) y elemento (0..4, a lo ancho).
function intensidad(z, e, t) {
  const base = [36, 78, 72, 28][z]
  const v = base + 8 * Math.sin(e * 1.3 + z) + 8 * Math.sin(t * 0.9 + e * 0.7 + z * 1.9) + 4 * Math.sin(t * 2.3 + e * 2.1)
  return clamp(v, 0, 100)
}
const fireColor = (v) => FIRE[Math.min(4, Math.floor((v / 100) * 5))]

// Frente de llama por elemento, en unidades de zona (0 a 4 a lo largo de la parrilla)
const frente = (e, t) => clamp(2.35 + 0.32 * Math.sin(t * 0.6 + e * 0.9) + 0.12 * Math.sin(t * 1.7 + e * 2.3), 1.5, 3.6)

// Lectura de aire por zona: negativa es falta de aire. La zona 3 va corta.
const AIRE = [0.12, -0.04, -0.62, 0.22]

function bilinear(q, u, v) {
  // q: [TL, TR, BR, BL]; u a lo ancho (0..1), v a lo largo (0 arriba, 1 abajo)
  const top = [lerp(q[0][0], q[1][0], u), lerp(q[0][1], q[1][1], u)]
  const bot = [lerp(q[3][0], q[2][0], u), lerp(q[3][1], q[2][1], u)]
  return [lerp(top[0], bot[0], v), lerp(top[1], bot[1], v)]
}

const TRAPECIO = [
  [560, 250],
  [1040, 250],
  [1340, 840],
  [260, 840],
]
const RECTANGULO = [
  [350, 170],
  [1250, 170],
  [1250, 770],
  [350, 770],
]
const RECT_DCS = [
  [70, 200],
  [790, 200],
  [790, 680],
  [70, 680],
]
const mixQuad = (a, b, u) => a.map((p, i) => [lerp(p[0], b[i][0], u), lerp(p[1], b[i][1], u)])

/* ───────── Plano 1: la sección del horno ───────── */

const Estructura = memo(function Estructura() {
  return (
    <g fill="none" stroke="var(--screen-draw)" strokeWidth="1.4" strokeLinejoin="round">
      {/* Tolva y canal de alimentación */}
      <path d="M140 110 L340 110 L292 330 L292 420 M188 330 L140 110 M188 330 L188 420" />
      {/* Cámara de combustión y paso a la caldera */}
      <path d="M292 420 L292 450 M340 110 L360 132 L1010 72 L1250 72 L1250 640 M1150 640 L1150 820 M1250 640 L1250 820" />
      <path d="M1150 820 L1250 820" stroke="var(--screen-line)" />
      {/* Tolvas de aire primario bajo cada zona */}
      {ZONAS.slice(0, 4).map((x0, i) => {
        const x1 = ZONAS[i + 1]
        const xm = (x0 + x1) / 2
        return <path key={i} d={`M${x0 + 8} ${gy(x0 + 8) + 12} L${xm - 18} 790 L${xm + 18} 790 L${x1 - 8} ${gy(x1 - 8) + 12}`} stroke="var(--screen-line)" />
      })}
      <path d="M260 800 L1170 800" stroke="var(--screen-line)" />
      {/* Cámara en la pared del fondo */}
      <rect x={CAMARA.x - 22} y={CAMARA.y - 12} width="30" height="22" rx="2" fill="#11161b" />
      <path d={`M${CAMARA.x - 22} ${CAMARA.y} L${CAMARA.x - 34} ${CAMARA.y}`} />
    </g>
  )
})

function Parrilla({ t }) {
  // Barrotes escalonados; uno de cada dos va y viene a lo largo de la pendiente.
  const n = 26
  const dx = (G1.x - G0.x) / n
  let d = ''
  for (let i = 0; i < n; i++) {
    const shift = i % 2 ? Math.sin(t * 2.2 + i * 0.4) * 5 : 0
    const x0 = G0.x + i * dx + shift
    const x1 = x0 + dx * 0.96
    d += `M${x0.toFixed(1)} ${(gy(x0) + 9).toFixed(1)} L${x0.toFixed(1)} ${gy(x0).toFixed(1)} L${x1.toFixed(1)} ${(gy(x1) + 3).toFixed(1)} `
  }
  return <path d={d} fill="none" stroke="var(--screen-draw)" strokeWidth="1.4" strokeLinejoin="round" />
}

function Lecho({ t, piezas }) {
  return (
    <g strokeWidth="0.8" stroke="rgba(230,232,228,.35)">
      {piezas.map((p) => {
        const s = (p.s0 + t * 0.014) % 1
        const x = G0.x + 20 + s * (G1.x - G0.x - 40)
        const r = p.r * (s < 0.25 ? 1 : s > 0.78 ? 0.55 : lerp(1, 0.6, (s - 0.25) / 0.53))
        const y = gy(x) - r * 0.55
        const zona = Math.min(3, Math.floor(s * 4))
        const fill = s < 0.16 ? '#2c2a27' : s > 0.8 ? '#7d786f' : fireColor(intensidad(zona, p.e, t) * (0.8 + 0.2 * Math.sin(t * 5 + p.s0 * 40)))
        const pts = p.forma.map(([a, k]) => `${(x + Math.cos(a) * r * k).toFixed(1)},${(y + Math.sin(a) * r * k * 0.7).toFixed(1)}`).join(' ')
        return <polygon key={p.id} points={pts} fill={fill} />
      })}
    </g>
  )
}

function Llamas({ t, ids }) {
  const cols = 15
  const out = []
  for (let i = 0; i < cols; i++) {
    const u = (i + 0.5) / cols
    const x = 380 + u * 700
    const yb = gy(x) - 6
    const zona = Math.min(3, Math.floor(((x - G0.x) / (G1.x - G0.x)) * 4))
    const I = intensidad(zona, i % 5, t)
    const h = (60 + I * 2.1) * (0.82 + 0.18 * Math.sin(t * 3.1 + i * 1.7)) * (0.9 + 0.1 * Math.sin(t * 7.3 + i))
    const w = 70
    const sway = Math.sin(t * 2.4 + i * 0.8) * w * 0.32
    out.push(
      <path
        key={i}
        d={`M${x - w / 2} ${yb} C${x - w / 2} ${yb - h * 0.45} ${x - w * 0.12 + sway * 0.5} ${yb - h * 0.8} ${x + sway} ${yb - h} C${x + w * 0.15 + sway * 0.5} ${yb - h * 0.78} ${x + w / 2} ${yb - h * 0.42} ${x + w / 2} ${yb} Z`}
        fill={`url(#${ids.flame})`}
        opacity={0.35 + I / 180}
      />,
    )
  }
  return <g filter={`url(#${ids.soft})`}>{out}</g>
}

function Aire({ t }) {
  const out = []
  ZONAS.slice(0, 4).forEach((x0, z) => {
    const x1 = ZONAS[z + 1]
    for (let j = 0; j < 3; j++) {
      const x = lerp(x0, x1, 0.25 + j * 0.25)
      const y0 = 770
      const y1 = gy(x) + 14
      out.push(
        <path
          key={`${z}:${j}`}
          d={`M${x} ${y0} L${x} ${y1} M${x - 5} ${y1 + 9} L${x} ${y1} L${x + 5} ${y1 + 9}`}
          fill="none"
          stroke="var(--cold-4)"
          strokeWidth="1.3"
          strokeDasharray="7 9"
          strokeDashoffset={-(t * 26 + j * 5) % 16}
          opacity="0.75"
        />,
      )
    }
  })
  return <g>{out}</g>
}

/* ───────── Planos 2 a 4: la imagen de la cámara y la malla ───────── */

function ImagenCamara({ q, t, ids, sucio }) {
  // Manchas de fuego repartidas por la parrilla en perspectiva; más grandes cerca de la cámara.
  const blobs = []
  for (let z = 0; z < 4; z++) {
    for (let e = 0; e < 5; e++) {
      for (let k = 0; k < 2; k++) {
        const u = (e + 0.3 + k * 0.4) / 5
        const v = (z + 0.35 + ((k + z) % 2) * 0.3) / 4
        const [x, y] = bilinear(q, u, v)
        const I = intensidad(z, e, t) * (0.85 + 0.15 * Math.sin(t * 6 + z * 3 + e * 5 + k))
        const r = lerp(46, 92, v) * (0.75 + I / 260)
        blobs.push(<circle key={`${z}${e}${k}`} cx={x} cy={y} r={r} fill={fireColor(I)} opacity={0.25 + I / 140} />)
      }
    }
  }
  const poly = q.map((p) => p.join(',')).join(' ')
  return (
    <g>
      <clipPath id={ids.clip}>
        <polygon points={poly} />
      </clipPath>
      <g clipPath={`url(#${ids.clip})`}>
        <polygon points={poly} fill="#1d1410" />
        <g filter={`url(#${ids.blobs})`}>{blobs}</g>
        {sucio > 0 && (
          <g opacity={sucio}>
            <polygon points={poly} fill="#1e140a" opacity="0.66" />
            <polygon points={poly} fill={`url(#${ids.dirt})`} />
          </g>
        )}
      </g>
      <polygon points={poly} fill="none" stroke="var(--screen-draw)" strokeWidth="1.2" />
    </g>
  )
}

function Malla({ q, draw, fill, t, k, sucio }) {
  const lines = []
  for (let e = 1; e < 5; e++) {
    const a = bilinear(q, e / 5, 0)
    const b = bilinear(q, e / 5, 1)
    lines.push(`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`)
  }
  for (let z = 1; z < 4; z++) {
    const a = bilinear(q, 0, z / 4)
    const b = bilinear(q, 1, z / 4)
    lines.push(`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`)
  }
  const cells = []
  if (fill > 0) {
    for (let z = 0; z < 4; z++) {
      for (let e = 0; e < 5; e++) {
        const c = [bilinear(q, e / 5, z / 4), bilinear(q, (e + 1) / 5, z / 4), bilinear(q, (e + 1) / 5, (z + 1) / 4), bilinear(q, e / 5, (z + 1) / 4)]
        const [cx, cy] = bilinear(q, (e + 0.5) / 5, (z + 0.5) / 4)
        const I = intensidad(z, e, t)
        const destacada = z === 2 && e === 3
        cells.push(
          <g key={`${z}${e}`}>
            <polygon points={c.map((p) => p.join(',')).join(' ')} fill={fireColor(I)} opacity={fill * 0.42 * (1 - 0.75 * sucio)} />
            <text
              x={cx}
              y={cy + 12 * k}
              textAnchor="middle"
              fontFamily={SERIF}
              fontWeight="300"
              fontSize={34 * k}
              fill="var(--screen-text)"
              opacity={fill}
              className="num"
              {...HALO}
            >
              {Math.round(I)}
            </text>
            {destacada && fill > 0.6 && <polygon points={c.map((p) => p.join(',')).join(' ')} fill="none" stroke="var(--screen-text)" strokeWidth="2" />}
          </g>,
        )
      }
    }
  }
  const outline = q.map((p) => p.join(',')).join(' ')
  return (
    <g>
      {cells}
      <path d={lines.join(' ')} fill="none" stroke="var(--screen-text)" strokeWidth="1.3" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} opacity="0.85" />
      <polygon points={outline} fill="none" stroke="var(--screen-text)" strokeWidth="1.6" opacity={draw} />
    </g>
  )
}

function Frente({ q, t, opacity }) {
  if (opacity <= 0) return null
  const pts = []
  for (let e = 0; e <= 5; e++) {
    const ee = Math.min(4, e)
    const [x, y] = bilinear(q, e / 5, frente(ee, t) / 4)
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return <polyline points={pts.join(' ')} fill="none" stroke="var(--screen-text)" strokeWidth="2.4" strokeDasharray="10 6" opacity={opacity} />
}

function PanelAire({ x, y, k, opacity }) {
  if (opacity <= 0) return null
  return (
    <g opacity={opacity} transform={`translate(${x} ${y})`}>
      <Rotulo x={0} y={0} k={k}>
        AIRE POR ZONA
      </Rotulo>
      {AIRE.map((a, z) => {
        const yy = 40 * k + z * 46 * k
        const falta = a < -0.3
        return (
          <g key={z}>
            <text x={0} y={yy + 5} fontFamily={MONO} fontSize={13 * k} fill="var(--screen-dim)" {...HALO}>
              Zona {z + 1}
            </text>
            <path d={`M${78 * k} ${yy} H${188 * k}`} stroke="var(--screen-line)" />
            <path d={`M${133 * k} ${yy - 8} V${yy + 8}`} stroke="var(--screen-dim)" />
            <path d={`M${133 * k} ${yy} H${133 * k + a * 80 * k}`} stroke={falta ? 'var(--data-warn)' : 'var(--screen-text)'} strokeWidth="6" />
            {falta && (
              <text x={198 * k} y={yy + 5} fontFamily={MONO} fontSize={13 * k} fill="var(--screen-text)" {...HALO}>
                falta aire
              </text>
            )}
          </g>
        )
      })}
    </g>
  )
}

function Consola({ t, k, opacity, sucio, narrow }) {
  if (opacity <= 0) return null
  const media = (z) => Math.round([0, 1, 2, 3, 4].reduce((s, e) => s + intensidad(z, e, t), 0) / 5)
  const pulso = Math.floor(t / 2) % 2 === 0
  const crudo = (z) => Math.round(media(z) * (1 - 0.42 * sucio))
  const filas = [
    ['H2 Z1 Intensidad', media(0), crudo(0)],
    ['H2 Z2 Intensidad', media(1), crudo(1)],
    ['H2 Z3 Intensidad', media(2), crudo(2)],
    ['H2 Z4 Intensidad', media(3), crudo(3)],
    ['H2 Frente Z3', fmtDec(frente(2, t) / 4, 2)],
    ['H2 Aire Z3', 'falta'],
    ['H2 Ensuciamiento', sucio > 0.35 ? '1' : '0'],
    ['H2 DatoValido', '1'],
  ]
  const s = narrow ? 1.25 : 1
  const x0 = 980
  const y0 = 170
  return (
    <g opacity={opacity}>
      <rect x={x0} y={y0} width={560} height={560} fill="#0f1215" fillOpacity="0.9" stroke="var(--screen-line)" />
      <text x={x0 + 26} y={y0 + 40} fontFamily={MONO} fontSize={13 * s} letterSpacing="1.5" fill="var(--screen-dim)">
        DCS · HORNO 2 · OPC UA
      </text>
      <circle cx={x0 + 520} cy={y0 + 35} r="6" fill={pulso ? 'var(--data-ok)' : 'transparent'} stroke="var(--data-ok)" />
      <text x={x0 + 506} y={y0 + 40} textAnchor="end" fontFamily={MONO} fontSize={12 * s} fill="var(--screen-dim)">
        pulso
      </text>
      {sucio > 0.2 && (
        <text x={x0 + 440} y={y0 + 70} textAnchor="end" fontFamily={MONO} fontSize={11 * s} fill="var(--screen-dim)" opacity={Math.min(1, sucio * 2)}>
          sin corregir
        </text>
      )}
      {filas.map(([nombre, valor, sinCorregir], i) => {
        const y = y0 + 92 + i * 56
        const destaca = (nombre.includes('Ensuciamiento') && sucio > 0.35) || nombre.includes('Aire')
        return (
          <g key={nombre}>
            <path d={`M${x0 + 26} ${y + 16} H${x0 + 534}`} stroke="var(--screen-line)" />
            <text x={x0 + 26} y={y} fontFamily={MONO} fontSize={16 * s} fill="var(--screen-dim)">
              {nombre}
            </text>
            {sinCorregir != null && sucio > 0.2 && (
              <text x={x0 + 440} y={y} textAnchor="end" fontFamily={MONO} fontSize={15 * s} fill="var(--screen-dim)" opacity={Math.min(1, sucio * 2)} textDecoration="line-through" className="num">
                {sinCorregir}
              </text>
            )}
            <text x={x0 + 534} y={y} textAnchor="end" fontFamily={MONO} fontSize={18 * s} fill={destaca ? 'var(--data-warn)' : 'var(--screen-text)'} className="num">
              {valor}
            </text>
          </g>
        )
      })}
    </g>
  )
}

// Paquetes de datos que salen de la malla hacia el DCS cada dos segundos
function Flujo({ t }) {
  const y = 440
  const x0 = RECT_DCS[1][0] + 12
  const x1 = 968
  const u = (t % 2) / 2
  return (
    <g>
      <path d={`M${x0} ${y} H${x1}`} stroke="var(--screen-line)" strokeDasharray="3 6" />
      {[0, 0.12, 0.24].map((d) => {
        const v = u - d
        if (v < 0 || v > 1) return null
        return <circle key={d} cx={lerp(x0, x1, v)} cy={y} r="4" fill="var(--industria-s)" />
      })}
    </g>
  )
}

const frameReloj = relojPorTramos([
  [0, hm(11, 40)],
  [7.5, hm(11, 41)],
  [15, hm(11, 42)],
  [22, hm(11, 43)],
  [30, hm(11, 43, 50)],
])

function Scene({ film, narrow }) {
  const ids = {
    flame: useSvgId('llama'),
    soft: useSvgId('suave'),
    blobs: useSvgId('fuego'),
    clip: useSvgId('mirilla'),
    dirt: useSvgId('hollin'),
    dirtTurb: useSvgId('turb'),
    cone: useSvgId('cono'),
  }
  const k = kOf(narrow)
  const { t, ease } = film
  const piezas = useMemo(() => {
    const rng = createRng('lecho')
    return Array.from({ length: 70 }, (_, i) => ({
      id: i,
      s0: i / 70 + rng.range(0, 0.012),
      r: rng.range(9, 17),
      e: rng.int(0, 4),
      forma: Array.from({ length: 6 }, (_, j) => [(j / 6) * Math.PI * 2 + rng.range(-0.3, 0.3), rng.range(0.7, 1.15)]),
    }))
  }, [])

  // Plano 1 (0 a 8,8): la sección. Corte en negro a 8,8 y plano de la cámara.
  const seccion = t < 8.9
  const negro = ventana(t, 8.4, 8.9, 0.35)
  const viewBox = useCamera(
    t,
    narrow
      ? [
          { at: 0, box: [150, 70, 1100, 825] },
          { at: 7.4, box: [150, 70, 1100, 825] },
          { at: 8.85, box: [1150, 150, 140, 105] },
          { at: 8.86, box: [240, 150, 1120, 840] },
          { at: 21.6, box: [240, 150, 1120, 840] },
          { at: 23.4, box: [960, 150, 600, 450] },
          { at: 30, box: [960, 150, 600, 450] },
        ]
      : [
          { at: 0, box: [0, 0, W, H] },
          { at: 7.4, box: [0, 0, W, H] },
          { at: 8.85, box: [1140, 140, 180, 101] },
          { at: 8.86, box: [0, 0, W, H] },
          { at: 30, box: [0, 0, W, H] },
        ],
  )

  // Plano 2 y 3: la malla se dibuja sobre la perspectiva y la imagen se endereza.
  const dibuja = ease(9.6, 11.6)
  const endereza = ease(11.8, 14)
  const rellena = ease(13.4, 15)
  const aDcs = ease(22, 23.6)
  const sucio = ease(23.4, 27.5)
  const q = aDcs > 0 ? mixQuad(RECTANGULO, RECT_DCS, aDcs) : mixQuad(TRAPECIO, RECTANGULO, endereza)
  const frenteOp = ventana(t, 15.4, 21.6, 0.8)
  const aireOp = ventana(t, 16.4, 21.6, 0.8)
  const notaP = ventana(t, 17.6, 21.6, 0.6)

  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={ids.flame} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e45a12" stopOpacity="0.9" />
          <stop offset="0.55" stopColor="#fa8c42" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffe3c4" stopOpacity="0" />
        </linearGradient>
        <filter id={ids.soft} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={ids.blobs} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id={ids.dirtTurb} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="7" />
          <feColorMatrix values="0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0 0.04  0 0 0 2.4 -0.9" />
        </filter>
        <pattern id={ids.dirt} patternUnits="userSpaceOnUse" width={W} height={H}>
          <rect width={W} height={H} filter={`url(#${ids.dirtTurb})`} />
        </pattern>
        <linearGradient id={ids.cone} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6e4de" stopOpacity="0.14" />
          <stop offset="1" stopColor="#e6e4de" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill="#0f1215" />

      {seccion && (
        <g>
          <path d={`M${CAMARA.x - 30} ${CAMARA.y} L420 ${gy(420) - 20} L1110 ${gy(1110) - 10} Z`} fill={`url(#${ids.cone})`} />
          <Aire t={t} />
          <Llamas t={t} ids={ids} />
          <Estructura />
          <Lecho t={t} piezas={piezas} />
          <Parrilla t={t} />
          {/* Empujador: avanza y retrocede bajo la tolva */}
          <rect x={150 + Math.max(0, Math.sin(t * 0.9)) * 40} y={430} width={142} height={30} fill="#11161b" stroke="var(--screen-draw)" strokeWidth="1.4" />
          <Etiqueta x={240} y={150} lx={420} ly={150} texto="Tolva de residuo" k={k} opacity={ventana(t, 1, 7.6)} />
          <Etiqueta x={640} y={gy(640) + 4} lx={660} ly={gy(640) + 120} texto="Parrilla en cuatro zonas" k={k} opacity={ventana(t, 2, 7.6)} />
          <Etiqueta
            x={405}
            y={700}
            lx={narrow ? 560 : 250}
            ly={narrow ? 830 : 700}
            texto="Aire primario"
            k={k}
            anchor={narrow ? 'start' : 'end'}
            opacity={ventana(t, 3, 7.6)}
          />
          <Etiqueta x={CAMARA.x - 22} y={CAMARA.y} lx={1080} ly={118} texto="Cámara de parrilla" k={k} anchor="end" opacity={ventana(t, 4, 7.6)} />
        </g>
      )}

      {!seccion && (
        <g>
          <ImagenCamara q={q} t={t} ids={ids} sucio={sucio} />
          <Malla q={q} draw={dibuja} fill={rellena} t={t} k={aDcs > 0 ? lerp(1, 0.8, aDcs) * k : k} sucio={sucio} />
          <Frente q={q} t={t} opacity={frenteOp} />
          {frenteOp > 0 && (
            <Rotulo x={RECTANGULO[0][0] - 14} y={bilinear(RECTANGULO, 0, frente(0, t) / 4)[1] + 5} k={k} anchor="end" dim={false} opacity={frenteOp}>
              frente de llama
            </Rotulo>
          )}
          {endereza < 0.4 && (
            <g opacity={ventana(t, 9, 11.6) * 0.9}>
              <Rotulo x={250} y={200} k={k} size={13}>
                CAM 02 · HORNO 2
              </Rotulo>
              <Rotulo x={1350} y={200} k={k} size={13} anchor="end">
                {frameReloj(t)}
              </Rotulo>
            </g>
          )}
          {aDcs > 0.9 && <Flujo t={t} />}
          {sucio > 0.3 && (
            <Rotulo x={RECT_DCS[0][0]} y={RECT_DCS[0][1] - 18} k={k} opacity={Math.min(1, (sucio - 0.3) * 3)}>
              LENTE SUCIA · VALORES CORREGIDOS
            </Rotulo>
          )}
          {!narrow && <PanelAire x={1282} y={210} k={k} opacity={aireOp} />}
          {!narrow && (
            <Nota x={1270} y={470} w={300} kicker="ZONA 3 · ELEMENTO 4" valor={Math.round(intensidad(2, 3, t))} unidad="de 100" linea="intensidad de fuego" color="var(--industria-s)" progress={notaP} />
          )}
          <Consola t={t} k={k} opacity={ease(22.6, 24)} sucio={sucio} narrow={narrow} />
        </g>
      )}

      {negro > 0 && <rect x="-200" y="-200" width={W + 400} height={H + 400} fill="#0f1215" opacity={negro} />}
    </svg>
  )
}

export default {
  id: 'hornos',
  label:
    'Sección de un horno de parrilla con su cámara. La imagen de la cámara se endereza en una malla de cinco por cuatro celdas con su intensidad de fuego, y los valores llegan al sistema de control aunque la lente se ensucie.',
  duration: 30,
  poster: 19,
  aspect: '16 / 9',
  aspectNarrow: '4 / 3',
  frame: {
    lugar: 'Horno 2 · Planta de valorización',
    origen: 'Cámara de parrilla',
    reloj: frameReloj,
  },
  scenes: [
    { at: 0, title: 'La parrilla, de lado', caption: '11:40 · El residuo entra por la tolva y avanza por la parrilla mientras arde.' },
    { at: 8.4, title: 'Lo que ve la cámara', caption: '11:41 · La cámara del fondo ve la parrilla en perspectiva. Encima se dibuja la malla.' },
    { at: 15, title: 'La malla de 5 × 4', caption: '11:42 · Veinte celdas con su intensidad, el frente de llama y el aire de cada zona.' },
    { at: 22, title: 'Al sistema de control', caption: '11:43 · La lente se ensucia. El sistema corrige el valor y avisa al DCS.' },
  ],
  Scene,
}
