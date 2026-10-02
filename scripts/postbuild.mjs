// Después de compilar: deja build/client listo para GitHub Pages.
//   404.html      la página de reserva de la SPA, para rutas que no se prerenderizaron
//   sitemap.xml   todas las rutas prerenderizadas menos el laboratorio
//   CNAME y .nojekyll, por si la copia de public/ no los hubiera traído

import { copyFileSync, existsSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import config from '../react-router.config.js'
import { SITE } from '../src/content/es/site.js'

const out = path.resolve('build/client')
if (!existsSync(out)) {
  console.error('No existe build/client. ¿Ha fallado la compilación?')
  process.exit(1)
}

const fallback = path.join(out, '__spa-fallback.html')
if (existsSync(fallback)) copyFileSync(fallback, path.join(out, '404.html'))
else console.warn('Aviso: no encuentro __spa-fallback.html; no se crea 404.html.')

if (!existsSync(path.join(out, 'CNAME'))) writeFileSync(path.join(out, 'CNAME'), 'www.inportgroup.com\n')
if (!existsSync(path.join(out, '.nojekyll'))) writeFileSync(path.join(out, '.nojekyll'), '')

const rutas = (await config.prerender()).filter((r) => !r.startsWith('/laboratorio'))
const hoy = new Date().toISOString().slice(0, 10)
const urls = rutas
  .map((r) => `  <url>\n    <loc>${SITE.dominio}${r}</loc>\n    <lastmod>${hoy}</lastmod>\n    <priority>${r === '/' ? '1.0' : '0.8'}</priority>\n  </url>`)
  .join('\n')
writeFileSync(
  path.join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)

console.log(`Listo para publicar: ${rutas.length} rutas en sitemap.xml, 404.html, CNAME.`)
