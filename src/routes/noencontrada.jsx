import Aviso from '../components/Aviso.jsx'
import { seo } from '../content/es/site.js'

export const meta = () => seo({ titulo: 'Página no encontrada', indexar: false })

export default function Ruta() {
  return <Aviso titulo="Aquí no hay nada." texto="Todo lo que contamos está en una sola página." />
}
