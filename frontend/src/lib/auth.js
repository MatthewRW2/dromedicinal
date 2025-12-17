'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from './api';

/**
 * Contexto de autenticación para el panel admin
 */
const AuthContext = createContext(null);

/**
 * Provider de autenticación
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar sesión al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.me();
      setUser(response.data);
    } catch {
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
      setUser(response.data);
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
    }
  }, []);

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
  if (!user || !user.role) return false;
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return allowedRoles.includes(user.role);
}

/**
 * Verificar permisos por ruta/acción
 */
export function canAccess(user, permission) {
  if (!user) return false;

  // Admin tiene acceso a todo
  if (user.role === 'admin') return true;

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

  const permissions = rolePermissions[user.role] || [];
  return permissions.includes(permission);
}

