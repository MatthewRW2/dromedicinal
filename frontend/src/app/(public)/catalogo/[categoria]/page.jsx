import { notFound } from 'next/navigation';
import { generateCategoryMetadata } from '@/lib/seo';
import { ProductCard, FiltersBar, Pagination, PaginationInfo } from '@/components/catalogo';

// Mock data - En producción vendría de la API
const categoriesData = {
  'medicamentos': {
    id: 1,
    name: 'Medicamentos',
    slug: 'medicamentos',
    description: 'Medicamentos de venta libre y bajo fórmula médica',
    product_count: 150,
  },
  'cuidado-personal': {
    id: 2,
    name: 'Cuidado Personal',
    slug: 'cuidado-personal',
    description: 'Productos para el cuidado de tu piel, cabello y más',
    product_count: 80,
  },
};

const mockProducts = [
  {
    id: 1,
    slug: 'acetaminofen-500mg-x10',
    name: 'Acetaminofén 500mg',
    presentation: 'Caja x 10 tabletas',
    price: 5500,
    availability_status: 'IN_STOCK',
    primary_image: null,
  },
  {
    id: 2,
    slug: 'ibuprofeno-400mg-x20',
    name: 'Ibuprofeno 400mg',
    presentation: 'Caja x 20 tabletas',
    price: 12000,
    availability_status: 'IN_STOCK',
    primary_image: null,
  },
  {
    id: 3,
    slug: 'loratadina-10mg-x10',
    name: 'Loratadina 10mg',
    presentation: 'Caja x 10 tabletas',
    price: 8500,
    availability_status: 'LOW_STOCK',
    primary_image: null,
  },
  {
    id: 4,
    slug: 'omeprazol-20mg-x14',
    name: 'Omeprazol 20mg',
    presentation: 'Caja x 14 cápsulas',
    price: 15000,
    availability_status: 'IN_STOCK',
    primary_image: null,
  },
  {
    id: 5,
    slug: 'vitamina-c-500mg-x100',
    name: 'Vitamina C 500mg',
    presentation: 'Frasco x 100 tabletas',
    price: 25000,
    availability_status: 'IN_STOCK',
    primary_image: null,
  },
  {
    id: 6,
    slug: 'suero-oral-pedialyte',
    name: 'Suero Oral Pedialyte',
    presentation: 'Botella 500ml',
    price: 18000,
    availability_status: 'OUT_OF_STOCK',
    primary_image: null,
  },
];

export async function generateMetadata({ params }) {
  const { categoria } = await params;
  const category = categoriesData[categoria];
  
  if (!category) {
    return { title: 'Categoría no encontrada' };
  }
  
  return generateCategoryMetadata(category);
}

export default async function CategoryPage({ params, searchParams }) {
  const { categoria } = await params;
  const category = categoriesData[categoria];
  
  if (!category) {
    notFound();
  }

  // En producción, aquí se haría el fetch a la API con los filtros
  const products = mockProducts;
  const totalProducts = products.length;
  const currentPage = 1;
  const perPage = 24;
  const totalPages = Math.ceil(totalProducts / perPage);

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

        {/* Filters */}
        <div className="mb-8">
          <FiltersBar
            onSearch={(term) => console.log('Search:', term)}
            onFilter={(filters) => console.log('Filters:', filters)}
          />
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between mb-6">
          <PaginationInfo page={currentPage} perPage={perPage} total={totalProducts} />
        </div>

        {/* Products grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No se encontraron productos</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => console.log('Page:', page)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
