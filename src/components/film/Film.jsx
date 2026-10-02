import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from '../../lib/hooks.js'
import s from './Film.module.css'

// Cada escena de la web es una pieza de vídeo hecha en SVG: arranca sola al entrar en pantalla,
// avanza por planos con subtítulos y movimientos de cámara, hace bucle y se puede pausar o arrastrar.
// Motor traído de InLux (Film.jsx) y adaptado al prerenderizado: el primer fotograma es siempre t = 0,
// igual en el HTML estático y en el navegador; la URL y el movimiento reducido se aplican al montar.
//
// const film = useFilm({ duration: 48, scenes: [{ at: 0, title: 'La parrilla', caption: '11:40 · Entra residuo' }] })
// const viewBox = useCamera(film.t, [{ at: 0, box: [0, 0, 1600, 900] }, { at: 16, box: [400, 200, 800, 450] }])

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Para revisar un fotograma: ?t=12&freeze=1 salta al segundo 12 y lo congela.
function readUrl() {
  const q = new URLSearchParams(window.location.search)
  const t = q.has('t') ? Number(q.get('t')) : null
  return { t: Number.isFinite(t) ? t : null, freeze: q.has('freeze') }
}

/**
 * Reloj de una escena viva.
 * duration en segundos. scenes: [{ at, title, caption }] ordenadas por `at`.
 * poster: segundo que se muestra quieto con movimiento reducido.
 * loop: vuelve a empezar al terminar. Si loop es false y hay onEnd, se llama al terminar.
 * readQuery: si es true, atiende a ?t= y ?freeze de la URL (solo una escena por página debería hacerlo).
 */
export function useFilm({ duration, scenes = [], loop = true, autoplay = true, poster = null, rootMargin = '0px 0px', onEnd = null, resetKey = null, readQuery = false } = {}) {
  const ref = useRef(null)
  const inView = useInView(ref, { rootMargin, threshold: 0.15 })
  const reduced = useReducedMotion()
  const posterAt = poster ?? (scenes.length > 1 ? scenes[1].at : 0)
  const [t, setT] = useState(0)
  const [wantsPlay, setWantsPlay] = useState(autoplay)
  const [manual, setManual] = useState(false)
  const [fromUrl, setFromUrl] = useState(false)
  const [speed, setSpeed] = useState(1)
  const tRef = useRef(t)
  tRef.current = t
  const onEndRef = useRef(onEnd)
  onEndRef.current = onEnd
  const endedRef = useRef(false)

  // Con movimiento reducido solo se reproduce si la persona pulsa reproducir.
  const playing = inView && wantsPlay && (!reduced || manual)

  // Al montar: la URL manda sobre todo lo demás.
  useEffect(() => {
    if (!readQuery) return
    const q = readUrl()
    if (q.t != null) {
      const v = Math.min(q.t, duration)
      tRef.current = v
      setT(v)
      setFromUrl(true)
    }
    if (q.freeze) setWantsPlay(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (reduced && !manual && !fromUrl) {
      tRef.current = posterAt
      setT(posterAt)
    }
  }, [reduced, manual, fromUrl, posterAt])

  useEffect(() => {
    if (!playing) return undefined
    let raf = 0
    let last = performance.now()
    const loopFn = (now) => {
      const dt = Math.min(0.08, (now - last) / 1000) * speed
      last = now
      let next = tRef.current + dt
      if (next >= duration) {
        if (loop) next %= duration
        else {
          next = duration
          if (onEndRef.current) {
            if (!endedRef.current) {
              endedRef.current = true
              onEndRef.current()
            }
          } else setWantsPlay(false)
        }
      }
      tRef.current = next
      setT(next)
      raf = requestAnimationFrame(loopFn)
    }
    raf = requestAnimationFrame(loopFn)
    return () => cancelAnimationFrame(raf)
  }, [playing, duration, loop, speed])

  // Cambio de escena externo: vuelve al principio y se reproduce.
  const prevKey = useRef(resetKey)
  useEffect(() => {
    if (prevKey.current === resetKey) return
    prevKey.current = resetKey
    const v = reduced && !manual ? posterAt : 0
    tRef.current = v
    endedRef.current = false
    setT(v)
    setWantsPlay(true)
  }, [resetKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const seek = useCallback(
    (value) => {
      const v = Math.min(duration, Math.max(0, value))
      endedRef.current = false
      tRef.current = v
      setT(v)
    },
    [duration],
  )

  const toggle = useCallback(() => {
    setManual(true)
    setWantsPlay((p) => {
      if (!p && tRef.current >= duration - 0.01) {
        tRef.current = 0
        setT(0)
      }
      return !p
    })
  }, [duration])

  let sceneIndex = 0
  for (let i = 0; i < scenes.length; i++) if (t >= scenes[i].at) sceneIndex = i
  const scene = scenes[sceneIndex] || null
  const sceneEnd = scenes[sceneIndex + 1]?.at ?? duration
  const sceneT = scene ? clamp01((t - scene.at) / Math.max(0.001, sceneEnd - scene.at)) : 0

  /** Progreso 0..1 de t entre a y b (lineal) */
  const between = (a, b) => clamp01((t - a) / Math.max(0.0001, b - a))
  /** Progreso 0..1 de t entre a y b con curva suave */
  const ease = (a, b) => easeInOut(between(a, b))

  return {
    ref,
    t,
    duration,
    progress: t / duration,
    playing,
    wantsPlay,
    inView,
    reduced,
    speed,
    setSpeed,
    toggle,
    seek,
    scenes,
    scene,
    sceneIndex,
    sceneT,
    between,
    ease,
  }
}

/**
 * Movimiento de cámara sobre el viewBox. keyframes: [{ at, box: [x, y, w, h] }] ordenados por `at`.
 * Entre fotogramas clave interpola con curva suave. Devuelve la cadena para viewBox.
 */
export function useCamera(t, keyframes) {
  return cameraBox(t, keyframes).join(' ')
}

export function cameraBox(t, keyframes) {
  if (!keyframes.length) return [0, 0, 1600, 900]
  if (t <= keyframes[0].at) return keyframes[0].box
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i]
    const b = keyframes[i + 1]
    if (t >= a.at && t <= b.at) {
      const u = easeInOut(clamp01((t - a.at) / Math.max(0.0001, b.at - a.at)))
      return a.box.map((v, k) => v + (b.box[k] - v) * u)
    }
  }
  return keyframes[keyframes.length - 1].box
}

const timecode = (sec) => {
  const s2 = Math.max(0, Math.floor(sec))
  return `${String(Math.floor(s2 / 60)).padStart(2, '0')}:${String(s2 % 60).padStart(2, '0')}`
}

/** Barra de reproducción bajo el marco, sobre papel: reproducir, plano actual, línea de tiempo y código de tiempo */
export function FilmBar({ film, label = 'Línea de tiempo', children }) {
  const { t, duration, scenes, sceneIndex, scene, playing, toggle, seek } = film
  const pct = (t / duration) * 100
  return (
    <div className={s.bar}>
      <button type="button" className={s.play} onClick={toggle} aria-label={playing ? 'Pausar' : 'Reproducir'} aria-pressed={playing}>
        <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
          {playing ? (
            <g fill="currentColor">
              <rect x="6" y="5" width="3.2" height="14" />
              <rect x="14.8" y="5" width="3.2" height="14" />
            </g>
          ) : (
            <path d="M7 4.5v15l12.5-7.5z" fill="currentColor" />
          )}
        </svg>
      </button>
      <div className={s.sceneLabel} aria-live="polite">
        <span className={s.sceneNum}>{String(sceneIndex + 1).padStart(2, '0')}</span>
        <span className={s.sceneTitle}>{scene?.title}</span>
      </div>
      <div className={s.track}>
        <div className={s.rail} aria-hidden="true">
          <div className={s.fill} style={{ width: `${pct}%` }} />
          {scenes.map((sc, i) => (
            <span key={i} className={`${s.tick} ${i <= sceneIndex ? s.tickPast : ''}`} style={{ left: `${(sc.at / duration) * 100}%` }} />
          ))}
          <span className={s.head} style={{ left: `${pct}%` }} />
        </div>
        <input
          type="range"
          className={s.scrub}
          min={0}
          max={duration}
          step={0.05}
          value={t}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label={label}
          aria-valuetext={`${timecode(t)} de ${timecode(duration)}`}
        />
      </div>
      <span className={s.timecode}>
        {timecode(t)} <span className={s.total}>/ {timecode(duration)}</span>
      </span>
      {children && <div className={s.extra}>{children}</div>}
    </div>
  )
}

/** Subtítulo del plano, sobre la escena, con fundido entre planos. Va dentro del marco. */
export function FilmSubtitle({ film, text, position = 'bottom' }) {
  const content = text ?? film.scene?.caption
  if (!content) return null
  return (
    <div className={`${s.subtitle} ${s[position] || ''}`} aria-live="polite">
      <p key={`${film.sceneIndex}:${content}`} className={s.subtitleText}>
        {content}
      </p>
    </div>
  )
}

/** En pantalla estrecha el subtítulo va debajo del marco, en tinta sobre papel, para no tapar la escena. */
export function FilmCaption({ film }) {
  const content = film.scene?.caption
  if (!content) return null
  return (
    <p key={`${film.sceneIndex}:${content}`} className={s.caption} aria-live="polite">
      {content}
    </p>
  )
}

// Mosaico de ruido de 160 px que se repite: cubre siempre todo el marco, sin bordes.
const GRAIN_TILE = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="160" height="160" filter="url(#n)"/></svg>',
)}")`

/** Grano de película y viñeta muy sutiles. Va dentro del marco, al final. */
export function FilmGrain({ strength = 1 }) {
  return (
    <div className={s.grain} style={{ '--grain': 0.07 * strength }} aria-hidden="true">
      <div className={s.grainTile} style={{ backgroundImage: GRAIN_TILE }} />
      <div className={s.vignette} />
    </div>
  )
}
