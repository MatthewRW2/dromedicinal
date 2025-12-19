'use client';

import { useState } from 'react';
import { siteConfig, getWhatsAppUrl } from '@/config/siteConfig';
import { trackPqrsSubmit } from '@/lib/track';
import { ButtonLink } from '@/components/ui/Button';
import { IconWhatsApp, IconFileText, IconCheckCircle } from '@/components/icons';

export default function PqrsPage() {
  const [formData, setFormData] = useState({
    type: 'peticion',
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Trackear envío
    trackPqrsSubmit({
      type: formData.type,
      has_attachment: false,
    });

    // Aquí se enviaría el formulario a la API
    // Por ahora, solo mostramos confirmación
    setSubmitted(true);
    
    // Resetear formulario después de 3 segundos
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        type: 'peticion',
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 5000);
  };

  const whatsappUrl = getWhatsAppUrl('Hola Dromedicinal, necesito hacer una PQRS.');

  if (submitted) {
    return (
      <div className="py-12 lg:py-16">
        <div className="container-app max-w-2xl">
          <div className="text-center">
            <IconCheckCircle className="w-16 h-16 text-brand-green mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Gracias por contactarnos!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Hemos recibido tu {formData.type === 'peticion' ? 'petición' : 
              formData.type === 'queja' ? 'queja' : 
              formData.type === 'reclamo' ? 'reclamo' : 'sugerencia'}. 
              Te responderemos a la brevedad posible.
            </p>
            <ButtonLink href="/" variant="primary" size="lg">
              Volver al inicio
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="container-app max-w-4xl">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          PQRS - Peticiones, Quejas, Reclamos y Sugerencias
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Estamos comprometidos con la atención y mejora continua. Utiliza este formulario 
          para enviarnos tus peticiones, quejas, reclamos o sugerencias.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de PQRS *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                >
                  <option value="peticion">Petición</option>
                  <option value="queja">Queja</option>
                  <option value="reclamo">Reclamo</option>
                  <option value="sugerencia">Sugerencia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Enviar PQRS
              </button>
            </form>
          </div>

          {/* Información adicional */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Información de contacto</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Teléfono:</strong> {siteConfig.phone.display}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>WhatsApp:</strong> {siteConfig.whatsapp.display}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Correo:</strong> {siteConfig.email}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tiempos de respuesta</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Peticiones: 15 días hábiles</li>
                  <li>• Quejas: 15 días hábiles</li>
                  <li>• Reclamos: 15 días hábiles</li>
                  <li>• Sugerencias: 5 días hábiles</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">También puedes contactarnos por:</h3>
                <ButtonLink
                  href={whatsappUrl}
                  variant="whatsapp"
                  size="md"
                  fullWidth
                  external
                  icon={<IconWhatsApp className="w-4 h-4" />}
                >
                  WhatsApp
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

