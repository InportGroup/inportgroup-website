import Escena from '../components/film/Escena.jsx'
import { maquetaPorId } from '../content/es/maquetas.js'
import { mailto } from '../content/es/site.js'
import s from './Ejemplo.module.css'

// Un ejemplo: filete, kicker con numeral, titular, entradilla y un párrafo; la escena; cifras con una sola
// línea de tipo, lo que no hace y un enlace (GUIA.md, sección 7.6).

const ETIQUETA = { demo: 'demostración', diseño: 'especificación del sistema', proyecto: 'resultado de proyecto' }

/**
 * Una sola línea discreta que dice de qué tipo es cada cifra, en lugar de una etiqueta bajo cada una.
 * Todas iguales: "Cifras de demostración." Mezcladas: "2,8: demostración · 72 h: especificación del sistema · ..."
 */
function NotaCifras({ cifras }) {
  const tipos = [...new Set(cifras.map((c) => c.tipo))]
  if (tipos.length === 1 && tipos[0] !== 'fuente') {
    return <p className={s.notaCifras}>{tipos[0] === 'demo' ? 'Cifras de demostración.' : 'Especificaciones del sistema.'}</p>
  }
  const grupos = []
  for (const c of cifras) {
    const g = grupos.find((x) => x.tipo === c.tipo && c.tipo !== 'fuente')
    if (g) g.valores.push(c.valor)
    else grupos.push({ tipo: c.tipo, valores: [c.valor], c })
  }
  return (
    <p className={s.notaCifras}>
      {grupos.map((g, i) => (
        <span key={g.valores.join()}>
          {i > 0 && ' · '}
          {g.valores.join(' y ')}:{' '}
          {g.tipo === 'fuente' ? (
            <a href={g.c.url} target="_blank" rel="noopener noreferrer">
              {g.c.fuente}
            </a>
          ) : (
            ETIQUETA[g.tipo]
          )}
        </span>
      ))}
    </p>
  )
}

/** Enlace a la maqueta completa según su acceso (GUIA.md, sección 7.7) */
function EnlaceMaqueta({ id }) {
  const m = maquetaPorId(id)
  if (!m) return null
  if (m.acceso === 'abierta') {
    return (
      <a className={s.enlace} href={m.url} target="_blank" rel="noopener noreferrer">
        Ver la maqueta de {m.nombre}
      </a>
    )
  }
  return (
    <a className={s.enlace} href={mailto(`Acceso a la maqueta ${m.nombre}`)}>
      Pedir acceso a la maqueta de {m.nombre}
    </a>
  )
}

export default function Ejemplo({ e, n }) {
  return (
    <article id={e.id} className={`wrap ${s.ejemplo}`} aria-labelledby={`${e.id}-titulo`}>
      <header className={s.cabeza}>
        <div className={s.izquierda}>
          <p className="kicker">
            <span className="mark" style={{ '--c': `var(--${e.color})` }} aria-hidden="true" />
            Caso de uso {n + 1} · {e.kicker}
          </p>
          <h3 id={`${e.id}-titulo`} className={`h2 ${s.titulo}`}>
            {e.titulo}
          </h3>
        </div>
        <div className={s.derecha}>
          <div className={s.bloque}>
            <p className={s.etiqueta}>El reto</p>
            <p className={s.entradilla}>{e.entradilla}</p>
          </div>
          <div className={s.bloque}>
            <p className={s.etiqueta}>La solución</p>
            {e.parrafos.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </header>

      <div className={s.escena}>
        <Escena id={e.escena} />
      </div>

      <footer className={s.pie}>
        <div>
          <p className={s.etiqueta}>En cifras</p>
          <dl className={s.cifras}>
            {e.cifras.map((c) => (
              <div key={c.valor + c.texto} className={s.cifra}>
                <dt className={s.valor}>{c.valor}</dt>
                <dd className={s.cifraTexto}>{c.texto}</dd>
              </div>
            ))}
          </dl>
          <NotaCifras cifras={e.cifras} />
        </div>
        <div className={s.notas}>
          <p className={s.etiqueta}>Límites</p>
          <p className={s.noHace}>{e.noHace}</p>
          {e.maqueta ? <EnlaceMaqueta id={e.maqueta} /> : <p className={s.origen}>{e.origen}</p>}
        </div>
      </footer>
    </article>
  )
}
