import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from 'react-router'
import Aviso from './components/Aviso.jsx'
import Footer from './components/Footer.jsx'
import Nav from './components/Nav.jsx'
import './styles/tokens.css'
import './styles/base.css'

// Solo peso 400 (GUIA.md, sección 4): el navegador no tiene de dónde sacar una negrita.
// La cursiva de Archivo solo la usan las notas dentro de los vídeos.
const FONTS =
  'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:ital,wght@0,400;1,400&family=Caveat:wght@400&family=Space+Mono:wght@400&display=swap'

export const links = () => [
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
  { rel: 'manifest', href: '/site.webmanifest' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  { rel: 'stylesheet', href: FONTS },
]

export function Layout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ecece8" />
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
  const titulo = isRouteErrorResponse(error) && error.status === 404 ? 'Esta página no existe.' : 'Algo ha fallado.'
  return <Aviso titulo={titulo} texto="Si el problema sigue, escríbenos y lo miramos." />
}
