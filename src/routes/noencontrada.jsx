import NoEncontrada from '../components/NoEncontrada.jsx'
import { seo } from '../content/es/site.js'

export const meta = () => seo({ titulo: 'Página no encontrada', indexar: false })

export default function Ruta() {
  return <NoEncontrada />
}
