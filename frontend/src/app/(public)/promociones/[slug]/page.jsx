import { notFound } from 'next/navigation';
import Link from 'next/link';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { ProductCard } from '@/components/catalogo';
import { ButtonLink } from '@/components/ui/Button';
import { publicAPI } from '@/lib/api';
import { getSettings } from '@/lib/settings';
import { IconWhatsApp, IconRappi, IconClock, IconPackage, IconChevronRight, IconOffer } from '@/components/icons';
import Image from 'next/image';

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const res = await publicAPI.getPromotions();
    const promotions = Array.isArray(res?.data) ? res.data : [];
    const slugs = promotions.filter((p) => p?.slug).map((p) => ({ slug: String(p.slug) }));
    return slugs.length > 0 ? slugs : [{ slug: '_' }];
  } catch {
    return [{ slug: '_' }];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const response = await publicAPI.getPromotion(slug);
    const promotion = response.data;
    if (!promotion) return { title: 'Promoción no encontrada' };
    return generateSEOMetadata({
      title: promotion.title,
      description: promotion.description || `Descubre los productos en promoción: ${promotion.title}`,
      path: `/promociones/${slug}`,
    });
  } catch {
    return { title: 'Promoción no encontrada' };
  }
}

export default async function PromotionDetailPage({ params }) {
  const { slug } = await params;

  let promotion = null;
  let settings = {};

  try {
    const [promotionRes, settingsData] = await Promise.all([
      publicAPI.getPromotion(slug),
      getSettings(),
    ]);
    promotion = promotionRes.data;
    settings = settingsData || {};
  } catch {
    notFound();
  }

  if (!promotion) notFound();

  const today = new Date();
  const startsAt = new Date(promotion.starts_at);
  const endsAt = new Date(promotion.ends_at);

  const isActive = promotion.is_active && today >= startsAt && today <= endsAt;
  const isUpcoming = promotion.is_active && startsAt > today;
  const daysLeft = isActive ? Math.ceil((endsAt - today) / (1000 * 60 * 60 * 24)) : null;
  const products = promotion.products || [];

  const whatsappNumber = (settings.whatsapp_number || '573134243625').replace(/[^0-9]/g, '');
  const rappiUrl = settings.rappi_url || '#';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hola%20Dromedicinal%2C%20quiero%20información%20sobre%20la%20promoción%20${encodeURIComponent(promotion.title)}`;

  const statusConfig = isActive
    ? { label: 'Activa', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' }
    : isUpcoming
      ? { label: 'Próximamente', badge: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' }
      : { label: 'Finalizada', badge: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400' };

  return (
    <div>
      {/* ── Banner hero ── */}
      <section className="relative overflow-hidden">
        {promotion.banner_image_path ? (
          <div className="relative h-64 lg:h-80">
            <Image
              src={promotion.banner_image_path}
              alt={promotion.title || 'Promoción'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ) : (
          <div className="relative h-52 lg:h-64 bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-green overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-green/20 rounded-full blur-2xl" />
            <div className="flex items-center justify-center h-full">
              <IconOffer className="w-20 h-20 text-white/70" />
            </div>
          </div>
        )}
      </section>

      <div className="container-app py-10 lg:py-14">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link href="/" className="hover:text-brand-blue transition-colors">Inicio</Link></li>
            <li><IconChevronRight className="w-3.5 h-3.5" /></li>
            <li><Link href="/promociones" className="hover:text-brand-blue transition-colors">Promociones</Link></li>
            <li><IconChevronRight className="w-3.5 h-3.5" /></li>
            <li className="text-gray-900 font-medium truncate max-w-[200px]">{promotion.title}</li>
          </ol>
        </nav>

        {/* Header de la promo */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 mb-8">
          <div className="flex flex-wrap items-start gap-4 mb-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex-1">{promotion.title}</h1>
            <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border ${statusConfig.badge}`}>
              <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
              {statusConfig.label}
            </span>
          </div>

          {promotion.description && (
            <p className="text-gray-600 leading-relaxed mb-6">{promotion.description}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 pb-6 border-b border-gray-100">
            <span className="flex items-center gap-2">
              <IconClock className="w-4 h-4" />
              {new Date(promotion.starts_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
              {' — '}
              {new Date(promotion.ends_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <IconPackage className="w-4 h-4" />
              {products.length} producto{products.length !== 1 ? 's' : ''}
            </span>
            {isActive && daysLeft !== null && daysLeft > 0 && (
              <span className="flex items-center gap-1.5 font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                <IconClock className="w-3.5 h-3.5" />
                {daysLeft} {daysLeft === 1 ? 'día' : 'días'} restantes
              </span>
            )}
          </div>

          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-5">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-semibold px-5 py-3 rounded-xl hover:bg-whatsapp-dark transition-colors"
            >
              <IconWhatsApp className="w-5 h-5" />
              Consultar por WhatsApp
            </a>
            {rappiUrl && rappiUrl !== '#' && (
              <a
                href={rappiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FF441F] text-white font-semibold px-5 py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                <IconRappi className="w-5 h-5" />
                Ver en Rappi
              </a>
            )}
          </div>
        </div>

        {/* Grid de productos */}
        {products.length > 0 ? (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full bg-brand-blue" />
              Productos en esta promoción
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconPackage className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-1">Sin productos asociados</p>
            <p className="text-gray-400 text-sm">Esta promoción aún no tiene productos vinculados.</p>
          </div>
        )}
      </div>
    </div>
  );
}



