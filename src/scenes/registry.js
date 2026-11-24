// Registro de escenas: una por sector. Cada una se carga por separado cuando se acerca a la pantalla.

export const ESCENAS = {
  astilleros: { cargar: () => import('./astilleros/index.jsx') },
  hornos: { cargar: () => import('./hornos/index.jsx') },
  cultivo: { cargar: () => import('./cultivo/index.jsx') },
  boutique: { cargar: () => import('./boutique/index.jsx') },
}
