'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input, { Textarea, Select } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { publicAPI } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import {
  IconWhatsApp,
  IconPhone,
  IconMail,
  IconLocation,
  IconClock,
  IconMessage,
} from '@/components/icons';

const subjectOptions = [
  { value: 'consulta', label: 'Consulta general' },
  { value: 'pedido', label: 'Información sobre pedidos' },
  { value: 'servicio', label: 'Servicios de salud' },
  { value: 'otro', label: 'Otro' },
];

export default function ContactoPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settings, setSettings] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // Cargar settings al montar
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await publicAPI.getSettings();
        setSettings(response.data || {});
      } catch (error) {
        console.error('Error cargando settings:', error);
      } finally {
        setLoadingSettings(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await publicAPI.sendContact(formData);
      
      toast.success('¡Mensaje enviado! Te responderemos pronto.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error(error.message || 'Error al enviar el mensaje. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappNumber = (settings.whatsapp_number || '573001234567').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola%20Dromedicinal`;
  const phoneNumber = settings.phone || '(601) 123 4567';
  const email = settings.contact_email || 'contacto@dromedicinal.com';
  const address = settings.address || 'Calle 123 #45-67, Bogotá, Colombia';
  const businessHours = settings.business_hours || 'Lun-Sáb: 7am - 9pm | Dom: 8am - 2pm';
  const googleMapsUrl = settings.google_maps_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.8529!2d-74.0817!3d4.6097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzYnMzUuMCJOIDc0wrAwNCc1NC4xIlc!5e0!3m2!1ses!2sco!4v1234567890';

  return (
    <div className="py-8 lg:py-12">
      <div className="container-app">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Contáctanos
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ¿Tienes alguna pregunta o necesitas ayuda? Estamos aquí para servirte.
            Escríbenos y te responderemos lo más pronto posible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Nombre completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="correo@ejemplo.com"
                />
                <Input
                  label="Teléfono"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="300 123 4567"
                />
              </div>

              <Select
                label="Asunto"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                options={subjectOptions}
                required
              />

              <Textarea
                label="Mensaje"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="¿En qué podemos ayudarte?"
                rows={5}
              />

              <Button type="submit" size="lg" loading={loading} fullWidth>
                Enviar mensaje
              </Button>
            </form>
          </div>

          {/* Contact info */}
          <div className="space-y-8">
            {/* Quick contact */}
            <div className="bg-brand-blue-light rounded-xl p-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                ¿Prefieres contacto directo?
              </h2>
              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-whatsapp/10 flex items-center justify-center">
                    <IconWhatsApp className="w-5 h-5 text-whatsapp" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">WhatsApp</p>
                    <p className="text-sm text-gray-500">{settings.whatsapp_number || '300 123 4567'}</p>
                  </div>
                </a>
                <a
                  href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-blue-light flex items-center justify-center">
                    <IconPhone className="w-5 h-5 text-brand-blue" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Teléfono</p>
                    <p className="text-sm text-gray-500">{phoneNumber}</p>
                  </div>
                </a>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-green-light flex items-center justify-center">
                    <IconMail className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Correo</p>
                    <p className="text-sm text-gray-500">{email}</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-4">Ubicación</h2>
              {loadingSettings ? (
                <div className="bg-gray-200 rounded-xl aspect-video flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <div className="bg-gray-200 rounded-xl overflow-hidden aspect-video">
                  {/* Google Maps embed */}
                  <iframe
                    src={googleMapsUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación Dromedicinal"
                  />
                </div>
              )}
              <div className="mt-4 space-y-2 text-gray-600">
                <p className="flex items-center gap-2">
                  <IconLocation className="w-4 h-4 text-brand-blue" />
                  {address}
                </p>
                <p className="flex items-center gap-2">
                  <IconClock className="w-4 h-4 text-brand-blue" />
                  {businessHours}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
