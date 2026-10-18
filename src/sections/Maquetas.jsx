import { TextButton } from '../components/Controls.jsx'
import { EJEMPLOS } from '../content/es/ejemplos.js'
import { MAQUETAS } from '../content/es/maquetas.js'
import { MAQUETAS_CABECERA } from '../content/es/pagina.js'
import { sectorPorId } from '../content/es/sectores.js'
import { mailto } from '../content/es/site.js'
import Cabecera from './Cabecera.jsx'
import s from './Maquetas.module.css'

const ACCESO = {
  abierta: 'Abierta',
  contrasena: 'Con contraseña',
  privada: 'Privada, bajo petición',
}

export default function Maquetas() {
  return (
    <section id="maquetas" className={`wrap section ${s.maquetas}`} aria-labelledby="maquetas-titulo">
      <Cabecera id="maquetas-titulo" numero={MAQUETAS_CABECERA.numero} kicker={MAQUETAS_CABECERA.kicker} titulo={MAQUETAS_CABECERA.titulo} entradilla={MAQUETAS_CABECERA.entradilla} />
      <ul className={s.lista}>
        {MAQUETAS.map((m) => {
          const sec = sectorPorId(m.sector)
          const abierta = m.acceso === 'abierta'
          return (
            <li key={m.id} className={s.maqueta}>
              <p className="kicker">
                <span className="mark" style={{ '--c': `var(--${sec.color})` }} aria-hidden="true" />
                {sec.nombre}
              </p>
              <h3 className={`h3 ${s.nombre}`} lang={m.idioma}>
                {m.nombre}
              </h3>
              <p className={s.resumen}>{m.resumen}</p>
              <p className={s.acceso}>
                {ACCESO[m.acceso]}
                {abierta && m.despierta ? ' · la primera carga tarda cerca de un minuto' : ''}
              </p>
              <div className={s.acciones}>
                {abierta ? (
                  <TextButton href={m.url} external className={s.boton}>
                    Abrir la maqueta<span className="visually-hidden"> {m.nombre}</span>
                  </TextButton>
                ) : (
                  <TextButton href={mailto(`Acceso a la maqueta ${m.nombre}`)} className={s.boton}>
                    Pedir acceso<span className="visually-hidden"> a la maqueta {m.nombre}</span>
                  </TextButton>
                )}
                <a href={`#${m.solucion}`} className={s.ejemplo}>
                  Ver el caso de uso<span className="visually-hidden">: {EJEMPLOS.find((e) => e.id === m.solucion)?.titulo}</span>
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
