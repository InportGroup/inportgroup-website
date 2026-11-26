import { useEffect, useRef, useState } from 'react'
import Escena from '../components/film/Escena.jsx'
import { QUE } from '../content/es/pagina.js'
import { SECTORES } from '../content/es/sectores.js'
import s from './Que.module.css'

/**
 * Un caso por sector en pestañas. Todos los paneles salen en el HTML prerenderizado (los inactivos con hidden),
 * así el buscador los lee todos. El ancla del sector (/#retail) abre su pestaña y se puede compartir.
 */
export default function Que() {
  const [activo, setActivo] = useState(0)
  const tabs = useRef([])
  const tablist = useRef(null)

  useEffect(() => {
    const desdeAncla = () => {
      const i = SECTORES.findIndex((x) => `#${x.id}` === window.location.hash)
      if (i < 0) return
      setActivo(i)
      tablist.current?.scrollIntoView()
    }
    desdeAncla()
    window.addEventListener('hashchange', desdeAncla)
    return () => window.removeEventListener('hashchange', desdeAncla)
  }, [])

  const elegir = (i, enfocar = false) => {
    setActivo(i)
    window.history.replaceState(null, '', `#${SECTORES[i].id}`)
    if (enfocar) tabs.current[i]?.focus()
  }

  // Teclado de pestañas (WAI-ARIA): flechas, Inicio y Fin
  const onKeyDown = (e) => {
    const n = SECTORES.length
    const destino = { ArrowRight: activo + 1, ArrowDown: activo + 1, ArrowLeft: activo - 1, ArrowUp: activo - 1, Home: 0, End: n - 1 }[e.key]
    if (destino === undefined) return
    e.preventDefault()
    elegir((destino + n) % n, true)
  }

  return (
    <section className={s.sec} id="que" aria-labelledby="que-titulo">
      <div className="wrap">
        <div className={s.head}>
          <h2 id="que-titulo" className={s.h2}>
            {QUE.titulo}
          </h2>
          <p className={s.lead}>{QUE.entradilla}</p>
        </div>

        <div className={s.tabs} role="tablist" aria-label="Sectores" ref={tablist} onKeyDown={onKeyDown}>
          {SECTORES.map((x, i) => (
            <button
              key={x.id}
              ref={(el) => (tabs.current[i] = el)}
              type="button"
              role="tab"
              id={`tab-${x.id}`}
              aria-selected={i === activo}
              aria-controls={`panel-${x.id}`}
              tabIndex={i === activo ? 0 : -1}
              className={s.tab}
              onClick={() => elegir(i)}
            >
              {x.letra}. {x.nombre}
            </button>
          ))}
        </div>

        {SECTORES.map((x, i) => (
          <div key={x.id} className={s.panel} id={`panel-${x.id}`} role="tabpanel" aria-labelledby={`tab-${x.id}`} tabIndex={0} hidden={i !== activo}>
            <Panel sector={x} />
          </div>
        ))}
      </div>
    </section>
  )
}

// Un párrafo por elemento. { negrita: '...' } es la frase destacada del caso (GUIA.md, sección 3, regla 2).
function Parrafos({ lista }) {
  return lista.map((p) =>
    typeof p === 'string' ? (
      <p key={p}>{p}</p>
    ) : (
      <p key={p.negrita}>
        <strong>{p.negrita}</strong>
      </p>
    ),
  )
}

function Panel({ sector: x }) {
  return (
    <>
      <p className={`hand ${s.nota}`}>{x.nota}</p>
      <h3 className={s.h3}>{x.titulo}</h3>
      <div className={s.cols}>
        <div>
          <h4 className={s.chip}>El problema</h4>
          <Parrafos lista={x.problema} />
        </div>
        <div>
          <h4 className={s.chip}>La solución</h4>
          <Parrafos lista={x.solucion} />
        </div>
      </div>

      <div className={s.video}>
        <Escena id={x.escena} />
      </div>

      <div className={s.otras}>
        <h4 className={s.chip}>Otras aplicaciones</h4>
        <ul className={s.cards}>
          {x.otras.map((o) => (
            <li key={o.titulo} className={s.card}>
              <p className={s.cardTitle}>{o.titulo}</p>
              <p>{o.texto}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className={s.foot}>
        <p className={`mono ${s.fine}`}>{x.limites}</p>
        <p className={`mono ${s.proto}`}>{x.prototipo.texto}</p>
      </div>
    </>
  )
}
