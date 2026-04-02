import Image from 'next/image';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { ButtonLink } from '@/components/ui/Button';
import { publicAPI } from '@/lib/api';
import { getSettings } from '@/lib/settings';
import {
  IconWhatsApp,
  IconSyringe,
  IconHeartbeat,
  IconDrop,
  IconTruck,
  IconBeaker,
  IconClipboard,
  IconCheckCircle,
  IconLocation,
  IconPill,
} from '@/components/icons';

export const metadata = generateSEOMetadata({
  title: 'Servicios',
  description: 'Conoce nuestros servicios de salud: inyectología, toma de tensión, glicemia, domicilios y más. Atención profesional y personalizada.',
  path: '/servicios',
});

// Configuración por posición (sort_order BD: 1=asesoría, 2=presión, 3=glicemia, 4=inyecto, 5=domicilios, 6=recargas, 7=pago)
// Usar índice evita problemas de codificación de caracteres acentuados
const servicesByIndex = [
  { image: '/img/services/orientacion-farmaceutica.jpg', accent: 'bg-brand-blue',  badge: 'bg-blue-100 text-brand-blue',     iconBg: 'bg-blue-50',    iconColor: 'text-brand-blue',  icon: IconBeaker   },
  { image: '/img/services/toma-presion-arterial.jpg',   accent: 'bg-rose-500',    badge: 'bg-rose-100 text-rose-600',       iconBg: 'bg-rose-50',    iconColor: 'text-rose-500',    icon: IconHeartbeat },
  { image: '/img/services/control-glicemia.jpg',        accent: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', icon: IconDrop      },
  { image: '/img/services/inyectologia.jpg',            accent: 'bg-violet-500',  badge: 'bg-violet-100 text-violet-700',   iconBg: 'bg-violet-50',  iconColor: 'text-violet-600',  icon: IconSyringe   },
  { image: '/img/services/domicilios.jpg',              accent: 'bg-amber-500',   badge: 'bg-amber-100 text-amber-700',     iconBg: 'bg-amber-50',   iconColor: 'text-amber-600',   icon: IconTruck     },
  { image: '/img/services/recargas.jpg',                accent: 'bg-sky-500',     badge: 'bg-sky-100 text-sky-700',         iconBg: 'bg-sky-50',     iconColor: 'text-sky-600',     icon: IconPill      },
  { image: '/img/services/pago-servicios.jpg',          accent: 'bg-teal-500',    badge: 'bg-teal-100 text-teal-700',       iconBg: 'bg-teal-50',    iconColor: 'text-teal-600',    icon: IconClipboard },
];

function getServiceData(index) {
  return servicesByIndex[index % servicesByIndex.length];
}

export default async function ServiciosPage() {
  let services = [];
  let settings = {};

  try {
    const [servicesRes, settingsData] = await Promise.all([
      publicAPI.getServices(),
      getSettings(),
    ]);
    services = servicesRes.data || [];
    settings = settingsData || {};
    services.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error cargando servicios:', error);
  }

  const whatsappNumber = (settings.whatsapp_number || '573134243625').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola%20Dromedicinal%2C%20quiero%20informaci%C3%B3n%20sobre%20un%20servicio`;

  return (
    <div className="py-8 lg:py-14">
      <div className="container-app">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-blue mb-3">
            Lo que hacemos por ti
          </span>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Nuestros Servicios
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-base lg:text-lg">
            Más que una droguería, somos tu aliado en el cuidado de tu salud.
            Conoce todos los servicios que tenemos para ti.
          </p>
        </div>

        {/* ── Grid de servicios ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {services.length > 0 ? (
            services.map((service, i) => {
              const { image, accent, badge, iconBg, iconColor, icon: Icon } = getServiceData(i);
              const features = service.features || [];

              return (
                <article
                  key={service.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100"
                >
                  {/* Imagen */}
                  <div className="aspect-[16/9] relative overflow-hidden">
                    {image ? (
                      <Image
                        src={image}
                        alt={service.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-light to-brand-green-light" />
                    )}
                    {/* Degradado para legibilidad */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Badge de número sobre la imagen */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shadow ${badge}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Icono + nombre superpuesto (igual que CategoryCard) */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="font-bold text-white text-base leading-tight drop-shadow-sm">
                        {service.name}
                      </h2>
                    </div>
                  </div>

                  {/* Barra de acento */}
                  <div className={`h-1 w-full ${accent}`} />

                  {/* Contenido */}
                  <div className="p-5">
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {features.length > 0 && (
                      <ul className="space-y-1.5">
                        {features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-500">
                            <IconCheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-400 py-12">
              No hay servicios disponibles en este momento.
            </div>
          )}
        </div>

        {/* ── CTA ── */}
        <div className="mt-14 relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-green p-10 text-center">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-brand-green/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
              ¿Necesitas alguno de nuestros servicios?
            </h2>
            <p className="text-white/80 mb-7 max-w-xl mx-auto text-sm lg:text-base">
              Escríbenos por WhatsApp o visítanos en nuestra droguería.
              Estamos listos para atenderte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonLink
                href={whatsappUrl}
                variant="whatsapp"
                size="lg"
                external
                icon={<IconWhatsApp className="w-5 h-5" />}
              >
                Contactar por WhatsApp
              </ButtonLink>
              <ButtonLink
                href="/contacto"
                size="lg"
                className="bg-white text-brand-blue hover:bg-gray-100"
                icon={<IconLocation className="w-5 h-5" />}
              >
                Ver ubicación
              </ButtonLink>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
