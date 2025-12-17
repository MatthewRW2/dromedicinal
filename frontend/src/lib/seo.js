/**
 * SEO Helpers - Metadata y configuración para SEO
 */

const SITE_NAME = 'Dromedicinal';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dromedicinal.com';
const DEFAULT_DESCRIPTION = 'Tu droguería de confianza en Bogotá. Medicamentos, productos de cuidado personal y servicios de salud con atención personalizada. Pedidos por WhatsApp y Rappi.';

/**
 * Genera metadata base para páginas
 */
export function generateMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image,
  noIndex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}/og-image.png`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || SITE_NAME,
        },
      ],
      locale: 'es_CO',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/**
 * Genera metadata para producto
 */
export function generateProductMetadata(product) {
  const { name, presentation, description, slug, primary_image, price, availability_status } = product;
  
  const fullName = presentation ? `${name} - ${presentation}` : name;
  const productDescription = description || `Compra ${fullName} en Dromedicinal. Envíos a domicilio en Bogotá.`;

  return {
    ...generateMetadata({
      title: fullName,
      description: productDescription,
      path: `/producto/${slug}`,
      image: primary_image,
    }),
    other: {
      'product:price:amount': price || '',
      'product:price:currency': 'COP',
      'product:availability': availability_status === 'IN_STOCK' ? 'in stock' : 'out of stock',
    },
  };
}

/**
 * Genera metadata para categoría
 */
export function generateCategoryMetadata(category) {
  const { name, description, slug, product_count } = category;
  
  const categoryDescription = description || 
    `Explora nuestra selección de ${name.toLowerCase()} en Dromedicinal. ${product_count || ''} productos disponibles.`;

  return generateMetadata({
    title: name,
    description: categoryDescription,
    path: `/catalogo/${slug}`,
  });
}

/**
 * Schema.org LocalBusiness para SEO local
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Pharmacy',
    name: SITE_NAME,
    alternateName: 'Droguería Dromedicinal',
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    telephone: '+571234567',
    email: 'contacto@dromedicinal.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle 123 #45-67',
      addressLocality: 'Bogotá',
      addressRegion: 'Bogotá D.C.',
      postalCode: '110111',
      addressCountry: 'CO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 4.6097,
      longitude: -74.0817,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '07:00',
        closes: '21:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '08:00',
        closes: '14:00',
      },
    ],
    priceRange: '$$',
    image: `${SITE_URL}/og-image.png`,
    sameAs: [
      'https://www.instagram.com/dromedicinal',
      'https://www.facebook.com/dromedicinal',
    ],
  };
}

/**
 * Schema.org Product para productos
 */
export function getProductSchema(product) {
  const { name, description, price, availability_status, primary_image, slug } = product;

  const availability = {
    IN_STOCK: 'https://schema.org/InStock',
    LOW_STOCK: 'https://schema.org/LimitedAvailability',
    OUT_OF_STOCK: 'https://schema.org/OutOfStock',
    ON_REQUEST: 'https://schema.org/PreOrder',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description || `${name} disponible en Dromedicinal`,
    image: primary_image,
    url: `${SITE_URL}/producto/${slug}`,
    offers: {
      '@type': 'Offer',
      price: price || 0,
      priceCurrency: 'COP',
      availability: availability[availability_status] || availability.IN_STOCK,
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
  };
}

/**
 * Schema.org BreadcrumbList
 */
export function getBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href ? `${SITE_URL}${item.href}` : undefined,
    })),
  };
}

