// Textos generales de la web: marca, navegación, contacto y pie.

export const SITE = {
  nombre: 'Inport',
  dominio: 'https://www.inportgroup.com',
  descripcion:
    'Soluciones digitales a medida para cualquier sector. Buscamos dónde está el valor, nos centramos en eso y resolvemos los proyectos complejos que no se pueden comprar hechos.',
  contacto: {
    nombre: 'Beatriz Abuelo',
    cargo: 'Directora de soluciones',
    correo: 'beatriz.abuelo@inportgroup.com',
  },
}

// Navegación de la página única: cada enlace baja a su sección (GUIA.md, sección 7.1).
export const NAV = [
  { ancla: 'nosotros', nombre: 'Quiénes somos' },
  { ancla: 'hacemos', nombre: 'Qué hacemos' },
  { ancla: 'casos', nombre: 'Casos de uso' },
  { ancla: 'maquetas', nombre: 'Maquetas' },
]

/** Metadatos de una página: título, descripción, canónica y tarjetas para compartir */
export function seo({ titulo, descripcion = SITE.descripcion, ruta = '/', indexar = true }) {
  const title = titulo ? `${titulo} · Inport` : 'Inport · Soluciones digitales a medida para cualquier sector'
  const url = `${SITE.dominio}${ruta === '/' ? '/' : ruta}`
  return [
    { title },
    { name: 'description', content: descripcion },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Inport' },
    { property: 'og:locale', content: 'es_ES' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: descripcion },
    { property: 'og:url', content: url },
    { name: 'twitter:card', content: 'summary' },
    ...(indexar ? [] : [{ name: 'robots', content: 'noindex, nofollow' }]),
  ]
}

/** Enlace de correo con el asunto ya escrito según la página de origen */
export function mailto(asunto = 'Una consulta desde la web') {
  return `mailto:${SITE.contacto.correo}?subject=${encodeURIComponent(asunto)}`
}
