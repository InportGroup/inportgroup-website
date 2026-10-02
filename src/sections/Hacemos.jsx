import Escena from '../components/film/Escena.jsx'
import { HACEMOS } from '../content/es/pagina.js'
import Cabecera from './Cabecera.jsx'
import s from './Hacemos.module.css'

export default function Hacemos() {
  return (
    <section id="hacemos" className={s.banda} aria-labelledby="hacemos-titulo">
      <div className={`wrap section ${s.hacemos}`}>
        <Cabecera id="hacemos-titulo" numero={HACEMOS.numero} kicker={HACEMOS.kicker} titulo={HACEMOS.titulo} entradilla={HACEMOS.entradilla} />
        <Escena id="recorrido" detail="bajo" />
        <ol className={s.capacidades}>
          {HACEMOS.capacidades.map((c, i) => (
            <li key={c.verbo} className={s.capacidad}>
              <span className={s.n}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={s.verbo}>{c.verbo}</h3>
              <p>{c.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
