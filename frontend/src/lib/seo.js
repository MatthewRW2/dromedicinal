/**
 * SEO Helpers - Metadata y configuración para SEO
 */

import { siteConfig, getFullUrl } from '@/config/siteConfig';

const SITE_NAME = siteConfig.siteName;
const SITE_URL = siteConfig.siteUrl;
const DEFAULT_DESCRIPTION = siteConfig.description;

/**
 * Genera metadata base para páginas
 * IMPORTANTE: El canonical se genera sin parámetros de consulta (UTM, etc.)
 */
export function generateMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image,
  noIndex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  // Asegurar que el path no tenga parámetros de consulta para el canonical
  const cleanPath = path.split('?')[0];
  const url = getFullUrl(cleanPath);
  const ogImage = image || siteConfig.defaultOgImage;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url, // Sin parámetros UTM
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
 * Schema.org LocalBusiness/Pharmacy para SEO local
 * Usa siteConfig como base, con opción de sobrescribir desde settings de API
 * @param {object|null} settings - Settings desde la API (opcional)
 */
export function getLocalBusinessSchema(settings = null) {
  // Usar siteConfig como base, permitir override desde settings
  const phone = settings?.phone || settings?.whatsapp_number || siteConfig.phone.e164;
  const email = settings?.contact_email || siteConfig.email;
  const address = settings?.address || siteConfig.address.full;
  
  // Extraer partes de la dirección si es posible
  const addressParts = address.split(',');
  const streetAddress = addressParts[0]?.trim() || siteConfig.address.street;
  const locality = addressParts[1]?.trim() || siteConfig.address.locality;
  const region = addressParts[2]?.trim() || siteConfig.address.region;
  
  // Formatear teléfono para Schema.org
  const formattedPhone = phone.startsWith('+') ? phone : `+57${phone.replace(/[^0-9]/g, '')}`;
  
  // Construir sameAs solo con URLs válidas
  const sameAs = [];
  if (siteConfig.social.facebookUrl) sameAs.push(siteConfig.social.facebookUrl);
  if (siteConfig.social.instagramUrl) sameAs.push(siteConfig.social.instagramUrl);
  
  return {
    '@context': 'https://schema.org',
    '@type': siteConfig.businessType,
    name: siteConfig.siteName,
    alternateName: 'Droguería Dromedicinal',
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    telephone: formattedPhone,
    email: email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: streetAddress,
      addressLocality: locality,
      addressRegion: region,
      addressCountry: siteConfig.address.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    openingHoursSpecification: siteConfig.openingHours.schema,
    priceRange: '$$',
    image: siteConfig.defaultOgImage,
    areaServed: siteConfig.coverageAreas.map(area => ({
      '@type': 'City',
      name: area,
      containedIn: {
        '@type': 'City',
        name: siteConfig.address.locality,
      },
    })),
    ...(sameAs.length > 0 && { sameAs }),
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
    url: getFullUrl(`/producto/${slug}`),
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

