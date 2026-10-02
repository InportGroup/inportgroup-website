import { memo, useMemo } from 'react'
import { useSvgId } from '../../lib/hooks.js'
import { createRng, noise1 } from '../../lib/rng.js'
import { clamp, easeInOut, lerp } from '../../lib/svg.js'
import { HALO, MONO, SERIF } from '../kit.jsx'

// Panorama de la portada (GUIA.md, 7.2). Un único paisaje de 7.200 unidades, del campo a la ciudad, que la
// cámara recorre mientras avanza el día. Se para en seis lugares, uno por caso de uso, y en cada uno aparece
// una anotación que baja a su caso. Todo a línea fina; el color solo donde pasa algo. Función pura de t.

export const W = 7200
const HZ = 640 // horizonte

export const PARADAS = [
  { id: 'cultivo', x: 760, ax: 900, ay: HZ - 112, llega: 0, sale: 4.5, etiqueta: 'Cultivos leñosos', frase: 'La yema, a 2,8 bajo cero', lugar: 'Finca de pistacheros', color: 'var(--campo-s)' },
  { id: 'cebo', x: 1330, ax: 1310, ay: HZ - 40, llega: 9.5, sale: 13.5, etiqueta: 'Ganadería', frase: 'Dos bajas, apuntadas sin cobertura', lugar: 'Nave de cebo', color: 'var(--campo-s)' },
  { id: 'obra', x: 2200, ax: 2190, ay: HZ - 236, llega: 18.5, sale: 22.5, etiqueta: 'Construcción', frase: 'La planta 4, una semana tarde', lugar: 'Obra residencial', color: 'var(--industria-s)' },
  { id: 'hornos', x: 3050, ax: 3050, ay: HZ - 100, llega: 27.5, sale: 31.5, etiqueta: 'Valorización energética', frase: 'La zona 3 del horno pide aire', lugar: 'Planta de valorización', color: 'var(--industria-s)' },
  { id: 'astilleros', x: 4150, ax: 4060, ay: HZ + 60, llega: 36.5, sale: 40.5, etiqueta: 'Astilleros', frase: 'El presupuesto de dique, listo', lugar: 'Dique seco', color: 'var(--mar-s)' },
  { id: 'boutique', x: 6260, ax: 6290, ay: HZ - 60, llega: 49.5, sale: 57, etiqueta: 'Retail', frase: 'Diez personas esperando', lugar: 'Boutique', color: 'var(--comercio-s)' },
]
export const DURACION = 60

/** Centro de la cámara en el mundo: se detiene en cada parada y viaja entre ellas con curva suave */
export function camara(t) {
  const P = PARADAS
  if (t <= P[0].sale) return P[0].x
  for (let i = 0; i < P.length - 1; i++) {
    const a = P[i]
    const b = P[i + 1]
    if (t <= b.llega) return lerp(a.x, b.x, easeInOut(clamp((t - a.sale) / (b.llega - a.sale), 0, 1)))
    if (t <= b.sale) return b.x
  }
  return P[P.length - 1].x
}

/** Parada en curso (la última a la que se ha llegado) */
export function paradaEn(t) {
  let i = 0
  for (let k = 0; k < PARADAS.length; k++) if (t >= PARADAS[k].llega - 2.5) i = k
  return i
}

/* ───────── Cielo según la hora del día ───────── */

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mezcla = (a, b, u) => {
  const A = hex(a)
  const B = hex(b)
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], u))).join(',')})`
}
const CIELO = [
  [0, '#0b0e1a', '#2b2542'],
  [0.12, '#141a2e', '#7a5560'],
  [0.3, '#16243a', '#53708c'],
  [0.55, '#172a42', '#65839f'],
  [0.74, '#1a2438', '#8d6c58'],
  [0.86, '#1a1830', '#b0583a'],
  [1, '#0a0d18', '#2a2238'],
]
function cielo(p) {
  for (let i = 0; i < CIELO.length - 1; i++) {
    const [p0, t0, h0] = CIELO[i]
    const [p1, t1, h1] = CIELO[i + 1]
    if (p <= p1) {
      const u = (p - p0) / (p1 - p0)
      return [mezcla(t0, t1, u), mezcla(h0, h1, u)]
    }
  }
  return [CIELO[CIELO.length - 1][1], CIELO[CIELO.length - 1][2]]
}

/* ───────── Capas lejanas (paralaje) ───────── */

// Ruido suave: interpola entre valores deterministas en una rejilla, con curva suave entre ellos
function suave(x) {
  const i = Math.floor(x)
  const f = x - i
  const u = f * f * (3 - 2 * f)
  return lerp(noise1(i * 1.37), noise1((i + 1) * 1.37), u)
}

function cordillera(seed, ancho, base, alto, paso) {
  // Empieza a la izquierda del mundo: con el paralaje, el principio de la capa no debe verse nunca
  let d = `M-2400 ${base}`
  for (let x = -2400; x <= ancho; x += paso) {
    const h = alto * (0.3 + 0.5 * suave(seed + x / 420) + 0.2 * suave(seed * 7 + x / 130))
    d += ` L${x} ${(base - h).toFixed(1)}`
  }
  return `${d} L${ancho} ${base} Z`
}

const Lejos = memo(function Lejos() {
  const d = useMemo(() => cordillera(11, W * 0.25 + 3000, HZ - 6, 240, 24), [])
  return <path d={d} fill="#161c28" fillOpacity="0.85" stroke="var(--screen-line)" strokeWidth="1.2" />
})

const Medio = memo(function Medio() {
  const d = useMemo(() => cordillera(5, W * 0.55 + 3000, HZ - 2, 110, 20), [])
  return <path d={d} fill="#131922" stroke="var(--screen-line)" strokeWidth="1.2" />
})

// Molinos de viento en la capa media, sobre las lomas del campo
function Molinos({ t }) {
  return (
    <g stroke="var(--screen-draw)" strokeWidth="1.4" fill="none">
      {[300, 470, 640].map((x, i) => {
        const y = HZ - 70 - i * 6
        const a = t * 0.9 + i * 1.3
        return (
          <g key={x}>
            <path d={`M${x} ${HZ - 4} L${x} ${y}`} />
            {[0, 1, 2].map((b) => {
              const ang = a + (b * Math.PI * 2) / 3
              return <path key={b} d={`M${x} ${y} L${(x + Math.cos(ang) * 34).toFixed(1)} ${(y + Math.sin(ang) * 34).toFixed(1)}`} />
            })}
          </g>
        )
      })}
    </g>
  )
}

/* ───────── Campo (0 a 1.750) ───────── */

const CampoFijo = memo(function CampoFijo() {
  const { troncos, copas } = useMemo(() => {
    let tr = ''
    let co = ''
    for (let r = 0; r < 4; r++) {
      const y = HZ + 26 + r * 36
      const s = 0.45 + r * 0.17
      for (let x = 40 + (r % 2) * 24; x < 1040; x += 52 * s + 18) {
        const xx = x + (noise1(x * 0.37 + r * 9) - 0.5) * 10
        tr += `M${xx.toFixed(1)} ${y} L${xx.toFixed(1)} ${(y - 14 * s).toFixed(1)} M${xx.toFixed(1)} ${(y - 14 * s).toFixed(1)} L${(xx - 10 * s).toFixed(1)} ${(y - 27 * s).toFixed(1)} M${xx.toFixed(1)} ${(y - 14 * s).toFixed(1)} L${(xx + 9 * s).toFixed(1)} ${(y - 28 * s).toFixed(1)} `
        const cy = y - 36 * s
        const rx = 22 * s
        const ry = 13 * s
        co += `M${(xx - rx).toFixed(1)} ${cy.toFixed(1)} a${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(2 * rx).toFixed(1)} 0 a${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(-2 * rx).toFixed(1)} 0 `
      }
    }
    return { troncos: tr, copas: co }
  }, [])
  return (
    <g fill="none" stroke="var(--screen-draw)" strokeLinecap="round">
      <path d={troncos} strokeWidth="1.2" />
      <path d={copas} strokeWidth="1.2" fill="#12171c" />
      {/* Garita */}
      <path d={`M280 ${HZ + 8} V${HZ - 46}`} strokeWidth="1.3" />
      <rect x="266" y={HZ - 64} width="28" height="18" fill="#12171c" strokeWidth="1.3" />
      {/* Poste de la cámara térmica */}
      <path d={`M900 ${HZ + 4} V${HZ - 112}`} strokeWidth="1.4" />
      <rect x="888" y={HZ - 122} width="24" height="13" rx="2" fill="#12171c" strokeWidth="1.3" />
      {/* Camino de tierra hasta la nave */}
      <path d={`M960 ${HZ + 70} C 1200 ${HZ + 40}, 1450 ${HZ + 34}, 1760 ${HZ + 30}`} stroke="var(--screen-line)" strokeDasharray="4 7" />
      {/* Nave de cebo con su cubierta a dos aguas y dos silos */}
      <rect x="1100" y={HZ - 64} width="440" height="64" fill="#12171c" strokeWidth="1.4" />
      <path d={`M1088 ${HZ - 64} L1320 ${HZ - 112} L1552 ${HZ - 64}`} strokeWidth="1.4" fill="#141a20" />
      {Array.from({ length: 11 }, (_, i) => 1118 + i * 38).map((x) => (
        <rect key={x} x={x} y={HZ - 50} width="18" height="9" stroke="var(--screen-line)" />
      ))}
      <rect x="1296" y={HZ - 36} width="40" height="36" strokeWidth="1.3" />
      {[1580, 1640].map((x) => (
        <g key={x} strokeWidth="1.3">
          <rect x={x} y={HZ - 128} width="44" height="128" fill="#12171c" />
          <path d={`M${x} ${HZ - 128} L${x + 22} ${HZ - 150} L${x + 44} ${HZ - 128}`} />
        </g>
      ))}
    </g>
  )
})

function CampoVivo({ t, p, enCultivo, enCebo, ids }) {
  // Ventilador antiheladas, niebla de la vaguada, dron, barrido térmico y camión de pienso
  const a = t * 11
  const niebla = clamp(1 - p * 5, 0, 1)
  const dron = [620 + 150 * Math.cos(t * 0.45), 430 + 18 * Math.sin(t * 0.9)]
  const camion = t < 9 ? lerp(1820, 1560, clamp((t - 4) / 5, 0, 1)) : 1560
  return (
    <g>
      {niebla > 0 && <ellipse cx="520" cy={HZ + 60} rx="520" ry="60" fill="#cde2fb" opacity={0.08 * niebla} filter={`url(#${ids.blur})`} />}
      {enCultivo > 0 && (
        <path d={`M900 ${HZ - 116} L560 ${HZ + 90} L1000 ${HZ + 120} Z`} fill={`url(#${ids.frio})`} opacity={enCultivo * (0.55 + 0.25 * Math.sin(t * 3))} />
      )}
      <g stroke="var(--screen-draw)" strokeWidth="1.4" fill="none">
        <path d={`M620 ${HZ + 10} V${HZ - 150}`} />
        <path d={`M${620 - 36 * Math.cos(a)} ${HZ - 150 - 4 * Math.sin(a)} L${620 + 36 * Math.cos(a)} ${HZ - 150 + 4 * Math.sin(a)}`} strokeWidth="2.4" />
      </g>
      <g transform={`translate(${dron[0]} ${dron[1]})`} stroke="var(--screen-text)" strokeWidth="1.5" fill="none">
        <path d="M-12 -4 L12 4 M-12 4 L12 -4" />
        <rect x="-4" y="-3" width="8" height="6" fill="#0f1215" />
      </g>
      <circle cx="900" cy={HZ - 116} r="3" fill={Math.floor(t * 2) % 2 ? 'var(--data-alert)' : 'var(--screen-dim)'} />
      {/* Camión de pienso */}
      <g transform={`translate(${camion} ${HZ + 22})`} stroke="var(--screen-draw)" strokeWidth="1.3" fill="#12171c">
        <rect x="0" y="-26" width="64" height="26" />
        <rect x="-26" y="-20" width="26" height="20" />
        <circle cx="-10" cy="2" r="5" />
        <circle cx="46" cy="2" r="5" />
      </g>
      {/* En la nave: el móvil del ganadero que se ilumina al volver la señal */}
      {enCebo > 0 && <rect x="1352" y={HZ - 20} width="8" height="13" rx="1.5" fill="var(--campo-s)" opacity={enCebo * (0.6 + 0.4 * Math.sin(t * 6))} />}
    </g>
  )
}

/* ───────── Industria (1.750 a 3.600) ───────── */

const IndustriaFijo = memo(function IndustriaFijo() {
  const pilares = []
  for (let k = 0; k <= 5; k++) pilares.push(1980 + k * 76)
  return (
    <g fill="none" stroke="var(--screen-draw)" strokeLinejoin="round">
      {/* Carretera */}
      <path d={`M1720 ${HZ + 72} H3640`} stroke="var(--screen-line)" strokeWidth="1.2" />
      <path d={`M1720 ${HZ + 102} H3640`} stroke="var(--screen-line)" strokeDasharray="26 22" />
      {/* Obra: cuatro forjados hechos y el quinto a medias */}
      {[1, 2, 3, 4].map((k) => (
        <path key={k} d={`M1970 ${HZ - k * 48} H2370`} strokeWidth="2.2" />
      ))}
      <path d={`M1970 ${HZ - 240} H2200`} strokeWidth="2.2" />
      <path d={`M2200 ${HZ - 240} H2370`} stroke="var(--screen-dim)" strokeDasharray="6 6" strokeWidth="1.4" />
      {pilares.map((x) => (
        <path key={x} d={`M${x} ${HZ} V${x < 2220 ? HZ - 240 : HZ - 192}`} strokeWidth="1.4" />
      ))}
      <path d={`M1950 ${HZ} H2390`} strokeWidth="1.4" />
      <path d={`M1940 ${HZ + 2} V${HZ - 22} M1940 ${HZ - 22} H2400 M2400 ${HZ + 2} V${HZ - 22}`} stroke="var(--screen-line)" />
      {/* Mástil de la grúa torre, en celosía */}
      <path d={`M2430 ${HZ} V${HZ - 380} M2452 ${HZ} V${HZ - 380}`} strokeWidth="1.4" />
      <path d={Array.from({ length: 19 }, (_, i) => `M2430 ${HZ - i * 20} L2452 ${HZ - i * 20 - 20}`).join(' ')} stroke="var(--screen-line)" />
      {/* Planta de valorización: foso, nave de hornos en dientes de sierra, calderas y chimenea */}
      <rect x="2640" y={HZ - 120} width="200" height="120" fill="#12171c" strokeWidth="1.4" />
      <path
        d={`M2840 ${HZ} V${HZ - 150} ${Array.from({ length: 6 }, (_, i) => `L${2840 + i * 70 + 50} ${HZ - 190} L${2840 + i * 70 + 70} ${HZ - 150}`).join(' ')} V${HZ}`}
        fill="#12171c"
        strokeWidth="1.4"
      />
      <rect x="3260" y={HZ - 300} width="120" height="300" fill="#12171c" strokeWidth="1.4" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={i} d={`M3274 ${HZ - 280 + i * 38} H3366`} stroke="var(--screen-line)" />
      ))}
      <path d={`M3418 ${HZ} L3424 ${HZ - 480} L3446 ${HZ - 480} L3452 ${HZ}`} fill="#12171c" strokeWidth="1.4" />
      <path d={`M2700 ${HZ - 120} L2860 ${HZ - 168}`} stroke="var(--screen-line)" strokeWidth="5" />
      <rect x="3038" y={HZ - 108} width="24" height="16" strokeWidth="1.2" />
    </g>
  )
})

function IndustriaVivo({ t, enObra, enHornos, suave }) {
  // Pluma de la grúa que gira (en alzado se acorta), humo de la chimenea, mirilla del horno, camión
  const th = 0.35 + 0.35 * Math.sin(t * 0.22)
  const L = 300 * Math.cos(th)
  const C = 90 * Math.cos(th)
  const yj = HZ - 380
  const carro = 2441 - L * 0.62
  const carga = yj + 170 + 20 * Math.sin(t * 0.5)
  const humo = []
  for (let k = 0; k < 6; k++) {
    const ph = (t * 0.07 + k / 6) % 1
    humo.push(<circle key={k} cx={3436 + ph * 300} cy={HZ - 490 - ph * 140} r={18 + ph * 80} fill="#cfd3d6" opacity={0.13 * (1 - ph)} />)
  }
  const camion = 1720 + ((t * 55) % 1940)
  const fuego = 0.55 + 0.3 * Math.sin(t * 9) + 0.15 * Math.sin(t * 23)
  return (
    <g>
      <g filter={`url(#${suave})`}>{humo}</g>
      <g stroke="var(--screen-draw)" strokeWidth="1.6" fill="none">
        <path d={`M${2441 - L} ${yj} H${2441 + C}`} strokeWidth="2.2" />
        <path d={`M2441 ${yj - 40} L${2441 - L} ${yj} M2441 ${yj - 40} L${2441 + C} ${yj}`} stroke="var(--screen-line)" />
        <path d={`M${carro} ${yj} V${carga}`} stroke="var(--screen-dim)" />
        <rect x={2441 + C - 30} y={yj} width="30" height="22" fill="#12171c" />
      </g>
      <rect x={carro - 16} y={carga} width="32" height="14" fill="var(--industria-s)" opacity="0.85" />
      {enObra > 0 && (
        <path d={`M2200 ${HZ - 240} H2370 V${HZ - 192}`} fill="none" stroke="var(--data-alert)" strokeWidth="2.6" strokeDasharray="6 6" opacity={enObra} />
      )}
      <rect x="3040" y={HZ - 106} width="20" height="12" fill="var(--fire-3)" opacity={(0.55 + 0.45 * enHornos) * fuego} />
      <g transform={`translate(${camion} ${HZ + 88})`} stroke="var(--screen-draw)" strokeWidth="1.3" fill="#12171c">
        <rect x="0" y="-28" width="80" height="28" />
        <rect x="80" y="-22" width="26" height="22" />
        <circle cx="16" cy="2" r="5" />
        <circle cx="90" cy="2" r="5" />
      </g>
    </g>
  )
}

/* ───────── Mar (3.600 a 5.550) ───────── */

const COLORES_CONT = ['#3b4b5c', '#5c3d34', '#3c5a4c', '#5a5236', '#46405e', '#2f4f63']

const MarFijo = memo(function MarFijo() {
  const contenedores = useMemo(() => {
    const rng = createRng('terminal')
    const out = []
    for (let c = 0; c < 8; c++) {
      const alto = rng.int(1, 4)
      for (let f = 0; f < alto; f++) out.push({ x: 4660 + c * 78, y: HZ - (f + 1) * 28, color: rng.pick(COLORES_CONT) })
    }
    return out
  }, [])
  return (
    <g fill="none" stroke="var(--screen-draw)" strokeLinejoin="round">
      {/* Mar en el horizonte */}
      <rect x="3600" y={HZ - 26} width="1960" height="26" fill="#13283f" stroke="none" />
      <path d={`M3600 ${HZ - 26} H5560`} stroke="var(--mar-s)" opacity="0.5" />
      {/* Dique seco: el foso, los picaderos y el granelero sobre ellos */}
      <rect x="3740" y={HZ} width="820" height="160" fill="#0c1014" strokeWidth="1.3" />
      {Array.from({ length: 9 }, (_, i) => 3880 + i * 66).map((x) => (
        <rect key={x} x={x} y={HZ + 138} width="26" height="22" stroke="var(--screen-line)" />
      ))}
      <path
        d={`M3780 ${HZ - 34} L4520 ${HZ - 38} L4508 ${HZ + 70} Q4490 ${HZ + 128} 4440 ${HZ + 136} L3880 ${HZ + 136} Q3846 ${HZ + 136} 3836 ${HZ + 120} Q3818 ${HZ + 104} 3834 ${HZ + 92} Q3808 ${HZ + 40} 3780 ${HZ - 34} Z`}
        fill="#13181d"
        strokeWidth="1.5"
      />
      <path d={`M3800 ${HZ + 40} L4512 ${HZ + 40}`} stroke="var(--screen-dim)" strokeDasharray="8 6" />
      {[3880, 3970, 4060, 4150, 4240].map((x) => (
        <rect key={x} x={x} y={HZ - 52} width="70" height="16" strokeWidth="1.2" />
      ))}
      <path d={`M4400 ${HZ - 38} V${HZ - 150} H4500 V${HZ - 38} M4440 ${HZ - 150} L4444 ${HZ - 192} L4470 ${HZ - 192} L4474 ${HZ - 150}`} strokeWidth="1.4" fill="#13181d" />
      {/* Grúa pórtico sobre el dique */}
      <path d={`M3722 ${HZ} V${HZ - 290} M4578 ${HZ} V${HZ - 290} M3710 ${HZ - 290} H4590`} strokeWidth="1.6" />
      {/* Terminal de contenedores y grúa de muelle */}
      {contenedores.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width="72" height="26" fill={c.color} fillOpacity="0.55" stroke="var(--screen-line)" />
      ))}
      <path d={`M5340 ${HZ} V${HZ - 250} M5420 ${HZ} V${HZ - 250} M5200 ${HZ - 280} L5560 ${HZ - 280} M5330 ${HZ - 250} L5430 ${HZ - 250} M5380 ${HZ - 340} L5200 ${HZ - 280} M5380 ${HZ - 340} L5560 ${HZ - 280} M5380 ${HZ - 340} V${HZ - 250}`} strokeWidth="1.5" />
    </g>
  )
})

function MarVivo({ t, enDique }) {
  // El dron recorre el costado en pasadas; cada foto destella. Un camión cruza la terminal.
  const u = (t * 0.09) % 1
  const fila = Math.floor(u * 3)
  const f = u * 3 - fila
  const dx = fila % 2 ? lerp(4460, 3900, f) : lerp(3900, 4460, f)
  const dy = HZ - 6 + fila * 46
  const flash = (t * 3) % 1 < 0.18
  const camion = 4620 + ((t * 70) % 760)
  return (
    <g>
      {enDique > 0 && (
        <g opacity={enDique}>
          {[0.18, 0.31, 0.47, 0.6, 0.74].map((k, i) => (
            <ellipse key={i} cx={lerp(3900, 4440, k)} cy={HZ + 52 + (i % 2) * 40} rx={26 + i * 3} ry="12" fill={i % 2 ? 'var(--industria-s)' : 'var(--campo-s)'} opacity="0.7" />
          ))}
        </g>
      )}
      <g transform={`translate(${dx} ${dy})`} stroke="var(--screen-text)" strokeWidth="1.5" fill="none">
        <path d="M-12 -4 L12 4 M-12 4 L12 -4" />
        <rect x="-4" y="-3" width="8" height="6" fill="#0f1215" />
      </g>
      {flash && <rect x={dx - 26} y={dy + 10} width="52" height="34" fill="none" stroke="var(--screen-text)" opacity="0.7" />}
      <g transform={`translate(${camion} ${HZ - 2})`} stroke="var(--screen-draw)" strokeWidth="1.2" fill="#12171c">
        <rect x="0" y="-22" width="70" height="22" fill="#5c3d34" fillOpacity="0.6" />
        <rect x="70" y="-18" width="22" height="18" />
      </g>
    </g>
  )
}

/* ───────── Ciudad (5.550 a 7.200) ───────── */

function edificios() {
  const rng = createRng('ciudad')
  const out = []
  let x = 5580
  while (x < 7200) {
    const w = rng.range(90, 170)
    const h = rng.range(170, 400)
    out.push({ x, w, h })
    x += w + rng.range(6, 22)
  }
  return out
}
const EDIF = edificios()
const VENTANAS = (() => {
  const v = []
  EDIF.forEach((e, ei) => {
    for (let y = HZ - e.h + 22; y < HZ - 130; y += 30) {
      for (let x = e.x + 14; x < e.x + e.w - 20; x += 26) v.push({ x, y, k: noise1(ei * 31.7 + x * 0.13 + y * 0.07) })
    }
  })
  return v
})()

const CiudadFijo = memo(function CiudadFijo() {
  return (
    <g fill="none" stroke="var(--screen-draw)" strokeLinejoin="round">
      {EDIF.map((e, i) => (
        <rect key={i} x={e.x} y={HZ - e.h} width={e.w} height={e.h} fill="#11161b" strokeWidth="1.2" />
      ))}
      {/* Boutique en el bajo, con toldo festoneado, dos escaparates y la puerta */}
      <rect x="6150" y={HZ - 120} width="280" height="120" fill="#13181d" strokeWidth="1.4" />
      <path d={`M6140 ${HZ - 118} H6440 ${Array.from({ length: 10 }, (_, i) => `M${6140 + i * 30} ${HZ - 100} q15 14 30 0`).join(' ')} M6140 ${HZ - 118} V${HZ - 100} M6440 ${HZ - 118} V${HZ - 100}`} strokeWidth="1.3" />
      <rect x="6276" y={HZ - 74} width="28" height="74" strokeWidth="1.3" />
      {/* Acera y calzada */}
      <path d={`M5560 ${HZ + 26} H7200`} strokeWidth="1.2" />
      <path d={`M5560 ${HZ + 100} H7200`} stroke="var(--screen-line)" strokeDasharray="26 22" />
      {Array.from({ length: 9 }, (_, i) => 5640 + i * 190).map((x) => (
        <path key={x} d={`M${x} ${HZ + 26} V${HZ - 130} q0 -14 22 -14`} strokeWidth="1.3" />
      ))}
    </g>
  )
})

// Peatones: caminan por la acera; algunos se paran ante el escaparate
const PEATONES = Array.from({ length: 12 }, (_, i) => ({
  x0: 5600 + noise1(i * 7.3) * 1600,
  v: (noise1(i * 3.1) > 0.5 ? 1 : -1) * (26 + noise1(i * 1.7) * 22),
  para: i % 3 === 0,
}))
function peaton(pe, t) {
  const span = 1600
  let x = pe.x0 + pe.v * t
  if (pe.para) {
    const stopX = 6220 + noise1(pe.x0) * 160
    const ts = (stopX - pe.x0) / pe.v
    const dur = 4
    if (ts > 0 && t > ts) x = t < ts + dur ? stopX : pe.x0 + pe.v * (t - dur)
  }
  x = 5600 + ((((x - 5600) % span) + span) % span)
  const parado = pe.para && Math.abs(x - (6220 + noise1(pe.x0) * 160)) < 0.5
  return { x, parado }
}

function CiudadVivo({ t, p, enBoutique }) {
  const encendidas = clamp((p - 0.7) / 0.22, 0, 1)
  let d = ''
  if (encendidas > 0) for (const v of VENTANAS) if (v.k < encendidas * 0.7) d += `M${v.x} ${v.y} h10 v14 h-10 Z `
  const escaparate = 0.35 + 0.65 * encendidas
  return (
    <g>
      {d && <path d={d} fill="#e9c98a" opacity="0.55" />}
      <rect x="6168" y={HZ - 84} width="98" height="70" fill="var(--comercio-s)" opacity={0.25 + 0.45 * escaparate} />
      <rect x="6314" y={HZ - 84} width="98" height="70" fill="var(--comercio-s)" opacity={0.25 + 0.45 * escaparate} />
      <polygon points={`6160,${HZ} 6420,${HZ} 6460,${HZ + 26} 6120,${HZ + 26}`} fill="var(--comercio-s)" opacity={0.18 * escaparate} />
      {encendidas > 0 &&
        Array.from({ length: 9 }, (_, i) => 5640 + i * 190).map((x) => (
          <polygon key={x} points={`${x + 22},${HZ - 140} ${x - 10},${HZ + 26} ${x + 54},${HZ + 26}`} fill="#e9c98a" opacity={0.08 * encendidas} />
        ))}
      {PEATONES.map((pe, i) => {
        const { x, parado } = peaton(pe, t)
        const paso = parado ? 0 : Math.sin(t * 7 + i) * 4
        return (
          <g key={i} transform={`translate(${x.toFixed(1)} ${HZ + 20})`} stroke={parado ? 'var(--comercio-s)' : 'var(--screen-text)'} strokeWidth="1.6" fill="none" strokeLinecap="round">
            <circle cx="0" cy="-30" r="4.5" />
            <path d={`M0 -25 V-11 M0 -11 L${-3 + paso} 0 M0 -11 L${3 - paso} 0 M-6 -21 L6 -20`} />
            {parado && enBoutique > 0 && <circle cx="0" cy="-16" r="22" stroke="var(--data-alert)" strokeWidth="1.4" opacity={enBoutique} />}
          </g>
        )
      })}
    </g>
  )
}

/* ───────── Anotaciones ───────── */

function Anotacion({ parada, cx, VW, k, narrow, i, visible }) {
  // Solo se ve la del lugar más cercano a la cámara: dos etiquetas a la vez se pisan
  const dist = Math.abs(cx - parada.x)
  const o = visible ? clamp(1 - (dist - 60) / 300, 0, 1) : 0
  if (o <= 0) return null
  // En pantalla estrecha la nota ocupa el ancho del encuadre, con margen, para no salirse
  const ancho = narrow ? VW - 48 : 470 * k
  const alto = 128 * k
  const yLabel = narrow ? 150 : 160 + (i % 2) * 34
  // Posición en pantalla del ancla y de la etiqueta (la etiqueta no se sale del encuadre)
  const sx = VW / 2 + (parada.ax - cx)
  let lx = sx - ancho / 2 + (narrow ? 0 : 140)
  lx = clamp(lx, 24, VW - ancho - 24)
  const ly = yLabel
  const pulso = 6 + 4 * Math.sin(i + cx * 0.01)
  return (
    <a href={`#${parada.id}`} opacity={o} tabIndex={-1}>
      <circle cx={sx} cy={parada.ay} r={pulso + 8} fill="none" stroke={parada.color} strokeWidth="2" />
      <circle cx={sx} cy={parada.ay} r="5" fill={parada.color} />
      <path d={`M${sx} ${parada.ay - 14} L${sx} ${ly + alto}`} stroke="var(--screen-dim)" strokeWidth="1.2" />
      <rect x={lx} y={ly} width={ancho} height={alto} fill="#0f1215" fillOpacity="0.88" stroke="var(--screen-line)" />
      <rect x={lx} y={ly} width="4" height={alto} fill={parada.color} />
      <text x={lx + 24 * k} y={ly + 34 * k} fontFamily={MONO} fontSize={15 * k} letterSpacing="1.5" fill="var(--screen-dim)">
        CASO DE USO · {parada.etiqueta.toUpperCase()}
      </text>
      <text x={lx + 22 * k} y={ly + 74 * k} fontFamily={SERIF} fontStyle="italic" fontWeight="300" fontSize={30 * k} fill="var(--screen-text)">
        {parada.frase}
      </text>
      <text x={lx + 24 * k} y={ly + 108 * k} fontFamily={MONO} fontSize={15 * k} fill="var(--screen-text)" textDecoration="underline">
        Ver el caso
      </text>
    </a>
  )
}

/* ───────── Escena ───────── */

function Scene({ film, narrow }) {
  const ids = { blur: useSvgId('niebla'), frio: useSvgId('frio'), sol: useSvgId('sol'), suave: useSvgId('humo') }
  const { t } = film
  const k = narrow ? 1.35 : 1
  // Encuadre: el horizonte queda hacia las tres cuartas partes de la altura; el suelo no se come la imagen
  const VW = narrow ? 640 : 1840
  const VH = narrow ? 800 : 700
  const VY = 120
  const cx = camara(t)
  const p = clamp((cx - 500) / 5900, 0, 1)
  const [arriba, horizonte] = cielo(p)
  const capa = (f) => `translate(${(VW / 2 - cx * f).toFixed(1)} 0)`

  // Sol de día y luna de noche, en coordenadas de pantalla
  const u = clamp((p - 0.06) / 0.82, 0, 1)
  const sol = { x: VW * (0.1 + 0.8 * u), y: HZ - 30 - Math.sin(u * Math.PI) * (HZ - 230) }
  const solOp = clamp(Math.min(u * 6, (1 - u) * 6), 0, 1)
  const estrellas = clamp(Math.max(1 - p * 8, (p - 0.88) * 8), 0, 1)
  const cerca = (id) => {
    const q = PARADAS.find((pp) => pp.id === id)
    return clamp(1 - Math.abs(cx - q.x) / 500, 0, 1)
  }
  const masCercana = PARADAS.reduce((best, pp, i) => (Math.abs(cx - pp.x) < Math.abs(cx - PARADAS[best].x) ? i : best), 0)
  const fundido = Math.max(clamp((t - 57.4) / 1.6, 0, 1), clamp(1 - t / 1.2, 0, 1))

  const est = useMemo(() => {
    const rng = createRng('estrellas')
    return Array.from({ length: 90 }, () => [rng.range(0, 2400), rng.range(VY, 470), rng.range(0.6, 1.7)])
  }, [VY])

  return (
    <svg viewBox={`0 ${VY} ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={ids.sol + 'c'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={arriba} />
          <stop offset="1" stopColor={horizonte} />
        </linearGradient>
        <radialGradient id={ids.sol}>
          <stop offset="0" stopColor="#fff3dc" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff3dc" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={ids.frio} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9ec5f4" stopOpacity="0.05" />
          <stop offset="1" stopColor="#6da7ec" stopOpacity="0.45" />
        </linearGradient>
        <filter id={ids.blur} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <filter id={ids.suave} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      <rect x="0" y={VY} width={VW} height={HZ - VY + 4} fill={`url(#${ids.sol}c)`} />
      {estrellas > 0 && (
        <g opacity={estrellas}>
          {est.map(([x, y, r], i) => (x < VW ? <circle key={i} cx={x} cy={y} r={r} fill="#e6e4de" opacity="0.6" /> : null))}
        </g>
      )}
      {solOp > 0 && (
        <g opacity={solOp}>
          <circle cx={sol.x} cy={sol.y} r="130" fill={`url(#${ids.sol})`} />
          <circle cx={sol.x} cy={sol.y} r="24" fill="#f6ead2" opacity="0.9" />
        </g>
      )}
      {p > 0.9 && <circle cx={VW * 0.78} cy={VY + 150} r="18" fill="#efe9da" opacity={clamp((p - 0.9) * 10, 0, 0.9)} />}

      <g transform={capa(0.25)}>
        <Lejos />
      </g>
      <g transform={capa(0.55)}>
        <Medio />
        <Molinos t={t} />
      </g>

      <g transform={capa(1)}>
        <rect x="-200" y={HZ} width={W + 400} height={1000 - HZ} fill="#10151a" />
        <path d={`M-200 ${HZ} H${W + 200}`} stroke="var(--screen-draw)" strokeWidth="1.2" />
        <CampoFijo />
        <CampoVivo t={t} p={p} enCultivo={cerca('cultivo')} enCebo={cerca('cebo')} ids={ids} />
        <IndustriaFijo />
        <IndustriaVivo t={t} enObra={cerca('obra')} enHornos={cerca('hornos')} suave={ids.suave} />
        <MarFijo />
        <MarVivo t={t} enDique={cerca('astilleros')} />
        <CiudadFijo />
        <CiudadVivo t={t} p={p} enBoutique={cerca('boutique')} />
      </g>

      {PARADAS.map((pp, i) => (
        <Anotacion key={pp.id} parada={pp} cx={cx} VW={VW} k={k} narrow={narrow} i={i} visible={i === masCercana} />
      ))}

      {fundido > 0 && <rect x="0" y={VY} width={VW} height={VH} fill="#0f1215" opacity={fundido} />}
    </svg>
  )
}

export default {
  id: 'panorama',
  label:
    'Un paisaje continuo que la cámara recorre mientras avanza el día: una finca de pistacheros de madrugada, una nave de cebo, una obra con su grúa, una planta de valorización con su chimenea, un dique seco con un granelero y, al anochecer, una calle con una boutique iluminada.',
  duration: DURACION,
  poster: 38,
  aspect: '21 / 8',
  aspectNarrow: '4 / 5',
  frame: { lugar: 'Casos de uso', origen: 'Panorama', reloj: (t) => PARADAS[paradaEn(t)].etiqueta },
  scenes: PARADAS.map((pp) => ({ at: pp.llega, title: pp.etiqueta, caption: pp.frase })),
  Scene,
}
