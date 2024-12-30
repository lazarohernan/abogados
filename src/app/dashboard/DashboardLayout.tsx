'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import WelcomePopup from '@/components/WelcomePopup';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DashboardLayoutProps {
  children: React.ReactNode;
  profile: any;
  activeSection: 'chat' | 'settings' | 'history' | 'subscription';
}

export default function DashboardLayout({ children, profile, activeSection }: DashboardLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: '💬', href: '/dashboard' },
    { id: 'history', label: 'Historial', icon: '📚', href: '/dashboard/history' },
    { id: 'settings', label: 'Configuración', icon: '⚙️', href: '/dashboard/settings' },
    { id: 'subscription', label: 'Suscripción', icon: '💳', href: '/dashboard/subscription' },
  ];

  const handleSignOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSidebarOpen && !(event.target as HTMLElement).closest('aside')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSidebarOpen]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 w-64 bg-white border-r transition-transform duration-200 ease-in-out z-30`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              LegalIA
            </Link>
          </div>

          {/* Perfil del usuario */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">{profile?.full_name?.charAt(0)}</span>
              </div>
              <div>
                <div className="font-medium">{profile?.full_name}</div>
                <div className="text-sm text-gray-500">{profile?.email}</div>
              </div>
            </div>
          </div>

          {/* Menú de navegación */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                aria-current={activeSection === item.id ? 'page' : undefined}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Botón de cerrar sesión */}
          <div className="p-4 border-t">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span>🚪</span>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <WelcomePopup />
        <button
          className="lg:hidden fixed bottom-4 right-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
        {children}
      </main>
    </div>
  );
}
