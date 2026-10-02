import { index, route } from '@react-router/dev/routes'

// Una sola página (GUIA.md, sección 6). El laboratorio es una herramienta interna para revisar escenas.
export default [index('routes/home.jsx'), route('laboratorio', 'routes/laboratorio.jsx'), route('*', 'routes/noencontrada.jsx')]
