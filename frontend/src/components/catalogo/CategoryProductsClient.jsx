'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard, FiltersBar, Pagination, PaginationInfo } from '@/components/catalogo';
import { publicAPI } from '@/lib/api';

/** Obtener search params desde window (compatible con static export, sin useSearchParams) */
function useQueryParams() {
  const [params, setParams] = useState(() => {
    if (typeof window === 'undefined') return new URLSearchParams('');
    return new URLSearchParams(window.location.search);
  });

  useEffect(() => {
    const updateParams = () => setParams(new URLSearchParams(window.location.search));
    window.addEventListener('popstate', updateParams);
    return () => window.removeEventListener('popstate', updateParams);
  }, []);

  const sync = () => setParams(new URLSearchParams(window.location.search));
  return { params, sync };
}

/**
 * Componente cliente para manejar filtros y paginación en página de categoría.
 * Con exportación estática, la paginación y filtros se obtienen del API en el cliente.
 */
export default function CategoryProductsClient({ 
  category, 
  initialProducts, 
  initialMeta 
}) {
  const router = useRouter();
  const { params: searchParams, sync } = useQueryParams();
  const [whatsappNumber, setWhatsappNumber] = useState(null);
  const [products, setProducts] = useState(() => Array.isArray(initialProducts) ? initialProducts : []);
  const [meta, setMeta] = useState(() => ({
    current_page: Number(initialMeta?.current_page) || 1,
    per_page: Number(initialMeta?.per_page) || 24,
    total: Number(initialMeta?.total) || 0,
    total_pages: Number(initialMeta?.total_pages) || 1,
  }));
  const [loading, setLoading] = useState(false);

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
        setWhatsappNumber('573134243625');
      }
    };
    loadSettings();
  }, []);

  // Obtener productos cuando cambian los parámetros de la URL
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const q = searchParams.get('q') || '';
  const availability = searchParams.get('availability') || '';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const apiParams = {
        category: category.slug,
        page,
        per_page: meta.per_page,
      };
      if (q) apiParams.q = q;
      if (availability) apiParams.availability = availability;
      if (minPrice) apiParams.min_price = minPrice;
      if (maxPrice) apiParams.max_price = maxPrice;

      const res = await publicAPI.getProducts(apiParams);
      const items = Array.isArray(res?.data) ? res.data : [];
      const m = res?.meta || {};
      setProducts(items);
      setMeta({
        current_page: Number(m.current_page) || page,
        per_page: Number(m.per_page) || meta.per_page,
        total: Number(m.total) || 0,
        total_pages: Number(m.total_pages) || 1,
      });
    } catch (error) {
      setProducts([]);
      setMeta((prev) => ({ ...prev, total: 0, total_pages: 1 }));
    } finally {
      setLoading(false);
    }
  }, [category.slug, page, q, availability, minPrice, maxPrice, meta.per_page]);

  // Si hay parámetros de filtro/paginación distintos a los iniciales, hacer fetch
  useEffect(() => {
    const needsFetch = page !== 1 || q || availability || minPrice || maxPrice;
    if (needsFetch) {
      fetchProducts();
    } else {
      // Usar datos iniciales
      setProducts(Array.isArray(initialProducts) ? initialProducts : []);
      setMeta({
        current_page: Number(initialMeta?.current_page) || 1,
        per_page: Number(initialMeta?.per_page) || 24,
        total: Number(initialMeta?.total) || 0,
        total_pages: Number(initialMeta?.total_pages) || 1,
      });
    }
  }, [page, q, availability, minPrice, maxPrice, fetchProducts, initialProducts, initialMeta]);

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

    if (newParams.q !== undefined || newParams.availability !== undefined) {
      params.set('page', '1');
    }

    router.push(`/catalogo/${category.slug}?${params.toString()}`);
    sync(); // Forzar re-render para leer nueva URL
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

  const handlePageChange = (pageNum) => {
    updateURL({ page: pageNum.toString() });
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
      {meta.total_pages > 1 && Number.isFinite(meta.total_pages) && (
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

