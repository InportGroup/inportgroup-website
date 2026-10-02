import { useLocation } from 'react-router'
import { LEGAL } from '../content/es/pagina.js'
import { NAV, SITE } from '../content/es/site.js'
import Logo from './Logo.jsx'
import s from './Footer.module.css'

export default function Footer() {
  const { pathname } = useLocation()
  const href = (ancla) => (pathname === '/' ? `#${ancla}` : `/#${ancla}`)
  return (
    <footer className={s.footer}>
      <div className={`wrap ${s.grid}`}>
        <div className={s.brand}>
          <Logo />
          <p className={s.line}>Soluciones digitales a medida para cualquier sector. Lo que aporta valor, aunque sea difícil.</p>
        </div>
        <nav aria-label="Secciones de la página">
          <ul className={s.list}>
            {NAV.map((n) => (
              <li key={n.ancla}>
                <a href={href(n.ancla)} className={s.link}>
                  {n.nombre}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={s.contact}>
          <p className={s.label}>Contacto</p>
          <p>
            {SITE.contacto.nombre} · {SITE.contacto.cargo}
          </p>
          <a href={`mailto:${SITE.contacto.correo}`}>{SITE.contacto.correo}</a>
        </div>
      </div>
      <div className={`wrap ${s.legal}`}>
        <details>
          <summary>{LEGAL.resumen}</summary>
          <div className={s.legalTexto}>
            {LEGAL.parrafos.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
        </details>
      </div>
      <div className={`wrap ${s.bottom}`}>
        <span>© 2026 Inport</span>
        <span>www.inportgroup.com</span>
      </div>
    </footer>
  )
}
