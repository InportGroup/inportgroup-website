import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useIsNarrow } from '../../lib/hooks.js'
import { ESCENAS } from '../../scenes/registry.js'
import { useFilm } from './Film.jsx'
import s from './Escena.module.css'

const NOTA = 'Escena ilustrativa · datos de demostración'

const players = new Map()

function playerFor(id) {
  if (!players.has(id)) {
    players.set(
      id,
      lazy(() => ESCENAS[id].cargar().then((m) => ({ default: () => <Player scene={m.default} /> }))),
    )
  }
  return players.get(id)
}

/**
 * Vídeo de un caso: una escena del registro.
 * No se prerenderiza: el HTML lleva el hueco con su tamaño y la escena se dibuja en el navegador cuando se
 * acerca a la pantalla. Una pestaña oculta nunca se acerca, así que solo se carga la del sector abierto.
 */
export default function Escena({ id }) {
  const ref = useRef(null)
  const [cerca, setCerca] = useState(false)

  useEffect(() => {
    if (cerca) return undefined
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setCerca(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setCerca(true)
        io.disconnect()
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [cerca])

  if (!ESCENAS[id]) return null
  const reserva = (
    <div ref={ref} className={s.reserva} aria-hidden="true">
      <div className={s.pantalla} />
      <div className={s.barraReserva} />
    </div>
  )
  if (!cerca) return reserva
  const P = playerFor(id)
  return (
    <Suspense fallback={reserva}>
      <P />
    </Suspense>
  )
}

function Player({ scene }) {
  const film = useFilm({ duration: scene.duration, scenes: scene.scenes, poster: scene.poster })
  const narrow = useIsNarrow()
  const { Scene } = scene
  const caption = film.scene?.caption
  return (
    <figure className={s.player}>
      <div ref={film.ref} className={s.stage} style={{ aspectRatio: (narrow && scene.aspectNarrow) || scene.aspect }} role="img" aria-label={scene.label}>
        <Scene film={film} narrow={narrow} detail="alto" />
        {!narrow && caption && (
          <p key={film.sceneIndex} className={s.subtitle}>
            <span>{caption}</span>
          </p>
        )}
      </div>
      {narrow && caption && (
        <p key={film.sceneIndex} className={s.caption}>
          {caption}
        </p>
      )}
      <Barra film={film} />
    </figure>
  )
}

/** Reproducir o pausar, la línea de tiempo (se puede arrastrar) y la nota de que es ilustrativa */
function Barra({ film }) {
  const pct = (film.t / film.duration) * 100
  return (
    <figcaption className={s.bar}>
      <button type="button" className={s.play} onClick={film.toggle} aria-label={film.playing ? 'Pausar' : 'Reproducir'}>
        <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
          {film.playing ? (
            <g fill="currentColor">
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </g>
          ) : (
            <path d="M7 4.5v15l12.5-7.5z" fill="currentColor" />
          )}
        </svg>
      </button>
      <div className={s.track}>
        <div className={s.rail} aria-hidden="true">
          <div className={s.fill} style={{ width: `${pct}%` }} />
          <span className={s.head} style={{ left: `${pct}%` }} />
        </div>
        <input
          type="range"
          className={s.scrub}
          min={0}
          max={film.duration}
          step={0.1}
          value={film.t}
          onChange={(e) => film.seek(Number(e.target.value))}
          aria-label="Avance de la escena"
        />
      </div>
      <span className={`mono ${s.nota}`}>{NOTA}</span>
    </figcaption>
  )
}
