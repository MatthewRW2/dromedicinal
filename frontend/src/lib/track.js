/**
 * Wrapper centralizado de tracking para GA4 y Meta Pixel
 * Implementa todos los eventos clave definidos en P0-H
 */

import { trackGA4Event, trackMetaEvent } from './analytics';

/**
 * Función principal de tracking
 * Envía eventos a GA4 y Meta Pixel simultáneamente
 * 
 * @param {string} eventName - Nombre del evento
 * @param {object} payload - Datos del evento
 */
export function track(eventName, payload = {}) {
  // Validar que estamos en el cliente
  if (typeof window === 'undefined') {
    return;
  }

  // Log en desarrollo (opcional)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Track]', eventName, payload);
  }

  // Enviar a ambas plataformas
  trackGA4Event(eventName, payload);
  trackMetaEvent(eventName, payload);
}

// ======================
// EVENTOS CLAVE DEFINIDOS EN P0
// ======================

/**
 * click_whatsapp_global - Clic en botón WhatsApp general
 */
export function trackClickWhatsAppGlobal(source = 'unknown') {
  track('click_whatsapp_global', { source });
}

/**
 * click_whatsapp_product - Clic en WhatsApp desde producto
 */
export function trackClickWhatsAppProduct(product) {
  track('click_whatsapp_product', {
    product_id: product.id || product.slug,
    product_name: product.name,
    product_slug: product.slug,
    product_price: product.price || 0,
  });
}

/**
 * click_call - Clic en botón de llamada
 */
export function trackClickCall(source = 'unknown') {
  track('click_call', { source });
}

/**
 * view_product - Vista de producto
 */
export function trackViewProduct(product) {
  track('view_product', {
    product_id: product.id || product.slug,
    product_name: product.name,
    product_slug: product.slug,
    product_price: product.price || 0,
    product_category: product.category?.name || product.category,
  });
}

/**
 * add_to_cart - Agregar producto al carrito
 */
export function trackAddToCart(product) {
  track('add_to_cart', {
    product_id: product.id || product.slug,
    product_name: product.name,
    product_slug: product.slug,
    product_price: product.price || 0,
    quantity: product.quantity || 1,
  });
}

/**
 * begin_checkout - Inicio de checkout (aunque termine en WhatsApp)
 */
export function trackBeginCheckout(items, totalValue = 0) {
  track('begin_checkout', {
    items_count: items.length,
    total_value: totalValue,
    currency: 'COP',
  });
}

/**
 * submit_whatsapp_order - Envío de pedido por WhatsApp
 */
export function trackSubmitWhatsAppOrder(orderData) {
  track('submit_whatsapp_order', {
    items_count: orderData.items_count || 0,
    has_prescription: orderData.has_prescription || false,
    total_value: orderData.total_value || 0,
    currency: 'COP',
    delivery_neighborhood: orderData.delivery_neighborhood || '',
  });
}

/**
 * prescription_required_view - Vista de aviso de medicamento formulado
 */
export function trackPrescriptionRequiredView(product) {
  track('prescription_required_view', {
    product_id: product.id || product.slug,
    product_name: product.name,
  });
}

/**
 * prescription_upload - Carga de fórmula médica (si se implementa)
 */
export function trackPrescriptionUpload(productId, uploadId) {
  track('prescription_upload', {
    product_id: productId,
    upload_id: uploadId,
  });
}

/**
 * click_rappi - Clic en enlace de Rappi
 */
export function trackClickRappi(source = 'unknown') {
  track('click_rappi', { source });
}

/**
 * form_contact_submit - Envío de formulario de contacto
 */
export function trackFormContactSubmit(formData = {}) {
  track('form_contact_submit', {
    form_location: formData.source_page || 'contacto',
    has_message: !!formData.message,
  });
}

/**
 * pqrs_submit - Envío de PQRS
 */
export function trackPqrsSubmit(pqrsData = {}) {
  track('pqrs_submit', {
    pqrs_type: pqrsData.type || 'unknown',
    has_attachment: !!pqrsData.attachment,
  });
}

// Exportar función principal como default
export default track;

