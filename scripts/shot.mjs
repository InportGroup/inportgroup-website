// Captura de pantalla con emulación real de dispositivo (CDP). Traído de InLux y adaptado a las rutas.
//
//   node scripts/shot.mjs <ruta o escena> [ancho] [alto] [salida.png] [espera_ms]
//   node scripts/shot.mjs / 1440 1800
//   node scripts/shot.mjs /campo 390 1500
//   node scripts/shot.mjs "prueba&t=14&freeze=1" 1440 1000      escena del laboratorio, segundo 14, congelada
//
// Requiere el servidor de desarrollo en http://localhost:5190 (npm run dev) o INPORT_URL.

import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { urlFor, withPage } from './cdp.mjs'

const [spec = '/', w = '1440', h = '1800', outArg, waitArg] = process.argv.slice(2)
const name = spec === '/' ? 'portada' : spec.replace(/^\//, '').replace(/[^a-zA-Z0-9]+/g, '_')
const out = path.resolve(outArg || `.shots/${name}_${w}.png`)
mkdirSync(path.dirname(out), { recursive: true })

try {
  await withPage({ url: urlFor(spec), width: Number(w), height: Number(h), wait: waitArg ? Number(waitArg) : 3500 }, async (page) => {
    const overflow = await page.evaluate('document.documentElement.scrollWidth - window.innerWidth')
    const { data } = await page.send('Page.captureScreenshot', { format: 'png' })
    writeFileSync(out, Buffer.from(data, 'base64'))
    console.log(`Captura en ${out}`)
    if (overflow > 1) console.log(`Aviso: la página desborda ${overflow} px en horizontal a ${w} px de ancho.`)
    const errors = page.logs.filter((l) => ['error', 'exception'].includes(l.level))
    for (const e of errors) console.log(`[${e.level}] ${e.text.slice(0, 300)}`)
  })
} catch (err) {
  console.error(`No se pudo capturar: ${err.message}`)
  process.exit(1)
}
