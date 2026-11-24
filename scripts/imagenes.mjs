// Genera las imágenes fijas de public/ a partir de HTML, con Chrome sin interfaz (CDP):
//   apple-touch-icon.png   180 × 180, el icono de la pantalla de inicio en iPhone e iPad
//   icon-192.png, icon-512.png   los iconos del manifiesto (Android, accesos directos)
//   og-image.png           1200 × 630, la imagen al compartir en LinkedIn, WhatsApp, X o Slack
//
//   node scripts/imagenes.mjs
//
// Solo hace falta volver a lanzarlo si cambian la marca, el titular o los colores.

import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { withPage } from './cdp.mjs'
import { PORTADA } from '../src/content/es/pagina.js'
import { SITE } from '../src/content/es/site.js'

const PAPER = '#ecece8'
const INK = '#0c0c0b'
const LIME = '#ccff00'
const FONTS = 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400&family=Space+Mono&display=swap'

// El mismo dibujo que public/favicon.svg: una I y un punto sobre lima
const marca = (size) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 28 28"><rect width="28" height="28" fill="${LIME}"/><rect x="8" y="5" width="5.5" height="18" fill="${INK}"/><rect x="16" y="17.5" width="5.5" height="5.5" fill="${INK}"/></svg>`

const icono = (size) => `<!doctype html><html><body style="margin:0;width:${size}px;height:${size}px;overflow:hidden">${marca(size)}</body></html>`

const { antes, marca: resaltado, despues } = PORTADA.titulo
const og = `<!doctype html><html><head><link rel="stylesheet" href="${FONTS}"><style>
body{margin:0;width:1200px;height:630px;background:${PAPER};color:${INK};box-sizing:border-box;padding:56px 72px;display:flex;flex-direction:column;justify-content:space-between}
.top{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid ${INK};padding-bottom:20px}
.logo{font:400 40px 'Archivo Black',sans-serif;letter-spacing:-.03em}
.tag{font:400 17px 'Space Mono',monospace;border:2px solid ${INK};padding:4px 12px}
h1{margin:0;font:400 92px/.95 'Archivo Black',sans-serif;letter-spacing:-.02em;max-width:1040px}
mark{background:linear-gradient(transparent .2em,${LIME} .2em,${LIME} calc(100% - .2em),transparent calc(100% - .2em));color:${INK};padding:0 .1em}
.pie{display:flex;justify-content:space-between;font:400 19px 'Space Mono',monospace}
</style></head><body>
<div class="top"><span class="logo">INPORT</span><span class="tag">${SITE.lema}</span></div>
<h1>${antes}<mark>${resaltado}</mark>${despues}</h1>
<div class="pie"><span>Soluciones digitales a medida</span><span>inportgroup.com</span></div>
</body></html>`

const TAREAS = [
  ['apple-touch-icon.png', icono(180), 180, 180],
  ['icon-192.png', icono(192), 192, 192],
  ['icon-512.png', icono(512), 512, 512],
  ['og-image.png', og, 1200, 630],
]

for (const [nombre, html, width, height] of TAREAS) {
  const url = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
  await withPage({ url, width, height, mobile: false, wait: 2000 }, async (page) => {
    const { data } = await page.send('Page.captureScreenshot', { format: 'png' })
    const out = path.resolve('public', nombre)
    writeFileSync(out, Buffer.from(data, 'base64'))
    console.log(`${nombre} · ${width} × ${height}`)
  })
}
