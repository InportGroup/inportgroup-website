# Inport · Guía de la web

Fuente de verdad de www.inportgroup.com: idea, tono, sistema visual, estructura, arquitectura y decisiones. Si algo no encaja, se cambia primero aquí y después en el código.

Versión del 24 de noviembre de 2026 (rediseño V2). La guía anterior, con la especificación completa de las escenas y las fichas de cada solución, está en el historial de Git (commit `cbb7893`, rama `main` antes del rediseño).

Este documento sigue las mismas reglas de redacción que la web: sin guiones en el texto y sin negritas.

---

## 1. La idea

Inport hace soluciones digitales a medida para procesos que funcionan peor de lo que deberían. Se mete donde no basta con comprar un producto: el casco de un buque en dique, el horno de una planta de valorización, una finca en noche de helada, la sala de una tienda.

Lema: "Engineering the unexpected". Se queda en inglés, como marca. No sale en la página: solo en los datos estructurados y en la imagen para compartir.

La página sigue el orden por qué, cómo y qué:

1. Por qué: hay procesos que podrían ir mucho mejor y nadie ha encontrado cómo. Eso es lo que nos mueve.
2. Cómo: lo que nos mueve, en tres puntos: meternos en retos que quitan el sueño, destripar lo complejo y buscar la fisura, y convertir un caos de proceso en algo fino, ágil y automático.
3. Qué: un caso por sector, con el problema, la solución, un vídeo corto que lo enseña funcionando, sus límites y el prototipo.

Quien llega tiene que entender en diez segundos qué hacemos y para qué sectores. La técnica (visión artificial, dron, predicción) se nombra dentro de los casos, nunca como etiqueta de la empresa. No nos vendemos como empresa de inteligencia artificial.

Lo que nos distingue, y que la web dice con hechos:

* Partimos de lo que el cliente ya tiene instalado: cámaras, sensores, el sistema de control, el ERP.
* Probamos en pequeño con un resultado acordado antes de empezar.
* Entregamos el código, la documentación y la formación.
* Cada caso dice lo que el sistema no hace.

---

## 2. Confidencialidad

En la web pública no aparecen nombres de clientes, ubicaciones de plantas, precios, condiciones contractuales ni cifras de un proyecto real sin permiso por escrito. Este repositorio es público: tampoco aquí.

* Se habla de "una planta de valorización", "una finca de pistacheros", "una integradora de porcino".
* Ningún enlace a otras webs. Los prototipos no llevan dirección en el código. La web dice "Prototipo privado. Te lo enseñamos en una reunión."

---

## 3. Público y tono

Quien visita la web es director de operaciones, jefe de planta, responsable de reparaciones de un astillero, gerente de una explotación o director de retail. Lee deprisa, sabe mucho de su oficio y desconfía de lo que suena a folleto.

### Reglas de redacción

Obligatorias en textos, títulos, metadatos, botones, `aria-label`, `alt` y `title`.

1. Ningún guion de ningún tipo (-, ‐, –, —, −). Rangos: "de dos a cinco segundos". Temperaturas bajo cero: "2,8 bajo cero". Compuestos: "en tiempo real", "correo".
2. Nada en negrita salvo la frase que se destaca en un bloque, siempre con `<strong>` (Archivo 700): la de cada caso de uso, el giro de la portada ("peor de lo que deberían.", que va en Archivo Black y no suma peso) y la parte destacada de lo que nos mueve. Nunca `<b>` ni otro peso mayor que 400. Archivo Black es gruesa de diseño y se usa en peso 400.
3. Ni emojis, ni flechas, ni iconos decorativos, ni puntos suspensivos.
4. Nada que suene a inteligencia artificial:
   * Palabras: revolucionar, potenciar, impulsar, desbloquear, transformar, sin fisuras, sin fricción, de vanguardia, innovador, disruptivo, ecosistema, sinergia, holístico, robusto, escalable, inteligente como adorno, clave como muletilla.
   * Estructuras: "no es X, es Y", tríos de adjetivos, tres beneficios simétricos, frases que empiezan por "Imagina", exclamaciones, enumeraciones de verbos sueltos ("Capturamos. Interpretamos. Conectamos.").
   * La única pregunta permitida en un titular es la de la portada, porque es la idea de la marca.
5. Concreto antes que abstracto: horas, lugares, cantidades, nombres de máquinas y piezas, con el vocabulario del oficio (obra viva, chorreado, parrilla, DCS, yema, garita, ceba, TPV).
6. Se habla al lector de tú, como en la referencia V2. La mayor parte del texto va en primera persona del plural.
7. Mayúscula solo al principio de frase y en nombres propios.
8. Números en formato español: 2.846; 11,8 %; 17:40. El signo × para mallas: 5 × 4.
9. Separadores permitidos: punto medio (·), barra, dos puntos, comas y puntos.
10. Decir lo que el sistema no hace. Cada caso lleva sus límites.
11. Breve. Si una frase podría estar en la web de cualquier empresa de software, se reescribe o se quita.

---

## 4. Sistema visual

Papel, tinta y lima. Filetes de 2 px, esquinas rectas, sin sombras ni degradados decorativos. Anotaciones a mano en lima, como en un plano revisado en obra. Tokens en `src/styles/tokens.css`.

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--paper` | `#ECECE8` | `#141413` | Fondo |
| `--ink` | `#0C0C0B` | `#ECECE8` | Texto y filetes |
| `--lime` | `#CCFF00` | `#CCFF00` | Resaltado, etiquetas, botón, fase final |
| `--rojo` | `#D03B3B` | `#D03B3B` | Solo el subrayado del giro de la portada |
| `--mute` | `#6B6B66` | `#9A9A94` | Texto secundario |

* La lima nunca se usa para texto sobre papel claro (no contrasta). Sobre lima, el texto va siempre en `#0C0C0B`.
* Bandas oscuras (`.dark`): cómo, contacto y pie. Redefinen los tokens, así que lo de dentro se invierte solo.
* La web sigue el modo oscuro del sistema.

Tipografía, todo en peso 400 salvo las frases destacadas con `<strong>` (Archivo 700):

* Archivo Black: titulares, números grandes, títulos de tarjeta. Nunca por debajo de 22 px: en pantallas normales el punto de la i se pega al palo.
* Archivo: texto.
* Space Mono: etiquetas, pestañas, límites y botones.
* Caveat: notas a mano. Una por bloque como mucho.

Foto de la portada: marco con marcas de recorte. Mientras no hay imagen se ve un hueco rayado con lo que tiene que ir. Para ponerla basta con dejarla en `public/fotos/` y escribir su ruta en `PORTADA.foto.src` (`pagina.js`).

Vídeos de los casos: escenas dibujadas en SVG, de 18 a 30 segundos, que vienen de la web anterior. Pantalla oscura con filete de 2 px, subtítulo por plano y debajo una barra mínima: reproducir o pausar, la línea de tiempo con la cabeza en lima y la nota "Escena ilustrativa · datos de demostración". Arrancan solas al verse, hacen bucle, se paran fuera de pantalla y con movimiento reducido se quedan en un fotograma cartel. Dentro del marco las cifras grandes van en Archivo (no en Archivo Black) y los colores de dato son los de cada sector.

Lo que evitamos: rejillas de fondo con brillos, degradados morados, tarjetas iguales con icono, filas de cifras genéricas, animaciones de entrada, ilustraciones de cerebros o robots.

---

## 5. La página

Una sola página. Las anclas son una palabra sin guiones.

| Ancla | Bloque | Contenido |
|---|---|---|
| `#porque` | Portada | Titular con "así" en lima y "El mundo está lleno de cosas que funcionan", que caben en la primera pantalla sin scroll. Con un poco de scroll sube debajo el giro, "peor de lo que deberían.", en Archivo Black, con los sectores, y se dibuja su subrayado en rojo. A la derecha, la foto del equipo con nota a mano y pie |
| `#como` | Cómo (banda oscura) | "04" en lima, titular, nota a mano sobre lima y lo que nos mueve: etiqueta grande e inclinada sobre lima y tres puntos numerados; el último con su parte destacada en negrita |
| `#que` | Qué | Titular, entradilla y seis pestañas, una por sector |
| `#maritimo`, `#industria`, `#construccion`, `#campo`, `#ganaderia`, `#retail` | Pestaña de cada sector | Abren su pestaña al entrar y se actualizan al cambiar de pestaña, para poder compartir el enlace |
| `#contacto` | Contacto (banda oscura) | "¿Quieres hacer algo disruptivo?", "Llámanos o escríbenos.", botón de correo, botón de llamada y persona de contacto con correo y teléfono |
| | Pie | Año y aviso legal desplegable |

Cada panel de sector tiene siempre el mismo orden: nota a mano, titular, el problema y la solución en dos columnas, el vídeo a todo el ancho, límites y prototipo. Al acercarse al vídeo el scroll lo centra con un imán suave (scroll-snap de proximidad), sin bloquearlo.

Las pestañas cumplen el patrón de WAI-ARIA: flechas, Inicio y Fin. Todos los paneles salen en el HTML prerenderizado, los inactivos con `hidden`, para que el buscador los lea. Los vídeos no se prerenderizan: solo se carga el del sector abierto, cuando se acerca a la pantalla.

### Casos elegidos y descartados

Se queda lo que es difícil, está respaldado por un proyecto, una propuesta o un prototipo, y no se compra hecho:

| Sector | Caso principal | Vídeo | Respaldo |
|---|---|---|---|
| Marítimo y portuario | Inspección de cascos con dron y presupuesto en el día | `astilleros` | Prototipo de inspección naval |
| Industria | Cámaras del horno conectadas al DCS | `hornos` | Propuesta para una planta de valorización y prototipo privado |
| Construcción | Avance de obra con dron frente al modelo BIM | `obra` | Propuesta para constructoras, todavía sin prototipo |
| Agricultura | Heladas medidas en la yema | `cultivo` | Prototipo del pistacho |
| Ganadería | Seguimiento diario de cebas de porcino | `cebo` | Proyecto en marcha con una integradora de porcino |
| Retail | Recorridos, esperas y escaparate | `boutique` | Prototipo privado con una tienda piloto |

Descartados en el rediseño: automatización de albaranes al ERP (es un producto de mercado y diluye el mensaje), vacuno de leche y acuicultura (sin respaldo), el panorama de la portada y las escenas de procesos y recorrido, el cajetín y el grano de los vídeos, el conmutador de la escena de heladas, la sección de maquetas (los prototipos van dentro de cada sector), los botones de compartir y las filas de cifras.

---

## 6. Arquitectura

* Node 22, React 19, Vite 8 y React Router 8 en modo framework con `ssr: false` y prerenderizado: la página sale como HTML estático en `build/client`.
* JavaScript con JSX, CSS Modules por componente más `tokens.css` y `base.css`. Sin librerías de componentes ni de animación.
* Textos en `src/content/es/`: `site.js` (marca, contacto, metadatos y datos estructurados), `pagina.js` (portada, cómo con lo que nos mueve, qué, contacto y aviso legal) y `sectores.js` (los seis casos).
* Secciones en `src/sections/`: Portada, Como, Que, Contacto. Componentes en `src/components/`: Nav, Footer, Foto, Aviso.
* Vídeos: `src/components/film/Film.jsx` (reloj de la escena y movimiento de cámara), `src/components/film/Escena.jsx` (carga diferida, pantalla, subtítulo y barra), `src/scenes/` (las cuatro escenas, `kit.jsx` con sus piezas comunes y `registry.js`) y `src/lib/` (utilidades que usan las escenas). Los tokens de color de las escenas viven en `Escena.module.css`, solo dentro del marco.
* `scripts/`: `check.mjs` (reglas de la casa), `shot.mjs` (capturas), `imagenes.mjs` (iconos e imagen para compartir), `postbuild.mjs` (404.html, sitemap y CNAME), `serve.mjs` (sirve la compilación como GitHub Pages) y `cdp.mjs` (Chrome sin interfaz).

### Publicación

* GitHub Pages en modo GitHub Actions: cada subida a `main` compila y publica en www.inportgroup.com (`.github/workflows/pages.yml`). Por eso los cambios grandes se suben a otra rama y se fusionan cuando están revisados.
* `render.yaml` queda como alternativa en Render.
* Las subidas a GitHub se hacen con la cuenta ArnauCarol-InportGroup.
* Para volver a la web de 2025: la etiqueta `web2025`.

---

## 7. Lista de comprobación

1. `node scripts/check.mjs all` en verde: sin guiones, negrita solo en `<strong>`, sin desbordamientos, sin errores en consola, a 1440 y 390 px.
2. Ningún nombre de cliente.
3. Ningún enlace a otras webs.
4. Cada caso dice sus límites.
5. El texto se lee como escrito por alguien del oficio.

---

## 8. Decisiones

| # | Pregunta | Decisión |
|---|---|---|
| 1 | Idioma | Español primero. Inglés más adelante con la misma estructura. |
| 2 | Clientes y prototipos con su nombre | Anonimizar. Los prototipos privados se enseñan en persona. |
| 5 | Logotipo | Provisional: "INPORT" en Archivo Black y, como icono, una I y un punto sobre lima. |
| 6 | Contacto | Correo con el asunto escrito. Beatriz Abuelo, directora de soluciones. |
| 8 | Aviso legal | Faltan razón social, NIF y domicilio. |
| 11 | Analítica | Ninguna, así no hace falta aviso de cookies. |
| 15 | Publicación | GitHub Pages con GitHub Actions desde `main`. |
| 18 | Rediseño V2 (24 de noviembre de 2026) | Estructura por qué, cómo y qué; papel, tinta y lima; de tú; un caso por sector en pestañas; fuera maquetas como sección, automatización y obra. Sustituye a las decisiones 9, 10, 12, 13, 14, 16 y 17 de la guía anterior. |
| 19 | Vídeos (24 de noviembre de 2026) | Vuelven las escenas de la web anterior, una por sector, con un reproductor mínimo. Sustituyen a la foto de cada sector y a la línea de pasos. |
