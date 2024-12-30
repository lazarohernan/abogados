'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

interface UserProfile {
  full_name: string;
  email: string;
  subscription_status: 'trial' | 'active' | 'inactive';
  trial_end?: string | null;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  profile: UserProfile;
  activeSection?: string; // Propiedad añadida
}

export default function DashboardLayout({ children, profile, activeSection }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: '💬', href: '/dashboard/chat' },
    { id: 'history', label: 'Historial', icon: '📚', href: '/dashboard/history' },
    { id: 'settings', label: 'Configuración', icon: '⚙️', href: '/dashboard/settings' },
    { id: 'subscription', label: 'Suscripción', icon: '💳', href: '/dashboard/subscription' },
  ];

  const handleSignOut = () => {
    // Aquí puedes agregar la lógica para cerrar sesión, por ejemplo:
    // await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 w-64 bg-white border-r shadow-lg transition-transform duration-200 ease-in-out z-30`}
      >
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-blue-600">LegalIA</h2>
              <p className="text-sm text-gray-500">Panel de control</p>
            </div>
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => (
                <Link key={item.id} href={item.href} passHref>
                  <div
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === item.id || pathname === item.href
                        ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t bg-white">
            <div className="text-sm font-medium text-gray-700">
              Suscripción: <span className="capitalize text-blue-600">{profile.subscription_status}</span>
            </div>
            {profile.trial_end && (
              <div className="text-xs text-gray-500 mt-1">
                Vence: {new Date(profile.trial_end).toLocaleDateString()}
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Botón para mostrar/ocultar el sidebar en móviles */}
        <button
          className="lg:hidden fixed bottom-4 right-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
        {children}
      </main>
    </div>
  );
}
