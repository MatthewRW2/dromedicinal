/**
 * API Client - Wrapper para consumir la API de Dromedicinal
 * Con soporte para autenticación JWT
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

// Clave para almacenar el token en localStorage
const TOKEN_KEY = 'dromedicinal_token';

/**
 * Obtener token almacenado
 */
export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Guardar token
 */
export function setToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Eliminar token
 */
export function removeToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Verificar si hay token
 */
export function hasToken() {
  return !!getToken();
}

/**
 * Cliente fetch personalizado con manejo de errores y JWT
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Agregar token JWT si existe
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    headers,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Si es 204 No Content, retornar null
    if (response.status === 204) {
      return { data: null, meta: null, error: null };
    }

    const data = await response.json();

    if (!response.ok) {
      // Si es 401, limpiar token
      if (response.status === 401) {
        removeToken();
      }
      
      throw new APIError(
        data.error?.message || 'Error en la solicitud',
        response.status,
        data.error?.code,
        data.error?.details
      );
    }

    return data;
  } catch (error) {
    // Si es un error de red (fetch falló), lanzar error más descriptivo
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(
        'Error de conexión: No se pudo conectar con el servidor. Verifica que el backend esté corriendo.',
        0,
        'NETWORK_ERROR'
      );
    }
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
  getFeaturedProducts: (limit = 8) => fetchAPI(`/public/featured-products?limit=${limit}`),

  // Promociones
  getPromotions: () => fetchAPI('/public/promotions'),
  getPromotion: (slug) => fetchAPI(`/public/promotions/${slug}`),

  // Servicios
  getServices: () => fetchAPI('/public/services'),

  // FAQs
  getFAQs: () => fetchAPI('/public/faqs'),

  // Enlaces
  getLinks: () => fetchAPI('/public/links'),

  // Zonas de cobertura
  getDeliveryZones: () => fetchAPI('/public/delivery-zones'),

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
  login: async (email, password) => {
    const response = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Guardar token si el login fue exitoso
    if (response.data?.token) {
      setToken(response.data.token);
    }
    
    return response;
  },

  logout: async () => {
    try {
      await fetchAPI('/auth/logout', {
        method: 'POST',
      });
    } finally {
      // Siempre eliminar el token local
      removeToken();
    }
  },

  me: () => fetchAPI('/auth/me'),

  refresh: async () => {
    const response = await fetchAPI('/auth/refresh', {
      method: 'POST',
    });
    
    // Actualizar token si se refrescó
    if (response.data?.token) {
      setToken(response.data.token);
    }
    
    return response;
  },
};

// ======================
// ENDPOINTS ADMIN
// ======================

export const adminAPI = {
  // Categorías
  categories: {
    list: () => fetchAPI('/admin/categories'),
    get: (id) => fetchAPI(`/admin/categories/${id}`),
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

      const token = getToken();
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/products/${productId}/images`,
        {
          method: 'POST',
          headers,
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
    get: (id) => fetchAPI(`/admin/promotions/${id}`),
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
    get: (id) => fetchAPI(`/admin/services/${id}`),
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
    get: (id) => fetchAPI(`/admin/faqs/${id}`),
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
    get: (id) => fetchAPI(`/admin/links/${id}`),
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
    get: (id) => fetchAPI(`/admin/users/${id}`),
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

  // Settings
  settings: {
    get: () => fetchAPI('/admin/settings'),
    update: (data) =>
      fetchAPI('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
};

export default { publicAPI, authAPI, adminAPI, getToken, setToken, removeToken, hasToken };
