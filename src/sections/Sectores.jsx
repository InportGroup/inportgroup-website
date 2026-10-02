import { EJEMPLOS, ejemplosDe } from '../content/es/ejemplos.js'
import { SECTORES } from '../content/es/sectores.js'
import Cabecera from './Cabecera.jsx'
import Ejemplo from './Ejemplo.jsx'
import s from './Sectores.module.css'

// Una sección por sector, en el orden de la página (decisión 14): industria, automatización de procesos,
// retail, y agricultura y ganadería. Cada una lleva lo que hacemos en ese sector y sus ejemplos.
// Las secciones alternan papel y banda gris para que el ritmo se lea solo.

function Sector({ sec, banda }) {
  const ejemplos = ejemplosDe(sec.id)
  return (
    <section id={sec.id} className={`${s.sector} ${banda ? s.banda : ''}`} aria-labelledby={`${sec.id}-titulo`}>
      <div className={`wrap ${s.cabeza}`}>
        <Cabecera id={`${sec.id}-titulo`} numero={sec.numero} kicker={sec.kicker} titulo={sec.titulo} entradilla={sec.entradilla} color={sec.color} />
        <div className={s.resolvemos}>
          <p className="kicker">Qué resolvemos</p>
        <ul className={s.lineas}>
          {sec.lineas.map((l) => (
            <li key={l.texto} className={s.linea}>
              <span>{l.texto}</span>
              {l.ejemplo && (
                <a href={`#${l.ejemplo}`} className={s.ver}>
                  Ver el ejemplo
                </a>
              )}
            </li>
          ))}
        </ul>
        </div>
      </div>
      <div className={s.ejemplos}>
        {ejemplos.map((e) => (
          <Ejemplo key={e.id} e={e} n={EJEMPLOS.indexOf(e)} />
        ))}
      </div>
    </section>
  )
}

export default function Sectores() {
  return (
    <>
      {SECTORES.map((sec, i) => (
        <Sector key={sec.id} sec={sec} banda={i % 2 === 1} />
      ))}
    </>
  )
}
