'use client';

import { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner, { LoadingState } from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { adminAPI } from '@/lib/api';
import { IconPlus, IconEdit, IconTrash, IconExternalLink } from '@/components/icons';

export default function EnlacesPage() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: '',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.links.list();
      setLinks(response.data || []);
    } catch (err) {
      console.error('Error cargando enlaces:', err);
      toast.error('Error al cargar enlaces');
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
        sort_order: parseInt(formData.sort_order) || 0,
      };

      if (selectedLink) {
        await adminAPI.links.update(selectedLink.id, data);
        toast.success('Enlace actualizado exitosamente');
      } else {
        await adminAPI.links.create(data);
        toast.success('Enlace creado exitosamente');
      }

      setIsModalOpen(false);
      resetForm();
      loadLinks();
    } catch (err) {
      console.error('Error guardando enlace:', err);
      toast.error(err.message || 'Error al guardar enlace');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLink) return;

    try {
      setSubmitting(true);
      await adminAPI.links.delete(selectedLink.id);
      toast.success('Enlace eliminado exitosamente');
      setIsDeleteModalOpen(false);
      setSelectedLink(null);
      loadLinks();
    } catch (err) {
      console.error('Error eliminando enlace:', err);
      toast.error(err.message || 'Error al eliminar enlace');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedLink(null);
    setFormData({
      title: '',
      url: '',
      category: '',
      is_active: true,
      sort_order: 0,
    });
  };

  const openEditModal = (link) => {
    setSelectedLink(link);
    setFormData({
      title: link.title || '',
      url: link.url || '',
      category: link.category || '',
      is_active: link.is_active !== false,
      sort_order: link.sort_order || 0,
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (link) => {
    setSelectedLink(link);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enlaces de Interés</h1>
          <p className="text-gray-500 mt-1">Gestiona los enlaces de interés</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          icon={<IconPlus className="w-5 h-5" />}
        >
          Nuevo Enlace
        </Button>
      </div>

      {/* Lista de enlaces */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <LoadingState />
          ) : links.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay enlaces creados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orden
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
                  {links.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{link.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-brand-blue hover:underline flex items-center gap-1"
                        >
                          {link.url.length > 50 ? `${link.url.substring(0, 50)}...` : link.url}
                          <IconExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.category || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.sort_order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={link.is_active ? 'success' : 'secondary'}>
                          {link.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditModal(link)}
                            icon={<IconEdit className="w-4 h-4" />}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => openDeleteModal(link)}
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

      {/* Modal: Crear/Editar Enlace */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && (setIsModalOpen(false), resetForm())}
        title={selectedLink ? 'Editar Enlace' : 'Nuevo Enlace'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Título del Enlace"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Input
            label="URL"
            name="url"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://ejemplo.com"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Categoría (opcional)"
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Ej: Regulatorio, Información"
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
            <span className="text-sm text-gray-700">Enlace activo</span>
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
              {selectedLink ? 'Actualizar' : 'Crear'} Enlace
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
          ¿Estás seguro de que deseas eliminar el enlace <strong>{selectedLink?.title}</strong>?
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

