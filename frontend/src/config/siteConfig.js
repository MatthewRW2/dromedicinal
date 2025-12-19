/**
 * Configuración central del negocio - Droguería Dromedicinal
 * Todos los datos del negocio centralizados aquí para fácil mantenimiento
 */

// URL base del sitio (configurable por env)
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dromedicinal.com';

// Configuración del negocio
export const siteConfig = {
  // Información básica
  siteName: 'Droguería Dromedicinal',
  siteUrl: siteUrl,
  
  // NAP (Name, Address, Phone) - Crítico para SEO local
  address: {
    full: 'Av. 70 # 79-16, Engativá, Bogotá, Cundinamarca',
    street: 'Av. 70 # 79-16',
    locality: 'Engativá',
    city: 'Bogotá',
    region: 'Cundinamarca',
    country: 'Colombia',
    countryCode: 'CO',
  },
  
  // Contacto
  phone: {
    display: '313 4243625',
    e164: '+573134243625',
    tel: 'tel:+573134243625',
  },
  
  whatsapp: {
    display: '313 4243625',
    e164: '+573134243625',
    number: '573134243625', // Sin + para URLs wa.me
    url: 'https://wa.me/573134243625',
  },
  
  email: 'contacto@dromedicinal.com',
  
  // Horarios de atención (formato legible y Schema.org)
  openingHours: {
    display: 'Lunes a Sábado: 7:30 a.m. – 9:30 p.m. | Domingos y Festivos: 8:30 a.m. – 8:30 p.m.',
    schema: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '07:30',
        closes: '21:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'PublicHolidays'],
        opens: '08:30',
        closes: '20:30',
      },
    ],
    text: {
      weekdays: 'Lunes a Sábado: 7:30 a.m. – 9:30 p.m.',
      weekends: 'Domingos y Festivos: 8:30 a.m. – 8:30 p.m.',
    },
  },
  
  // Zonas de cobertura (barrios de Engativá)
  coverageAreas: [
    'Bonanza',
    'La Estrada',
    'Boyacá Real',
    'Villa Luz',
    'Ciudad Bachué',
    'La Granja',
    'Las Ferias',
    'Santa Helenita',
    'Normandía Occidental',
    'Bolivia',
  ],
  
  // Redes sociales (placeholders si no están disponibles)
  social: {
    facebookUrl: null, // Configurar cuando esté disponible
    instagramUrl: null, // Configurar cuando esté disponible
  },
  
  // Canales de pedido
  orderChannels: {
    whatsapp: {
      primary: true,
      url: 'https://wa.me/573134243625',
      message: 'Hola Dromedicinal, quiero hacer un pedido',
    },
    rappi: {
      primary: false,
      url: null, // Configurar cuando esté disponible
      enabled: false,
    },
  },
  
  // Colores corporativos (para uso en componentes)
  brandColors: {
    primaryLightBlue: '#0096D6',
    green: '#3BAF5C',
    blueInstitutional: '#2A7DB1',
    redCoral: '#E74C3C',
    gray: '#555555',
    white: '#FFFFFF',
  },
  
  // Imagenes por defecto
  defaultOgImage: `${siteUrl}/og-image.png`,
  logoPath: '/logo.png',
  
  // Coordenadas geográficas (para Schema.org y mapas)
  geo: {
    latitude: 4.6097, // Bogotá centro (ajustar si se tiene coordenada exacta)
    longitude: -74.0817,
  },
  
  // Información del negocio para Schema.org
  businessType: 'Pharmacy', // Pharmacy o LocalBusiness
  description: 'Tu droguería de confianza en Bogotá. Medicamentos, productos de cuidado personal y servicios de salud con atención personalizada. Pedidos por WhatsApp y Rappi.',
  
  // Servicios ofrecidos
  services: [
    'Inyectología',
    'Toma de tensión',
    'Control de glicemia',
    'Orientación farmacéutica',
    'Entrega a domicilio',
    'Recargas y pago de servicios',
  ],
};

// Helper para obtener URL completa
export function getFullUrl(path = '') {
  return `${siteUrl}${path}`;
}

// Helper para construir URL de WhatsApp con mensaje
export function getWhatsAppUrl(message = siteConfig.orderChannels.whatsapp.message) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodedMessage}`;
}

// Helper para obtener tel: link
export function getTelLink() {
  return siteConfig.phone.tel;
}

// Exportar por defecto
export default siteConfig;

