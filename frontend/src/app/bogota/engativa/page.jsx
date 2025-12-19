import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { siteConfig, getWhatsAppUrl, getTelLink } from '@/config/siteConfig';
import { ButtonLink } from '@/components/ui/Button';
import {
  IconWhatsApp,
  IconPhone,
  IconLocation,
  IconClock,
  IconTruck,
  IconSyringe,
  IconHeartbeat,
  IconDrop,
  IconBeaker,
  IconClipboard,
} from '@/components/icons';

export const metadata = generateSEOMetadata({
  title: 'Droguería en Engativá a domicilio | Dromedicinal',
  description: `Droguería Dromedicinal en Engativá, Bogotá. Entrega a domicilio rápida en ${siteConfig.coverageAreas.join(', ')}. Medicamentos, productos de cuidado personal y servicios de salud. Pedidos por WhatsApp.`,
  path: '/bogota/engativa',
});

export default function EngativaLandingPage() {
  const whatsappUrl = getWhatsAppUrl('Hola Dromedicinal, quiero hacer un pedido a domicilio en Engativá.');
  const telLink = getTelLink();

  // FAQ local
  const faqs = [
    {
      question: '¿Hacen entregas a domicilio en Engativá?',
      answer: `Sí, realizamos entregas a domicilio en los siguientes barrios de Engativá: ${siteConfig.coverageAreas.join(', ')}.`,
    },
    {
      question: '¿Cuánto tiempo tarda la entrega?',
      answer: 'Las entregas a domicilio generalmente se realizan el mismo día si el pedido se hace antes de las 6:00 p.m. Los tiempos pueden variar según la zona y la disponibilidad del producto.',
    },
    {
      question: '¿Qué medios de pago aceptan?',
      answer: 'Aceptamos efectivo, transferencia bancaria y pago contra entrega. Consulta disponibilidad de otros medios al realizar tu pedido.',
    },
    {
      question: '¿Necesito fórmula médica para todos los medicamentos?',
      answer: 'No, solo los medicamentos formulados requieren receta médica. Los medicamentos de venta libre no la requieren. Si tu pedido incluye medicamentos formulados, deberás adjuntar la fórmula médica.',
    },
    {
      question: '¿Puedo pedir por WhatsApp?',
      answer: '¡Sí! WhatsApp es nuestro canal principal de pedidos. Escríbenos al ' + siteConfig.whatsapp.display + ' y te atenderemos de inmediato.',
    },
  ];

  return (
    <>
      {/* Schema.org para página local */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Droguería en Engativá a domicilio | Dromedicinal',
            description: metadata.description,
            url: `${siteConfig.siteUrl}/bogota/engativa`,
            mainEntity: {
              '@type': 'Pharmacy',
              name: siteConfig.siteName,
              address: {
                '@type': 'PostalAddress',
                streetAddress: siteConfig.address.street,
                addressLocality: siteConfig.address.locality,
                addressRegion: siteConfig.address.region,
                addressCountry: siteConfig.address.countryCode,
              },
              areaServed: siteConfig.coverageAreas.map(area => ({
                '@type': 'City',
                name: area,
              })),
            },
          }),
        }}
      />

      <div className="py-8 lg:py-12">
        <div className="container-app">
          {/* Hero Section */}
          <section className="mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Droguería en Engativá a domicilio | Dromedicinal
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl">
              Tu droguería de confianza en Engativá, Bogotá. Más de 20 años de experiencia 
              ofreciendo medicamentos, productos de cuidado personal y servicios de salud 
              con entrega a domicilio rápida y confiable.
            </p>

            {/* CTAs principales */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
                href={telLink}
                variant="primary"
                size="lg"
                icon={<IconPhone className="w-5 h-5" />}
              >
                Llamar ahora
              </ButtonLink>
            </div>

            {/* Info rápida */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-brand-blue-light rounded-lg">
                <IconLocation className="w-6 h-6 text-brand-blue shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Ubicación</p>
                  <p className="text-xs text-gray-600">{siteConfig.address.full}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-brand-green-light rounded-lg">
                <IconClock className="w-6 h-6 text-brand-green shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Horarios</p>
                  <p className="text-xs text-gray-600">{siteConfig.openingHours.text.weekdays}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-brand-orange-light rounded-lg">
                <IconTruck className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Domicilios</p>
                  <p className="text-xs text-gray-600">Mismo día</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-brand-blue-light rounded-lg">
                <IconWhatsApp className="w-6 h-6 text-whatsapp shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">WhatsApp</p>
                  <p className="text-xs text-gray-600">{siteConfig.whatsapp.display}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Zonas de cobertura */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Zonas de cobertura en Engativá
            </h2>
            <p className="text-gray-600 mb-6">
              Realizamos entregas a domicilio en los siguientes barrios de Engativá:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {siteConfig.coverageAreas.map((area) => (
                <div
                  key={area}
                  className="p-4 bg-white border border-gray-200 rounded-lg text-center hover:border-brand-blue hover:shadow-md transition-all"
                >
                  <p className="font-medium text-gray-900">{area}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Entrega a domicilio */}
          <section className="mb-12 bg-gradient-to-br from-brand-blue-light to-brand-green-light p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Entrega a domicilio rápida y confiable
            </h2>
            <p className="text-gray-700 mb-6 max-w-3xl">
              En Dromedicinal entendemos la importancia de recibir tus medicamentos y productos 
              de salud de manera rápida y segura. Por eso, ofrecemos servicio de entrega a 
              domicilio en Engativá con los siguientes beneficios:
            </p>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-brand-blue font-bold mt-1">✓</span>
                <span>Entregas el mismo día si el pedido se realiza antes de las 6:00 p.m.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-blue font-bold mt-1">✓</span>
                <span>Cobertura en los principales barrios de Engativá</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-blue font-bold mt-1">✓</span>
                <span>Manejo cuidadoso de medicamentos y productos frágiles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-blue font-bold mt-1">✓</span>
                <span>Pago contra entrega disponible</span>
              </li>
            </ul>
            <ButtonLink
              href={whatsappUrl}
              variant="whatsapp"
              size="lg"
              external
              icon={<IconWhatsApp className="w-5 h-5" />}
            >
              Solicitar entrega a domicilio
            </ButtonLink>
          </section>

          {/* Servicios */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Nuestros servicios en Engativá
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteConfig.services.map((service) => {
                const iconMap = {
                  'Inyectología': IconSyringe,
                  'Toma de tensión': IconHeartbeat,
                  'Control de glicemia': IconDrop,
                  'Orientación farmacéutica': IconBeaker,
                  'Entrega a domicilio': IconTruck,
                  'Recargas y pago de servicios': IconClipboard,
                };
                const Icon = iconMap[service] || IconBeaker;
                
                return (
                  <div
                    key={service}
                    className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 bg-brand-blue-light rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-brand-blue" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{service}</h3>
                    <p className="text-sm text-gray-600">
                      Servicio disponible en nuestra droguería y a domicilio.
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* FAQ Local */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Preguntas frecuentes - Engativá
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="p-6 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-brand-blue transition-colors"
                >
                  <summary className="font-semibold text-gray-900 mb-2 list-none">
                    <span className="flex items-center justify-between">
                      {faq.question}
                      <span className="text-brand-blue ml-2">+</span>
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-3 pl-4">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA Final */}
          <section className="bg-brand-blue text-white p-8 lg:p-12 rounded-xl text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              ¿Listo para hacer tu pedido?
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
              Escríbenos por WhatsApp y te atenderemos de inmediato. 
              También puedes llamarnos o visitarnos en nuestra droguería.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonLink
                href={whatsappUrl}
                variant="whatsapp"
                size="lg"
                external
                icon={<IconWhatsApp className="w-5 h-5" />}
              >
                WhatsApp
              </ButtonLink>
              <ButtonLink
                href={telLink}
                variant="outline"
                size="lg"
                className="bg-white text-brand-blue hover:bg-gray-100"
                icon={<IconPhone className="w-5 h-5" />}
              >
                Llamar
              </ButtonLink>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

