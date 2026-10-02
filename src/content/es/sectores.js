// Los cuatro sectores de la web, en el orden de la página (decisión 14, GUIA.md, sección 12):
// industria, automatización de procesos, retail, y agricultura y ganadería.
// Cada sector es una sección con su ancla, lo que hacemos en él y sus ejemplos (ejemplos.js).
// El color va en tokens.css; la paleta está validada también en este orden (GUIA.md, sección 4).
// Las líneas con `ejemplo` enlazan al capítulo que lo cuenta.

export const SECTORES = [
  {
    id: 'industria',
    numero: '03',
    nombre: 'Industria',
    color: 'industria',
    kicker: 'Industria',
    titulo: 'Medir con precisión lo que hoy se estima a ojo',
    entradilla:
      'En una obra, un horno o un dique, el valor suele estar en medir con un criterio constante lo que hoy depende de quién mire, y en que esa medida llegue sin pasos manuales al sistema que decide.',
    lineas: [
      { texto: 'Avance de obra con dron frente al modelo BIM, y seguridad bajo la carga de la grúa.', ejemplo: 'obra' },
      { texto: 'Del vídeo de la parrilla al sistema de control, en plantas de valorización energética.', ejemplo: 'hornos' },
      { texto: 'Inspección de cascos en dique con dron, y presupuesto de reparación el mismo día.', ejemplo: 'astilleros' },
      { texto: 'Lectura de pliegos y revisión de ofertas, con la página citada en cada hallazgo.' },
    ],
  },
  {
    id: 'automatizacion',
    numero: '04',
    nombre: 'Automatización',
    color: 'operaciones',
    kicker: 'Automatización de procesos',
    titulo: 'Procesos administrativos que funcionan solos',
    entradilla:
      'No todo el valor está en planta. En la oficina, albaranes, facturas, partes e informes pasan de mano en mano y se teclean dos veces. Los conectamos con el ERP y el resto de sistemas para que lo rutinario se haga solo y las excepciones lleguen a quien decide.',
    lineas: [
      { texto: 'Albaranes y facturas que pasan al ERP sin teclearlos, cruzados con el pedido.', ejemplo: 'procesos' },
      { texto: 'Sistemas que no se hablan, conectados: ERP, CRM, hojas de cálculo y máquinas.' },
      { texto: 'Informes semanales escritos a partir de los datos, para leer en cinco minutos.' },
      { texto: 'Un asistente que contesta con los manuales y procedimientos, citando la página.' },
    ],
  },
  {
    id: 'retail',
    numero: '05',
    nombre: 'Retail',
    color: 'comercio',
    kicker: 'Retail',
    titulo: 'Datos de tienda para decidir personal, espacio y escaparate',
    entradilla:
      'La misma forma de medir, llevada a la tienda. Con las cámaras que ya tiene, sin caras ni imágenes guardadas, sabemos cuánta gente se para ante el escaparate, dónde se queda y cuánto espera hasta que alguien la atiende.',
    lineas: [
      { texto: 'Recorridos anónimos, calor y tiempo de espera en tiendas de lujo.', ejemplo: 'boutique' },
      { texto: 'El escaparate medido: cuántos pasan, cuántos se paran y cuántos entran.' },
      { texto: 'Interés por pieza: lo que se prueba mucho y se vende poco.' },
      { texto: 'Previsión de afluencia con cruceros, festivos y el tiempo.' },
    ],
  },
  {
    id: 'campo',
    numero: '06',
    nombre: 'Campo',
    color: 'campo',
    kicker: 'Agricultura y ganadería',
    titulo: 'Anticiparse en el campo, donde cada día cuenta',
    entradilla:
      'En una finca o una granja, una helada o un repunte de bajas se pagan durante toda la campaña. El valor está en verlo a tiempo, con la estación, las sondas y el móvil que ya hay, y en avisar a quien puede actuar.',
    lineas: [
      { texto: 'Heladas, riego y previsión de cosecha en cultivos leñosos: pistacho, almendro, olivar.', ejemplo: 'cultivo' },
      { texto: 'Seguimiento diario de cebas de porcino, con la aplicación del ganadero y avisos al veterinario.', ejemplo: 'cebo' },
      { texto: 'Cojeras y celo en vacuno de leche, con una cámara a la salida de la sala de ordeño.' },
      { texto: 'Biomasa y alimentación en jaulas de acuicultura, sin sacar un pez.' },
    ],
  },
]

export const sectorPorId = (id) => SECTORES.find((s) => s.id === id) || null
