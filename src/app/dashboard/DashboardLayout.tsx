'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  full_name: string;
  email: string;
  subscription_status: 'trial' | 'active' | 'inactive';
  trial_end?: string | null;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  profile: UserProfile;
  activeSection?: 'chat' | 'settings' | 'history' | 'subscription';
}

const MENU_ITEMS = [
  { id: 'chat', label: 'Chat', icon: '💬', href: '/dashboard' },
  { id: 'history', label: 'Historial', icon: '📚', href: '/dashboard/history' },
  { id: 'settings', label: 'Configuración', icon: '⚙️', href: '/dashboard/settings' },
  { id: 'subscription', label: 'Suscripción', icon: '💳', href: '/dashboard/subscription' }
] as const;

export default function DashboardLayout({ 
  children, 
  profile, 
  activeSection = 'chat' 
}: DashboardLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        aria-label="Abrir/cerrar menú"
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed inset-y-0 left-0 w-64 bg-white border-r shadow-lg
        transform lg:translate-x-0 lg:static lg:inset-0
        transition-transform duration-300 ease-in-out z-30
      `}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
              LegalIA
            </Link>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xl">{profile.full_name[0]}</span>
              </div>
              <div>
                <p className="font-medium">{profile.full_name}</p>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {MENU_ITEMS.map(({ id, label, icon, href }) => (
                <li key={id}>
                  <Link
                    href={href}
                    className={`
                      flex items-center space-x-3 px-4 py-2 rounded-md transition
                      ${activeSection === id 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'hover:bg-gray-100'
                      }
                    `}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-md transition"
            >
              {isLoading ? 'Cerrando sesión...' : '🚪 Cerrar sesión'}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
