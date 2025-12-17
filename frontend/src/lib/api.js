/**
 * API Client - Wrapper para consumir la API de Dromedicinal
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Cliente fetch personalizado con manejo de errores
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Para enviar cookies de sesión
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.error?.message || 'Error en la solicitud',
        response.status,
        data.error?.code,
        data.error?.details
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Error de conexión con el servidor', 500, 'NETWORK_ERROR');
  }
}

/**
 * Clase de error personalizada para la API
 */
export class APIError extends Error {
  constructor(message, status, code, details = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// ======================
// ENDPOINTS PÚBLICOS
// ======================

export const publicAPI = {
  // Settings
  getSettings: () => fetchAPI('/public/settings'),

  // Categorías
  getCategories: () => fetchAPI('/public/categories'),
  getCategory: (slug) => fetchAPI(`/public/categories/${slug}`),

  // Productos
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/public/products${query ? `?${query}` : ''}`);
  },
  getProduct: (slug) => fetchAPI(`/public/products/${slug}`),

  // Promociones
  getPromotions: () => fetchAPI('/public/promotions'),
  getPromotion: (slug) => fetchAPI(`/public/promotions/${slug}`),

  // Servicios
  getServices: () => fetchAPI('/public/services'),

  // FAQs
  getFAQs: () => fetchAPI('/public/faqs'),

  // Enlaces
  getLinks: () => fetchAPI('/public/links'),

  // Contacto
  sendContact: (data) =>
    fetchAPI('/public/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ======================
// ENDPOINTS AUTH
// ======================

export const authAPI = {
  login: (email, password) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    fetchAPI('/auth/logout', {
      method: 'POST',
    }),

  me: () => fetchAPI('/auth/me'),
};

// ======================
// ENDPOINTS ADMIN
// ======================

export const adminAPI = {
  // Categorías
  categories: {
    list: () => fetchAPI('/admin/categories'),
    create: (data) =>
      fetchAPI('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      fetchAPI(`/admin/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      fetchAPI(`/admin/categories/${id}`, {
        method: 'DELETE',
      }),
  },

  // Productos
  products: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetchAPI(`/admin/products${query ? `?${query}` : ''}`);
    },
    get: (id) => fetchAPI(`/admin/products/${id}`),
    create: (data) =>
      fetchAPI('/admin/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      fetchAPI(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      fetchAPI(`/admin/products/${id}`, {
        method: 'DELETE',
      }),
    uploadImage: async (productId, file) => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(
        `${API_BASE_URL}/admin/products/${productId}/images`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new APIError(
          data.error?.message || 'Error al subir imagen',
          response.status,
          data.error?.code
        );
      }

      return response.json();
    },
    deleteImage: (productId, imageId) =>
      fetchAPI(`/admin/products/${productId}/images/${imageId}`, {
        method: 'DELETE',
      }),
    reorderImages: (productId, imageIds) =>
      fetchAPI(`/admin/products/${productId}/images/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ image_ids: imageIds }),
      }),
  },

  // Promociones
  promotions: {
    list: () => fetchAPI('/admin/promotions'),
    create: (data) =>
      fetchAPI('/admin/promotions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      fetchAPI(`/admin/promotions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      fetchAPI(`/admin/promotions/${id}`, {
        method: 'DELETE',
      }),
  },

  // Servicios
  services: {
    list: () => fetchAPI('/admin/services'),
    create: (data) =>
      fetchAPI('/admin/services', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      fetchAPI(`/admin/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      fetchAPI(`/admin/services/${id}`, {
        method: 'DELETE',
      }),
  },

  // FAQs
  faqs: {
    list: () => fetchAPI('/admin/faqs'),
    create: (data) =>
      fetchAPI('/admin/faqs', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      fetchAPI(`/admin/faqs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      fetchAPI(`/admin/faqs/${id}`, {
        method: 'DELETE',
      }),
  },

  // Enlaces
  links: {
    list: () => fetchAPI('/admin/links'),
    create: (data) =>
      fetchAPI('/admin/links', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      fetchAPI(`/admin/links/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      fetchAPI(`/admin/links/${id}`, {
        method: 'DELETE',
      }),
  },

  // Usuarios
  users: {
    list: () => fetchAPI('/admin/users'),
    create: (data) =>
      fetchAPI('/admin/users', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      fetchAPI(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      fetchAPI(`/admin/users/${id}`, {
        method: 'DELETE',
      }),
  },

  // Reportes
  reports: {
    lowStock: () => fetchAPI('/admin/reports/stock-low'),
    catalogSummary: () => fetchAPI('/admin/reports/catalog-summary'),
    contactMessages: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetchAPI(`/admin/reports/contact-messages${query ? `?${query}` : ''}`);
    },
  },
};

export default { publicAPI, authAPI, adminAPI };

