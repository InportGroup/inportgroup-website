import s from './Foto.module.css'

/**
 * Foto con marcas de recorte. Sin src se ve el hueco rayado con lo que tiene que ir,
 * para sustituirlo en cuanto llegue la imagen (basta con poner la ruta en el contenido).
 */
export default function Foto({ foto, ratio = '4 / 5', prioridad = false }) {
  return (
    <div className={s.frame}>
      <span className={`${s.crop} ${s.a}`} aria-hidden="true" />
      <span className={`${s.crop} ${s.b}`} aria-hidden="true" />
      {foto.src ? (
        <img className={s.img} src={foto.src} alt={foto.alt} style={{ aspectRatio: ratio }} loading={prioridad ? 'eager' : 'lazy'} />
      ) : (
        <div className={s.ph} style={{ aspectRatio: ratio }}>
          <span className={`mono ${s.label}`}>Foto pendiente · {foto.pendiente}</span>
        </div>
      )}
    </div>
  )
}
