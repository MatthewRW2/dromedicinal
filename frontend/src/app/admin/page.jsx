'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input, { Textarea, Select } from '@/components/ui/Input';
import Spinner, { LoadingState } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { adminAPI } from '@/lib/api';
import {
  IconPackage,
  IconCategories,
  IconPromotions,
  IconMail,
  IconEdit,
  IconOffer,
  IconPlus,
  IconReports,
  IconWarning,
} from '@/components/icons';

export default function AdminDashboard() {
  const router = useRouter();
  const toast = useToast();
  
  // Estados para datos
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [contactStats, setContactStats] = useState(null);
  const [error, setError] = useState(null);

  // Estados para modales
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Estados para formularios
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '',
    category_id: '',
    sku: '',
    presentation: '',
    description: '',
    brand: '',
    price: '',
    currency: 'COP',
    availability_status: 'IN_STOCK',
    stock_qty: '',
    low_stock_threshold: '',
    is_featured: false,
    is_active: true,
  });
  const [promotionForm, setPromotionForm] = useState({
    title: '',
    description: '',
    starts_at: '',
    ends_at: '',
    is_active: true,
    product_ids: [],
  });

  // Cargar datos al montar
  useEffect(() => {
    loadDashboardData();
    loadCategories();
    loadProducts();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryRes, lowStockRes, contactRes] = await Promise.all([
        adminAPI.reports.catalogSummary(),
        adminAPI.reports.lowStock(),
        adminAPI.reports.contactMessages({ per_page: 1 }),
      ]);

      setSummary(summaryRes.data);
      setLowStock(lowStockRes.data || []);
      setContactStats(contactRes.data?.stats || { new_count: 0 });
    } catch (err) {
      console.error('Error cargando dashboard:', err);
      setError(err.message);
      toast.error('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await adminAPI.categories.list();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await adminAPI.products.list({ per_page: 100 });
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error cargando productos:', err);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...productForm,
        category_id: parseInt(productForm.category_id),
        price: productForm.price ? parseFloat(productForm.price) : null,
        stock_qty: productForm.stock_qty ? parseInt(productForm.stock_qty) : null,
        low_stock_threshold: productForm.low_stock_threshold ? parseInt(productForm.low_stock_threshold) : null,
        is_featured: productForm.is_featured || false,
        is_active: productForm.is_active !== false,
      };

      await adminAPI.products.create(data);
      toast.success('Producto creado exitosamente');
      setIsProductModalOpen(false);
      setProductForm({
        name: '',
        category_id: '',
        sku: '',
        presentation: '',
        description: '',
        brand: '',
        price: '',
        currency: 'COP',
        availability_status: 'IN_STOCK',
        stock_qty: '',
        low_stock_threshold: '',
        is_featured: false,
        is_active: true,
      });
      loadDashboardData();
      loadProducts();
    } catch (err) {
      console.error('Error creando producto:', err);
      toast.error(err.message || 'Error al crear producto');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePromotionSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...promotionForm,
        starts_at: promotionForm.starts_at || null,
        ends_at: promotionForm.ends_at || null,
        is_active: promotionForm.is_active !== false,
        product_ids: promotionForm.product_ids.map(id => parseInt(id)),
      };

      await adminAPI.promotions.create(data);
      toast.success('Promoción creada exitosamente');
      setIsPromotionModalOpen(false);
      setPromotionForm({
        title: '',
        description: '',
        starts_at: '',
        ends_at: '',
        is_active: true,
        product_ids: [],
      });
      loadDashboardData();
    } catch (err) {
      console.error('Error creando promoción:', err);
      toast.error(err.message || 'Error al crear promoción');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState text="Cargando dashboard..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button onClick={loadDashboardData}>Reintentar</Button>
      </div>
    );
  }

  const stats = [
    {
      label: 'Productos Activos',
      value: summary?.active || 0,
      icon: IconPackage,
      color: 'bg-brand-blue-light text-brand-blue',
    },
    {
      label: 'Categorías',
      value: summary?.total_categories || 0,
      icon: IconCategories,
      color: 'bg-brand-green-light text-brand-green',
    },
    {
      label: 'Promociones Activas',
      value: summary?.active_promotions || 0,
      icon: IconPromotions,
      color: 'bg-brand-orange-light text-amber-600',
    },
    {
      label: 'Mensajes Nuevos',
      value: contactStats?.new_count || 0,
      icon: IconMail,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bienvenido al panel de administración de Dromedicinal</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} padding="md" className="hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconWarning className="w-5 h-5 text-brand-orange" />
              Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStock.length > 0 ? (
              <div className="space-y-3">
                {lowStock.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-brand-orange-light rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        {product.stock_qty} unidades (mín: {product.low_stock_threshold})
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/admin/productos?edit=${product.id}`)}
                    >
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                Todos los productos tienen stock suficiente
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Info */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Catálogo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de productos:</span>
                <span className="font-medium">{summary?.total || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Productos activos:</span>
                <span className="font-medium text-green-600">{summary?.active || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Productos inactivos:</span>
                <span className="font-medium text-gray-500">{summary?.inactive || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">En stock:</span>
                <span className="font-medium text-green-600">{summary?.in_stock || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stock bajo:</span>
                <span className="font-medium text-orange-600">{summary?.low_stock || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Agotados:</span>
                <span className="font-medium text-red-600">{summary?.out_of_stock || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setIsProductModalOpen(true)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-brand-blue-light/30 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-blue-light flex items-center justify-center">
                <IconPlus className="w-6 h-6 text-brand-blue" />
              </div>
              <span className="text-sm font-medium text-gray-700">Nuevo Producto</span>
            </button>
            <button
              onClick={() => setIsPromotionModalOpen(true)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-brand-blue-light/30 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-orange-light flex items-center justify-center">
                <IconOffer className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Nueva Promoción</span>
            </button>
            <button
              onClick={() => router.push('/admin/categorias')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-brand-blue-light/30 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-green-light flex items-center justify-center">
                <IconCategories className="w-6 h-6 text-brand-green" />
              </div>
              <span className="text-sm font-medium text-gray-700">Categorías</span>
            </button>
            <button
              onClick={() => router.push('/admin/reportes')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-brand-blue-light/30 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <IconReports className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Ver Reportes</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Modal: Nuevo Producto */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => !submitting && setIsProductModalOpen(false)}
        title="Nuevo Producto"
        size="xl"
      >
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre del Producto"
              name="name"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
            />
            <Select
              label="Categoría"
              name="category_id"
              value={productForm.category_id}
              onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
              options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="SKU (opcional)"
              name="sku"
              value={productForm.sku}
              onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
            />
            <Input
              label="Presentación"
              name="presentation"
              value={productForm.presentation}
              onChange={(e) => setProductForm({ ...productForm, presentation: e.target.value })}
            />
          </div>

          <Textarea
            label="Descripción"
            name="description"
            value={productForm.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Marca"
              name="brand"
              value={productForm.brand}
              onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
            />
            <Select
              label="Estado de Disponibilidad"
              name="availability_status"
              value={productForm.availability_status}
              onChange={(e) => setProductForm({ ...productForm, availability_status: e.target.value })}
              options={[
                { value: 'IN_STOCK', label: 'En Stock' },
                { value: 'LOW_STOCK', label: 'Stock Bajo' },
                { value: 'OUT_OF_STOCK', label: 'Agotado' },
                { value: 'ON_REQUEST', label: 'Bajo Pedido' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Precio"
              name="price"
              type="number"
              step="0.01"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
            />
            <Input
              label="Cantidad en Stock"
              name="stock_qty"
              type="number"
              value={productForm.stock_qty}
              onChange={(e) => setProductForm({ ...productForm, stock_qty: e.target.value })}
            />
            <Input
              label="Umbral de Stock Bajo"
              name="low_stock_threshold"
              type="number"
              value={productForm.low_stock_threshold}
              onChange={(e) => setProductForm({ ...productForm, low_stock_threshold: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={productForm.is_featured}
                onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
              />
              <span className="text-sm text-gray-700">Producto destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={productForm.is_active}
                onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
              />
              <span className="text-sm text-gray-700">Activo</span>
            </label>
          </div>

          <ModalFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsProductModalOpen(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={submitting}>
              Crear Producto
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal: Nueva Promoción */}
      <Modal
        isOpen={isPromotionModalOpen}
        onClose={() => !submitting && setIsPromotionModalOpen(false)}
        title="Nueva Promoción"
        size="lg"
      >
        <form onSubmit={handlePromotionSubmit} className="space-y-4">
          <Input
            label="Título de la Promoción"
            name="title"
            value={promotionForm.title}
            onChange={(e) => setPromotionForm({ ...promotionForm, title: e.target.value })}
            required
          />

          <Textarea
            label="Descripción"
            name="description"
            value={promotionForm.description}
            onChange={(e) => setPromotionForm({ ...promotionForm, description: e.target.value })}
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fecha de Inicio"
              name="starts_at"
              type="datetime-local"
              value={promotionForm.starts_at}
              onChange={(e) => setPromotionForm({ ...promotionForm, starts_at: e.target.value })}
            />
            <Input
              label="Fecha de Fin"
              name="ends_at"
              type="datetime-local"
              value={promotionForm.ends_at}
              onChange={(e) => setPromotionForm({ ...promotionForm, ends_at: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Productos en Promoción
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
              {products.length > 0 ? (
                products.map((product) => (
                  <label key={product.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={promotionForm.product_ids.includes(product.id.toString())}
                      onChange={(e) => {
                        const ids = e.target.checked
                          ? [...promotionForm.product_ids, product.id.toString()]
                          : promotionForm.product_ids.filter(id => id !== product.id.toString());
                        setPromotionForm({ ...promotionForm, product_ids: ids });
                      }}
                      className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
                    />
                    <span className="text-sm text-gray-700">{product.name}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay productos disponibles</p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={promotionForm.is_active}
              onChange={(e) => setPromotionForm({ ...promotionForm, is_active: e.target.checked })}
              className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
            />
            <span className="text-sm text-gray-700">Promoción activa</span>
          </label>

          <ModalFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPromotionModalOpen(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={submitting}>
              Crear Promoción
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
