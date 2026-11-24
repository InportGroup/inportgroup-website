import { COMO } from '../content/es/pagina.js'
import s from './Como.module.css'

export default function Como() {
  return (
    <section className={`dark ${s.sec}`} id="como" aria-labelledby="como-titulo">
      <div className="wrap">
        <div className={s.head}>
          <p className={s.ring} aria-hidden="true">
            {COMO.numero}
          </p>
          <div>
            <h2 id="como-titulo" className={s.h2}>
              {COMO.titulo}
            </h2>
            <p className={s.lead}>{COMO.entradilla}</p>
          </div>
        </div>

        <ol className={s.steps}>
          {COMO.fases.map((f, i) => (
            <li key={f.n} className={`${s.step} ${i === COMO.fases.length - 1 ? s.final : ''}`}>
              <p className={s.num} aria-hidden="true">
                {f.n}
              </p>
              <h3 className={s.title}>{f.titulo}</h3>
              <p className={s.text}>{f.texto}</p>
              <p className={`hand ${s.nota}`}>{f.nota}</p>
              <p className={`mono ${s.fase}`}>{f.fase}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
