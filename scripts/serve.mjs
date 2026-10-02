// Sirve build/client como lo haría GitHub Pages: carpeta con index.html, y 404.html para lo demás.
//   npm run build && npm run preview      http://localhost:5191

import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'

const root = path.resolve('build/client')
const port = Number(process.env.PORT || 5191)
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
}

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0])
  const file = path.join(root, clean)
  if (!file.startsWith(root)) return null
  if (existsSync(file) && statSync(file).isFile()) return file
  const index = path.join(file, 'index.html')
  if (existsSync(index)) return index
  return null
}

createServer((req, res) => {
  const file = resolve(req.url || '/')
  if (file) {
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' })
    createReadStream(file).pipe(res)
    return
  }
  res.writeHead(404, { 'Content-Type': TYPES['.html'] })
  createReadStream(path.join(root, '404.html')).pipe(res)
}).listen(port, () => console.log(`build/client en http://localhost:${port}`))
