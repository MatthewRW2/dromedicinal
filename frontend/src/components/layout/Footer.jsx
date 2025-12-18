import Link from 'next/link';
import { getSettings } from '@/lib/settings';
import { publicAPI } from '@/lib/api';
import {
  IconWhatsApp,
  IconInstagram,
  IconFacebook,
  IconLocation,
  IconPhone,
  IconClock,
} from '@/components/icons';

const footerLinks = {
  catalogo: [
    { name: 'Medicamentos', href: '/catalogo/medicamentos' },
    { name: 'Cuidado Personal', href: '/catalogo/cuidado-personal' },
    { name: 'Bebés y Niños', href: '/catalogo/bebes-ninos' },
    { name: 'Dermocosméticos', href: '/catalogo/dermocosmeticos' },
  ],
  servicios: [
    { name: 'Toma de tensión', href: '/servicios' },
    { name: 'Glicemia', href: '/servicios' },
    { name: 'Inyectología', href: '/servicios' },
    { name: 'Domicilios', href: '/servicios' },
  ],
  empresa: [
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Promociones', href: '/promociones' },
    { name: 'Preguntas Frecuentes', href: '/preguntas-frecuentes' },
    { name: 'Enlaces de Interés', href: '/enlaces' },
  ],
  legal: [
    { name: 'Política de Privacidad', href: '/politica-privacidad' },
    { name: 'Términos y Condiciones', href: '/terminos' },
  ],
};

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Obtener settings y enlaces
  let settings = {};
  let links = [];
  
  try {
    const [settingsData, linksRes] = await Promise.all([
      getSettings(),
      publicAPI.getLinks().catch(() => ({ data: [] })),
    ]);
    
    settings = settingsData || {};
    links = linksRes.data || [];
  } catch (error) {
    // Usar valores por defecto
  }
  
  const address = settings.address || 'Calle 123 #45-67, Bogotá, Colombia';
  const phone = settings.phone || '(601) 123 4567';
  const businessHours = settings.business_hours || 'Lun-Sáb: 7am - 9pm | Dom: 8am - 2pm';
  const whatsappNumber = (settings.whatsapp_number || '573001234567').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const instagramUrl = settings.instagram_url || '#';
  const facebookUrl = settings.facebook_url || '#';

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer */}
      <div className="container-app py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Dromedicinal</h2>
                <p className="text-sm text-gray-400">Droguería</p>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Tu droguería de confianza en Bogotá. Medicamentos, productos de cuidado personal 
              y servicios de salud con atención personalizada.
            </p>
            
            {/* Contact info */}
            <div className="space-y-2 text-sm">
              {address && (
                <p className="flex items-center gap-2">
                  <IconLocation className="w-4 h-4 text-brand-blue" />
                  {address}
                </p>
              )}
              {phone && (
                <p className="flex items-center gap-2">
                  <IconPhone className="w-4 h-4 text-brand-blue" />
                  {phone}
                </p>
              )}
              {businessHours && (
                <p className="flex items-center gap-2">
                  <IconClock className="w-4 h-4 text-brand-blue" />
                  {businessHours}
                </p>
              )}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-whatsapp/10 text-whatsapp hover:bg-whatsapp hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <IconWhatsApp className="w-5 h-5" />
              </a>
              {instagramUrl !== '#' && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <IconInstagram className="w-5 h-5" />
                </a>
              )}
              {facebookUrl !== '#' && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <IconFacebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="text-white font-semibold mb-4">Catálogo</h3>
            <ul className="space-y-2">
              {footerLinks.catalogo.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              {footerLinks.servicios.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-app py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© {currentYear} Dromedicinal. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-gray-300 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
