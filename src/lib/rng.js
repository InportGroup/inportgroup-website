// Generador pseudoaleatorio con semilla (mulberry32) y utilidades.
// Todo lo simulado en la web es determinista: misma semilla, mismos datos.

export function hashString(str) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function createRng(seed = 1) {
  let a = (typeof seed === 'string' ? hashString(seed) : seed) >>> 0
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const rng = {
    next,
    /** Número en [min, max) */
    range: (min, max) => min + next() * (max - min),
    /** Entero en [min, max] */
    int: (min, max) => Math.floor(min + next() * (max - min + 1)),
    chance: (p) => next() < p,
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    /** Elige una clave de un objeto {clave: peso} o de una lista [[clave, peso]] */
    weighted(weights) {
      const entries = Array.isArray(weights) ? weights : Object.entries(weights)
      const total = entries.reduce((s, [, w]) => s + w, 0)
      let r = next() * total
      for (const [k, w] of entries) {
        r -= w
        if (r <= 0) return k
      }
      return entries[entries.length - 1][0]
    },
    normal(mean = 0, sd = 1) {
      const u = 1 - next()
      const v = next()
      return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
    },
    /** Log normal con media aproximada `mean` y dispersión `sigma` */
    lognormal(mean, sigma = 0.45) {
      const mu = Math.log(mean) - (sigma * sigma) / 2
      return Math.exp(mu + sigma * rng.normal())
    },
    shuffle(arr) {
      const out = arr.slice()
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1))
        const tmp = out[i]
        out[i] = out[j]
        out[j] = tmp
      }
      return out
    },
  }
  return rng
}

/**
 * Ruido determinista en [0, 1) para un número, útil para variaciones visuales estables.
 * Solo usa operaciones enteras: da exactamente lo mismo en Node (prerenderizado) y en el navegador.
 * La versión de InLux usaba Math.sin con argumentos grandes, que difiere en el último bit entre motores
 * y rompía la hidratación de las escenas.
 */
export function noise1(n) {
  let h = Math.round(n * 1000) | 0
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b)
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}
