'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  profile: UserProfile;
  activeSection?: 'chat' | 'settings' | 'history' | 'subscription';
}

export default function DashboardLayout({ 
  children, 
  profile, 
  activeSection = 'chat' 
}: DashboardLayoutProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: '💬', href: '/dashboard' },
    { id: 'history', label: 'Historial', icon: '📚', href: '/dashboard/history' },
    { id: 'settings', label: 'Configuración', icon: '⚙️', href: '/dashboard/settings' },
    { id: 'subscription', label: 'Suscripción', icon: '💳', href: '/dashboard/subscription' }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Calculate trial status
  const trialEnd = profile.trial_end ? new Date(profile.trial_end) : null;
  const now = new Date();
  const isTrialActive = trialEnd ? trialEnd > now : false;
  const daysLeftInTrial = trialEnd 
    ? Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Show trial warning if less than 3 days left
  const showTrialWarning = isTrialActive && daysLeftInTrial <= 3;

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
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

          {/* User Profile Section */}
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

            {/* Subscription Status */}
            <div className="mt-3 text-sm">
              <div className={`inline-flex items-center px-2 py-1 rounded-full ${
                profile.subscription_status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : profile.subscription_status === 'trial'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                <span className="mr-1">•</span>
                {profile.subscription_status === 'active'
                  ? 'Suscripción activa'
                  : profile.subscription_status === 'trial'
                  ? `Periodo de prueba${isTrialActive ? ` (${daysLeftInTrial} días)` : ''}`
                  : 'Inactivo'}
              </div>
            </div>
          </div>

          {/* Trial Warning Banner */}
          {showTrialWarning && (
            <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-100">
              <div className="flex items-center text-sm text-yellow-800">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
                <span>
                  {daysLeftInTrial === 0
                    ? 'Tu periodo de prueba termina hoy'
                    : `Tu periodo de prueba termina en ${daysLeftInTrial} día${daysLeftInTrial === 1 ? '' : 's'}`}
                </span>
              </div>
              <Link
                href="/dashboard/subscription"
                className="mt-1 block text-sm text-yellow-800 hover:text-yellow-900 underline"
              >
                Actualizar a premium
              </Link>
            </div>
          )}

          {/* Navigation Menu */}
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

          {/* Sign Out Button */}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {children}
        
        {/* Mobile Menu Toggle */}
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