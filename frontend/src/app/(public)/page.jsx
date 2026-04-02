import Link from 'next/link';
import Image from 'next/image';
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

// Imágenes por posición — evita problemas de codificación de acentos
const serviceImagesByIndex = [
  '/img/services/orientacion-farmaceutica.jpg',
  '/img/services/toma-presion-arterial.jpg',
  '/img/services/control-glicemia.jpg',
  '/img/services/inyectologia.jpg',
  '/img/services/domicilios.jpg',
  '/img/services/recargas.jpg',
  '/img/services/pago-servicios.jpg',
];

function getServiceImage(index) {
  return serviceImagesByIndex[index % serviceImagesByIndex.length];
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

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
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

          {/* Cards con imagen */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredServices.length > 0 ? (
              featuredServices.map((service, i) => {
                const Icon = service.icon;
                const img = getServiceImage(i);
                return (
                  <Link
                    key={service.id}
                    href="/servicios"
                    className="group relative block overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Imagen */}
                    <div className="aspect-[4/3] relative overflow-hidden">
                      {img ? (
                        <Image
                          src={img}
                          alt={service.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-light to-brand-green-light" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                      {/* Icono + nombre superpuesto */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-bold text-white text-sm leading-tight drop-shadow-sm line-clamp-2">
                          {service.name}
                        </h3>
                      </div>
                    </div>
                    {/* Descripción */}
                    <div className="p-3 bg-white border-t border-gray-100">
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </Link>
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
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-green">
        {/* Patrón de fondo decorativo */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3Ccircle cx='0' cy='0' r='3'/%3E%3Ccircle cx='80' cy='0' r='3'/%3E%3Ccircle cx='0' cy='80' r='3'/%3E%3Ccircle cx='80' cy='80' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}
        />

        {/* Orbes de luz */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container-app relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill label */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green-light animate-pulse" />
              Atención inmediata
            </span>

            <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
              ¿Necesitas{' '}
              <span className="text-brand-green-light underline decoration-brand-green-light/40 decoration-4 underline-offset-4">
                algo?
              </span>
            </h2>

            <p className="text-white/80 text-lg lg:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              Escríbenos por WhatsApp y te atendemos de inmediato.
              También puedes hacer tu pedido fácilmente a través de Rappi.
            </p>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonLink
                href={whatsappUrl.replace('%20pedido', '')}
                variant="whatsapp"
                size="lg"
                external
                icon={<IconWhatsApp className="w-5 h-5" />}
              >
                Escribir por WhatsApp
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

            {/* Nota de confianza */}
            <p className="mt-8 text-white/50 text-sm">
              Tiempo de respuesta promedio: menos de 5 minutos
            </p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 lg:py-20 bg-gray-50 border-t border-gray-100">
        <div className="container-app">

          {/* Título centrado */}
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Encuéntranos
            </h2>
            <p className="text-gray-500 mt-2 text-sm">Estamos cerca para atenderte cuando nos necesites</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Horarios */}
            <div className="group bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <IconClock className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Horarios de atención</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0 mt-2" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lunes – Sábado</p>
                    <p className="text-sm font-medium text-gray-800">7:30 a.m. – 9:30 p.m.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0 mt-2" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Domingos y Festivos</p>
                    <p className="text-sm font-medium text-gray-800">8:30 a.m. – 8:30 p.m.</p>
                  </div>
                </div>
                {settings.business_hours && (
                  <p className="text-xs text-gray-400 pt-1">{settings.business_hours}</p>
                )}
              </div>
            </div>

            {/* Ubicación */}
            <div className="group bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <IconLocation className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Ubicación</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {settings.address || 'Av. 70 # 79-16, Engativá, Bogotá'}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address || 'Av. 70 79-16 Engativá Bogotá')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Ver en Google Maps
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Contacto */}
            <div className="group bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <IconPhone className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Contáctanos</h3>
              </div>
              <div className="space-y-3">
                {(settings.phone || true) && (
                  <a
                    href={`tel:${(settings.phone || '3134243625').replace(/[^0-9]/g, '')}`}
                    className="flex items-center gap-3 group/link"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <IconPhone className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Teléfono</p>
                      <p className="text-sm font-medium text-gray-800 group-hover/link:text-violet-600 transition-colors">
                        {settings.phone || '313 424 3625'}
                      </p>
                    </div>
                  </a>
                )}
                {(settings.whatsapp_number || true) && (
                  <a
                    href={`https://wa.me/${(settings.whatsapp_number || '573134243625').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group/link"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <IconWhatsApp className="w-4 h-4 text-whatsapp" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">WhatsApp</p>
                      <p className="text-sm font-medium text-gray-800 group-hover/link:text-whatsapp transition-colors">
                        {settings.whatsapp_number || '573 134 243 625'}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
