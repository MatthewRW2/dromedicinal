import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { CategoryGrid } from '@/components/catalogo';
import { publicAPI } from '@/lib/api';
import { getSettings } from '@/lib/settings';
import {
  IconWhatsApp,
  IconRappi,
  IconLocation,
  IconClock,
  IconPhone,
  IconPill,
  IconSyringe,
  IconHeartbeat,
  IconDrop,
  IconTruck,
  IconStorefront,
  IconBeaker,
  IconClipboard,
} from '@/components/icons';

// Mapeo de iconos por nombre exacto de servicio (según BD)
const serviceIconMap = {
  'orientación farmacéutica': IconBeaker,
  'orientacion farmaceutica': IconBeaker,
  'toma de presión arterial': IconHeartbeat,
  'toma de presion arterial': IconHeartbeat,
  'toma de tensión': IconHeartbeat,
  'toma de tension': IconHeartbeat,
  'control de glicemia': IconDrop,
  'glicemia': IconDrop,
  'inyectología': IconSyringe,
  'inyectologia': IconSyringe,
  'domicilios': IconTruck,
  'recargas': IconPill,
  'pago de servicios': IconClipboard,
  'asesoría': IconBeaker,
  'asesoria': IconBeaker,
};

function getServiceIcon(name) {
  const key = (name || '').toLowerCase();
  if (serviceIconMap[key]) return serviceIconMap[key];
  // Coincidencia parcial como fallback
  for (const [mapKey, icon] of Object.entries(serviceIconMap)) {
    if (key.includes(mapKey) || mapKey.includes(key)) return icon;
  }
  return IconBeaker;
}

// Paleta de colores por índice de servicio
const serviceColors = [
  {
    accentBar: 'bg-brand-blue',
    badge: 'bg-blue-100 text-brand-blue',
    iconBg: 'bg-blue-50',
    iconColor: 'text-brand-blue',
    ring: 'ring-blue-100',
  },
  {
    accentBar: 'bg-rose-500',
    badge: 'bg-rose-100 text-rose-600',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
    ring: 'ring-rose-100',
  },
  {
    accentBar: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    ring: 'ring-emerald-100',
  },
  {
    accentBar: 'bg-violet-500',
    badge: 'bg-violet-100 text-violet-700',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    ring: 'ring-violet-100',
  },
];

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

  // Tomar primeras 6 categorías como destacadas (objetos completos para CategoryGrid)
  const featuredCategories = categories.slice(0, 6);

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
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Explora nuestro catálogo
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Encuentra todo lo que necesitas para el cuidado de tu salud y bienestar
            </p>
          </div>

          <CategoryGrid categories={featuredCategories} columns={3} />

          <div className="text-center mt-10">
            <ButtonLink href="/catalogo" variant="outline" size="lg">
              Ver todo el catálogo
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-app">

          {/* Header — alineado izquierda con CTA a la derecha */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-blue mb-3">
                Servicios de salud
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Más que una droguería
              </h2>
              <p className="text-gray-500 mt-2 max-w-lg text-base">
                Somos tu aliado en el cuidado de tu salud, con atención profesional y cercana.
              </p>
            </div>
            <div className="flex-shrink-0">
              <ButtonLink href="/servicios" variant="outline" size="md">
                Ver todos los servicios →
              </ButtonLink>
            </div>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.length > 0 ? (
              featuredServices.map((service, i) => {
                const Icon = service.icon;
                const colors = serviceColors[i % serviceColors.length];
                return (
                  <div
                    key={service.id}
                    className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Barra de acento superior */}
                    <div className={`h-1 w-full ${colors.accentBar}`} />

                    <div className="p-6 pt-5">
                      {/* Número de orden */}
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mb-5 ${colors.badge}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      {/* Icono grande */}
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${colors.iconBg} ring-4 ${colors.ring}`}>
                        <Icon className={`w-8 h-8 ${colors.iconColor}`} />
                      </div>

                      {/* Texto */}
                      <h3 className="font-bold text-gray-900 mb-2 text-base leading-snug">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center text-gray-400 py-12">
                No hay servicios disponibles en este momento.
              </div>
            )}
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
