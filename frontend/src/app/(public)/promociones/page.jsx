import Link from 'next/link';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import Badge from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { publicAPI } from '@/lib/api';
import { getSettings } from '@/lib/settings';
import {
  IconWhatsApp,
  IconInstagram,
  IconOffer,
  IconClock,
  IconPackage,
  IconMessage,
  IconCalendar,
} from '@/components/icons';
import Image from 'next/image';

export const metadata = generateSEOMetadata({
  title: 'Promociones',
  description: 'Descubre nuestras promociones y ofertas especiales en medicamentos y productos de salud. ¡Aprovecha los mejores precios!',
  path: '/promociones',
});

function PromotionCard({ promotion, whatsappNumber }) {
  const today = new Date();
  const startsAt = new Date(promotion.starts_at);
  const endsAt = new Date(promotion.ends_at);
  
  // Determinar estado: activa si está entre fechas, próxima si starts_at > hoy
  const isActive = promotion.is_active && today >= startsAt && today <= endsAt;
  const isUpcoming = promotion.is_active && startsAt > today;
  const daysLeft = isActive ? Math.ceil((endsAt - today) / (1000 * 60 * 60 * 24)) : null;
  const productsCount = promotion.products?.length || 0;

  // Banner: usar imagen si existe, sino gradiente por defecto
  const bannerColor = 'from-brand-blue to-brand-green';
  const hasBannerImage = promotion.banner_image_path;

  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Banner */}
      <div className={`h-32 bg-gradient-to-r ${bannerColor} flex items-center justify-center relative overflow-hidden`}>
        {hasBannerImage ? (
          <Image
            src={promotion.banner_image_path}
            alt={promotion.title}
            fill
            className="object-cover"
          />
        ) : (
          <IconOffer className="w-16 h-16 text-white/90" />
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-xl font-semibold text-gray-900">{promotion.title}</h2>
          {isActive ? (
            <Badge variant="success" size="sm">Activa</Badge>
          ) : isUpcoming ? (
            <Badge variant="info" size="sm">Próximamente</Badge>
          ) : (
            <Badge variant="default" size="sm">Finalizada</Badge>
          )}
        </div>

        <p className="text-gray-600 mb-4">{promotion.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <IconPackage className="w-4 h-4" />
            {productsCount} productos
          </span>
          {isActive && daysLeft !== null && daysLeft > 0 && (
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
            href={`https://wa.me/${whatsappNumber}?text=Hola%20Dromedicinal%2C%20quiero%20información%20sobre%20la%20promoción%20${encodeURIComponent(promotion.title)}`}
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

export default async function PromocionesPage() {
  // Obtener promociones de la API
  let promotions = [];
  let settings = {};

  try {
    const [promotionsRes, settingsData] = await Promise.all([
      publicAPI.getPromotions(),
      getSettings(),
    ]);

    promotions = promotionsRes.data || [];
    settings = settingsData || {};
  } catch (error) {
    console.error('Error cargando promociones:', error);
    // Continuar con array vacío
  }

  const today = new Date();
  
  // Filtrar promociones activas y próximas
  const activePromotions = promotions.filter((p) => {
    if (!p.is_active) return false;
    const startsAt = new Date(p.starts_at);
    const endsAt = new Date(p.ends_at);
    return today >= startsAt && today <= endsAt;
  });

  const upcomingPromotions = promotions.filter((p) => {
    if (!p.is_active) return false;
    const startsAt = new Date(p.starts_at);
    return startsAt > today;
  });

  const whatsappNumber = (settings.whatsapp_number || '573001234567').replace(/[^0-9]/g, '');

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
                <PromotionCard key={promotion.id} promotion={promotion} whatsappNumber={whatsappNumber} />
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
                <PromotionCard key={promotion.id} promotion={promotion} whatsappNumber={whatsappNumber} />
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
              href={`https://wa.me/${whatsappNumber}?text=Hola%20Dromedicinal%2C%20quiero%20recibir%20información%20de%20promociones`}
              variant="whatsapp"
              external
              icon={<IconWhatsApp className="w-5 h-5" />}
            >
              Recibir ofertas por WhatsApp
            </ButtonLink>
            {settings.instagram_url && (
              <ButtonLink
                href={settings.instagram_url}
                variant="outline"
                external
                icon={<IconInstagram className="w-5 h-5" />}
              >
                Seguir en Instagram
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
