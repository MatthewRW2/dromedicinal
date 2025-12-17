'use client';

import { useState } from 'react';
import { IconChevronDown, IconWhatsApp } from '@/components/icons';

const faqs = [
  {
    id: 1,
    question: '¿Cómo puedo hacer un pedido?',
    answer: 'Puedes hacer tu pedido de varias formas: escribiéndonos por WhatsApp al 300 123 4567, a través de Rappi, o visitando nuestra tienda física. También puedes navegar nuestro catálogo en línea y usar el botón "Pedir por WhatsApp" en cualquier producto.',
  },
  {
    id: 2,
    question: '¿Realizan domicilios?',
    answer: 'Sí, realizamos domicilios en Bogotá. El costo y tiempo de entrega dependen de la zona. Contáctanos por WhatsApp para más información sobre cobertura y tarifas.',
  },
  {
    id: 3,
    question: '¿Cuál es el horario de atención?',
    answer: 'Nuestro horario es: Lunes a Sábado de 7:00 AM a 9:00 PM, Domingos y Festivos de 8:00 AM a 2:00 PM. El servicio de domicilios tiene el mismo horario.',
  },
  {
    id: 4,
    question: '¿Necesito fórmula médica para comprar medicamentos?',
    answer: 'Algunos medicamentos requieren fórmula médica según la regulación del INVIMA. Los medicamentos de venta libre no la necesitan. Si tienes dudas sobre un producto específico, consúltanos.',
  },
  {
    id: 5,
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos efectivo, tarjetas débito y crédito, transferencias bancarias y pagos por Nequi o Daviplata. Para domicilios también puedes pagar contra entrega.',
  },
  {
    id: 6,
    question: '¿Puedo devolver un producto?',
    answer: 'Por normativa sanitaria, los medicamentos no tienen cambio ni devolución una vez dispensados. Para otros productos, contáctanos dentro de las primeras 24 horas presentando la factura.',
  },
  {
    id: 7,
    question: '¿Ofrecen servicio de inyectología?',
    answer: 'Sí, contamos con servicio de inyectología profesional. Aplicamos medicamentos con todas las medidas de bioseguridad. Este servicio está disponible en horario de atención.',
  },
  {
    id: 8,
    question: '¿Cómo puedo consultar la disponibilidad de un producto?',
    answer: 'La forma más rápida es escribirnos por WhatsApp con el nombre del producto. También puedes llamarnos o visitar nuestra tienda. Actualizamos constantemente nuestro inventario.',
  },
];

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

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

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

        {/* CTA */}
        <div className="mt-8 text-center p-8 bg-brand-blue-light rounded-xl">
          <h2 className="font-semibold text-gray-900 mb-2">
            ¿Tienes otra pregunta?
          </h2>
          <p className="text-gray-600 mb-4">
            Escríbenos por WhatsApp y te ayudamos con gusto.
          </p>
          <a
            href="https://wa.me/573001234567?text=Hola%20Dromedicinal%2C%20tengo%20una%20pregunta"
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
