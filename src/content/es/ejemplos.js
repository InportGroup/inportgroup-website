// Los ejemplos de la página, en el orden de los sectores (GUIA.md, secciones 7 y 9). El id es también su ancla.
// tipo de cifra: 'demo' (datos de demostración), 'diseño' (especificación del sistema),
// 'proyecto' (resultado real con permiso) o 'fuente' (dato público, con fuente y enlace).
// Sin nombres de clientes (GUIA.md, sección 2.4).

export const EJEMPLOS = [
  {
    id: 'obra',
    sector: 'industria',
    color: 'industria',
    kicker: 'Construcción',
    titulo: 'Control de avance de obra con dron',
    entradilla:
      'El jefe de obra sabe cómo va la estructura. Lo difícil es demostrarlo en la certificación de fin de mes y ver a tiempo qué planta se está quedando atrás.',
    parrafos: [
      'Un vuelo de dron por semana se compara con el modelo BIM y la planificación: sale lo ejecutado por partida y lo que va retrasado. Las cámaras de obra avisan si alguien entra bajo la carga de la grúa, sin guardar caras.',
    ],
    cifras: [
      { valor: '1', texto: 'vuelo de dron por semana', tipo: 'diseño' },
      { valor: '2 cm', texto: 'de precisión con apoyo RTK', tipo: 'diseño' },
      { valor: '0', texto: 'caras guardadas', tipo: 'diseño' },
    ],
    noHace: 'No certifica por su cuenta: prepara la medición y la firma el jefe de obra. No vigila a las personas, solo zonas.',
    origen: 'Es una propuesta nuestra para constructoras; todavía no tiene maqueta.',
    escena: 'obra',
    maqueta: null,
  },
  {
    id: 'hornos',
    sector: 'industria',
    color: 'industria',
    kicker: 'Valorización energética',
    titulo: 'La cámara del horno, conectada al sistema de control',
    entradilla:
      'Las cámaras de los hornos enseñan fuego a quien tenga tiempo de mirarlas. Lo que ven no queda registrado como dato, y cada turno lo interpreta a su manera.',
    parrafos: [
      'Analizamos en memoria el vídeo de las cámaras que ya existen. La imagen se divide en una malla de 5 × 4 y cada pocos segundos llegan al DCS veinte intensidades, el frente de llama y una lectura del aire. Si la lente se ensucia o la cámara se mueve, el sistema lo corrige y lo dice.',
    ],
    cifras: [
      { valor: '20', texto: 'valores de intensidad por horno, cada dos a cinco segundos', tipo: 'diseño' },
      { valor: '5 s', texto: 'como máximo para avisar de que el dato no vale', tipo: 'diseño' },
      { valor: '0', texto: 'imágenes grabadas: todo se analiza en memoria', tipo: 'diseño' },
    ],
    noHace: 'No regula el horno: entrega medidas y la lógica de control es del DCS. Si la imagen cae por debajo de la calidad mínima, deja de corregir y envía "Imagen no válida".',
    origen: 'Sale de una propuesta para una planta de valorización con cuatro hornos de parrilla.',
    escena: 'hornos',
    maqueta: 'combustion',
  },
  {
    id: 'astilleros',
    sector: 'industria',
    color: 'mar',
    kicker: 'Astilleros',
    titulo: 'Inspección de cascos y presupuesto de dique en el día',
    entradilla:
      'Cada día de un buque en dique cuesta. Medir a mano la corrosión de la obra viva lleva jornadas, depende de quién mire y retrasa el presupuesto de la reparación.',
    parrafos: [
      'Un dron recorre casco, cubierta y bodegas con un plan de vuelo automático. Sobre el modelo 3D se marcan óxido, incrustaciones, pintura degradada y abolladuras, y salen los metros de chorreado, los litros de pintura y las horas del presupuesto.',
    ],
    cifras: [
      { valor: '1', texto: 'mañana de vuelo para el casco completo', tipo: 'demo' },
      { valor: '1.240 m²', texto: 'de chorreado medidos en el buque del ejemplo', tipo: 'demo' },
      { valor: '13:40', texto: 'sale el presupuesto de un buque que entró en dique a las 07:30', tipo: 'demo' },
    ],
    noHace: 'No sustituye la inspección de la sociedad de clasificación. Prepara la medición y la evidencia.',
    origen: 'Sale de nuestra maqueta de inspección naval con dron.',
    escena: 'astilleros',
    maqueta: 'naval',
  },
  {
    id: 'procesos',
    sector: 'automatizacion',
    color: 'operaciones',
    kicker: 'Administración y compras',
    titulo: 'Albaranes y facturas al ERP, sin teclear',
    entradilla:
      'Cada semana entran cientos de albaranes y facturas por correo, en foto o en papel, y alguien los teclea uno a uno. Es lento, se cuelan errores y nadie los ve hasta que el mes no cuadra.',
    parrafos: [
      'Los documentos se leen solos, se cruzan con el pedido y la recepción, y lo que cuadra pasa al ERP sin que nadie lo toque. Lo que no cuadra llega a una persona con la diferencia ya señalada. El mismo método sirve para partes de trabajo, certificados o pedidos de cliente.',
    ],
    cifras: [
      { valor: '146', texto: 'documentos leídos en la semana del ejemplo', tipo: 'demo' },
      { valor: '38 h', texto: 'al mes que ya no se teclean', tipo: 'demo' },
      { valor: '1 de 9', texto: 'documentos acaba en revisión humana', tipo: 'demo' },
    ],
    noHace: 'No paga ni aprueba nada por su cuenta. Lo que no cuadra, o lo que supera el importe que usted fije, lo decide una persona.',
    origen: 'Sale de nuestros proyectos de digitalización, como la plataforma de cebo, donde los albaranes de pienso se tecleaban a mano.',
    escena: 'procesos',
    maqueta: null,
  },
  {
    id: 'boutique',
    sector: 'retail',
    color: 'comercio',
    kicker: 'Tiendas de lujo',
    titulo: 'Afluencia, esperas y escaparate en tiendas de lujo',
    entradilla:
      'Un sábado de crucero la sala se llena, y nadie sabe cuánto ha esperado cada cliente hasta que alguien le atiende, ni qué parte del escaparate le hizo entrar.',
    parrafos: [
      'Las cámaras que ya tiene la tienda convierten cada visita en un punto anónimo sobre el plano: recorridos, calor y tiempo hasta el primer saludo. Fuera, otra cuenta cuántos se paran ante el escaparate. Lo hacemos bajo nuestra marca InLux.',
    ],
    cifras: [
      { valor: '38 s', texto: 'de media hasta el primer saludo', tipo: 'demo' },
      { valor: '14,2 %', texto: 'de quienes pasan se detienen ante el escaparate', tipo: 'demo' },
      { valor: '21', texto: 'personas en sala el sábado a las 17:50', tipo: 'demo' },
    ],
    noHace: 'No reconoce caras ni deduce nada de nadie por su aspecto.',
    origen: 'Sale de InLux y de su maqueta con una tienda piloto en Canarias.',
    escena: 'boutique',
    maqueta: 'inlux',
  },
  {
    id: 'cultivo',
    sector: 'campo',
    color: 'campo',
    kicker: 'Cultivos leñosos',
    titulo: 'Detección de heladas en la yema, no en la garita',
    entradilla:
      'En una noche despejada de marzo la estación marca 0,4 grados y la yema del pistachero ya está a 2,8 bajo cero. La estación mide el aire a metro y medio, no el frío que llega a la yema.',
    parrafos: [
      'Una cámara térmica fija en el sector más expuesto mide la temperatura real de la yema y, con los datos de la estación que ya tiene, avisa con hasta 72 horas de margen. En floración, un vuelo de dron cuenta los racimos y adelanta la previsión de cosecha cinco meses.',
    ],
    cifras: [
      { valor: '2,8', texto: 'grados bajo cero en la yema con la garita a 0,4', tipo: 'demo' },
      { valor: '72 h', texto: 'de margen en el aviso de helada', tipo: 'diseño' },
      {
        valor: '89.794 ha',
        texto: 'de pistacho en España en 2025',
        tipo: 'fuente',
        fuente: 'ESYRCE 2025, Ministerio de Agricultura',
        url: 'https://www.mapa.gob.es/es/estadistica/temas/estadisticas-agrarias/agricultura/esyrce',
      },
    ],
    noHace: 'No sustituye al técnico de campo ni decide por él cuándo regar. Si un sensor de la finca deriva, se marca y no se usa hasta revisarlo.',
    origen: 'Sale de nuestra maqueta para el cultivo del pistacho.',
    escena: 'cultivo',
    maqueta: 'pistacho',
  },
  {
    id: 'cebo',
    sector: 'campo',
    color: 'campo',
    kicker: 'Ganadería de cebo',
    titulo: 'Seguimiento diario de cebas de porcino',
    entradilla:
      'Un repunte de bajas o un consumo de pienso que se dispara se suelen descubrir al cerrar la ceba, cuando ya no hay margen. Los datos se apuntan en hojas de cálculo, tarde y a mano.',
    parrafos: [
      'El ganadero apunta bajas, pienso y movimientos en el móvil, aunque no haya cobertura, y el veterinario lo valida. Cada ceba se compara con las mejores del histórico y, si la mortalidad de los últimos siete días pasa del 0,5 %, salta el aviso.',
    ],
    cifras: [
      { valor: '0,5 %', texto: 'de mortalidad en siete días dispara el aviso', tipo: 'diseño' },
      { valor: '3', texto: 'perfiles: ganadero, veterinario y administración', tipo: 'diseño' },
      { valor: '2,61', texto: 'índice de conversión al cierre de la ceba del ejemplo', tipo: 'demo' },
    ],
    noHace: 'No sustituye la visita del veterinario ni toma decisiones sanitarias. Lo que apunta el ganadero se conserva siempre, aunque después se corrija.',
    origen: 'Sale de un proyecto en marcha con una integradora de porcino.',
    escena: 'cebo',
    maqueta: null,
  },
]

export const ejemplosDe = (sector) => EJEMPLOS.filter((e) => e.sector === sector)
