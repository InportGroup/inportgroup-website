import { useEffect, useId, useState, useSyncExternalStore } from 'react'

/** true mientras el elemento está (o casi está) en pantalla */
export function useInView(ref, { rootMargin = '160px 0px', threshold = 0 } = {}) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return undefined
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin, threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin, threshold])
  return inView
}

const motionQuery = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null

function subscribeMotion(cb) {
  motionQuery?.addEventListener?.('change', cb)
  return () => motionQuery?.removeEventListener?.('change', cb)
}

/** true si el usuario ha pedido movimiento reducido */
export function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, () => Boolean(motionQuery?.matches), () => false)
}

/** Id único y seguro para referencias SVG url(#id) */
export function useSvgId(prefix = 'sv') {
  const raw = useId()
  return `${prefix}${raw.replace(/[^a-zA-Z0-9_]/g, '')}`
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
