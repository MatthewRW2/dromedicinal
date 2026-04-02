/**
 * Utilidad para obtener y cachear settings de la API
 * Para uso en Server Components
 */

import { publicAPI } from './api';

let cachedSettings = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Obtener settings desde la API (con cache)
 * Para Server Components
 */
export async function getSettings() {
  // Si hay cache válido, retornarlo
  if (cachedSettings && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedSettings;
  }

  try {
    const response = await publicAPI.getSettings();
    cachedSettings = response.data || {};
    cacheTimestamp = Date.now();
    return cachedSettings;
  } catch (error) {
    // Si falla (ej. backend no está corriendo), usar valores por defecto
    if (error?.code === 'NETWORK_ERROR') {
      console.warn(
        '[Settings] No se pudo conectar con el backend. Usando valores por defecto. ¿Está corriendo? Ejecuta: cd backend && php -S localhost:8000 server.php'
      );
    } else {
      console.error('Error obteniendo settings:', error);
    }
    return getDefaultSettings();
  }
}

/**
 * Valores por defecto si la API falla
 */
function getDefaultSettings() {
  return {
    phone: '313 4243625',
    whatsapp_number: '573134243625',
    contact_email: 'contacto@dromedicinal.com',
    address: 'Carrera 70 # 79-16, Engativá, Bogotá',
    business_hours: 'Lunes a Sábado: 7:30 a.m. – 9:30 p.m. | Domingos y Festivos: 8:30 a.m. – 8:30 p.m.',
    rappi_url: '#',
    google_maps_url: null,
    facebook_url: null,
    instagram_url: null,
    whatsapp_url: null,
  };
}

/**
 * Limpiar cache (útil para testing o actualización manual)
 */
export function clearSettingsCache() {
  cachedSettings = null;
  cacheTimestamp = null;
}

