import { MUEVE } from '../content/es/pagina.js'
import s from './Mueve.module.css'

export default function Mueve() {
  return (
    <section className={s.band} aria-labelledby="mueve-titulo">
      <div className={`wrap ${s.inner}`}>
        <h2 id="mueve-titulo" className={`mono ${s.label}`}>
          {MUEVE.titulo}
        </h2>
        <ol className={s.list}>
          {MUEVE.lista.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>
    </section>
  )
}
