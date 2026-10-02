import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { NAV } from '../content/es/site.js'
import Logo from './Logo.jsx'
import s from './Nav.module.css'

/** Sección que se está leyendo: la que cruza la franja central de la ventana. */
function useActiveSection(ids, enabled) {
  const [active, setActive] = useState(null)
  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return undefined
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids, enabled])
  return active
}

const IDS = [...NAV.map((n) => n.ancla), 'contacto']

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const onPage = pathname === '/'
  const active = useActiveSection(IDS, onPage)
  const href = (ancla) => (onPage ? `#${ancla}` : `/#${ancla}`)

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return undefined
    const close = () => setOpen(false)
    window.addEventListener('hashchange', close)
    return () => window.removeEventListener('hashchange', close)
  }, [open])

  const links = NAV.map((n) => (
    <li key={n.ancla}>
      <a href={href(n.ancla)} className={`${s.link} ${active === n.ancla ? s.active : ''}`} onClick={() => setOpen(false)}>
        {n.nombre}
      </a>
    </li>
  ))

  return (
    <header className={s.header}>
      <a className={s.skip} href="#contenido">
        Saltar al contenido
      </a>
      <div className={`wrap ${s.inner}`}>
        <Link to="/" className={s.brand} aria-label="Inport, inicio" onClick={() => onPage && window.scrollTo({ top: 0 })}>
          <Logo />
        </Link>
        <nav aria-label="Secciones" className={s.nav}>
          <ul className={s.links}>{links}</ul>
        </nav>
        <a className={`${s.cta} ${active === 'contacto' ? s.ctaActive : ''}`} href={href('contacto')}>
          Hablemos
        </a>
        <button type="button" className={s.menuButton} aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
          {open ? 'Cerrar' : 'Menú'}
        </button>
      </div>
      <div id="menu" className={s.panel} hidden={!open}>
        <ul className="wrap">
          {links}
          <li>
            <a className={s.link} href={href('contacto')} onClick={() => setOpen(false)}>
              Hablemos
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
