'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  profile: {
    full_name: string;
    email: string;
    subscription_status: 'trial' | 'active' | 'inactive';
    trial_end?: string | null;
  };
}

export default function DashboardLayout({ children, profile }: DashboardLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }); // Ajusta según tu lógica de cierre de sesión
    router.push('/login');
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar izquierdo */}
      <aside className="w-64 bg-gray-100 border-r shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold text-blue-600">LegalIA</h2>
        </div>

        {/* Información del usuario */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {profile.full_name[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-800">{profile.full_name}</div>
              <div className="text-sm text-gray-500">{profile.email}</div>
            </div>
          </div>
        </div>

        {/* Estado de la suscripción */}
        <div className="p-4 border-b bg-gray-50">
          <p className="text-sm text-gray-600">
            Suscripción: <span className="font-medium">{profile.subscription_status}</span>
          </p>
          {profile.trial_end && (
            <p className="text-sm text-gray-600">
              Vence: {new Date(profile.trial_end).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Botón de cerrar sesión */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="text-red-600 text-sm hover:underline"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Sidebar derecho */}
      <aside className="w-64 bg-gray-50 border-l shadow-md">
        <div className="p-4">
          <h3 className="text-lg font-semibold">Opciones adicionales</h3>
          <ul className="mt-4 space-y-2">
            <li>
              <button className="w-full text-left px-4 py-2 text-sm rounded-md hover:bg-gray-200">
                Ayuda
              </button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 text-sm rounded-md hover:bg-gray-200">
                Configuración avanzada
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
