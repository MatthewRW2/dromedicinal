import Link from 'next/link';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import Badge from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import {
  IconWhatsApp,
  IconInstagram,
  IconOffer,
  IconClock,
  IconPackage,
  IconMessage,
  IconCalendar,
} from '@/components/icons';

export const metadata = generateSEOMetadata({
  title: 'Promociones',
  description: 'Descubre nuestras promociones y ofertas especiales en medicamentos y productos de salud. ¡Aprovecha los mejores precios!',
  path: '/promociones',
});

// Mock data - En producción vendría de la API
const promotions = [
  {
    id: 1,
    slug: 'navidad-2024',
    title: 'Navidad Saludable 2024',
    description: 'Descuentos especiales en productos de cuidado personal, vitaminas y suplementos para que termines el año con la mejor energía.',
    starts_at: '2024-12-01',
    ends_at: '2024-12-31',
    is_active: true,
    banner_color: 'from-red-500 to-green-600',
    products_count: 25,
  },
  {
    id: 2,
    slug: 'cuidado-piel-verano',
    title: 'Cuida tu Piel este Verano',
    description: 'Protectores solares, hidratantes y productos dermatológicos con descuentos del 15% al 30%.',
    starts_at: '2024-12-15',
    ends_at: '2025-01-31',
    is_active: true,
    banner_color: 'from-amber-400 to-orange-500',
    products_count: 18,
  },
  {
    id: 3,
    slug: 'vuelta-clases-2025',
    title: 'Vuelta a Clases 2025',
    description: 'Preparamos a tus hijos para el nuevo año escolar. Vitaminas, antigripales y productos para niños con precios especiales.',
    starts_at: '2025-01-15',
    ends_at: '2025-02-15',
    is_active: false,
    banner_color: 'from-blue-500 to-purple-600',
    products_count: 20,
  },
];

function PromotionCard({ promotion }) {
  const isActive = promotion.is_active;
  const endDate = new Date(promotion.ends_at);
  const today = new Date();
  const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Banner */}
      <div className={`h-32 bg-gradient-to-r ${promotion.banner_color} flex items-center justify-center`}>
        <IconOffer className="w-16 h-16 text-white/90" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-xl font-semibold text-gray-900">{promotion.title}</h2>
          {isActive ? (
            <Badge variant="success" size="sm">Activa</Badge>
          ) : (
            <Badge variant="default" size="sm">Próximamente</Badge>
          )}
        </div>

        <p className="text-gray-600 mb-4">{promotion.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <IconPackage className="w-4 h-4" />
            {promotion.products_count} productos
          </span>
          {isActive && daysLeft > 0 && (
            <span className="flex items-center gap-1 text-brand-orange font-medium">
              <IconClock className="w-4 h-4" />
              {daysLeft} días restantes
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            href={`/promociones/${promotion.slug}`}
            className="flex-1 text-center px-4 py-2 bg-brand-blue text-white font-medium rounded-lg hover:bg-brand-blue-dark transition-colors"
          >
            Ver productos
          </Link>
          <a
            href={`https://wa.me/573001234567?text=Hola%20Dromedicinal%2C%20quiero%20información%20sobre%20la%20promoción%20${encodeURIComponent(promotion.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-whatsapp text-white font-medium rounded-lg hover:bg-whatsapp-dark transition-colors flex items-center justify-center"
            aria-label={`Consultar promoción ${promotion.title} por WhatsApp`}
          >
            <IconMessage className="w-5 h-5" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function PromocionesPage() {
  const activePromotions = promotions.filter((p) => p.is_active);
  const upcomingPromotions = promotions.filter((p) => !p.is_active);

  return (
    <div className="py-8 lg:py-12">
      <div className="container-app">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Promociones y Ofertas
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Aprovecha nuestras promociones especiales en medicamentos, 
            productos de cuidado personal y más. ¡Ahorra cuidando tu salud!
          </p>
        </div>

        {/* Active promotions */}
        {activePromotions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <IconOffer className="w-6 h-6 text-brand-orange" />
              Promociones Activas
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePromotions.map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming promotions */}
        {upcomingPromotions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <IconCalendar className="w-6 h-6 text-brand-blue" />
              Próximas Promociones
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingPromotions.map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <div className="bg-brand-blue-light rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            ¿No quieres perderte ninguna promoción?
          </h2>
          <p className="text-gray-600 mb-4">
            Síguenos en redes sociales o escríbenos por WhatsApp para estar al tanto de todas nuestras ofertas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonLink
              href="https://wa.me/573001234567?text=Hola%20Dromedicinal%2C%20quiero%20recibir%20información%20de%20promociones"
              variant="whatsapp"
              external
              icon={<IconWhatsApp className="w-5 h-5" />}
            >
              Recibir ofertas por WhatsApp
            </ButtonLink>
            <ButtonLink
              href="https://instagram.com/dromedicinal"
              variant="outline"
              external
              icon={<IconInstagram className="w-5 h-5" />}
            >
              Seguir en Instagram
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
