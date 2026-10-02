import { useState } from 'react'
import { useIsNarrow } from '../../lib/hooks.js'
import { FilmBar, FilmCaption, FilmGrain, FilmSubtitle, useFilm } from './Film.jsx'
import { Cajetin, Stage } from './Stage.jsx'
import s from './ScenePlayer.module.css'

/**
 * Reproduce un módulo de escena (src/scenes/<id>/index.jsx) dentro de su marco.
 *
 * detail: 'alto' para la escena completa con cajetín, subtítulos y barra;
 *         'bajo' para miniaturas (sin cajetín ni barra, dibujo simplificado).
 * readQuery: atiende a ?t= y ?freeze de la URL (laboratorio y revisión).
 */
export default function ScenePlayer({ scene, detail = 'alto', readQuery = false, className = '' }) {
  const full = detail === 'alto'
  const film = useFilm({
    duration: scene.duration,
    scenes: scene.scenes,
    poster: scene.poster,
    loop: scene.loop ?? true,
    readQuery,
  })
  const [state, setState] = useState(scene.initialState ?? {})
  const narrow = useIsNarrow()
  const { Scene, Controls, frame = {} } = scene
  const aspect = (narrow && scene.aspectNarrow) || scene.aspect || '16 / 9'
  const reloj = typeof frame.reloj === 'function' ? frame.reloj(film.t) : frame.reloj

  return (
    <figure className={`${s.player} ${full ? '' : s.mini} ${className}`}>
      {full && <Cajetin lugar={frame.lugar} origen={frame.origen} reloj={reloj} />}
      <Stage ref={film.ref} aspect={aspect} marks={full} role="img" aria-label={scene.label}>
        <Scene film={film} state={state} setState={setState} narrow={narrow} detail={detail} />
        {full && !narrow && <FilmSubtitle film={film} />}
        <FilmGrain strength={full ? 1 : 0.6} />
      </Stage>
      {full && narrow && <FilmCaption film={film} />}
      {full && (
        <FilmBar film={film}>{Controls ? <Controls film={film} state={state} setState={setState} /> : null}</FilmBar>
      )}
    </figure>
  )
}
