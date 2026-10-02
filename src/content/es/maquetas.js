// Maquetas completas que ya existen (GUIA.md, secciones 2.2 y 7.4). Comprobadas el 2 de octubre de 2026.
// acceso: 'abierta' | 'contrasena' | 'privada'. Las privadas no llevan dirección: se piden por correo y se
// comparten en privado. No escribir aquí su URL: este repositorio es público y acabaría en el JavaScript publicado.
// despierta: está en el plan gratuito de Render y tarda cerca de un minuto en la primera visita.

export const MAQUETAS = [
  {
    id: 'combustion',
    nombre: 'Combustion Vision',
    sector: 'industria',
    solucion: 'hornos',
    url: null,
    acceso: 'privada',
    despierta: false,
    resumen:
      'Del vídeo de la parrilla a los datos del sistema de control: la malla de 5 × 4, el frente de llama, la lente sucia y la cámara que vuelve girada de un mantenimiento.',
  },
  {
    id: 'naval',
    nombre: 'Inspección naval',
    sector: 'industria',
    solucion: 'astilleros',
    url: 'https://arnaucarol-inportgroup.github.io/naval-solutions/',
    acceso: 'abierta',
    despierta: false,
    resumen:
      'Casco, cubierta y carga inspeccionados con dron, con un modelo 3D real de un contenedor que se puede girar en el navegador.',
  },
  {
    id: 'inlux',
    nombre: 'InLux',
    sector: 'retail',
    solucion: 'boutique',
    url: null,
    acceso: 'privada',
    despierta: true,
    resumen:
      'Recorridos anónimos, calor, escaparate, interés por pieza, origen de la clientela, previsión de afluencia y el informe del lunes, sobre una tienda piloto de belleza y moda.',
  },
  {
    id: 'pistacho',
    nombre: 'Pistacho',
    sector: 'campo',
    solucion: 'cultivo',
    url: 'https://pistacho-mockup.onrender.com/',
    acceso: 'abierta',
    despierta: true,
    resumen:
      'Heladas en floración, conteo de racimos, estrés hídrico árbol a árbol, trampas que clasifican insectos y la línea de cribado. Veintidós gráficos hechos a mano sobre una finca de demostración.',
  },
]

export const maquetaPorId = (id) => MAQUETAS.find((m) => m.id === id) || null
