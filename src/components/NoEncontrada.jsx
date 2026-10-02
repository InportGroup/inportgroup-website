import { NAV } from '../content/es/site.js'

export default function NoEncontrada() {
  return (
    <section className="wrap section">
      <p className="kicker">Página no encontrada</p>
      <h1 className="h2" style={{ marginTop: 16, maxWidth: '16ch' }}>
        Aquí no hay nada. Todo lo que contamos está en una sola página.
      </h1>
      <p className="lead" style={{ marginTop: 24 }}>
        Puede volver al <a href="/">inicio</a> o ir directamente a{' '}
        {NAV.map((n, i) => (
          <span key={n.ancla}>
            <a href={`/#${n.ancla}`}>{n.nombre.toLowerCase()}</a>
            {i < NAV.length - 2 ? ', ' : i === NAV.length - 2 ? ' o ' : '.'}
          </span>
        ))}
      </p>
    </section>
  )
}
