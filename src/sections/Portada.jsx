import Foto from '../components/Foto.jsx'
import { PORTADA } from '../content/es/pagina.js'
import s from './Portada.module.css'

/**
 * Portada: el titular y la primera mitad de la frase caben en la primera pantalla.
 * Con un poco de scroll sube el giro, "peor de lo que deberían.", debajo de la frase. La foto va a la derecha.
 */
export default function Portada() {
  const { titulo, entradilla } = PORTADA
  return (
    <div className="wrap">
      <header className={s.hero} id="porque">
        <div>
          <h1 className={s.h1}>
            {titulo.antes}
            <mark>{titulo.marca}</mark>
            {titulo.despues}
          </h1>
          <p className={s.sub}>{entradilla.antes}</p>
          <div className={s.sube}>
            <p className={s.giro}>
              <strong>{entradilla.giro}</strong>
            </p>
            <p className={`mono ${s.sectores}`}>{PORTADA.sectores}</p>
          </div>
        </div>
        <figure className={s.photo}>
          <p className={`hand ${s.nota}`}>{PORTADA.nota}</p>
          <Foto foto={PORTADA.foto} prioridad />
          <figcaption className={s.cap}>{PORTADA.pie}</figcaption>
        </figure>
      </header>
    </div>
  )
}
