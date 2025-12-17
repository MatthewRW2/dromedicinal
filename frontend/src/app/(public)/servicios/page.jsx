import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { ButtonLink } from '@/components/ui/Button';
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

const services = [
  {
    id: 1,
    icon: IconSyringe,
    title: 'Inyectología',
    description: 'Aplicación profesional de medicamentos inyectables. Contamos con personal capacitado y todas las medidas de bioseguridad.',
    features: ['Personal certificado', 'Ambiente estéril', 'Horario extendido'],
  },
  {
    id: 2,
    icon: IconHeartbeat,
    title: 'Toma de Tensión',
    description: 'Control de presión arterial con equipos digitales de última generación. Incluye registro y seguimiento.',
    features: ['Equipos calibrados', 'Registro de historial', 'Sin costo'],
  },
  {
    id: 3,
    icon: IconDrop,
    title: 'Glicemia',
    description: 'Medición rápida y precisa de glucosa en sangre. Ideal para control de diabetes.',
    features: ['Resultados inmediatos', 'Lancetas estériles', 'Orientación incluida'],
  },
  {
    id: 4,
    icon: IconTruck,
    title: 'Domicilios',
    description: 'Entrega de medicamentos y productos a la comodidad de tu hogar. Cobertura en toda la ciudad.',
    features: ['Entrega rápida', 'Cobertura amplia', 'Pago contra entrega'],
  },
  {
    id: 5,
    icon: IconBeaker,
    title: 'Asesoría Farmacéutica',
    description: 'Orientación profesional sobre medicamentos, dosis, interacciones y uso correcto.',
    features: ['Químico farmacéutico', 'Atención personalizada', 'Sin costo'],
  },
  {
    id: 6,
    icon: IconClipboard,
    title: 'Pedidos Especiales',
    description: 'Gestionamos la consecución de medicamentos de difícil acceso o bajo fórmula médica.',
    features: ['Medicamentos importados', 'Fórmulas magistrales', 'Seguimiento del pedido'],
  },
];

export default function ServiciosPage() {
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
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-xl bg-brand-green-light flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-brand-green" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-500">
                      <IconCheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
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
              href="https://wa.me/573001234567?text=Hola%20Dromedicinal%2C%20quiero%20informaci%C3%B3n%20sobre%20un%20servicio"
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
