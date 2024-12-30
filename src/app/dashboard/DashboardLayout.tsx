'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  full_name: string;
  email: string;
  subscription_status: 'trial' | 'active' | 'inactive';
  trial_end?: string | null;
  avatar_url?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  profile: UserProfile;
  activeSection?: string;
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed inset-y-0 left-0 z-30 w-72 bg-white border-r
          transform transition-all duration-300 ease-in-out
          lg:relative lg:translate-x-0
          flex flex-col
          shadow-xl
        `}
      >
        {/* Logo y perfil */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-blue-600">
                  {profile.full_name[0]}
                </span>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{profile.full_name}</h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <div
                className={`
                  flex items-center px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${activeSection === item.id || pathname === item.href
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        {/* Footer con información de suscripción */}
        <div className="p-4 border-t space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-900">
              Estado de suscripción
            </div>
            <div className="mt-1">
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${profile.subscription_status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : profile.subscription_status === 'trial'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'}
              `}>
                {profile.subscription_status === 'active' ? 'Activa'
                  : profile.subscription_status === 'trial' ? 'Prueba'
                  : 'Inactiva'}
              </span>
            </div>
            {profile.trial_end && (
              <div className="text-xs text-gray-500 mt-2">
                Expira: {new Date(profile.trial_end).toLocaleDateString()}
              </div>
            )}
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 
                     text-red-600 bg-white border border-red-200 rounded-lg
                     hover:bg-red-50 transition-colors duration-200"
          >
            <span>🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <div className="p-6">
          {children}
        </div>
        
        {/* Botón móvil */}
        <button
          className="lg:hidden fixed bottom-6 right-6 z-40 
                     bg-blue-600 text-white p-3 rounded-full shadow-lg 
                     hover:bg-blue-700 transition-all duration-200
                     active:scale-95"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </main>
    </div>
  );
}
