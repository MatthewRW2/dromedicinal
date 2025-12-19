import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/siteConfig';

export const metadata = generateSEOMetadata({
  title: 'Política de Tratamiento de Datos Personales',
  description: 'Política de tratamiento de datos personales de Droguería Dromedicinal conforme a la Ley 1581 de 2012 de Colombia.',
  path: '/politica-de-tratamiento-de-datos',
  noIndex: true, // Las páginas legales generalmente no se indexan
});

export default function PoliticaTratamientoDatosPage() {
  return (
    <div className="py-8 lg:py-12">
      <div className="container-app max-w-4xl">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          Política de Tratamiento de Datos Personales
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Responsable del Tratamiento</h2>
            <p className="text-gray-700 mb-4">
              <strong>Droguería Dromedicinal</strong>
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Dirección:</strong> {siteConfig.address.full}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Teléfono:</strong> {siteConfig.phone.display}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Correo electrónico:</strong> {siteConfig.email}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Finalidad del Tratamiento</h2>
            <p className="text-gray-700 mb-4">
              Los datos personales que recopilamos son utilizados para las siguientes finalidades:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Procesar y gestionar pedidos de productos y servicios</li>
              <li>Realizar entregas a domicilio</li>
              <li>Comunicarnos con los clientes sobre sus pedidos</li>
              <li>Enviar información sobre promociones y servicios (con consentimiento previo)</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
              <li>Mejorar nuestros servicios y experiencia del cliente</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Datos que Recopilamos</h2>
            <p className="text-gray-700 mb-4">
              Recopilamos los siguientes tipos de datos personales:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Datos de identificación:</strong> Nombre completo, documento de identidad</li>
              <li><strong>Datos de contacto:</strong> Teléfono, dirección de correo electrónico, dirección física</li>
              <li><strong>Datos de pedidos:</strong> Historial de compras, productos solicitados</li>
              <li><strong>Datos de ubicación:</strong> Dirección de entrega, barrio</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Derechos del Titular</h2>
            <p className="text-gray-700 mb-4">
              Conforme a la Ley 1581 de 2012, usted tiene derecho a:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Conocer, actualizar y rectificar sus datos personales</li>
              <li>Solicitar prueba de la autorización otorgada</li>
              <li>Revocar la autorización y/o solicitar la supresión del dato</li>
              <li>Acceder de forma gratuita a sus datos personales</li>
              <li>Presentar quejas ante la Superintendencia de Industria y Comercio</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Procedimiento para Ejercer Derechos</h2>
            <p className="text-gray-700 mb-4">
              Para ejercer sus derechos, puede contactarnos a través de:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Correo electrónico:</strong> {siteConfig.email}</li>
              <li><strong>WhatsApp:</strong> {siteConfig.whatsapp.display}</li>
              <li><strong>Teléfono:</strong> {siteConfig.phone.display}</li>
              <li><strong>Formulario PQRS:</strong> <a href="/pqrs" className="text-brand-blue hover:underline">/pqrs</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Medidas de Seguridad</h2>
            <p className="text-gray-700 mb-4">
              Implementamos medidas técnicas y organizativas para proteger sus datos personales contra 
              acceso no autorizado, pérdida, destrucción o alteración.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Transferencias y Transmisiones</h2>
            <p className="text-gray-700 mb-4">
              Sus datos personales no serán transferidos a terceros, excepto cuando sea necesario 
              para cumplir con obligaciones legales o cuando usted haya dado su consentimiento expreso.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Vigencia</h2>
            <p className="text-gray-700 mb-4">
              Esta política estará vigente mientras sea necesario para cumplir con las finalidades 
              para las cuales se recopilaron los datos, o mientras exista una obligación legal de 
              conservarlos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modificaciones</h2>
            <p className="text-gray-700 mb-4">
              Nos reservamos el derecho de modificar esta política en cualquier momento. 
              Las modificaciones serán publicadas en esta página con la fecha de actualización correspondiente.
            </p>
          </section>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Nota:</strong> Esta política cumple con los requisitos básicos de la Ley 1581 de 2012 
              de Colombia. Se recomienda revisar y personalizar según las necesidades específicas del negocio 
              y asesoría legal profesional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

