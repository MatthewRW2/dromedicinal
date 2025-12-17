import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { CategoryGrid } from '@/components/catalogo';
import { ButtonLink } from '@/components/ui/Button';
import { IconWhatsApp } from '@/components/icons';

export const metadata = generateSEOMetadata({
  title: 'Catálogo',
  description: 'Explora nuestro catálogo completo de medicamentos, productos de cuidado personal, vitaminas y más. Encuentra todo lo que necesitas para tu salud.',
  path: '/catalogo',
});

// Mock data - En producción vendría de la API
const categories = [
  {
    id: 1,
    name: 'Medicamentos',
    slug: 'medicamentos',
    description: 'Medicamentos de venta libre y bajo fórmula médica',
    product_count: 150,
  },
  {
    id: 2,
    name: 'Cuidado Personal',
    slug: 'cuidado-personal',
    description: 'Productos para el cuidado de tu piel, cabello y más',
    product_count: 80,
  },
  {
    id: 3,
    name: 'Bebés y Niños',
    slug: 'bebes-ninos',
    description: 'Todo para el cuidado de los más pequeños del hogar',
    product_count: 45,
  },
  {
    id: 4,
    name: 'Dermocosméticos',
    slug: 'dermocosmeticos',
    description: 'Productos dermatológicos y cosméticos especializados',
    product_count: 60,
  },
  {
    id: 5,
    name: 'Vitaminas y Suplementos',
    slug: 'vitaminas',
    description: 'Vitaminas, minerales y suplementos alimenticios',
    product_count: 35,
  },
  {
    id: 6,
    name: 'Primeros Auxilios',
    slug: 'primeros-auxilios',
    description: 'Vendajes, antisépticos y productos de emergencia',
    product_count: 25,
  },
];

export default function CatalogoPage() {
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
            href="https://wa.me/573001234567?text=Hola%20Dromedicinal%2C%20estoy%20buscando%20un%20producto"
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
