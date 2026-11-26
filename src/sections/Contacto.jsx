import { CONTACTO } from '../content/es/pagina.js'
import { SITE, mailto } from '../content/es/site.js'
import s from './Contacto.module.css'

/** Cierre de la página: llamar o escribir, con la persona de contacto, su correo y su teléfono */
export default function Contacto() {
  const { contacto } = SITE
  const tel = `tel:${contacto.telefonoEnlace}`
  return (
    <section className={`dark pantalla iman ${s.end}`} id="contacto" aria-labelledby="contacto-titulo">
      <div className="wrap">
        <h2 id="contacto-titulo" className={s.h2}>
          {CONTACTO.titulo}
        </h2>
        <div className={s.botones}>
          <a className={`mono ${s.cta}`} href={mailto()}>
            {CONTACTO.boton}
          </a>
          <a className={`mono ${s.cta} ${s.secundario}`} href={tel}>
            {CONTACTO.llamar} · {contacto.telefono}
          </a>
        </div>
        <p className={`mono ${s.persona}`}>
          {contacto.nombre} · {contacto.cargo} · <a href={`mailto:${contacto.correo}`}>{contacto.correo}</a> ·{' '}
          <a href={tel}>{contacto.telefono}</a>
        </p>
      </div>
    </section>
  )
}
