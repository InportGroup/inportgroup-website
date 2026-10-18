import { NOSOTROS } from '../content/es/pagina.js'
import Cabecera from './Cabecera.jsx'
import s from './Nosotros.module.css'

export default function Nosotros() {
  return (
    <section id="nosotros" className={`wrap section ${s.nosotros}`} aria-labelledby="nosotros-titulo">
      <Cabecera id="nosotros-titulo" numero={NOSOTROS.numero} kicker={NOSOTROS.kicker} titulo={NOSOTROS.titulo} entradilla={NOSOTROS.entradilla} />

      <div className={s.bloque}>
        <p className="kicker">{NOSOTROS.pasosKicker}</p>
        <ol className={s.rejilla}>
          {NOSOTROS.pasos.map((paso) => (
            <li key={paso.n} className={s.celda}>
              <span className={s.n}>{paso.n}</span>
              <p className="h3">{paso.titulo}</p>
              <p>{paso.texto}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className={s.bloque}>
        <p className="kicker">{NOSOTROS.principiosKicker}</p>
        <ul className={s.rejilla}>
          {NOSOTROS.principios.map((pr) => (
            <li key={pr.titulo} className={s.celda}>
              <p className={s.principio}>{pr.titulo}</p>
              <p>{pr.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
