import { memo, useMemo } from 'react'
import { useCamera } from '../../components/film/Film.jsx'
import { useSvgId } from '../../lib/hooks.js'
import { createRng } from '../../lib/rng.js'
import { clamp, easeInOut, lerp } from '../../lib/svg.js'
import { fmtDec, fmtInt } from '../../lib/format.js'
import { HALO, MONO, Nota, Rotulo, SERIF, kOf, linea, ventana } from '../kit.jsx'

// Ganadería de cebo (GUIA.md, 9.2), primera versión. Una nave de cebo vista desde arriba: entran los
// lechones, el ganadero apunta bajas sin cobertura, la ceba se compara con su curva de referencia y salta
// el aviso de mortalidad. Función pura de t.

const W = 1600
const H = 900
const NAVE = { x: 230, y: 190, w: 860, h: 520 }
const PASILLO = { y: NAVE.y + NAVE.h / 2 - 34, h: 68 }
const COLS = 8
const corral = (fila, col) => {
  const w = NAVE.w / COLS
  const h = (NAVE.h - PASILLO.h) / 2
  return { x: NAVE.x + col * w, y: fila === 0 ? NAVE.y : PASILLO.y + PASILLO.h, w, h, id: fila * COLS + col + 1 }
}
const CORRALES = [0, 1].flatMap((f) => Array.from({ length: COLS }, (_, c) => corral(f, c)))
const ALERTA = 14 // corral con el repunte de bajas

// Días de la ceba en función del tiempo de la escena
function diaDe(t) {
  if (t < 7) return 1
  if (t < 14) return 23
  if (t < 22) return Math.round(lerp(24, 41, clamp((t - 14.5) / 6.5, 0, 1)))
  return 42
}

// Curvas: consumo de pienso por animal y día (kg) y mortalidad acumulada en siete días (%)
const consumoRef = (d) => 0.9 + 1.55 * (1 - Math.exp(-d / 38))
const consumo = (d) => consumoRef(d) * (1 + 0.022 * Math.sin(d * 0.45) + 0.014 * Math.sin(d * 1.31 + 2) + (d > 30 ? (0.015 * (d - 30)) / 12 : 0))
const mortalidad7 = (d) => 0.18 + 0.04 * Math.sin(d * 0.6) + 0.025 * Math.sin(d * 1.7 + 1) + (d > 35 ? Math.pow((d - 35) / 7, 2) * 0.43 : 0)

const Nave = memo(function Nave() {
  return (
    <g fill="none" stroke="var(--screen-draw)" strokeLinejoin="round">
      <rect x={NAVE.x} y={NAVE.y} width={NAVE.w} height={NAVE.h} strokeWidth="1.6" />
      {CORRALES.map((c) => (
        <rect key={c.id} x={c.x} y={c.y} width={c.w} height={c.h} strokeWidth="1" stroke="var(--screen-line)" />
      ))}
      <path d={`M${NAVE.x} ${PASILLO.y} H${NAVE.x + NAVE.w} M${NAVE.x} ${PASILLO.y + PASILLO.h} H${NAVE.x + NAVE.w}`} strokeWidth="1.2" />
      {/* Puerta de carga a la izquierda y salida al patio a la derecha */}
      <path d={`M${NAVE.x} ${PASILLO.y + 8} V${PASILLO.y + PASILLO.h - 8}`} stroke="#0f1215" strokeWidth="4" />
      <path d={`M${NAVE.x + NAVE.w} ${PASILLO.y + 8} V${PASILLO.y + PASILLO.h - 8}`} stroke="#0f1215" strokeWidth="4" />
      {/* Comederos en cada corral */}
      {CORRALES.map((c) => (
        <rect key={`f${c.id}`} x={c.x + c.w / 2 - 14} y={c.y < PASILLO.y ? c.y + c.h - 16 : c.y + 8} width="28" height="8" stroke="var(--screen-line)" />
      ))}
      {/* Patio y oficina del veterinario */}
      <path d={`M${NAVE.x + NAVE.w} ${PASILLO.y} L${NAVE.x + NAVE.w + 160} ${PASILLO.y - 60} M${NAVE.x + NAVE.w} ${PASILLO.y + PASILLO.h} L${NAVE.x + NAVE.w + 160} ${PASILLO.y + PASILLO.h + 60}`} stroke="var(--screen-line)" strokeDasharray="4 6" />
    </g>
  )
})

function Silo({ x, y, nivel, k }) {
  const h = 110
  return (
    <g>
      <rect x={x} y={y} width="56" height={h} rx="10" fill="none" stroke="var(--screen-draw)" strokeWidth="1.3" />
      <rect x={x + 3} y={y + 3 + (h - 6) * (1 - nivel)} width="50" height={(h - 6) * nivel} rx="7" fill="var(--campo-s)" opacity="0.55" />
      <path d={`M${x} ${y + h} L${x + 28} ${y + h + 26} L${x + 56} ${y + h}`} fill="none" stroke="var(--screen-draw)" strokeWidth="1.3" />
      <text x={x + 28} y={y - 10} textAnchor="middle" fontFamily={MONO} fontSize={12 * k} fill="var(--screen-dim)">
        {fmtInt(nivel * 100)} %
      </text>
    </g>
  )
}

// Cerdos como óvalos con hocico y oreja, que crecen con los días
function cerdosPath(cerdos, t, escala) {
  let d = ''
  for (const p of cerdos) {
    const c = CORRALES[p.corral]
    const wob = Math.sin(t * p.vel + p.fase)
    const x = c.x + 14 + p.u * (c.w - 28) + wob * 4
    const y = c.y + 14 + p.v * (c.h - 28) + Math.cos(t * p.vel * 0.7 + p.fase) * 3
    const rx = 9 * escala
    const ry = 5.6 * escala
    const a = p.ang
    const ca = Math.cos(a)
    const sa = Math.sin(a)
    // elipse aproximada con cuatro arcos
    d += `M${(x + rx * ca).toFixed(1)} ${(y + rx * sa).toFixed(1)} A${rx.toFixed(1)} ${ry.toFixed(1)} ${((a * 180) / Math.PI).toFixed(0)} 1 1 ${(x - rx * ca).toFixed(1)} ${(y - rx * sa).toFixed(1)} A${rx.toFixed(1)} ${ry.toFixed(1)} ${((a * 180) / Math.PI).toFixed(0)} 1 1 ${(x + rx * ca).toFixed(1)} ${(y + rx * sa).toFixed(1)} Z `
  }
  return d
}

function Ganadero({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke="var(--screen-text)" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="0" cy="-15" r="6" />
      <path d="M0 -9 L0 9 M-9 -2 L9 -2 M0 9 L-6 22 M0 9 L6 22" />
      <rect x="9" y="-10" width="7" height="12" rx="1.5" fill="#0f1215" />
    </g>
  )
}

function Grafica({ x, y, w, h, d1, k, opacity, alerta, rayado }) {
  if (opacity <= 0) return null
  const DIAS = 120
  const xs = (d) => x + (d / DIAS) * w
  const yc = (v) => y + h - ((v - 0.6) / 2.2) * h
  const refBanda = []
  for (let d = 0; d <= DIAS; d += 3) refBanda.push([xs(d), yc(consumoRef(d) * 1.06)])
  for (let d = DIAS; d >= 0; d -= 3) refBanda.push([xs(d), yc(consumoRef(d) * 0.94)])
  const real = []
  for (let d = 1; d <= d1; d += 1) real.push([xs(d), yc(consumo(d))])
  const ym = (v) => y + h + 150 - (v / 0.8) * 110
  const mort = []
  for (let d = 1; d <= d1; d += 1) mort.push([xs(d), ym(mortalidad7(d))])
  const cruce = mortalidad7(d1) > 0.5
  return (
    <g opacity={opacity}>
      <Rotulo x={x} y={y - 22} k={k}>
        PIENSO POR ANIMAL Y DÍA · KG
      </Rotulo>
      <path d={`M${x} ${y + h} H${x + w}`} stroke="var(--screen-line)" />
      {[0, 30, 60, 90, 120].map((dd) => (
        <text key={dd} x={xs(dd)} y={y + h + 20} textAnchor="middle" fontFamily={MONO} fontSize={11 * k} fill="var(--screen-dim)">
          {dd}
        </text>
      ))}
      <path d={linea(refBanda) + ' Z'} fill={`url(#${rayado})`} stroke="none" />
      <path d={linea(refBanda) + ' Z'} fill="rgba(230,232,228,.06)" stroke="var(--screen-line)" />
      <text x={xs(96)} y={yc(consumoRef(96) * 1.06) - 10} fontFamily={MONO} fontSize={12 * k} fill="var(--screen-dim)" textAnchor="middle">
        referencia: mejores cebas
      </text>
      {real.length > 1 && <path d={linea(real)} fill="none" stroke="var(--campo-s)" strokeWidth="3" />}
      {real.length > 1 && <circle cx={real[real.length - 1][0]} cy={real[real.length - 1][1]} r="5" fill="var(--campo-s)" />}

      <Rotulo x={x} y={y + h + 52} k={k}>
        MORTALIDAD EN SIETE DÍAS · %
      </Rotulo>
      <path d={`M${x} ${ym(0.5)} H${x + w}`} stroke="var(--data-alert)" strokeDasharray="6 6" opacity="0.8" />
      <text x={x + w} y={ym(0.5) - 8} textAnchor="end" fontFamily={MONO} fontSize={12 * k} fill="var(--screen-dim)" {...HALO}>
        aviso al 0,5 %
      </text>
      {mort.length > 1 && <path d={linea(mort)} fill="none" stroke="var(--screen-text)" strokeWidth="2.4" />}
      {cruce && alerta && (
        <path d={linea(mort.filter((_, i) => mortalidad7(i + 1) > 0.5))} fill="none" stroke="var(--data-alert)" strokeWidth="3.4" />
      )}
      {cruce && alerta && <circle cx={mort[mort.length - 1][0]} cy={mort[mort.length - 1][1]} r="5.5" fill="var(--data-alert)" />}
    </g>
  )
}

function Scene({ film, narrow }) {
  const ids = { rayado: useSvgId('rayado') }
  const k = kOf(narrow)
  const { t, ease, between } = film
  const dia = diaDe(t)

  const cerdos = useMemo(() => {
    const rng = createRng('cebo')
    return Array.from({ length: 16 * 9 }, (_, i) => ({
      corral: i % 16,
      u: rng.range(0, 1),
      v: rng.range(0, 1),
      ang: rng.range(0, Math.PI),
      vel: rng.range(0.4, 1.1),
      fase: rng.range(0, 6.28),
      orden: i,
    }))
  }, [])

  // Plano 1: los lechones entran por la izquierda y van llenando los corrales.
  const entrada = between(0.6, 6.2)
  const visibles = t < 7 ? cerdos.filter((p) => p.orden / cerdos.length < entrada) : cerdos
  const escala = lerp(0.85, 1.45, clamp((dia - 1) / 41, 0, 1))
  const contador = Math.round(lerp(0, 1180, entrada))

  // Plano 2: el ganadero recorre el pasillo sin cobertura, sale al patio y se envían las bajas.
  const camino = between(7.4, 11.4)
  const gx = lerp(NAVE.x + 60, NAVE.x + NAVE.w + 90, easeInOut(camino))
  const gy = PASILLO.y + PASILLO.h / 2
  const cobertura = gx > NAVE.x + NAVE.w + 20
  const envio = between(11.6, 12.8)
  const validado = ease(12.8, 13.6)
  const VET = { x: NAVE.x + NAVE.w + 250, y: PASILLO.y - 150 }

  // Plano 3 y 4: la nave se hace pequeña y aparece la gráfica.
  const grafica = ease(14, 15.4)
  const alerta = t > 22 && mortalidad7(dia) > 0.5
  const pulso = alerta ? 0.5 + 0.5 * Math.sin(t * 6) : 0
  const silo1 = dia < 30 ? lerp(0.92, 0.18, (dia - 1) / 29) : lerp(0.95, 0.55, (dia - 30) / 12)

  const viewBox = useCamera(
    t,
    narrow
      ? [
          { at: 0, box: [80, 120, 960, 720] },
          { at: 14, box: [80, 120, 960, 720] },
          { at: 15.4, box: [600, 90, 1000, 750] },
          { at: 30, box: [600, 90, 1000, 750] },
        ]
      : [
          { at: 0, box: [0, 0, W, H] },
          { at: 30, box: [0, 0, W, H] },
        ],
  )

  // Escala de la nave: a partir del plano 3 se reduce a la izquierda para dejar sitio a la gráfica
  const s = lerp(1, 0.62, grafica)
  const naveTransform = `translate(${lerp(0, 20, grafica)} ${lerp(0, 120, grafica)}) scale(${s})`

  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id={ids.rayado} patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
          <path d="M0 0 V8" stroke="rgba(230,232,228,.16)" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="#0f1215" />

      <g transform={naveTransform}>
        <Nave />
        {alerta && (
          <rect
            x={CORRALES[ALERTA - 1].x + 2}
            y={CORRALES[ALERTA - 1].y + 2}
            width={CORRALES[ALERTA - 1].w - 4}
            height={CORRALES[ALERTA - 1].h - 4}
            fill="var(--data-alert)"
            opacity={0.18 + pulso * 0.25}
            stroke="var(--data-alert)"
            strokeWidth="2"
          />
        )}
        <path d={cerdosPath(visibles, t, escala)} fill="#d9c9bd" fillOpacity="0.9" stroke="#0f1215" strokeWidth="0.8" />
        <Silo x={NAVE.x + 40} y={NAVE.y - 150} nivel={silo1} k={k} />
        <Silo x={NAVE.x + 120} y={NAVE.y - 150} nivel={Math.min(0.97, silo1 + 0.1)} k={k} />

        {/* Camión en la puerta el primer día */}
        {t < 7.2 && (
          <g opacity={ventana(t, 0, 6.4)} transform={`translate(${NAVE.x - 170} ${PASILLO.y - 6})`}>
            <rect width="120" height="80" fill="none" stroke="var(--screen-draw)" strokeWidth="1.4" />
            <rect x="120" y="14" width="40" height="52" fill="none" stroke="var(--screen-draw)" strokeWidth="1.4" />
          </g>
        )}

        {t >= 7 && t < 14 && <Ganadero x={gx} y={gy} />}
      </g>

      {/* Plano 1: contador y guía */}
      <g opacity={ventana(t, 0.4, 6.6)}>
        <Rotulo x={1160} y={330} k={k}>
          ENTRADAS · GUÍA 26 004312
        </Rotulo>
        <text x={1156} y={420} fontFamily={SERIF} fontWeight="300" fontSize={84 * k} fill="var(--screen-text)" className="num">
          {fmtInt(contador)}
        </text>
        <path d={`M1160 442 H${1160 + 300 * entrada}`} stroke="var(--campo-s)" strokeWidth="3" />
        <text x={1160} y={480} fontFamily={SERIF} fontStyle="italic" fontWeight="300" fontSize={26 * k} fill="var(--screen-dim)">
          lechones, 20,4 kg de media
        </text>
      </g>

      {/* Plano 2: el móvil del ganadero y el envío al veterinario */}
      {t >= 7 && t < 14.6 && (
        <g opacity={ventana(t, 7.2, 14)}>
          <g transform={`translate(${1250} ${500})`}>
            <rect width="230" height="300" rx="22" fill="#0f1215" stroke="var(--screen-draw)" strokeWidth="1.4" />
            <text x="22" y="40" fontFamily={MONO} fontSize={13} fill="var(--screen-dim)">
              CEBA 2026 03 · NAVE 2
            </text>
            <g transform="translate(176 26)">
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={i * 8} y={12 - i * 4} width="5" height={4 + i * 4} fill={cobertura ? 'var(--screen-text)' : 'var(--screen-line)'} />
              ))}
              {!cobertura && <path d="M-2 -2 L32 18" stroke="var(--data-alert)" strokeWidth="2" />}
            </g>
            <text x="22" y="96" fontFamily={SERIF} fontWeight="300" fontSize="44" fill="var(--screen-text)">
              2 bajas
            </text>
            <text x="22" y="128" fontFamily={MONO} fontSize="13" fill="var(--screen-dim)">
              corral 6 · 07:40
            </text>
            <rect x="22" y="150" width="186" height="96" fill="none" stroke="var(--screen-line)" />
            <text x="115" y="204" textAnchor="middle" fontFamily={MONO} fontSize="12" fill="var(--screen-dim)">
              foto adjunta
            </text>
            <text x="22" y="276" fontFamily={MONO} fontSize="13" fill={validado > 0.5 ? 'var(--data-ok)' : cobertura ? 'var(--screen-text)' : 'var(--data-warn)'}>
              {validado > 0.5 ? 'validadas por el veterinario' : cobertura ? 'enviando' : '2 pendientes de enviar'}
            </text>
          </g>
          {/* Los dos registros viajan hasta la oficina del veterinario */}
          {[0, 0.18].map((d) => {
            const u = clamp((envio - d) / 0.82, 0, 1)
            if (u <= 0 || u >= 1) return null
            const sx = NAVE.x + NAVE.w + 90
            const sy = gy - 10
            return <circle key={d} cx={lerp(sx, VET.x, u)} cy={lerp(sy, VET.y + 40, u) - Math.sin(u * Math.PI) * 60} r="6" fill="var(--campo-s)" />
          })}
          <g transform={`translate(${VET.x - 40} ${VET.y})`}>
            <rect width="150" height="80" fill="none" stroke="var(--screen-draw)" strokeWidth="1.3" />
            <text x="12" y="-12" fontFamily={MONO} fontSize={13 * k} fill="var(--screen-dim)" {...HALO}>
              VETERINARIO · 07:52
            </text>
            {validado > 0 && (
              <path d="M44 42 L66 60 L108 22" fill="none" stroke="var(--data-ok)" strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - validado} />
            )}
          </g>
        </g>
      )}

      {/* Planos 3 y 4: la curva de la ceba frente a la referencia, y la mortalidad */}
      <Grafica x={720} y={190} w={800} h={300} d1={dia} k={k} opacity={grafica} alerta={alerta} rayado={ids.rayado} />
      {grafica > 0 && (
        <g>
          <Rotulo x={720} y={110} k={k} dim={false} opacity={grafica}>
            DÍA {dia} DE LA CEBA
          </Rotulo>
          <Rotulo x={720} y={138} k={k} opacity={grafica}>
            {`consumo ${fmtDec(consumo(dia), 2)} kg · referencia ${fmtDec(consumoRef(dia), 2)} kg`}
          </Rotulo>
        </g>
      )}
      {!narrow && (
        <Nota
          x={60}
          y={620}
          w={420}
          kicker="CORRAL 14 · AVISO AL VETERINARIO"
          valor={fmtDec(mortalidad7(dia), 2)}
          unidad="%"
          linea="de bajas en los últimos siete días"
          color="var(--data-alert)"
          progress={ventana(t, 23, 30, 0.8)}
        />
      )}
    </svg>
  )
}

export default {
  id: 'cebo',
  label:
    'Una nave de cebo vista desde arriba. Entran los lechones, el ganadero apunta dos bajas sin cobertura y se envían al veterinario al volver la señal, la ceba se compara con la curva de las mejores cebas y salta el aviso de mortalidad en un corral.',
  duration: 30,
  poster: 26,
  aspect: '16 / 9',
  aspectNarrow: '4 / 3',
  frame: {
    lugar: 'Nave de cebo · 1.200 plazas',
    origen: 'Aplicación del ganadero',
    reloj: (t) => `Día ${diaDe(t)}`,
  },
  scenes: [
    { at: 0, title: 'Entran los lechones', caption: 'Día 1 · Entran 1.180 lechones. La guía queda fotografiada en la puerta.' },
    { at: 7, title: 'Dos bajas sin cobertura', caption: 'Día 23 · 07:40 · El ganadero apunta dos bajas sin señal. Se envían al salir al patio.' },
    { at: 14, title: 'La curva', caption: 'Días 24 a 41 · El pienso por animal, día a día, frente a las mejores cebas.' },
    { at: 22, title: 'El aviso', caption: 'Día 42 · La mortalidad de los últimos siete días pasa del 0,5 %. Aviso al veterinario.' },
  ],
  Scene,
}
