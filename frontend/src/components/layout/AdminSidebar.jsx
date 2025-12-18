'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  IconHome,
  IconProducts,
  IconCategories,
  IconPromotions,
  IconServices,
  IconFAQ,
  IconLinks,
  IconUsers,
  IconReports,
  IconChevronDoubleLeft,
  IconChevronDoubleRight,
  IconLogout,
} from '@/components/icons';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: IconHome },
  { name: 'Productos', href: '/admin/productos', icon: IconProducts },
  { name: 'Categorías', href: '/admin/categorias', icon: IconCategories },
  { name: 'Promociones', href: '/admin/promociones', icon: IconPromotions },
  { name: 'Servicios', href: '/admin/servicios', icon: IconServices },
  { name: 'FAQs', href: '/admin/faqs', icon: IconFAQ },
  { name: 'Enlaces', href: '/admin/enlaces', icon: IconLinks },
  { name: 'Usuarios', href: '/admin/usuarios', icon: IconUsers },
  { name: 'Reportes', href: '/admin/reportes', icon: IconReports },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const sidebarWidth = collapsed ? 'w-20' : 'w-64';

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className={`h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${sidebarWidth}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-brand flex items-center justify-center shrink-0">
            <span className="text-white font-bold">D</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-gray-900">Dromedicinal</h1>
              <p className="text-xs text-gray-500">Panel Admin</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            const linkClasses = isActive
              ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors bg-brand-blue text-white'
              : 'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-gray-700 hover:bg-gray-100';

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={linkClasses}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info and actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {/* User info */}
        {!collapsed && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <Badge variant="info" className="mt-1 text-xs">
              {user.role_name || user.role}
            </Badge>
          </div>
        )}

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {collapsed ? (
            <IconChevronDoubleRight className="w-5 h-5" />
          ) : (
            <>
              <IconChevronDoubleLeft className="w-5 h-5" />
              <span className="text-sm">Colapsar</span>
            </>
          )}
        </button>

        {/* Logout button */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          fullWidth
          loading={loggingOut}
          icon={<IconLogout className="w-4 h-4" />}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          {!collapsed && 'Cerrar Sesión'}
        </Button>
      </div>
    </aside>
  );
}
