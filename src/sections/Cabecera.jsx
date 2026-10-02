import s from './Cabecera.module.css'

/** Cabecera de sección: número y kicker en mono, titular en serif y entradilla opcional a la derecha. */
export default function Cabecera({ id, numero, kicker, titulo, entradilla, color }) {
  return (
    <header className={s.cabecera}>
      <p className="kicker">
        {color && <span className="mark" style={{ '--c': `var(--${color})` }} aria-hidden="true" />}
        {numero ? `${numero} · ${kicker}` : kicker}
      </p>
      <div className={s.fila}>
        <h2 id={id} className={`h2 ${s.titulo}`}>
          {titulo}
        </h2>
        {entradilla && <p className={`lead ${s.entradilla}`}>{entradilla}</p>}
      </div>
    </header>
  )
}
