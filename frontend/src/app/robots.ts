import { MetadataRoute } from 'next';
import { siteUrl } from '@/config/siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/carrito',
          '/checkout',
          '/cuenta/',
          '/login',
          '/rastreo',
          '/api/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

