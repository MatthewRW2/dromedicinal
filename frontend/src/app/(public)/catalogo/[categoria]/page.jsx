import { notFound } from 'next/navigation';
import { generateCategoryMetadata } from '@/lib/seo';
import { publicAPI } from '@/lib/api';
import CategoryProductsClient from '@/components/catalogo/CategoryProductsClient';

export async function generateMetadata({ params }) {
  const { categoria } = await params;
  
  try {
    const response = await publicAPI.getCategory(categoria);
    const category = response.data;
    
    if (!category) {
      return { title: 'Categoría no encontrada' };
    }
    
    return generateCategoryMetadata(category);
  } catch (error) {
    return { title: 'Categoría no encontrada' };
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const { categoria } = await params;
  
  // Obtener categoría
  let category = null;
  try {
    const categoryRes = await publicAPI.getCategory(categoria);
    category = categoryRes.data;
  } catch (error) {
    notFound();
  }

  if (!category) {
    notFound();
  }

  // Obtener parámetros de búsqueda y filtros
  const page = parseInt(searchParams?.page || '1', 10);
  const perPage = 24;
  const q = searchParams?.q || '';
  const availability = searchParams?.availability || '';
  const minPrice = searchParams?.min_price || '';
  const maxPrice = searchParams?.max_price || '';

  // Construir parámetros para la API
  const apiParams = {
    category: categoria,
    page,
    per_page: perPage,
  };

  if (q) apiParams.q = q;
  if (availability) apiParams.availability = availability;
  if (minPrice) apiParams.min_price = minPrice;
  if (maxPrice) apiParams.max_price = maxPrice;

  // Obtener productos
  let products = [];
  let meta = {
    current_page: 1,
    per_page: perPage,
    total: 0,
    total_pages: 1,
  };

  try {
    const productsRes = await publicAPI.getProducts(apiParams);
    products = productsRes.data || [];
    meta = productsRes.meta || meta;
  } catch (error) {
    console.error('Error cargando productos:', error);
    // Continuar con arrays vacíos
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="container-app">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="hover:text-brand-blue">Inicio</a></li>
            <li>/</li>
            <li><a href="/catalogo" className="hover:text-brand-blue">Catálogo</a></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{category.name}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-600">{category.description}</p>
          )}
        </div>

        {/* Products with filters and pagination */}
        <CategoryProductsClient
          category={category}
          initialProducts={products}
          initialMeta={meta}
        />
      </div>
    </div>
  );
}
