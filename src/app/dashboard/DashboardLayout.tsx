'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import UserProfile from '@/types/profile'; // Importa el tipo UserProfile

interface DashboardLayoutProps {
  children: React.ReactNode;
  profile: UserProfile; // Usa el tipo importado
  activeSection?: 'chat' | 'settings' | 'history' | 'subscription';
}

export default function DashboardLayout({
  children,
  profile,
  activeSection = 'chat',
}: DashboardLayoutProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: '💬', href: '/dashboard' },
    { id: 'history', label: 'Historial', icon: '📚', href: '/dashboard/history' },
    { id: 'settings', label: 'Configuración', icon: '⚙️', href: '/dashboard/settings' },
    { id: 'subscription', label: 'Suscripción', icon: '💳', href: '/dashboard/subscription' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const trialEnd = profile.trial_end ? new Date(profile.trial_end) : null;
  const now = new Date();
  const isTrialActive = trialEnd ? trialEnd > now : false;
  const daysLeftInTrial = trialEnd
    ? Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed inset-y-0 left-0 w-64 bg-white border-r shadow-lg
          transform lg:translate-x-0 lg:static lg:inset-0
          transition duration-300 ease-in-out z-30
        `}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              LegalIA
            </Link>
          </div>
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">{profile.full_name[0]}</span>
              </div>
              <div>
                <p className="font-medium">{profile.full_name}</p>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
            </div>
            <div className="mt-3 text-sm">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full ${
                  profile.subscription_status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : profile.subscription_status === 'trial'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {profile.subscription_status === 'active'
                  ? 'Suscripción Activa'
                  : profile.subscription_status === 'trial'
                  ? `Periodo de prueba (${daysLeftInTrial} días restantes)`
                  : 'Inactivo'}
              </span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-md ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t mt-auto">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:ml-64 overflow-hidden">
        {children}
        <button
          className="lg:hidden fixed bottom-4 right-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </main>
    </div>
  );
}
