// Piezas comunes de las escenas (GUIA.md, sección 5): etiquetas de ingeniero con halo, notas con cifra
// grande, reloj por tramos y utilidades de trazado. Todo se dibuja en función de t, sin estado.

import { lerp } from '../lib/svg.js'

/** Halo oscuro detrás del texto para que se lea sobre el dibujo */
export const HALO = { paintOrder: 'stroke', stroke: '#0f1215', strokeWidth: 5, strokeLinejoin: 'round' }

export const MONO = 'var(--font-mono)'
export const SERIF = 'var(--font-display)'

/** Factor de tamaño de los textos del SVG: en pantalla estrecha crecen para no bajar de unos 11 px reales */
export const kOf = (narrow) => (narrow ? 1.7 : 1)

export const hm = (h, m = 0, s = 0) => h * 3600 + m * 60 + s

/**
 * Reloj por tramos para el cajetín, para que diga lo mismo que los subtítulos.
 * horas: [[t, segundos desde medianoche], ...] ordenados por t.
 */
export function relojPorTramos(horas, conSegundos = true) {
  return (t) => {
    let sec = horas[horas.length - 1][1]
    for (let i = 0; i < horas.length - 1; i++) {
      const [t0, s0] = horas[i]
      const [t1, s1] = horas[i + 1]
      if (t <= t1) {
        sec = lerp(s0, s1, Math.max(0, (t - t0) / Math.max(0.0001, t1 - t0)))
        break
      }
    }
    const h = Math.floor(sec / 3600) % 24
    const m = Math.floor((sec % 3600) / 60)
    const s = Math.floor(sec % 60)
    return (conSegundos ? [h, m, s] : [h, m]).map((v) => String(v).padStart(2, '0')).join(':')
  }
}

/** Polilínea "M x y L x y ..." a partir de puntos [[x, y], ...] */
export function linea(points) {
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
}

/** Punto de una curva cúbica de Bézier en u (0..1) */
export function bezier(p0, p1, p2, p3, u) {
  const v = 1 - u
  return [
    v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0],
    v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1],
  ]
}

/** Etiqueta de ingeniero: círculo en el punto, línea guía y texto en mono con halo */
export function Etiqueta({ x, y, lx, ly, texto, k = 1, opacity = 1, dim = false, anchor = 'start', size = 15 }) {
  if (opacity <= 0) return null
  const end = anchor === 'end' ? lx - 8 : lx + 8
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={4.5} fill="none" stroke="var(--screen-text)" strokeWidth="1.2" />
      <path d={`M${x} ${y} L${lx} ${ly}`} fill="none" stroke="var(--screen-dim)" strokeWidth="1" />
      <text
        x={end}
        y={ly + 5 * k}
        textAnchor={anchor}
        fontFamily={MONO}
        fontSize={size * k}
        fill={dim ? 'var(--screen-dim)' : 'var(--screen-text)'}
        {...HALO}
      >
        {texto}
      </text>
    </g>
  )
}

/** Rótulo suelto en mono con halo */
export function Rotulo({ x, y, children, k = 1, size = 14, dim = true, anchor = 'start', opacity = 1, spacing = 1.2 }) {
  if (opacity <= 0) return null
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily={MONO}
      fontSize={size * k}
      letterSpacing={spacing}
      fill={dim ? 'var(--screen-dim)' : 'var(--screen-text)'}
      opacity={opacity}
      {...HALO}
    >
      {children}
    </text>
  )
}

/**
 * Nota con cifra grande, como una anotación en el plano: fondo oscuro, kicker en mono, cifra en serif,
 * trazo del color del sector y una línea de contexto.
 */
export function Nota({ x, y, w = 360, kicker, valor, unidad, linea: texto, color = 'var(--screen-text)', progress = 1, k = 1 }) {
  if (progress <= 0) return null
  const s = k > 1 ? 1.25 : 1
  const h = (texto ? 190 : 150) * s
  return (
    <g opacity={Math.min(1, progress * 1.4)} transform={`translate(${x} ${y})`}>
      <rect width={w * s} height={h} fill="#0f1215" fillOpacity="0.86" stroke="var(--screen-line)" />
      <text x={22 * s} y={34 * s} fontFamily={MONO} fontSize={13 * s} letterSpacing="1.5" fill="var(--screen-dim)">
        {kicker}
      </text>
      <text x={18 * s} y={110 * s} fontFamily={SERIF} fontWeight="300" fontSize={80 * s} fill="var(--screen-text)" className="num">
        {valor}
      </text>
      {unidad && (
        <text x={(30 + String(valor).length * 44) * s} y={108 * s} fontFamily={SERIF} fontStyle="italic" fontWeight="300" fontSize={27 * s} fill="var(--screen-text)">
          {unidad}
        </text>
      )}
      <path d={`M${22 * s} ${128 * s} H${22 * s + lerp(0, (w - 44) * s, Math.min(1, progress))}`} stroke={color} strokeWidth="3" />
      {texto && (
        <text x={22 * s} y={164 * s} fontFamily={MONO} fontSize={14 * s} fill="var(--screen-dim)">
          {texto}
        </text>
      )}
    </g>
  )
}

/** Opacidad que entra en [a, a + f] y sale en [b, b + f] */
export function ventana(t, a, b, f = 0.8) {
  if (t < a || t > b + f) return 0
  return Math.min(1, (t - a) / f, (b + f - t) / f)
}
