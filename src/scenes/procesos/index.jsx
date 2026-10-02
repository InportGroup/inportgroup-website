import { memo } from 'react'
import { useCamera } from '../../components/film/Film.jsx'
import { useSvgId } from '../../lib/hooks.js'
import { clamp, easeInOut, lerp } from '../../lib/svg.js'
import { fmtInt } from '../../lib/format.js'
import { HALO, MONO, Nota, Rotulo, SERIF, bezier, kOf, ventana } from '../kit.jsx'

// Automatización de procesos (GUIA.md, 9.9), primera versión. Los albaranes y facturas de la semana entran
// por correo, foto y escáner; uno se lee solo, se cruza con su pedido y, lo que cuadra, pasa al ERP sin
// teclear. Lo que no cuadra va a una persona. Función pura de t.

const W = 1600
const H = 900
const C = 'var(--operaciones-s)'

const FUENTES = [
  { id: 'correo', nombre: 'Correo', x: 190, y: 250 },
  { id: 'movil', nombre: 'Foto desde el móvil', x: 190, y: 450 },
  { id: 'escaner', nombre: 'Escáner', x: 190, y: 650 },
]
const BANDEJA = { x: 800, y: 470 }

const CAMPOS = [
  // caja: rectángulo que enmarca el texto en el albarán [x, arriba, ancho, alto]
  { nombre: 'Proveedor', valor: 'Piensos Ribera', caja: [466, 226, 146, 26] },
  { nombre: 'Fecha', valor: '28 sep 2026', caja: [736, 226, 120, 26] },
  { nombre: 'Pedido', valor: '4471', caja: [736, 260, 120, 26] },
  { nombre: 'Producto', valor: 'Pienso cebo 2', caja: [466, 390, 138, 26] },
  { nombre: 'Cantidad', valor: '25.200 kg', caja: [686, 390, 70, 26] },
  { nombre: 'Importe', valor: '9.072 €', caja: [766, 554, 108, 34] },
]

const CRUCE = [
  { campo: 'Proveedor', albaran: 'Piensos Ribera', pedido: 'Piensos Ribera', ok: true },
  { campo: 'Producto', albaran: 'Pienso cebo 2', pedido: 'Pienso cebo 2', ok: true },
  { campo: 'Cantidad', albaran: '25.200 kg', pedido: '24.000 kg', ok: false },
  { campo: 'Precio', albaran: '0,36 €/kg', pedido: '0,36 €/kg', ok: true },
]

const ERP = [
  ['25 004718', 'Piensos Ribera', '9.072 €', 'En revisión'],
  ['25 004719', 'Transportes Leza', '1.180 €', 'Contabilizado'],
  ['F 2026 0812', 'Gasóleos Norte', '3.406 €', 'Contabilizado'],
  ['25 004720', 'Piensos Ribera', '8.640 €', 'Contabilizado'],
  ['F 2026 0813', 'Veterinaria Sur', '612 €', 'Contabilizado'],
]

function Hoja({ x, y, s = 1, opacity = 1, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity}>
      <path d="M-30 -40 H18 L30 -28 V40 H-30 Z" fill="#151a1f" stroke="var(--screen-draw)" strokeWidth={1.4 / s} />
      <path d="M18 -40 V-28 H30" fill="none" stroke="var(--screen-draw)" strokeWidth={1.2 / s} />
      <path d="M-20 -22 H12 M-20 -10 H20 M-20 2 H20 M-20 14 H6" stroke="var(--screen-line)" strokeWidth={1.6 / s} />
    </g>
  )
}

function Icono({ id, x, y }) {
  const st = { fill: 'none', stroke: 'var(--screen-text)', strokeWidth: 1.6, strokeLinejoin: 'round' }
  if (id === 'correo')
    return (
      <g transform={`translate(${x} ${y})`} {...st}>
        <rect x="-26" y="-18" width="52" height="36" />
        <path d="M-26 -18 L0 4 L26 -18" />
      </g>
    )
  if (id === 'movil')
    return (
      <g transform={`translate(${x} ${y})`} {...st}>
        <rect x="-15" y="-27" width="30" height="54" rx="5" />
        <rect x="-9" y="-17" width="18" height="24" stroke="var(--screen-dim)" />
      </g>
    )
  return (
    <g transform={`translate(${x} ${y})`} {...st}>
      <path d="M-30 -6 H30 V16 H-30 Z M-24 -6 L-18 -20 H18 L24 -6" />
      <path d="M-20 6 H20" stroke="var(--screen-dim)" />
    </g>
  )
}

// El albarán ampliado, dibujado a línea
const Albaran = memo(function Albaran() {
  return (
    <g>
      <rect x="440" y="150" width="460" height="640" fill="#141920" stroke="var(--screen-draw)" strokeWidth="1.5" />
      <text x="470" y="200" fontFamily={MONO} fontSize="20" letterSpacing="3" fill="var(--screen-text)">
        ALBARÁN
      </text>
      <text x="868" y="200" textAnchor="end" fontFamily={MONO} fontSize="14" fill="var(--screen-dim)">
        Nº 25 004718
      </text>
      <text x="474" y="244" fontFamily={MONO} fontSize="15" fill="var(--screen-text)">
        Piensos Ribera
      </text>
      <path d="M474 266 H660 M474 284 H620" stroke="var(--screen-line)" strokeWidth="2" />
      <text x="744" y="244" fontFamily={MONO} fontSize="14" fill="var(--screen-text)">
        28 sep 2026
      </text>
      <text x="744" y="278" fontFamily={MONO} fontSize="14" fill="var(--screen-text)">
        Pedido 4471
      </text>
      <path d="M470 330 H870 M470 364 H870" stroke="var(--screen-dim)" />
      {['Producto', 'Kg', '€/kg'].map((h, i) => (
        <text key={h} x={[474, 694, 800][i]} y="352" fontFamily={MONO} fontSize="12" letterSpacing="1" fill="var(--screen-dim)">
          {h.toUpperCase()}
        </text>
      ))}
      <text x="474" y="408" fontFamily={MONO} fontSize="15" fill="var(--screen-text)">
        Pienso cebo 2
      </text>
      <text x="694" y="408" fontFamily={MONO} fontSize="15" fill="var(--screen-text)">
        25.200
      </text>
      <text x="800" y="408" fontFamily={MONO} fontSize="15" fill="var(--screen-text)">
        0,36
      </text>
      <path d="M474 444 H860 M474 478 H830 M474 512 H800" stroke="var(--screen-line)" strokeWidth="2" />
      <path d="M470 540 H870" stroke="var(--screen-dim)" />
      <text x="474" y="580" fontFamily={MONO} fontSize="14" letterSpacing="1" fill="var(--screen-dim)">
        TOTAL
      </text>
      <text x="866" y="580" textAnchor="end" fontFamily={SERIF} fontSize="26" fill="var(--screen-text)">
        9.072 €
      </text>
      {/* Firma de quien recibió la carga, a mano */}
      <path d="M490 720 q20 -30 40 -4 t40 -6 t36 8 q14 -18 30 -4" fill="none" stroke="var(--screen-dim)" strokeWidth="1.6" />
      <path d="M474 740 H680" stroke="var(--screen-line)" />
      <text x="474" y="760" fontFamily={MONO} fontSize="11" fill="var(--screen-dim)">
        RECIBIDO EN NAVE 2
      </text>
    </g>
  )
})

function Tick({ x, y, color = 'var(--data-ok)', p = 1 }) {
  return <path d={`M${x - 8} ${y} l6 6 l12 -13`} fill="none" stroke={color} strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
}

function Scene({ film, narrow }) {
  const ids = { lectura: useSvgId('lectura') }
  const k = kOf(narrow)
  const { t, ease, between } = film

  // Plano 1: los documentos llegan a la bandeja
  const llegada = between(0.6, 6.4)
  const hojas = []
  for (let i = 0; i < 18; i++) {
    const f = FUENTES[i % 3]
    const t0 = 0.6 + i * 0.32
    const u = clamp((t - t0) / 1.1, 0, 1)
    if (u <= 0) continue
    const e = easeInOut(u)
    const [x, y] = bezier([f.x + 60, f.y], [f.x + 280, f.y], [BANDEJA.x - 260, BANDEJA.y - 60], [BANDEJA.x, BANDEJA.y - Math.min(i, 12) * 4], e)
    hojas.push({ i, x, y, rot: lerp(-14 + (i % 5) * 6, ((i * 37) % 9) - 4, e), llegada: u >= 1 })
  }
  const plano1 = 1 - ease(6.6, 7.6)

  // Plano 2: el albarán ampliado, la lectura y los campos que pasan a la ficha
  const plano2 = ease(7, 8) * (1 - ease(14.6, 15.4))
  const lectura = between(8.2, 10.4)
  const campoP = (i) => ease(10.2 + i * 0.6, 10.9 + i * 0.6)

  // Plano 3: el cruce con el pedido
  const plano3 = ease(15, 16) * (1 - ease(21.6, 22.4))
  const filaP = (i) => ease(16.2 + i * 0.7, 16.9 + i * 0.7)
  const revision = ease(19.4, 20.6)

  // Plano 4: el ERP y la cifra
  const plano4 = ease(22, 23)
  const erpP = (i) => ease(22.8 + i * 0.5, 23.4 + i * 0.5)

  // En pantalla estrecha cada plano tiene su encuadre (4:3), centrado en lo que cuenta
  const viewBox = useCamera(
    t,
    narrow
      ? [
          { at: 0, box: [60, 110, 960, 720] },
          { at: 6.8, box: [60, 110, 960, 720] },
          { at: 7.6, box: [420, 100, 1000, 750] },
          { at: 14.8, box: [420, 100, 1000, 750] },
          { at: 15.6, box: [150, -80, 1600, 1200] },
          { at: 21.8, box: [150, -80, 1600, 1200] },
          { at: 22.6, box: [90, 90, 1200, 900] },
          { at: 30, box: [90, 90, 1200, 900] },
        ]
      : [{ at: 0, box: [0, 0, W, H] }],
  )

  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={ids.lectura} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a79ae0" stopOpacity="0" />
          <stop offset="0.85" stopColor="#a79ae0" stopOpacity="0.28" />
          <stop offset="1" stopColor="#a79ae0" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <rect x="-200" y="-200" width={W + 400} height={H + 400} fill="#0f1215" />

      {/* Plano 1 */}
      {plano1 > 0 && (
        <g opacity={plano1}>
          <Rotulo x={120} y={150} k={k}>
            LO QUE ENTRA EL LUNES
          </Rotulo>
          {FUENTES.map((f) => (
            <g key={f.id}>
              <Icono id={f.id} x={f.x} y={f.y} />
              <text x={f.x} y={f.y + 56} textAnchor="middle" fontFamily={MONO} fontSize={13 * k} fill="var(--screen-dim)">
                {f.nombre}
              </text>
              <path d={`M${f.x + 60} ${f.y} C${f.x + 280} ${f.y} ${BANDEJA.x - 260} ${BANDEJA.y - 60} ${BANDEJA.x} ${BANDEJA.y}`} fill="none" stroke="var(--screen-line)" strokeDasharray="4 8" />
            </g>
          ))}
          <path d={`M${BANDEJA.x - 70} ${BANDEJA.y + 50} H${BANDEJA.x + 70} L${BANDEJA.x + 84} ${BANDEJA.y + 80} H${BANDEJA.x - 84} Z`} fill="none" stroke="var(--screen-draw)" strokeWidth="1.4" />
          <text x={BANDEJA.x} y={BANDEJA.y + 118} textAnchor="middle" fontFamily={MONO} fontSize={13 * k} fill="var(--screen-dim)">
            Bandeja de entrada
          </text>
          {hojas.map((h) => (
            <Hoja key={h.i} x={h.x} y={h.y} rot={h.rot} />
          ))}
          {!narrow && (
            <Nota x={1080} y={340} w={380} kicker="DOCUMENTOS ESTA SEMANA" valor={fmtInt(lerp(0, 146, llegada))} linea="albaranes, facturas y partes" color={C} progress={ventana(t, 1.5, 6.4, 0.6)} />
          )}
        </g>
      )}

      {/* Plano 2 */}
      {plano2 > 0 && (
        <g opacity={plano2}>
          <Albaran />
          {lectura > 0 && lectura < 1 && <rect x="440" y={150 + lectura * 600} width="460" height="40" fill={`url(#${ids.lectura})`} transform="translate(0 -40)" />}
          {CAMPOS.map((c, i) => {
            const p = campoP(i)
            if (p <= 0) return null
            const [x, y, w, h] = c.caja
            const fy = 220 + i * 78
            return (
              <g key={c.nombre}>
                <rect x={x} y={y} width={w} height={h} fill={C} fillOpacity={0.14 * p} stroke={C} strokeWidth="1.6" opacity={p} />
                <path d={`M${x + w} ${y + h / 2} C 960 ${y + h / 2}, 960 ${fy - 6}, 1010 ${fy - 6}`} fill="none" stroke={C} strokeWidth="1" opacity={0.6 * p} />
                <g opacity={p}>
                  <text x="1030" y={fy - 14} fontFamily={MONO} fontSize={12 * k} letterSpacing="1" fill="var(--screen-dim)">
                    {c.nombre.toUpperCase()}
                  </text>
                  <text x="1030" y={fy + 14} fontFamily={MONO} fontSize={19 * k} fill="var(--screen-text)">
                    {c.valor}
                  </text>
                  <path d={`M1030 ${fy + 28} H${1030 + 220 * p}`} stroke="var(--screen-line)" strokeWidth="3" />
                </g>
              </g>
            )
          })}
          <Rotulo x={1030} y={170} k={k} opacity={campoP(0)}>
            LEÍDO DEL DOCUMENTO
          </Rotulo>
        </g>
      )}

      {/* Plano 3 */}
      {plano3 > 0 && (
        <g opacity={plano3}>
          <Rotulo x={200} y={180} k={k}>
            ALBARÁN 25 004718
          </Rotulo>
          <Rotulo x={680} y={180} k={k}>
            PEDIDO 4471
          </Rotulo>
          {CRUCE.map((r, i) => {
            const p = filaP(i)
            const y = 260 + i * 110
            const color = r.ok ? 'var(--data-ok)' : 'var(--data-warn)'
            return (
              <g key={r.campo} opacity={p}>
                <rect x="190" y={y - 44} width="1030" height="84" fill={r.ok ? 'rgba(230,232,228,.03)' : 'rgba(250,178,25,.08)'} stroke={r.ok ? 'var(--screen-line)' : 'var(--data-warn)'} />
                <text x="210" y={y - 16} fontFamily={MONO} fontSize={12 * k} letterSpacing="1" fill="var(--screen-dim)">
                  {r.campo.toUpperCase()}
                </text>
                <text x="210" y={y + 16} fontFamily={MONO} fontSize={19 * k} fill="var(--screen-text)">
                  {r.albaran}
                </text>
                <text x="690" y={y + 16} fontFamily={MONO} fontSize={19 * k} fill="var(--screen-text)">
                  {r.pedido}
                </text>
                {r.ok ? (
                  <Tick x={1180} y={y} p={p} />
                ) : (
                  <g>
                    <circle cx="1180" cy={y} r="14" fill="none" stroke={color} strokeWidth="2.4" />
                    <path d={`M1180 ${y - 7} V${y + 2} M1180 ${y + 6} v1`} stroke={color} strokeWidth="2.6" strokeLinecap="round" />
                  </g>
                )}
              </g>
            )
          })}
          {/* La diferencia va a revisión de compras */}
          <g opacity={revision}>
            <path d={`M1220 480 C 1300 480, 1300 360, 1340 360`} fill="none" stroke="var(--data-warn)" strokeWidth="1.6" strokeDasharray="5 6" />
            <rect x="1340" y="300" width="220" height="140" fill="#0f1215" stroke="var(--data-warn)" />
            <g transform="translate(1380 352)" fill="none" stroke="var(--screen-text)" strokeWidth="1.6">
              <circle cx="0" cy="-10" r="9" />
              <path d="M-16 18 q16 -22 32 0" />
            </g>
            <text x="1408" y="346" fontFamily={MONO} fontSize={13 * k} fill="var(--screen-text)" {...HALO}>
              Compras
            </text>
            <text x="1360" y="400" fontFamily={MONO} fontSize={13 * k} fill="var(--screen-dim)">
              1.200 kg de más
            </text>
            <text x="1360" y="422" fontFamily={MONO} fontSize={13 * k} fill="var(--screen-dim)">
              revisar antes de pagar
            </text>
          </g>
        </g>
      )}

      {/* Plano 4 */}
      {plano4 > 0 && (
        <g opacity={plano4}>
          <Rotulo x={120} y={170} k={k}>
            ERP · DOCUMENTOS DE PROVEEDOR
          </Rotulo>
          {['Documento', 'Proveedor', 'Importe', 'Estado'].map((h, i) => (
            <text key={h} x={[120, 360, 700, 860][i]} y="226" fontFamily={MONO} fontSize={12 * k} letterSpacing="1" fill="var(--screen-dim)">
              {h.toUpperCase()}
            </text>
          ))}
          <path d="M120 240 H1060" stroke="var(--screen-dim)" />
          {ERP.map((r, i) => {
            const p = erpP(i)
            if (p <= 0) return null
            const y = 290 + i * 62
            const revisar = r[3] === 'En revisión'
            return (
              <g key={r[0]} opacity={p} transform={`translate(${lerp(-40, 0, p)} 0)`}>
                <text x="120" y={y} fontFamily={MONO} fontSize={16 * k} fill="var(--screen-text)">
                  {r[0]}
                </text>
                <text x="360" y={y} fontFamily={MONO} fontSize={16 * k} fill="var(--screen-text)">
                  {r[1]}
                </text>
                <text x="700" y={y} fontFamily={MONO} fontSize={16 * k} fill="var(--screen-text)" className="num">
                  {r[2]}
                </text>
                <circle cx="866" cy={y - 5} r="5" fill={revisar ? 'var(--data-warn)' : 'var(--data-ok)'} />
                <text x="882" y={y} fontFamily={MONO} fontSize={16 * k} fill="var(--screen-text)">
                  {r[3]}
                </text>
                <path d={`M120 ${y + 22} H1060`} stroke="var(--screen-line)" />
              </g>
            )
          })}
          {!narrow && (
            <Nota x={1120} y={290} w={380} kicker="LO QUE YA NO SE TECLEA" valor="38" unidad="h al mes" linea="y 1 de cada 9 va a revisión" color={C} progress={ventana(t, 25, 30, 0.8)} />
          )}
        </g>
      )}
    </svg>
  )
}

export default {
  id: 'procesos',
  label:
    'Albaranes y facturas entran por correo, foto y escáner a una bandeja. Un albarán se lee solo y sus campos pasan a una ficha, se cruza con su pedido, la cantidad no cuadra y va a revisión de compras, y el resto entra en el ERP contabilizado.',
  duration: 30,
  poster: 19,
  aspect: '16 / 9',
  aspectNarrow: '4 / 3',
  frame: {
    lugar: 'Administración · Compras',
    origen: 'Correo, móvil y escáner',
    reloj: (t) => (t < 7 ? 'Lunes 08:00' : t < 15 ? 'Lunes 08:01' : t < 22 ? 'Lunes 08:01' : 'Lunes 08:02'),
  },
  scenes: [
    { at: 0, title: 'Llegan los papeles', caption: 'Lunes, 08:00 · Entran los albaranes y facturas del fin de semana, por donde vengan.' },
    { at: 7, title: 'Se leen solos', caption: 'Cada documento se lee solo: proveedor, fecha, pedido, líneas e importe.' },
    { at: 15, title: 'Se cruzan con el pedido', caption: 'Casi todo cuadra. La cantidad no: va a compras con la diferencia ya señalada.' },
    { at: 22, title: 'Al ERP, sin teclear', caption: 'Lo que cuadra entra en el ERP. Nadie ha tecleado nada.' },
  ],
  Scene,
}
