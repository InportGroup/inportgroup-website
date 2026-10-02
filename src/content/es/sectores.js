// Los cuatro sectores de la web, en el orden de la página (decisión 14, GUIA.md, sección 12):
// industria, automatización de procesos, retail, y agricultura y ganadería.
// Cada sector es una sección con su ancla, lo que hacemos en él y sus ejemplos (ejemplos.js).
// El color va en tokens.css; la paleta está validada también en este orden (GUIA.md, sección 4).
// Las líneas con `ejemplo` enlazan al capítulo que lo cuenta.

export const SECTORES = [
  {
    id: 'industria',
    nombre: 'Industria',
    color: 'industria',
    kicker: 'Industria',
    titulo: 'La obra, el horno y el dique, medidos.',
    entradilla:
      'Una obra que se mide cada semana, un horno que manda al sistema de control lo que ve su cámara, un casco que un dron recorre en una mañana. Medidas que llegan a quien decide, con el mismo criterio en todos los turnos.',
    lineas: [
      { texto: 'Avance de obra con dron frente al modelo BIM, y seguridad bajo la carga de la grúa.', ejemplo: 'obra' },
      { texto: 'Del vídeo de la parrilla al sistema de control, en plantas de valorización energética.', ejemplo: 'hornos' },
      { texto: 'Inspección de cascos en dique con dron, y presupuesto de reparación el mismo día.', ejemplo: 'astilleros' },
      { texto: 'Lectura de pliegos y revisión de ofertas, con la página citada en cada hallazgo.' },
    ],
  },
  {
    id: 'automatizacion',
    nombre: 'Automatización',
    color: 'operaciones',
    kicker: 'Automatización de procesos',
    titulo: 'El trabajo repetitivo, hecho solo y bien.',
    entradilla:
      'Albaranes, facturas, partes e informes que hoy pasan de mano en mano. Los conectamos con el ERP, el correo y los sistemas que ya usa, para que nadie teclee lo que ya está escrito y las excepciones lleguen a quien decide.',
    lineas: [
      { texto: 'Albaranes y facturas que pasan al ERP sin teclearlos, cruzados con el pedido.', ejemplo: 'procesos' },
      { texto: 'Sistemas que no se hablan, conectados: ERP, CRM, hojas de cálculo y máquinas.' },
      { texto: 'Informes semanales escritos a partir de los datos, para leer en cinco minutos.' },
      { texto: 'Un asistente que contesta con los manuales y procedimientos, citando la página.' },
    ],
  },
  {
    id: 'retail',
    nombre: 'Retail',
    color: 'comercio',
    kicker: 'Retail',
    titulo: 'Lo que pasa en la tienda, contado con datos.',
    entradilla:
      'Cuánta gente se para ante el escaparate, dónde se queda y cuánto espera hasta que alguien la atiende. Con las cámaras que ya tiene la tienda, sin caras y sin guardar imágenes.',
    lineas: [
      { texto: 'Recorridos anónimos, calor y tiempo de espera en tiendas de lujo.', ejemplo: 'boutique' },
      { texto: 'El escaparate medido: cuántos pasan, cuántos se paran y cuántos entran.' },
      { texto: 'Interés por pieza: lo que se prueba mucho y se vende poco.' },
      { texto: 'Previsión de afluencia con cruceros, festivos y el tiempo.' },
    ],
  },
  {
    id: 'campo',
    nombre: 'Campo',
    color: 'campo',
    kicker: 'Agricultura y ganadería',
    titulo: 'La finca y la granja, contadas a tiempo.',
    entradilla:
      'Heladas que la garita no ve, bajas que se apuntan sin cobertura, racimos que se cuentan en abril para saber qué se recogerá en septiembre. Trabajamos con la estación, las sondas y el móvil que ya hay.',
    lineas: [
      { texto: 'Heladas, riego y previsión de cosecha en cultivos leñosos: pistacho, almendro, olivar.', ejemplo: 'cultivo' },
      { texto: 'Seguimiento diario de cebas de porcino, con la aplicación del ganadero y avisos al veterinario.', ejemplo: 'cebo' },
      { texto: 'Cojeras y celo en vacuno de leche, con una cámara a la salida de la sala de ordeño.' },
      { texto: 'Biomasa y alimentación en jaulas de acuicultura, sin sacar un pez.' },
    ],
  },
]

export const sectorPorId = (id) => SECTORES.find((s) => s.id === id) || null
