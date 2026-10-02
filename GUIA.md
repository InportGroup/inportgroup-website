# Inport · Guía de la nueva web

Documento de trabajo para rehacer www.inportgroup.com. Aquí están la idea, el tono, el sistema visual, la arquitectura técnica, las plantillas de página y la ficha de cada solución con su escena animada. Todo lo que se construya tiene que poder justificarse con este documento. Si algo no encaja, se cambia primero aquí y después en el código.

Fecha de esta versión: 2 de octubre de 2026.

---

## 0. Cómo se usa este documento

* Es la fuente de verdad del proyecto. Las decisiones que tome el equipo se escriben aquí antes de programarlas.
* Cada sesión de trabajo ataca una fase del plan (sección 10) y termina dejando constancia en `ESTADO.md`, que se crea en la fase 0.
* Las fichas de la sección 9 llevan el texto de referencia y la especificación de la escena. El texto que se publica vive en `src/content/es/` y puede ser más breve, pero no puede contradecir la ficha.
* La sección 12 recoge las decisiones abiertas. Mientras no se respondan, se trabaja con la opción marcada como propuesta.
* Este documento sigue las mismas reglas de redacción que la web: sin guiones en el texto y sin negritas.

---

## 1. La idea

Inport hace soluciones digitales a medida para cualquier sector. Antes de proponer nada busca qué parte de la operación aporta más valor y se centra solo en eso. Su especialidad son los proyectos complejos, los que no se pueden comprar hechos: una finca de pistacheros, una nave de cebo, una obra, el horno de una planta de residuos, un dique seco, una boutique.

Tres ideas sostienen todo el mensaje (decisión 13, sección 12):

1. Cualquier sector. Lo que cambia de un sitio a otro es el oficio; el método es el mismo.
2. Primero el valor. Se mide dónde se pierde tiempo, dinero o calidad, y se ataca eso.
3. Lo difícil. Cámaras entre humo y polvo, datos que no se hablan, instalaciones que no pueden parar.

La web no presenta a Inport como una empresa de inteligencia artificial. La técnica (visión artificial, predicción, modelos de lenguaje) se nombra dentro de los ejemplos, cuando explica un caso, nunca como titular ni como etiqueta de la empresa.

La web tiene tres trabajos:

1. Que quien llegue entienda en diez segundos a qué nos dedicamos y para qué sectores.
2. Que cada solución se vea funcionando. No con capturas ni con iconos, sino con una escena en movimiento dibujada en SVG que se comporta como un vídeo corto: hay un lugar, una hora, algo que pasa y un sistema que lo detecta.
3. Que se pueda saltar desde la web a las maquetas completas que ya hemos hecho para clientes y sectores concretos.

Todo cabe en una sola página: quiénes somos, qué hacemos, en qué estamos especializados, los ejemplos y el contacto (sección 7).

Lo que nos distingue, dicho con hechos que salen de los proyectos reales:

* Trabajamos con el equipo que ya existe: las cámaras del horno, la estación meteorológica de la finca, el programador de riego, el sistema de control de la planta. No vendemos sensores por vender.
* El sistema puede funcionar entero en las instalaciones del cliente, sin nube y sin internet, cuando hace falta.
* Entregamos el código fuente y la documentación.
* Cuando un dato no es fiable, el sistema lo dice. Una cámara sucia no da un valor falso: avisa de que la imagen no vale.
* La decisión siempre es de una persona. El sistema propone, avisa y mide.

### Sectores

En el orden de la página (decisión 14):

| Sector | Ancla | Qué incluye | Ejemplos |
|---|---|---|---|
| Industria | `#industria` | Construcción, valorización energética, astilleros, licitaciones | obra, hornos, astilleros |
| Automatización de procesos | `#automatizacion` | Documentos al ERP, sistemas que no se hablan conectados, informes escritos, asistente con los manuales | procesos |
| Retail | `#retail` | Tiendas de lujo: recorridos, escaparate, interés por pieza, previsión de afluencia | boutique |
| Agricultura y ganadería | `#campo` | Cultivos leñosos, ganadería de cebo, vacuno de leche, acuicultura | cultivo, cebo |

---|---|---|
| Campo | `/campo` | Cultivos leñosos (pistacho, almendro, olivar), ganadería de cebo, vacuno de leche, acuicultura |
| Industria | `/industria` | Construcción, licitaciones, valorización energética, astilleros, puertos, líneas de producción |
| Comercio | `/comercio` | Tiendas de lujo, y más adelante gran superficie |
| Oficina y planta | `/operaciones` | Lo que sirve en cualquier sector: documentos al ERP, asistente con los manuales de la planta, pasaporte digital de producto |

---

## 2. Punto de partida

### 2.1 La web actual

* Un único `index.html` de unos 700 líneas, CSS en línea, sin compilación, en inglés.
* Estética azul marino con cian, rejilla de fondo y brillo radial: la plantilla típica de empresa tecnológica.
* Publicada en GitHub Pages desde `InportGroup/inportgroup-website`, rama `main`, con `CNAME` para `www.inportgroup.com`, `.nojekyll`, `robots.txt` y `sitemap.xml`.
* Contacto: Beatriz Abuelo, Solutions Director, beatriz.abuelo@inportgroup.com.
* Casos que aparecen: inspección de buques, contenedores en puerto, bobinado de papel, asistente de conocimiento para planta y pasaporte digital de producto.

Se conserva: el dominio, el alojamiento en GitHub Pages, el contacto y los cinco casos, reescritos.

Se descarta: el tono genérico ("competitive advantage", "ROI measurable from day 1") y las cifras sin respaldo (+95 %, menos 85 %, ×3). En la web nueva cada cifra tiene que ser de proyecto real con permiso, de demostración y marcada como tal, o pública y con fuente.

### 2.2 Las maquetas

Comprobado el 2 de octubre de 2026: las cuatro responden.

| Maqueta | Sector | Qué enseña | Tecnología | Dirección | Acceso |
|---|---|---|---|---|---|
| Pistacho | Campo, cultivos leñosos | Heladas en floración, conteo de racimos, mapa de estrés hídrico, trampas, fenología, precio, línea de cribado. 22 visualizaciones y 15 esquemas de módulo | React 19, Vite, estático | https://pistacho-mockup.onrender.com/ | Abierta |
| InLux | Comercio, tiendas de lujo | Gemelo digital, recorridos anónimos, calor, flujos, escaparate, interés por pieza, origen de la clientela, previsión, rueda olfativa, clienteling, informe del lunes | React 19, Vite, Express, OpenAI | Privada, no se publica | Bajo petición: es de un cliente |
| Inspección naval | Industria, astilleros | Inspección de casco, auditoría de carga y certificación de cubiertas con dron, visor 3D de splats gaussianos, vídeos de dron | HTML estático, visor splat | https://arnaucarol-inportgroup.github.io/naval-solutions/ | Abierta |
| Combustion Vision | Industria, valorización energética | Del vídeo de la parrilla a datos: malla de 5 × 4, frente de llama, aire, ensuciamiento de la lente, calibración, salida al DCS | HTML estático cifrado | Privada, no se publica | Bajo petición: es de un cliente |

Notas:

* Las direcciones de las maquetas privadas no se escriben en este repositorio, que es público: se comparten por correo con quien pida acceso.
* Las que están en Render usan el plan gratuito: se duermen a los 15 minutos sin visitas y la primera carga tarda cerca de un minuto. La web lo avisa junto al enlace.
* InLux trae el motor de escenas que vamos a reutilizar (`src/components/Film.jsx`, `src/lib/hooks.js`, `src/lib/format.js`, `src/lib/svg.js`, `src/lib/rng.js`, `src/lib/sanitize.js`) y las herramientas de revisión (`scripts/cdp.mjs`, `shot.mjs`, `check.mjs`, `verify.mjs`).
* Pistacho trae dibujo de árboles, noche de helada, conteo de racimos y mapa CWSI que se pueden adaptar.
* De la maqueta naval y de Combustion Vision no se reutiliza código: se redibujan en SVG con el estilo de la casa, a partir de lo que cuentan.

### 2.3 Otro material de partida

* La propuesta comercial de Combustion Vision y su maqueta. Sirven para la ficha de hornos.
* La propuesta de la plataforma de gestión de cebo. Sirve para la ficha de ganadería.
* La plataforma de análisis de pliegos y ofertas. Sirve para la ficha de licitaciones, si se decide mostrarla (sección 12).

Este material es interno y no está en el repositorio.

### 2.4 Confidencialidad

Regla por defecto: en la web pública no aparecen nombres de clientes, ubicaciones de plantas, precios, condiciones contractuales ni cifras de un proyecto real sin permiso por escrito.

* Ni los clientes, ni sus plantas, ni sus proveedores se nombran: ni en la web ni en este repositorio, que es público. Se habla de "una boutique piloto en Canarias", "una planta de valorización con cuatro hornos de parrilla", "una integradora de porcino".
* Los enlaces a maquetas que llevan el nombre del cliente en el título o en la URL se muestran como "maqueta privada, acceso bajo petición" hasta que se decida otra cosa.
* Todas las escenas usan datos de demostración y lo dicen en el cajetín del marco.

---

## 3. Público y tono

Quien visita la web es director de operaciones, jefe de planta, gerente de una cooperativa, jefe de producción de una constructora, responsable de reparaciones de un astillero o director de retail. Lee deprisa, sabe mucho de su oficio y desconfía de cualquier cosa que suene a folleto de software. Tiene que salir pensando que esto lo ha hecho gente que ha pisado una nave, una obra o un dique.

### Reglas de redacción

Obligatorias en toda la web: textos, títulos de página, metadescripciones, textos dentro de los SVG, subtítulos de escena, botones, tooltips, `aria-label`, `alt`, `title` y `placeholder`.

1. Ningún guion de ningún tipo. Ni guion (-), ni guion de palabra (‐), ni semiraya (–), ni raya (—), ni signo menos (−). Se reescribe lo que haga falta:
   * Rangos: "de 2 a 5 segundos", nunca "2-5 s".
   * Temperaturas bajo cero: "2,8 grados bajo cero", nunca "−2,8 ºC".
   * Bajadas: "baja un 12 %", nunca "−12 %".
   * Compuestos: "en tiempo real", "en sus instalaciones" (no "on-premise"), "correo" (no "e-mail"), "wifi".
   * Códigos visibles: "Cam 03", "Horno 2", "Guía 25 004312", "MSCU 447120 3".
   * Fechas: "2 de octubre de 2026", campañas "2025/26".
   * Rutas de la web: una sola palabra por tramo (`/industria/hornos`), sin guiones.
2. Nada en negrita. Ningún elemento con peso tipográfico calculado mayor que 400. Ni `<b>`, ni `<strong>`, ni títulos en negrita. Las fuentes se cargan solo en 300 y 400 y el CSS base pone `font-weight: 400` a `h1` hasta `h6`, `th`, `button`, `b` y `strong`. La jerarquía se hace con tamaño, serif, cursiva, color y aire.
3. Nada que suene a inteligencia artificial. Prohibido:
   * Palabras y giros: revolucionar, potenciar, impulsar (en sentido figurado), desbloquear, transformar (como verbo comodín), sin fisuras, de vanguardia, de última generación, innovador, disruptivo, ecosistema, sinergia, holístico, integral, robusto y escalable (como adorno), inteligente (como adjetivo vacío: "gestión inteligente"), impulsado por IA, en el mundo actual, en la era de, llevar al siguiente nivel, descubre, explora, sumérgete, clave (como muletilla).
   * Estructuras: "no es solo X, es Y", "más que un X", tríos de adjetivos, tres beneficios simétricos en fila, preguntas retóricas en titulares, frases que empiezan por "Imagina", exclamaciones.
   * Elementos: emojis, iconos de chispas, robots o cerebros con circuitos, listas con marcas de verificación, filas de cifras redondas tipo "100 % · 24/7 · ROI".
4. Concreto antes que abstracto. Horas, lugares, cantidades, nombres de máquinas y de piezas. Mejor "A las 04:10 la yema del sector 4 está a 2,8 grados bajo cero y la garita marca 0,4" que "Anticipa los riesgos climáticos de tu explotación".
5. Frases de longitud variada. Alguna muy corta. Párrafos de dos a cuatro frases.
6. Español de España. Cuando se habla al lector, de usted. La mayor parte del texto va en primera persona del plural o describe lo que pasa.
7. Mayúscula solo al principio de frase y en nombres propios. Nada de mayúsculas en cada palabra de un título.
8. Números en formato español: 2.846; 11,8 %; 1.940 €; 17:40; 4 min 12 s. El signo × para multiplicadores y mallas: ×1,8 y 5 × 4.
9. Separadores permitidos: punto medio (·), barra (/), dos puntos, comas y puntos. Las listas en la web se escriben como frases o como bloques, nunca con guiones.
10. Decir también lo que el sistema no hace. Un ingeniero se fía más de quien explica sus límites: "Si la lente está demasiado sucia, el sistema deja de corregir y avisa de que la imagen no vale."
11. No vendernos como empresa de inteligencia artificial. Ni en titulares, ni en kickers, ni en metadatos. Somos quienes hacen soluciones digitales para cualquier sector y se meten en lo difícil; la técnica aparece cuando explica un caso concreto. Tampoco "punteras", "de vanguardia" o "innovadoras": lo complejo se demuestra con el ejemplo, no con el adjetivo.

### Vocabulario por sector

Usar las palabras del oficio, no las del software:

* Cultivos: finca, parcela, sector, garita, yema, floración, cuajado, racimo, riego deficitario, programador de riego, vaguada, inversión térmica, ventilador antiheladas, campaña.
* Ganadería: nave, corral, ceba, lechón, baja, pienso, descarga, albarán, guía ganadera, integrado, veterinario, matadero, índice de conversión, castrados y enteros.
* Obra: jefe de obra, planta, forjado, encofrado, replanteo, movimiento de tierras, vaciado, certificación, partida, grúa torre, carga suspendida.
* Hornos: parrilla, tolva, empujador, aire primario y secundario, frente de llama, escoria, mirilla, DCS, sala de control.
* Astilleros: dique seco, varada, picaderos, obra viva, obra muerta, carena, chorreado, incrustaciones, tracas, cuadernas, antiincrustante.
* Puertos: terminal, puerta, pórtico, chasis, estiba, reclamación, daño previo.
* Tiendas de lujo: sala, vitrina, mesa central, escaparate, asesor, clienta, pieza, permanencia, visita.

### Antes y después

| Antes (lo que no queremos) | Después |
|---|---|
| Transformamos los datos industriales en ventaja competitiva. | La cámara de la parrilla lleva años enseñando fuego a quien tenga tiempo de mirarla. Ahora, cada dos segundos, manda veinte números al sistema de control. |
| Soluciones de IA de vanguardia para el sector agrícola. | La helada que importa es la de la yema, no la de la garita. La medimos sector por sector. |
| Optimiza tus procesos con visión artificial impulsada por IA. | Un dron recorre el casco en una mañana. A media tarde está el presupuesto de chorreado. |
| ¿Quieres llevar tu negocio al siguiente nivel? | Cuéntenos qué pasa en su planta. Si no podemos ayudar, se lo diremos en la primera llamada. |

---

## 4. Sistema visual

### Concepto

Cuaderno de ingeniería y sala de proyección. Las páginas son papel cálido con tinta, filetes finos y mucho aire, como un informe técnico bien maquetado. Las escenas son pantallas oscuras, como proyecciones dentro del papel. Dentro de cada escena todo se dibuja como un plano: el paisaje, las máquinas y los edificios van en línea fina y clara, y el color aparece solo donde hay un dato. Esa regla es la firma visual de toda la web.

Cada sector tiene un color propio que se mantiene en la navegación, en los títulos de sus páginas y en el dato principal de sus escenas.

### Color (tokens en `src/styles/tokens.css`)

Papel y tinta:

| Token | Valor | Uso |
|---|---|---|
| `--paper` | `#F2EFE8` | Fondo general |
| `--paper-2` | `#E8E4DA` | Bandas alternas, pie |
| `--ink` | `#16181A` | Texto principal |
| `--ink-2` | `#4A4D50` | Texto secundario |
| `--ink-3` | `#6B6E71` | Etiquetas, kickers (4,8:1 sobre papel, apto para texto pequeño) |
| `--rule` | `rgba(22,24,26,.14)` | Filetes |
| `--rule-strong` | `rgba(22,24,26,.32)` | Bordes activos |

Pantalla (fondo de las escenas):

| Token | Valor | Uso |
|---|---|---|
| `--screen` | `#0F1215` | Fondo de escena |
| `--screen-2` | `#171B1F` | Paneles dentro de la escena |
| `--screen-line` | `rgba(230,232,228,.16)` | Rejillas y arquitectura secundaria |
| `--screen-draw` | `rgba(230,232,228,.62)` | Línea principal del dibujo |
| `--screen-text` | `#E6E4DE` | Texto dentro de la escena |

Sectores (un tono para papel y otro para pantalla). Validados el 2 de octubre de 2026 con el validador de la skill de visualización, en este orden fijo, que es el orden en que aparecen en el panorama y en la navegación:

| Sector | Sobre papel | Sobre pantalla |
|---|---|---|
| Campo | `#1BAF7A` | `#199E70` |
| Industria | `#EB6834` | `#D95926` |
| Mar (astilleros y puertos, dentro de Industria) | `#2A78D6` | `#3987E5` |
| Comercio | `#EDA100` | `#C98500` |
| Oficina y planta | `#4A3AA7` | `#9085E9` |

Resultado sobre `--screen`: todas las comprobaciones pasan (peor par contiguo con daltonismo ΔE 9,4; visión normal 26,5). Sobre `--paper` también pasan, pero campo, industria y comercio quedan por debajo de 3:1 de contraste. Por eso, y por regla general, el color de sector nunca se usa para texto: va en una marca (un cuadrado, un filete, un trazo) junto al nombre escrito en tinta. Con cinco sectores a la vez, todos contra todos, no hay combinación que pase (verde contra naranja), así que los colores de sector nunca forman un gráfico de cinco series sin etiqueta.

Significados fijos dentro de las escenas (la paleta de estados de la skill, fija; cada uno supera 3:1 sobre `--screen` y siempre va con forma o etiqueta):

| Token | Valor | Significado |
|---|---|---|
| `--data-ok` | `#0CA30C` | Correcto, mejora, validado |
| `--data-warn` | `#FAB219` | Aviso, revisar |
| `--data-serious` | `#EC835A` | Grave, cerca del límite |
| `--data-alert` | `#D03B3B` | Alerta, fuera de rango |
| `--data-forecast` | `#3987E5` | Previsión, futuro (siempre con rayado, para no confundirse con Mar) |
| Escala de frío | `#184F95`, `#256ABF`, `#3987E5`, `#6DA7EC`, `#9EC5F4`, `#CDE2FB` | Temperatura de yema: cuanto más clara, más fría. Un solo tono, validada |
| Escala de fuego | `#B03A0C`, `#E45A12`, `#FA8C42`, `#FDBB7E`, `#FFE3C4` | Intensidad de llama de 0 a 100. Un solo tono, validada |
| Escala de calor de tienda | la de InLux: ciruela, magenta, rubí, naranja, ámbar, blanco cálido | Permanencia. Heredada de InLux, luminosidad creciente |

Para las llamas dibujadas (no los datos) se puede ir más allá de la escala, hasta un blanco cálido en el núcleo. Los valores de las celdas siempre usan la escala validada. Si se añade un color de datos, se pasa antes por `node <skill dataviz>/scripts/validate_palette.js`.

### Tipografía

* Titulares y cifras grandes: Newsreader, pesos 300 y 400, con cursiva.
* Texto: IBM Plex Sans, 300 y 400.
* Etiquetas, códigos de tiempo, valores dentro de las escenas: IBM Plex Mono, 400.
* Escala: H1 `clamp(44px, 6.4vw, 104px)`, H2 `clamp(32px, 4vw, 60px)`, H3 24 px, cuerpo 18 px con interlineado 1,65, ancho máximo de texto 64 caracteres. Kickers en Plex Mono 12 px, mayúsculas, espaciado 0,16 em.
* Cifras con `font-variant-numeric: tabular-nums`.
* Google Fonts se pide solo con 300 y 400. Nunca se declara un peso mayor en el CSS.

### Logotipo

Mientras no haya uno oficial (sección 12), un logotipo tipográfico: "inport" en Newsreader 400 con un pequeño cuadrado de línea abierto por un lado, como una dársena, y un punto entrando. Favicon con el mismo signo.

### Composición

* Retícula de 12 columnas, contenedor de 1280 px, márgenes laterales de 16 px en móvil y 48 px en escritorio.
* Cada página empieza con un kicker en mono, un titular grande en serif y una entradilla de dos o tres frases.
* Las escenas van en un marco con cajetín, como el de un plano técnico: una fila fina sobre la escena con lugar, cámara u origen, hora simulada y la nota "Escena ilustrativa · datos de demostración". Debajo, la barra de reproducción.
* Las notas dentro de las escenas imitan anotaciones de ingeniero: línea guía fina, código de tiempo en mono y una frase corta en serif cursiva.
* Filetes de 1 px, esquinas rectas. Sin sombras, sin desenfoques de cristal.

### Lo que evitamos para que no parezca hecha con IA

* Fondos con rejilla y brillos de neón, degradados morados, manchas de color difusas.
* Tres o seis tarjetas iguales con un icono en un cuadrado redondeado.
* Filas de cifras genéricas y logotipos de "confían en nosotros" sin permiso.
* Ilustraciones de cerebros, redes neuronales brillantes, robots, nubes con flechas.
* Animaciones de entrada en cada bloque. Aquí se mueve lo que tiene sentido que se mueva: las escenas.
* Simetría perfecta en todo. Se permite que un bloque sea más ancho que otro, que una nota se salga del margen, que una escena ocupe toda la anchura y la siguiente no.

---

## 5. Las escenas: películas hechas en SVG

### Qué es una escena

No son vídeos. Son dibujos SVG que se calculan en cada fotograma a partir de un reloj, de modo que se ven como una pieza filmada pero responden al ratón, se pueden pausar, arrastrar y congelar en un segundo concreto.

Cada solución tiene una escena principal:

* Dura entre 40 y 60 segundos y hace bucle.
* Tiene de cuatro a seis planos. Cada plano lleva un título corto y un subtítulo en serif cursiva con su código de tiempo, como un documental: "04:10 · La yema baja de cero".
* Hay movimientos de cámara: acercamientos, desplazamientos y un plano general al final. Se hacen interpolando el `viewBox` (`useCamera`) y, en paisajes, con capas a distinta velocidad para dar profundidad.
* En el momento clave aparece una cifra grande y sola, en Newsreader y en `--screen-text`, subrayada por un trazo del color del sector.
* Tiene al menos una interacción con sentido: pasar por una celda y ver su valor, cambiar entre "garita" y "yema", ensuciar la lente.
* Arranca sola al entrar en pantalla, se pausa al salir, y con movimiento reducido muestra un fotograma cartel bien elegido.

### Cómo se cuenta cada escena

1. Plano de situación: dónde estamos y qué hora es. Se dibuja el lugar.
2. Lo que pasa: el problema ocurre delante del espectador.
3. Lo que ve el sistema: aparece la capa de datos (color sobre el dibujo a línea).
4. El aviso o la decisión: la cifra grande, la alerta, la persona que actúa.
5. El resultado o el plano general.

Una idea por plano. Como mucho cinco o seis etiquetas visibles a la vez, en palabras llanas.

### Lenguaje visual dentro de las escenas

* Arquitectura y paisaje: trazo de 1 a 1,5 px en `--screen-draw`, rellenos casi inexistentes.
* Datos: trazos de 2 a 4 px, rellenos con degradado, puntos visibles, en el color del sector o de su significado.
* Personas: siluetas de línea muy sencillas, sin rasgos. Nunca caras.
* Textura: grano de película y viñeta muy sutiles (`FilmGrain`) y, en escenas de exterior, niebla o polvo con `feTurbulence` en capas estáticas.
* Herramientas SVG que hay que usar de verdad: degradados lineales y radiales, `mask` y `clipPath` para revelar capas (la cámara térmica que descubre el frío, el agua que baja en el dique), patrones (rayado para previsiones, textura de óxido), filtros (`feGaussianBlur` para brillos, `feTurbulence` y `feDisplacementMap` para llamas y niebla, `feComponentTransfer` para colorear mapas de calor), `stroke-dasharray` para trazados que se dibujan.

### Reglas técnicas

* Cada escena es una función pura del tiempo `t` en segundos. Nada se acumula de un fotograma a otro: al arrastrar hacia atrás se rebobina. El azar sale de un generador con semilla fija (`rng.js`).
* Las escenas no se prerenderizan. El HTML estático lleva el hueco con su tamaño exacto y la escena se dibuja en el navegador cuando su marco se acerca a la pantalla (`Escena.jsx`). Motivo: Node y el navegador no calculan exactamente igual `Math.exp` o `Math.sin`, y cualquier diferencia en el último decimal rompe la hidratación. Además el HTML pesa menos y no se trabaja en escenas que nadie mira.
* El ruido visual determinista (`noise1`) se calcula solo con operaciones enteras, por la misma razón.
* Las piezas comunes (etiquetas de ingeniero con halo, notas con cifra grande, reloj por tramos, rótulos, curvas de Bézier) están en `src/scenes/kit.jsx`. Una escena nueva las usa en lugar de reinventarlas.
* Contrato de una escena en `src/scenes/<id>/index.jsx`:

```
export default {
  id: 'hornos',
  duration: 56,
  poster: 22,                     segundo que se muestra con movimiento reducido
  frame: { lugar: 'Horno 2', origen: 'Cámara de parrilla', reloj: (t) => '11:42:08' },
  scenes: [{ at: 0, title: 'La parrilla', caption: '11:40 · Entra residuo por la tolva' }, ...],
  Scene,                          recibe { film, state, setState, narrow, size, detail }
  Controls,                       opcional, va en la barra de reproducción
  initialState,
}
```

* `detail: 'alto' | 'bajo'`. Con `bajo` la escena va sin cajetín, subtítulos ni barra; lo usa el esquema de qué hacemos y servirá para miniaturas.
* Ids SVG únicos por instancia con `useSvgId()`. En una página puede haber varias escenas.
* Tooltips en HTML superpuesto con el estilo de la casa, nunca el `title` nativo.
* Cada escena define su encuadre para pantalla estrecha (`aspectNarrow` y sus propios fotogramas de cámara cuando recibe `narrow`). Recortar el centro del encuadre de escritorio no sirve: en vertical sale casi todo cielo o casi todo suelo.
* Revisión de un fotograma concreto en el laboratorio: `/laboratorio?escena=hornos&t=24&freeze=1`. Con los scripts basta el nombre: `node scripts/shot.mjs "hornos&t=24&freeze=1"`.

### Rendimiento

* Presupuesto por escena: como mucho 1.500 nodos SVG y 300 que cambien en cada fotograma.
* Las capas fijas (paisaje, edificio, máquina) van en componentes memorizados que no reciben `t`.
* Partículas, peces, cerdos o peatones numerosos se dibujan en un único `path` cuya `d` se calcula por fotograma, no en cientos de elementos.
* Los filtros caros se aplican a capas fijas o a zonas pequeñas. No se anima un `feTurbulence` a pantalla completa.
* Objetivo: 60 fotogramas por segundo en escritorio, 30 aceptables en un móvil medio. Se mide con una traza de rendimiento de Chrome en la fase de revisión.
* Las escenas se cargan por separado (`lazy`) y solo cuando su marco se acerca a la pantalla.

### Accesibilidad

* Cada marco tiene `role="img"` y un `aria-label` que resume la escena en una frase.
* Los subtítulos son texto real con `aria-live="polite"`.
* La barra de reproducción se maneja con teclado.
* Contraste AA sobre papel y sobre pantalla.

---

## 6. Arquitectura técnica

### Stack

* Node 22, React 19, Vite 8, como las maquetas.
* React Router 8 en modo framework con `ssr: false` y prerenderizado de todas las rutas: cada página sale como HTML estático, bien indexable, y se puede seguir sirviendo desde GitHub Pages. Si el API de prerenderizado ha cambiado en la versión 8, se resuelve en la fase 0 antes de seguir.
* JavaScript con JSX, sin TypeScript, igual que InLux y pistacho, para poder traer código de ellas sin traducirlo.
* CSS Modules por componente, más `tokens.css` y `base.css`.
* Sin librerías de componentes, de gráficos ni de animación. Se permiten `d3-shape`, `d3-scale` y `d3-interpolate` para cálculos.
* Sin servidor propio en la primera versión. El contacto funciona con correo (sección 12).

### Estructura de carpetas

```
InportGroupWebsite/
  GUIA.md                  este documento
  ESTADO.md                qué está hecho y cómo seguir
  README.md                arranque, revisión y publicación
  package.json             dev, build, preview, check
  react-router.config.js   ssr false; prerender de la página y del laboratorio
  vite.config.js
  legacy/                  la web de 2025 (index2025.html, sitemap2025.xml), solo como referencia
  public/                  CNAME, .nojekyll, robots.txt, favicon.svg
  scripts/                 cdp, shot, check, verify (traídos de InLux y adaptados), postbuild (404.html y sitemap), serve
  .github/workflows/       pages.yml: compila y publica en GitHub Pages, de momento solo a mano
  src/
    root.jsx               documento, fuentes, Nav, pie, página de error
    routes.js              la página, el laboratorio y la 404
    routes/                home (compone las secciones), laboratorio, noencontrada
    sections/              Cabecera, Portada, Nosotros, Hacemos, Especialidades, Ejemplos, Maquetas
    content/es/            pagina.js, ejemplos.js, maquetas.js, sectores.js, site.js (marca, contacto, anclas, seo)
    content/en/            fase 5
    styles/                tokens.css, base.css
    lib/                   hooks.js, format.js, svg.js, rng.js, sanitize.js (de InLux; noise1 rehecho con enteros)
    components/            Nav, Footer, Logo, Contacto, Controls, NoEncontrada
    components/film/       Film.jsx (useFilm, useCamera, FilmBar, FilmSubtitle, FilmCaption, FilmGrain),
                           Stage.jsx (Stage y Cajetin), ScenePlayer.jsx, Escena.jsx (carga cuando se acerca a pantalla)
    scenes/                registry.js, kit.jsx y una carpeta por escena: recorrido, cultivo, cebo, obra,
                           hornos, astilleros, boutique; y en la fase 2, panorama
```

### Una sola página

Desde el 2 de octubre de 2026 la web es una única página con secciones (sección 12, decisión 12). No hay páginas de sector ni de solución: cada sector y cada ejemplo es una sección con su ancla.

| Ruta o ancla | Qué es |
|---|---|
| `/` | La página |
| `#nosotros` | Quiénes somos |
| `#hacemos` | Qué hacemos |
| `#industria`, `#automatizacion`, `#retail`, `#campo` | Una sección por sector con lo que hacemos en él y sus ejemplos. Cada ejemplo tiene su ancla: `#obra`, `#hornos`, `#astilleros`, `#procesos`, `#boutique`, `#cultivo`, `#cebo` |
| `#maquetas` | Las maquetas completas |
| `#contacto` | Contacto |
| `/laboratorio` | Herramienta interna para revisar escenas. No se indexa ni sale en el mapa del sitio |

Las anclas son una sola palabra, sin guiones, porque se ven en la barra de direcciones. Los textos legales (aviso legal y privacidad) van en un bloque desplegable al pie, dentro de la misma página.

### Contenido

Los textos viven en `src/content/es/`:

* `pagina.js`: portada, quiénes somos, qué hacemos, maquetas y textos legales.
* `sectores.js`: los cuatro sectores en el orden de la página, con su titular, entradilla y las cuatro líneas de lo que hacemos en cada uno.
* `ejemplos.js`: los siete ejemplos, ordenados por sector, con este modelo:

```
{
  id: 'hornos',                   también es su ancla
  sector: 'industria',
  color: 'industria',             token de color (los de astilleros usan 'mar')
  kicker: 'Valorización energética',
  titulo: 'El fuego de la parrilla, en veinte números',
  entradilla: '...',
  parrafos: ['...', '...'],
  cifras: [{ valor: '20', texto: 'valores por horno cada pocos segundos', tipo: 'diseño' }],
  noHace: '...',                  sus límites, en una o dos frases
  escena: 'hornos',
  maqueta: 'combustion',          id en maquetas.js, o null
}
```

* `maquetas.js`, `sectores.js` y `site.js` (marca, contacto, metadatos).

`tipo` de cifra: `demo` (datos de demostración), `diseño` (especificación del sistema), `proyecto` (resultado real con permiso) o `fuente` (dato público, con `fuente` y enlace). La página pinta una marca discreta según el tipo.

`sanitizeText` se aplica a todo texto dinámico para garantizar que no se cuela un guion.

### Despliegue

La web es un sitio estático: `npm run build` deja en `build/client` el HTML prerenderizado, el JavaScript y los estilos. No hace falta ningún servidor encendido; Node solo se usa para compilar.

Publicada el 2 de octubre de 2026 en GitHub Pages: Pages está en modo "GitHub Actions" y `.github/workflows/pages.yml` compila y publica en cada subida a `main`. El dominio www.inportgroup.com y el HTTPS se configuran en Settings > Pages. La web de 2025 queda en la etiqueta `web2025`.

Alternativa preparada en Render, con `render.yaml` en la raíz:

* Servicio `inport-web`, tipo sitio estático. Compila con `npm ci && npm run build` y publica `./build/client`.
* `NODE_VERSION` 22, para tener la última 22 (React Router 8 pide 22.22 o superior).
* Cabeceras: caché de un año para `/assets/*` (los nombres llevan hash), sin caché para el HTML, `nosniff`, `Referrer-Policy` y `noindex` para el laboratorio.
* Despliega `main`. Para servir el dominio desde Render habría que añadirlo allí y cambiar el DNS de IONOS, que hoy apunta a GitHub Pages.

* `public/CNAME` mantiene `www.inportgroup.com` para el caso de GitHub Pages. `public/.nojekyll` sigue.
* Antes de cambiar el dominio de sitio se etiqueta la web actual (`web2025`) para poder volver atrás en un minuto.
* Las subidas a GitHub se hacen con la cuenta ArnauCarol-InportGroup.

### Herramientas de revisión

Traídas de InLux y adaptadas, con el servidor de desarrollo arrancado:

```
node scripts/shot.mjs / 1440 1800                       captura de la página
node scripts/shot.mjs "hornos&t=24&freeze=1" 1440 900   un fotograma concreto de una escena, en el laboratorio
node scripts/shot.mjs / 390 1500                        móvil real (emulación de dispositivo)
node scripts/check.mjs all                              guiones, negritas, desbordamientos y consola
node scripts/verify.mjs hornos                          una escena: compila, consola, presupuesto de nodos
```

`check.mjs` recorre además el HTML prerenderizado de `build/`, porque ahí están el título y la metadescripción.

---

## 7. La página

Estructura y continuidad (decisión 16): las secciones van numeradas (01 Quiénes somos, 02 Qué hacemos, 03 a 06 los sectores, 07 Maquetas, 08 Contacto) y siguen un hilo. La portada presenta; quiénes somos explica el método; qué hacemos, las cuatro capacidades (medir, anticipar, integrar, automatizar), y anuncia que se verán aplicadas en cuatro sectores; cada sector abre enlazando con el anterior ("No todo el valor está en planta", "La misma forma de medir, llevada a la tienda"); las maquetas se presentan como prototipos de los casos vistos, y el contacto cierra volviendo al método (diagnóstico y piloto). Los títulos son frases claras y profesionales, sin punto final.

Una sola página, de arriba abajo. Cada sección empieza con su kicker en mono, un titular en serif y una entradilla; los textos definitivos están en `src/content/es/pagina.js` y `ejemplos.js`.

### 7.1 Navegación

Fija y mínima: logotipo, Quiénes somos, Qué hacemos, Industria, Automatización, Retail, Campo, Maquetas, y el botón fino "Hablemos" que baja a contacto. El enlace de la sección que se está leyendo queda subrayado. En móvil, un botón "Menú" abre la lista a pantalla completa.

### 7.2 Portada

* Kicker: Ingeniería de software y datos · para cualquier sector.
* Titular: "Soluciones digitales a medida para problemas complejos".
* Entradilla: "Hacemos soluciones digitales para cualquier sector. Antes de proponer nada buscamos qué parte de su operación aporta más valor, y nos centramos solo en eso. Nuestra especialidad son los proyectos complejos: los que no se pueden comprar hechos."
* Debajo, a todo el ancho de la ventana, el panorama (abajo), con "Un martes de octubre" debajo: seis horas que se pueden pulsar y la frase de la hora en curso, que baja a su ejemplo.
  * 04:10 · En una finca de pistacheros, la yema del sector 4 baja a 2,8 grados bajo cero. La garita marca 0,4.
  * 07:40 · Un ganadero apunta dos bajas en una nave sin cobertura. El veterinario las ve a las 07:52.
  * 09:15 · El vuelo semanal sobre la obra dice que la planta 4 va una semana tarde.
  * 11:42 · La zona 3 del horno 2 pide aire. El sistema de control lo sabe antes que nadie en la sala.
  * 13:40 · Sale el presupuesto de chorreado de un granelero que entró en dique a las siete y media.
  * 18:10 · En una boutique, diez personas esperan más de un minuto. Dos asesoras están en su descanso.
* Las seis frases están también en el HTML como lista oculta a la vista, para lectores de pantalla y buscadores, porque el panorama se dibuja en el navegador.

#### El panorama (escena `panorama`, fase 2)

La pieza más trabajada de la web. Un único paisaje continuo de unas 7.200 × 1.000 unidades que la cámara recorre de izquierda a derecha mientras avanza el día.

* Recorrido: amanecer en el campo, mañana en la zona industrial, mediodía y tarde en el puerto, anochecer en la ciudad. El cielo cambia con la posición de la cámara (degradado interpolado de violeta de madrugada a azul, a dorado de tarde, a azul noche con farolas).
* Tramos:
  1. Campo (de 0 a 1.800): hileras de pistacheros en perspectiva, niebla en la vaguada, ventilador antiheladas, estación meteorológica; más allá, una nave de cebo con dos silos y un camión de pienso en un camino de tierra; un dron pequeño cruzando.
  2. Industria (de 1.800 a 3.600): carretera, una obra con grúa torre girando y un edificio a medio levantar, y la planta de valorización con su nave, su chimenea y un penacho tenue.
  3. Mar (de 3.600 a 5.400): dique seco con un granelero, grúas pórtico, pilas de contenedores, la puerta de la terminal con un camión pasando bajo el pórtico de cámaras.
  4. Ciudad (de 5.400 a 7.200): una calle con escaparates iluminados, una boutique con toldo, peatones que se detienen, farolas que se encienden.
* Profundidad: cuatro capas que se desplazan a 0,3, 0,6, 1 y 1,2 veces la velocidad de la cámara.
* Todo a línea fina. En cada lugar hay un destello del color del sector cuando "pasa algo" y aparece la anotación de "Un martes de octubre" con su hora; cada anotación baja a su ejemplo.
* La cámara avanza sola, como un travelling de unos 60 segundos, y se detiene unos segundos en cada uno de los seis lugares. No se ata al desplazamiento de la página: secuestrar el scroll en la cabecera molesta más de lo que aporta. Las seis horas de debajo saltan a cada lugar. En móvil el encuadre es vertical y se centra en cada lugar. Con movimiento reducido, un fotograma fijo del dique a primera hora de la tarde con su anotación visible.

### 7.3 Quiénes somos (`#nosotros`)

* Quiénes somos, dicho con lo que se puede comprobar en los proyectos: un equipo de ingeniería y desarrollo especializado en visión artificial, aprendizaje automático y software industrial, que escribe cada sistema para su caso y no revende licencias.
* Cómo trabajamos, en cuatro pasos: diagnóstico (dónde está el valor), piloto acotado con un criterio de aceptación claro, despliegue en el resto, entrega del código y la documentación (y mantenimiento si se quiere).
* Cuatro principios, escritos como párrafos cortos con un título de dos o tres palabras: con lo que ya hay; en sus instalaciones, si hace falta; el código es suyo; si el dato no vale, se dice. Pasos y principios comparten la misma rejilla de cuatro columnas. El párrafo de presentación va en la cabecera, junto al titular.
* Sin nombres del equipo ni ciudad hasta que se confirmen (decisión 7).

### 7.4 Qué hacemos (`#hacemos`)

Cuatro capacidades, cada una con un ejemplo concreto en la misma frase, no con un icono:

1. Ver: visión artificial sobre las cámaras que ya existen (la mirilla del horno, el techo de la tienda, el dron, la cámara térmica).
2. Prever: modelos con el histórico del propio sitio (helada a 72 horas, cosecha en floración, consumo de pienso, afluencia).
3. Avisar y mandar el dato: que la medida llegue sola a donde se decide (el DCS por OPC UA, el programador de riego, el ERP, el móvil del encargado).
4. Escribir y leer: informes redactados, asistentes que contestan citando la página, lectura de pliegos.

Encima, un esquema vivo (escena `recorrido`, sin cajetín ni barra): a la izquierda lo que ya hay (cámara, sensor, papel), en el centro el equipo en sus instalaciones, a la derecha a quién llega (sistema de control, móvil, ERP, informe). Puntos de luz recorren las líneas; una frontera punteada marca lo que nunca sale de la instalación.

### 7.5 Sectores (`#industria`, `#automatizacion`, `#retail`, `#campo`)

Desde el 2 de octubre de 2026 (decisión 14) no hay una sección de especialidades y otra de ejemplos: cada sector es su propia sección, en este orden: industria, automatización de procesos, retail, y agricultura y ganadería. Las secciones alternan papel y banda gris. Cada una lleva:

1. Cabecera con la marca de color del sector, titular y entradilla.
2. Cuatro líneas de lo que hacemos en ese sector, en dos columnas con filete, como un índice. Las que tienen ejemplo llevan "Ver el ejemplo".
3. Sus ejemplos, numerados de forma correlativa en toda la página (I a VII).

### 7.6 Ejemplos

Siete capítulos dentro de sus sectores: obra, hornos y astilleros (industria); procesos (automatización); boutique (retail); cultivo y cebo (agricultura y ganadería). El panorama de la portada mantiene su recorrido del campo a la ciudad porque sigue las horas del día; el orden de las secciones no tiene por qué coincidir con él. Cada capítulo:

1. Un filete arriba, como un capítulo. Kicker con la marca de color y el número de caso (por ejemplo "Caso 2 · Valorización energética") y un titular que dice qué es el caso, sin metáforas ("La cámara del horno, conectada al sistema de control"). A la derecha, dos bloques con su etiqueta: "El reto" (solo el problema, sin adelantar la solución) y "La solución".
2. La escena a todo el ancho del contenedor, con cajetín, subtítulos y barra.
3. Debajo, "En cifras": las tres cifras en fila (también en móvil) y una única línea discreta que dice de qué tipo son ("Cifras de demostración." o, si se mezclan, el tipo de cada una, con la fuente enlazada). Al lado, "Límites": lo que no hace en cursiva y un solo enlace: la maqueta si existe, o el origen del ejemplo si no.

Principio de limpieza (revisión del 2 de octubre de 2026): cada bloque dice una cosa. Si un texto repite lo que ya cuenta la escena o la entradilla, sobra.

Las fichas de la sección 9 son la referencia de cada capítulo. La primera versión de cada escena (fase 1) tiene de tres a cuatro planos y unos 20 a 30 segundos; la versión completa de la ficha llega en la fase 3.

### 7.7 Maquetas (`#maquetas`)

* Una franja con las cuatro maquetas: nombre, sector, un párrafo, estado de acceso, el mismo botón enmarcado en todas ("Abrir la maqueta" o "Pedir acceso") y el enlace "Ver el ejemplo".
* Estados: abierta; con contraseña ("pídanos la contraseña"); privada ("acceso bajo petición", con el correo y el asunto ya escritos). Las privadas no muestran su dirección.
* Nota junto a las de Render: "La primera carga puede tardar cerca de un minuto."
* Registro en `src/content/es/maquetas.js`.

### 7.8 Contacto y pie (`#contacto`)

* Titular: "Cuéntenos qué pasa en su finca, su planta o su tienda." La persona de contacto, el correo y un botón que abre el correo con el asunto escrito.
* Pie: logotipo, anclas de la página, contacto, año y el desplegable de aviso legal y privacidad (con los huecos marcados hasta tener los datos). Sin redes sociales vacías.

---

## 8. Catálogo de soluciones

| Id | Sector | Solución | Origen | Maqueta | Tanda |
|---|---|---|---|---|---|
| `cultivo` | Campo | Heladas, flor y agua en cultivos leñosos | Maqueta pistacho | Pistacho | 1 |
| `cebo` | Campo | La ceba al día | Propuesta de cebo | No | 1 |
| `leche` | Campo | Cojeras y celo en vacuno de leche | Idea nueva | No | 2 |
| `jaulas` | Campo | Biomasa y alimentación en acuicultura | Idea nueva | No | 2 |
| `obra` | Industria | Avance de obra y seguridad bajo la grúa | Idea nueva | No | 1 |
| `pliegos` | Industria | El pliego leído entero antes de ofertar | Plataforma de pliegos | No | 2 |
| `hornos` | Industria | El fuego de la parrilla en veinte números | Combustion Vision | Combustion Vision | 1 |
| `astilleros` | Industria | Del casco escaneado al presupuesto de dique | Maqueta naval | Naval | 1 |
| `puertos` | Industria | El contenedor revisado en la puerta | Web actual | No | 2 |
| `linea` | Industria | La bobina que iba a salir mal | Web actual | No | 3 |
| `boutique` | Comercio | La tienda leída desde el techo | InLux | InLux | 1 |
| `documentos` | Oficina y planta | Del albarán al ERP sin teclear | Idea nueva | No | 2 |
| `asistente` | Oficina y planta | El manual que contesta | Web actual | No | 2 |
| `pasaporte` | Oficina y planta | Pasaporte digital de producto | Web actual | No | 3 |

Primera tanda: las seis soluciones que se pidieron expresamente (agricultura, ganadería, constructoras, hornos de residuos, astilleros y tiendas de lujo). Son los seis ejemplos de la página, cada uno con su escena. Las de la segunda y tercera tanda aparecen como texto en especialidades.

---

## 9. Fichas de solución

Cada ficha tiene el texto de referencia, las cifras con su tipo, cómo funciona de verdad, lo que pedimos al cliente, los límites y la escena plano a plano. Las horas y cantidades de las escenas son de demostración.

### 9.1 Cultivos leñosos (`cultivo`)

Kicker: Campo · Cultivos leñosos
Titular: La helada que la garita no ve

Entradilla: En una noche despejada de marzo la estación marca 0,4 grados y la yema del pistachero ya está a 2,8 bajo cero. Medimos el frío donde hace daño, no donde está el sensor.

Texto 1: El aire frío pesa y se acumula en las partes bajas de la finca. Una cámara térmica fija en el sector más expuesto mide la temperatura real de la yema y un modelo, alimentado con la estación que ya tiene, avisa con hasta 72 horas de margen y después en directo, cuando toca arrancar los ventiladores o el riego antihelada.

Texto 2: En floración, un vuelo de dron cuenta los racimos árbol a árbol y da la primera previsión de cosecha cinco meses antes de recoger. En verano, el mapa de estrés hídrico enseña la esquina que se seca aunque la media de la parcela diga que todo va bien. Nos conectamos a su estación, sus sondas y su programador de riego; no le vendemos otros.

Cifras: 2,8 grados bajo cero en la yema con la garita a 0,4 (demo) · 72 horas de margen en el aviso (diseño) · 89.794 hectáreas de pistacho en España en 2025 (fuente: ESYRCE 2025, MAPA).

Por dentro: cámara térmica fija, conectores con la estación y las sondas (API del fabricante, FTP, MQTT o el CSV que exporta su plataforma), predicción de helada con conjunto meteorológico y microclima de la finca, horas frío y grados día por parcela, detección de racimos en imagen de dron, índice CWSI con térmica y multiespectral, la app funciona sin cobertura.

Necesitamos: acceso a los datos de la estación y del programador de riego, el plano de la finca por sectores y, si hay, el histórico de cosechas.

No hace: no sustituye al técnico de campo ni decide por él cuándo regar. Si un sensor de la finca deriva, se marca y no se usa hasta revisarlo.

Escena (52 s). Cajetín: "Finca de pistacheros · Sector 4 · Cámara térmica 2".

| Segundo | Plano | Qué se ve |
|---|---|---|
| 0 | 02:40 · Cielo despejado, sin viento | La finca de noche en perspectiva suave: hileras de pistacheros en vaso dibujados a línea, estrellas, luna con halo radial. Niebla baja con `feTurbulence` en la vaguada. La garita a la izquierda con su lectura en mono: 0,9 grados. |
| 10 | 03:55 · El frío baja a la vaguada | Líneas de flujo azul violeta resbalan ladera abajo y se remansan en el sector 4. La cámara térmica barre con su cono; donde pasa, una máscara revela la capa térmica coloreada en la escala de frío. Tres etiquetas en yemas: 1,1 bajo cero, 1,9 bajo cero, 2,8 bajo cero. La garita sigue en 0,4. |
| 22 | 04:10 · Aviso al encargado | Cifra grande: "2,8 bajo cero". Un móvil dibujado a línea recibe el aviso: "Sector 4 por debajo de 2 grados en yema". El ventilador antiheladas empieza a girar; el aire templado de arriba baja en espiral y la capa térmica pasa de violeta a cian. Abajo, la gráfica de la noche se dibuja en directo: yema, garita y la banda rayada de la previsión. |
| 34 | Abril · Plena floración | Fundido a día. Los árboles se cubren de racimos rojizos. Un dron recorre la parcela en serpentina; anillos finos se encienden sobre cada racimo detectado y un contador sube: 412 racimos en el árbol 118. |
| 44 | Septiembre · La cosecha que se anunció en abril | La cámara sube a vista cenital: la parcela es una rejilla de puntos coloreados por kilos previstos. Cifra final: 2.140 kg por hectárea previstos, 2.060 recogidos. |

Interacción: pasar por un árbol da su temperatura de yema o sus kilos según el plano; conmutador "Garita / Yema" en la barra.
Cartel: segundo 26.
Se trae de la maqueta de pistacho: dibujo del árbol de `OrchardHero.jsx`, curva de `FrostNightChart.jsx`, lógica de `ClusterCountDemo.jsx` y `CwsiMap.jsx`.

### 9.2 Ganadería de cebo (`cebo`)

Kicker: Campo · Ganadería de cebo
Titular: La ceba, al día y no al cierre

Entradilla: Un repunte de bajas o un consumo de pienso que se dispara se suelen descubrir al cerrar la ceba, cuando ya no hay margen. Queremos que se vean el mismo martes que empiezan.

Texto 1: El ganadero apunta en el móvil las bajas, las descargas de pienso y las entradas y salidas, con una foto del albarán o de la guía, aunque en la nave no haya cobertura. La aplicación guarda y envía en cuanto vuelve la señal. Nada entra en el sistema sin que lo revise el veterinario.

Texto 2: Con las mejores cebas del histórico construimos curvas de referencia de consumo, mortalidad y crecimiento, separando castrados y enteros, y ponemos encima la ceba en curso. Si la mortalidad de los últimos siete días pasa del 0,5 %, avisa. Y se le puede preguntar en lenguaje normal cómo van los lechones de un origen frente a los de otro.

Cifras: 0,5 % de mortalidad en siete días dispara el aviso (diseño) · funciona sin cobertura y sincroniza al volver la señal (diseño) · tres perfiles: ganadero, veterinario y administración (diseño).

Por dentro: base de datos única para cebas de ciclo cerrado y granjas de ciclo continuo, volcado y limpieza de las fichas en hoja de cálculo, app con registro sin conexión, validación y cierre en dos pasos, curvas de referencia, avisos configurables, trazabilidad por guía ganadera, asistente conversacional sobre el histórico. Opcional: cámara de profundidad cenital en el pasillo para estimar el peso medio por corral y conteo automático en la rampa de carga.

Necesitamos: las fichas de cebo actuales, la codificación de almacenes y proyectos, y una granja y un veterinario para el piloto.

No hace: no sustituye la visita del veterinario ni toma decisiones sanitarias. El dato original del ganadero se conserva siempre, aunque se corrija.

Escena (54 s). Cajetín: "Nave de cebo · 1.200 plazas · Ceba 2026 03".

| Segundo | Plano | Qué se ve |
|---|---|---|
| 0 | Día 1 · Entran 1.180 lechones | Corte cenital de la nave: 24 corrales en dos filas, pasillo central, dos silos fuera. Un camión en la puerta; los lechones (óvalos pálidos con un trazo de oreja) entran en fila y se reparten. En la puerta, la foto de la guía y su número: Guía 26 004312. Peso medio 20,4 kg. |
| 10 | Día 23 · 07:40 · Dos bajas | Un ganadero de línea recorre el pasillo con el móvil. Icono de cobertura tachado; en la pantalla, "2 pendientes de enviar". Sale al patio, vuelve la señal y dos puntos viajan por un hilo fino hasta la oficina del veterinario, donde aparece una marca de validado trazada a mano. |
| 22 | Días 24 a 41 · La curva | La nave se desplaza a la izquierda. A la derecha, la gráfica de consumo de pienso por animal y día: la banda de referencia de las mejores cebas y la línea de la ceba actual que se dibuja día a día. Los cerdos crecen de tamaño con los días. El nivel de los silos baja con un `clipPath` y el día 30 llega el camión de pienso a rellenarlos. |
| 34 | Día 42 · Siete días por encima | La mortalidad acumulada en siete días cruza el 0,5 %: la línea cambia a rojo y el corral 14 late. Cifra grande: 0,62 %. Aviso al veterinario con el nombre de la ceba y la nave. |
| 44 | Día 118 · Salida a matadero | Camión en la rampa; un contador automático suma animales al cruzar una línea. La ficha de cierre se rellena: índice de conversión 2,61, bajas 3,4 %, peso de salida 108 kg. Sello "Visto bueno". |

Interacción: pasar por un corral da animales, peso estimado y bajas; conmutador "Castrados / Enteros" para las curvas.
Cartel: segundo 36.

### 9.3 Construcción (`obra`)

Kicker: Industria · Construcción
Titular: La obra, medida cada semana

Entradilla: El jefe de obra sabe cómo va la estructura. Lo difícil es demostrarlo en la certificación de fin de mes y ver a tiempo qué planta se está quedando atrás.

Texto 1: Un vuelo de dron a la semana, o una cámara fija en la grúa, y la fotogrametría convierte las fotos en una nube de puntos que se compara con el modelo BIM y con la planificación. Sale lo ejecutado por partida, los metros cúbicos de tierra movidos y qué parte va por delante o por detrás.

Texto 2: Las cámaras de obra vigilan las zonas de carga suspendida. Si alguien entra bajo la carga de la grúa, avisa al gruista y al encargado en ese momento. No se guardan caras ni se identifica a nadie: solo hay una silueta en una zona.

Cifras: un vuelo por semana (diseño) · unos 2 cm de precisión con dron y apoyo RTK (diseño) · ninguna cara guardada (diseño).

Por dentro: plan de vuelo automático, fotogrametría, alineado con el modelo BIM y los ejes de replanteo, cálculo de volúmenes de desmonte y terraplén, porcentaje ejecutado por elemento y por partida, exportación a la herramienta de certificación, detección de personas y zonas de exclusión en el equipo de obra.

Necesitamos: el modelo BIM o los planos, la planificación, permiso para volar y acceso a las cámaras de obra si las hay.

No hace: no certifica por su cuenta. Prepara la medición y el jefe de obra la firma. No vigila a las personas: solo zonas.

Escena (56 s). Cajetín: "Obra residencial · 64 viviendas · Vuelo de la semana 18".

| Segundo | Plano | Qué se ve |
|---|---|---|
| 0 | Semana 12 · Vaciado | Solar en isométrico, a línea. El dron traza su recorrido en peine y deja una malla del terreno. Lo excavado se tiñe de azul, el relleno de naranja. Cifra: 4.820 m³ excavados de 5.100 previstos. |
| 12 | Semana 18 · La estructura | El edificio crece planta a planta como losas isométricas. Encima, en trazo discontinuo, el modelo de lo que debería haber hoy según la planificación. Los pilares se colorean: hecho en verde, en curso en ámbar, retrasado en rojo (la esquina norte de la planta 4). Abajo, una barra de planificación con la línea de hoy. |
| 26 | Martes · 11:20 · Bajo la carga | La grúa torre gira con un palé de ladrillo colgado; su zona de barrido se sombrea en el suelo. Una silueta entra en la sombra: anillo rojo, aviso al gruista. La silueta sale y el anillo se apaga. |
| 38 | Fin de mes · La certificación | Los porcentajes medidos bajan a una tabla de partidas que se rellena línea a línea: estructura planta 3 al 100 %, forjado planta 4 al 60 %, cerramiento al 15 %. Cifra final: certificación de octubre, 412.300 €. |
| 48 | Plano general | La obra al atardecer; un rebobinado rápido de las 18 semanas de vuelos, como una cámara a intervalos. |

Interacción: pasar por un pilar o una losa da su estado y su fecha prevista; conmutador "Real / Planificado".
Cartel: segundo 20.

### 9.4 Licitaciones (`pliegos`), pendiente de confirmar

Kicker: Industria · Licitaciones
Titular: El pliego, leído entero antes de ofertar

Entradilla: Un concurso de obra llega con memoria, pliego de prescripciones, cuadro de precios, planos y tres adendas. La oferta se cierra con prisa, y lo que se escapa suele estar en la adenda del día 14.

Texto 1: El sistema lee el paquete completo por partes, extrae los requisitos y los compara con la oferta. Cada hallazgo cita las dos páginas: la del pliego y la de la oferta. Las adendas mandan por fecha, con una regla fija, no por lo que opine un modelo.

Texto 2: Si una página escaneada no se lee bien, se marca "a verificar" en lugar de dar nada por bueno. Todo lo que sale es asesoramiento: la decisión es del equipo de estudios.

Escena (48 s): las pilas de documentos se abren en abanico; una línea de requisito subrayada vuela a una mesa central; a la derecha, la oferta; hilos verdes unen requisito y cláusula que cumplen, hilos rojos los que no, con sus citas ("Pliego p. 112 · Oferta p. 38"); entra la Adenda 2 fechada el 14 de marzo, tacha un requisito y pone otro, y un hilo verde se vuelve rojo; una página borrosa recibe la etiqueta ámbar "a verificar"; al final, siete hallazgos ordenados por importancia bajo el rótulo "Asesoramiento. La decisión es del equipo de estudios."

### 9.5 Valorización energética (`hornos`)

Kicker: Industria · Valorización energética
Titular: El fuego de la parrilla, en veinte números

Entradilla: Las cámaras de los hornos enseñan fuego a quien tenga tiempo de mirarlas. Hacemos que esa imagen llegue al sistema de control como datos, cada pocos segundos y con el mismo criterio en todos los turnos.

Texto 1: Tomamos el vídeo por red de las cámaras que ya existen y lo analizamos fotograma a fotograma en memoria, sin grabarlo. La imagen se endereza sobre la parrilla y se divide en una malla de 5 × 4: veinte celdas, cada una con su intensidad de fuego de 0 a 100.

Texto 2: De la misma imagen sale la posición del frente de llama en cada zona y una lectura del aire: si falta, si sobra o si una zona va descompensada respecto a las demás. Todo llega al DCS por OPC UA cada dos a cinco segundos. Si la lente se ensucia, el sistema lo detecta y corrige; si tras un mantenimiento la cámara vuelve girada, la malla se realinea sola.

Cifras: 20 valores de intensidad por horno, cada dos a cinco segundos (diseño) · cinco segundos como máximo para avisar de que el dato no vale (diseño) · ninguna imagen grabada (diseño).

Por dentro: lectura RTSP con decodificación por software, rectificación con referencias fijas del horno (bordes de la parrilla, paredes, boca del quemador), intensidad por color y brillo, modelos entrenados con imágenes de la propia planta para ensuciamiento y posición de la cámara, servidor OPC UA con su mapa de etiquetas, bits de pulso y de dato válido, visor web para sala de control, todo en contenedores en servidores dentro de la planta, sin internet.

Necesitamos: acceso por red a las cámaras, la interfaz OPC del DCS, la geometría de la parrilla y, para los modelos, imágenes con la lente limpia y sucia y con la cámara bien y mal colocada.

No hace: no regula el horno. Entrega medidas; la lógica de control y las alarmas son del DCS. Si la imagen cae por debajo de la calidad mínima, deja de corregir y envía "Imagen no válida".

Escena (56 s). Cajetín: "Horno 2 · Cámara de parrilla · 11:42:08".

| Segundo | Plano | Qué se ve |
|---|---|---|
| 0 | 11:40 · La parrilla, de lado | Sección del horno a línea: tolva con residuo de formas irregulares, empujador que avanza y retrocede, parrilla inclinada con barrotes que se mueven en vaivén, cuatro zonas con el aire primario entrando desde abajo en flechas azules finas. Llamas en capas con `feTurbulence` y `feDisplacementMap` sobre una forma fija, coloreadas con la escala de fuego. La escoria cae al final. En la pared del fondo, la mirilla de la cámara con su cono de visión. |
| 10 | Lo que ve la cámara | La cámara entra por el cono y pasa a la vista de la cámara: la parrilla en perspectiva, un trapecio de fuego con grano. |
| 18 | La malla de 5 × 4 | Sobre el trapecio aparecen las líneas de la malla. La imagen se endereza: las cuatro esquinas se interpolan hasta formar un rectángulo. Las veinte celdas se rellenan con su color y su número, que cambian con suavidad. Una línea quebrada marca el frente de llama en cada zona. A un lado, la lectura de aire: "Zona 3 · falta aire". Cifra grande: 71. |
| 30 | La lente se ensucia | Una veladura parda con manchas crece sobre la imagen. Los valores sin corregir caen (números fantasma en discontinuo); los corregidos se mantienen. Se enciende el bit "Ensuciamiento". Rótulo: "Limpieza recomendada". |
| 40 | Después del mantenimiento | La imagen gira seis grados y se desplaza. La malla queda torcida y mide donde no debe (contorno rojo). Aparecen cruces finas sobre las referencias fijas, se calcula el desvío y la malla vuelve a su sitio con una curva suave. El bit "Calibración" se enciende y se apaga. |
| 48 | Al sistema de control | Se desliza la tabla de etiquetas OPC: H2 Z3 E4 Intensidad 71, H2 Frente Z2 0,63, H2 DatoVálido 1, el pulso parpadeando cada dos segundos. Plano general: cuatro hornos pequeños, cada uno mandando sus números a la consola del DCS. |

Interacción: pasar por una celda da zona, elemento y valor; conmutador "Imagen / Malla"; botón "Ensuciar la lente" que adelanta el plano 4.
Cartel: segundo 24.
Maqueta: Combustion Vision, privada.

### 9.6 Astilleros (`astilleros`)

Kicker: Industria · Astilleros
Titular: Del casco escaneado al presupuesto de dique

Entradilla: Cada día de un buque en dique cuesta. Medir a mano la corrosión de la obra viva lleva jornadas y depende de quién mire. Un dron recorre el casco en una mañana y por la tarde están los metros de chorreado.

Texto 1: El dron sigue un plan de vuelo automático a lo largo del casco, la cubierta y las bodegas. Con las fotos se construye un modelo 3D y sobre él se segmentan óxido, incrustaciones, pintura degradada y abolladuras, con su superficie.

Texto 2: Esas superficies se convierten en lo que necesita el departamento de presupuestos: metros cuadrados de chorreado por grado, litros de pintura por capa, horas de mano de obra y días de dique. El mismo registro sirve para certificar la limpieza de bodegas antes y después, y para dejar constancia del estado de la carga antes de descargar.

Cifras: casco completo en una mañana (demo) · presupuesto el mismo día (demo) · las cifras de precisión de la maqueta naval se publican solo cuando se confirmen con el proyecto.

Por dentro: plan de vuelo automático, fotogrametría y reconstrucción por splats gaussianos para la visualización, segmentación por clases, desarrollo del casco en plano por cuadernas y tracas, motor de cálculo con los precios del astillero, informe exportable.

Necesitamos: el plano de formas o las dimensiones del buque, la tabla de precios del astillero y permiso de vuelo en el dique.

No hace: no sustituye la inspección de la sociedad de clasificación. Prepara la medición y la evidencia.

Escena (58 s). Cajetín: "Dique 2 · Granelero de 190 m · Primer día de varada".

| Segundo | Plano | Qué se ve |
|---|---|---|
| 0 | 07:30 · Entra en dique | Alzado del dique: el agua baja (máscara que desciende) y el buque se asienta sobre los picaderos. Al quedar en seco aparece la obra viva con incrustaciones verdes y regueros de óxido hechos con patrones y `feTurbulence`. |
| 10 | 08:10 · El vuelo | Un dron pequeño, con los rotores como elipses borrosas, recorre el casco en serpentina. Detrás de él cada foto se enciende como un rectángulo que destella y se solapa con la anterior; poco a poco se forma una nube de puntos sobre el casco. |
| 22 | Lo que encuentra | Capa de segmentación: óxido en naranja rojizo, incrustaciones en verde, pintura degradada en ámbar, una abolladura con curvas de nivel. Leyenda pegada al dato. |
| 32 | El casco, desplegado | El costado se despliega en plano, con cuadernas y tracas numeradas; las manchas conservan su color. Sumas: chorreado 1.240 m², retoque 380 m². Cifra grande: 1.240 m². |
| 44 | El presupuesto | Las líneas del presupuesto se escriben una a una: chorreado, imprimación, antiincrustante en dos capas, horas, días de dique. Total en mono. Rótulo: "Listo a las 13:40". |
| 52 | Plano general | El buque en el dique con la grúa al fondo y el dron volviendo a su base. |

Interacción: pasar por una mancha da su clase y su superficie; conmutador "Foto / Segmentación".
Cartel: segundo 28.
Maqueta: Inspección naval, abierta.

### 9.7 Tiendas de lujo (`boutique`)

Kicker: Comercio · Tiendas de lujo
Titular: La tienda, leída desde el techo

Entradilla: Las cámaras que ya tiene la tienda pueden contar cuánta gente se detiene ante el escaparate, dónde se queda y cuánto espera hasta que alguien la atiende. Sin caras y sin guardar una sola imagen.

Texto 1: Escaneamos la tienda con un iPad en unos minutos y colocamos sobre el plano las cámaras que ya existen. A partir de ahí, cada visita es un punto que se mueve por el plano y desaparece al salir: recorridos, calor, tiempos por zona, primer saludo.

Texto 2: Fuera, una cámara mira la acera: cuántos pasan, cuántos aminoran, cuántos se paran y cuántos entran. Y cada lunes todo eso llega como una carta escrita, con lo que ha cambiado y lo que merece atención. Lo hacemos bajo la marca InLux.

Cifras (demo, de la maqueta): 38 s hasta el primer saludo · se detiene el 14,2 % de quien pasa por el escaparate · 21 personas en sala el sábado a las 17:50.

Por dentro: lo que se describe en la guía de InLux. Detección y anonimización en el equipo de tienda, proyección al plano, agregación de calor por rejilla de 20 cm, embudo de escaparate, modelo de lenguaje para el informe.

Necesitamos: acceso a las cámaras, el plano o un escaneo de la tienda, y las ventas por hora.

No hace: no reconoce caras ni deduce nada de nadie por su aspecto.

Escena (56 s). Cajetín: "Boutique piloto · Cam 06 · sábado · 17:42:10".

| Segundo | Plano | Qué se ve |
|---|---|---|
| 0 | 10:00 · Abre la tienda | Plano cenital a línea fina con zonas teñidas. Las primeras visitas entran como puntos ámbar con estela que se desvanece; el equipo, en turquesa. |
| 10 | 17:50 · Llega el grupo del crucero | La sala se llena. Contador: 21 personas. Anillos rojos laten alrededor de quien espera: "1 min 12 s sin atender". |
| 22 | El calor de la semana | Se funde el movimiento y emerge el mapa de calor (manchas con desenfoque coloreadas con `feComponentTransfer`): la mesa central arde, la zona de viaje está fría. |
| 34 | La calle | La cámara pasa a la fachada: peatones de línea que cruzan, aminoran, se paran con un halo, entran. Embudo con 28,4 %, 14,2 % y 5,9 %. |
| 46 | Lunes · 08:00 · El informe | Una carta en papel marfil se escribe sola, con un sello de lacre al terminar. |

Se trae de InLux: `FloorPlan`, la simulación de visitas, el calor y la fachada, adaptados a los tokens de esta web.
Cartel: segundo 14.
Maqueta: InLux, privada.

### 9.8 Automatización de procesos (`procesos`)

Kicker: Automatización de procesos · Administración y compras
Titular: Del albarán al ERP sin teclear

Entradilla: Cada semana entran cientos de albaranes y facturas por correo, en foto o en papel, y alguien los teclea uno a uno. Es lento, se cuelan errores y nadie los ve hasta que el mes no cuadra.

Texto: Los documentos se leen solos, se cruzan con el pedido y la recepción, y lo que cuadra pasa al ERP sin que nadie lo toque. Lo que no cuadra llega a una persona con la diferencia ya señalada. El mismo método sirve para partes de trabajo, certificados o pedidos de cliente.

Cifras (demo): 146 documentos en la semana · 38 horas al mes que ya no se teclean · 1 de cada 9 documentos va a revisión.

No hace: no paga ni aprueba nada por su cuenta. Lo que no cuadra, o lo que supera el importe que fije el cliente, lo decide una persona.

Escena (30 s), primera versión. Cajetín: "Administración · Compras · Correo, móvil y escáner".

| Segundo | Plano | Qué se ve |
|---|---|---|
| 0 | Llegan los papeles | Tres fuentes a la izquierda (correo, foto desde el móvil, escáner) de las que salen hojas que vuelan en curva hasta una bandeja. Cifra: documentos de la semana. |
| 7 | Se leen solos | El albarán ampliado, a línea. Una banda de lectura lo recorre de arriba abajo y cada campo (proveedor, fecha, pedido, producto, cantidad, importe) se enmarca y pasa a una ficha a la derecha. |
| 15 | Se cruzan con el pedido | Cuatro filas albarán frente a pedido. Tres cuadran; la cantidad no (25.200 kg frente a 24.000) y va a compras con la diferencia escrita. |
| 22 | Al ERP, sin teclear | Las filas entran en la tabla del ERP: una en revisión, el resto contabilizadas. Cifra: horas al mes que ya no se teclean. |

En pantalla estrecha cada plano tiene su propio encuadre.

### 9.9 Segunda y tercera tanda (resumen)

Fichas completas antes de empezar cada una. Idea de escena:

* Vacuno de leche (`leche`): titular "La vaca que empieza a cojear, dos semanas antes". Una cámara a la salida de la sala de ordeño mide la curvatura del lomo y el ritmo del paso de cada vaca, identificada por su collar. Escena: vacas de perfil cruzando el pasillo de retorno, la línea del lomo trazada encima y una puntuación de 1 a 5; después el rebaño como rejilla de puntos por puntuación; aviso "Vaca 1184 · revisar pezuña".
* Acuicultura (`jaulas`): titular "Cuántos kilos hay en la jaula, sin sacar un pez". Cámara estereoscópica dentro de la jaula que mide la talla de cada pez y estima la biomasa; cámara en el fondo que ve el pienso que nadie se come y para el alimentador. Escena: agua verde azulada con rayos de luz, un banco de doradas girando, una regla que mide de la boca a la horquilla de la cola (31,2 cm · 412 g), histograma de tallas que crece; después los gránulos caen, empiezan a llegar al fondo y el alimentador se detiene.
* Puertos (`puertos`): titular "El contenedor, revisado en la puerta". Pórtico de cámaras en la puerta de la terminal; el contenedor se despliega en sus seis caras, se lee su código y se marcan abolladuras, agujeros y precintos, con hora y lugar como prueba ante una reclamación. Escena nocturna con luz de sodio.
* Documentos: hecho como ejemplo `procesos` (9.8).
* Asistente de planta (`asistente`): titular "El manual que contesta". Preguntas por voz o por escrito sobre manuales y procedimientos, con la página citada. Si no está en la documentación, lo dice. Escena: un operario ante un intercambiador pregunta el par de apriete de una brida; las páginas pasan y la respuesta llega con su cita.
* Líneas de producción (`linea`): titular "La bobina que iba a salir mal". Gemelo del proceso de bobinado con tensión, velocidad y diámetro, previsión de defecto e integración con SCADA y autómatas.
* Pasaporte digital de producto (`pasaporte`): el producto lleva un código; al leerlo aparece su pasaporte con origen, materiales y reparación, según el reglamento europeo de diseño ecológico. Antes de publicarlo hay que decidir si se mantiene la mención a cadena de bloques de la web actual.

---

## 10. Plan por fases

Una fase por sesión. Al empezar, se repasa el plan; al terminar, se actualiza `ESTADO.md`. Rehecho el 2 de octubre de 2026 al pasar a una sola página.

| Fase | Contenido | Se da por terminada cuando |
|---|---|---|
| 0 · Cimientos | Proyecto, prerenderizado, tokens, paleta validada, motor de escenas, scripts, flujo de publicación. | Hecha el 2 de octubre de 2026. |
| 1 · Una sola página | Todas las secciones con sus textos, navegación por anclas, los seis ejemplos con la primera versión de sus escenas, el esquema de qué hacemos, maquetas, contacto y pie con los textos legales en borrador. | Hecha el 2 de octubre de 2026. |
| 2 · Panorama | La escena de la portada. | Hecha el 2 de octubre de 2026, junto con el cambio de mensaje de la portada (decisión 13). |
| 3 · Escenas completas | Cada escena llega a su ficha de la sección 9 (de 40 a 60 segundos, de cuatro a seis planos, interacción con sentido). Una por sesión. | Cada escena cumple la lista de la sección 11. |
| 4 · Revisión | Lectura en voz alta de todos los textos, rendimiento, accesibilidad, metadatos, imagen para compartir. | Lista de la sección 11 en verde. |
| 5 · Inglés | La misma página en inglés en `/en/` con `hreflang`. | Las mismas comprobaciones en inglés. |
| 6 · Publicación | Etiqueta `web2025`, Pages pasa a GitHub Actions, comprobación del dominio y del certificado. | www.inportgroup.com sirve la web nueva y se puede volver atrás. |

---

## 11. Lista de comprobación

Antes de dar por terminada una página o una escena:

1. Ningún guion visible, tampoco en SVG, atributos, títulos de página, metadescripciones ni rutas (`check.mjs`).
2. Ningún peso tipográfico calculado mayor que 400 y ninguna etiqueta `b` o `strong`.
3. Sin errores en la consola.
4. Se ve bien a 1440 y a 390 px, sin desplazamiento horizontal.
5. La escena tiene planos con subtítulos, cámara, barra de reproducción, cajetín con la nota de datos de demostración, se pausa fuera de pantalla y tiene cartel con movimiento reducido.
6. Ids SVG únicos.
7. Cada cifra tiene su tipo y, si es pública, su fuente.
8. No aparece ningún nombre de cliente sin permiso.
9. Los enlaces a maquetas funcionan y dicen su estado de acceso.
10. El texto se lee como escrito por alguien del oficio. Si una frase podría estar en la web de cualquier empresa de software, se reescribe.

---

## 12. Decisiones

El 2 de octubre de 2026 se aprobaron todas las propuestas de esta tabla tal y como están. Las que dependen de un dato que aún no tenemos (logotipo oficial, datos del aviso legal) siguen con la solución provisional hasta que llegue.

| # | Pregunta | Decisión |
|---|---|---|
| 1 | Idioma. La web actual está en inglés. | Español primero, inglés en la fase 6 con la misma estructura. |
| 2 | Nombres de clientes y maquetas que llevan el nombre del cliente en el título o en la URL. | Anonimizar y mostrarlas como privadas, acceso bajo petición. A medio plazo, publicar copias neutras de esas maquetas o cambiar la URL de la de hornos. |
| 3 | Licitaciones: ¿se puede enseñar ya la plataforma de pliegos? | Incluirla en la segunda tanda como solución en desarrollo, sin cifras. |
| 4 | Ideas nuevas (vacuno de leche, acuicultura, documentos al ERP). | Incluirlas en la segunda tanda marcadas como propuesta. |
| 5 | Logotipo oficial. | Logotipo tipográfico provisional. |
| 6 | Contacto: ¿solo correo o formulario con servidor? ¿Beatriz Abuelo sola o también otra persona? | Correo con asunto rellenado y Beatriz Abuelo como contacto, como ahora. |
| 7 | Equipo y sede: ¿se muestran nombres, cargos y ciudad? | Un párrafo sin nombres hasta confirmar. |
| 8 | Datos para aviso legal y privacidad (razón social, NIF, domicilio). | Borrador con huecos marcados; no se publica sin ellos. |
| 9 | Trato al lector: usted o tú. | Usted. |
| 10 | Titular de la portada. | "Primero, dónde está el valor. Después, la técnica que haga falta." Sustituye al primero ("Inteligencia artificial para sitios donde se trabaja con las manos"), retirado el 2 de octubre de 2026 por la decisión 13. |
| 11 | Analítica. | Ninguna en la primera versión, así no hace falta aviso de cookies. |
| 12 | ¿Una web de varias páginas o una sola? | Una sola página con secciones: quiénes somos, qué hacemos, especialidades, ejemplos (los de las maquetas y propuestas que tenemos), maquetas y contacto. Decidido el 2 de octubre de 2026. |
| 13 | ¿Cómo nos presentamos? | Soluciones digitales para cualquier sector; primero buscamos lo que aporta valor y nos centramos en eso; nuestra especialidad son los proyectos complejos. Sin hablar directamente de inteligencia artificial ni de "trabajar con las manos". Decidido el 2 de octubre de 2026. |
| 14 | Orden de la página y automatización. | Una sección por sector en este orden: industria, automatización de procesos, retail, y agricultura y ganadería. La automatización de procesos es un sector propio con su ejemplo (`procesos`). Desaparecen las secciones de especialidades y de ejemplos. Decidido el 2 de octubre de 2026. |
| 15 | ¿Dónde se publica? | GitHub Pages con GitHub Actions, desde `main` (publicada el 2 de octubre de 2026). `render.yaml` queda preparado como alternativa. |
| 16 | Títulos y continuidad. | Secciones numeradas, títulos profesionales sin metáforas ni punto final, entradillas que enlazan cada sección con la anterior y casos con la estructura reto, solución, cifras y límites. El titular de la portada pasa a "Soluciones digitales a medida para problemas complejos". Decidido el 2 de octubre de 2026. |

---

## 13. Fuera del alcance, por ahora

* Área de clientes, inicio de sesión o paneles reales conectados a datos.
* Blog o noticias.
* Integración con CRM para los contactos.
* Vídeo real. Todo lo que se mueve es SVG.
