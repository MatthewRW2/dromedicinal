import { notFound } from 'next/navigation';
import { generateProductMetadata, getProductSchema, getBreadcrumbSchema } from '@/lib/seo';
import { ProductGallery } from '@/components/catalogo';
import { AvailabilityBadge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { getProductOrderLink } from '@/lib/whatsapp';
import { IconWhatsApp, IconRappi, IconInfo } from '@/components/icons';
import { publicAPI } from '@/lib/api';
import { getSettings } from '@/lib/settings';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const response = await publicAPI.getProduct(slug);
    const product = response.data;
    
    if (!product) {
      return { title: 'Producto no encontrado' };
    }
    
    return generateProductMetadata(product);
  } catch (error) {
    return { title: 'Producto no encontrado' };
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  
  // Obtener producto de la API
  let product = null;
  let settings = {};
  
  try {
    const [productRes, settingsData] = await Promise.all([
      publicAPI.getProduct(slug),
      getSettings(),
    ]);
    
    product = productRes.data;
    settings = settingsData || {};
  } catch (error) {
    notFound();
  }

  if (!product) {
    notFound();
  }

  // Mapear imágenes de la API
  const images = product.images || [];
  
  // Construir URL de Rappi
  const rappiUrl = settings.rappi_url || '#';

  const formattedPrice = product.price
    ? new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: product.currency || 'COP',
        minimumFractionDigits: 0,
      }).format(product.price)
    : null;

  const whatsappLink = getProductOrderLink(product, settings.whatsapp_number);

  // Schema.org para SEO
  const productSchema = getProductSchema(product);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalogo' },
    { name: product.category?.name || 'Productos', href: `/catalogo/${product.category?.slug}` },
    { name: product.name },
  ]);

  return (
    <>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="py-8 lg:py-12">
        <div className="container-app">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <ol className="flex items-center gap-2 flex-wrap">
              <li><a href="/" className="hover:text-brand-blue">Inicio</a></li>
              <li>/</li>
              <li><a href="/catalogo" className="hover:text-brand-blue">Catálogo</a></li>
              <li>/</li>
              {product.category && (
                <>
                  <li>
                    <a href={`/catalogo/${product.category.slug}`} className="hover:text-brand-blue">
                      {product.category.name}
                    </a>
                  </li>
                  <li>/</li>
                </>
              )}
              <li className="text-gray-900 font-medium truncate">{product.name}</li>
            </ol>
          </nav>

          {/* Product content */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery */}
            <div>
              <ProductGallery images={images} productName={product.name} />
            </div>

            {/* Info */}
            <div>
              {/* Name */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* Presentation */}
              {product.presentation && (
                <p className="text-gray-600 mb-4">{product.presentation}</p>
              )}

              {/* Brand */}
              {product.brand && (
                <p className="text-sm text-gray-500 mb-4">
                  Marca: <span className="font-medium text-gray-700">{product.brand}</span>
                </p>
              )}

              {/* Availability y Prescription */}
              <div className="mb-6 flex items-center gap-3 flex-wrap">
                <AvailabilityBadge status={product.availability_status} />
                {product.requires_prescription && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
                    ⚠️ Requiere fórmula médica
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                {formattedPrice ? (
                  <p className="text-3xl font-bold text-brand-blue">{formattedPrice}</p>
                ) : (
                  <p className="text-lg text-gray-500 italic">Consultar precio</p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8">
                  <h2 className="font-semibold text-gray-900 mb-2">Descripción</h2>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <ButtonLink
                  href={whatsappLink}
                  variant="whatsapp"
                  size="lg"
                  external
                  icon={<IconWhatsApp className="w-5 h-5" />}
                  className="flex-1"
                >
                  Pedir por WhatsApp
                </ButtonLink>
                <ButtonLink
                  href={rappiUrl}
                  variant="rappi"
                  size="lg"
                  external
                  icon={<IconRappi className="w-5 h-5" />}
                  className="flex-1"
                >
                  Pedir en Rappi
                </ButtonLink>
              </div>

              {/* Additional info */}
              {product.requires_prescription ? (
                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                  <IconInfo className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">Medicamento formulado</p>
                    <p>
                      Este producto requiere receta médica. Al hacer tu pedido por WhatsApp, 
                      por favor adjunta la fórmula médica correspondiente.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-8 p-4 bg-brand-blue-light rounded-lg flex gap-3">
                  <IconInfo className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    <strong>¿Tienes dudas?</strong> Escríbenos por WhatsApp y te asesoramos 
                    sobre este producto. También realizamos entregas a domicilio.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
