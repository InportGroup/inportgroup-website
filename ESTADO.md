# Estado del proyecto

Última actualización: 2 de octubre de 2026, al publicar la web nueva en www.inportgroup.com.

La guía completa está en `GUIA.md`. Este documento dice qué está hecho, qué falta y cómo retomarlo.

## Dónde está el trabajo

* La web nueva está en `main` y publicada en www.inportgroup.com desde el 2 de octubre de 2026, con GitHub Pages en modo GitHub Actions: cada subida a `main` la compila y la publica.
* La web de 2025 queda en la etiqueta `web2025` y, como referencia, en `legacy/index2025.html`.
* La rama `web2026` contiene el mismo trabajo previo a la fusión.

## Decisiones tomadas

* 2 de octubre de 2026: aprobadas todas las propuestas de la sección 12 de la guía (español primero, sin nombres de clientes, usted, titular, logotipo provisional, contacto por correo, sin analítica).
* 2 de octubre de 2026: la web es una sola página con secciones (decisión 12): portada, quiénes somos, qué hacemos, especialidades, seis ejemplos con su escena, maquetas y contacto.
* 2 de octubre de 2026: nuevo mensaje (decisión 13). Hacemos soluciones digitales para cualquier sector; primero buscamos lo que aporta valor y nos centramos en eso; nuestra especialidad son los proyectos complejos. La web no habla directamente de inteligencia artificial ni de "trabajar con las manos". Titular: "Primero, dónde está el valor. Después, la técnica que haga falta." 

## Fase 0 · Cimientos: terminada

Proyecto con React 19, Vite 8 y React Router 8 prerenderizado, paleta validada, motor de escenas traído de InLux, herramientas de revisión y flujo de publicación manual. Detalle en el historial de este documento y en la guía.

## Fase 1 · Una sola página: terminada

Hecho:

* Página única en `src/routes/home.jsx` con sus secciones en `src/sections/`: portada con "Un martes de octubre" (seis horas que bajan a su ejemplo), quiénes somos (dos párrafos, cuatro pasos, cinco principios), qué hacemos (esquema vivo y cuatro verbos), especialidades (cuatro sectores; las líneas con ejemplo enlazan a él), seis ejemplos, maquetas y contacto. Pie con el desplegable de aviso legal y privacidad, con los datos de la empresa pendientes.
* Navegación por anclas con la sección activa subrayada y menú a pantalla completa en móvil. Las rutas de sector y de solución se han quitado.
* Textos en `src/content/es/pagina.js` y `ejemplos.js`, sacados de las fichas de la guía, de las maquetas y de las propuestas, sin nombres de clientes. Cada cifra lleva su tipo (demostración, especificación del sistema o fuente pública con enlace).
* Escenas, primera versión (unos 30 segundos y cuatro planos cada una):
  * `recorrido`: de lo que ya hay a quien decide, con la frontera de la instalación. Se pone en vertical en móvil.
  * `cultivo`: la helada que la garita no ve (la escena de prueba de la fase 0).
  * `cebo`: entrada de lechones, bajas sin cobertura, la curva frente a las mejores cebas, aviso de mortalidad.
  * `obra`: vaciado medido por dron, estructura frente a lo previsto, una persona bajo la carga, certificación.
  * `hornos`: la sección del horno, la imagen de la cámara, la malla de 5 × 4 con el frente de llama y el aire, la lente sucia y la consola del DCS.
  * `astilleros`: se vacía el dique, vuelo del dron, segmentación, el costado desplegado y el presupuesto.
  * `boutique`: la mañana, el grupo del crucero con esperas, el mapa de calor de la semana y la calle con el embudo del escaparate.
* `src/scenes/kit.jsx` con las piezas comunes (etiquetas con halo, notas con cifra grande, reloj por tramos).
* Las escenas ya no se prerenderizan: se dibujan en el navegador cuando el marco se acerca a la pantalla. Antes había diferencias de hidratación porque Node y Chrome no calculan igual el último decimal de `Math.exp` y `Math.sin`. `noise1` se ha rehecho con operaciones enteras. El HTML de la página pasa a pesar unos 40 KB.

Comprobado:

* `node scripts/verify.mjs` en las siete escenas: compilan, consola limpia, entre 63 y 486 nodos SVG (presupuesto: 1.500).
* `node scripts/check.mjs` en las dos rutas y en cada escena congelada en cada uno de sus planos (27 fotogramas), a 1440 y 390 px: sin guiones, sin negritas, sin desbordamientos, sin errores.
* Sin errores de hidratación en desarrollo ni en la compilación servida, en móvil y en escritorio, entrando por la portada y por las anclas de tres ejemplos.
* Movimiento reducido: la escena se queda en su fotograma cartel. Sin él, avanza solo con el marco en pantalla.
* Capturas revisadas de cada plano de cada escena en escritorio y de todas en móvil, y de las secciones de la página en los dos anchos.

Pendiente y notas:

* Las escenas son la primera versión. La fase 3 las lleva a la ficha completa de la sección 9 (más planos, de 40 a 60 segundos, interacción con sentido: pasar por una celda, conmutadores).
* En móvil algunos rótulos pequeños de cebo y boutique siguen siendo muy pequeños; se revisan en la fase 3.
* Entrar por un ancla con la página recién cargada puede quedar unos píxeles corto si las escenas de arriba aún no se han dibujado; los huecos reservados ya imitan sus alturas.
* Faltan los datos del aviso legal (razón social, NIF, domicilio) antes de publicar.
* React Router 8 pide Node 22.22 o superior; en este equipo hay 22.18. Funciona, pero conviene actualizar.
* En Git Bash, las rutas que empiezan por `/` en los scripts necesitan `MSYS_NO_PATHCONV=1`.
* Un servidor de desarrollo lanzado en segundo plano puede sobrevivir al cierre de su tarea y seguir ocupando el puerto 5190; si `npm run dev` dice que el puerto está ocupado, hay que parar ese proceso.

## Cambio de mensaje: terminado

* Portada: kicker "Soluciones digitales a medida · para cualquier sector", titular nuevo y entradilla con las tres ideas (cualquier sector, primero el valor, lo difícil).
* Quiénes somos: el primer paso del método es ahora el diagnóstico de dónde está el valor; los párrafos ya no enumeran técnicas.
* Qué hacemos: los cuatro verbos se explican sin hablar de modelos ni de inteligencia artificial.
* Especialidades: "Lo difícil, en cualquier sector."
* Metadatos y pie con el mensaje nuevo. La técnica solo se nombra dentro de los ejemplos (regla 11 de redacción).

## Fase 2 · Panorama: terminada

* `src/scenes/panorama/index.jsx`: un paisaje de 7.200 unidades del campo a la ciudad, con cuatro capas a distinta velocidad (cordillera, lomas con molinos, el paisaje y la vida de cada sitio). El cielo cambia con la hora: madrugada violeta en la finca, mediodía azul en la obra, tarde naranja en el dique, noche en la ciudad con ventanas y farolas que se encienden. La cámara viaja sola unos 60 segundos y se para en los seis lugares; en cada uno aparece su anotación, que baja al ejemplo. Solo se ve la anotación del lugar más cercano.
* `src/scenes/panorama/Player.jsx`: la escena a todo el ancho, sin cajetín, con reproducir y pausar, las seis horas pulsables y la frase de la hora en curso con su enlace.
* `src/sections/Panorama.jsx`: lo carga solo en el navegador, con su hueco reservado. La portada lleva además las seis frases en una lista oculta a la vista para lectores de pantalla y buscadores.
* Comprobado: 335 nodos SVG, consola limpia, reglas en verde en seis momentos del recorrido, sin errores de hidratación en producción, y 60 fotogramas por segundo en la portada en Chrome sin interfaz.
* Cambio respecto a la guía original: el panorama no se ata al desplazamiento de la página (sección 7.2).

## Revisión de limpieza: terminada (2 de octubre de 2026)

Objetivo: que la web se vea profesional, sencilla y limpia.

* Ejemplos: un solo párrafo breve tras la entradilla; las etiquetas de tipo de cada cifra se resumen en una línea; bajo las cifras solo el límite y un enlace; filete por capítulo con el numeral en el kicker; cifras en fila también en móvil.
* Quiénes somos: el párrafo pasa a la cabecera; cuatro pasos y cuatro principios en la misma rejilla (se retira "Decide una persona").
* Especialidades: cuatro líneas por sector (fuera contenedores y líneas de producción de la lista de industria).
* Maquetas: el mismo botón en todas las tarjetas.
* Ritmo vertical más contenido entre secciones; la portada mantiene su aire antes del panorama.
* Resultado: la página pasa de 17.367 a unos 16.300 px en escritorio y de 22.304 a 18.589 en móvil. Reglas en verde y sin errores de hidratación en producción.

## Sectores, automatización y Render: terminado (2 de octubre de 2026)

* La página se ordena por sectores (decisión 14): industria, automatización de procesos, retail, y agricultura y ganadería. Cada sector es una sección (`src/sections/Sectores.jsx`) con su cabecera, cuatro líneas de lo que hacemos y sus ejemplos. Desaparecen las secciones de especialidades y de ejemplos; la navegación enlaza a los cuatro sectores.
* Nuevo sector y ejemplo de automatización de procesos: "Del albarán al ERP sin teclear", con la escena `procesos` (30 s, cuatro planos: llegan los papeles, se leen solos, se cruzan con el pedido, al ERP sin teclear), encuadre propio por plano en móvil, 109 nodos SVG.
* Paleta de sectores validada también en el orden nuevo.
* El panorama de la portada no cambia: sigue las horas del día del campo a la ciudad.
* `render.yaml`: sitio estático `inport-web` en Render, rama `web2026` de momento, Node 22, cabeceras de caché y seguridad. Comprobado con `npm ci && npm run build` desde cero: 699 KB en `build/client`.
* Comprobado sobre la compilación servida: reglas en verde en la página y en los cuatro planos de la escena nueva, sin errores de hidratación en móvil ni en escritorio entrando por la portada y por tres anclas, navegación sin desbordar a 1060 px.
* Pendiente para publicar en Render: subir la rama `web2026` al repositorio, crear el blueprint en Render y, cuando se quiera usar el dominio, cambiar el DNS de IONOS.
* Nota: `npm ci` falla si el servidor de desarrollo está arrancado (tiene abiertos archivos de `node_modules`); hay que pararlo antes.

## Publicación: hecha (2 de octubre de 2026)

* Etiqueta `web2025` sobre la web anterior, para volver atrás si hace falta.
* `web2026` fusionada con `main`. Antes de subir `main`, GitHub Pages pasó de construir la rama a GitHub Actions, para que nunca se publicara la raíz sin `index.html`.
* El flujo `pages.yml` usa las versiones actuales de las acciones y se lanza en cada subida a `main`. Primera ejecución correcta.
* Comprobado en el dominio: www.inportgroup.com e inportgroup.com sirven la web nueva con HTTPS; reglas en verde; sin errores de hidratación en móvil ni en escritorio; 404 propia para rutas inexistentes; sitemap y robots servidos.
* Pendiente antes de darla por cerrada: completar el aviso legal (razón social, NIF, domicilio), que hoy muestra los huecos.
* Para volver a la web de 2025: publicar desde la etiqueta `web2025` (por ejemplo, revertir la fusión en `main`).

## Títulos y continuidad: hecho (2 de octubre de 2026)

* Secciones numeradas de 01 a 08 con títulos profesionales; la portada pasa a "Soluciones digitales a medida para problemas complejos".
* Hilo entre secciones: método, capacidades (medir, anticipar, integrar, automatizar), cuatro sectores que enlazan entre sí, maquetas como prototipos de los casos y contacto que vuelve al método.
* Casos numerados (Caso 1 a Caso 7) con títulos descriptivos y la estructura el reto, la solución, en cifras y límites. Los textos de "El reto" ya no adelantan la solución.
* Contacto con la misma cabecera que el resto de secciones.

## Siguiente: fase 3 · Escenas completas

Llevar cada escena de ejemplo a su ficha de la sección 9 (más planos, de 40 a 60 segundos, interacción con sentido), una por sesión, empezando por la que más se vaya a enseñar. Revisar de paso los rótulos pequeños en móvil de cebo y boutique.

## Cómo retomarlo

```
git switch web2026
npm install
npm run dev                 http://localhost:5190
node scripts/check.mjs all
```

Leer `GUIA.md` (secciones 3, 4, 5 y 7, y la ficha de la escena que toque) y este documento, y seguir por la fase siguiente.
