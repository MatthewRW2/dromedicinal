'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input, { Textarea, Select } from '@/components/ui/Input';
import Spinner, { LoadingState } from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { adminAPI } from '@/lib/api';
import { IconPlus, IconEdit, IconTrash, IconSearch, IconPackage } from '@/components/icons';

export default function ProductosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    per_page: 20,
    q: '',
    category_id: '',
    is_active: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    loadCategories();
    const editId = searchParams.get('edit');
    if (editId) {
      loadProduct(parseInt(editId));
      setIsModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = { ...filters };
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) delete params[key];
      });
      
      const response = await adminAPI.products.list(params);
      setProducts(response.data || []);
      setMeta(response.meta);
    } catch (err) {
      console.error('Error cargando productos:', err);
      toast.error('Error al cargar productos');
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

  const loadProduct = async (id) => {
    try {
      const response = await adminAPI.products.get(id);
      const product = response.data;
      setSelectedProduct(product);
      setFormData({
        name: product.name || '',
        category_id: product.category_id?.toString() || '',
        sku: product.sku || '',
        presentation: product.presentation || '',
        description: product.description || '',
        brand: product.brand || '',
        price: product.price?.toString() || '',
        currency: product.currency || 'COP',
        availability_status: product.availability_status || 'IN_STOCK',
        stock_qty: product.stock_qty?.toString() || '',
        low_stock_threshold: product.low_stock_threshold?.toString() || '',
        is_featured: product.is_featured || false,
        is_active: product.is_active !== false,
      });
    } catch (err) {
      console.error('Error cargando producto:', err);
      toast.error('Error al cargar producto');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...formData,
        category_id: parseInt(formData.category_id),
        price: formData.price ? parseFloat(formData.price) : null,
        stock_qty: formData.stock_qty ? parseInt(formData.stock_qty) : null,
        low_stock_threshold: formData.low_stock_threshold ? parseInt(formData.low_stock_threshold) : null,
      };

      if (selectedProduct) {
        await adminAPI.products.update(selectedProduct.id, data);
        toast.success('Producto actualizado exitosamente');
      } else {
        await adminAPI.products.create(data);
        toast.success('Producto creado exitosamente');
      }

      setIsModalOpen(false);
      resetForm();
      loadProducts();
    } catch (err) {
      console.error('Error guardando producto:', err);
      toast.error(err.message || 'Error al guardar producto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      setSubmitting(true);
      await adminAPI.products.delete(selectedProduct.id);
      toast.success('Producto eliminado exitosamente');
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (err) {
      console.error('Error eliminando producto:', err);
      toast.error(err.message || 'Error al eliminar producto');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setFormData({
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
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      category_id: product.category_id?.toString() || '',
      sku: product.sku || '',
      presentation: product.presentation || '',
      description: product.description || '',
      brand: product.brand || '',
      price: product.price?.toString() || '',
      currency: product.currency || 'COP',
      availability_status: product.availability_status || 'IN_STOCK',
      stock_qty: product.stock_qty?.toString() || '',
      low_stock_threshold: product.low_stock_threshold?.toString() || '',
      is_featured: product.is_featured || false,
      is_active: product.is_active !== false,
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const getAvailabilityBadge = (status) => {
    const badges = {
      IN_STOCK: { label: 'En Stock', variant: 'success' },
      LOW_STOCK: { label: 'Stock Bajo', variant: 'warning' },
      OUT_OF_STOCK: { label: 'Agotado', variant: 'danger' },
      ON_REQUEST: { label: 'Bajo Pedido', variant: 'info' },
    };
    return badges[status] || badges.IN_STOCK;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500 mt-1">Gestiona el catálogo de productos</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          icon={<IconPlus className="w-5 h-5" />}
        >
          Nuevo Producto
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Buscar productos..."
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value, page: 1 })}
              icon={<IconSearch className="w-4 h-4" />}
            />
            <Select
              placeholder="Todas las categorías"
              value={filters.category_id}
              onChange={(e) => setFilters({ ...filters, category_id: e.target.value, page: 1 })}
              options={[
                { value: '', label: 'Todas las categorías' },
                ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name })),
              ]}
            />
            <Select
              placeholder="Todos los estados"
              value={filters.is_active}
              onChange={(e) => setFilters({ ...filters, is_active: e.target.value, page: 1 })}
              options={[
                { value: '', label: 'Todos los estados' },
                { value: '1', label: 'Activos' },
                { value: '0', label: 'Inactivos' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de productos */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <LoadingState />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Disponibilidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => {
                      const availability = getAvailabilityBadge(product.availability_status);
                      return (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              {product.presentation && (
                                <div className="text-sm text-gray-500">{product.presentation}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category_name || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.price ? `$${parseFloat(product.price).toLocaleString('es-CO')}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={availability.variant}>{availability.label}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={product.is_active ? 'success' : 'secondary'}>
                              {product.is_active ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditModal(product)}
                                icon={<IconEdit className="w-4 h-4" />}
                              >
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => openDeleteModal(product)}
                                icon={<IconTrash className="w-4 h-4" />}
                              >
                                Eliminar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {meta && meta.total_pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Mostrando {((meta.page - 1) * meta.per_page) + 1} a {Math.min(meta.page * meta.per_page, meta.total)} de {meta.total}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                      disabled={filters.page === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                      disabled={filters.page >= meta.total_pages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal: Crear/Editar Producto */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && (setIsModalOpen(false), resetForm())}
        title={selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre del Producto"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Select
              label="Categoría"
              name="category_id"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              options={categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="SKU (opcional)"
              name="sku"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            />
            <Input
              label="Presentación"
              name="presentation"
              value={formData.presentation}
              onChange={(e) => setFormData({ ...formData, presentation: e.target.value })}
            />
          </div>

          <Textarea
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Marca"
              name="brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
            <Select
              label="Estado de Disponibilidad"
              name="availability_status"
              value={formData.availability_status}
              onChange={(e) => setFormData({ ...formData, availability_status: e.target.value })}
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
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <Input
              label="Cantidad en Stock"
              name="stock_qty"
              type="number"
              value={formData.stock_qty}
              onChange={(e) => setFormData({ ...formData, stock_qty: e.target.value })}
            />
            <Input
              label="Umbral de Stock Bajo"
              name="low_stock_threshold"
              type="number"
              value={formData.low_stock_threshold}
              onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
              />
              <span className="text-sm text-gray-700">Producto destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
              />
              <span className="text-sm text-gray-700">Activo</span>
            </label>
          </div>

          <ModalFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={submitting}>
              {selectedProduct ? 'Actualizar' : 'Crear'} Producto
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal: Confirmar Eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !submitting && setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <p className="text-gray-600">
          ¿Estás seguro de que deseas eliminar el producto <strong>{selectedProduct?.name}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <ModalFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            loading={submitting}
          >
            Eliminar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

