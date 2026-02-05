import HeroCarousel from './components/Home/HeroCarrousel'
import CategoriesGrid from './components/categories/CategoriesGrid'
import { CategoriasService } from './modules/categorias/categorias.service'

export default async function Home() {
  const service = new CategoriasService()
  const categorias = await service.obtenerCategorias()

  return (
    <>
      <HeroCarousel />
      <CategoriesGrid categories={categorias} />
    </>
  )
}
