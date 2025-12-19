import { MetadataRoute } from 'next';
import { siteUrl } from '@/config/siteConfig';
import { publicAPI } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl;
  
  // URLs estáticas principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/servicios`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/promociones`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/preguntas-frecuentes`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/bogota/engativa`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/como-hacer-un-pedido`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
  
  // URLs dinámicas: categorías
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categoriesRes = await publicAPI.getCategories();
    const categories = categoriesRes.data || [];
    
    categoryPages = categories.map((category) => ({
      url: `${baseUrl}/catalogo/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error obteniendo categorías para sitemap:', error);
  }
  
  // URLs dinámicas: productos (limitado a los más recientes/importantes)
  // Nota: Para sitios grandes, considerar paginación o límite
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const productsRes = await publicAPI.getProducts({ per_page: 100 }); // Limitar a 100 productos más recientes
    const products = Array.isArray(productsRes.data) ? productsRes.data : [];
    
    productPages = products.map((product) => ({
      url: `${baseUrl}/producto/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error obteniendo productos para sitemap:', error);
  }
  
  return [...staticPages, ...categoryPages, ...productPages];
}

