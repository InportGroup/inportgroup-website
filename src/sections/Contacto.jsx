import { CONTACTO } from '../content/es/pagina.js'
import { SITE, mailto } from '../content/es/site.js'
import s from './Contacto.module.css'

/** Cierre de la página: vuelve al método (diagnóstico y piloto) */
export default function Contacto() {
  const { contacto } = SITE
  return (
    <section className={`dark ${s.end}`} id="contacto" aria-labelledby="contacto-titulo">
      <div className="wrap">
        <h2 id="contacto-titulo" className={s.h2}>
          {CONTACTO.titulo}
        </h2>
        <p className={s.text}>{CONTACTO.texto}</p>
        <a className={`mono ${s.cta}`} href={mailto()}>
          {CONTACTO.boton}
        </a>
        <p className={`mono ${s.persona}`}>
          {contacto.nombre} · {contacto.cargo} · <a href={`mailto:${contacto.correo}`}>{contacto.correo}</a>
        </p>
      </div>
    </section>
  )
}
