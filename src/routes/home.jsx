import Contacto from '../components/Contacto.jsx'
import { seo } from '../content/es/site.js'
import Hacemos from '../sections/Hacemos.jsx'
import Maquetas from '../sections/Maquetas.jsx'
import Nosotros from '../sections/Nosotros.jsx'
import Portada from '../sections/Portada.jsx'
import Sectores from '../sections/Sectores.jsx'

// La web es esta única página (GUIA.md, sección 7): portada, quiénes somos, qué hacemos, los cuatro
// sectores con sus ejemplos (industria, automatización, retail, campo), maquetas y contacto.

export const meta = () => seo({ ruta: '/' })

export default function Home() {
  return (
    <>
      <Portada />
      <Nosotros />
      <Hacemos />
      <Sectores />
      <Maquetas />
      <Contacto />
    </>
  )
}
