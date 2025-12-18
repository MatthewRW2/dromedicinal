'use client';

import { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input, { Textarea } from '@/components/ui/Input';
import Spinner, { LoadingState } from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { adminAPI } from '@/lib/api';
import { IconPlus, IconEdit, IconTrash, IconPackage } from '@/components/icons';

export default function PromocionesPage() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    starts_at: '',
    ends_at: '',
    is_active: true,
    product_ids: [],
  });

  useEffect(() => {
    loadPromotions();
    loadProducts();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.promotions.list();
      setPromotions(response.data || []);
    } catch (err) {
      console.error('Error cargando promociones:', err);
      toast.error('Error al cargar promociones');
    } finally {
      setLoading(false);
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

  const loadPromotion = async (id) => {
    try {
      const response = await adminAPI.promotions.get(id);
      const promotion = response.data;
      setSelectedPromotion(promotion);
      setFormData({
        title: promotion.title || '',
        description: promotion.description || '',
        starts_at: promotion.starts_at ? new Date(promotion.starts_at).toISOString().slice(0, 16) : '',
        ends_at: promotion.ends_at ? new Date(promotion.ends_at).toISOString().slice(0, 16) : '',
        is_active: promotion.is_active !== false,
        product_ids: (promotion.products || []).map(p => p.id.toString()),
      });
    } catch (err) {
      console.error('Error cargando promoción:', err);
      toast.error('Error al cargar promoción');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...formData,
        starts_at: formData.starts_at || null,
        ends_at: formData.ends_at || null,
        product_ids: formData.product_ids.map(id => parseInt(id)),
      };

      if (selectedPromotion) {
        await adminAPI.promotions.update(selectedPromotion.id, data);
        toast.success('Promoción actualizada exitosamente');
      } else {
        await adminAPI.promotions.create(data);
        toast.success('Promoción creada exitosamente');
      }

      setIsModalOpen(false);
      resetForm();
      loadPromotions();
    } catch (err) {
      console.error('Error guardando promoción:', err);
      toast.error(err.message || 'Error al guardar promoción');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPromotion) return;

    try {
      setSubmitting(true);
      await adminAPI.promotions.delete(selectedPromotion.id);
      toast.success('Promoción eliminada exitosamente');
      setIsDeleteModalOpen(false);
      setSelectedPromotion(null);
      loadPromotions();
    } catch (err) {
      console.error('Error eliminando promoción:', err);
      toast.error(err.message || 'Error al eliminar promoción');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedPromotion(null);
    setFormData({
      title: '',
      description: '',
      starts_at: '',
      ends_at: '',
      is_active: true,
      product_ids: [],
    });
  };

  const openEditModal = async (promotion) => {
    await loadPromotion(promotion.id);
    setIsModalOpen(true);
  };

  const openDeleteModal = (promotion) => {
    setSelectedPromotion(promotion);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isActive = (promotion) => {
    if (!promotion.is_active) return false;
    const now = new Date();
    const starts = promotion.starts_at ? new Date(promotion.starts_at) : null;
    const ends = promotion.ends_at ? new Date(promotion.ends_at) : null;
    
    if (starts && now < starts) return false;
    if (ends && now > ends) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promociones</h1>
          <p className="text-gray-500 mt-1">Gestiona las promociones y ofertas</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          icon={<IconPlus className="w-5 h-5" />}
        >
          Nueva Promoción
        </Button>
      </div>

      {/* Lista de promociones */}
      {loading ? (
        <LoadingState />
      ) : promotions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No hay promociones creadas</p>
            <Button
              className="mt-4"
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
            >
              Crear Primera Promoción
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{promotion.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={isActive(promotion) ? 'success' : 'secondary'}>
                        {isActive(promotion) ? 'Activa' : 'Inactiva'}
                      </Badge>
                      {promotion.products && (
                        <Badge variant="info">
                          {promotion.products.length} producto{promotion.products.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {promotion.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{promotion.description}</p>
                )}
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  {promotion.starts_at && (
                    <div>
                      <span className="font-medium">Inicio:</span> {formatDate(promotion.starts_at)}
                    </div>
                  )}
                  {promotion.ends_at && (
                    <div>
                      <span className="font-medium">Fin:</span> {formatDate(promotion.ends_at)}
                    </div>
                  )}
                </div>

                {promotion.products && promotion.products.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">Productos:</p>
                    <div className="flex flex-wrap gap-1">
                      {promotion.products.slice(0, 3).map((product) => (
                        <span
                          key={product.id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                        >
                          <IconPackage className="w-3 h-3" />
                          {product.name}
                        </span>
                      ))}
                      {promotion.products.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{promotion.products.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(promotion)}
                    icon={<IconEdit className="w-4 h-4" />}
                    className="flex-1"
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => openDeleteModal(promotion)}
                    icon={<IconTrash className="w-4 h-4" />}
                  >
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Crear/Editar Promoción */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && (setIsModalOpen(false), resetForm())}
        title={selectedPromotion ? 'Editar Promoción' : 'Nueva Promoción'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Título de la Promoción"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Textarea
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fecha de Inicio"
              name="starts_at"
              type="datetime-local"
              value={formData.starts_at}
              onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
            />
            <Input
              label="Fecha de Fin"
              name="ends_at"
              type="datetime-local"
              value={formData.ends_at}
              onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Productos en Promoción
            </label>
            <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
              {products.length > 0 ? (
                products.map((product) => (
                  <label
                    key={product.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.product_ids.includes(product.id.toString())}
                      onChange={(e) => {
                        const ids = e.target.checked
                          ? [...formData.product_ids, product.id.toString()]
                          : formData.product_ids.filter((id) => id !== product.id.toString());
                        setFormData({ ...formData, product_ids: ids });
                      }}
                      className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
                    />
                    <span className="text-sm text-gray-700">{product.name}</span>
                    {product.presentation && (
                      <span className="text-xs text-gray-500">({product.presentation})</span>
                    )}
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay productos disponibles</p>
              )}
            </div>
            {formData.product_ids.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {formData.product_ids.length} producto{formData.product_ids.length !== 1 ? 's' : ''} seleccionado{formData.product_ids.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
            />
            <span className="text-sm text-gray-700">Promoción activa</span>
          </label>

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
              {selectedPromotion ? 'Actualizar' : 'Crear'} Promoción
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
          ¿Estás seguro de que deseas eliminar la promoción <strong>{selectedPromotion?.title}</strong>?
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

