import { LEGAL, PIE } from '../content/es/pagina.js'
import { SECTORES } from '../content/es/sectores.js'
import s from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={`dark ${s.pie}`}>
      <div className="wrap">
        <div className={s.mapa}>
          <p className={s.que}>{PIE.texto}</p>
          <nav aria-label={PIE.casos}>
            <ul className={`mono ${s.enlaces}`}>
              {SECTORES.map((x) => (
                <li key={x.id}>
                  <a href={`/#${x.id}`}>{x.nombre}</a>
                </li>
              ))}
              <li>
                <a href="/#contacto">Contacto</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className={`mono ${s.row}`}>
          <span>© 2026 Inport</span>
          <details className={s.legal}>
            <summary>{LEGAL.resumen}</summary>
            {LEGAL.parrafos.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </details>
        </div>
      </div>
    </footer>
  )
}
