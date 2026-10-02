// Conversión de coordenadas entre el ratón, el SVG y el contenedor HTML (para tooltips).

/** Punto del ratón (clientX, clientY) a coordenadas del viewBox del SVG */
export function clientToSvg(svg, clientX, clientY) {
  if (!svg) return { x: 0, y: 0 }
  const pt = svg.createSVGPoint()
  pt.x = clientX
  pt.y = clientY
  const ctm = svg.getScreenCTM()
  if (!ctm) return { x: 0, y: 0 }
  const p = pt.matrixTransform(ctm.inverse())
  return { x: p.x, y: p.y }
}

/** Punto del viewBox del SVG a píxeles relativos a un contenedor HTML (por ejemplo, el Stage) */
export function svgToContainer(svg, container, x, y) {
  if (!svg || !container) return { x: 0, y: 0 }
  const pt = svg.createSVGPoint()
  pt.x = x
  pt.y = y
  const ctm = svg.getScreenCTM()
  if (!ctm) return { x: 0, y: 0 }
  const p = pt.matrixTransform(ctm)
  const box = container.getBoundingClientRect()
  return { x: p.x - box.left, y: p.y - box.top }
}

/** Punto del ratón a píxeles relativos a un contenedor */
export function clientToContainer(container, clientX, clientY) {
  if (!container) return { x: 0, y: 0 }
  const box = container.getBoundingClientRect()
  return { x: clientX - box.left, y: clientY - box.top }
}

/** Interpolación lineal y utilidades de animación */
export const lerp = (a, b, t) => a + (b - a) * t
export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v))
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeOut = (t) => 1 - Math.pow(1 - t, 3)

/** Arco SVG (sector de anillo) entre dos ángulos en radianes */
export function arcPath(cx, cy, r0, r1, a0, a1) {
  const large = a1 - a0 > Math.PI ? 1 : 0
  const p = (r, a) => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
  return `M${p(r1, a0)} A${r1},${r1} 0 ${large} 1 ${p(r1, a1)} L${p(r0, a1)} A${r0},${r0} 0 ${large} 0 ${p(r0, a0)} Z`
}
