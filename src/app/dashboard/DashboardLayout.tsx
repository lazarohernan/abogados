'use client';

import { useState, useCallback } from 'react';
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

export default function DashboardLayout({ children, profile, activeSection = 'chat' }: DashboardLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: '💬', href: '/dashboard' },
    { id: 'history', label: 'Historial', icon: '📚', href: '/dashboard/history' },
    { id: 'settings', label: 'Configuración', icon: '⚙️', href: '/dashboard/settings' },
    { id: 'subscription', label: 'Suscripción', icon: '💳', href: '/dashboard/subscription' }
  ];

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/login');
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed inset-y-0 left-0 w-64 bg-white border-r shadow-lg
        transform lg:translate-x-0 lg:static lg:inset-0
        transition duration-300 ease-in-out z-30
      `}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              LegalIA
            </Link>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {profile.full_name?.[0]}
                </span>
              </div>
              <div>
                <div className="font-medium">{profile.full_name}</div>
                <div className="text-sm text-gray-500">{profile.email}</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                  ${activeSection === item.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 
                      text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span>🚪</span>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {children}
        
        <button
          className="lg:hidden fixed bottom-4 right-4 z-40 bg-blue-600 text-white p-3 
                   rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </main>
    </div>
  );
}
