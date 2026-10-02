import { Link, useSearchParams } from 'react-router'
import Escena from '../components/film/Escena.jsx'
import { seo } from '../content/es/site.js'
import { ESCENAS } from '../scenes/registry.js'
import s from './laboratorio.module.css'

// Laboratorio de escenas para revisar y capturar. No se indexa ni sale en el mapa del sitio.
//   /laboratorio?escena=prueba                  la escena completa
//   /laboratorio?escena=prueba&t=12&freeze=1    el segundo 12, congelado
//   /laboratorio?escena=prueba&detalle=bajo     la miniatura

export const meta = () => seo({ titulo: 'Laboratorio de escenas', ruta: '/laboratorio', indexar: false })

export default function Laboratorio() {
  const [params] = useSearchParams()
  const ids = Object.keys(ESCENAS)
  const id = ESCENAS[params.get('escena')] ? params.get('escena') : ids[0]
  const detail = params.get('detalle') === 'bajo' ? 'bajo' : 'alto'

  return (
    <section className={`wrap ${s.lab}`} data-escena={id}>
      <header className={s.head}>
        <p className="kicker">Laboratorio</p>
        <ul className={s.list}>
          {ids.map((k) => (
            <li key={k}>
              <Link to={`?escena=${k}`} className={k === id ? s.active : ''}>
                {ESCENAS[k].nombre}
              </Link>
            </li>
          ))}
        </ul>
      </header>
      <div className={detail === 'bajo' ? s.mini : ''}>
        <Escena key={`${id}:${detail}`} id={id} detail={detail} readQuery />
      </div>
    </section>
  )
}
