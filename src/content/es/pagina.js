// Textos de la página única (GUIA.md, sección 7). Los ejemplos están en ejemplos.js.
// Reglas: sin guiones, sin negritas, de usted, concreto antes que abstracto (GUIA.md, sección 3).

export const PORTADA = {
  kicker: 'Soluciones digitales a medida · para cualquier sector',
  titulo: 'Primero, dónde está el valor. Después, la técnica que haga falta.',
  entradilla:
    'Hacemos soluciones digitales para cualquier sector. Antes de proponer nada buscamos qué parte de su operación aporta más valor, y nos centramos solo en eso. Nuestra especialidad son los proyectos complejos: los que no se pueden comprar hechos.',
  martesKicker: 'Un martes de octubre',
  martes: [
    { hora: '04:10', texto: 'En una finca de pistacheros, la yema del sector 4 baja a 2,8 grados bajo cero. La garita marca 0,4.', ancla: 'cultivo' },
    { hora: '07:40', texto: 'Un ganadero apunta dos bajas en una nave sin cobertura. El veterinario las ve a las 07:52.', ancla: 'cebo' },
    { hora: '09:15', texto: 'El vuelo semanal sobre la obra dice que la planta 4 va una semana tarde.', ancla: 'obra' },
    { hora: '11:42', texto: 'La zona 3 del horno 2 pide aire. El sistema de control lo sabe antes que nadie en la sala.', ancla: 'hornos' },
    { hora: '13:40', texto: 'Sale el presupuesto de chorreado de un granelero que entró en dique a las siete y media.', ancla: 'astilleros' },
    { hora: '18:10', texto: 'En una boutique, diez personas esperan más de un minuto. Dos asesoras están en su descanso.', ancla: 'boutique' },
  ],
}

export const NOSOTROS = {
  kicker: 'Quiénes somos',
  titulo: 'Un equipo de ingeniería que prefiere ver la máquina antes de proponer nada.',
  entradilla:
    'Juntamos ingeniería y desarrollo de software. Lo primero siempre es entender dónde está el valor: a veces en un horno, a veces en una hoja de cálculo que nadie actualiza a tiempo. No revendemos licencias ni adaptamos un producto cerrado; escribimos cada sistema para su caso y le entregamos el código.',
  pasosKicker: 'Cómo trabajamos',
  pasos: [
    { n: '01', titulo: 'Diagnóstico', texto: 'Buscamos qué parte de la operación aporta más valor y qué falta para conseguirlo. A veces la conclusión es que no hace falta nada nuevo.' },
    { n: '02', titulo: 'Piloto', texto: 'Un horno, una nave, un sector de la finca o una tienda, con un criterio de aceptación que se puede comprobar.' },
    { n: '03', titulo: 'Despliegue', texto: 'En el resto de la instalación, en sus servidores o en la nube, según el caso.' },
    { n: '04', titulo: 'Entrega', texto: 'Código, documentación y formación al equipo. Si quiere, nos quedamos con el mantenimiento.' },
  ],
  principiosKicker: 'Lo que no negociamos',
  principios: [
    { titulo: 'Con lo que ya hay', texto: 'Las cámaras del horno, la estación de la finca, el programador de riego, el TPV de la tienda. Si hace falta algo nuevo, se lo decimos y lo compra a quien quiera.' },
    { titulo: 'En sus instalaciones, si hace falta', texto: 'El sistema puede funcionar entero dentro de la planta, sin nube y sin conexión a internet.' },
    { titulo: 'El código es suyo', texto: 'Se entrega con la documentación, para que cualquier equipo cualificado pueda mantenerlo y cambiarlo.' },
    { titulo: 'Si el dato no vale, se dice', texto: 'Una lente sucia o una sonda que deriva no dan un valor falso. El sistema avisa de que esa lectura no es fiable.' },
  ],
}

export const HACEMOS = {
  kicker: 'Qué hacemos',
  titulo: 'Lo que hacemos cabe en cuatro verbos.',
  entradilla:
    'Casi siempre empezamos por algo que ya está instalado y nadie aprovecha del todo: una cámara, una estación meteorológica, un montón de albaranes.',
  capacidades: [
    {
      verbo: 'Ver',
      texto:
        'Convertimos lo que ven las cámaras que ya existen en medidas con fecha y lugar: la mirilla de un horno, el techo de una tienda, un dron frente a un casco, una cámara térmica en una finca.',
    },
    {
      verbo: 'Prever',
      texto:
        'Con el histórico del propio sitio y lo que pasa fuera, nos adelantamos: una helada con 72 horas de margen, la cosecha en plena floración, el pienso que va a faltar, la gente que vendrá el sábado.',
    },
    {
      verbo: 'Avisar',
      texto:
        'Que la medida llegue sola adonde se decide: al sistema de control de la planta por OPC UA, al programador de riego, al ERP o al móvil del encargado, sin que nadie la teclee.',
    },
    {
      verbo: 'Escribir',
      texto:
        'Lo que antes era papeleo, hecho solo: un informe semanal que se lee en cinco minutos, un asistente que contesta con la página del manual, un pliego leído entero antes de ofertar.',
    },
  ],
}

export const MAQUETAS_CABECERA = {
  kicker: 'Maquetas',
  titulo: 'Las maquetas completas.',
  entradilla: 'Varios de estos ejemplos tienen detrás una maqueta entera, con muchas más pantallas de las que caben aquí.',
}

export const LEGAL = {
  resumen: 'Aviso legal y privacidad',
  parrafos: [
    'Titular de esta web: razón social pendiente de completar, NIF pendiente, domicilio pendiente.',
    'Esta web no usa cookies de seguimiento ni herramientas de analítica.',
    'Si nos escribe, usaremos su correo solo para contestarle. No lo cedemos a nadie y puede pedirnos que lo borremos cuando quiera.',
  ],
}
