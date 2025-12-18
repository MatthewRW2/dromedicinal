'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard, FiltersBar, Pagination, PaginationInfo } from '@/components/catalogo';
import { publicAPI } from '@/lib/api';

/**
 * Componente cliente para manejar filtros y paginación en página de categoría
 */
export default function CategoryProductsClient({ 
  category, 
  initialProducts, 
  initialMeta 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [whatsappNumber, setWhatsappNumber] = useState(null);

  // Cargar settings para obtener WhatsApp
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await publicAPI.getSettings();
        const settings = response.data || {};
        if (settings.whatsapp_number) {
          setWhatsappNumber(settings.whatsapp_number);
        }
      } catch (error) {
        // Usar valor por defecto si falla
        setWhatsappNumber('573134243625');
      }
    };
    loadSettings();
  }, []);

  const products = initialProducts || [];
  const meta = initialMeta || {
    current_page: 1,
    per_page: 24,
    total: 0,
    total_pages: 1,
  };

  // Función para actualizar URL con nuevos parámetros
  const updateURL = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '' || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    // Resetear página si cambian otros filtros
    if (newParams.q !== undefined || newParams.availability !== undefined) {
      params.set('page', '1');
    }

    router.push(`/catalogo/${category.slug}?${params.toString()}`);
  };

  const handleSearch = (term) => {
    updateURL({ q: term || null });
  };

  const handleFilter = (filters) => {
    updateURL({
      availability: filters.availability || null,
      min_price: filters.min_price || null,
      max_price: filters.max_price || null,
    });
  };

  const handlePageChange = (page) => {
    updateURL({ page: page.toString() });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Filters */}
      <div className="mb-8">
        <FiltersBar
          onSearch={handleSearch}
          onFilter={handleFilter}
          initialSearch={searchParams.get('q') || ''}
          initialFilters={{
            availability: searchParams.get('availability') || '',
            min_price: searchParams.get('min_price') || '',
            max_price: searchParams.get('max_price') || '',
          }}
        />
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between mb-6">
        <PaginationInfo 
          page={meta.current_page} 
          perPage={meta.per_page} 
          total={meta.total} 
        />
      </div>

      {/* Products grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No se encontraron productos en esta categoría</p>
          <p className="text-gray-400 text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}

      {/* Pagination */}
      {meta.total_pages > 1 && (
        <div className="mt-10">
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.total_pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}

