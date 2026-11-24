// Web estática de una sola página: sin servidor, se prerenderiza a HTML en build/client
// para servirla desde GitHub Pages.

export default {
  appDirectory: 'src',
  ssr: false,
  prerender: () => ['/'],
}
