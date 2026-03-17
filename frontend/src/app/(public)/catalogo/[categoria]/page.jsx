import { notFound } from 'next/navigation';
import { generateCategoryMetadata } from '@/lib/seo';
import { publicAPI } from '@/lib/api';
import CategoryProductsClient from '@/components/catalogo/CategoryProductsClient';

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const res = await publicAPI.getCategories();
    const categories = res.data || [];
    const slugs = categories.filter((c) => c?.slug).map((c) => ({ categoria: String(c.slug) }));
    return slugs.length > 0 ? slugs : [{ categoria: '_' }];
  } catch {
    return [{ categoria: '_' }];
  }
}

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

export default async function CategoryPage({ params }) {
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

  // Para static export: siempre página 1 sin filtros. El cliente maneja paginación/filtros.
  const perPage = 24;
  let products = [];
  let meta = {
    current_page: 1,
    per_page: perPage,
    total: 0,
    total_pages: 1,
  };

  try {
    const productsRes = await publicAPI.getProducts({
      category: categoria,
      page: 1,
      per_page: perPage,
    });
    products = Array.isArray(productsRes.data) ? productsRes.data : [];
    if (productsRes.meta) {
      meta = {
        current_page: Number(productsRes.meta.current_page) || 1,
        per_page: Number(productsRes.meta.per_page) || perPage,
        total: Number(productsRes.meta.total) || 0,
        total_pages: Number(productsRes.meta.total_pages) || 1,
      };
    }
  } catch (error) {
    products = [];
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
