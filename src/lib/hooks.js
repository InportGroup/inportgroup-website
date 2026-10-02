import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'

/** true mientras el elemento está (o casi está) en pantalla */
export function useInView(ref, { rootMargin = '160px 0px', threshold = 0, once = false } = {}) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) io.disconnect()
      },
      { rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin, threshold, once])
  return inView
}

const motionQuery =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null

function subscribeMotion(cb) {
  motionQuery?.addEventListener?.('change', cb)
  return () => motionQuery?.removeEventListener?.('change', cb)
}

/** true si el usuario ha pedido movimiento reducido */
export function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, () => Boolean(motionQuery?.matches), () => false)
}

/**
 * Bucle de animación con requestAnimationFrame.
 * callback(dt en segundos, tiempo total en segundos). Solo corre si `active`.
 */
export function useRaf(callback, active = true) {
  const cb = useRef(callback)
  cb.current = callback
  useEffect(() => {
    if (!active) return undefined
    let raf = 0
    let last = performance.now()
    let total = 0
    const loop = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      total += dt
      cb.current(dt, total)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active])
}

/**
 * Para visuales animados: solo corren en pantalla y sin movimiento reducido.
 * Devuelve { ref, inView, reduced, active }. Coloque `ref` en el contenedor del visual.
 */
export function useLiveVisual(options) {
  const ref = useRef(null)
  const inView = useInView(ref, options)
  const reduced = useReducedMotion()
  return { ref, inView, reduced, active: inView && !reduced }
}

/** Id único y seguro para referencias SVG url(#id) */
export function useSvgId(prefix = 'sv') {
  const raw = useId()
  return `${prefix}${raw.replace(/[^a-zA-Z0-9_]/g, '')}`
}

/** Tamaño de un elemento (ancho y alto) que se actualiza al redimensionar */
export function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize((s) => (s.width === width && s.height === height ? s : { width, height }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

/** true en pantallas estrechas (por defecto, 760 px o menos) */
export function useIsNarrow(maxWidth = 760) {
  const query = `(max-width: ${maxWidth}px)`
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
