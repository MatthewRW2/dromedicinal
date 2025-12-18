import { notFound } from 'next/navigation';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { ProductCard } from '@/components/catalogo';
import { ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { publicAPI } from '@/lib/api';
import { getSettings } from '@/lib/settings';
import { IconWhatsApp, IconRappi, IconClock, IconPackage } from '@/components/icons';
import Image from 'next/image';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const response = await publicAPI.getPromotion(slug);
    const promotion = response.data;
    
    if (!promotion) {
      return { title: 'Promoción no encontrada' };
    }
    
    return generateSEOMetadata({
      title: promotion.title,
      description: promotion.description || `Descubre los productos en promoción: ${promotion.title}`,
      path: `/promociones/${slug}`,
    });
  } catch (error) {
    return { title: 'Promoción no encontrada' };
  }
}

export default async function PromotionDetailPage({ params }) {
  const { slug } = await params;
  
  // Obtener promoción de la API
  let promotion = null;
  let settings = {};

  try {
    const [promotionRes, settingsData] = await Promise.all([
      publicAPI.getPromotion(slug),
      getSettings(),
    ]);

    promotion = promotionRes.data;
    settings = settingsData || {};
  } catch (error) {
    notFound();
  }

  if (!promotion) {
    notFound();
  }

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

  return (
    <div className="py-8 lg:py-12">
      <div className="container-app">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><a href="/" className="hover:text-brand-blue">Inicio</a></li>
            <li>/</li>
            <li><a href="/promociones" className="hover:text-brand-blue">Promociones</a></li>
            <li>/</li>
            <li className="text-gray-900 font-medium truncate">{promotion.title}</li>
          </ol>
        </nav>

        {/* Banner */}
        {promotion.banner_image_path ? (
          <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden mb-8">
            <Image
              src={promotion.banner_image_path}
              alt={promotion.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-32 lg:h-48 bg-gradient-to-r from-brand-blue to-brand-green rounded-2xl flex items-center justify-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white text-center px-4">
              {promotion.title}
            </h1>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{promotion.title}</h1>
            {isActive ? (
              <Badge variant="success" size="md">Activa</Badge>
            ) : isUpcoming ? (
              <Badge variant="info" size="md">Próximamente</Badge>
            ) : (
              <Badge variant="default" size="md">Finalizada</Badge>
            )}
          </div>

          {promotion.description && (
            <p className="text-lg text-gray-600 mb-4">{promotion.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <IconClock className="w-4 h-4" />
              <span>
                {new Date(promotion.starts_at).toLocaleDateString('es-CO', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })} - {new Date(promotion.ends_at).toLocaleDateString('es-CO', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <IconPackage className="w-4 h-4" />
              <span>{products.length} productos</span>
            </span>
            {isActive && daysLeft !== null && daysLeft > 0 && (
              <span className="text-brand-orange font-medium">
                {daysLeft} días restantes
              </span>
            )}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <ButtonLink
            href={whatsappLink}
            variant="whatsapp"
            size="lg"
            external
            icon={<IconWhatsApp className="w-5 h-5" />}
            className="flex-1"
          >
            Consultar por WhatsApp
          </ButtonLink>
          <ButtonLink
            href={rappiUrl}
            variant="rappi"
            size="lg"
            external
            icon={<IconRappi className="w-5 h-5" />}
            className="flex-1"
          >
            Ver en Rappi
          </ButtonLink>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Productos en promoción
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No hay productos asociados a esta promoción</p>
          </div>
        )}
      </div>
    </div>
  );
}

