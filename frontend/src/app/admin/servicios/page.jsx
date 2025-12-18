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
import { IconPlus, IconEdit, IconTrash } from '@/components/icons';

export default function ServiciosPage() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.services.list();
      setServices(response.data || []);
    } catch (err) {
      console.error('Error cargando servicios:', err);
      toast.error('Error al cargar servicios');
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

      if (selectedService) {
        await adminAPI.services.update(selectedService.id, data);
        toast.success('Servicio actualizado exitosamente');
      } else {
        await adminAPI.services.create(data);
        toast.success('Servicio creado exitosamente');
      }

      setIsModalOpen(false);
      resetForm();
      loadServices();
    } catch (err) {
      console.error('Error guardando servicio:', err);
      toast.error(err.message || 'Error al guardar servicio');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      setSubmitting(true);
      await adminAPI.services.delete(selectedService.id);
      toast.success('Servicio eliminado exitosamente');
      setIsDeleteModalOpen(false);
      setSelectedService(null);
      loadServices();
    } catch (err) {
      console.error('Error eliminando servicio:', err);
      toast.error(err.message || 'Error al eliminar servicio');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedService(null);
    setFormData({
      title: '',
      description: '',
      icon: '',
      is_active: true,
      sort_order: 0,
    });
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      icon: service.icon || '',
      is_active: service.is_active !== false,
      sort_order: service.sort_order || 0,
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Servicios</h1>
          <p className="text-gray-500 mt-1">Gestiona los servicios ofrecidos</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          icon={<IconPlus className="w-5 h-5" />}
        >
          Nuevo Servicio
        </Button>
      </div>

      {/* Lista de servicios */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <LoadingState />
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay servicios creados</p>
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
                      Descripción
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
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{service.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2 max-w-md">
                          {service.description || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.sort_order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={service.is_active ? 'success' : 'secondary'}>
                          {service.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditModal(service)}
                            icon={<IconEdit className="w-4 h-4" />}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => openDeleteModal(service)}
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

      {/* Modal: Crear/Editar Servicio */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && (setIsModalOpen(false), resetForm())}
        title={selectedService ? 'Editar Servicio' : 'Nuevo Servicio'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Título del Servicio"
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
              label="Icono (opcional)"
              name="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="nombre-del-icono"
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
            <span className="text-sm text-gray-700">Servicio activo</span>
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
              {selectedService ? 'Actualizar' : 'Crear'} Servicio
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
          ¿Estás seguro de que deseas eliminar el servicio <strong>{selectedService?.title}</strong>?
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

