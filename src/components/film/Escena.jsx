import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { ESCENAS } from '../../scenes/registry.js'
import ScenePlayer from './ScenePlayer.jsx'
import s from './Escena.module.css'

const players = new Map()

function playerFor(id) {
  if (!players.has(id)) {
    players.set(
      id,
      lazy(() => ESCENAS[id].cargar().then((m) => ({ default: (props) => <ScenePlayer scene={m.default} {...props} /> }))),
    )
  }
  return players.get(id)
}

/**
 * Escena por su id del registro.
 * Las escenas no se prerenderizan: el HTML estático lleva el hueco con su tamaño y la escena se dibuja en el
 * navegador cuando el marco se acerca a la pantalla. Así no hay diferencias de hidratación (Node y el navegador
 * no calculan exactamente igual Math.exp o Math.sin) y no se gasta nada en escenas que nadie está mirando.
 *
 * <Escena id="hornos" />  ·  <Escena id="hornos" detail="bajo" />
 */
export default function Escena({ id, detail = 'alto', ...props }) {
  const entry = ESCENAS[id]
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
        if (e.isIntersecting) {
          setCerca(true)
          io.disconnect()
        }
      },
      { rootMargin: '700px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [cerca])

  if (!entry) return null
  const reserva = <Reserva refEl={ref} aspect={entry.aspect} full={detail === 'alto'} />
  if (!cerca) return reserva
  const Player = playerFor(id)
  return (
    <Suspense fallback={reserva}>
      <Player detail={detail} {...props} />
    </Suspense>
  )
}

function Reserva({ refEl, aspect, full }) {
  return (
    <div ref={refEl} className={s.reserva} aria-hidden="true">
      {full && <div className={s.cajetin} />}
      <div className={s.pantalla} style={{ aspectRatio: aspect }} />
      {full && <div className={s.barra} />}
    </div>
  )
}
