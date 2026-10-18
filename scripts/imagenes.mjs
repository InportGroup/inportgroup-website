// Genera las imágenes fijas de public/ a partir de HTML, con Chrome sin interfaz (CDP):
//   apple-touch-icon.png   180 × 180, el icono de la pantalla de inicio en iPhone e iPad
//   icon-192.png, icon-512.png   los iconos del manifiesto (Android, accesos directos)
//   og-image.png           1200 × 630, la imagen al compartir en LinkedIn, WhatsApp, X o Slack
//
//   node scripts/imagenes.mjs
//
// Solo hace falta volver a lanzarlo si cambian el logotipo, el titular o los colores.

import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { withPage } from './cdp.mjs'
import { PORTADA } from '../src/content/es/pagina.js'

const PAPER = '#f2efe8'
const INK = '#16181a'
const FONTS =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=Newsreader:opsz,wght@6..72,300&display=swap'

// El mismo trazo que src/components/Logo.jsx
const marca = (size, stroke = 1.6) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 28 28"><path d="M11 5.5H22.5V22.5H11" fill="none" stroke="${INK}" stroke-width="${stroke}"/><circle cx="6" cy="14" r="2.4" fill="${INK}"/></svg>`

const icono = (size) => `<!doctype html><html><body style="margin:0;width:${size}px;height:${size}px;background:${PAPER};display:grid;place-items:center">
${marca(Math.round(size * 0.62), 1.9)}</body></html>`

const SECTORES = [
  ['Industria', '#eb6834'],
  ['Automatización de procesos', '#4a3aa7'],
  ['Retail', '#eda100'],
  ['Agricultura y ganadería', '#1baf7a'],
]

const og = `<!doctype html><html><head><link rel="stylesheet" href="${FONTS}"><style>
body{margin:0;width:1200px;height:630px;background:${PAPER};color:${INK};box-sizing:border-box;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
.logo{display:flex;align-items:center;gap:14px;font:300 44px 'Newsreader',Georgia,serif}
h1{margin:0;font:300 76px/1.04 'Newsreader',Georgia,serif;letter-spacing:-0.015em;max-width:980px}
.pie{display:flex;justify-content:space-between;align-items:flex-end;font:15px 'IBM Plex Mono',monospace;letter-spacing:.06em;text-transform:uppercase;color:#4a4d50;border-top:1px solid rgba(22,24,26,.32);padding-top:22px}
.sec{display:flex;gap:26px}.sec span{display:flex;align-items:center;gap:9px}.sec i{width:10px;height:10px;display:inline-block}
</style></head><body>
<div class="logo">${marca(46)}inport</div>
<h1>${PORTADA.titulo}</h1>
<div class="pie"><div class="sec">${SECTORES.map(([n, c]) => `<span><i style="background:${c}"></i>${n}</span>`).join('')}</div><span>inportgroup.com</span></div>
</body></html>`

const TAREAS = [
  ['apple-touch-icon.png', icono(180), 180, 180],
  ['icon-192.png', icono(192), 192, 192],
  ['icon-512.png', icono(512), 512, 512],
  ['og-image.png', og, 1200, 630],
]

for (const [nombre, html, width, height] of TAREAS) {
  const url = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
  await withPage({ url, width, height, mobile: false, wait: 1500 }, async (page) => {
    const { data } = await page.send('Page.captureScreenshot', { format: 'png' })
    const out = path.resolve('public', nombre)
    writeFileSync(out, Buffer.from(data, 'base64'))
    console.log(`${nombre} · ${width} × ${height}`)
  })
}
