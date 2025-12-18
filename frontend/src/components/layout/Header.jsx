'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { publicAPI } from '@/lib/api';
import {
  IconMenu,
  IconClose,
  IconWhatsApp,
  IconRappi,
  IconLocation,
} from '@/components/icons';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Catálogo', href: '/catalogo' },
  { name: 'Promociones', href: '/promociones' },
  { name: 'Servicios', href: '/servicios' },
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Contacto', href: '/contacto' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await publicAPI.getSettings();
        setSettings(response.data || {});
      } catch (error) {
        // Ignorar error, usar valores por defecto
      }
    };

    loadSettings();
  }, []);

  const whatsappNumber = (settings.whatsapp_number || '573001234567').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola%20Dromedicinal`;
  const rappiUrl = settings.rappi_url || '#';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      {/* Top bar con WhatsApp y Rappi */}
      <div className="bg-brand-blue text-white">
        <div className="container-app">
          <div className="flex items-center justify-between py-2 text-sm">
            <p className="hidden sm:flex items-center gap-1.5">
              <IconLocation className="w-4 h-4" />
              Tu droguería de confianza en Bogotá
            </p>
            <div className="flex items-center gap-4 ml-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <IconWhatsApp className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
              <a
                href={rappiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <IconRappi className="w-4 h-4" />
                <span className="hidden sm:inline">Pide en Rappi</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-app">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full gradient-brand flex items-center justify-center">
              <span className="text-white font-bold text-lg lg:text-xl">D</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg lg:text-xl font-bold text-brand-blue leading-tight">
                Dromedicinal
              </h1>
              <p className="text-xs text-gray-500 -mt-0.5">Droguería</p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 hover:text-brand-blue transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <ButtonLink
              href="https://wa.me/573001234567?text=Hola%20Dromedicinal%2C%20quiero%20hacer%20un%20pedido"
              variant="whatsapp"
              size="md"
              external
              icon={<IconWhatsApp className="w-5 h-5" />}
            >
              Pedir ahora
            </ButtonLink>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 -mr-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileMenuOpen ? (
              <IconClose className="w-6 h-6" />
            ) : (
              <IconMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white animate-fade-in">
          <nav className="container-app py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 hover:text-brand-blue transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 mt-4">
              <ButtonLink
                href="https://wa.me/573001234567?text=Hola%20Dromedicinal%2C%20quiero%20hacer%20un%20pedido"
                variant="whatsapp"
                size="lg"
                fullWidth
                external
                icon={<IconWhatsApp className="w-5 h-5" />}
              >
                Pedir por WhatsApp
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
