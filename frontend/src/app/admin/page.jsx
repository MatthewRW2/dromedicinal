'use client';

import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  IconPackage,
  IconCategories,
  IconPromotions,
  IconMail,
  IconEdit,
  IconOffer,
  IconPlus,
  IconReports,
  IconWarning,
} from '@/components/icons';

// Mock data para el dashboard
const stats = [
  { label: 'Productos Activos', value: '156', icon: IconPackage, color: 'bg-brand-blue-light text-brand-blue' },
  { label: 'Categorías', value: '12', icon: IconCategories, color: 'bg-brand-green-light text-brand-green' },
  { label: 'Promociones Activas', value: '3', icon: IconPromotions, color: 'bg-brand-orange-light text-amber-600' },
  { label: 'Mensajes Nuevos', value: '8', icon: IconMail, color: 'bg-purple-100 text-purple-600' },
];

const recentActivity = [
  { action: 'Producto actualizado', item: 'Acetaminofén 500mg', time: 'Hace 5 min', icon: IconEdit },
  { action: 'Nueva promoción', item: 'Navidad 2024', time: 'Hace 1 hora', icon: IconOffer },
  { action: 'Categoría creada', item: 'Vitaminas', time: 'Hace 2 horas', icon: IconCategories },
  { action: 'Mensaje recibido', item: 'consulta@email.com', time: 'Hace 3 horas', icon: IconMail },
];

const lowStockProducts = [
  { name: 'Loratadina 10mg', stock: 5, threshold: 10 },
  { name: 'Ibuprofeno 400mg', stock: 8, threshold: 15 },
  { name: 'Omeprazol 20mg', stock: 3, threshold: 10 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bienvenido al panel de administración de Dromedicinal</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} padding="md" className="hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500 truncate">{activity.item}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconWarning className="w-5 h-5 text-brand-orange" />
              Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-brand-orange-light rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.stock} unidades (mín: {product.threshold})
                    </p>
                  </div>
                  <button className="px-3 py-1 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    Reabastecer
                  </button>
                </div>
              ))}
            </div>
            {lowStockProducts.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Todos los productos tienen stock suficiente
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/productos/nuevo"
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-brand-blue-light/30 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-blue-light flex items-center justify-center">
                <IconPlus className="w-6 h-6 text-brand-blue" />
              </div>
              <span className="text-sm font-medium text-gray-700">Nuevo Producto</span>
            </a>
            <a
              href="/admin/promociones"
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-brand-blue-light/30 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-orange-light flex items-center justify-center">
                <IconOffer className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Nueva Promoción</span>
            </a>
            <a
              href="/admin/categorias"
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-brand-blue-light/30 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-green-light flex items-center justify-center">
                <IconCategories className="w-6 h-6 text-brand-green" />
              </div>
              <span className="text-sm font-medium text-gray-700">Categorías</span>
            </a>
            <a
              href="/admin/reportes"
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-brand-blue-light/30 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <IconReports className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Ver Reportes</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
