/** Bloque sencillo para errores y página no encontrada */
export default function Aviso({ titulo, texto }) {
  return (
    <section className="wrap" style={{ paddingBlock: 'var(--section)' }}>
      <h1 style={{ fontSize: 'clamp(40px, 7vw, 96px)', maxWidth: '14ch' }}>{titulo}</h1>
      <p style={{ marginTop: 24, maxWidth: '46ch', fontSize: 20 }}>
        {texto} <a href="/">Ir a la portada</a>
      </p>
    </section>
  )
}
