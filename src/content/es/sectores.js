// Un caso por sector, en el orden de las pestañas (GUIA.md, sección 7.4). El id es también su ancla: /#retail.
// Sin nombres de clientes (GUIA.md, sección 2.4). Cada caso: nota a mano, titular, el problema y la solución (un párrafo por elemento; { negrita } es la frase destacada del caso, una por sector), su vídeo
// (escena en src/scenes/registry.js), sus límites y el prototipo.
// Sin enlaces a otras webs: los prototipos no llevan dirección y se enseñan en una reunión.

export const SECTORES = [
  {
    id: 'maritimo',
    escena: 'astilleros',
    letra: 'A',
    nombre: 'Marítimo y portuario',
    nota: 'del casco al presupuesto ↓',
    titulo: 'Del activo real al plan de actuación.',
    problema: [
      'Cuando un buque, una plataforma o una unidad FPSO entra en dique, cada día cuenta. Inspeccionar, documentar daños, medirlos y presupuestar exige personal, accesos complejos y muchas horas, con la información repartida entre fotos, informes y sistemas distintos.',
      { negrita: 'Más tiempo para inspeccionar, más incertidumbre para presupuestar.' },
    ],
    solucion: [
      'Digitalizamos el activo con drones, reconstrucción 3D y visión artificial. Sobre ese modelo documentamos corrosión, pintura deteriorada o incrustaciones y los conectamos con un motor de medición y presupuestación.',
      'Resultado: llegar al dique con el alcance mucho mejor definido.',
    ],
    limites: 'La medición y el presupuesto los valida personal cualificado. No sustituye la inspección de la sociedad de clasificación.',
    prototipo: { texto: 'Prototipo privado. Te lo enseñamos en una reunión.' },
  },
  {
    id: 'industria',
    escena: 'hornos',
    letra: 'B',
    nombre: 'Industria',
    nota: 'El horno habla. Ahora podemos interpretarlo.',
    titulo: 'De dentro del horno a la sala de control.',
    problema: [
      'En una planta de valorización energética de residuos, la combustión condiciona toda la operación. Llama, temperatura, movimiento de residuos… pasan muchas cosas a la vez y es difícil observarlas de forma continua o relacionarlas con el sistema de control.',
      { negrita: 'El horno está trabajando. ¿Cuánto sabemos de lo que pasa dentro?' },
    ],
    solucion: [
      'Conectamos las cámaras de combustión con una plataforma que convierte imágenes en información operativa en tiempo real, y la cruzamos con los datos de planta (PLC, SCADA, DCS).',
      'No es otra pantalla en la sala de control: es dar significado a lo que ya se está viendo.',
    ],
    limites:
      'No regula el horno: entrega medidas y la lógica de control sigue en el DCS. Si la imagen no tiene calidad suficiente, deja de corregir y avisa de que el dato no vale.',
    prototipo: { texto: 'Prototipo privado. Te lo enseñamos en una reunión.' },
  },
  {
    id: 'construccion',
    escena: 'obra',
    letra: 'C',
    nombre: 'Construcción',
    nota: 'Del vuelo a la certificación.',
    titulo: 'El avance de obra, medido cada semana.',
    problema: [
      'El jefe de obra sabe cómo va la estructura. Lo difícil es demostrarlo en la certificación de fin de mes y ver a tiempo qué planta se está quedando atrás.',
      { negrita: 'Lo que no se mide cada semana se discute a fin de mes.' },
    ],
    solucion: [
      'Un vuelo de dron por semana se compara con el modelo BIM y la planificación. Sale lo ejecutado por partida y lo que va retrasado.',
      'Resultado: la medición de fin de mes llega preparada para que la firme el jefe de obra.',
    ],
    limites: 'No certifica por su cuenta: prepara la medición y la firma el jefe de obra. No vigila a las personas, solo zonas.',
    prototipo: { texto: 'Propuesta para constructoras, todavía sin prototipo. Te la contamos en una reunión.' },
  },
  {
    id: 'campo',
    escena: 'cultivo',
    letra: 'D',
    nombre: 'Agricultura',
    nota: 'El campo, con más información.',
    titulo: 'Datos dispersos, una sola visión.',
    problema: [
      'Cultivos y explotaciones generan datos, pero repartidos entre sensores, imágenes, satélites y herramientas que no se hablan. Cuesta anticiparse, medir la rentabilidad y detectar desviaciones a tiempo.',
    ],
    solucion: [
      'Conectar sensores, imágenes, datos satelitales e IA para ver mejor lo que ocurre en cada explotación.',
      { negrita: 'Resultado: más visibilidad y capacidad de anticiparse antes de que haya pérdidas.' },
    ],
    limites: 'No sustituye al técnico de campo ni decide por él. Si un sensor de la finca deriva, se marca y no se usa hasta revisarlo.',
    prototipo: { texto: 'Prototipo privado. Te lo enseñamos en una reunión.' },
  },
  {
    id: 'ganaderia',
    escena: 'cebo',
    letra: 'E',
    nombre: 'Ganadería',
    nota: 'De la nave al veterinario, el mismo día.',
    titulo: 'Cada ceba de porcino, seguida día a día.',
    problema: [
      'En una ceba, un repunte de bajas o un consumo de pienso que se dispara se suele descubrir al cerrarla, cuando ya no hay margen. Los datos se apuntan tarde y a mano, en hojas de cálculo, y dentro de la nave muchas veces no hay cobertura.',
      { negrita: 'Cuando el problema sale en los números, la ceba ya está cerrada.' },
    ],
    solucion: [
      'El ganadero apunta bajas, pienso y movimientos en el móvil, aunque no haya cobertura, y el veterinario lo valida. Cada ceba se compara con las mejores del histórico.',
      'Resultado: si la mortalidad de los últimos siete días pasa del 0,5 %, salta el aviso al veterinario.',
    ],
    limites: 'No sustituye la visita del veterinario ni toma decisiones sanitarias. Lo que apunta el ganadero se conserva siempre, aunque después se corrija.',
    prototipo: { texto: 'Proyecto en marcha. Te lo enseñamos en una reunión.' },
  },
  {
    id: 'retail',
    escena: 'boutique',
    letra: 'F',
    nombre: 'Retail',
    nota: 'La tienda también habla. Hay que saber leerla.',
    titulo: 'Qué pasa en la tienda antes de que alguien compre.',
    problema: [
      'Sabes qué vendes. Quizá cuánto. Pero ¿por dónde se mueven los clientes, dónde se detienen, qué productos pasan desapercibidos?',
      { negrita: 'Sin datos de comportamiento, muchas decisiones se toman por intuición.' },
    ],
    solucion: [
      'Visión artificial y analítica para convertir la actividad en tienda en mapas de calor, recorridos y tiempos de permanencia, cruzados cuando se puede con ventas y otras fuentes.',
      'Capturamos. Interpretamos. Conectamos. Mejoramos.',
    ],
    limites:
      'No reconoce caras ni identifica a nadie. El análisis es anónimo, no se guardan imágenes y se diseña conforme a la normativa de protección de datos.',
    prototipo: { texto: 'Prototipo privado. Te lo enseñamos en una reunión.' },
  },
]
