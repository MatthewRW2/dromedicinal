/**
 * Componente Spinner - Indicador de carga
 */

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export default function Spinner({ size = 'md', className = '', color = 'brand-blue' }) {
  return (
    <svg
      className={`animate-spin ${sizes[size]} text-${color} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Cargando"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Spinner con texto de carga
 */
export function LoadingState({ text = 'Cargando...', size = 'lg' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Spinner size={size} />
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}

/**
 * Overlay de carga para cubrir secciones
 */
export function LoadingOverlay({ show, text = 'Cargando...' }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  );
}

