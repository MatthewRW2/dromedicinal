import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { siteConfig, getWhatsAppUrl, getTelLink } from '@/config/siteConfig';
import { ButtonLink } from '@/components/ui/Button';
import {
  IconWhatsApp,
  IconRappi,
  IconPhone,
  IconFileText,
  IconClock,
  IconTruck,
  IconAlertCircle,
  IconCheckCircle,
} from '@/components/icons';

export const metadata = generateSEOMetadata({
  title: 'Cómo hacer un pedido | Dromedicinal',
  description: 'Aprende cómo hacer tu pedido en Dromedicinal por WhatsApp o Rappi. Guía paso a paso para pedidos de medicamentos y productos de salud.',
  path: '/como-hacer-un-pedido',
});

export default function ComoHacerPedidoPage() {
  const whatsappUrl = getWhatsAppUrl('Hola Dromedicinal, quiero hacer un pedido.');
  const telLink = getTelLink();

  const steps = [
    {
      number: 1,
      title: 'Elige tus productos',
      description: 'Navega por nuestro catálogo y agrega los productos que necesitas a tu carrito. Puedes buscar por nombre, categoría o marca.',
      icon: IconCheckCircle,
    },
    {
      number: 2,
      title: 'Revisa tu carrito',
      description: 'Verifica los productos, cantidades y precios en tu carrito. Puedes modificar cantidades o eliminar productos antes de finalizar.',
      icon: IconCheckCircle,
    },
    {
      number: 3,
      title: 'Completa la información de entrega',
      description: 'Ingresa tu dirección, barrio y cualquier observación especial. Si tu pedido incluye medicamentos formulados, prepárate para adjuntar la fórmula médica.',
      icon: IconCheckCircle,
    },
    {
      number: 4,
      title: 'Envía tu pedido por WhatsApp',
      description: 'Haz clic en "Finalizar pedido por WhatsApp". Se abrirá WhatsApp con tu pedido prellenado. Solo necesitas enviar el mensaje y adjuntar la fórmula si aplica.',
      icon: IconWhatsApp,
    },
    {
      number: 5,
      title: 'Confirma disponibilidad y precio',
      description: 'Nuestro equipo te responderá confirmando la disponibilidad de los productos y el precio total. También te indicarán el tiempo estimado de entrega.',
      icon: IconCheckCircle,
    },
    {
      number: 6,
      title: 'Recibe tu pedido',
      description: 'Una vez confirmado, coordinamos la entrega a domicilio. Puedes pagar contra entrega o por transferencia bancaria según lo acordado.',
      icon: IconTruck,
    },
  ];

  const tips = [
    {
      title: 'Horarios de pedido',
      description: 'Los pedidos realizados antes de las 6:00 p.m. generalmente se entregan el mismo día. Los pedidos después de este horario se programan para el día siguiente.',
      icon: IconClock,
    },
    {
      title: 'Medicamentos formulados',
      description: 'Si tu pedido incluye medicamentos que requieren receta médica, asegúrate de tener la fórmula médica lista para adjuntarla en WhatsApp.',
      icon: IconFileText,
    },
    {
      title: 'Disponibilidad',
      description: 'Algunos productos pueden no estar disponibles en el momento. Nuestro equipo te informará sobre alternativas o tiempos de reposición.',
      icon: IconAlertCircle,
    },
  ];

  return (
    <div className="py-8 lg:py-12">
      <div className="container-app">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Cómo hacer un pedido
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl">
          Hacer un pedido en Dromedicinal es muy fácil. Sigue estos pasos y en minutos 
          tendrás tus productos en camino a tu hogar.
        </p>

        {/* CTAs rápidos */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <ButtonLink
            href={whatsappUrl}
            variant="whatsapp"
            size="lg"
            external
            icon={<IconWhatsApp className="w-5 h-5" />}
          >
            Pedir por WhatsApp
          </ButtonLink>
          {siteConfig.orderChannels.rappi.enabled && siteConfig.orderChannels.rappi.url && (
            <ButtonLink
              href={siteConfig.orderChannels.rappi.url}
              variant="rappi"
              size="lg"
              external
              icon={<IconRappi className="w-5 h-5" />}
            >
              Pedir por Rappi
            </ButtonLink>
          )}
          <ButtonLink
            href={telLink}
            variant="outline"
            size="lg"
            icon={<IconPhone className="w-5 h-5" />}
          >
            Llamar
          </ButtonLink>
        </div>

        {/* Pasos */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Pasos para hacer tu pedido</h2>
          <div className="space-y-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex gap-6 p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-brand-blue-light rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-brand-blue">{step.number}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                      <Icon className="w-5 h-5 text-brand-green" />
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Canales de pedido */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Canales de pedido</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-whatsapp/10 border border-whatsapp/20 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <IconWhatsApp className="w-8 h-8 text-whatsapp" />
                <h3 className="text-xl font-semibold text-gray-900">WhatsApp (Principal)</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Nuestro canal principal de pedidos. Escríbenos al{' '}
                <strong>{siteConfig.whatsapp.display}</strong> y te atenderemos de inmediato.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-whatsapp mt-1">✓</span>
                  <span>Atención inmediata</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-whatsapp mt-1">✓</span>
                  <span>Puedes adjuntar fórmula médica</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-whatsapp mt-1">✓</span>
                  <span>Confirmación rápida de disponibilidad</span>
                </li>
              </ul>
              <ButtonLink
                href={whatsappUrl}
                variant="whatsapp"
                size="md"
                external
                icon={<IconWhatsApp className="w-4 h-4" />}
              >
                Abrir WhatsApp
              </ButtonLink>
            </div>

            {siteConfig.orderChannels.rappi.enabled && siteConfig.orderChannels.rappi.url ? (
              <div className="p-6 bg-rappi/10 border border-rappi/20 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <IconRappi className="w-8 h-8 text-rappi" />
                  <h3 className="text-xl font-semibold text-gray-900">Rappi</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  También puedes pedir a través de Rappi para una experiencia de pedido rápida.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-rappi mt-1">✓</span>
                    <span>Pedido rápido</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rappi mt-1">✓</span>
                    <span>Pago integrado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rappi mt-1">✓</span>
                    <span>Seguimiento en tiempo real</span>
                  </li>
                </ul>
                <ButtonLink
                  href={siteConfig.orderChannels.rappi.url}
                  variant="rappi"
                  size="md"
                  external
                  icon={<IconRappi className="w-4 h-4" />}
                >
                  Abrir Rappi
                </ButtonLink>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <IconPhone className="w-8 h-8 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-600">Llamada telefónica</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  También puedes llamarnos directamente para hacer tu pedido.
                </p>
                <ButtonLink
                  href={telLink}
                  variant="outline"
                  size="md"
                  icon={<IconPhone className="w-4 h-4" />}
                >
                  Llamar {siteConfig.phone.display}
                </ButtonLink>
              </div>
            )}
          </div>
        </section>

        {/* Consejos */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Consejos útiles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div
                  key={index}
                  className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <Icon className="w-8 h-8 text-brand-blue mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-brand-blue text-white p-8 lg:p-12 rounded-xl text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            ¿Listo para hacer tu pedido?
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
            Escríbenos por WhatsApp y te atenderemos de inmediato.
          </p>
          <ButtonLink
            href={whatsappUrl}
            variant="whatsapp"
            size="lg"
            external
            icon={<IconWhatsApp className="w-5 h-5" />}
            className="bg-white text-whatsapp hover:bg-gray-100"
          >
            Pedir por WhatsApp
          </ButtonLink>
        </section>
      </div>
    </div>
  );
}

