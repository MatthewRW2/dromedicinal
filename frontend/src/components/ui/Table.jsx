/**
 * Componente Table - Tablas de datos para el admin
 */

export default function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead className="bg-gray-50">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {children}
    </tbody>
  );
}

export function TableRow({ children, onClick, className = '' }) {
  return (
    <tr
      onClick={onClick}
      className={`
        ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}
        ${className}
      `}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '', align = 'left' }) {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <th
      className={`
        px-4 py-3
        text-xs font-semibold text-gray-600 uppercase tracking-wider
        ${alignments[align]}
        ${className}
      `}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = '', align = 'left' }) {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td
      className={`
        px-4 py-3
        text-sm text-gray-700
        ${alignments[align]}
        ${className}
      `}
    >
      {children}
    </td>
  );
}

/**
 * Estado vacío para tablas
 */
export function TableEmpty({ message = 'No hay datos disponibles', icon }) {
  return (
    <tr>
      <td colSpan="100%" className="px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-2">
          {icon || (
            <svg
              className="w-12 h-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          )}
          <p className="text-gray-500">{message}</p>
        </div>
      </td>
    </tr>
  );
}

