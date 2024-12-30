'use client';

import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  profile: {
    full_name: string;
    email: string;
    subscription_status: 'trial' | 'active' | 'inactive';
    trial_end?: string | null;
  };
  activeSection: string; // Nueva propiedad
}

export default function DashboardLayout({ children, profile, activeSection }: DashboardLayoutProps) {
  const menuItems = [
    { id: 'chat', label: 'Chat', icon: '💬', href: '/dashboard' },
    { id: 'history', label: 'Historial', icon: '📚', href: '/dashboard/history' },
    { id: 'settings', label: 'Configuración', icon: '⚙️', href: '/dashboard/settings' },
    { id: 'subscription', label: 'Suscripción', icon: '💳', href: '/dashboard/subscription' },
  ];

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Menú lateral izquierdo */}
      <aside className="w-64 bg-white border-r shadow-md flex flex-col">
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

        {/* Menú de navegación */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-md transition ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Estado de suscripción y botón de cerrar sesión */}
        <div className="p-4 border-t mt-auto bg-gray-50">
          <p className="text-sm text-gray-600">
            Suscripción: <span className="font-medium">{profile.subscription_status}</span>
          </p>
          {profile.trial_end && (
            <p className="text-sm text-gray-600">
              Vence: {new Date(profile.trial_end).toLocaleDateString()}
            </p>
          )}
          <button
            onClick={() => console.log('Cerrar sesión')}
            className="text-red-600 text-sm hover:underline mt-4"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
