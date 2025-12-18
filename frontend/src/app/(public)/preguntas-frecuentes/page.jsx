'use client';

import { useState, useEffect } from 'react';
import { IconChevronDown, IconWhatsApp } from '@/components/icons';
import { publicAPI } from '@/lib/api';
import { getSettings } from '@/lib/settings';
import Spinner from '@/components/ui/Spinner';

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg"
      >
        <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
        <IconChevronDown 
          className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="pb-5 animate-fade-in">
          <p className="text-gray-600">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openId, setOpenId] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('573001234567');

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const faqsRes = await publicAPI.getFAQs();
        
        // Obtener settings desde la API
        let settings = {};
        try {
          const settingsRes = await publicAPI.getSettings();
          settings = settingsRes.data || {};
        } catch (err) {
          // Ignorar error de settings
        }

        let faqsData = faqsRes.data || [];
        
        // Filtrar solo FAQs activos
        faqsData = faqsData.filter(faq => faq.is_active !== false);
        
        // Ordenar por campo order si existe
        faqsData.sort((a, b) => (a.order || 0) - (b.order || 0));
        
        setFaqs(faqsData);
        
        if (settings?.whatsapp_number) {
          setWhatsappNumber(settings.whatsapp_number.replace(/[^0-9]/g, ''));
        }
      } catch (error) {
        console.error('Error cargando FAQs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFAQs();
  }, []);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola%20Dromedicinal%2C%20tengo%20una%20pregunta`;

  return (
    <div className="py-8 lg:py-12">
      <div className="container-app max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-gray-600">
            Encuentra respuestas a las preguntas más comunes. Si no encuentras 
            lo que buscas, no dudes en contactarnos.
          </p>
        </div>

        {/* FAQ List */}
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500">Cargando preguntas frecuentes...</p>
          </div>
        ) : faqs.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
            <div className="p-6 lg:p-8">
              {faqs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openId === faq.id}
                  onToggle={() => toggleFAQ(faq.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No hay preguntas frecuentes disponibles en este momento.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center p-8 bg-brand-blue-light rounded-xl">
          <h2 className="font-semibold text-gray-900 mb-2">
            ¿Tienes otra pregunta?
          </h2>
          <p className="text-gray-600 mb-4">
            Escríbenos por WhatsApp y te ayudamos con gusto.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-whatsapp text-white font-medium rounded-lg hover:bg-whatsapp-dark transition-colors"
          >
            <IconWhatsApp className="w-5 h-5" />
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
