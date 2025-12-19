import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso de Droguería Dromedicinal.',
  path: '/terminos-y-condiciones',
  noIndex: true,
});

export default function TerminosCondicionesPage() {
  return (
    <div className="py-8 lg:py-12">
      <div className="container-app max-w-4xl">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          Términos y Condiciones
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceptación de los Términos</h2>
            <p className="text-gray-700 mb-4">
              Al acceder y utilizar el sitio web de Droguería Dromedicinal, usted acepta estar 
              sujeto a estos términos y condiciones de uso.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Uso del Sitio Web</h2>
            <p className="text-gray-700 mb-4">
              El sitio web está destinado para uso personal y no comercial. Usted se compromete a:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Utilizar el sitio de manera legal y apropiada</li>
              <li>No realizar actividades que puedan dañar o interferir con el funcionamiento del sitio</li>
              <li>No intentar acceder a áreas restringidas del sitio</li>
              <li>Proporcionar información veraz y actualizada</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Pedidos y Productos</h2>
            <p className="text-gray-700 mb-4">
              Los pedidos realizados a través de nuestro sitio web o WhatsApp están sujetos a:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Disponibilidad de productos en inventario</li>
              <li>Confirmación de precio y disponibilidad por parte de nuestro equipo</li>
              <li>Cumplimiento de requisitos legales (fórmulas médicas cuando aplique)</li>
              <li>Políticas de entrega y cobertura geográfica</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Precios y Pagos</h2>
            <p className="text-gray-700 mb-4">
              Los precios mostrados en el sitio web son referenciales y pueden variar. 
              El precio final será confirmado al momento de procesar el pedido. 
              Aceptamos pagos en efectivo, transferencia bancaria y contra entrega.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Medicamentos Formulados</h2>
            <p className="text-gray-700 mb-4">
              Los medicamentos que requieren receta médica solo se dispensarán con la presentación 
              de la fórmula médica correspondiente, conforme a la normativa vigente en Colombia.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Entregas</h2>
            <p className="text-gray-700 mb-4">
              Las entregas a domicilio se realizan en las zonas de cobertura establecidas. 
              Los tiempos de entrega son estimados y pueden variar según condiciones externas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Propiedad Intelectual</h2>
            <p className="text-gray-700 mb-4">
              Todo el contenido del sitio web, incluyendo textos, imágenes, logos y diseño, 
              es propiedad de Droguería Dromedicinal y está protegido por leyes de propiedad intelectual.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitación de Responsabilidad</h2>
            <p className="text-gray-700 mb-4">
              Droguería Dromedicinal no se hace responsable por daños derivados del uso del sitio web 
              o de la información contenida en él, más allá de lo establecido por la ley.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modificaciones</h2>
            <p className="text-gray-700 mb-4">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Las modificaciones entrarán en vigor al ser publicadas en el sitio web.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Ley Aplicable</h2>
            <p className="text-gray-700 mb-4">
              Estos términos se rigen por las leyes de la República de Colombia. 
              Cualquier disputa será resuelta en los tribunales competentes de Bogotá.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

