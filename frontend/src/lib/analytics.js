/**
 * Analytics Helpers - Eventos para GA4 y Meta Pixel
 */

// Verificar si estamos en el cliente
const isClient = typeof window !== 'undefined';

/**
 * Envía un evento a Google Analytics 4
 */
export function trackGA4Event(eventName, params = {}) {
  if (!isClient || !window.gtag) return;

  try {
    window.gtag('event', eventName, params);
  } catch (error) {
    console.error('Error tracking GA4 event:', error);
  }
}

/**
 * Envía un evento a Meta Pixel
 */
export function trackMetaEvent(eventName, params = {}) {
  if (!isClient || !window.fbq) return;

  try {
    window.fbq('track', eventName, params);
  } catch (error) {
    console.error('Error tracking Meta event:', error);
  }
}

/**
 * Envía evento a ambas plataformas
 */
export function trackEvent(eventName, params = {}) {
  trackGA4Event(eventName, params);
  trackMetaEvent(eventName, params);
}

// ======================
// EVENTOS ESPECÍFICOS
// ======================

/**
 * Vista de producto
 */
export function trackViewProduct(product) {
  const { id, slug, name, category, price } = product;

  trackGA4Event('view_item', {
    items: [
      {
        item_id: id || slug,
        item_name: name,
        item_category: category,
        price: price || 0,
      },
    ],
  });

  trackMetaEvent('ViewContent', {
    content_ids: [slug],
    content_name: name,
    content_type: 'product',
    value: price || 0,
    currency: 'COP',
  });
}

/**
 * Clic en WhatsApp (pedido)
 */
export function trackWhatsAppClick(context = {}) {
  const { product, source = 'general' } = context;

  const eventParams = {
    event_category: 'engagement',
    event_label: source,
  };

  if (product) {
    eventParams.product_id = product.id || product.slug;
    eventParams.product_name = product.name;
  }

  trackGA4Event('click_whatsapp', eventParams);

  trackMetaEvent('Contact', {
    content_name: 'WhatsApp',
    ...eventParams,
  });
}

/**
 * Clic en Rappi
 */
export function trackRappiClick() {
  trackGA4Event('click_rappi', {
    event_category: 'engagement',
    event_label: 'rappi_order',
  });

  trackMetaEvent('Lead', {
    content_name: 'Rappi',
  });
}

/**
 * Búsqueda en catálogo
 */
export function trackSearch(searchTerm, resultsCount = 0) {
  trackGA4Event('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });

  trackMetaEvent('Search', {
    search_string: searchTerm,
  });
}

/**
 * Envío de formulario de contacto
 */
export function trackContactFormSubmit(formData = {}) {
  trackGA4Event('submit_contact_form', {
    event_category: 'engagement',
    form_location: formData.source_page || 'contacto',
  });

  trackMetaEvent('Lead', {
    content_name: 'Contact Form',
  });
}

/**
 * Vista de promoción
 */
export function trackViewPromotion(promotion) {
  const { id, slug, title } = promotion;

  trackGA4Event('view_promotion', {
    promotion_id: id || slug,
    promotion_name: title,
  });

  trackMetaEvent('ViewContent', {
    content_ids: [slug],
    content_name: title,
    content_type: 'promotion',
  });
}

/**
 * Vista de categoría
 */
export function trackViewCategory(category) {
  const { id, slug, name } = category;

  trackGA4Event('view_item_list', {
    item_list_id: slug,
    item_list_name: name,
  });
}

/**
 * Agregar al carrito de intención
 */
export function trackAddToCart(product) {
  const { id, slug, name, price } = product;

  trackGA4Event('add_to_cart', {
    items: [
      {
        item_id: id || slug,
        item_name: name,
        price: price || 0,
        quantity: 1,
      },
    ],
    value: price || 0,
    currency: 'COP',
  });

  trackMetaEvent('AddToCart', {
    content_ids: [slug],
    content_name: name,
    value: price || 0,
    currency: 'COP',
  });
}

