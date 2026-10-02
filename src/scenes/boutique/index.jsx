import { memo, useMemo } from 'react'
import { useCamera } from '../../components/film/Film.jsx'
import { useSvgId } from '../../lib/hooks.js'
import { createRng } from '../../lib/rng.js'
import { clamp, lerp } from '../../lib/svg.js'
import { fmtDuration } from '../../lib/format.js'
import { HALO, MONO, Nota, Rotulo, SERIF, kOf, ventana } from '../kit.jsx'

// Tiendas de lujo (GUIA.md, 9.7), primera versión, a partir de InLux. Plano cenital de una boutique con
// su fachada y la acera: las visitas de la mañana, el grupo del crucero de la tarde, el calor de la semana
// y el escaparate medido. Función pura de t.

const W = 1600
const H = 900
const SALA = { x0: 260, y0: 110, x1: 1180, y1: 600 }
const PUERTA = { x: 710, y: 600 }
const ACERA = { y0: 640, y1: 760 }

const ZONAS = {
  viaje: { nombre: 'Viaje', x: 270, y: 120, w: 230, h: 200, calor: 0.12 },
  caja: { nombre: 'Caja', x: 560, y: 120, w: 300, h: 90, calor: 0.45 },
  accesorios: { nombre: 'Gafas', x: 920, y: 120, w: 250, h: 200, calor: 0.4 },
  joyeria: { nombre: 'Joyería y relojes', x: 270, y: 340, w: 230, h: 250, calor: 0.55 },
  mesa: { nombre: 'Mesa central', x: 590, y: 270, w: 240, h: 170, calor: 1 },
  fragancias: { nombre: 'Fragancias', x: 920, y: 340, w: 250, h: 250, calor: 0.85 },
  entrada: { nombre: 'Entrada', x: 600, y: 480, w: 220, h: 110, calor: 0.6 },
}
const centro = (z, rng) => {
  const Z = ZONAS[z]
  return [Z.x + Z.w * (0.25 + rng.next() * 0.5), Z.y + Z.h * (0.25 + rng.next() * 0.5)]
}

const VEL = 150 // px por segundo de escena

/** Recorrido de una visita: puntos y pausas. Devuelve la posición en el tiempo local tau, o null si no está. */
function crearVisita(rng, t0, opciones = {}) {
  const zonas = opciones.zonas || rng.shuffle(['mesa', 'fragancias', 'joyeria', 'accesorios', 'viaje', 'caja']).slice(0, rng.int(2, 3))
  const puntos = [[PUERTA.x + rng.range(-12, 12), PUERTA.y + 6], centro('entrada', rng), ...zonas.map((z) => centro(z, rng)), [PUERTA.x + rng.range(-12, 12), PUERTA.y + 6]]
  const tramos = []
  let t = t0
  for (let i = 0; i < puntos.length - 1; i++) {
    const a = puntos[i]
    const b = puntos[i + 1]
    const dur = Math.hypot(b[0] - a[0], b[1] - a[1]) / VEL
    tramos.push({ a, b, t0: t, t1: t + dur })
    t += dur
    if (i < puntos.length - 2) {
      const pausa = opciones.espera && i === 1 ? 99 : rng.range(0.6, 2.2)
      tramos.push({ a: b, b, t0: t, t1: t + pausa, pausa: true })
      t += pausa
    }
  }
  return { tramos, t0, t1: t, espera: Boolean(opciones.espera) }
}

function posicion(v, tau) {
  if (tau < v.t0 || tau > v.t1) return null
  for (const s of v.tramos) {
    if (tau <= s.t1) {
      const u = clamp((tau - s.t0) / Math.max(0.001, s.t1 - s.t0), 0, 1)
      return [lerp(s.a[0], s.b[0], u), lerp(s.a[1], s.b[1], u), s.pausa]
    }
  }
  return null
}

function Visitas({ visitas, tau, opacity, color }) {
  if (opacity <= 0) return null
  let estelas = ''
  let puntos = ''
  for (const v of visitas) {
    const p = posicion(v, tau)
    if (!p) continue
    let d = `M${p[0].toFixed(1)} ${p[1].toFixed(1)}`
    for (let j = 1; j <= 5; j++) {
      const q = posicion(v, tau - j * 0.1)
      if (q) d += ` L${q[0].toFixed(1)} ${q[1].toFixed(1)}`
    }
    estelas += d + ' '
    puntos += `M${(p[0] - 5.5).toFixed(1)} ${p[1].toFixed(1)} a5.5 5.5 0 1 0 11 0 a5.5 5.5 0 1 0 -11 0 `
  }
  return (
    <g opacity={opacity}>
      <path d={estelas} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.38" />
      <path d={puntos} fill="var(--screen-text)" />
    </g>
  )
}

function Equipo({ tau, n, opacity }) {
  if (opacity <= 0) return null
  const sitios = [
    [700, 170],
    [1040, 470],
    [400, 470],
    [700, 360],
  ]
  return (
    <g opacity={opacity}>
      {sitios.slice(0, n).map(([x, y], i) => (
        <circle key={i} cx={x + Math.sin(tau * 0.7 + i * 2) * 26} cy={y + Math.cos(tau * 0.5 + i) * 14} r="6.5" fill="var(--campo-s)" stroke="#0f1215" strokeWidth="1.5" />
      ))}
    </g>
  )
}

const Plano = memo(function Plano({ k, tintes }) {
  return (
    <g>
      {Object.entries(ZONAS).map(([id, z]) => (
        <g key={id}>
          <rect x={z.x} y={z.y} width={z.w} height={z.h} fill="var(--comercio-s)" opacity={0.05 * tintes} />
          <text x={z.x + 10} y={z.y + 22} fontFamily={MONO} fontSize={12 * k} letterSpacing="1" fill="var(--screen-dim)" opacity={tintes}>
            {z.nombre.toUpperCase()}
          </text>
        </g>
      ))}
      <g fill="none" stroke="var(--screen-draw)" strokeWidth="1.5">
        {/* Muros, con la puerta en la fachada */}
        <path d={`M${PUERTA.x - 32} ${SALA.y1} H${SALA.x0} V${SALA.y0} H${SALA.x1} V${SALA.y1} H${PUERTA.x + 32}`} />
        {/* Escaparates a ambos lados de la puerta */}
        <rect x="300" y={SALA.y1 - 18} width="330" height="18" stroke="var(--screen-dim)" />
        <rect x="790" y={SALA.y1 - 18} width="350" height="18" stroke="var(--screen-dim)" />
        {/* Mobiliario: mesa central, vitrinas, mostradores, estanterías */}
        <rect x="640" y="315" width="140" height="80" rx="4" />
        <rect x="580" y="140" width="250" height="34" />
        <rect x="290" y="420" width="40" height="150" />
        <rect x="380" y="500" width="100" height="36" />
        <rect x="1135" y="360" width="34" height="210" />
        <rect x="960" y="440" width="120" height="40" rx="3" />
        <rect x="290" y="150" width="34" height="150" />
        <rect x="380" y="200" width="90" height="60" />
        <rect x="960" y="150" width="190" height="30" />
        {/* Salón privado sin cámaras */}
      </g>
      {/* Cámaras del techo */}
      {[
        [420, 250],
        [710, 240],
        [1040, 250],
        [420, 470],
        [1040, 470],
        [710, 520],
      ].map(([x, y], i) => (
        <g key={i} opacity="0.7">
          <circle cx={x} cy={y} r="5" fill="none" stroke="var(--screen-dim)" />
          <circle cx={x} cy={y} r="1.6" fill="var(--screen-dim)" />
        </g>
      ))}
    </g>
  )
})

const Calle = memo(function Calle() {
  return (
    <g fill="none" stroke="var(--screen-line)">
      <path d={`M0 ${ACERA.y0} H${W} M0 ${ACERA.y1} H${W}`} stroke="var(--screen-draw)" strokeWidth="1.2" />
      <path d={`M0 ${ACERA.y1 + 70} H${W}`} strokeDasharray="30 22" />
      {Array.from({ length: 24 }, (_, i) => i * 70).map((x) => (
        <path key={x} d={`M${x} ${ACERA.y0} V${ACERA.y0 + 6}`} />
      ))}
    </g>
  )
})

// Peatones de la acera: pasan, aminoran frente al escaparate, se paran o entran.
function crearPeatones() {
  const rng = createRng('acera')
  const tipos = [...Array(13).fill('pasa'), ...Array(7).fill('aminora'), ...Array(5).fill('para'), 'entra', 'entra']
  return rng.shuffle(tipos).map((tipo, i) => ({
    id: i,
    tipo,
    t0: -8 + i * 0.62 + rng.range(-0.2, 0.2),
    dir: rng.chance(0.5) ? 1 : -1,
    vel: rng.range(120, 170),
    y: ACERA.y0 + 22 + rng.range(0, ACERA.y1 - ACERA.y0 - 44),
    parada: rng.range(320, 1080),
  }))
}
const escaparate = (x) => (x > 300 && x < 630) || (x > 790 && x < 1140)

function peaton(p, tau) {
  let x = p.dir > 0 ? -40 : W + 40
  let y = p.y
  let tiempo = p.t0
  let parado = 0
  let dentro = 0
  if (tau < tiempo) return null
  const dt = 0.05
  while (tiempo < tau) {
    const enFrente = escaparate(x)
    if (p.tipo === 'entra' && Math.abs(x - PUERTA.x) < 6) {
      dentro += dt
      y -= 90 * dt
      if (y < ACERA.y0 - 30) return null
    } else if (p.tipo === 'para' && Math.abs(x - p.parada) < 4 && parado < 3.2 && enFrente) {
      parado += dt
    } else {
      const f = p.tipo === 'aminora' && enFrente ? 0.42 : p.tipo === 'para' && enFrente ? 0.55 : 1
      x += p.dir * p.vel * f * dt
    }
    tiempo += dt
  }
  if (x < -60 || x > W + 60) return null
  return { x, y, parado: parado > 0 && parado < 3.2, dentro: dentro > 0 }
}

const EMBUDO = [
  ['Pasan', 100],
  ['Aminoran', 28.4],
  ['Se paran', 14.2],
  ['Entran', 5.9],
]

function Scene({ film, narrow }) {
  const ids = { calor: useSvgId('calor') }
  const k = kOf(narrow)
  const { t, ease } = film

  const manana = useMemo(() => {
    const rng = createRng('manana')
    return Array.from({ length: 6 }, (_, i) => crearVisita(rng, i * 0.9))
  }, [])
  const tarde = useMemo(() => {
    const rng = createRng('crucero')
    const v = Array.from({ length: 22 }, (_, i) => crearVisita(rng, -9 + i * 0.55))
    // Tres personas esperan junto a la mesa central sin que nadie las atienda
    for (let i = 0; i < 3; i++) v.push(crearVisita(rng, -4 + i * 0.6, { zonas: ['mesa'], espera: true }))
    return v
  }, [])
  const peatones = useMemo(crearPeatones, [])

  const tauM = t
  const tauT = t - 7
  const mananaOp = ventana(t, 0, 6.6, 0.5)
  const tardeOp = ventana(t, 7, 14, 0.6)
  const calor = ease(14.2, 16.4) * (1 - ease(22, 23))
  const calle = ease(22, 23.2)
  const dentroTarde = tarde.filter((v) => posicion(v, tauT)).length
  const enSala = Math.min(21, Math.round(lerp(14, 21, clamp(tauT / 5, 0, 1))))

  const viewBox = useCamera(
    t,
    narrow
      ? [
          { at: 0, box: [240, 90, 960, 720] },
          { at: 21.8, box: [240, 90, 960, 720] },
          { at: 23.4, box: [180, 400, 640, 480] },
          { at: 30, box: [600, 400, 640, 480] },
        ]
      : [
          { at: 0, box: [0, 0, W, H] },
          { at: 30, box: [0, 0, W, H] },
        ],
  )

  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        {/* Mapa de calor: la densidad se difumina y se colorea de ciruela a blanco cálido */}
        <filter id={ids.calor} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="34" />
          <feColorMatrix values="0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0 0.23 0.56 0.88 0.94 0.95 1" />
            <feFuncG type="table" tableValues="0 0.11 0.17 0.28 0.48 0.71 0.95" />
            <feFuncB type="table" tableValues="0 0.36 0.43 0.37 0.23 0.27 0.79" />
            <feFuncA type="table" tableValues="0 0.55 0.75 0.85 0.9 0.92 0.95" />
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width={W} height={H} fill="#0f1215" />

      <g opacity={1 - 0.6 * calle}>
        <Plano k={k} tintes={1 - 0.5 * calor} />
      </g>
      <Calle />

      {calor > 0 && (
        <g filter={`url(#${ids.calor})`} opacity={calor}>
          {Object.entries(ZONAS).map(([id, z]) => {
            const rng = createRng(id)
            return Array.from({ length: 9 }, (_, i) => (
              <circle
                key={`${id}${i}`}
                cx={z.x + z.w * rng.range(0.15, 0.85)}
                cy={z.y + z.h * rng.range(0.2, 0.85)}
                r={lerp(26, 52, z.calor)}
                fill="white"
                opacity={z.calor * 0.55}
              />
            ))
          })}
        </g>
      )}

      <Visitas visitas={manana} tau={tauM} opacity={mananaOp} color="var(--comercio-s)" />
      <Equipo tau={t} n={3} opacity={mananaOp} />
      <Visitas visitas={tarde} tau={tauT} opacity={tardeOp} color="var(--comercio-s)" />
      <Equipo tau={t} n={2} opacity={tardeOp} />

      {/* Quien espera más de un minuto: anillo rojo con su tiempo */}
      {tardeOp > 0 &&
        tarde
          .filter((v) => v.espera)
          .map((v, i) => {
            const p = posicion(v, tauT)
            if (!p) return null
            const espera = 58 + i * 7 + Math.max(0, tauT) * 3
            if (espera < 60) return null
            const lx = ZONAS.mesa.x + ZONAS.mesa.w + 26
            const ly = ZONAS.mesa.y + 34 + i * 30
            return (
              <g key={i} opacity={tardeOp}>
                <circle cx={p[0]} cy={p[1]} r={17 + 2 * Math.sin(t * 5 + i)} fill="none" stroke="var(--data-alert)" strokeWidth="2" />
                <path d={`M${p[0] + 15} ${p[1]} L${lx - 6} ${ly - 5}`} stroke="var(--screen-dim)" strokeWidth="1" />
                <text x={lx} y={ly} fontFamily={MONO} fontSize={13 * k} fill="var(--screen-text)" {...HALO}>
                  {fmtDuration(espera)} sin atender
                </text>
              </g>
            )
          })}

      {/* Leyenda breve de las dos primeras escenas */}
      {calle < 1 && (
        <g opacity={Math.max(mananaOp, tardeOp)} transform="translate(1240 140)">
          <circle cx="6" cy="-5" r="5.5" fill="var(--screen-text)" />
          <text x="22" y="0" fontFamily={MONO} fontSize={13 * k} fill="var(--screen-text)" {...HALO}>
            Visitas
          </text>
          <circle cx="6" cy="27" r="6" fill="var(--campo-s)" />
          <text x="22" y="32" fontFamily={MONO} fontSize={13 * k} fill="var(--screen-text)" {...HALO}>
            Equipo
          </text>
          <circle cx="6" cy="59" r="9" fill="none" stroke="var(--data-alert)" strokeWidth="2" />
          <text x="22" y="64" fontFamily={MONO} fontSize={13 * k} fill="var(--screen-text)" {...HALO}>
            Más de un minuto sin atender
          </text>
        </g>
      )}
      {!narrow && (
        <g opacity={tardeOp}>
          <Rotulo x={1240} y={300} k={k}>
            EN SALA · SÁBADO
          </Rotulo>
          <text x={1236} y={400} fontFamily={SERIF} fontWeight="300" fontSize={110} fill="var(--screen-text)" className="num">
            {enSala}
          </text>
          <path d={`M1240 424 H${1240 + 300 * clamp(dentroTarde / 22, 0, 1)}`} stroke="var(--comercio-s)" strokeWidth="3" />
          <text x={1240} y={460} fontFamily={SERIF} fontStyle="italic" fontWeight="300" fontSize={24} fill="var(--screen-dim)">
            personas; dos asesoras en su descanso
          </text>
        </g>
      )}

      {/* El calor de la semana */}
      {calor > 0 && !narrow && (
        <g opacity={calor}>
          <Rotulo x={1240} y={300} k={k}>
            PERMANENCIA · SEMANA 39
          </Rotulo>
          <defs>
            <linearGradient id={`${ids.calor}g`} x1="0" x2="1">
              <stop offset="0" stopColor="#3a1c5c" />
              <stop offset="0.35" stopColor="#8e2c6e" />
              <stop offset="0.55" stopColor="#e0485f" />
              <stop offset="0.75" stopColor="#f07a3a" />
              <stop offset="0.9" stopColor="#f2b544" />
              <stop offset="1" stopColor="#fff1c9" />
            </linearGradient>
          </defs>
          <rect x={1240} y={320} width={300} height={10} fill={`url(#${ids.calor}g)`} />
          <text x={1240} y={354} fontFamily={MONO} fontSize={12} fill="var(--screen-dim)">
            poco
          </text>
          <text x={1540} y={354} textAnchor="end" fontFamily={MONO} fontSize={12} fill="var(--screen-dim)">
            mucho
          </text>
          <Nota x={1220} y={400} w={340} kicker="MESA CENTRAL" valor="4:07" unidad="min" linea="de media por visita; viaje, un 4 %" color="var(--comercio-s)" progress={ventana(t, 16.6, 21.8, 0.7)} />
        </g>
      )}

      {/* La calle: peatones frente al escaparate y el embudo */}
      {calle > 0 && (
        <g>
          <g opacity={calle}>
            <defs>
              <linearGradient id={`${ids.calor}luz`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#c98500" stopOpacity="0.32" />
                <stop offset="1" stopColor="#c98500" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[
              [300, 330],
              [790, 350],
            ].map(([x, w]) => (
              <g key={x}>
                <rect x={x} y={SALA.y1 - 18} width={w} height="18" fill="var(--comercio-s)" opacity="0.7" />
                <polygon points={`${x},${SALA.y1} ${x + w},${SALA.y1} ${x + w + 30},${ACERA.y1} ${x - 30},${ACERA.y1}`} fill={`url(#${ids.calor}luz)`} />
              </g>
            ))}
          </g>
          {peatones.map((p) => {
            const q = peaton(p, t - 22)
            if (!q) return null
            const r = peaton(p, t - 22.18)
            return (
              <g key={p.id} opacity={calle}>
                {r && !q.parado && <path d={`M${r.x} ${r.y} L${q.x} ${q.y}`} stroke="var(--screen-text)" strokeWidth="3" strokeLinecap="round" opacity="0.3" />}
                {q.parado && <circle cx={q.x} cy={q.y} r={18 + 2 * Math.sin(t * 4 + p.id)} fill="var(--comercio-s)" opacity="0.28" />}
                <circle cx={q.x} cy={q.y} r="5.5" fill={q.parado ? 'var(--comercio-s)' : 'var(--screen-text)'} />
              </g>
            )
          })}
          {!narrow && (
            <g opacity={calle} transform="translate(1240 150)">
              <Rotulo x={0} y={0} k={k}>
                ESCAPARATE DE OTOÑO
              </Rotulo>
              {EMBUDO.map(([nombre, pct], i) => {
                const y = 40 + i * 74
                const w = 300 * (pct / 100) * clamp((t - 23 - i * 0.6) / 1.2, 0, 1)
                return (
                  <g key={nombre}>
                    <text x={0} y={y} fontFamily={MONO} fontSize={14} fill="var(--screen-dim)">
                      {nombre}
                    </text>
                    <text x={300} y={y} textAnchor="end" fontFamily={MONO} fontSize={15} fill="var(--screen-text)" className="num">
                      {String(pct).replace('.', ',')} %
                    </text>
                    <rect x={0} y={y + 12} width={300} height={16} fill="rgba(230,232,228,.06)" />
                    <rect x={0} y={y + 12} width={Math.max(0, w)} height={16} fill="var(--comercio-s)" opacity={0.4 + i * 0.18} />
                  </g>
                )
              })}
              <text x={0} y={360} fontFamily={SERIF} fontStyle="italic" fontWeight="300" fontSize={24} fill="var(--screen-dim)">
                se detienen casi el doble que en verano
              </text>
            </g>
          )}
        </g>
      )}
    </svg>
  )
}

export default {
  id: 'boutique',
  label:
    'Plano cenital de una boutique con su acera. Por la mañana entran las primeras visitas, por la tarde llega un grupo y tres personas esperan más de un minuto, el mapa de calor de la semana marca la mesa central y en la calle se mide cuántos pasan, se paran y entran.',
  duration: 30,
  poster: 11,
  aspect: '16 / 9',
  aspectNarrow: '4 / 3',
  frame: {
    lugar: 'Boutique piloto · Canarias',
    origen: 'Cámaras de techo',
    reloj: (t) => (t < 7 ? `10:${String(Math.floor(t * 4)).padStart(2, '0')}` : t < 14 ? `17:${String(46 + Math.floor((t - 7) * 0.9)).padStart(2, '0')}` : t < 22 ? 'Semana 39' : 'Sábado 26'),
  },
  scenes: [
    { at: 0, title: 'Abre la tienda', caption: '10:00 · Entran las primeras visitas. Cada punto es una persona sin nombre ni cara.' },
    { at: 7, title: 'Llega el grupo', caption: '17:50 · Llega el grupo del crucero. Tres personas llevan más de un minuto esperando.' },
    { at: 14, title: 'El calor de la semana', caption: 'Semana 39 · La mesa central concentra la permanencia. La zona de viaje, casi nada.' },
    { at: 22, title: 'La calle', caption: 'El escaparate de otoño · De cada cien que pasan, catorce se detienen y seis entran.' },
  ],
  Scene,
}
