import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import {
  IconHandshake,
  IconHeart,
  IconStar,
  IconLightning,
  IconTarget,
  IconBinoculars,
  IconStorefront,
  IconPackage,
  IconUsers,
  IconRocket,
} from '@/components/icons';

export const metadata = generateSEOMetadata({
  title: 'Nosotros',
  description: 'Conoce la historia de Dromedicinal, tu droguería de confianza en Bogotá. Nuestra misión, visión y compromiso con tu salud.',
  path: '/nosotros',
});

const values = [
  { icon: IconHandshake, title: 'Confianza', description: 'Construimos relaciones basadas en la honestidad y transparencia.' },
  { icon: IconHeart, title: 'Compromiso', description: 'Nos dedicamos a brindar la mejor atención a cada cliente.' },
  { icon: IconStar, title: 'Calidad', description: 'Ofrecemos productos garantizados y servicios de excelencia.' },
  { icon: IconLightning, title: 'Agilidad', description: 'Entendemos que tu tiempo es valioso, atención rápida y eficiente.' },
];

export default function NosotrosPage() {
  return (
    <div className="py-8 lg:py-12">
      <div className="container-app">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Sobre Nosotros
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Somos más que una droguería, somos tu aliado en el cuidado de tu salud y la de tu familia.
          </p>
        </div>

        {/* Historia */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Historia</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Dromedicinal nació con el propósito de ofrecer un servicio farmacéutico 
                  de calidad, cercano y accesible para nuestra comunidad en Bogotá.
                </p>
                <p>
                  Desde nuestros inicios, nos hemos enfocado en brindar una atención 
                  personalizada, entendiendo que cada cliente tiene necesidades únicas 
                  y merece un trato especial.
                </p>
                <p>
                  Hoy contamos con un amplio catálogo de productos, servicios de salud 
                  especializados y un equipo comprometido con tu bienestar.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand-blue-light to-brand-green-light rounded-2xl p-8 flex items-center justify-center">
              <IconStorefront className="w-32 h-32 text-brand-blue/60" />
            </div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="w-12 h-12 bg-brand-blue-light rounded-lg flex items-center justify-center mb-4">
                <IconTarget className="w-6 h-6 text-brand-blue" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Misión</h2>
              <p className="text-gray-600">
                Brindar soluciones integrales en salud a través de productos farmacéuticos 
                de calidad y servicios especializados, con un equipo humano comprometido 
                con el bienestar de nuestra comunidad.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="w-12 h-12 bg-brand-green-light rounded-lg flex items-center justify-center mb-4">
                <IconBinoculars className="w-6 h-6 text-brand-green" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Visión</h2>
              <p className="text-gray-600">
                Ser reconocidos como la droguería de confianza en nuestra zona, 
                destacando por la excelencia en el servicio, la innovación en 
                canales de atención y el compromiso con la salud comunitaria.
              </p>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Nuestros Valores
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-brand-blue-light flex items-center justify-center">
                    <Icon className="w-7 h-7 text-brand-blue" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Por qué elegirnos */}
        <section className="bg-brand-blue rounded-2xl p-8 lg:p-12 text-white">
          <h2 className="text-2xl font-bold text-center mb-8">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconPackage className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Amplio Catálogo</h3>
              <p className="text-white/80 text-sm">
                Más de 500 productos entre medicamentos, cuidado personal y más.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconUsers className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Personal Capacitado</h3>
              <p className="text-white/80 text-sm">
                Equipo profesional para asesorarte en tus compras.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconRocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Múltiples Canales</h3>
              <p className="text-white/80 text-sm">
                Pide por WhatsApp, Rappi o visítanos en nuestra tienda física.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
