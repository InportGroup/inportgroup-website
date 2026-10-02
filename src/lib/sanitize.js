// Garantiza que ningún texto dinámico (modelo, datos) rompe las reglas de la casa:
// sin guiones de ningún tipo, sin negritas, sin markdown.
// Traído de InLux (src/lib/sanitize.js).

export function sanitizeText(input = '') {
  let s = String(input)
  s = s.replace(/\r\n/g, '\n')
  s = s.replace(/\*\*|__|`/g, '')
  s = s.replace(/^\s{0,3}#{1,6}\s*/gm, '')
  s = s.replace(/^\s*(?:[-–—•*·]|\d+[.)])\s+/gm, '')
  s = s.replace(/(\d)\s*[-–—]\s*(\d)/g, '$1 a $2')
  s = s.replace(/\s+[—–-]\s+/g, ', ')
  s = s.replace(/[—–]/g, ', ')
  s = s.replace(/(\p{L})-(\p{L})/gu, '$1 $2')
  s = s.replace(/-/g, ' ')
  s = s.replace(/\*/g, '')
  s = s.replace(/[ \t]+,/g, ',')
  s = s.replace(/,\s*,/g, ',')
  s = s.replace(/[ \t]{2,}/g, ' ')
  s = s.replace(/\n{3,}/g, '\n\n')
  return s
}
