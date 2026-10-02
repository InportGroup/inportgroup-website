// Verificación completa de una escena. Traído de InLux y adaptado:
//   1. Compila solo el módulo de la escena (sus errores no dependen del resto).
//   2. La abre en el laboratorio con Chrome sin interfaz y recoge errores y avisos de la consola,
//      y cuenta los nodos SVG frente al presupuesto (GUIA.md, sección 5).
//   3. Pasa las reglas de la casa sobre esa escena.
//
//   node scripts/verify.mjs <escena>          por ejemplo: node scripts/verify.mjs prueba
//
// Requiere npm run dev arrancado (http://localhost:5190).

import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { build } from 'vite'
import { urlFor, withPage } from './cdp.mjs'

const key = process.argv[2]
if (!key) {
  console.error('Indique la escena, por ejemplo: node scripts/verify.mjs prueba')
  process.exit(1)
}
const entry = path.resolve(`src/scenes/${key}/index.jsx`)
let failed = false

console.log(`1. Compilando ${path.relative(process.cwd(), entry)}`)
const outDir = mkdtempSync(path.join(tmpdir(), `inport-verify-${key}-`))
try {
  await build({
    configFile: false,
    logLevel: 'error',
    css: { modules: { localsConvention: 'camelCaseOnly' } },
    build: {
      outDir,
      emptyOutDir: true,
      write: false,
      minify: false,
      lib: { entry, formats: ['es'], fileName: 'module' },
      rollupOptions: { external: [/^react/, /^d3/] },
    },
  })
  console.log('   Compila sin errores.')
} catch (err) {
  failed = true
  console.log(`   Error de compilación:\n${String(err.message || err).split('\n').slice(0, 25).join('\n')}`)
}
try {
  rmSync(outDir, { recursive: true, force: true })
} catch {}

console.log('2. Consola del navegador y presupuesto de nodos')
try {
  await withPage({ url: urlFor(key), width: 1440, height: 1100, wait: 7000 }, async (page) => {
    const logs = page.logs.filter((l) => !/\[vite\]|React DevTools|Download the React/.test(l.text))
    const bad = logs.filter(
      (l) =>
        ['error', 'warning', 'exception', 'assert'].includes(l.level) ||
        /error|warning|uncaught|failed|not a function|NaN|Encountered|unique "key"|hydrat/i.test(l.text),
    )
    if (bad.length) {
      failed = true
      console.log(`   ${bad.length} mensaje(s) a revisar:`)
      for (const l of bad.slice(0, 30)) console.log(`   [${l.level}] ${l.text.slice(0, 400)}`)
    } else {
      console.log(`   Limpia (${logs.length} mensajes informativos).`)
    }
    const nodes = await page.evaluate('document.querySelectorAll("figure svg *").length')
    console.log(`   Nodos SVG de la escena tras 7 s: ${nodes}${nodes > 1500 ? ' (por encima del presupuesto de 1.500)' : ''}`)
    if (nodes > 1500) failed = true
  })
} catch (err) {
  failed = true
  console.log(`   No se pudo abrir la escena: ${err.message}`)
}

console.log('3. Reglas de la casa')
const check = spawnSync(process.execPath, [path.resolve('scripts/check.mjs'), key], { encoding: 'utf8', timeout: 150000 })
console.log(
  (check.stdout || '')
    .split('\n')
    .map((l) => `   ${l}`)
    .join('\n'),
)
if (check.status !== 0) failed = true

console.log(failed ? '\nHay cosas que corregir.' : '\nTodo en orden.')
process.exit(failed ? 2 : 0)
