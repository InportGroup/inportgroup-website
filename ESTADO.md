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
* Fuera: escenas animadas y su motor (`src/scenes`, `src/components/film`, `src/lib`), laboratorio, sección de maquetas (los prototipos van dentro de cada sector), automatización de albaranes, control de obra, botones de compartir, cifras de demostración y `scripts/verify.mjs`.
* Pestañas accesibles con teclado; las anclas `#maritimo`, `#industria`, `#campo` y `#retail` abren su pestaña.
* Iconos, favicon e imagen para compartir regenerados con la marca nueva.
* Comprobado sobre la compilación servida: `check.mjs` en verde a 1440 y 390 px (sin guiones, sin negritas, sin desbordamientos, sin errores en consola), teclado de pestañas y anclas de sector, 404 propia.

## Pendiente

* Fotos: la del equipo en la portada y una por sector (dron sobre un casco, imagen de la cámara de un horno, cámara térmica en una finca, sala de una tienda). Van en `public/fotos/` y su ruta en `foto.src`.
* Aviso legal: razón social, NIF y domicilio.
* El prototipo del pistacho está en el plan gratuito de Render y tarda cerca de un minuto en despertar. Conviene pasarlo a GitHub Pages o a un plan de pago.
* Revisar y fusionar `webv2` con `main` para publicarla.

## Cómo retomarlo

```
git switch webv2
npm install
npm run dev                 http://localhost:5190
node scripts/check.mjs all
```
