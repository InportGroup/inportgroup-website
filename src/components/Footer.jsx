import { LEGAL } from '../content/es/pagina.js'
import s from './Footer.module.css'

export default function Footer() {
  return (
    <footer className="dark">
      <div className="wrap">
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
