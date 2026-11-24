// Un caso por sector, en el orden de las pestañas (GUIA.md, sección 7.4). El id es también su ancla: /#retail.
// Sin nombres de clientes (GUIA.md, sección 2.4). Cada caso: el problema, la solución, cómo funciona,
// otras aplicaciones en el mismo sector, sus límites y el prototipo si existe.
// prototipo.url: solo prototipos abiertos. Los privados no llevan dirección: este repositorio es público.
// foto.src: ruta en public/ (por ejemplo '/fotos/maritimo.jpg'). Mientras sea null se ve el hueco rayado.

export const SECTORES = [
  {
    id: 'maritimo',
    letra: 'A',
    nombre: 'Marítimo y portuario',
    titulo: 'El casco medido y presupuestado en un día.',
    foto: { src: null, alt: 'Dron inspeccionando el casco de un buque en dique seco', pendiente: 'dron sobre un casco en dique seco' },
    problema:
      'Cada día de un buque en dique cuesta dinero. Medir a mano la corrosión de la obra viva exige andamios, lleva jornadas y depende de quién mire. Mientras tanto, el presupuesto de la reparación espera.',
    solucion:
      'Digitalizamos el buque con dron y visión artificial, y conectamos lo que se ve con un motor de medición y presupuesto. El astillero empieza la reparación con el alcance ya definido.',
    pasos: [
      { verbo: 'Volamos', texto: 'Un plan de vuelo automático recorre casco, cubierta y bodegas.' },
      { verbo: 'Reconstruimos', texto: 'Un modelo 3D del buque con cada daño en su sitio.' },
      { verbo: 'Medimos', texto: 'Metros cuadrados de óxido, incrustación y pintura degradada.' },
      { verbo: 'Presupuestamos', texto: 'Chorreado, pintura y horas, en partidas revisables.' },
      { verbo: 'Planificamos', texto: 'Equipos y materiales asignados el mismo día.' },
    ],
    otras: [
      { titulo: 'Plataformas y unidades FPSO', texto: 'La misma inspección con dron donde el acceso es difícil y cada hora de andamio cuesta.' },
      { titulo: 'Cubiertas y carga', texto: 'El estado de cubiertas y bodegas documentado con dron, para revisarlo desde la oficina.' },
      { titulo: 'Contenedores en terminal', texto: 'Cámaras en la puerta que registran los daños visibles de cada contenedor al entrar.' },
    ],
    limites: 'La medición y el presupuesto los valida personal cualificado. No sustituye la inspección de la sociedad de clasificación.',
    prototipo: { texto: 'Ver el prototipo de inspección naval', url: 'https://arnaucarol-inportgroup.github.io/naval-solutions/' },
  },
  {
    id: 'industria',
    letra: 'B',
    nombre: 'Industria',
    titulo: 'El fuego de la parrilla, en veinte números.',
    foto: { src: null, alt: 'Imagen de la cámara de un horno de parrilla', pendiente: 'la imagen de la cámara de un horno' },
    problema:
      'En una planta de valorización energética la combustión condiciona toda la operación. Las cámaras del horno enseñan el fuego a quien tenga tiempo de mirarlas, pero lo que ven no queda registrado y cada turno lo interpreta a su manera.',
    solucion:
      'Convertimos el vídeo de las cámaras que ya existen en medidas que llegan al DCS junto a temperaturas, caudales y aire. Todo se analiza en memoria y no se graba ninguna imagen.',
    pasos: [
      { verbo: 'Capturamos', texto: 'El vídeo de las cámaras que ya tiene el horno.' },
      { verbo: 'Dividimos', texto: 'La imagen en una malla de 5 × 4 celdas.' },
      { verbo: 'Medimos', texto: 'Intensidad por celda, frente de llama y aire.' },
      { verbo: 'Enviamos', texto: 'Veinte valores al DCS cada dos a cinco segundos.' },
      { verbo: 'Vigilamos', texto: 'Si la lente se ensucia o la cámara se mueve, lo dice.' },
    ],
    otras: [
      { titulo: 'Estabilidad de la combustión', texto: 'Patrones de la llama relacionados con los cambios de carga, aire y empujadores.' },
      { titulo: 'Aviso temprano', texto: 'Comportamientos inusuales señalados para revisarlos antes de que afecten a la operación.' },
      { titulo: 'Histórico por turno', texto: 'Lo que antes se veía y se olvidaba queda registrado para comparar ajustes y resultados.' },
    ],
    limites:
      'No regula el horno: entrega medidas y la lógica de control sigue en el DCS. Si la imagen no tiene calidad suficiente, deja de corregir y avisa de que el dato no vale.',
    prototipo: { texto: 'Prototipo privado. Te lo enseñamos en una reunión.' },
  },
  {
    id: 'campo',
    letra: 'C',
    nombre: 'Agricultura y ganadería',
    titulo: 'La helada se mide en la yema, no en la garita.',
    foto: { src: null, alt: 'Cámara térmica en una finca de pistacheros', pendiente: 'cámara térmica en una finca' },
    problema:
      'En una noche despejada de marzo la estación marca 0,4 grados y la yema del pistachero ya está a 2,8 bajo cero. La estación mide el aire a metro y medio, no el frío que llega a la yema, y cuando avisa ya es tarde.',
    solucion:
      'Medimos el frío donde hace daño y lo cruzamos con lo que ya hay en la finca. El técnico recibe el aviso con margen para actuar.',
    pasos: [
      { verbo: 'Medimos', texto: 'La temperatura de la yema con una cámara térmica fija.' },
      { verbo: 'Cruzamos', texto: 'Con la estación, las sondas y la previsión.' },
      { verbo: 'Anticipamos', texto: 'El riesgo de helada con hasta 72 horas de margen.' },
      { verbo: 'Avisamos', texto: 'Al técnico, a tiempo de encender ventiladores o riego.' },
    ],
    otras: [
      { titulo: 'Previsión de cosecha', texto: 'Un vuelo de dron en floración cuenta los racimos y adelanta la previsión cinco meses.' },
      { titulo: 'Riego y estrés hídrico', texto: 'Un mapa árbol a árbol para regar donde hace falta.' },
      { titulo: 'Plagas', texto: 'Trampas con cámara que clasifican los insectos capturados.' },
      {
        titulo: 'Cebas de porcino',
        texto: 'Bajas y pienso apuntados en el móvil, aunque no haya cobertura, con aviso al veterinario si la mortalidad se dispara.',
      },
    ],
    limites: 'No sustituye al técnico de campo ni decide por él. Si un sensor de la finca deriva, se marca y no se usa hasta revisarlo.',
    prototipo: {
      texto: 'Ver el prototipo para el pistacho',
      url: 'https://pistacho-mockup.onrender.com/',
      nota: 'La primera carga puede tardar un minuto.',
    },
  },
  {
    id: 'retail',
    letra: 'D',
    nombre: 'Retail',
    titulo: 'Qué pasa en la tienda antes de que alguien compre.',
    foto: { src: null, alt: 'Sala de una tienda con el mapa de recorridos', pendiente: 'la sala de una tienda' },
    problema:
      'El TPV dice qué vendes y cuánto. No dice por dónde se mueven los clientes, dónde se paran ni qué piezas pasan desapercibidas. Sin esos datos, el personal, el espacio y el escaparate se deciden a ojo.',
    solucion:
      'Las cámaras que ya tiene la tienda convierten cada visita en un punto anónimo sobre el plano. Lo cruzamos con las ventas para saber qué zonas atraen, cuáles venden y cuáles solo se atraviesan.',
    pasos: [
      { verbo: 'Contamos', texto: 'Quién pasa, quién se para ante el escaparate y quién entra.' },
      { verbo: 'Seguimos', texto: 'Recorridos anónimos sobre el plano de la sala.' },
      { verbo: 'Medimos', texto: 'Permanencia y espera hasta el primer saludo.' },
      { verbo: 'Cruzamos', texto: 'Con las ventas, por zona, día y hora.' },
    ],
    otras: [
      { titulo: 'Personal', texto: 'Previsión de afluencia con cruceros, festivos y el tiempo, para ajustar los turnos.' },
      { titulo: 'Espacio y producto', texto: 'Qué ubicación capta más interés y qué piezas se prueban mucho y se venden poco.' },
      { titulo: 'Entre tiendas', texto: 'Qué funciona en una tienda y merece probarse en otra.' },
    ],
    limites:
      'No reconoce caras ni identifica a nadie. El análisis es anónimo, no se guardan imágenes y se diseña conforme a la normativa de protección de datos.',
    prototipo: { texto: 'Prototipo privado. Te lo enseñamos en una reunión.' },
  },
]
