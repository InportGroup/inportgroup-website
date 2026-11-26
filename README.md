# Inport · www.inportgroup.com

Web de Inport en una sola página, ordenada en por qué, cómo y qué: la portada, lo que nos mueve, un caso por sector (marítimo y portuario, industria, construcción, agricultura, ganadería, retail) en pestañas, cada uno con su vídeo, y el contacto.

Node 22, React 19, Vite 8 y React Router 8 en modo framework con prerenderizado: la página sale como HTML estático en `build/client` y se sirve desde GitHub Pages. Los vídeos son escenas dibujadas en SVG que se cargan en el navegador cuando se acercan a la pantalla.

## Documentación

* `GUIA.md`: la fuente de verdad. Idea, tono y reglas de redacción, sistema visual, estructura de la página, casos elegidos, arquitectura y decisiones.
* `ESTADO.md`: qué está hecho, qué falta y cómo retomarlo.

## Textos y fotos

Todos los textos están en `src/content/es/`: `pagina.js` (portada, cómo, qué, contacto, aviso legal), `sectores.js` (los seis casos) y `site.js` (marca, contacto y metadatos).

Para poner la foto de la portada: dejarla en `public/fotos/` y escribir su ruta en `PORTADA.foto.src`, por ejemplo `src: '/fotos/equipo.jpg'`. Mientras sea `null` se ve el hueco rayado con lo que tiene que ir.

Los vídeos de cada sector están en `src/scenes/` y se eligen con el campo `escena` de `sectores.js`.

## Local

```
npm install
npm run dev        http://localhost:5190
npm run build      compila y prerenderiza en build/client (con 404.html y sitemap.xml)
npm run preview    sirve build/client como GitHub Pages en http://localhost:5191
```

React Router 8 pide Node 22.22 o superior. Con versiones anteriores de Node 22 avisa, pero funciona.

## Revisión

Con `npm run dev` arrancado (o `INPORT_URL=http://localhost:5191` para revisar la compilación):

```
node scripts/check.mjs all              reglas de la casa a 1440 y 390 px
node scripts/shot.mjs / 1440 1800       captura de la página
node scripts/shot.mjs "/#retail" 390    captura en móvil, entrando por el ancla de un sector
node scripts/imagenes.mjs               regenera los iconos y la imagen para compartir
```

En Git Bash, las rutas que empiezan por `/` necesitan `MSYS_NO_PATHCONV=1` delante para que no se conviertan en rutas de Windows.

## Publicación

Es un sitio estático: Node solo compila; lo que se publica es `build/client`.

GitHub Pages (en uso): cada subida a `main` lanza `.github/workflows/pages.yml`, que compila y publica en www.inportgroup.com. Los cambios grandes se suben a otra rama y se fusionan con `main` cuando están revisados. Para volver a la web de 2025: la etiqueta `web2025`.

Render (alternativa): el repositorio trae `render.yaml` (sitio estático `inport-web`, rama `main`).

DNS en IONOS:

| Tipo | Nombre | Valor |
|---|---|---|
| A | @ | 185.199.108.153 / .109.153 / .110.153 / .111.153 |
| AAAA | @ | 2606:50c0:8000::153 / 8001::153 / 8002::153 / 8003::153 |
| CNAME | www | inportgroup.github.io |

La web de 2025 está en `legacy/index2025.html`.

## Contacto

Beatriz Abuelo · Directora de soluciones · beatriz.abuelo@inportgroup.com
