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

      <Panorama />

      {/* Las seis horas, en texto, para lectores de pantalla y buscadores: el panorama se dibuja en el navegador */}
      <ol className="visually-hidden">
        {PORTADA.martes.map((m) => (
          <li key={m.hora}>
            <a href={`#${m.ancla}`}>
              {m.hora} · {m.texto}
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
