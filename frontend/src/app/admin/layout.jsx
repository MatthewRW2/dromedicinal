'use client';

import { AuthProvider } from '@/lib/auth';
import AdminSidebar from '@/components/layout/AdminSidebar';

/**
 * Layout para el panel administrativo
 */
export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}

