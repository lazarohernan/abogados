'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { checkSupabaseConnection } from '@/lib/supabase';

export default function Register() {
  const router = useRouter();
  const { signUp, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    // Verificar conexión con Supabase al cargar
    const checkConnection = async () => {
      const isConnected = await checkSupabaseConnection();
      setStatus(isConnected ? 'Conectado a Supabase' : 'Error de conexión con Supabase');
    };
    checkConnection();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Iniciando registro...');

    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setStatus('Las contraseñas no coinciden');
      return;
    }

    try {
      setStatus('Registrando usuario...');
      console.log('Iniciando registro con datos:', {
        email: formData.email,
        fullName: formData.fullName
      });

      const result = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });

      console.log('Resultado del registro:', result);

      if (result.error) {
        setStatus(`Error: ${result.error}`);
        return;
      }

      if (result.user) {
        setStatus('Registro exitoso. Redirigiendo...');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error en registro:', err);
      setStatus(`Error inesperado: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Crear cuenta nueva
          </h2>
          {status && (
            <div className="mt-2 p-2 text-sm text-center rounded bg-blue-50 text-blue-600">
              {status}
            </div>
          )}
          {error && (
            <div className="mt-2 p-2 text-sm text-center rounded bg-red-50 text-red-600">
              {error}
            </div>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                minLength={6}
              />
            </div>
            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirmar contraseña"
                minLength={6}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Procesando...' : 'Crear cuenta'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
