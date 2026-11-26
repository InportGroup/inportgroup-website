import s from './Nav.module.css'

/** Barra superior: solo la marca, que lleva a la portada. Sin menú de secciones. */
export default function Nav() {
  return (
    <header className={s.header}>
      <a className={s.skip} href="#contenido">
        Saltar al contenido
      </a>
      <div className="wrap">
        <div className={s.nav}>
          <a href="/" className={s.brand} aria-label="Inport, inicio">
            INPORT
          </a>
        </div>
      </div>
    </header>
  )
}
