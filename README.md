# Inport · www.inportgroup.com

Web de Inport en una sola página: quiénes somos, qué hacemos, cuatro sectores (industria, automatización de procesos, retail, agricultura y ganadería) con siete ejemplos, cada uno con una escena animada en SVG que se comporta como un vídeo corto, además de las maquetas completas y el contacto.

Node 22, React 19, Vite 8 y React Router 8 en modo framework con prerenderizado: la página sale como HTML estático en `build/client` y se sirve desde GitHub Pages. Las escenas se dibujan en el navegador cuando se acercan a la pantalla.

## Documentación

* `GUIA.md`: la fuente de verdad. Idea, tono y reglas de redacción, sistema visual, motor de escenas, arquitectura, páginas, fichas de cada solución, plan por fases y decisiones.
* `ESTADO.md`: qué está hecho, qué falta y cómo retomarlo.

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
node scripts/check.mjs all                         reglas de la casa en todas las rutas, a 1440 y 390 px
node scripts/verify.mjs hornos                     compila una escena, mira la consola y cuenta nodos SVG
node scripts/shot.mjs / 1440 1800                  captura de la página
node scripts/shot.mjs "/#hornos" 390 1500          captura en móvil, entrando por un ancla
node scripts/shot.mjs "hornos&t=19&freeze=1"       un fotograma concreto de una escena
```

En Git Bash, las rutas que empiezan por `/` necesitan `MSYS_NO_PATHCONV=1` delante para que no se conviertan en rutas de Windows.

El laboratorio de escenas está en `/laboratorio?escena=<id>` (no se indexa).

## Publicación

Es un sitio estático: Node solo compila; lo que se publica es `build/client`.

GitHub Pages (en uso): cada subida a `main` lanza `.github/workflows/pages.yml`, que compila y publica en www.inportgroup.com. Pages está en modo "GitHub Actions" y el dominio se configura en Settings > Pages. Para volver a la web de 2025: la etiqueta `web2025`.

Render (alternativa): el repositorio trae `render.yaml` (sitio estático `inport-web`, rama `main`). En Render: New, Blueprint, elegir `InportGroup/inportgroup-website` y aplicar. Para servir el dominio desde Render habría que cambiar el DNS.

DNS en IONOS:

| Tipo | Nombre | Valor |
|---|---|---|
| A | @ | 185.199.108.153 / .109.153 / .110.153 / .111.153 |
| AAAA | @ | 2606:50c0:8000::153 / 8001::153 / 8002::153 / 8003::153 |
| CNAME | www | inportgroup.github.io |

La web anterior está en `legacy/index2025.html`.

## Contacto

Beatriz Abuelo · Directora de soluciones · beatriz.abuelo@inportgroup.com
