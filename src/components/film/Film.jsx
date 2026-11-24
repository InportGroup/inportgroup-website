import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from '../../lib/hooks.js'
import { clamp, easeInOut } from '../../lib/svg.js'

// Reloj de las escenas: cada una es un vídeo corto dibujado en SVG que arranca solo al verse en pantalla,
// avanza por planos con subtítulo, hace bucle y se puede pausar o arrastrar.
// El primer fotograma es siempre t = 0; el movimiento reducido se aplica al montar.

/**
 * duration en segundos. scenes: [{ at, caption }] ordenadas por `at`.
 * poster: segundo que se muestra quieto con movimiento reducido, hasta que alguien pulse reproducir.
 */
export function useFilm({ duration, scenes = [], poster = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { rootMargin: '0px', threshold: 0.15 })
  const reduced = useReducedMotion()
  const [t, setT] = useState(0)
  const [wantsPlay, setWantsPlay] = useState(true)
  const [manual, setManual] = useState(false)
  const tRef = useRef(0)

  const playing = inView && wantsPlay && (!reduced || manual)

  useEffect(() => {
    if (!reduced || manual) return
    tRef.current = poster
    setT(poster)
  }, [reduced, manual, poster])

  useEffect(() => {
    if (!playing) return undefined
    let raf = 0
    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min(0.08, (now - last) / 1000)
      last = now
      tRef.current = (tRef.current + dt) % duration
      setT(tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, duration])

  const seek = useCallback(
    (value) => {
      tRef.current = clamp(value, 0, duration)
      setT(tRef.current)
    },
    [duration],
  )

  const toggle = useCallback(() => {
    setManual(true)
    setWantsPlay((p) => !p)
  }, [])

  let sceneIndex = 0
  for (let i = 0; i < scenes.length; i++) if (t >= scenes[i].at) sceneIndex = i

  /** Progreso 0..1 de t entre a y b (lineal) */
  const between = (a, b) => clamp((t - a) / Math.max(0.0001, b - a))
  /** Progreso 0..1 de t entre a y b con curva suave */
  const ease = (a, b) => easeInOut(between(a, b))

  return { ref, t, duration, playing, toggle, seek, scene: scenes[sceneIndex] || null, sceneIndex, between, ease }
}

/**
 * Movimiento de cámara sobre el viewBox. keyframes: [{ at, box: [x, y, w, h] }] ordenados por `at`.
 * Entre fotogramas clave interpola con curva suave. Devuelve la cadena para viewBox.
 */
export function useCamera(t, keyframes) {
  return cameraBox(t, keyframes).join(' ')
}

function cameraBox(t, keyframes) {
  if (!keyframes.length) return [0, 0, 1600, 900]
  if (t <= keyframes[0].at) return keyframes[0].box
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i]
    const b = keyframes[i + 1]
    if (t >= a.at && t <= b.at) {
      const u = easeInOut(clamp((t - a.at) / Math.max(0.0001, b.at - a.at)))
      return a.box.map((v, k) => v + (b.box[k] - v) * u)
    }
  }
  return keyframes[keyframes.length - 1].box
}
