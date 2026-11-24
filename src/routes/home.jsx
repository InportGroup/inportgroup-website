import { seo } from '../content/es/site.js'
import Como from '../sections/Como.jsx'
import Contacto from '../sections/Contacto.jsx'
import Mueve from '../sections/Mueve.jsx'
import Portada from '../sections/Portada.jsx'
import Que from '../sections/Que.jsx'

// La web es esta única página (GUIA.md, sección 7): por qué, cómo, qué y contacto.

export const meta = () => seo({ ruta: '/' })

export default function Home() {
  return (
    <>
      <Portada />
      <Mueve />
      <Como />
      <Que />
      <Contacto />
    </>
  )
}
