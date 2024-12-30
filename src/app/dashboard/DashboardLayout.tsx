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
  activeSection: string;
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
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold text-blue-600">LegalIA</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-md transition ${
                activeSection === item.id ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t mt-auto bg-gray-50">
          <p className="text-sm text-gray-600">Suscripción: <span className="font-medium">{profile.subscription_status}</span></p>
          {profile.trial_end && <p className="text-sm text-gray-600">Vence: {new Date(profile.trial_end).toLocaleDateString()}</p>}
        </div>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
