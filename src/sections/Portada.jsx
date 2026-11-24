import Foto from '../components/Foto.jsx'
import { PORTADA } from '../content/es/pagina.js'
import { SITE } from '../content/es/site.js'
import s from './Portada.module.css'

export default function Portada() {
  const { titulo } = PORTADA
  return (
    <div className="wrap">
      <header className={s.hero} id="porque">
        <div>
          <span className={`mono ${s.tag}`} lang="en">
            {SITE.lema}
          </span>
          <h1 className={s.h1}>
            {titulo.antes}
            <mark>{titulo.marca}</mark>
            {titulo.despues}
          </h1>
          <p className={s.sub}>{PORTADA.entradilla}</p>
          <p className={`mono ${s.sectores}`}>{PORTADA.sectores}</p>
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
