import Link from 'next/link';
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

export default function Footer() {
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
              <p className="flex items-center gap-2">
                <IconLocation className="w-4 h-4 text-brand-blue" />
                Calle 123 #45-67, Bogotá, Colombia
              </p>
              <p className="flex items-center gap-2">
                <IconPhone className="w-4 h-4 text-brand-blue" />
                (601) 123 4567
              </p>
              <p className="flex items-center gap-2">
                <IconClock className="w-4 h-4 text-brand-blue" />
                Lun-Sáb: 7am - 9pm | Dom: 8am - 2pm
              </p>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://wa.me/573001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-whatsapp/10 text-whatsapp hover:bg-whatsapp hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <IconWhatsApp className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/dromedicinal"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <IconInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/dromedicinal"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <IconFacebook className="w-5 h-5" />
              </a>
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
            <p>© {new Date().getFullYear()} Dromedicinal. Todos los derechos reservados.</p>
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
