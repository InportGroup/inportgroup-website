// Formato de cifras en español de España, sin guiones ni signos negativos.

const NBSP = ' '

function group(intStr) {
  return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/** 2846 → "2.846" */
export function fmtInt(n) {
  return group(String(Math.round(Math.abs(n))))
}

/** 11.8 → "11,8" */
export function fmtDec(n, digits = 1) {
  const [i, d] = Math.abs(n).toFixed(digits).split('.')
  return d ? `${group(i)},${d}` : group(i)
}

/** 252 → "4 min 12 s", 38 → "38 s", 3900 → "1 h 5 min" */
export function fmtDuration(seconds) {
  const s = Math.round(Math.abs(seconds))
  if (s < 60) return `${s}${NBSP}s`
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  if (h > 0) return m ? `${h}${NBSP}h ${m}${NBSP}min` : `${h}${NBSP}h`
  return r ? `${m}${NBSP}min ${r}${NBSP}s` : `${m}${NBSP}min`
}
