'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { storage } from '@/lib/storage';

export default function Login() {
  const router = useRouter();
  const { signIn, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    setMounted(true);
    const savedEmail = storage.get('rememberedEmail');
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors((prev) => ({ ...prev, [e.target.name]: undefined })); // Limpia errores al escribir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newFormErrors: { email?: string; password?: string } = {};
    if (!formData.email) newFormErrors.email = 'El correo electrónico es obligatorio.';
    if (!formData.password) newFormErrors.password = 'La contraseña es obligatoria.';

    if (Object.keys(newFormErrors).length > 0) {
      setFormErrors(newFormErrors);
      return;
    }

    try {
      if (rememberMe) {
        storage.set('rememberedEmail', formData.email);
      } else {
        storage.remove('rememberedEmail');
      }

      await signIn({ email: formData.email, password: formData.password });
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error en el inicio de sesión:', err);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 m-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sección informativa */}
          <div className="md:w-1/2 space-y-6">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              LegalIA Honduras
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Bienvenido de nuevo
            </h2>
            <p className="mt-2 text-gray-600">
              Accede a tu cuenta para continuar con tus consultas legales.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-gray-700">Respuestas instantáneas</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-gray-700">Historial de consultas</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-gray-700">Soporte personalizado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de login */}
          <div className="md:w-1/2">
            <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Iniciar sesión
              </h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formErrors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formErrors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Recordarme
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                      {error.message || 'Error al iniciar sesión. Inténtalo de nuevo.'}
                    </p>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </button>
                </div>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
