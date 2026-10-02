import { CONTACTO } from '../content/es/pagina.js'
import { SITE, mailto } from '../content/es/site.js'
import Cabecera from '../sections/Cabecera.jsx'
import { TextButton } from './Controls.jsx'
import s from './Contacto.module.css'

/** Cierre de la página: vuelve al método (diagnóstico y piloto). asunto: lo que llega ya escrito en el correo. */
export default function Contacto({ asunto = 'Una consulta desde la web' }) {
  return (
    <section id="contacto" className={`wrap ${s.contacto}`} aria-labelledby="contacto-titulo">
      <Cabecera id="contacto-titulo" numero={CONTACTO.numero} kicker={CONTACTO.kicker} titulo={CONTACTO.titulo} entradilla={CONTACTO.texto} />
      <div className={s.body}>
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
