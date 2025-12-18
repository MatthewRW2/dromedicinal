'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authAPI, getToken, removeToken, hasToken } from './api';

/**
 * Contexto de autenticación para el panel admin con JWT
 */
const AuthContext = createContext(null);

/**
 * Provider de autenticación
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  // Redirigir si no está autenticado (excepto en login)
  useEffect(() => {
    if (!loading) {
      const isLoginPage = pathname === '/admin/login';
      
      if (!user && !isLoginPage) {
        // No autenticado y no está en login -> redirigir a login
        router.push('/admin/login');
      } else if (user && isLoginPage) {
        // Autenticado y está en login -> redirigir a dashboard
        router.push('/admin');
      }
    }
  }, [user, loading, pathname, router]);

  const checkAuth = async () => {
    // Si no hay token, no hay sesión
    if (!hasToken()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.me();
      setUser(response.data);
    } catch {
      // Token inválido o expirado
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(email, password);
      // El token ya se guarda en api.js
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignorar errores de logout
    } finally {
      setUser(null);
      router.push('/admin/login');
    }
  }, [router]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para acceder al contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

/**
 * Verificar si el usuario tiene un rol específico
 */
export function hasRole(user, roles) {
  if (!user || !user.role_name) return false;
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return allowedRoles.includes(user.role_name);
}

/**
 * Verificar permisos por ruta/acción
 */
export function canAccess(user, permission) {
  if (!user) return false;

  // Admin tiene acceso a todo
  if (user.role_name === 'admin') return true;

  const rolePermissions = {
    catalog_manager: [
      'products.view',
      'products.create',
      'products.edit',
      'products.delete',
      'categories.view',
      'categories.create',
      'categories.edit',
      'categories.delete',
      'images.upload',
    ],
    marketing: [
      'products.view',
      'promotions.view',
      'promotions.create',
      'promotions.edit',
      'promotions.delete',
    ],
    viewer: [
      'products.view',
      'categories.view',
      'promotions.view',
      'reports.view',
    ],
  };

  const permissions = rolePermissions[user.role_name] || [];
  return permissions.includes(permission);
}
