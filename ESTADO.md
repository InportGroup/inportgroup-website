# Estado del proyecto

Última actualización: 24 de noviembre de 2026, rediseño V2 en la rama `webv2`.

La guía completa está en `GUIA.md`. Este documento dice qué está hecho, qué falta y cómo retomarlo. El historial anterior (escenas, fases 0 a 2, posicionamiento) está en Git, en `main` antes de la fusión de `webv2`.

## Dónde está el trabajo

* `main`: la web publicada desde el 2 de octubre de 2026, con escenas animadas. Cada subida a `main` se publica en www.inportgroup.com.
* `webv2`: el rediseño, pendiente de revisar y fusionar. No se publica hasta que se fusione con `main`.
* La web de 2025 queda en la etiqueta `web2025`.

## Rediseño V2: hecho (24 de noviembre de 2026)

A partir de la referencia "Web Inport V2" (papel, tinta y lima; por qué, cómo y qué):

* Página nueva: portada con el titular "¿Y si no tuviera por qué hacerse así?", lo que nos mueve, cuatro fases, un caso por sector en pestañas y contacto. Detalle en `GUIA.md`, sección 5.
* Textos reescritos de tú, sin guiones, sin negritas, sin emojis ni flechas, y sin los giros de la referencia que sonaban a texto generado ("No es tecnología. Es ingenio aplicado.", "Capturamos. Interpretamos. Conectamos. Mejoramos.", "la llama no miente").
* Fuera: laboratorio, panorama de la portada, sección de maquetas (los prototipos van dentro de cada sector), automatización de albaranes, control de obra, botones de compartir, filas de cifras y `scripts/verify.mjs`.
* Vídeos: vuelven cuatro escenas de la web anterior, una por sector (`astilleros`, `hornos`, `cultivo`, `boutique`), con un reproductor mínimo (reproducir, línea de tiempo y la nota de datos de demostración). Sin cajetín, sin grano y sin el conmutador de la escena de heladas. Ocupan el sitio de la foto de sector y de la línea de pasos. Las notas largas de la escena de tienda pasan a dos líneas porque Archivo es más ancha que la serif anterior.
* Pestañas accesibles con teclado; las anclas `#maritimo`, `#industria`, `#campo` y `#retail` abren su pestaña.
* Iconos, favicon e imagen para compartir regenerados con la marca nueva.
* Comprobado sobre la compilación servida: `check.mjs` en verde a 1440 y 390 px en la página y con el vídeo de cada sector cargado (sin guiones, sin negritas, sin desbordamientos, sin errores en consola), teclado de pestañas y anclas de sector, 404 propia, y fotogramas revisados de los cuatro vídeos.

## Pendiente

* Foto del equipo en la portada. Va en `public/fotos/` y su ruta en `PORTADA.foto.src` (`src/content/es/pagina.js`).
* Aviso legal: razón social, NIF y domicilio.

## Cómo retomarlo

```
git switch webv2
npm install
npm run dev                 http://localhost:5190
node scripts/check.mjs all
```
