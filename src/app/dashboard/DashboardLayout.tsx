// DashboardLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  full_name: string;
  email: string;
  subscription_status: 'trial' | 'active' | 'inactive'; // Asegura consistencia en los tipos
  trial_end?: string | null;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  profile: UserProfile;
  activeSection: 'chat' | 'history' | 'settings' | 'subscription';
}

export default function DashboardLayout({ children, profile, activeSection }: DashboardLayoutProps) {
  const pathname = usePathname(); // Detecta la ruta actual

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: '💬', href: '/dashboard/chat' },
    { id: 'history', label: 'Historial', icon: '📚', href: '/dashboard/history' },
    { id: 'settings', label: 'Configuración', icon: '⚙️', href: '/dashboard/settings' },
    { id: 'subscription', label: 'Suscripción', icon: '💳', href: '/dashboard/subscription' },
  ];

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r flex flex-col justify-between">
        <div>
          <div className="p-4 border-b">
            <h2 className="text-2xl font-bold text-blue-600">LegalIA</h2>
          </div>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link key={item.id} href={item.href}>
                <a
                  className={`flex items-center px-4 py-2 rounded-md transition ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </Link>
            ))}
          </nav>
        </div>
        {/* Estado de suscripción */}
        <div className="p-4 border-t bg-white">
          <div className="text-sm font-medium">Suscripción: {profile.subscription_status}</div>
          {profile.trial_end && (
            <div className="text-xs text-gray-500">Vence: {new Date(profile.trial_end).toLocaleDateString()}</div>
          )}
          <button
            onClick={() => alert('Cerrar sesión')}
            className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none"
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
