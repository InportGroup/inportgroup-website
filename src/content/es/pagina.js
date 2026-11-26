// Textos de la página (GUIA.md, sección 7). Los sectores están en sectores.js.
// Reglas: sin guiones, sin negritas, sin emojis ni flechas, de tú, concreto antes que abstracto (GUIA.md, sección 3).
// Orden: por qué (portada y lo que nos mueve), cómo (las cuatro fases), qué (un caso por sector) y contacto.

// foto.src: ruta en public/ (por ejemplo '/fotos/equipo.jpg'). Mientras sea null se ve el hueco rayado.
export const PORTADA = {
  titulo: { antes: '¿Y si no tuviera por qué hacerse ', marca: 'así', despues: '?' },
  entradilla:
    'El mundo está lleno de cosas que funcionan peor de lo que deberían.',
  sectores: 'Marítimo · Industria · Construcción · Agricultura · Ganadería · Retail',
  nota: 'Mitad ingenieros. Mitad cirujanos de procesos.',
  foto: { src: null, alt: 'El equipo de Inport trabajando en campo', pendiente: 'el equipo trabajando en campo' },
  pie: 'El equipo al que llamas cuando una operación podría funcionar muchísimo mejor, pero nadie ha encontrado cómo.',
}

export const MUEVE = {
  titulo: 'Lo que nos mueve',
  lista: [
    'Meternos de lleno en retos de esos que quitan el sueño',
    'Destripar lo complejo',
    'Entender las cosas desde dentro',
    'Buscar la fisura',
    'Convertir un caos de proceso en algo fino, ágil y automático',
  ],
}

export const COMO = {
  numero: '04',
  titulo: 'Sin diapositivas ni catálogos que colocarte. Nos da igual el envoltorio.',
  entradilla:
    'Venimos a remangarnos para resolver lo que te frena y hacer que todo funcione como un tiro.',
  nota: 'No es tecnología. Es ingenio aplicado.',
  fases: [
    {
      n: '01',
      titulo: 'Miramos donde otros no miran.',
      texto:
        'Entendemos el proceso real a pie de campo, detectamos fricciones y buscamos oportunidades que no siempre son evidentes a simple vista.',
      nota: '“ahí se pierde el tiempo”',
      fase: 'Fase 1 · Diagnóstico in situ',
    },
    {
      n: '02',
      titulo: 'Conectamos lo desconectado.',
      texto:
        'Combinamos software, visión artificial, sensores, drones, analítica y sistemas existentes solo cuando aportan valor medible.',
      nota: '“solo si suma”',
      fase: 'Fase 2 · Arquitectura e integración',
    },
    {
      n: '03',
      titulo: 'Probamos que funciona.',
      texto:
        'Validamos la solución en un entorno acotado (PoC) y definimos KPIs claros de resultado antes de cualquier despliegue masivo.',
      nota: '“primero en pequeño”',
      fase: 'Fase 3 · Piloto y validación',
    },
    {
      n: '04',
      titulo: 'Si funciona, lo llevamos a la realidad.',
      texto:
        'Integramos la solución completa en la operación diaria y facilitamos su mantenimiento y evolución continua sin fricción.',
      nota: '“y que se quede”',
      fase: 'Fase 4 · Industrialización',
    },
  ],
}

export const QUE = {
  titulo: 'Algunas de las cosas que hemos desmontado para que funcionen mejor.',
  entradilla: 'Seis sectores, una misma manera de mirar. Elige uno.',
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
