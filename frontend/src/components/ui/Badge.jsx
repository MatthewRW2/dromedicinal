/**
 * Componente Badge - Etiquetas de estado y categorías
 * 
 * Variantes: default, success, warning, danger, info
 * Tamaños: sm, md
 */

const variants = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-brand-green-light text-brand-green-dark',
  warning: 'bg-brand-orange-light text-amber-700',
  danger: 'bg-brand-red-light text-brand-red',
  info: 'bg-brand-blue-light text-brand-blue-dark',
  promo: 'bg-gradient-to-r from-brand-blue to-brand-green text-white',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
  ...props
}) {
  const classes = [
    'inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap',
    variants[variant],
    sizes[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

/**
 * Badge de estado de disponibilidad para productos
 */
export function AvailabilityBadge({ status, size = 'md' }) {
  const statusConfig = {
    IN_STOCK: { label: 'Disponible', variant: 'success' },
    LOW_STOCK: { label: 'Últimas unidades', variant: 'warning' },
    OUT_OF_STOCK: { label: 'Agotado', variant: 'danger' },
    ON_REQUEST: { label: 'Bajo pedido', variant: 'info' },
  };

  const config = statusConfig[status] || statusConfig.IN_STOCK;

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}
