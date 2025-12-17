import Link from 'next/link';
import Image from 'next/image';
import { AvailabilityBadge } from '@/components/ui/Badge';
import { IconWhatsApp, IconImage } from '@/components/icons';

/**
 * ProductCard - Tarjeta de producto para el catálogo
 */
export default function ProductCard({
  product,
  showWhatsApp = true,
  className = '',
}) {
  const {
    id,
    slug,
    name,
    presentation,
    price,
    currency = 'COP',
    availability_status,
    primary_image,
  } = product;

  const productUrl = `/producto/${slug}`;

  // Formato de precio colombiano
  const formattedPrice = price
    ? new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
      }).format(price)
    : null;

  // Mensaje de WhatsApp
  const whatsappMessage = encodeURIComponent(
    `Hola Dromedicinal, quiero pedir: ${name}${presentation ? ` (${presentation})` : ''}. ¿Está disponible?`
  );
  const whatsappUrl = `https://wa.me/573001234567?text=${whatsappMessage}`;

  const cardClasses = [
    'group bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-300',
    className,
  ].filter(Boolean).join(' ');

  return (
    <article className={cardClasses}>
      {/* Image */}
      <Link href={productUrl} className="block relative aspect-square overflow-hidden bg-gray-100">
        {primary_image ? (
          <Image
            src={primary_image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconImage className="w-12 h-12 text-gray-300" />
          </div>
        )}
        {/* Availability badge */}
        {availability_status && availability_status !== 'IN_STOCK' && (
          <div className="absolute top-3 left-3">
            <AvailabilityBadge status={availability_status} size="sm" />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <Link href={productUrl}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-blue transition-colors">
            {name}
          </h3>
        </Link>

        {/* Presentation */}
        {presentation && (
          <p className="text-sm text-gray-500 mt-1">{presentation}</p>
        )}

        {/* Price and actions */}
        <div className="mt-3 flex items-center justify-between gap-2">
          {formattedPrice ? (
            <span className="text-lg font-bold text-brand-blue">
              {formattedPrice}
            </span>
          ) : (
            <span className="text-sm text-gray-500 italic">Consultar precio</span>
          )}

          {showWhatsApp && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-whatsapp text-white text-sm font-medium rounded-full hover:bg-whatsapp-dark transition-colors"
              aria-label={`Pedir ${name} por WhatsApp`}
            >
              <IconWhatsApp className="w-4 h-4" />
              <span className="hidden sm:inline">Pedir</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
