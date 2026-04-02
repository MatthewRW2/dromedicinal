import Link from 'next/link';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
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
  IconChevronRight,
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

  const isActive = promotion.is_active && today >= startsAt && today <= endsAt;
  const isUpcoming = promotion.is_active && startsAt > today;
  const daysLeft = isActive ? Math.ceil((endsAt - today) / (1000 * 60 * 60 * 24)) : null;
  const productsCount = promotion.products?.length || 0;

  const statusConfig = isActive
    ? { label: 'Activa', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
    : isUpcoming
      ? { label: 'Próximamente', dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700 border-blue-200' }
      : { label: 'Finalizada', dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-500 border-gray-200' };

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Banner */}
      <div className="relative h-40 overflow-hidden flex-shrink-0">
        {promotion.banner_image_path ? (
          <Image
            src={promotion.banner_image_path}
            alt={promotion.title || 'Promoción'}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-green flex items-center justify-center">
            <div className="opacity-10 absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
            <IconOffer className="w-14 h-14 text-white/80" />
          </div>
        )}
        {/* Overlay gradiente inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {/* Badge de estado */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusConfig.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
            {statusConfig.label}
          </span>
        </div>
        {/* Días restantes */}
        {isActive && daysLeft !== null && daysLeft > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-500 text-white px-2.5 py-1 rounded-full">
              <IconClock className="w-3.5 h-3.5" />
              {daysLeft} {daysLeft === 1 ? 'día' : 'días'} restantes
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-blue transition-colors">
          {promotion.title}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-2">
          {promotion.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-5 border-t border-gray-50 pt-4">
          <span className="flex items-center gap-1.5">
            <IconPackage className="w-3.5 h-3.5" />
            {productsCount} producto{productsCount !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <IconCalendar className="w-3.5 h-3.5" />
            {new Date(promotion.ends_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
          </span>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <Link
            href={`/promociones/${promotion.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-blue text-white text-sm font-semibold rounded-xl hover:bg-brand-blue-dark transition-colors"
          >
            Ver productos
            <IconChevronRight className="w-4 h-4" />
          </Link>
          <a
            href={`https://wa.me/${whatsappNumber}?text=Hola%20Dromedicinal%2C%20quiero%20información%20sobre%20la%20promoción%20${encodeURIComponent(promotion.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-whatsapp text-white rounded-xl hover:bg-whatsapp-dark transition-colors flex items-center justify-center flex-shrink-0"
            aria-label={`Consultar promoción ${promotion.title} por WhatsApp`}
          >
            <IconMessage className="w-4 h-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default async function PromocionesPage() {
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
  }

  const today = new Date();

  const activePromotions = promotions.filter((p) => {
    if (!p.is_active) return false;
    return today >= new Date(p.starts_at) && today <= new Date(p.ends_at);
  });

  const upcomingPromotions = promotions.filter((p) => {
    if (!p.is_active) return false;
    return new Date(p.starts_at) > today;
  });

  const whatsappNumber = (settings.whatsapp_number || '573134243625').replace(/[^0-9]/g, '');
  const totalPromos = activePromotions.length + upcomingPromotions.length;

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-green overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-brand-green/20 rounded-full blur-3xl pointer-events-none" />
        <div className="container-app relative py-16 lg:py-20 text-center text-white">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            <IconOffer className="w-4 h-4" />
            Ofertas especiales
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Promociones y Ofertas</h1>
          <p className="text-white/80 max-w-xl mx-auto text-lg">
            Aprovecha nuestras promociones en medicamentos, cuidado personal y más. ¡Ahorra cuidando tu salud!
          </p>
          {totalPromos > 0 && (
            <p className="mt-4 text-white/60 text-sm">
              {activePromotions.length > 0 && (
                <span className="font-semibold text-brand-green-light">{activePromotions.length} activa{activePromotions.length !== 1 ? 's' : ''}</span>
              )}
              {activePromotions.length > 0 && upcomingPromotions.length > 0 && ' · '}
              {upcomingPromotions.length > 0 && (
                <span>{upcomingPromotions.length} próxima{upcomingPromotions.length !== 1 ? 's' : ''}</span>
              )}
            </p>
          )}
        </div>
      </section>

      <div className="container-app py-12 lg:py-16 space-y-14">

        {/* Promociones activas */}
        {activePromotions.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-7">
              <span className="w-2 h-8 rounded-full bg-emerald-500" />
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <IconOffer className="w-5 h-5 text-emerald-500" />
                Promociones activas
              </h2>
              <span className="ml-auto text-sm font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {activePromotions.length}
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePromotions.map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} whatsappNumber={whatsappNumber} />
              ))}
            </div>
          </section>
        )}

        {/* Próximas promociones */}
        {upcomingPromotions.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-7">
              <span className="w-2 h-8 rounded-full bg-brand-blue" />
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <IconCalendar className="w-5 h-5 text-brand-blue" />
                Próximas promociones
              </h2>
              <span className="ml-auto text-sm font-semibold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                {upcomingPromotions.length}
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingPromotions.map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} whatsappNumber={whatsappNumber} />
              ))}
            </div>
          </section>
        )}

        {/* Sin promociones */}
        {totalPromos === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <IconOffer className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Sin promociones activas</h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Actualmente no tenemos promociones activas, pero puedes escribirnos para conocer nuestros precios especiales.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hola%20Dromedicinal%2C%20%C2%BFtienen%20alguna%20promoci%C3%B3n%20disponible%3F`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-whatsapp text-white font-semibold px-6 py-3 rounded-xl hover:bg-whatsapp-dark transition-colors"
            >
              <IconWhatsApp className="w-5 h-5" />
              Consultar por WhatsApp
            </a>
          </div>
        )}

        {/* CTA inferior */}
        <div className="relative bg-gradient-to-br from-brand-blue to-brand-green rounded-2xl p-8 lg:p-10 text-white overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-white/5 rounded-full" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold mb-1">¿No quieres perderte ninguna oferta?</h2>
              <p className="text-white/75 text-sm">
                Síguenos en redes o escríbenos por WhatsApp para estar al tanto de todas nuestras promociones.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hola%20Dromedicinal%2C%20quiero%20recibir%20información%20de%20promociones`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-whatsapp text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-whatsapp-dark transition-colors"
              >
                <IconWhatsApp className="w-4 h-4" />
                WhatsApp
              </a>
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/25 transition-colors"
                >
                  <IconInstagram className="w-4 h-4" />
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

