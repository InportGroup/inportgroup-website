// Textos de la página (GUIA.md, sección 7). Los sectores están en sectores.js.
// Reglas: sin guiones, negrita solo en lo marcado como giro o negrita, sin emojis ni flechas, de tú, concreto antes que abstracto (GUIA.md, sección 3).
// Orden: por qué (portada), cómo (lo que nos mueve), qué (un caso por sector) y contacto.

// foto.src: ruta en public/ (por ejemplo '/fotos/equipo.jpg'). Mientras sea null se ve el hueco rayado.
export const PORTADA = {
  titulo: { antes: '¿Y si no tuviera por qué hacerse ', marca: 'así', despues: '?' },
  // La frase se parte en dos: la primera mitad cierra la primera pantalla y el giro, en negrita, aparece al bajar.
  entradilla: { antes: 'El mundo está lleno de cosas que funcionan', giro: 'peor de lo que deberían' },
  sectores: 'Marítimo · Industria · Construcción · Agricultura · Ganadería · Retail',
  nota: 'Mitad ingenieros. Mitad cirujanos de procesos.',
  foto: {
    src: '/fotos/equipo.jpg',
    alt: 'El equipo de Inport en su oficina taller: el modelo 3D de un casco en pantalla, un dron en montaje, una impresora 3D y, al fondo, un ensayo con llama.',
    pendiente: 'el equipo trabajando en campo',
  },
  pie: 'El equipo al que llamas cuando una operación podría funcionar muchísimo mejor, pero nadie ha encontrado cómo.',
}

// Cómo (banda oscura, "04"): titular, nota sobre lima y lo que nos mueve, en tres puntos.
export const COMO = {
  numero: '04',
  titulo: 'Sin diapositivas ni catálogos que colocarte. Nos da igual el envoltorio.',
  nota: 'No es tecnología. Es ingenio aplicado.',
  mueve: {
    titulo: 'Lo que nos mueve',
    lista: [
      'Meternos de lleno en retos que quitan el sueño',
      'Destripar lo complejo y buscar la fisura',
      { antes: 'Convertir un caos de proceso en algo ', negrita: 'fino, ágil y automático' },
    ],
  },
}

export const QUE = {
  titulo: 'Algunas de las cosas que hemos desmontado para que funcionen mejor.',
  entradilla: 'Seis sectores, una misma manera de mirar. Elige uno.',
}

export const CONTACTO = {
  titulo: '¿Quieres hacer algo disruptivo?',
  boton: 'Escríbenos',
  llamar: 'Llámanos',
}

// Pie: qué hace Inport con las palabras de la descripción de la página (para el buscador y para quien llega al final)
// y un enlace a cada caso, ya que la barra de arriba no tiene menú.
export const PIE = {
  texto:
    'Inport: soluciones digitales a medida en industria, construcción, sector marítimo y portuario, agricultura, ganadería y retail. Software, visión artificial, drones y sensores conectados a lo que ya tienes.',
  casos: 'Casos por sector',
}

export const LEGAL = {
  resumen: 'Aviso legal y privacidad',
  parrafos: [
    'Titular de esta web: razón social pendiente de completar, NIF pendiente, domicilio pendiente.',
    'Esta web no usa cookies de seguimiento ni herramientas de analítica.',
    'Si nos escribes, usaremos tu correo solo para contestarte. No lo cedemos a nadie y puedes pedirnos que lo borremos cuando quieras.',
  ],
}
