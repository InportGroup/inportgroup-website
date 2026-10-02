import { forwardRef } from 'react'
import s from './Stage.module.css'

/**
 * Pantalla donde se proyecta una escena: fondo oscuro, proporción fija y marcas de corte en las esquinas.
 * Es position: relative para colocar subtítulos, grano y tooltips encima.
 */
export const Stage = forwardRef(function Stage({ children, aspect = '16 / 9', className = '', marks = true, ...rest }, ref) {
  return (
    <div ref={ref} className={`${s.stage} ${className}`} style={{ aspectRatio: aspect }} {...rest}>
      {marks && (
        <>
          <span className={`${s.mark} ${s.tl}`} aria-hidden="true" />
          <span className={`${s.mark} ${s.tr}`} aria-hidden="true" />
          <span className={`${s.mark} ${s.bl}`} aria-hidden="true" />
          <span className={`${s.mark} ${s.br}`} aria-hidden="true" />
        </>
      )}
      <div className={s.screen}>{children}</div>
    </div>
  )
})

/**
 * Cajetín sobre la pantalla, como el de un plano: lugar, origen de la imagen, hora de la escena
 * y la nota de que todo es ilustrativo.
 */
export function Cajetin({ lugar, origen, reloj, nota = 'Escena ilustrativa · datos de demostración' }) {
  return (
    <div className={s.cajetin}>
      {lugar && <span className={s.cell}>{lugar}</span>}
      {origen && <span className={s.cell}>{origen}</span>}
      {reloj && <span className={`${s.cell} ${s.clock}`}>{reloj}</span>}
      <span className={`${s.cell} ${s.note}`}>{nota}</span>
    </div>
  )
}
