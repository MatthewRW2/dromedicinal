'use client';

import { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input, { Textarea, Select } from '@/components/ui/Input';
import Spinner, { LoadingState } from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { adminAPI } from '@/lib/api';
import { IconPlus, IconEdit, IconTrash } from '@/components/icons';

export default function CategoriasPage() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    parent_id: '',
    description: '',
    image_path: '',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.categories.list();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error cargando categorías:', err);
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...formData,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
        sort_order: parseInt(formData.sort_order) || 0,
      };

      if (selectedCategory) {
        await adminAPI.categories.update(selectedCategory.id, data);
        toast.success('Categoría actualizada exitosamente');
      } else {
        await adminAPI.categories.create(data);
        toast.success('Categoría creada exitosamente');
      }

      setIsModalOpen(false);
      resetForm();
      loadCategories();
    } catch (err) {
      console.error('Error guardando categoría:', err);
      toast.error(err.message || 'Error al guardar categoría');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      setSubmitting(true);
      await adminAPI.categories.delete(selectedCategory.id);
      toast.success('Categoría eliminada exitosamente');
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      loadCategories();
    } catch (err) {
      console.error('Error eliminando categoría:', err);
      toast.error(err.message || 'Error al eliminar categoría');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setFormData({
      name: '',
      parent_id: '',
      description: '',
      image_path: '',
      is_active: true,
      sort_order: 0,
    });
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      parent_id: category.parent_id?.toString() || '',
      description: category.description || '',
      image_path: category.image_path || '',
      is_active: category.is_active !== false,
      sort_order: category.sort_order || 0,
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const getRootCategories = () => {
    return categories.filter(cat => !cat.parent_id);
  };

  const getChildCategories = (parentId) => {
    return categories.filter(cat => cat.parent_id === parentId);
  };

  const buildCategoryTree = (parentId = null, level = 0) => {
    const children = categories.filter(cat => cat.parent_id === parentId);
    return children.map(cat => ({
      ...cat,
      level,
      children: buildCategoryTree(cat.id, level + 1),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-500 mt-1">Gestiona las categorías del catálogo</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          icon={<IconPlus className="w-5 h-5" />}
        >
          Nueva Categoría
        </Button>
      </div>

      {/* Lista de categorías */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <LoadingState />
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay categorías creadas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría Padre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Productos
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
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.slug}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.parent_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.product_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={category.is_active ? 'success' : 'secondary'}>
                          {category.is_active ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditModal(category)}
                            icon={<IconEdit className="w-4 h-4" />}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => openDeleteModal(category)}
                            icon={<IconTrash className="w-4 h-4" />}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal: Crear/Editar Categoría */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && (setIsModalOpen(false), resetForm())}
        title={selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre de la Categoría"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Select
            label="Categoría Padre (opcional)"
            name="parent_id"
            value={formData.parent_id}
            onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
            placeholder="Ninguna (categoría principal)"
            options={[
              { value: '', label: 'Ninguna (categoría principal)' },
              ...categories
                .filter(cat => !cat.parent_id && (!selectedCategory || cat.id !== selectedCategory.id))
                .map(cat => ({ value: cat.id.toString(), label: cat.name })),
            ]}
          />

          <Textarea
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Ruta de Imagen (opcional)"
              name="image_path"
              value={formData.image_path}
              onChange={(e) => setFormData({ ...formData, image_path: e.target.value })}
              placeholder="/images/categoria.jpg"
            />
            <Input
              label="Orden"
              name="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
            />
            <span className="text-sm text-gray-700">Categoría activa</span>
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
              {selectedCategory ? 'Actualizar' : 'Crear'} Categoría
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
          ¿Estás seguro de que deseas eliminar la categoría <strong>{selectedCategory?.name}</strong>?
          {selectedCategory?.product_count > 0 && (
            <span className="block mt-2 text-red-600">
              Esta categoría tiene {selectedCategory.product_count} producto(s) asociado(s).
            </span>
          )}
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

