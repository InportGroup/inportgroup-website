// Control de Chrome sin interfaz por el protocolo de depuración (CDP), con emulación real de dispositivo.
// Chrome sin interfaz no baja de unos 500 px de ancho de ventana; con CDP la vista mide exactamente lo pedido.
// Se puede usar en paralelo: cada llamada abre su propio Chrome con un perfil temporal.

import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

export const BASE = process.env.INPORT_URL || 'http://localhost:5190'

export function findChrome() {
  return [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ]
    .filter(Boolean)
    .find((c) => existsSync(c))
}

/**
 * Ruta o escena → URL.
 *   "/industria/hornos"            una página
 *   "prueba&t=12&freeze=1"         una escena en el laboratorio, en el segundo 12 y congelada
 */
export function urlFor(spec = '/') {
  const str = String(spec)
  if (str.startsWith('/')) return `${BASE}${str}`
  const [key, ...extra] = str.split('&')
  return `${BASE}/laboratorio?${[`escena=${key}`, ...extra].join('&')}`
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Abre una página con la vista indicada y ejecuta fn(page).
 * page.send(method, params) envía un comando CDP; page.logs contiene consola, excepciones y registros.
 * page.evaluate(expr) devuelve el valor de una expresión JavaScript en la página.
 */
export async function withPage({ url, width = 1440, height = 900, wait = 3000, mobile = width < 700, reducedMotion = false }, fn) {
  const chrome = findChrome()
  if (!chrome) throw new Error('No encuentro Chrome. Defina CHROME_PATH.')
  const profile = mkdtempSync(path.join(tmpdir(), 'inport-cdp-'))
  const proc = spawn(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--mute-audio',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      `--user-data-dir=${profile}`,
      '--remote-debugging-port=0',
      'about:blank',
    ],
    { stdio: 'ignore' },
  )
  let ws
  try {
    const portFile = path.join(profile, 'DevToolsActivePort')
    const started = Date.now()
    while (!existsSync(portFile)) {
      if (Date.now() - started > 20000) throw new Error('Chrome no ha arrancado a tiempo.')
      await sleep(50)
    }
    let lines = []
    while (lines.length < 2) {
      lines = readFileSync(portFile, 'utf8').trim().split('\n')
      if (lines.length < 2) await sleep(50)
    }
    ws = new WebSocket(`ws://127.0.0.1:${lines[0].trim()}${lines[1].trim()}`)
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true })
      ws.addEventListener('error', reject, { once: true })
    })

    let nextId = 1
    const pending = new Map()
    const listeners = []
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(typeof ev.data === 'string' ? ev.data : ev.data.toString())
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id)
        pending.delete(msg.id)
        if (msg.error) reject(new Error(msg.error.message))
        else resolve(msg.result)
      } else if (msg.method) {
        for (const l of listeners) l(msg)
      }
    })
    const call = (method, params = {}, sessionId) =>
      new Promise((resolve, reject) => {
        const id = nextId++
        pending.set(id, { resolve, reject })
        ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
      })

    const { targetId } = await call('Target.createTarget', { url: 'about:blank' })
    const { sessionId } = await call('Target.attachToTarget', { targetId, flatten: true })
    const send = (method, params) => call(method, params, sessionId)

    const logs = []
    let loaded = false
    listeners.push((msg) => {
      if (msg.sessionId !== sessionId) return
      if (msg.method === 'Page.loadEventFired') loaded = true
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = (msg.params.args || []).map((a) => a.value ?? a.description ?? '').join(' ')
        logs.push({ level: msg.params.type, text })
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        const d = msg.params.exceptionDetails
        logs.push({ level: 'exception', text: d?.exception?.description || d?.text || 'Excepción' })
      }
      if (msg.method === 'Log.entryAdded') {
        logs.push({ level: msg.params.entry.level, text: `${msg.params.entry.text} ${msg.params.entry.url || ''}`.trim() })
      }
    })

    await send('Page.enable')
    await send('Runtime.enable')
    await send('Log.enable')
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile })
    if (mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 })
    if (reducedMotion) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    await send('Page.navigate', { url })
    const t0 = Date.now()
    while (!loaded && Date.now() - t0 < 30000) await sleep(50)
    await sleep(wait)

    const page = {
      send,
      logs,
      width,
      height,
      async evaluate(expression) {
        const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
        if (res.exceptionDetails) throw new Error(res.exceptionDetails.exception?.description || 'Error al evaluar')
        return res.result.value
      },
    }
    return await fn(page)
  } finally {
    try {
      ws?.close()
    } catch {}
    proc.kill()
    await sleep(150)
    try {
      rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
    } catch {}
  }
}
