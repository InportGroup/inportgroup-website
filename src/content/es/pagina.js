// Textos de la página (GUIA.md, sección 7). Los sectores están en sectores.js.
// Reglas: sin guiones, sin negritas, sin emojis ni flechas, de tú, concreto antes que abstracto (GUIA.md, sección 3).
// Orden: por qué (portada y lo que nos mueve), cómo (las cuatro fases), qué (un caso por sector) y contacto.

// foto.src: ruta en public/ (por ejemplo '/fotos/equipo.jpg'). Mientras sea null se ve el hueco rayado.
export const PORTADA = {
  titulo: { antes: '¿Y si no tuviera por qué hacerse ', marca: 'así', despues: '?' },
  entradilla:
    'Hay procesos en plantas, diques, fincas y tiendas que funcionan peor de lo que deberían. Los estudiamos desde dentro y construimos la solución digital a medida que los arregla.',
  sectores: 'Marítimo · Industria · Agricultura y ganadería · Retail',
  nota: 'Ingenieros que pisan la planta.',
  foto: { src: null, alt: 'El equipo de Inport trabajando en campo', pendiente: 'el equipo trabajando en campo' },
  pie: 'El equipo al que llamas cuando una operación podría funcionar mucho mejor y nadie ha encontrado cómo.',
}

export const MUEVE = {
  titulo: 'Lo que nos mueve',
  lista: [
    'Los problemas que en tu sector se dan por imposibles.',
    'Desmontar lo complejo hasta entender cada pieza.',
    'Encontrar el punto exacto donde se pierde tiempo, dinero o calidad.',
    'Que lo que hoy se hace a mano, a ojo o tarde pase a hacerse solo.',
  ],
}

export const COMO = {
  numero: '04',
  titulo: 'Cuatro fases. Si una no da resultado, no pasamos a la siguiente.',
  entradilla:
    'No vendemos licencias ni productos cerrados. Partimos de lo que ya tienes instalado y solo añadimos lo que aporte algo que se pueda comprobar.',
  fases: [
    {
      n: '01',
      titulo: 'Bajamos a planta.',
      texto:
        'Vemos cómo se trabaja de verdad, hablamos con quien lo hace y medimos antes de opinar. A veces la conclusión es que no hace falta nada nuevo, y te lo decimos.',
      nota: 'ahí se pierde el tiempo',
      fase: 'Fase 1 · Diagnóstico',
    },
    {
      n: '02',
      titulo: 'Diseñamos con lo que ya hay.',
      texto:
        'Cámaras, sensores, el sistema de control, el ERP. Solo añadimos software, visión artificial o un dron si el diagnóstico demuestra que hace falta.',
      nota: 'solo si suma',
      fase: 'Fase 2 · Diseño',
    },
    {
      n: '03',
      titulo: 'Lo probamos en pequeño.',
      texto:
        'En un horno, una nave, un sector de la finca o una tienda. Antes de empezar acordamos qué resultado tiene que dar y cómo se mide.',
      nota: 'si no da, se para',
      fase: 'Fase 3 · Piloto',
    },
    {
      n: '04',
      titulo: 'Si funciona, se queda.',
      texto:
        'Lo extendemos al resto de la operación, en tus servidores o en la nube. Entregamos el código, la documentación y la formación, y si quieres nos quedamos con el mantenimiento.',
      nota: 'el código es tuyo',
      fase: 'Fase 4 · Despliegue',
    },
  ],
}

export const QUE = {
  titulo: 'Algunas de las cosas que hemos desmontado para que funcionen mejor.',
  entradilla: 'Un caso por sector, con el problema, la solución y sus límites. Elige uno.',
}

export const CONTACTO = {
  titulo: 'Cuéntanos qué no funciona.',
  texto:
    'Si vemos que podemos ayudar, te proponemos un diagnóstico y un piloto acotado. Si no, te lo decimos en la primera conversación.',
  boton: 'Escríbenos',
}

export const LEGAL = {
  resumen: 'Aviso legal y privacidad',
  parrafos: [
    'Titular de esta web: razón social pendiente de completar, NIF pendiente, domicilio pendiente.',
    'Esta web no usa cookies de seguimiento ni herramientas de analítica.',
    'Si nos escribes, usaremos tu correo solo para contestarte. No lo cedemos a nadie y puedes pedirnos que lo borremos cuando quieras.',
  ],
}
