// Textos generales de la web: marca, navegación, contacto y metadatos.

export const SITE = {
  nombre: 'Inport',
  lema: 'Engineering the unexpected',
  dominio: 'https://www.inportgroup.com',
  // Metadescripción: unos 145 caracteres, con las palabras del título
  descripcion:
    'Soluciones digitales a medida para procesos que funcionan peor de lo que deberían: industria, construcción, marítimo, agricultura, ganadería y retail.',
  // Imagen para compartir (1200 × 630) e iconos: se generan con scripts/imagenes.mjs
  imagen: '/og-image.png',
  contacto: {
    nombre: 'Beatriz Abuelo',
    cargo: 'Directora de soluciones',
    correo: 'beatriz.abuelo@inportgroup.com',
    // Se muestra con espacios; el enlace tel: lleva el prefijo de España
    telefono: '674 35 25 00',
    telefonoEnlace: '+34674352500',
  },
}

/** Metadatos de una página: título, descripción, canónica, tarjetas para compartir y datos estructurados */
export function seo({ titulo, descripcion = SITE.descripcion, ruta = '/', indexar = true }) {
  // Solo la marca en la portada: en el buscador sale "Inport" y debajo la descripción
  const title = titulo ? `${titulo} · Inport` : 'Inport'
  const url = `${SITE.dominio}${ruta}`
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
    { property: 'og:image:alt', content: 'Inport' },
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
        slogan: SITE.lema,
        url: `${SITE.dominio}/`,
        logo: `${SITE.dominio}/icon-512.png`,
        image: `${SITE.dominio}${SITE.imagen}`,
        description: SITE.descripcion,
        email: SITE.contacto.correo,
        telephone: SITE.contacto.telefonoEnlace,
        areaServed: 'ES',
        knowsLanguage: ['es', 'en'],
        knowsAbout: [
          'Desarrollo de software a medida',
          'Visión artificial',
          'Inspección con dron',
          'Integración de sistemas',
          'Sector marítimo y portuario',
          'Industria',
          'Construcción',
          'Agricultura',
          'Ganadería',
          'Retail',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          name: SITE.contacto.nombre,
          email: SITE.contacto.correo,
          telephone: SITE.contacto.telefonoEnlace,
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

/** Enlace de correo con el asunto ya escrito */
export function mailto(asunto = 'Una consulta desde la web') {
  return `mailto:${SITE.contacto.correo}?subject=${encodeURIComponent(asunto)}`
}
