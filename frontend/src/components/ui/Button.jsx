'use client';

/**
 * Componente Button - Botones reutilizables con variantes de marca
 * 
 * Variantes: primary, secondary, outline, ghost, whatsapp, rappi, danger
 * Tamaños: sm, md, lg
 */

const variants = {
  primary: 'bg-brand-blue text-white hover:bg-brand-blue-dark active:bg-brand-blue-dark',
  secondary: 'bg-brand-green text-white hover:bg-brand-green-dark active:bg-brand-green-dark',
  outline: 'border-2 border-brand-blue text-brand-blue hover:bg-brand-blue-light active:bg-brand-blue-light',
  ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
  whatsapp: 'bg-whatsapp text-white hover:bg-whatsapp-dark active:bg-whatsapp-dark',
  rappi: 'bg-rappi text-white hover:opacity-90 active:opacity-80',
  danger: 'bg-brand-red text-white hover:opacity-90 active:opacity-80',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  ...props
}) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    transition-all duration-200 ease-out
    focus-ring
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
}

// Botón de enlace con estilos de Button
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  iconPosition = 'left',
  external = false,
  ...props
}) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    transition-all duration-200 ease-out
    focus-ring
    no-underline
  `;

  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <a
      href={href}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `.trim()}
      {...externalProps}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </a>
  );
}

