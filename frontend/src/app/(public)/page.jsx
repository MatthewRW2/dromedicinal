import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { publicAPI } from '@/lib/api';
import { getSettings } from '@/lib/settings';
import {
  IconWhatsApp,
  IconRappi,
  IconLocation,
  IconClock,
  IconPhone,
  IconPill,
  IconSprayBottle,
  IconBaby,
  IconFlower,
  IconOrange,
  IconFirstAid,
  IconSyringe,
  IconHeartbeat,
  IconDrop,
  IconTruck,
  IconStorefront,
  IconBeaker,
  IconClipboard,
} from '@/components/icons';

// Mapeo de iconos por nombre/slug de categoría
const categoryIconMap = {
  'medicamentos': IconPill,
  'medicamento': IconPill,
  'cuidado-personal': IconSprayBottle,
  'cuidado personal': IconSprayBottle,
  'bebes-ninos': IconBaby,
  'bebés y niños': IconBaby,
  'bebes y ninos': IconBaby,
  'dermocosmeticos': IconFlower,
  'dermocosméticos': IconFlower,
  'vitaminas': IconOrange,
  'vitamina': IconOrange,
  'primeros-auxilios': IconFirstAid,
  'primeros auxilios': IconFirstAid,
};

// Mapeo de iconos por nombre de servicio
const serviceIconMap = {
  'inyectologia': IconSyringe,
  'inyectología': IconSyringe,
  'toma de tension': IconHeartbeat,
  'toma de tensión': IconHeartbeat,
  'glicemia': IconDrop,
  'domicilios': IconTruck,
  'asesoria': IconBeaker,
  'asesoría': IconBeaker,
  'pedidos especiales': IconClipboard,
};

function getCategoryIcon(name, slug) {
  const key = (slug || name || '').toLowerCase();
  return categoryIconMap[key] || IconPill;
}

function getServiceIcon(name) {
  const key = (name || '').toLowerCase();
  return serviceIconMap[key] || IconBeaker;
}

export default async function HomePage() {
  // Obtener datos de la API
  let categories = [];
  let services = [];
  let settings = {};

  try {
    const [categoriesRes, servicesRes, settingsData] = await Promise.all([
      publicAPI.getCategories(),
      publicAPI.getServices(),
      getSettings(),
    ]);

    categories = categoriesRes.data || [];
    services = servicesRes.data || [];
    settings = settingsData || {};
  } catch (error) {
    console.error('Error cargando datos de inicio:', error);
    // Continuar con arrays vacíos, se mostrarán mensajes apropiados
  }

  // Tomar primeras 6 categorías como destacadas
  const featuredCategories = categories.slice(0, 6).map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: getCategoryIcon(cat.name, cat.slug),
    count: cat.product_count || 0,
  }));

  // Tomar primeros 4 servicios como destacados
  const featuredServices = services.slice(0, 4).map(service => ({
    id: service.id,
    name: service.name,
    description: service.description || '',
    icon: getServiceIcon(service.name),
  }));

  // Construir URLs de WhatsApp y Rappi
  const whatsappNumber = settings.whatsapp_number || '573134243625';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hola%20Dromedicinal%2C%20quiero%20hacer%20un%20pedido`;
  const rappiUrl = settings.rappi_url || '#';

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-green overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-app relative py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-white">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
                Tu droguería de
                <span className="block text-brand-green-light">confianza</span>
              </h1>
              <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-lg">
                Medicamentos, productos de cuidado personal y servicios de salud 
                con atención personalizada. ¡Estamos para cuidarte!
              </p>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <ButtonLink
                  href={whatsappUrl}
                  variant="whatsapp"
                  size="lg"
                  external
                  icon={<IconWhatsApp className="w-5 h-5" />}
                >
                  Pedir por WhatsApp
                </ButtonLink>
                <ButtonLink
                  href={rappiUrl}
                  variant="rappi"
                  size="lg"
                  external
                  icon={<IconRappi className="w-5 h-5" />}
                >
                  Pedir en Rappi
                </ButtonLink>
              </div>

              {/* Quick info */}
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/80">
                {settings.address && (
                  <div className="flex items-center gap-2">
                    <IconLocation className="w-4 h-4" />
                    <span>{settings.address}</span>
                  </div>
                )}
                {settings.business_hours && (
                  <div className="flex items-center gap-2">
                    <IconClock className="w-4 h-4" />
                    <span>{settings.business_hours}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hero image/illustration */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-80 h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-60 h-60 bg-white/20 rounded-full flex items-center justify-center">
                  <IconStorefront className="w-32 h-32 text-white/90" />
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                  <IconPill className="w-8 h-8 text-brand-blue" />
                </div>
                <div className="absolute -bottom-2 -left-6 w-14 h-14 bg-brand-green rounded-xl flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                  <IconHeartbeat className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Explora nuestro catálogo
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Encuentra todo lo que necesitas para el cuidado de tu salud y bienestar
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {featuredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  href={`/catalogo/${category.slug}`}
                  className="
                    group bg-white rounded-xl p-6
                    border border-gray-200
                    hover:border-brand-blue hover:shadow-lg
                    transition-all duration-300
                    text-center
                  "
                >
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-brand-blue-light flex items-center justify-center group-hover:bg-brand-blue transition-colors">
                    <Icon className="w-7 h-7 text-brand-blue group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-blue transition-colors text-sm lg:text-base">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{category.count} productos</p>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <ButtonLink href="/catalogo" variant="outline" size="lg">
              Ver todo el catálogo
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-20">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nuestros servicios
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Más que una droguería, somos tu aliado en el cuidado de tu salud
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.length > 0 ? (
              featuredServices.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.id}
                    className="
                      bg-white rounded-xl p-6
                      border border-gray-200
                      hover:shadow-lg
                      transition-all duration-300
                    "
                  >
                    <div className="w-12 h-12 rounded-lg bg-brand-green-light flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-brand-green" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                No hay servicios disponibles en este momento.
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <ButtonLink href="/servicios" variant="primary" size="lg">
              Conocer más servicios
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-blue">
        <div className="container-app text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            ¿Necesitas algo?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
            Escríbenos por WhatsApp y te atendemos de inmediato. 
            También puedes pedir a través de Rappi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonLink
              href={whatsappUrl.replace('%20pedido', '')}
              variant="whatsapp"
              size="lg"
              external
              icon={<IconWhatsApp className="w-5 h-5" />}
            >
              WhatsApp
            </ButtonLink>
            <ButtonLink
              href={rappiUrl}
              variant="rappi"
              size="lg"
              external
              icon={<IconRappi className="w-5 h-5" />}
            >
              Rappi
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container-app">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Horarios */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
                <IconClock className="w-8 h-8 text-brand-blue" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Horarios de atención</h3>
              <p className="text-gray-600 text-sm">
                {settings.business_hours || 'Lunes a Sábado: 7:00 AM - 9:00 PM\nDomingos y Festivos: 8:00 AM - 2:00 PM'}
              </p>
            </div>

            {/* Ubicación */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-green-light rounded-full flex items-center justify-center mx-auto mb-4">
                <IconLocation className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ubicación</h3>
              <p className="text-gray-600 text-sm">
                {settings.address || 'Av. 70 # 79-16, Engativá, Bogotá, Cundinamarca'}
              </p>
            </div>

            {/* Contacto */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-orange-light rounded-full flex items-center justify-center mx-auto mb-4">
                <IconPhone className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Contáctanos</h3>
              <p className="text-gray-600 text-sm">
                {settings.phone && `Teléfono: ${settings.phone}`}
                {settings.phone && settings.whatsapp_number && <br />}
                {settings.whatsapp_number && `WhatsApp: ${settings.whatsapp_number}`}
                {!settings.phone && !settings.whatsapp_number && 'Contacto disponible'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
