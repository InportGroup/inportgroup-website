// Comprueba las reglas de la casa (GUIA.md, sección 3 y 11). Traído de InLux y adaptado a las rutas.
//
// En el navegador, a 1440 y a 390 px, en cada ruta:
//   ningún guion visible (texto, SVG, aria-label, title, placeholder, alt, título de la página, descripción),
//   ninguna etiqueta b o strong, ningún texto con peso calculado mayor que 400, ningún desbordamiento horizontal,
//   ningún error en la consola.
// En el código fuente: ningún peso tipográfico prohibido.
// En build/client, si existe: títulos, descripciones y metadatos del HTML prerenderizado, y rutas sin guiones.
//
//   node scripts/check.mjs all                 todas las rutas prerenderizadas
//   node scripts/check.mjs /campo              una ruta
//   node scripts/check.mjs "prueba&t=14"       una escena del laboratorio
//
// Requiere el servidor de desarrollo en http://localhost:5190 (npm run dev) o INPORT_URL.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import config from '../react-router.config.js'
import { urlFor, withPage } from './cdp.mjs'

const target = process.argv[2] || 'all'
const DASH = /[-‐-―−]/

const INSPECT = `(() => {
  const problems = []
  const dash = /[\\u002D\\u2010-\\u2015\\u2212]/
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const p = n.parentElement
      if (!p) return NodeFilter.FILTER_REJECT
      const tag = p.tagName.toLowerCase()
      return tag === 'script' || tag === 'style' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    },
  })
  let count = 0
  while (walker.nextNode()) {
    const t = walker.currentNode.nodeValue.trim()
    if (!t) continue
    count++
    if (dash.test(t)) problems.push('Guion en texto visible: "' + t.slice(0, 120) + '"')
  }
  document.querySelectorAll('[aria-label],[title],[placeholder],[alt]').forEach((el) => {
    for (const a of ['aria-label', 'title', 'placeholder', 'alt']) {
      const v = el.getAttribute(a)
      if (v && dash.test(v)) problems.push('Guion en atributo ' + a + ': "' + v.slice(0, 120) + '"')
    }
  })
  if (dash.test(document.title)) problems.push('Guion en el título de la página: "' + document.title + '"')
  const desc = document.querySelector('meta[name="description"]')
  if (desc && dash.test(desc.content)) problems.push('Guion en la descripción: "' + desc.content.slice(0, 120) + '"')
  if (document.querySelector('b, strong')) problems.push('Hay etiquetas <b> o <strong>.')
  const heavy = new Set()
  document.querySelectorAll('body *').forEach((el) => {
    const hasText = Array.from(el.childNodes).some((c) => c.nodeType === 3 && c.nodeValue.trim())
    if (!hasText) return
    const w = parseInt(getComputedStyle(el).fontWeight, 10)
    if (w > 400) heavy.add(el.tagName.toLowerCase() + ' (' + w + '): "' + el.textContent.trim().slice(0, 60) + '"')
  })
  heavy.forEach((h) => problems.push('Peso tipográfico mayor que 400 en ' + h))
  const overflow = document.documentElement.scrollWidth - window.innerWidth
  return { count, problems, overflow }
})()`

const routes = target === 'all' ? await config.prerender() : [target]
const problems = []
let texts = 0

for (const route of routes) {
  if (DASH.test(route.split('?')[0]) && route.startsWith('/')) problems.push(`Ruta con guion: ${route}`)
  for (const [width, height] of [
    [1440, 1400],
    [390, 1400],
  ]) {
    try {
      await withPage({ url: urlFor(route), width, height, wait: 3500 }, async (page) => {
        const res = await page.evaluate(INSPECT)
        texts += res.count
        const where = `${route}${width < 700 ? ' (móvil)' : ''}`
        for (const p of res.problems) problems.push(`${where}: ${p}`)
        if (res.overflow > 1) problems.push(`${where}: desbordamiento horizontal de ${res.overflow} px.`)
        for (const l of page.logs) {
          if (['error', 'exception'].includes(l.level) && !/favicon|\[vite\]/.test(l.text)) problems.push(`${where}: consola [${l.level}] ${l.text.slice(0, 200)}`)
        }
      })
    } catch (err) {
      console.error(`No se pudo revisar ${route}: ${err.message}. ¿Está arrancado npm run dev?`)
      process.exit(1)
    }
  }
}

// Código fuente: pesos prohibidos en CSS y JSX
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
for (const f of walk(path.resolve('src')).filter((f) => /\.(css|jsx?|mjs)$/.test(f))) {
  const src = readFileSync(f, 'utf8')
  for (const m of src.matchAll(/font-?weight\s*[:=]\s*['"{]?\s*['"]?(\d{3}|bold|bolder)/gi)) {
    const v = m[1].toLowerCase()
    if (v === 'bold' || v === 'bolder' || Number(v) > 400) problems.push(`${path.relative(process.cwd(), f)}: ${m[0]}`)
  }
}

// HTML prerenderizado: lo que leen los buscadores y las redes al compartir
const built = path.resolve('build/client')
if (existsSync(built)) {
  for (const f of walk(built).filter((f) => f.endsWith('.html'))) {
    const html = readFileSync(f, 'utf8')
    const rel = path.relative(built, f)
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] || ''
    if (DASH.test(title)) problems.push(`build/${rel}: guion en el título "${title}"`)
    for (const m of html.matchAll(/<meta (?:name|property)="(description|og:title|og:description|twitter:title)" content="([^"]*)"/g)) {
      if (DASH.test(m[2])) problems.push(`build/${rel}: guion en ${m[1]} "${m[2].slice(0, 100)}"`)
    }
  }
}

console.log(`Rutas revisadas: ${routes.length} · nodos de texto: ${texts}`)
if (problems.length) {
  const unique = [...new Set(problems)]
  console.log(`\n${unique.length} problema(s):`)
  for (const p of unique) console.log(`  ${p}`)
  process.exit(2)
}
console.log('Sin guiones visibles, sin negritas, sin desbordamientos y sin errores en consola.')
