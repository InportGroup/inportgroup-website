import s from './Controls.module.css'

// Controles de la casa, traídos de InLux y pasados a papel y tinta.

/**
 * Selector de opciones en línea con subrayado fino.
 * options: [{ value, label }]
 */
export function Segmented({ options, value, onChange, label }) {
  return (
    <div className={s.segmented} role="radiogroup" aria-label={label}>
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            className={`${s.segment} ${active ? s.active : ''}`}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/** Etiqueta seleccionable en forma de píldora fina */
export function Chip({ active = false, onClick, children, disabled = false }) {
  return (
    <button type="button" className={`${s.chip} ${active ? s.chipActive : ''}`} onClick={onClick} aria-pressed={active} disabled={disabled}>
      {children}
    </button>
  )
}

/**
 * Botón de texto. variant: 'frame' (marco fino) o 'line' (subrayado).
 * Con href se comporta como enlace normal (correo, maquetas externas).
 */
export function TextButton({ children, onClick, href, variant = 'frame', external = false, className = '' }) {
  const cls = `${s.textButton} ${s[variant] || ''} ${className}`
  if (href) {
    return (
      <a className={cls} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  )
}
