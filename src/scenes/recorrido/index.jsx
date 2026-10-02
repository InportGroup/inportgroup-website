import { bezier } from '../kit.jsx'

// Esquema vivo de "Qué hacemos" (GUIA.md, 7.4): de lo que ya hay a quien decide, pasando por el equipo
// que trabaja dentro de la instalación. Sin cajetín ni barra: se usa con detail 'bajo'.
// En pantalla estrecha el esquema se pone en vertical.

const ORIGENES = [
  { id: 'camara', nombre: 'Cámara', corto: 'Cámara', color: 'var(--industria-s)' },
  { id: 'estacion', nombre: 'Estación y sondas', corto: 'Sondas', color: 'var(--campo-s)' },
  { id: 'dron', nombre: 'Dron', corto: 'Dron', color: 'var(--mar-s)' },
  { id: 'papel', nombre: 'Albaranes y manuales', corto: 'Papeles', color: 'var(--operaciones-s)' },
]
const DESTINOS = [
  { id: 'dcs', nombre: 'Sistema de control', corto: 'Control' },
  { id: 'movil', nombre: 'Móvil del encargado', corto: 'Móvil' },
  { id: 'erp', nombre: 'ERP', corto: 'ERP' },
  { id: 'informe', nombre: 'Informe del lunes', corto: 'Informe' },
]

function Icono({ id, x, y, s = 1 }) {
  const st = { fill: 'none', stroke: 'var(--screen-text)', strokeWidth: 1.6, strokeLinejoin: 'round', strokeLinecap: 'round' }
  const g = (children) => <g transform={`translate(${x} ${y}) scale(${s})`}>{children}</g>
  switch (id) {
    case 'camara':
      return g(
        <g {...st}>
          <rect x="-22" y="-12" width="36" height="24" rx="3" />
          <path d="M14 -6 L24 -11 V11 L14 6" />
          <circle cx="-4" cy="0" r="6" />
        </g>,
      )
    case 'estacion':
      return g(
        <g {...st}>
          <path d="M0 22 V-14 M-10 22 H10" />
          <rect x="-9" y="-6" width="18" height="12" />
          <path d="M0 -14 L-12 -20 M0 -14 L12 -20 M0 -14 L0 -24" />
        </g>,
      )
    case 'dron':
      return g(
        <g {...st}>
          <path d="M-18 -8 L18 8 M-18 8 L18 -8" />
          <ellipse cx="-18" cy="-8" rx="9" ry="2.5" />
          <ellipse cx="18" cy="-8" rx="9" ry="2.5" />
          <ellipse cx="-18" cy="8" rx="9" ry="2.5" />
          <ellipse cx="18" cy="8" rx="9" ry="2.5" />
          <rect x="-6" y="-4" width="12" height="8" rx="2" />
        </g>,
      )
    case 'papel':
      return g(
        <g {...st}>
          <path d="M-14 -20 H6 L14 -12 V20 H-14 Z M6 -20 V-12 H14" />
          <path d="M-8 -6 H8 M-8 2 H8 M-8 10 H3" />
        </g>,
      )
    case 'dcs':
      return g(
        <g {...st}>
          <rect x="-22" y="-16" width="44" height="28" rx="2" />
          <path d="M-8 18 H8 M0 12 V18 M-14 4 L-6 -4 L2 2 L14 -8" />
        </g>,
      )
    case 'movil':
      return g(
        <g {...st}>
          <rect x="-11" y="-20" width="22" height="40" rx="4" />
          <path d="M-4 14 H4" />
        </g>,
      )
    case 'erp':
      return g(
        <g {...st}>
          <rect x="-20" y="-16" width="40" height="32" />
          <path d="M-20 -6 H20 M-20 4 H20 M-6 -16 V16" />
        </g>,
      )
    default:
      return g(
        <g {...st}>
          <path d="M-18 -14 H18 V14 H-18 Z M-18 -14 L0 2 L18 -14" />
        </g>,
      )
  }
}

function Scene({ film, narrow }) {
  const { t } = film
  const Wd = narrow ? 900 : 1600
  const Hd = narrow ? 1200 : 600
  const k = narrow ? 1.5 : 1

  // Posiciones de origen, equipo y destino en cada disposición
  const origen = (i) => (narrow ? [120 + i * 220, 170] : [210, 105 + i * 130])
  const destino = (i) => (narrow ? [120 + i * 220, 1030] : [1390, 105 + i * 130])
  const centro = narrow ? [450, 600] : [800, 300]
  const caja = narrow ? { x: 120, y: 400, w: 660, h: 400 } : { x: 560, y: 70, w: 480, h: 460 }
  const entrada = narrow ? [450, 520] : [700, 300]
  const salida = narrow ? [450, 680] : [900, 300]

  const curvaIn = (i) => {
    const a = origen(i)
    const p0 = narrow ? [a[0], a[1] + 60] : [a[0] + 70, a[1]]
    const p3 = entrada
    return narrow ? [p0, [p0[0], p0[1] + 160], [p3[0], p3[1] - 150], p3] : [p0, [p0[0] + 220, p0[1]], [p3[0] - 200, p3[1]], p3]
  }
  const curvaOut = (i) => {
    const b = destino(i)
    const p0 = salida
    const p3 = narrow ? [b[0], b[1] - 60] : [b[0] - 70, b[1]]
    return narrow ? [p0, [p0[0], p0[1] + 150], [p3[0], p3[1] - 160], p3] : [p0, [p0[0] + 200, p0[1]], [p3[0] - 220, p3[1]], p3]
  }
  const d = (c) => `M${c[0][0]} ${c[0][1]} C${c[1][0]} ${c[1][1]} ${c[2][0]} ${c[2][1]} ${c[3][0]} ${c[3][1]}`

  const particulas = (c, color, fase, key) =>
    [0, 0.33, 0.66].map((o) => {
      const u = (t / 3 + o + fase) % 1
      const [x, y] = bezier(...c, u)
      return <circle key={`${key}${o}`} cx={x} cy={y} r={4.5 * (k > 1 ? 1.3 : 1)} fill={color} opacity={Math.sin(u * Math.PI)} />
    })

  const led = Math.floor(t * 3) % 3

  return (
    <svg viewBox={`0 0 ${Wd} ${Hd}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <rect width={Wd} height={Hd} fill="#0f1215" />

      {/* La frontera: lo que nunca sale de la instalación */}
      <rect x={caja.x} y={caja.y} width={caja.w} height={caja.h} rx="18" fill="rgba(230,232,228,.02)" stroke="var(--screen-dim)" strokeDasharray="6 8" />
      <text x={caja.x + 22} y={caja.y + 34} fontFamily="var(--font-mono)" fontSize={13 * k} letterSpacing="1.4" fill="var(--screen-dim)">
        EN SUS INSTALACIONES
      </text>
      <text x={caja.x + caja.w / 2} y={caja.y + caja.h - 26} textAnchor="middle" fontFamily="var(--font-display)" fontStyle="italic" fontWeight="300" fontSize={20 * k} fill="var(--screen-dim)">
        las imágenes no salen de aquí
      </text>

      {/* Curvas y partículas */}
      {ORIGENES.map((o, i) => (
        <g key={o.id}>
          <path d={d(curvaIn(i))} fill="none" stroke="var(--screen-line)" strokeWidth="1.4" />
          {particulas(curvaIn(i), o.color, i * 0.17, o.id)}
        </g>
      ))}
      {DESTINOS.map((o, i) => (
        <g key={o.id}>
          <path d={d(curvaOut(i))} fill="none" stroke="var(--screen-line)" strokeWidth="1.4" />
          {particulas(curvaOut(i), 'var(--screen-text)', 0.5 + i * 0.13, o.id)}
        </g>
      ))}

      {/* El equipo en planta: modelos de visión y de predicción */}
      <g transform={`translate(${centro[0]} ${centro[1]}) scale(${k})`}>
        <rect x="-100" y="-62" width="200" height="124" rx="6" fill="#151a1f" stroke="var(--screen-text)" strokeWidth="1.6" />
        {[-34, 0, 34].map((yy, j) => (
          <g key={yy}>
            <path d={`M-78 ${yy} H52`} stroke="var(--screen-line)" strokeWidth="9" strokeLinecap="round" />
            <circle cx="72" cy={yy} r="5" fill={led === j ? 'var(--data-ok)' : 'var(--screen-line)'} />
          </g>
        ))}
        <text x="0" y="96" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="14" fill="var(--screen-text)">
          Modelos y reglas
        </text>
      </g>

      {/* Orígenes y destinos con su nombre */}
      {ORIGENES.map((o, i) => {
        const [x, y] = origen(i)
        return (
          <g key={o.id}>
            <Icono id={o.id} x={x} y={y} s={k} />
            <rect x={narrow ? x - 6 : x - 46} y={narrow ? y - 64 : y - 5} width="10" height="10" fill={o.color} />
            <text
              x={narrow ? x : x - 56}
              y={narrow ? y + 64 : y + 5}
              textAnchor={narrow ? 'middle' : 'end'}
              fontFamily="var(--font-mono)"
              fontSize={13 * k}
              fill="var(--screen-text)"
            >
              {narrow ? o.corto : o.nombre}
            </text>
          </g>
        )
      })}
      {DESTINOS.map((o, i) => {
        const [x, y] = destino(i)
        return (
          <g key={o.id}>
            <Icono id={o.id} x={x} y={y} s={k} />
            <text x={narrow ? x : x + 46} y={narrow ? y + 66 : y + 5} textAnchor={narrow ? 'middle' : 'start'} fontFamily="var(--font-mono)" fontSize={13 * k} fill="var(--screen-text)">
              {narrow ? o.corto : o.nombre}
            </text>
          </g>
        )
      })}
      {!narrow && (
        <g fontFamily="var(--font-mono)" fontSize="12" letterSpacing="1.4" fill="var(--screen-dim)">
          <text x={210} y={40} textAnchor="middle">
            LO QUE YA HAY
          </text>
          <text x={1390} y={40} textAnchor="middle">
            A QUIEN DECIDE
          </text>
        </g>
      )}
    </svg>
  )
}

export default {
  id: 'recorrido',
  label:
    'Esquema del recorrido del dato: cámaras, estaciones, drones y papeles que ya existen envían su información a un equipo dentro de la instalación, y de ahí llega al sistema de control, al móvil del encargado, al ERP y a un informe escrito.',
  duration: 6,
  poster: 1.2,
  aspect: '8 / 3',
  aspectNarrow: '3 / 4',
  scenes: [{ at: 0, title: 'Recorrido del dato', caption: '' }],
  Scene,
}
