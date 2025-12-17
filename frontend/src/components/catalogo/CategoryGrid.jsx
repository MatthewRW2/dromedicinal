import Link from 'next/link';
import Image from 'next/image';
import {
  IconPill,
  IconSprayBottle,
  IconBaby,
  IconFlower,
  IconOrange,
  IconFirstAid,
  IconStorefront,
} from '@/components/icons';

// Iconos por defecto para categorías
const categoryIcons = {
  'medicamentos': IconPill,
  'cuidado-personal': IconSprayBottle,
  'bebes-ninos': IconBaby,
  'dermocosmeticos': IconFlower,
  'vitaminas': IconOrange,
  'primeros-auxilios': IconFirstAid,
  'default': IconStorefront,
};

/**
 * CategoryCard - Tarjeta individual de categoría
 */
function CategoryCard({ category, variant = 'default' }) {
  const { slug, name, description, image, product_count } = category;
  const Icon = categoryIcons[slug] || categoryIcons.default;

  if (variant === 'compact') {
    return (
      <Link
        href={`/catalogo/${slug}`}
        className="
          flex items-center gap-3 p-3
          bg-white rounded-lg border border-gray-200
          hover:border-brand-blue hover:shadow-md
          transition-all duration-300
        "
      >
        <div className="w-10 h-10 rounded-lg bg-brand-blue-light flex items-center justify-center">
          <Icon className="w-5 h-5 text-brand-blue" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{name}</h3>
          {product_count > 0 && (
            <p className="text-xs text-gray-500">{product_count} productos</p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/catalogo/${slug}`}
      className="
        group relative block overflow-hidden
        bg-white rounded-xl border border-gray-200
        hover:border-brand-blue hover:shadow-lg
        transition-all duration-300
      "
    >
      {/* Image or gradient background */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-brand-blue-light to-brand-green-light">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-16 h-16 text-brand-blue/60" />
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-brand-blue/0 group-hover:bg-brand-blue/10 transition-colors" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-blue transition-colors">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
        )}
        {product_count > 0 && (
          <p className="text-xs text-brand-blue mt-2 font-medium">
            {product_count} productos disponibles
          </p>
        )}
      </div>
    </Link>
  );
}

/**
 * CategoryGrid - Grilla de categorías
 */
export default function CategoryGrid({
  categories,
  variant = 'default',
  columns = 3,
  className = '',
}) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 lg:gap-6 ${className}`}>
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} variant={variant} />
      ))}
    </div>
  );
}

export { CategoryCard };
