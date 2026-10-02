// Registro de escenas. Cada una se carga por separado.
// aspect se repite aquí para que el hueco reservado mientras carga tenga ya su tamaño.

export const ESCENAS = {
  panorama: { nombre: 'Panorama', aspect: '21 / 8', cargar: () => import('./panorama/index.jsx') },
  recorrido: { nombre: 'Recorrido del dato', aspect: '8 / 3', cargar: () => import('./recorrido/index.jsx') },
  cultivo: { nombre: 'Cultivos leñosos', aspect: '16 / 9', cargar: () => import('./cultivo/index.jsx') },
  cebo: { nombre: 'Ganadería de cebo', aspect: '16 / 9', cargar: () => import('./cebo/index.jsx') },
  obra: { nombre: 'Construcción', aspect: '16 / 9', cargar: () => import('./obra/index.jsx') },
  hornos: { nombre: 'Valorización energética', aspect: '16 / 9', cargar: () => import('./hornos/index.jsx') },
  procesos: { nombre: 'Automatización de procesos', aspect: '16 / 9', cargar: () => import('./procesos/index.jsx') },
  boutique: { nombre: 'Tiendas de lujo', aspect: '16 / 9', cargar: () => import('./boutique/index.jsx') },
  astilleros: { nombre: 'Astilleros', aspect: '16 / 9', cargar: () => import('./astilleros/index.jsx') },
}
