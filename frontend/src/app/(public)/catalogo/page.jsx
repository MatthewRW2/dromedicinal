import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { CategoryGrid } from '@/components/catalogo';
import { ButtonLink } from '@/components/ui/Button';
import { IconWhatsApp } from '@/components/icons';
import { publicAPI } from '@/lib/api';
import { getSettings } from '@/lib/settings';

export const metadata = generateSEOMetadata({
  title: 'Catálogo',
  description: 'Explora nuestro catálogo completo de medicamentos, productos de cuidado personal, vitaminas y más. Encuentra todo lo que necesitas para tu salud.',
  path: '/catalogo',
});

export default async function CatalogoPage() {
  // Obtener categorías de la API
  let categories = [];
  let settings = {};

  try {
    const [categoriesRes, settingsData] = await Promise.all([
      publicAPI.getCategories(),
      getSettings(),
    ]);

    categories = categoriesRes.data || [];
    settings = settingsData || {};
  } catch (error) {
    console.error('Error cargando catálogo:', error);
    // Continuar con array vacío
  }

  // Construir URL de WhatsApp
  const whatsappNumber = settings.whatsapp_number || '573134243625';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hola%20Dromedicinal%2C%20estoy%20buscando%20un%20producto`;


  return (
    <div className="py-8 lg:py-12">
      <div className="container-app">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Catálogo de productos
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Explora nuestras categorías y encuentra todo lo que necesitas para 
            el cuidado de tu salud y bienestar. Realizamos entregas a domicilio 
            y puedes pedir por WhatsApp o Rappi.
          </p>
        </div>

        {/* Categories Grid */}
        <CategoryGrid categories={categories} columns={3} />

        {/* CTA */}
        <div className="mt-12 p-8 bg-brand-blue-light rounded-2xl text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-gray-600 mb-4">
            Escríbenos por WhatsApp y te ayudamos a encontrar lo que necesitas
          </p>
          <ButtonLink
            href={whatsappUrl}
            variant="whatsapp"
            external
            icon={<IconWhatsApp className="w-5 h-5" />}
          >
            Consultar disponibilidad
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
