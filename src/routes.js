import { index, route } from '@react-router/dev/routes'

// Una sola página (GUIA.md, sección 6) y la 404.
export default [index('routes/home.jsx'), route('*', 'routes/noencontrada.jsx')]
