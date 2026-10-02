import { EJEMPLOS, ejemplosDe } from '../content/es/ejemplos.js'
import { CASOS } from '../content/es/pagina.js'
import { SECTORES } from '../content/es/sectores.js'
import Cabecera from './Cabecera.jsx'
import Ejemplo from './Ejemplo.jsx'
import s from './Sectores.module.css'

// Sección 03 · Casos de uso (decisión 17). Una cabecera que explica qué son los casos y cómo se leen,
// un índice agrupado por sector, y debajo un apartado por sector con lo que resolvemos y sus casos.
// Los apartados alternan banda gris y papel para que el ritmo se lea solo.

const numeroDe = (e) => EJEMPLOS.indexOf(e) + 1

function Indice() {
  return (
    <ol className={s.indice}>
      {SECTORES.map((sec) => (
        <li key={sec.id} className={s.grupo}>
          <a href={`#${sec.id}`} className={s.grupoNombre}>
            <span className="mark" style={{ '--c': `var(--${sec.color})` }} aria-hidden="true" />
            {sec.kicker}
          </a>
          <ul className={s.grupoCasos}>
            {ejemplosDe(sec.id).map((e) => (
              <li key={e.id}>
                <a href={`#${e.id}`} className={s.caso}>
                  <span className={s.casoNum}>{String(numeroDe(e)).padStart(2, '0')}</span>
                  <span>{e.titulo}</span>
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}

function Sector({ sec, banda }) {
  return (
    <section id={sec.id} className={`${s.sector} ${banda ? s.banda : ''}`} aria-labelledby={`${sec.id}-titulo`}>
      <div className={`wrap ${s.cabeza}`}>
        <Cabecera id={`${sec.id}-titulo`} kicker={`Casos de uso · ${sec.kicker}`} titulo={sec.titulo} entradilla={sec.entradilla} color={sec.color} />
        <div className={s.resolvemos}>
          <p className="kicker">Qué resolvemos en este sector</p>
          <ul className={s.lineas}>
            {sec.lineas.map((l) => (
              <li key={l.texto} className={s.linea}>
                <span>{l.texto}</span>
                {l.ejemplo && (
                  <a href={`#${l.ejemplo}`} className={s.ver}>
                    Ver el caso
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={s.ejemplos}>
        {ejemplosDe(sec.id).map((e) => (
          <Ejemplo key={e.id} e={e} n={numeroDe(e) - 1} />
        ))}
      </div>
    </section>
  )
}

export default function Sectores() {
  return (
    <section id="casos" aria-labelledby="casos-titulo">
      <div className={`wrap ${s.intro}`}>
        <Cabecera id="casos-titulo" numero={CASOS.numero} kicker={CASOS.kicker} titulo={CASOS.titulo} entradilla={CASOS.entradilla} />
        <Indice />
        <p className={s.estructura}>{CASOS.estructura}</p>
      </div>
      {SECTORES.map((sec, i) => (
        <Sector key={sec.id} sec={sec} banda={i % 2 === 0} />
      ))}
    </section>
  )
}
