import { FilmGrain, useFilm } from '../../components/film/Film.jsx'
import { Stage } from '../../components/film/Stage.jsx'
import { EJEMPLOS } from '../../content/es/ejemplos.js'
import { useIsNarrow } from '../../lib/hooks.js'
import panorama, { PARADAS, paradaEn } from './index.jsx'
import s from './Player.module.css'

// Reproductor del panorama en la portada: la escena a todo el ancho, sin cajetín, y debajo los casos de uso
// que recorre. Cada caso salta a su lugar en el panorama; el título del caso en curso baja a su apartado.

const numeroDe = (id) => EJEMPLOS.findIndex((e) => e.id === id) + 1

export default function PanoramaPlayer() {
  const film = useFilm({ duration: panorama.duration, scenes: panorama.scenes, poster: panorama.poster })
  const narrow = useIsNarrow()
  const actual = paradaEn(film.t)
  const parada = PARADAS[actual]
  const caso = EJEMPLOS.find((e) => e.id === parada.id)
  const { Scene } = panorama

  return (
    <div className={s.panorama}>
      <Stage ref={film.ref} aspect={narrow ? panorama.aspectNarrow : panorama.aspect} marks={false} role="img" aria-label={panorama.label}>
        <Scene film={film} narrow={narrow} />
        <FilmGrain strength={0.7} />
      </Stage>
      <div className={`wrap ${s.barra}`}>
        <button type="button" className={s.play} onClick={film.toggle} aria-label={film.playing ? 'Pausar el recorrido' : 'Reproducir el recorrido'} aria-pressed={film.playing}>
          <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
            {film.playing ? (
              <g fill="currentColor">
                <rect x="6" y="5" width="3.2" height="14" />
                <rect x="14.8" y="5" width="3.2" height="14" />
              </g>
            ) : (
              <path d="M7 4.5v15l12.5-7.5z" fill="currentColor" />
            )}
          </svg>
        </button>
        <p className={s.titulo}>Casos de uso</p>
        <ol className={s.horas}>
          {PARADAS.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                className={`${s.hora} ${i === actual ? s.activa : ''}`}
                aria-pressed={i === actual}
                onClick={() => film.seek(p.llega + 0.01)}
              >
                <span className="mark" style={{ '--c': p.color }} aria-hidden="true" />
                {p.etiqueta}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className={`wrap ${s.frase}`} aria-live="polite">
        <p key={actual} className={s.texto}>
          <span className={s.num}>Caso de uso {numeroDe(parada.id)}</span> {caso?.titulo}.{' '}
          <a href={`#${parada.id}`} className={s.ver}>
            Ver el caso
          </a>
        </p>
      </div>
    </div>
  )
}
