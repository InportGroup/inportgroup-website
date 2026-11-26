import { COMO } from '../content/es/pagina.js'
import s from './Como.module.css'

/** Banda oscura con el "04": titular, nota sobre lima y lo que nos mueve en tres puntos numerados. */
export default function Como() {
  const { mueve } = COMO
  return (
    <section className={`dark pantalla iman ${s.sec}`} id="como" aria-labelledby="como-titulo">
      <div className="wrap">
        <div className={s.head}>
          <p className={s.ring} aria-hidden="true">
            {COMO.numero}
          </p>
          <div>
            <h2 id="como-titulo" className={s.h2}>
              {COMO.titulo}
            </h2>
            <p className={`hand ${s.big}`}>{COMO.nota}</p>
          </div>
        </div>

        <div className={s.mueve}>
          <h3 className={`mono ${s.label}`}>{mueve.titulo}</h3>
          <ol className={s.list}>
            {mueve.lista.map((item) =>
              typeof item === 'string' ? (
                <li key={item}>{item}</li>
              ) : (
                <li key={item.negrita}>
                  <span>
                    {item.antes}
                    <strong>{item.negrita}</strong>
                  </span>
                </li>
              ),
            )}
          </ol>
        </div>
      </div>
    </section>
  )
}
