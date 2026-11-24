import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { NAV } from '../content/es/site.js'
import s from './Nav.module.css'

/** Sección que se está leyendo: la que cruza la franja central de la ventana. */
function useActiveSection(ids, enabled) {
  const [active, setActive] = useState(null)
  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.map((id) => document.getElementById(id)).filter(Boolean).forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids, enabled])
  return active
}

const IDS = [...NAV.map((n) => n.ancla), 'contacto']

export default function Nav() {
  const { pathname } = useLocation()
  const onPage = pathname === '/'
  const active = useActiveSection(IDS, onPage)
  const href = (ancla) => (onPage ? `#${ancla}` : `/#${ancla}`)

  return (
    <header className={s.header}>
      <a className={s.skip} href="#contenido">
        Saltar al contenido
      </a>
      <div className="wrap">
        <nav className={s.nav} aria-label="Secciones">
          <a href="/" className={s.brand} aria-label="Inport, inicio">
            INPORT
          </a>
          <ul className={`mono ${s.links}`}>
            {NAV.map((n) => (
              <li key={n.ancla}>
                <a href={href(n.ancla)} className={active === n.ancla ? s.active : undefined}>
                  {n.nombre}
                </a>
              </li>
            ))}
            <li>
              <a href={href('contacto')} className={`${s.cta} ${active === 'contacto' ? s.ctaActive : ''}`}>
                Contacto
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
