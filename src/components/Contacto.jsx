import { SITE, mailto } from '../content/es/site.js'
import { TextButton } from './Controls.jsx'
import s from './Contacto.module.css'

/** Bloque de contacto al final de cada página. asunto: lo que llega ya escrito en el correo. */
export default function Contacto({ asunto = 'Una consulta desde la web', titulo = 'Cuéntenos qué pasa en su finca, su planta o su tienda.' }) {
  return (
    <section id="contacto" className={`wrap ${s.contacto}`} aria-labelledby="contacto-titulo">
      <p className="kicker">Contacto</p>
      <h2 id="contacto-titulo" className="h2">
        {titulo}
      </h2>
      <div className={s.body}>
        <p className="prose">
          Si vemos que podemos ayudar, le proponemos una visita y un piloto pequeño. Si no, se lo decimos en la primera llamada.
        </p>
        <div className={s.person}>
          <p>{SITE.contacto.nombre}</p>
          <p className={s.role}>{SITE.contacto.cargo}</p>
          <a href={`mailto:${SITE.contacto.correo}`} className={s.mail}>
            {SITE.contacto.correo}
          </a>
          <TextButton href={mailto(asunto)} className={s.button}>
            Escribir un correo
          </TextButton>
        </div>
      </div>
    </section>
  )
}
