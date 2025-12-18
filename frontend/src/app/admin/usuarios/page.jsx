'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input, { Select } from '@/components/ui/Input';
import Spinner, { LoadingState } from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { adminAPI } from '@/lib/api';
import { IconPlus, IconEdit, IconTrash } from '@/components/icons';

export default function UsuariosPage() {
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: '',
    is_active: true,
  });

  useEffect(() => {
    // Solo admin puede ver esta página
    if (currentUser?.role_name !== 'admin') {
      return;
    }
    loadUsers();
    loadRoles();
  }, [currentUser]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.users.list();
      setUsers(response.data || []);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      // Los roles vienen del backend, pero por ahora usamos los definidos
      setRoles([
        { id: 1, name: 'admin', description: 'Administrador' },
        { id: 2, name: 'catalog_manager', description: 'Gestor de Catálogo' },
        { id: 3, name: 'marketing', description: 'Marketing' },
        { id: 4, name: 'viewer', description: 'Solo Lectura' },
      ]);
    } catch (err) {
      console.error('Error cargando roles:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...formData,
        role_id: parseInt(formData.role_id),
      };

      // Si es edición, no enviar password si está vacío
      if (selectedUser && !formData.password) {
        delete data.password;
      }

      if (selectedUser) {
        await adminAPI.users.update(selectedUser.id, data);
        toast.success('Usuario actualizado exitosamente');
      } else {
        await adminAPI.users.create(data);
        toast.success('Usuario creado exitosamente');
      }

      setIsModalOpen(false);
      resetForm();
      loadUsers();
    } catch (err) {
      console.error('Error guardando usuario:', err);
      toast.error(err.message || 'Error al guardar usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      setSubmitting(true);
      await adminAPI.users.delete(selectedUser.id);
      toast.success('Usuario eliminado exitosamente');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (err) {
      console.error('Error eliminando usuario:', err);
      toast.error(err.message || 'Error al eliminar usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role_id: '',
      is_active: true,
    });
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role_id: user.role_id?.toString() || '',
      is_active: user.is_active !== false,
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Verificar permisos
  if (currentUser?.role_name !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">No tienes permisos para acceder a esta sección</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-500 mt-1">Gestiona los usuarios del sistema</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          icon={<IconPlus className="w-5 h-5" />}
        >
          Nuevo Usuario
        </Button>
      </div>

      {/* Lista de usuarios */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <LoadingState />
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay usuarios registrados</p>
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
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último Acceso
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="info">{user.role_name || 'Sin rol'}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={user.is_active ? 'success' : 'secondary'}>
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.last_login_at
                          ? new Date(user.last_login_at).toLocaleDateString('es-CO')
                          : 'Nunca'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditModal(user)}
                            icon={<IconEdit className="w-4 h-4" />}
                          >
                            Editar
                          </Button>
                          {user.id !== currentUser?.id && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => openDeleteModal(user)}
                              icon={<IconTrash className="w-4 h-4" />}
                            >
                              Eliminar
                            </Button>
                          )}
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

      {/* Modal: Crear/Editar Usuario */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && (setIsModalOpen(false), resetForm())}
        title={selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre Completo"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={!!selectedUser}
          />

          <Input
            label={selectedUser ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña'}
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!selectedUser}
            minLength={8}
          />

          <Select
            label="Rol"
            name="role_id"
            value={formData.role_id}
            onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
            options={roles.map(role => ({
              value: role.id.toString(),
              label: role.description || role.name,
            }))}
            required
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
            />
            <span className="text-sm text-gray-700">Usuario activo</span>
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
              {selectedUser ? 'Actualizar' : 'Crear'} Usuario
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
          ¿Estás seguro de que deseas eliminar el usuario <strong>{selectedUser?.name}</strong>?
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

