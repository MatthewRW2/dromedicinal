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
} from '@/components/icons';

export const metadata = generateSEOMetadata({
  title: 'Servicios',
  description: 'Conoce nuestros servicios de salud: inyectología, toma de tensión, glicemia, domicilios y más. Atención profesional y personalizada.',
  path: '/servicios',
});

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

function getServiceIcon(name) {
  const key = (name || '').toLowerCase();
  return serviceIconMap[key] || IconBeaker;
}

export default async function ServiciosPage() {
  // Obtener servicios de la API
  let services = [];
  let settings = {};

  try {
    const [servicesRes, settingsData] = await Promise.all([
      publicAPI.getServices(),
      getSettings(),
    ]);

    services = servicesRes.data || [];
    settings = settingsData || {};
    
    // Ordenar por campo order si existe
    services.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error cargando servicios:', error);
    // Continuar con array vacío
  }

  const whatsappNumber = (settings.whatsapp_number || '573001234567').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola%20Dromedicinal%2C%20quiero%20informaci%C3%B3n%20sobre%20un%20servicio`;

  return (
    <div className="py-8 lg:py-12">
      <div className="container-app">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Más que una droguería, somos tu aliado en el cuidado de tu salud. 
            Conoce todos los servicios que tenemos para ti.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.length > 0 ? (
            services.map((service) => {
              const Icon = getServiceIcon(service.name);
              const features = service.features || [];
              
              return (
                <article
                  key={service.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-brand-green-light flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-brand-green" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  {features.length > 0 && (
                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-500">
                          <IconCheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              No hay servicios disponibles en este momento.
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-brand-blue to-brand-green rounded-2xl text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            ¿Necesitas alguno de nuestros servicios?
          </h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
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
  );
}
