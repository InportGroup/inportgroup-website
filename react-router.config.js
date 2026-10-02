// Web estática de una sola página: sin servidor, se prerenderiza a HTML en build/client
// para servirla desde GitHub Pages. El laboratorio se prerenderiza pero no se indexa.

export default {
  appDirectory: 'src',
  ssr: false,
  prerender: () => ['/', '/laboratorio'],
}
