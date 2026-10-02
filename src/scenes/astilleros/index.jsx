import { memo, useMemo } from 'react'
import { useCamera } from '../../components/film/Film.jsx'
import { useSvgId } from '../../lib/hooks.js'
import { createRng } from '../../lib/rng.js'
import { clamp, lerp } from '../../lib/svg.js'
import { fmtInt } from '../../lib/format.js'
import { Etiqueta, HALO, MONO, Nota, Rotulo, hm, kOf, relojPorTramos, ventana } from '../kit.jsx'

// Astilleros (GUIA.md, 9.6), primera versión. Un granelero en dique seco: se vacía el dique, un dron
// recorre el costado, el modelo segmenta lo que encuentra y el costado se despliega en plano con su
// presupuesto. Función pura de t.

const W = 1600
const H = 900
const SUELO = 760
const LINEA_AGUA = 560

// Costado del casco en coordenadas relativas: u a lo largo (0 proa, 1 popa), v en altura (0 cubierta, 1 quilla)
const CASCO = { x0: 230, x1: 1370, y0: 440, y1: 730 }
const enCasco = (u, v) => [lerp(CASCO.x0, CASCO.x1, u), lerp(CASCO.y0, CASCO.y1, v)]
const PLANO = { x0: 120, x1: 1480, y0: 150, y1: 410 }
const enPlano = (u, v) => [lerp(PLANO.x0, PLANO.x1, u), lerp(PLANO.y0, PLANO.y1, v)]

const CLASES = {
  oxido: { nombre: 'Óxido', color: 'var(--industria-s)', op: 0.78 },
  incrustacion: { nombre: 'Incrustaciones', color: 'var(--campo-s)', op: 0.62 },
  pintura: { nombre: 'Pintura degradada', color: 'var(--comercio-s)', op: 0.7 },
}

const PRESUPUESTO = [
  ['Chorreado Sa 2½', '1.240 m²'],
  ['Retoque y lijado', '380 m²'],
  ['Imprimación epoxi, 2 capas', '580 l'],
  ['Antiincrustante, 2 capas', '1.060 l'],
  ['Mano de obra', '410 h'],
  ['Días de dique', '6'],
]

function crearManchas() {
  const rng = createRng('casco')
  const manchas = []
  const forma = () => Array.from({ length: 8 }, (_, j) => [(j / 8) * Math.PI * 2 + rng.range(-0.25, 0.25), rng.range(0.62, 1.1)])
  for (let i = 0; i < 11; i++) manchas.push({ clase: 'oxido', u: rng.range(0.08, 0.9), v: rng.range(0.18, 0.88), r: rng.range(16, 38), forma: forma() })
  for (let i = 0; i < 9; i++) manchas.push({ clase: 'incrustacion', u: rng.range(0.07, 0.93), v: rng.range(0.44, 0.58), r: rng.range(22, 44), forma: forma(), achatada: true })
  for (let i = 0; i < 7; i++) manchas.push({ clase: 'incrustacion', u: rng.range(0.12, 0.88), v: rng.range(0.86, 0.95), r: rng.range(18, 36), forma: forma(), achatada: true })
  for (let i = 0; i < 6; i++) manchas.push({ clase: 'pintura', u: rng.range(0.1, 0.92), v: rng.range(0.1, 0.4), r: rng.range(18, 34), forma: forma() })
  return manchas.map((m, i) => ({ ...m, id: i }))
}

function manchaPath(cx, cy, m, escala = 1) {
  const ry = m.achatada ? 0.5 : 0.75
  return (
    m.forma
      .map(([a, k], i) => `${i ? 'L' : 'M'}${(cx + Math.cos(a) * m.r * k * escala).toFixed(1)} ${(cy + Math.sin(a) * m.r * k * ry * escala).toFixed(1)}`)
      .join(' ') + ' Z'
  )
}

// Recorrido del dron: cuatro pasadas a lo largo del costado, alternando sentido.
const PASADAS = [0.14, 0.38, 0.62, 0.86]
const VUELO = { a: 7.6, b: 15.4 }
function dron(t) {
  const p = clamp((t - VUELO.a) / (VUELO.b - VUELO.a), 0, 1) * PASADAS.length
  const i = Math.min(PASADAS.length - 1, Math.floor(p))
  const f = p - i
  const u = i % 2 ? 0.96 - f * 0.92 : 0.04 + f * 0.92
  const vPrev = PASADAS[Math.max(0, i - 1)]
  const v = f < 0.06 && i > 0 ? lerp(vPrev, PASADAS[i], f / 0.06) : PASADAS[i]
  return { u, v, p }
}
const FOTOS = 64
function fotos(t) {
  const out = []
  for (let n = 0; n < FOTOS; n++) {
    const tn = lerp(VUELO.a, VUELO.b, (n + 0.5) / FOTOS)
    if (tn > t) break
    const { u, v } = dron(tn)
    out.push({ n, u, v, edad: t - tn })
  }
  return out
}

const HULL = 'M172 432 L1402 420 L1388 600 Q1372 694 1290 735 L300 735 Q250 735 236 714 Q206 694 224 668 Q204 600 172 432 Z'

const Dique = memo(function Dique() {
  return (
    <g fill="none" stroke="var(--screen-draw)" strokeWidth="1.3">
      <path d={`M40 300 L40 ${SUELO} L1560 ${SUELO} L1560 300`} />
      <path d={`M40 360 H70 M40 450 H86 M40 560 H100 M1560 360 H1530 M1560 450 H1514 M1560 560 H1500`} stroke="var(--screen-line)" />
      {/* Picaderos bajo la quilla */}
      {Array.from({ length: 13 }, (_, i) => 330 + i * 76).map((x) => (
        <rect key={x} x={x} y={SUELO - 24} width="34" height="24" stroke="var(--screen-line)" />
      ))}
      {/* Grúa del dique al fondo */}
      <path d="M1460 300 L1460 120 L1180 120 M1460 150 L1300 120 M1430 300 L1490 300" stroke="var(--screen-line)" />
    </g>
  )
})

const Buque = memo(function Buque({ ids, textura }) {
  return (
    <g>
      {/* Obra viva: el rojo oscuro del antiincrustante, con incrustaciones en la línea de agua y en el fondo */}
      <g clipPath={`url(#${ids.casco})`}>
        <rect x="150" y={LINEA_AGUA} width="1280" height="200" fill="#2b1816" />
        <rect x="150" y={LINEA_AGUA} width="1280" height="200" fill={`url(#${ids.fouling})`} mask={`url(#${ids.bandas})`} opacity={textura} />
        {/* Regueros de óxido desde la cubierta y las escotillas */}
        {[310, 452, 618, 700, 905, 1062, 1180, 1300].map((x, i) => (
          <path
            key={x}
            d={`M${x} 436 q ${2 + (i % 3)} ${24 + i * 5} ${-1} ${40 + (i % 4) * 22}`}
            stroke="#8a4520"
            strokeWidth={1.5 + (i % 3)}
            fill="none"
            opacity={0.5 * textura}
          />
        ))}
      </g>
      <path d={HULL} fill="none" stroke="var(--screen-draw)" strokeWidth="1.5" />
      <path d={`M190 ${LINEA_AGUA} L1394 ${LINEA_AGUA}`} stroke="var(--screen-dim)" strokeDasharray="10 7" strokeWidth="1" />
      {/* Escotillas, grúas de cubierta y habilitación a popa */}
      <g fill="none" stroke="var(--screen-draw)" strokeWidth="1.3">
        {[330, 500, 670, 840, 1010].map((x) => (
          <rect key={x} x={x} y="404" width="140" height="22" />
        ))}
        {[480, 650, 820, 990].map((x) => (
          <path key={x} d={`M${x} 404 L${x} 330 L${x + 80} 270 M${x} 345 L${x + 70} 285`} />
        ))}
        <path d="M1222 420 L1222 300 L1372 300 L1372 420 M1210 300 L1384 300 M1222 340 H1372 M1222 380 H1372" />
        <path d="M1300 300 L1306 236 L1344 236 L1350 300" />
        {Array.from({ length: 6 }, (_, i) => 1236 + i * 22).map((x) => (
          <path key={x} d={`M${x} 316 h12 M${x} 356 h12`} stroke="var(--screen-line)" />
        ))}
      </g>
    </g>
  )
})

function Dron({ x, y, t }) {
  const blink = Math.floor(t * 4) % 2 === 0
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-26 -10 L26 10 M-26 10 L26 -10" stroke="var(--screen-text)" strokeWidth="2" />
      {[
        [-26, -10],
        [26, -10],
        [-26, 10],
        [26, 10],
      ].map(([a, b]) => (
        <ellipse key={`${a}${b}`} cx={a} cy={b} rx="15" ry="3.5" fill="rgba(230,232,228,.35)" />
      ))}
      <rect x="-9" y="-6" width="18" height="12" rx="3" fill="#0f1215" stroke="var(--screen-text)" strokeWidth="1.5" />
      <circle cx="0" cy="9" r="3" fill={blink ? 'var(--data-alert)' : 'var(--screen-dim)'} />
    </g>
  )
}

function Scene({ film, narrow }) {
  const ids = {
    casco: useSvgId('casco'),
    fouling: useSvgId('incrustacion'),
    foulTurb: useSvgId('turbcasco'),
    agua: useSvgId('agua'),
    rayas: useSvgId('rayas'),
    vistas: useSvgId('vistas'),
    bandas: useSvgId('bandas'),
    bandasGrad: useSvgId('bandasgrad'),
  }
  const k = kOf(narrow)
  const { t, ease, between } = film
  const manchas = useMemo(crearManchas, [])

  const agua = lerp(500, SUELO + 4, ease(0.6, 6.2))
  const d = dron(t)
  const fs = fotos(t)
  const dronPos = enCasco(d.u, d.v)
  const vuelo = ventana(t, VUELO.a - 0.4, VUELO.b, 0.6)
  const segmenta = ease(15.2, 17.4)
  const despliega = ease(22, 24.6)
  const buqueOp = 1 - ease(22, 23.4)
  const presupuesto = between(24, 27.6)
  const lineasVisibles = Math.floor(presupuesto * (PRESUPUESTO.length + 1.5))

  const viewBox = useCamera(
    t,
    narrow
      ? [
          { at: 0, box: [180, 240, 1040, 780] },
          { at: 21.8, box: [180, 240, 1040, 780] },
          { at: 24, box: [60, 110, 1000, 750] },
          { at: 30, box: [60, 110, 1000, 750] },
        ]
      : [
          { at: 0, box: [0, 0, W, H] },
          { at: 7, box: [0, 0, W, H] },
          { at: 9, box: [120, 230, 1300, 731] },
          { at: 15, box: [120, 230, 1300, 731] },
          { at: 16.5, box: [0, 0, W, H] },
          { at: 30, box: [0, 0, W, H] },
        ],
  )

  const oxido = manchas.filter((m) => m.clase === 'oxido')
  const destacadas = { oxido: oxido[3], incrustacion: manchas.find((m) => m.clase === 'incrustacion'), pintura: manchas.find((m) => m.clase === 'pintura') }

  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <clipPath id={ids.casco}>
          <path d={HULL} />
        </clipPath>
        <filter id={ids.foulTurb} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.09" numOctaves="3" seed="3" />
          <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.33  0 0 0 0 0.22  0 0 0 2.6 -1.05" />
        </filter>
        <pattern id={ids.fouling} patternUnits="userSpaceOnUse" width={W} height={H}>
          <rect width={W} height={H} filter={`url(#${ids.foulTurb})`} />
        </pattern>
        <linearGradient id={ids.bandasGrad} x1="0" y1={LINEA_AGUA} x2="0" y2="740" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="white" stopOpacity="1" />
          <stop offset="0.3" stopColor="white" stopOpacity="0.85" />
          <stop offset="0.55" stopColor="white" stopOpacity="0.2" />
          <stop offset="0.85" stopColor="white" stopOpacity="0.35" />
          <stop offset="1" stopColor="white" stopOpacity="0.9" />
        </linearGradient>
        <mask id={ids.bandas} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect x="150" y={LINEA_AGUA} width="1280" height="200" fill={`url(#${ids.bandasGrad})`} />
        </mask>
        <linearGradient id={ids.agua} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a5f8e" stopOpacity="0.55" />
          <stop offset="1" stopColor="#0f2a44" stopOpacity="0.85" />
        </linearGradient>
        <pattern id={ids.rayas} patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
          <rect width="10" height="10" fill="var(--comercio-s)" opacity="0.35" />
          <path d="M0 0 V10" stroke="var(--comercio-s)" strokeWidth="4" />
        </pattern>
        <mask id={ids.vistas} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect width={W} height={H} fill="black" />
          {fs.map((f) => {
            const [x, y] = enCasco(f.u, f.v)
            return <rect key={f.n} x={x - 60} y={y - 46} width="120" height="92" fill="white" />
          })}
        </mask>
      </defs>

      <rect width={W} height={H} fill="#0f1215" />

      {buqueOp > 0 && (
        <g opacity={buqueOp}>
          <Dique />
          <Buque ids={ids} textura={Math.round((1 - 0.75 * segmenta) * 50) / 50} />
          {/* El agua del dique baja y deja el casco en seco */}
          {agua < SUELO && <rect x="41" y={agua} width="1518" height={SUELO - agua} fill={`url(#${ids.agua})`} />}
          {agua < SUELO && <path d={`M41 ${agua} H1559`} stroke="#6fa8dc" strokeWidth="1.2" opacity="0.7" />}

          {/* Lo que el dron ya ha fotografiado se aclara un poco; cada foto destella al tomarse */}
          {fs.length > 0 && segmenta < 1 && (
            <g mask={`url(#${ids.vistas})`} opacity={1 - segmenta}>
              <path d={HULL} fill="rgba(230,232,228,.07)" />
            </g>
          )}
          {fs.map((f) => {
            if (f.edad > 0.9) return null
            const [x, y] = enCasco(f.u, f.v)
            return <rect key={f.n} x={x - 60} y={y - 46} width="120" height="92" fill="none" stroke="var(--screen-text)" strokeWidth="1.5" opacity={1 - f.edad / 0.9} />
          })}
          {vuelo > 0 && (
            <g opacity={vuelo}>
              <Dron x={dronPos[0]} y={dronPos[1] - 70} t={t} />
              <path d={`M${dronPos[0]} ${dronPos[1] - 58} L${dronPos[0] - 60} ${dronPos[1] - 46} L${dronPos[0] + 60} ${dronPos[1] - 46} Z`} fill="rgba(230,232,228,.08)" />
              <Rotulo x={CASCO.x0 + 10} y={CASCO.y0 - 70} k={k} dim={false}>
                FOTOS {fmtInt(fs.length * 5)}
              </Rotulo>
            </g>
          )}

          <Etiqueta x={300} y={650} lx={150} ly={820} texto="Obra viva" k={k} opacity={ventana(t, 4.6, 7.4)} />
          <Etiqueta x={710} y={SUELO - 12} lx={760} ly={835} texto="Picaderos" k={k} opacity={ventana(t, 5.2, 7.4)} />
        </g>
      )}

      {/* Segmentación sobre el casco, y después en el plano desplegado */}
      {segmenta > 0 && (
        <g>
          {manchas.map((m) => {
            const c = CLASES[m.clase]
            const [hx, hy] = enCasco(m.u, m.v)
            const [px, py] = enPlano(m.u, m.v)
            const x = lerp(hx, px, despliega)
            const y = lerp(hy, py, despliega)
            return (
              <path
                key={m.id}
                d={manchaPath(x, y, m, lerp(1, 0.9, despliega))}
                fill={m.clase === 'pintura' ? `url(#${ids.rayas})` : c.color}
                opacity={c.op * segmenta}
                stroke={c.color}
                strokeWidth="1"
              />
            )
          })}
          {/* Abolladura cerca de la proa, en curvas de nivel */}
          {[1, 0.66, 0.36].map((f) => {
            const [hx, hy] = enCasco(0.16, 0.62)
            const [px, py] = enPlano(0.16, 0.62)
            return (
              <ellipse
                key={f}
                cx={lerp(hx, px, despliega)}
                cy={lerp(hy, py, despliega)}
                rx={44 * f}
                ry={26 * f}
                fill="none"
                stroke="var(--screen-text)"
                strokeWidth="1.3"
                opacity={segmenta}
              />
            )
          })}
          {despliega < 0.05 &&
            ['oxido', 'incrustacion', 'pintura'].map((cl, i) => {
              const m = destacadas[cl]
              const [x, y] = enCasco(m.u, m.v)
              return (
                <Etiqueta
                  key={cl}
                  x={x}
                  y={y}
                  lx={[x + 70, x - 90, x + 80][i]}
                  ly={[CASCO.y1 + 60, CASCO.y0 - 120, CASCO.y0 - 60][i]}
                  anchor={i === 1 ? 'end' : 'start'}
                  texto={CLASES[cl].nombre}
                  k={k}
                  opacity={ventana(t, 16, 21.6) * (1 - despliega * 20)}
                />
              )
            })}
          {despliega < 0.05 && (
            <Etiqueta
              x={enCasco(0.16, 0.62)[0]}
              y={enCasco(0.16, 0.62)[1]}
              lx={120}
              ly={CASCO.y1 + 90}
              texto="Abolladura"
              k={k}
              opacity={ventana(t, 16.6, 21.6) * (1 - despliega * 20)}
            />
          )}
        </g>
      )}

      {/* Plano 4: el costado desplegado, con cuadernas y tracas, y el presupuesto */}
      {despliega > 0 && (
        <g opacity={despliega}>
          <rect x={PLANO.x0} y={PLANO.y0} width={PLANO.x1 - PLANO.x0} height={PLANO.y1 - PLANO.y0} fill="none" stroke="var(--screen-draw)" strokeWidth="1.4" />
          {Array.from({ length: 19 }, (_, i) => i + 1).map((i) => {
            const x = lerp(PLANO.x0, PLANO.x1, i / 20)
            return (
              <g key={i}>
                <path d={`M${x} ${PLANO.y0} V${PLANO.y1}`} stroke="var(--screen-line)" />
                {i % 2 === 0 && (
                  <text x={x} y={PLANO.y0 - 12} textAnchor="middle" fontFamily={MONO} fontSize={11 * k} fill="var(--screen-dim)">
                    {i * 10}
                  </text>
                )}
              </g>
            )
          })}
          {['A', 'B', 'C', 'D', 'E'].map((l, i) => {
            const y = lerp(PLANO.y0, PLANO.y1, (i + 0.5) / 5)
            return (
              <g key={l}>
                {i > 0 && <path d={`M${PLANO.x0} ${lerp(PLANO.y0, PLANO.y1, i / 5)} H${PLANO.x1}`} stroke="var(--screen-line)" />}
                <text x={PLANO.x0 - 14} y={y + 4} textAnchor="end" fontFamily={MONO} fontSize={11 * k} fill="var(--screen-dim)">
                  {l}
                </text>
              </g>
            )
          })}
          <Rotulo x={PLANO.x0} y={PLANO.y0 - 36} k={k}>
            COSTADO DE BABOR, DESPLEGADO · CUADERNAS Y TRACAS
          </Rotulo>
          <g transform={`translate(${PLANO.x0} 486)`}>
            {Object.entries(CLASES).map(([id, c], i) => (
              <g key={id} transform={`translate(${i * 250} 0)`}>
                <rect width="16" height="16" y="-12" fill={id === 'pintura' ? `url(#${ids.rayas})` : c.color} opacity={c.op} stroke={c.color} />
                <text x="26" y="2" fontFamily={MONO} fontSize={13 * k} fill="var(--screen-text)">
                  {c.nombre}
                </text>
              </g>
            ))}
          </g>
          <g transform={`translate(${PLANO.x0} 548)`}>
            {PRESUPUESTO.map(([concepto, cantidad], i) => {
              if (i >= lineasVisibles) return null
              const y = i * 40
              return (
                <g key={concepto}>
                  <path d={`M0 ${y + 14} H700`} stroke="var(--screen-line)" />
                  <text x="0" y={y} fontFamily={MONO} fontSize={16 * k} fill="var(--screen-dim)">
                    {concepto}
                  </text>
                  <text x="700" y={y} textAnchor="end" fontFamily={MONO} fontSize={17 * k} fill="var(--screen-text)" className="num">
                    {cantidad}
                  </text>
                </g>
              )
            })}
          </g>
          {!narrow && (
            <Nota
              x={1000}
              y={520}
              w={400}
              kicker="CHORREADO · COSTADO Y FONDO"
              valor="1.240"
              unidad="m²"
              linea={lineasVisibles > PRESUPUESTO.length ? 'Presupuesto listo a las 13:40' : 'calculando el presupuesto'}
              color="var(--mar-s)"
              progress={ventana(t, 25, 30, 0.8)}
            />
          )}
        </g>
      )}
    </svg>
  )
}

export default {
  id: 'astilleros',
  label:
    'Un granelero en dique seco. Se vacía el dique, un dron fotografía el costado en pasadas, el modelo marca óxido, incrustaciones, pintura degradada y una abolladura, y el costado se despliega en plano con su presupuesto de reparación.',
  duration: 30,
  poster: 19,
  aspect: '16 / 9',
  aspectNarrow: '4 / 3',
  frame: {
    lugar: 'Dique 2 · Granelero de 190 m',
    origen: 'Dron de inspección',
    reloj: relojPorTramos(
      [
        [0, hm(7, 30)],
        [7, hm(8, 10)],
        [15, hm(11, 20)],
        [22, hm(13, 30)],
        [30, hm(13, 40)],
      ],
      false,
    ),
  },
  scenes: [
    { at: 0, title: 'Entra en dique', caption: '07:30 · Se vacía el dique. Aparece la obra viva, con incrustaciones y óxido.' },
    { at: 7, title: 'El vuelo', caption: '08:10 · El dron recorre el costado en cuatro pasadas. Cada destello es una foto.' },
    { at: 15, title: 'Lo que encuentra', caption: '11:20 · El modelo separa óxido, incrustaciones, pintura degradada y una abolladura.' },
    { at: 22, title: 'El presupuesto', caption: '13:40 · El costado, desplegado en plano. Salen los metros y el presupuesto.' },
  ],
  Scene,
}
