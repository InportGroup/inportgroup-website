import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from 'react-router'
import Footer from './components/Footer.jsx'
import Nav from './components/Nav.jsx'
import './styles/tokens.css'
import './styles/base.css'

// Solo pesos 300 y 400 (GUIA.md, sección 4): el navegador no tiene de dónde sacar una negrita.
const FONTS =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=IBM+Plex+Sans:wght@300;400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300;1,6..72,400&display=swap'

export const links = () => [
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  { rel: 'stylesheet', href: FONTS },
]

export function Layout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f2efe8" />
        <Meta />
        <Links />
      </head>
      <body>
        <Nav />
        <main id="contenido">{children}</main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

// Página en blanco mientras carga una ruta que no se prerenderizó (404.html de GitHub Pages).
export function HydrateFallback() {
  return <div style={{ minHeight: '60vh' }} />
}

export function ErrorBoundary({ error }) {
  const titulo = isRouteErrorResponse(error) && error.status === 404 ? 'Esta página no existe' : 'Algo ha fallado'
  return (
    <section className="wrap section">
      <p className="kicker">Error</p>
      <h1 className="h2" style={{ marginTop: 16 }}>
        {titulo}
      </h1>
      <p className="lead" style={{ marginTop: 20 }}>
        Puede volver a la <a href="/">portada</a>. Si el problema sigue, escríbanos y lo miramos.
      </p>
    </section>
  )
}
