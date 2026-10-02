import { EJEMPLOS } from '../content/es/ejemplos.js'
import { PORTADA } from '../content/es/pagina.js'
import Panorama from './Panorama.jsx'
import s from './Portada.module.css'

export default function Portada() {
  return (
    <section className={s.portada} aria-labelledby="titular">
      <div className={`wrap ${s.cabeza}`}>
        <div className={s.principal}>
          <p className="kicker">{PORTADA.kicker}</p>
          <h1 id="titular" className={`h1 ${s.titulo}`}>
            {PORTADA.titulo}
          </h1>
        </div>
        <p className={`lead ${s.entradilla}`}>{PORTADA.entradilla}</p>
      </div>

      {/* A qué nos dedicamos, en cuatro líneas de trabajo */}
      <div className={`wrap ${s.dedicamos}`}>
        <p className="kicker">{PORTADA.lineasKicker}</p>
        <ul className={s.lineas}>
          {PORTADA.lineas.map((l, i) => (
            <li key={l} className={s.linea}>
              <span className={s.n}>{String(i + 1).padStart(2, '0')}</span>
              {l}
            </li>
          ))}
        </ul>
      </div>

      <Panorama />

      {/* Los casos de uso, en texto, para lectores de pantalla y buscadores: el panorama se dibuja en el navegador */}
      <ul className="visually-hidden">
        {EJEMPLOS.map((e) => (
          <li key={e.id}>
            <a href={`#${e.id}`}>Caso de uso: {e.titulo}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}
