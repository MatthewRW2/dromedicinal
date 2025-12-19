'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { siteConfig, getWhatsAppUrl } from '@/config/siteConfig';
import { intentionCart, getCartOrderLink } from '@/lib/whatsapp';
import { track } from '@/lib/track';
import { ButtonLink } from '@/components/ui/Button';
import {
  IconWhatsApp,
  IconRappi,
  IconTrash,
  IconPlus,
  IconMinus,
  IconShoppingCart,
  IconAlertCircle,
  IconFileText,
} from '@/components/icons';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState('');
  const [observations, setObservations] = useState('');
  const [hasPrescriptionItems, setHasPrescriptionItems] = useState(false);

  useEffect(() => {
    // Cargar items del carrito
    const items = intentionCart.getItems();
    setCartItems(items);
    
    // Verificar si hay productos que requieren receta
    // Nota: Esto requiere que el producto tenga requires_prescription en el modelo
    // Por ahora, verificamos si algún item tiene una marca especial o nombre que indique Rx
    const hasRx = items.some(item => 
      item.requires_prescription || 
      item.name?.toLowerCase().includes('formulado') ||
      item.category?.toLowerCase().includes('formulado')
    );
    setHasPrescriptionItems(hasRx);
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    const updated = intentionCart.updateQuantity(productId, newQuantity);
    setCartItems(updated);
    track('update_cart_item', { productId, quantity: newQuantity });
  };

  const removeItem = (productId) => {
    const updated = intentionCart.removeItem(productId);
    setCartItems(updated);
    track('remove_from_cart', { productId });
  };

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    // Construir información adicional
    const additionalInfo = {
      address: deliveryAddress,
      neighborhood: deliveryNeighborhood,
      observations: observations,
    };

    // Generar mensaje de WhatsApp (ya incluye aviso de fórmula si aplica)
    const whatsappLink = getCartOrderLink(cartItems, additionalInfo);
    
    // Trackear evento de conversión
    track('submit_whatsapp_order', {
      items_count: cartItems.length,
      has_prescription: hasPrescriptionItems,
      total_value: cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0),
      delivery_neighborhood: deliveryNeighborhood || '',
    });

    // Abrir WhatsApp
    window.open(whatsappLink, '_blank');
  };

  const handleRappiOrder = () => {
    if (!siteConfig.orderChannels.rappi.url || siteConfig.orderChannels.rappi.url === '#') {
      alert('El servicio de Rappi no está disponible en este momento.');
      return;
    }
    
    track('click_rappi', { source: 'cart' });
    window.open(siteConfig.orderChannels.rappi.url, '_blank');
  };

  const totalValue = cartItems.reduce(
    (sum, item) => sum + ((item.price || 0) * (item.quantity || 1)),
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="py-12 lg:py-16">
        <div className="container-app">
          <div className="max-w-md mx-auto text-center">
            <IconShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
            <p className="text-gray-600 mb-8">
              Agrega productos desde nuestro catálogo para hacer tu pedido.
            </p>
            <ButtonLink href="/catalogo" variant="primary" size="lg">
              Explorar catálogo
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="container-app">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de pedido</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-6 flex gap-4"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                  {item.presentation && (
                    <p className="text-sm text-gray-500 mb-2">{item.presentation}</p>
                  )}
                  {item.price && (
                    <p className="text-lg font-semibold text-brand-blue">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                      }).format(item.price)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                    className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    aria-label="Reducir cantidad"
                  >
                    <IconMinus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{item.quantity || 1}</span>
                  <button
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                    className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <IconPlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-8 h-8 rounded-lg border border-red-300 text-red-600 flex items-center justify-center hover:bg-red-50 transition-colors"
                    aria-label="Eliminar producto"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen y checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del pedido</h2>

              {/* Alerta de medicamentos formulados */}
              {hasPrescriptionItems && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <IconAlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900 mb-1">
                        Medicamentos formulados
                      </p>
                      <p className="text-sm text-amber-700">
                        Tu pedido incluye medicamentos que requieren fórmula médica. 
                        Por favor, adjunta la receta médica cuando envíes el mensaje por WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario de entrega */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barrio de entrega
                  </label>
                  <select
                    value={deliveryNeighborhood}
                    onChange={(e) => setDeliveryNeighborhood(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                  >
                    <option value="">Selecciona un barrio</option>
                    {siteConfig.coverageAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                    <option value="otro">Otro (especificar en observaciones)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección de entrega
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Ej: Calle 123 # 45-67, Apto 301"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones (opcional)
                  </label>
                  <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Instrucciones especiales, horario preferido, etc."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                  />
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total estimado:</span>
                  <span className="text-2xl font-bold text-brand-blue">
                    {totalValue > 0
                      ? new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          minimumFractionDigits: 0,
                        }).format(totalValue)
                      : 'Consultar precio'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  * El precio final será confirmado por WhatsApp
                </p>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-whatsapp hover:bg-whatsapp-dark text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <IconWhatsApp className="w-5 h-5" />
                  Finalizar pedido por WhatsApp
                </button>

                {siteConfig.orderChannels.rappi.enabled && siteConfig.orderChannels.rappi.url && (
                  <button
                    onClick={handleRappiOrder}
                    className="w-full bg-rappi hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-opacity"
                  >
                    <IconRappi className="w-5 h-5" />
                    Pedir por Rappi
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Al hacer clic, se abrirá WhatsApp con tu pedido prellenado
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

