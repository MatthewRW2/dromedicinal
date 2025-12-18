'use client';

import { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Spinner, { LoadingState } from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { adminAPI } from '@/lib/api';
import {
  IconPackage,
  IconCategories,
  IconPromotions,
  IconWarning,
  IconMail,
} from '@/components/icons';

export default function ReportesPage() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [contactMeta, setContactMeta] = useState(null);
  const [contactStats, setContactStats] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);

      const [summaryRes, lowStockRes, contactRes] = await Promise.all([
        adminAPI.reports.catalogSummary(),
        adminAPI.reports.lowStock(),
        adminAPI.reports.contactMessages({ per_page: 10 }),
      ]);

      setSummary(summaryRes.data);
      setLowStock(lowStockRes.data || []);
      setContactMessages(contactRes.data?.messages || []);
      setContactMeta(contactRes.meta);
      setContactStats(contactRes.data?.stats);
    } catch (err) {
      console.error('Error cargando reportes:', err);
      toast.error('Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState text="Cargando reportes..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
        <p className="text-gray-500 mt-1">Resumen y estadísticas del sistema</p>
      </div>

      {/* Resumen del Catálogo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPackage className="w-5 h-5" />
            Resumen del Catálogo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {summary ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total de Productos</p>
                <p className="text-2xl font-bold text-gray-900">{summary.total || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Productos Activos</p>
                <p className="text-2xl font-bold text-green-600">{summary.active || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Productos Inactivos</p>
                <p className="text-2xl font-bold text-gray-500">{summary.inactive || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Productos Destacados</p>
                <p className="text-2xl font-bold text-brand-blue">{summary.featured || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">En Stock</p>
                <p className="text-2xl font-bold text-green-600">{summary.in_stock || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Stock Bajo</p>
                <p className="text-2xl font-bold text-orange-600">{summary.low_stock || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Agotados</p>
                <p className="text-2xl font-bold text-red-600">{summary.out_of_stock || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Categorías</p>
                <p className="text-2xl font-bold text-gray-900">{summary.total_categories || 0}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No hay datos disponibles</p>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Productos con Stock Bajo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconWarning className="w-5 h-5 text-brand-orange" />
              Productos con Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStock.length > 0 ? (
              <div className="space-y-3">
                {lowStock.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-brand-orange-light rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        {product.stock_qty} unidades (mín: {product.low_stock_threshold})
                      </p>
                    </div>
                    <Badge variant="warning">Stock Bajo</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                Todos los productos tienen stock suficiente
              </p>
            )}
          </CardContent>
        </Card>

        {/* Mensajes de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconMail className="w-5 h-5" />
              Mensajes de Contacto Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contactStats && (
              <div className="mb-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{contactStats.new_count || 0}</p>
                  <p className="text-xs text-gray-500">Nuevos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{contactStats.read_count || 0}</p>
                  <p className="text-xs text-gray-500">Leídos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-500">{contactStats.archived_count || 0}</p>
                  <p className="text-xs text-gray-500">Archivados</p>
                </div>
              </div>
            )}

            {contactMessages.length > 0 ? (
              <div className="space-y-3">
                {contactMessages.map((message) => (
                  <div
                    key={message.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{message.name}</p>
                        <p className="text-sm text-gray-500">{message.email || message.phone}</p>
                      </div>
                      <Badge
                        variant={
                          message.status === 'NEW'
                            ? 'info'
                            : message.status === 'READ'
                            ? 'success'
                            : 'secondary'
                        }
                      >
                        {message.status === 'NEW'
                          ? 'Nuevo'
                          : message.status === 'READ'
                          ? 'Leído'
                          : 'Archivado'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(message.created_at).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No hay mensajes recientes</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

