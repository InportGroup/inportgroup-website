import { TextButton } from '../components/Controls.jsx'
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
      <Cabecera id="maquetas-titulo" kicker={MAQUETAS_CABECERA.kicker} titulo={MAQUETAS_CABECERA.titulo} entradilla={MAQUETAS_CABECERA.entradilla} />
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
              <h3 className={`h3 ${s.nombre}`}>{m.nombre}</h3>
              <p className={s.resumen}>{m.resumen}</p>
              <p className={s.acceso}>
                {ACCESO[m.acceso]}
                {abierta && m.despierta ? ' · la primera carga tarda cerca de un minuto' : ''}
              </p>
              <div className={s.acciones}>
                {abierta ? (
                  <TextButton href={m.url} external className={s.boton}>
                    Abrir la maqueta
                  </TextButton>
                ) : (
                  <TextButton href={mailto(`Acceso a la maqueta ${m.nombre}`)} className={s.boton}>
                    Pedir acceso
                  </TextButton>
                )}
                <a href={`#${m.solucion}`} className={s.ejemplo}>
                  Ver el ejemplo
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
