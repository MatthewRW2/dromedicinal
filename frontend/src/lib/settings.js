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
    // Si falla, retornar valores por defecto
    console.error('Error obteniendo settings:', error);
    return getDefaultSettings();
  }
}

/**
 * Valores por defecto si la API falla
 */
function getDefaultSettings() {
  return {
    phone: '(601) 123 4567',
    whatsapp_number: '573001234567',
    contact_email: 'contacto@dromedicinal.com',
    address: 'Calle 123 #45-67, Bogotá',
    business_hours: 'Lun-Sáb: 7am-9pm | Dom: 8am-2pm',
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

