'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { IconSearch, IconFilter } from '@/components/icons';

/**
 * FiltersBar - Barra de filtros y búsqueda para catálogo
 */
export default function FiltersBar({
  onSearch,
  onFilter,
  categories = [],
  initialFilters = {},
}) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.q || '');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    availability: initialFilters.availability || '',
    sort: initialFilters.sort || 'name_asc',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      availability: '',
      sort: 'name_asc',
    });
    onSearch?.('');
    onFilter?.({});
  };

  const availabilityOptions = [
    { value: '', label: 'Todos' },
    { value: 'IN_STOCK', label: 'Disponible' },
    { value: 'LOW_STOCK', label: 'Últimas unidades' },
    { value: 'ON_REQUEST', label: 'Bajo pedido' },
  ];

  const sortOptions = [
    { value: 'name_asc', label: 'Nombre A-Z' },
    { value: 'name_desc', label: 'Nombre Z-A' },
    { value: 'price_asc', label: 'Precio: menor a mayor' },
    { value: 'price_desc', label: 'Precio: mayor a menor' },
    { value: 'newest', label: 'Más recientes' },
  ];

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="search"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<IconSearch className="w-5 h-5" />}
            className="w-full"
          />
        </div>
        <Button type="submit" variant="primary">
          Buscar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          icon={<IconFilter className="w-5 h-5" />}
          className="lg:hidden"
        >
          Filtros
        </Button>
      </form>

      {/* Filters row - Always visible on desktop, toggle on mobile */}
      <div className={`
        flex flex-col lg:flex-row gap-3
        ${showFilters ? 'block' : 'hidden lg:flex'}
      `}>
        {/* Category filter */}
        {categories.length > 0 && (
          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={[
              { value: '', label: 'Todas las categorías' },
              ...categories.map((cat) => ({ value: cat.slug, label: cat.name })),
            ]}
            placeholder="Categoría"
            className="lg:w-48"
          />
        )}

        {/* Availability filter */}
        <Select
          value={filters.availability}
          onChange={(e) => handleFilterChange('availability', e.target.value)}
          options={availabilityOptions}
          placeholder="Disponibilidad"
          className="lg:w-48"
        />

        {/* Sort */}
        <Select
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          options={sortOptions}
          placeholder="Ordenar por"
          className="lg:w-48"
        />

        {/* Clear filters */}
        <Button
          type="button"
          variant="ghost"
          onClick={clearFilters}
          className="lg:ml-auto"
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
}
