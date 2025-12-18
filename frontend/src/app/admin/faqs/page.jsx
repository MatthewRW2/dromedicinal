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

export default function FAQsPage() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.faqs.list();
      setFaqs(response.data || []);
    } catch (err) {
      console.error('Error cargando FAQs:', err);
      toast.error('Error al cargar preguntas frecuentes');
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

      if (selectedFAQ) {
        await adminAPI.faqs.update(selectedFAQ.id, data);
        toast.success('FAQ actualizada exitosamente');
      } else {
        await adminAPI.faqs.create(data);
        toast.success('FAQ creada exitosamente');
      }

      setIsModalOpen(false);
      resetForm();
      loadFAQs();
    } catch (err) {
      console.error('Error guardando FAQ:', err);
      toast.error(err.message || 'Error al guardar FAQ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFAQ) return;

    try {
      setSubmitting(true);
      await adminAPI.faqs.delete(selectedFAQ.id);
      toast.success('FAQ eliminada exitosamente');
      setIsDeleteModalOpen(false);
      setSelectedFAQ(null);
      loadFAQs();
    } catch (err) {
      console.error('Error eliminando FAQ:', err);
      toast.error(err.message || 'Error al eliminar FAQ');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedFAQ(null);
    setFormData({
      question: '',
      answer: '',
      is_active: true,
      sort_order: 0,
    });
  };

  const openEditModal = (faq) => {
    setSelectedFAQ(faq);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      is_active: faq.is_active !== false,
      sort_order: faq.sort_order || 0,
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (faq) => {
    setSelectedFAQ(faq);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Preguntas Frecuentes</h1>
          <p className="text-gray-500 mt-1">Gestiona las preguntas frecuentes</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          icon={<IconPlus className="w-5 h-5" />}
        >
          Nueva FAQ
        </Button>
      </div>

      {/* Lista de FAQs */}
      {loading ? (
        <LoadingState />
      ) : faqs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No hay preguntas frecuentes creadas</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                      <Badge variant={faq.is_active ? 'success' : 'secondary'}>
                        {faq.is_active ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{faq.answer}</p>
                    <p className="text-xs text-gray-400">Orden: {faq.sort_order}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(faq)}
                      icon={<IconEdit className="w-4 h-4" />}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => openDeleteModal(faq)}
                      icon={<IconTrash className="w-4 h-4" />}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Crear/Editar FAQ */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && (setIsModalOpen(false), resetForm())}
        title={selectedFAQ ? 'Editar FAQ' : 'Nueva FAQ'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Pregunta"
            name="question"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            required
          />

          <Textarea
            label="Respuesta"
            name="answer"
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            rows={6}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Orden"
              name="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
            />
            <div className="flex items-center pt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
                />
                <span className="text-sm text-gray-700">FAQ activa</span>
              </label>
            </div>
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
              {selectedFAQ ? 'Actualizar' : 'Crear'} FAQ
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
          ¿Estás seguro de que deseas eliminar esta pregunta frecuente?
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

