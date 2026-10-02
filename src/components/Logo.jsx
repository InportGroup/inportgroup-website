import s from './Logo.module.css'

/**
 * Logotipo provisional (GUIA.md, sección 4): un muelle de línea abierto por un lado y un punto que entra,
 * junto a "inport" en serif. Se sustituye cuando llegue el oficial.
 */
export default function Logo({ className = '' }) {
  return (
    <span className={`${s.logo} ${className}`}>
      <svg className={s.mark} viewBox="0 0 28 28" aria-hidden="true">
        <path d="M11 5.5 H22.5 V22.5 H11" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="6" cy="14" r="2.4" fill="currentColor" />
      </svg>
      <span className={s.word}>inport</span>
    </span>
  )
}
