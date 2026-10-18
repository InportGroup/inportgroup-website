// Textos generales de la web: marca, navegación, contacto y pie.

export const SITE = {
  nombre: 'Inport',
  dominio: 'https://www.inportgroup.com',
  // Metadescripción: por debajo de 1.000 px en el buscador (unos 145 caracteres) y con las palabras del titular
  descripcion:
    'Soluciones digitales a medida para problemas complejos en industria, retail y agricultura: medición, predicción, integración y automatización.',
  // Imagen para compartir (1200 × 630) e iconos: se generan con scripts/imagenes.mjs
  imagen: '/og-image.png',
  contacto: {
    nombre: 'Beatriz Abuelo',
    cargo: 'Directora de soluciones',
    correo: 'beatriz.abuelo@inportgroup.com',
  },
}

// Navegación de la página única: cada enlace baja a su sección (GUIA.md, sección 7.1).
// pie: el mismo enlace en el pie, dicho de otra forma para no repetir el texto de la cabecera.
export const NAV = [
  { ancla: 'nosotros', nombre: 'Quiénes somos', pie: 'Equipo y método de trabajo' },
  { ancla: 'hacemos', nombre: 'Qué hacemos', pie: 'Medir, anticipar, integrar y automatizar' },
  { ancla: 'casos', nombre: 'Casos de uso', pie: 'Casos de industria, retail y campo' },
  { ancla: 'maquetas', nombre: 'Maquetas', pie: 'Prototipos completos' },
]

/** Metadatos de una página: título, descripción, canónica, tarjetas para compartir y datos estructurados */
export function seo({ titulo, descripcion = SITE.descripcion, ruta = '/', indexar = true }) {
  const title = titulo ? `${titulo} · Inport` : 'Inport · Soluciones digitales a medida para problemas complejos'
  const url = `${SITE.dominio}${ruta === '/' ? '/' : ruta}`
  const imagen = `${SITE.dominio}${SITE.imagen}`
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
    { property: 'og:image', content: imagen },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'Inport. Soluciones digitales a medida para problemas complejos' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: descripcion },
    { name: 'twitter:image', content: imagen },
    ...(indexar ? [{ 'script:ld+json': datosEstructurados() }] : [{ name: 'robots', content: 'noindex, nofollow' }]),
  ]
}

/** Datos estructurados (schema.org) para que el buscador sepa quién es Inport, qué hace y cómo contactar */
function datosEstructurados() {
  const id = `${SITE.dominio}/#organizacion`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': id,
        name: SITE.nombre,
        url: `${SITE.dominio}/`,
        logo: `${SITE.dominio}/icon-512.png`,
        image: `${SITE.dominio}${SITE.imagen}`,
        description: SITE.descripcion,
        email: SITE.contacto.correo,
        areaServed: 'ES',
        knowsLanguage: ['es', 'en'],
        knowsAbout: [
          'Desarrollo de software a medida',
          'Visión artificial',
          'Predicción con datos',
          'Integración de sistemas',
          'Automatización de procesos',
          'Industria',
          'Retail',
          'Agricultura y ganadería',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          name: SITE.contacto.nombre,
          email: SITE.contacto.correo,
          availableLanguage: ['es', 'en'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.dominio}/#web`,
        url: `${SITE.dominio}/`,
        name: SITE.nombre,
        inLanguage: 'es',
        publisher: { '@id': id },
      },
    ],
  }
}

/** Enlaces para compartir la página, sin botones de terceros ni seguimiento: solo direcciones */
export function compartir(ruta = '/') {
  const url = `${SITE.dominio}${ruta}`
  const texto = 'Inport · Soluciones digitales a medida para problemas complejos'
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(texto)
  return [
    { red: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { red: 'X', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { red: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}` },
    { red: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { red: 'Correo', href: `mailto:?subject=${t}&body=${u}` },
  ]
}

/** Enlace de correo con el asunto ya escrito según la página de origen */
export function mailto(asunto = 'Una consulta desde la web') {
  return `mailto:${SITE.contacto.correo}?subject=${encodeURIComponent(asunto)}`
}
