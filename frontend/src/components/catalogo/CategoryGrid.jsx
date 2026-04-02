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

// Imágenes de stock locales por slug de categoría
const categoryStockImages = {
  'medicamentos':     '/img/categories/medicamentos.jpg',
  'cuidado-personal': '/img/categories/cuidado-personal.jpg',
  'bebes-ninos':      '/img/categories/bebes-ninos.jpg',
  'dermocosmeticos':  '/img/categories/dermocosmeticos.jpg',
  'vitaminas':        '/img/categories/vitaminas.jpg',
  'primeros-auxilios':'/img/categories/primeros-auxilios.jpg',
};

/**
 * CategoryCard - Tarjeta individual de categoría
 */
function CategoryCard({ category, variant = 'default' }) {
  const { slug, name, description, image, product_count } = category;
  const Icon = categoryIcons[slug] || categoryIcons.default;

  // Prioridad: imagen subida por el admin → imagen de stock → degradado
  const displayImage = image || categoryStockImages[slug] || null;

  if (variant === 'compact') {
    return (
      <Link
        href={`/catalogo/${slug}`}
        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-brand-blue hover:shadow-md transition-all duration-300"
      >
        <div className="w-10 h-10 rounded-lg bg-brand-blue-light flex items-center justify-center flex-shrink-0">
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
      className="group relative block overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Imagen principal */}
      <div className="aspect-[4/3] relative overflow-hidden">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-light to-brand-green-light" />
        )}

        {/* Degradado inferior para legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Nombre e icono superpuestos sobre la imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-white text-base leading-tight drop-shadow-sm">
            {name}
          </h3>
        </div>
      </div>

      {/* Footer con descripción y conteo */}
      <div className="p-3 bg-white border-t border-gray-100">
        {description ? (
          <p className="text-xs text-gray-500 line-clamp-1">{description}</p>
        ) : null}
        <p className="text-xs font-semibold text-brand-blue mt-0.5">
          {product_count > 0 ? `${product_count} productos disponibles` : 'Ver productos →'}
        </p>
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
