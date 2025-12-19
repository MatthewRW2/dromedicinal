import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { siteConfig, getWhatsAppUrl } from '@/config/siteConfig';
import { ButtonLink } from '@/components/ui/Button';
import { IconWhatsApp } from '@/components/icons';

export const metadata = generateSEOMetadata({
  title: 'Política de Devoluciones',
  description: 'Política de devoluciones y cambios de Droguería Dromedicinal.',
  path: '/politica-de-devoluciones',
  noIndex: true,
});

export default function PoliticaDevolucionesPage() {
  const whatsappUrl = getWhatsAppUrl('Hola Dromedicinal, necesito información sobre una devolución.');

  return (
    <div className="py-8 lg:py-12">
      <div className="container-app max-w-4xl">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          Política de Devoluciones
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-CO', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Generalidades</h2>
            <p className="text-gray-700 mb-4">
              En Droguería Dromedicinal nos comprometemos a garantizar la satisfacción de nuestros clientes. 
              Esta política establece las condiciones para devoluciones y cambios de productos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Productos Elegibles para Devolución</h2>
            <p className="text-gray-700 mb-4">
              Se aceptan devoluciones de productos en los siguientes casos:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Productos defectuosos o dañados al momento de la entrega</li>
              <li>Productos incorrectos entregados por error</li>
              <li>Productos no perecederos en su empaque original, sin abrir y dentro de los plazos establecidos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Productos No Elegibles para Devolución</h2>
            <p className="text-gray-700 mb-4">
              No se aceptan devoluciones de:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Medicamentos formulados (salvo defectos de fabricación)</li>
              <li>Productos perecederos</li>
              <li>Productos abiertos o usados (salvo defectos)</li>
              <li>Productos personalizados o preparados especialmente</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Plazos para Devoluciones</h2>
            <p className="text-gray-700 mb-4">
              Las solicitudes de devolución deben realizarse dentro de los siguientes plazos:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Productos defectuosos o incorrectos:</strong> 48 horas después de la entrega</li>
              <li><strong>Otros productos elegibles:</strong> 7 días después de la compra</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Proceso de Devolución</h2>
            <p className="text-gray-700 mb-4">
              Para solicitar una devolución:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>Contacte a nuestro equipo por WhatsApp o teléfono dentro del plazo establecido</li>
              <li>Proporcione el número de pedido y descripción del problema</li>
              <li>Nuestro equipo evaluará la solicitud y le indicará los pasos a seguir</li>
              <li>Si la devolución es aprobada, coordinaremos la recolección o entrega del producto</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Reembolsos</h2>
            <p className="text-gray-700 mb-4">
              Los reembolsos se procesarán una vez recibido y verificado el producto devuelto. 
              El método de reembolso será el mismo utilizado para el pago original, cuando sea posible.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cambios de Productos</h2>
            <p className="text-gray-700 mb-4">
              Los cambios de productos se manejan caso por caso. Contacte a nuestro equipo 
              para evaluar la posibilidad de cambio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contacto</h2>
            <p className="text-gray-700 mb-4">
              Para consultas sobre devoluciones, puede contactarnos a través de:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>WhatsApp:</strong> {siteConfig.whatsapp.display}</li>
              <li><strong>Teléfono:</strong> {siteConfig.phone.display}</li>
              <li><strong>Correo:</strong> {siteConfig.email}</li>
            </ul>
          </section>

          <div className="mt-12 p-6 bg-brand-blue-light rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              ¿Necesitas hacer una devolución?
            </h3>
            <p className="text-gray-700 mb-4">
              Contáctanos por WhatsApp y te ayudaremos a resolver tu solicitud de manera rápida.
            </p>
            <ButtonLink
              href={whatsappUrl}
              variant="whatsapp"
              size="lg"
              external
              icon={<IconWhatsApp className="w-5 h-5" />}
            >
              Contactar por WhatsApp
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}

