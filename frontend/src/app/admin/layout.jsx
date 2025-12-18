'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Spinner from '@/components/ui/Spinner';

/**
 * Contenido del admin con protección de ruta
 */
function AdminContent({ children }) {
  const { user, loading, isAuthenticated, error } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si es la página de login, mostrar sin sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Si no está autenticado y no es login, el AuthProvider redirigirá
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  // Usuario autenticado - mostrar panel admin
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * Layout para el panel administrativo
 */
export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AdminContent>{children}</AdminContent>
    </AuthProvider>
  );
}
