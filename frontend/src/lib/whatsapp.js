/**
 * WhatsApp Helpers - Generación de mensajes y enlaces para WhatsApp
 */

// Número de WhatsApp de la droguería (sin '+')
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573001234567';

/**
 * Genera un enlace de WhatsApp con mensaje prellenado
 */
export function buildWhatsAppLink(message) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

/**
 * Mensaje para consulta general
 */
export function getGeneralContactLink() {
  return buildWhatsAppLink('Hola Dromedicinal, tengo una consulta.');
}

/**
 * Mensaje para pedir un producto específico
 */
export function getProductOrderLink(product) {
  const { name, presentation, slug } = product;
  
  const message = presentation
    ? `Hola Dromedicinal, quiero pedir: ${name} (${presentation}). ¿Está disponible?`
    : `Hola Dromedicinal, quiero pedir: ${name}. ¿Está disponible?`;

  return buildWhatsAppLink(message);
}

/**
 * Mensaje para pedir múltiples productos (carrito de intención)
 */
export function getCartOrderLink(items, additionalInfo = {}) {
  const { observations, address } = additionalInfo;
  
  let message = 'Hola Dromedicinal, quiero hacer este pedido:\n\n';
  
  items.forEach((item, index) => {
    const { name, presentation, quantity } = item;
    const presentationText = presentation ? ` (${presentation})` : '';
    message += `${index + 1}) ${name}${presentationText} x${quantity || 1}\n`;
  });

  if (observations) {
    message += `\nObservaciones: ${observations}`;
  }

  if (address) {
    message += `\nDirección de entrega: ${address}`;
  }

  message += '\n\n¿Pueden confirmar disponibilidad y precio total?';

  return buildWhatsAppLink(message);
}

/**
 * Mensaje para consultar sobre un servicio
 */
export function getServiceInquiryLink(serviceName) {
  const message = `Hola Dromedicinal, quisiera información sobre el servicio de ${serviceName}.`;
  return buildWhatsAppLink(message);
}

/**
 * Mensaje para consultar sobre una promoción
 */
export function getPromotionInquiryLink(promotionTitle) {
  const message = `Hola Dromedicinal, quisiera información sobre la promoción: ${promotionTitle}.`;
  return buildWhatsAppLink(message);
}

/**
 * Hook/helpers para manejo de carrito de intención en localStorage
 */
export const intentionCart = {
  KEY: 'dromedicinal_cart',

  getItems() {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addItem(product) {
    const items = this.getItems();
    const existingIndex = items.findIndex((item) => item.id === product.id);

    if (existingIndex >= 0) {
      items[existingIndex].quantity = (items[existingIndex].quantity || 1) + 1;
    } else {
      items.push({
        id: product.id,
        slug: product.slug,
        name: product.name,
        presentation: product.presentation,
        price: product.price,
        quantity: 1,
      });
    }

    localStorage.setItem(this.KEY, JSON.stringify(items));
    return items;
  },

  updateQuantity(productId, quantity) {
    const items = this.getItems();
    const index = items.findIndex((item) => item.id === productId);

    if (index >= 0) {
      if (quantity <= 0) {
        items.splice(index, 1);
      } else {
        items[index].quantity = quantity;
      }
      localStorage.setItem(this.KEY, JSON.stringify(items));
    }

    return items;
  },

  removeItem(productId) {
    const items = this.getItems().filter((item) => item.id !== productId);
    localStorage.setItem(this.KEY, JSON.stringify(items));
    return items;
  },

  clear() {
    localStorage.removeItem(this.KEY);
    return [];
  },

  getCount() {
    return this.getItems().reduce((sum, item) => sum + (item.quantity || 1), 0);
  },
};

