import { Suspense, lazy, useEffect, useState } from 'react'
import s from './Panorama.module.css'

// El panorama se dibuja solo en el navegador (como todas las escenas, GUIA.md, sección 5): el HTML estático
// lleva el hueco con su proporción para que la portada no salte al cargar.
const Player = lazy(() => import('../scenes/panorama/Player.jsx'))

function Reserva() {
  return (
    <div className={s.reserva} aria-hidden="true">
      <div className={s.pantalla} />
      <div className={s.barra} />
    </div>
  )
}

export default function Panorama() {
  const [listo, setListo] = useState(false)
  useEffect(() => setListo(true), [])
  if (!listo) return <Reserva />
  return (
    <Suspense fallback={<Reserva />}>
      <Player />
    </Suspense>
  )
}
