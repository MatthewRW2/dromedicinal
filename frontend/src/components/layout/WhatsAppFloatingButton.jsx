'use client';

import { useState, useEffect } from 'react';
import { IconWhatsApp } from '@/components/icons';
import { publicAPI } from '@/lib/api';

/**
 * Botón flotante de WhatsApp
 * Aparece en todas las páginas públicas
 */
export default function WhatsAppFloatingButton() {
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

  const whatsappNumber = (settings.whatsapp_number || '573134243625').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola%20Dromedicinal%2C%20quiero%20hacer%20un%20pedido`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14 lg:w-16 lg:h-16
        bg-whatsapp text-white
        rounded-full
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        group
        whatsapp-float-button
      "
      aria-label="Contactar por WhatsApp"
    >
      <IconWhatsApp className="w-7 h-7 lg:w-8 lg:h-8" />
      
      {/* Tooltip */}
      <span className="
        absolute right-full mr-3
        bg-gray-900 text-white text-sm
        px-3 py-2 rounded-lg
        whitespace-nowrap
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        pointer-events-none
        hidden lg:block
      ">
        Escríbenos por WhatsApp
      </span>
    </a>
  );
}

