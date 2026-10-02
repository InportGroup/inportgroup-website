// Formato de cifras en español de España, sin guiones ni signos negativos.

const NBSP = ' '

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

/** 11.8 → "11,8 %" (recibe el valor ya en porcentaje) */
export function fmtPct(n, digits = 1) {
  return `${fmtDec(n, digits)}${NBSP}%`
}

/** 1940 → "1.940 €" */
export function fmtEur(n) {
  return `${fmtInt(n)}${NBSP}€`
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

/** Segundos desde medianoche → "17:40" */
export function fmtClock(secondsFromMidnight) {
  const t = Math.max(0, Math.round(secondsFromMidnight))
  const h = Math.floor(t / 3600) % 24
  const m = Math.floor((t % 3600) / 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Variación en palabras: 9 → "sube un 9 %", 3.2 negativo → "baja un 3,2 %" */
export function fmtTrend(pct, digits = 0) {
  if (Math.abs(pct) < 0.05) return 'se mantiene'
  return `${pct > 0 ? 'sube' : 'baja'} un ${fmtPct(pct, digits)}`
}

/** Multiplicador: 1.8 → "×1,8" */
export function fmtTimes(n, digits = 1) {
  return `×${fmtDec(n, digits)}`
}

export const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
export const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
export const WEEKDAYS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
export const WEEKDAYS_SHORT = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']

/** Date → "sábado 3 de octubre" */
export function fmtDate(date, { weekday = true, year = false } = {}) {
  const wd = WEEKDAYS[(date.getDay() + 6) % 7]
  const base = `${date.getDate()} de ${MONTHS[date.getMonth()]}`
  return `${weekday ? `${wd} ` : ''}${base}${year ? ` de ${date.getFullYear()}` : ''}`
}
