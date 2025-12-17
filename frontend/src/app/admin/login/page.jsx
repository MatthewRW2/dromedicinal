'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useAuth } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push('/admin');
      } else {
        setError(result.error || 'Credenciales inválidas');
      }
    } catch {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full gradient-brand flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">D</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Dromedicinal</h1>
            <p className="text-gray-500 mt-1">Panel Administrativo</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-brand-red-light text-brand-red text-sm rounded-lg">
                {error}
              </div>
            )}

            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@dromedicinal.com"
              autoComplete="email"
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />

            <Button type="submit" size="lg" loading={loading} fullWidth>
              Iniciar sesión
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Olvidaste tu contraseña?{' '}
            <a href="mailto:admin@dromedicinal.com" className="text-brand-blue hover:underline">
              Contacta al administrador
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}

