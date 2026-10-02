import { memo, useMemo } from 'react'
import { useCamera } from '../../components/film/Film.jsx'
import { useSvgId } from '../../lib/hooks.js'
import { clamp, easeInOut, lerp } from '../../lib/svg.js'
import { fmtInt } from '../../lib/format.js'
import { Etiqueta, HALO, MONO, Nota, Rotulo, kOf, ventana } from '../kit.jsx'

// Construcción (GUIA.md, 9.3), primera versión. Una obra residencial en isométrico: el vaciado medido
// por el dron, la estructura frente a lo planificado, una persona bajo la carga de la grúa y la
// certificación de fin de mes. Función pura de t.

const W = 1600
const H = 900
const S = 15 // píxeles por metro
const O = { x: 560, y: 262 }
const C30 = Math.cos(Math.PI / 6)

/** Punto del mundo (metros) a pantalla en isométrico */
const P = (x, y, z = 0) => [O.x + (x - y) * C30 * S, O.y + (x + y) * 0.5 * S - z * S]
const pts = (arr) => arr.map((p) => P(...p).map((v) => v.toFixed(1)).join(',')).join(' ')
const seg = (a, b) => {
  const [x1, y1] = P(...a)
  const [x2, y2] = P(...b)
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`
}

const SOLAR = { x0: 0, y0: 0, x1: 40, y1: 30 }
const EDIF = { x0: 8, y0: 8, x1: 32, y1: 22 }
const PLANTA = 3
const PLANTAS_PREVISTAS = 6
const VACIADO = 4

// Pilares cada 6 metros, con su estado en la semana 18
const PILARES = []
for (let x = EDIF.x0; x <= EDIF.x1; x += 6) for (let y = EDIF.y0; y <= EDIF.y1; y += 7) PILARES.push([x, y])

const PARTIDAS = [
  ['Movimiento de tierras', 1],
  ['Cimentación', 1],
  ['Estructura, plantas 1 a 3', 1],
  ['Forjado de planta 4', 0.6],
  ['Cerramientos', 0.15],
  ['Instalaciones', 0.05],
]

const Solar = memo(function Solar() {
  const { x0, y0, x1, y1 } = SOLAR
  return (
    <g fill="none" stroke="var(--screen-draw)" strokeWidth="1.2">
      <polygon points={pts([[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]])} stroke="var(--screen-line)" />
      {/* Vallado de obra */}
      <path d={[seg([x0, y0, 0], [x0, y0, 2]), seg([x1, y0, 0], [x1, y0, 2]), seg([x0, y1, 0], [x0, y1, 2])].join(' ')} stroke="var(--screen-line)" />
      <path d={seg([x0, y0, 2], [x1, y0, 2]) + ' ' + seg([x0, y0, 2], [x0, y1, 2])} stroke="var(--screen-line)" strokeDasharray="5 5" />
      {/* Casetas de obra */}
      <polygon points={pts([[2, 24, 0], [8, 24, 0], [8, 24, 2.6], [2, 24, 2.6]])} />
      <polygon points={pts([[2, 24, 2.6], [8, 24, 2.6], [8, 28, 2.6], [2, 28, 2.6]])} />
    </g>
  )
})

function Vaciado({ excavado, acopio }) {
  const { x0, y0, x1, y1 } = EDIF
  const z = -VACIADO * excavado
  return (
    <g>
      {/* Fondo y paredes del vaciado: lo excavado, en azul */}
      <polygon points={pts([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]])} fill="var(--mar-s)" opacity="0.32" stroke="var(--mar-s)" />
      <polygon points={pts([[x0, y0, 0], [x0, y1, 0], [x0, y1, z], [x0, y0, z]])} fill="var(--mar-s)" opacity="0.18" />
      <polygon points={pts([[x0, y0, 0], [x1, y0, 0], [x1, y0, z], [x0, y0, z]])} fill="var(--mar-s)" opacity="0.24" />
      <polygon points={pts([[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]])} fill="none" stroke="var(--screen-text)" strokeWidth="1.4" />
      {/* Acopio de tierras en la esquina del solar: lo que queda para relleno, en naranja */}
      {acopio > 0 && (
        <g opacity={acopio}>
          <polygon points={pts([[33, 23, 0], [39, 23, 0], [37, 28, 0], [34, 28, 0]])} fill="var(--industria-s)" opacity="0.25" />
          <polygon points={pts([[33, 23, 0], [36, 25, 3.2 * acopio], [39, 23, 0]])} fill="var(--industria-s)" opacity="0.55" />
          <polygon points={pts([[36, 25, 3.2 * acopio], [39, 23, 0], [37, 28, 0]])} fill="var(--industria-s)" opacity="0.4" />
        </g>
      )}
    </g>
  )
}

function Puntos({ avance }) {
  // Nube de puntos del levantamiento: aparecen a medida que pasa el dron, fila a fila.
  let d = ''
  const filas = 15
  for (let j = 0; j < filas; j++) {
    const y = 1 + j * 2
    const filaProg = clamp(avance * filas - j, 0, 1)
    if (filaProg <= 0) break
    const ida = j % 2 === 0
    for (let x = 1; x < 40; x += 2) {
      const u = x / 40
      if ((ida ? u : 1 - u) > filaProg) continue
      const dentro = x > EDIF.x0 && x < EDIF.x1 && y > EDIF.y0 && y < EDIF.y1
      const [px, py] = P(x, y, dentro ? -VACIADO : 0)
      d += `M${px.toFixed(1)} ${py.toFixed(1)} h0.01 `
    }
  }
  return <path d={d} stroke="var(--screen-text)" strokeWidth="3.2" strokeLinecap="round" opacity="0.7" />
}

function dronVaciado(t) {
  const u = clamp((t - 1) / 6.2, 0, 1)
  const filas = 15
  const f = u * filas
  const j = Math.min(filas - 1, Math.floor(f))
  const r = f - j
  const x = j % 2 === 0 ? 1 + r * 38 : 39 - r * 38
  return { x, y: 1 + j * 2, avance: u }
}

function Dron({ x, y, t }) {
  const blink = Math.floor(t * 4) % 2 === 0
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-18 -7 L18 7 M-18 7 L18 -7" stroke="var(--screen-text)" strokeWidth="1.8" />
      {[
        [-18, -7],
        [18, -7],
        [-18, 7],
        [18, 7],
      ].map(([a, b]) => (
        <ellipse key={`${a}${b}`} cx={a} cy={b} rx="11" ry="2.8" fill="rgba(230,232,228,.35)" />
      ))}
      <rect x="-7" y="-5" width="14" height="10" rx="2" fill="#0f1215" stroke="var(--screen-text)" strokeWidth="1.3" />
      <circle cx="0" cy="7" r="2.5" fill={blink ? 'var(--data-alert)' : 'var(--screen-dim)'} />
    </g>
  )
}

const ESTADO = { hecho: 'var(--data-ok)', curso: 'var(--data-warn)', tarde: 'var(--data-alert)' }

function Estructura({ plantas, ghost, k, t }) {
  const { x0, y0, x1, y1 } = EDIF
  const out = []
  // Lo planificado para esta semana, en discontinuo
  if (ghost > 0) {
    const zt = PLANTAS_PREVISTAS * PLANTA
    out.push(
      <g key="ghost" fill="none" stroke="var(--screen-dim)" strokeDasharray="6 6" opacity={ghost}>
        <polygon points={pts([[x0, y0, zt], [x1, y0, zt], [x1, y1, zt], [x0, y1, zt]])} />
        <path d={[seg([x0, y0, 0], [x0, y0, zt]), seg([x1, y0, 0], [x1, y0, zt]), seg([x0, y1, 0], [x0, y1, zt]), seg([x1, y1, 0], [x1, y1, zt])].join(' ')} />
      </g>,
    )
  }
  const completas = Math.floor(plantas)
  const parcial = plantas - completas
  for (let n = 0; n <= Math.min(PLANTAS_PREVISTAS - 1, completas); n++) {
    const z0 = n * PLANTA
    const z1 = z0 + PLANTA
    const altura = n < completas ? 1 : parcial
    if (altura <= 0) continue
    // Pilares de la planta, coloreados por estado
    PILARES.forEach(([px, py]) => {
      let estado = 'hecho'
      if (n === 3) estado = px >= 26 && py <= 8 ? 'tarde' : 'curso'
      if (estado === 'tarde') {
        // Lo que debería estar y no está: el pilar previsto, en rojo discontinuo
        out.push(<path key={`p${n}${px}${py}`} d={seg([px, py, z0], [px, py, z1])} stroke={ESTADO.tarde} strokeWidth="2.4" strokeDasharray="5 5" opacity={altura} />)
        return
      }
      const zTop = z0 + PLANTA * (n === 3 ? Math.min(altura, 0.85) : altura)
      if (zTop <= z0) return
      out.push(<path key={`p${n}${px}${py}`} d={seg([px, py, z0], [px, py, zTop])} stroke={ESTADO[estado]} strokeWidth="3" />)
    })
    // Forjado de la planta (el techo), solo cuando la planta está terminada
    if (n < completas || (n === 3 && altura >= 1)) {
      const zf = z1
      const op = n === 3 ? 0.5 : 1
      out.push(
        <g key={`f${n}`} opacity={op}>
          <polygon points={pts([[x0, y0, zf], [x1, y0, zf], [x1, y1, zf], [x0, y1, zf]])} fill="#1a1f24" stroke="var(--screen-draw)" strokeWidth="1.2" />
          <polygon points={pts([[x0, y0, zf], [x1, y0, zf], [x1, y0, zf - 0.4], [x0, y0, zf - 0.4]])} fill="#141920" stroke="var(--screen-draw)" />
          <polygon points={pts([[x0, y0, zf], [x0, y1, zf], [x0, y1, zf - 0.4], [x0, y0, zf - 0.4]])} fill="#11161b" stroke="var(--screen-draw)" />
        </g>,
      )
    }
  }
  return <g>{out}</g>
}

function Grua({ angulo, carga, t }) {
  const mast = [36, 3]
  const alto = 30
  const largo = 27
  const top = [mast[0], mast[1], alto]
  const punta = [mast[0] + Math.cos(angulo) * largo, mast[1] + Math.sin(angulo) * largo, alto]
  const contra = [mast[0] - Math.cos(angulo) * 8, mast[1] - Math.sin(angulo) * 8, alto]
  const carro = [mast[0] + Math.cos(angulo) * carga.r, mast[1] + Math.sin(angulo) * carga.r]
  const zCarga = carga.z
  const [cx, cy] = P(carro[0], carro[1], zCarga)
  return (
    <g fill="none" stroke="var(--screen-draw)" strokeWidth="1.4">
      <path d={seg([mast[0], mast[1], 0], top)} strokeWidth="2.4" />
      <path d={seg([mast[0] - 0.6, mast[1], 0], [mast[0] - 0.6, mast[1], alto])} stroke="var(--screen-line)" />
      <path d={seg(contra, punta)} strokeWidth="2" />
      <path d={seg([mast[0], mast[1], alto + 4], punta) + ' ' + seg([mast[0], mast[1], alto + 4], contra)} stroke="var(--screen-line)" />
      <path d={seg(top, [mast[0], mast[1], alto + 4])} />
      <path d={seg([carro[0], carro[1], alto], [carro[0], carro[1], zCarga + 1.2])} stroke="var(--screen-dim)" />
      <rect x={cx - 14} y={cy - 14} width="28" height="16" fill="var(--industria-s)" opacity="0.85" stroke="none" />
    </g>
  )
}

function Operario({ x, y, t }) {
  const [px, py] = P(x, y, 0)
  const paso = Math.sin(t * 8) * 4
  return (
    <g transform={`translate(${px} ${py})`} fill="none" stroke="var(--screen-text)" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="0" cy="-31" r="5" />
      <path d={`M0 -26 L0 -12 M-7 -22 L7 -20 M0 -12 L${-4 + paso} 0 M0 -12 L${4 - paso} 0`} />
    </g>
  )
}

function Scene({ film, narrow }) {
  const ids = { sombra: useSvgId('sombra') }
  const k = kOf(narrow)
  const { t, ease, between } = film

  // Plano 1: vaciado medido por el dron
  const d = dronVaciado(t)
  const excavado = ease(0.2, 5)
  const vaciadoOp = 1 - ease(8, 9.2)
  // Plano 2: la estructura sube
  const plantas = lerp(0, 4, ease(8.8, 13.6))
  const ghost = ease(9.4, 11) * (1 - ease(23, 24))
  // Plano 3: la grúa gira con la carga; alguien entra bajo ella
  const giro = ease(16, 22.6)
  const angulo = lerp(-0.6, 1.75, giro)
  const carga = { r: 22, z: lerp(14, 20, Math.sin(giro * Math.PI)) }
  const carro = [36 + Math.cos(angulo) * carga.r, 3 + Math.sin(angulo) * carga.r]
  // Entra andando, se para a trabajar justo donde va a pasar la carga y se aparta al oír el aviso
  const op = [t < 22.4 ? lerp(4, 30, easeInOut(between(17, 20.6))) : lerp(30, 18, easeInOut(between(22.4, 23.4))), 27]
  const dist = Math.hypot(op[0] - carro[0], op[1] - carro[1])
  const bajo = t > 16.5 && t < 23 && dist < 6
  const certifica = between(23.6, 28.2)

  const viewBox = useCamera(
    t,
    narrow
      ? [
          { at: 0, box: [120, 140, 1000, 750] },
          { at: 22.8, box: [120, 140, 1000, 750] },
          { at: 24.4, box: [560, 120, 1000, 750] },
          { at: 30, box: [560, 120, 1000, 750] },
        ]
      : [
          { at: 0, box: [0, 0, W, H] },
          { at: 30, box: [0, 0, W, H] },
        ],
  )

  const [sx, sy] = P(carro[0], carro[1], 0)
  const [ox, oy] = P(op[0], op[1], 0)
  const [dx, dy] = P(d.x, d.y, 18)

  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={ids.sombra}>
          <stop offset="0" stopColor="#d03b3b" stopOpacity="0.4" />
          <stop offset="1" stopColor="#d03b3b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="#0f1215" />

      <Solar />
      {vaciadoOp > 0 && (
        <g opacity={vaciadoOp}>
          <Vaciado excavado={excavado} acopio={ease(1, 5)} />
          <Puntos avance={d.avance} />
        </g>
      )}

      {/* Zona de barrido de la grúa en el suelo y la sombra de la carga */}
      {t > 15.4 && t < 23.6 && (
        <g opacity={ventana(t, 15.6, 22.8)}>
          <ellipse cx={P(36, 3, 0)[0]} cy={P(36, 3, 0)[1]} rx={27 * S * C30 * 1.41} ry={27 * S * 0.5 * 1.41} fill="none" stroke="var(--screen-line)" strokeDasharray="4 8" />
          <ellipse cx={sx} cy={sy} rx={6 * S * C30 * 1.41} ry={6 * S * 0.5 * 1.41} fill={`url(#${ids.sombra})`} stroke="var(--data-alert)" strokeDasharray="3 5" opacity="0.9" />
        </g>
      )}

      {t > 8.6 && <Estructura plantas={plantas} ghost={ghost} k={k} t={t} />}

      {t > 15 && t < 23.6 && <Operario x={op[0]} y={op[1]} t={t} />}
      {bajo && (
        <g>
          <circle cx={ox} cy={oy - 16} r={26 + 6 * Math.sin(t * 8)} fill="none" stroke="var(--data-alert)" strokeWidth="2.4" />
          <Etiqueta x={ox} y={oy - 16} lx={ox - 40} ly={oy + 80} anchor="end" texto="Bajo la carga · aviso al gruista" k={k} />
        </g>
      )}
      {t > 15 && (
        <g opacity={1 - 0.75 * ease(23, 24.2)}>
          <Grua angulo={angulo} carga={carga} t={t} />
        </g>
      )}
      {t <= 15 && t > 8 && <Grua angulo={-0.6} carga={{ r: 22, z: 14 }} t={t} />}

      {t > 0.8 && t < 8.2 && <Dron x={dx} y={dy} t={t} />}

      {/* Plano 1: el volumen del vaciado */}
      {!narrow && (
        <Nota
          x={1110}
          y={300}
          w={400}
          kicker="SEMANA 12 · VACIADO"
          valor={fmtInt(lerp(0, 4820, excavado))}
          unidad="m³"
          linea="excavados de 5.100 previstos"
          color="var(--mar-s)"
          progress={ventana(t, 2, 7.8)}
        />
      )}
      <Etiqueta x={P(37, 25, 2)[0]} y={P(37, 25, 2)[1]} lx={P(37, 25, 2)[0] + 60} ly={P(37, 25, 2)[1] + 60} texto="Acopio para relleno" k={k} opacity={ventana(t, 3.4, 7.8)} />

      {/* Plano 2: estado de la estructura frente a lo planificado */}
      <g opacity={ventana(t, 11.4, 15.6)}>
        <Etiqueta
          x={P(32, 8, 10.5)[0]}
          y={P(32, 8, 10.5)[1]}
          lx={P(32, 8, 10.5)[0] + (narrow ? 40 : 90)}
          ly={P(32, 8, 10.5)[1] + (narrow ? 150 : 70)}
          anchor={narrow ? 'end' : 'start'}
          texto={narrow ? 'Planta 4: una semana tarde' : 'Esquina norte, planta 4: una semana tarde'}
          k={k}
        />
        <Etiqueta x={P(8, 8, 18)[0]} y={P(8, 8, 18)[1]} lx={P(8, 8, 18)[0] - 70} ly={P(8, 8, 18)[1] - 10} anchor="end" texto="Lo previsto para esta semana" k={k} dim />
        <g transform="translate(1110 600)">
          {[
            ['hecho', 'Hecho'],
            ['curso', 'En curso'],
            ['tarde', 'Retrasado'],
          ].map(([e, l], i) => (
            <g key={e} transform={`translate(0 ${i * 32})`}>
              <path d="M0 -5 H26" stroke={ESTADO[e]} strokeWidth="4" />
              <text x="38" y="0" fontFamily={MONO} fontSize={14 * k} fill="var(--screen-text)" {...HALO}>
                {l}
              </text>
            </g>
          ))}
        </g>
      </g>

      {/* Plano 4: la certificación de fin de mes */}
      {t > 23 && (
        <g opacity={ease(23.4, 24.6)}>
          <Rotulo x={1080} y={150} k={k}>
            CERTIFICACIÓN DE OCTUBRE · POR PARTIDAS
          </Rotulo>
          {PARTIDAS.map(([nombre, pct], i) => {
            const y = 200 + i * 62
            const fill = clamp(certifica * PARTIDAS.length - i, 0, 1) * pct
            return (
              <g key={nombre}>
                <text x={1080} y={y} fontFamily={MONO} fontSize={15 * k} fill="var(--screen-dim)">
                  {nombre}
                </text>
                <path d={`M1080 ${y + 16} H1520`} stroke="var(--screen-line)" strokeWidth="6" />
                <path d={`M1080 ${y + 16} H${1080 + 440 * fill}`} stroke="var(--industria-s)" strokeWidth="6" />
                <text x={1520} y={y} textAnchor="end" fontFamily={MONO} fontSize={15 * k} fill="var(--screen-text)" className="num">
                  {fmtInt(fill * 100)} %
                </text>
              </g>
            )
          })}
          {!narrow && (
            <Nota x={1080} y={580} w={440} kicker="A FIRMAR POR EL JEFE DE OBRA" valor="412.300" unidad="€" linea="certificación de octubre, medida" color="var(--industria-s)" progress={ventana(t, 27.2, 30, 0.7)} />
          )}
        </g>
      )}
    </svg>
  )
}

export default {
  id: 'obra',
  label:
    'Una obra residencial en isométrico. Un dron mide el vaciado, la estructura sube planta a planta frente a lo planificado, una persona entra bajo la carga de la grúa y salta el aviso, y a fin de mes la medición pasa a la certificación por partidas.',
  duration: 30,
  poster: 13,
  aspect: '16 / 9',
  aspectNarrow: '4 / 3',
  frame: {
    lugar: 'Obra residencial · 64 viviendas',
    origen: 'Dron y cámara de grúa',
    reloj: (t) => (t < 8 ? 'Semana 12' : t < 16 ? 'Semana 18' : t < 23 ? 'Martes 11:20' : '31 de octubre'),
  },
  scenes: [
    { at: 0, title: 'El vaciado', caption: 'Semana 12 · El vuelo semanal mide lo excavado y lo que queda en acopio.' },
    { at: 8, title: 'La estructura', caption: 'Semana 18 · Lo hecho frente a lo previsto. La esquina norte va una semana tarde.' },
    { at: 16, title: 'Bajo la carga', caption: 'Martes, 11:20 · Alguien entra bajo la carga de la grúa. Aviso al gruista y al encargado.' },
    { at: 23, title: 'La certificación', caption: 'Fin de mes · Lo medido pasa a las partidas. Lo firma el jefe de obra.' },
  ],
  Scene,
}
