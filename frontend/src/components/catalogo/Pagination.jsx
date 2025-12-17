'use client';

import { IconChevronLeft, IconChevronRight } from '@/components/icons';

/**
 * Pagination - Componente de paginación para el catálogo
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const navButtonClasses = 'p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors';
  const pageButtonBaseClasses = 'w-10 h-10 rounded-lg font-medium transition-colors';

  return (
    <nav
      className={`flex items-center justify-center gap-1 ${className}`}
      aria-label="Paginación"
    >
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={navButtonClasses}
        aria-label="Página anterior"
      >
        <IconChevronLeft className="w-5 h-5" />
      </button>

      {/* First page + ellipsis */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`${pageButtonBaseClasses} text-gray-600 hover:bg-gray-100`}
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span className="px-2 text-gray-400">...</span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pageNumbers.map((page) => {
        const isActive = currentPage === page;
        const pageClasses = isActive
          ? `${pageButtonBaseClasses} bg-brand-blue text-white`
          : `${pageButtonBaseClasses} text-gray-600 hover:bg-gray-100`;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={pageClasses}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Last page + ellipsis */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-400">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`${pageButtonBaseClasses} text-gray-600 hover:bg-gray-100`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={navButtonClasses}
        aria-label="Página siguiente"
      >
        <IconChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}

/**
 * Información de resultados
 */
export function PaginationInfo({ page, perPage, total }) {
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <p className="text-sm text-gray-500">
      Mostrando <span className="font-medium">{start}</span> a{' '}
      <span className="font-medium">{end}</span> de{' '}
      <span className="font-medium">{total}</span> productos
    </p>
  );
}
